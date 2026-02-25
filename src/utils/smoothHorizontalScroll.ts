/**
 * Creates a smooth horizontal scroller using requestAnimationFrame
 * Maps vertical wheel/touch to horizontal scroll with interpolation
 */
export function createSmoothHorizontalScroller(container: HTMLElement) {
    let target = container.scrollLeft;
    let current = container.scrollLeft;
    const ease = 0.12; // Adjust for snappier (higher) vs smoother (lower)
    let rafId: number;

    function lerp(a: number, b: number, t: number) {
        return a + (b - a) * t;
    }

    // Auto-scroll state
    let isAutoScrolling = false;
    let autoScrollStartTime = 0;
    let autoScrollStartPos = 0;
    let autoScrollTargetPos = 0;
    let autoScrollDuration = 0;

    function easeInOutCubic(t: number): number {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Helper: returns true if event target is inside a section that should
    // always keep its own vertical scroll (e.g. portfolio page on desktop)
    function isInVerticalFirstZone(element: HTMLElement | null): boolean {
        if (!element) return false;
        // Any element inside the portfolio section should keep native vertical scroll.
        if (element.closest('.portfolio-section')) return true;
        return false;
    }

    // Wheel handler - non-passive so we can preventDefault
    // Helper to check if element or its parents can scroll vertically
    function isScrollable(element: HTMLElement | null, direction: number): boolean {
        if (!element || element === container || element.contains(container)) return false;

        const style = window.getComputedStyle(element);
        const overflowY = style.overflowY;
        const isScrollableY = overflowY === 'auto' || overflowY === 'scroll';
        const canScroll = element.scrollHeight > element.clientHeight;

        if (isScrollableY && canScroll) {
            // Check if we're at the boundary
            const atTop = element.scrollTop <= 0;
            const atBottom = Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 1;

            if (direction < 0 && !atTop) return true; // Scrolling up and not at top
            if (direction > 0 && !atBottom) return true; // Scrolling down and not at bottom
        }

        return isScrollable(element.parentElement, direction);
    }

    // Wheel handler - non-passive so we can preventDefault
    function onWheel(e: WheelEvent) {
        const targetEl = e.target as HTMLElement | null;

        // Desktop: inside a "vertical-first" zone (like the portfolio) we:
        // 1. Let the inner area consume wheel events while it *can* scroll vertically.
        // 2. As soon as it hits its top/bottom, we fall back to horizontal scrolling
        //    so the main rail can continue moving and you don't get "stuck" there.
        if (window.innerWidth >= 1024 && isInVerticalFirstZone(targetEl)) {
            if (isScrollable(targetEl, e.deltaY)) {
                return; // Inner portfolio content still scrolls → don't hijack.
            }
            // At the vertical boundary → allow the horizontal rail to take over
            // by *not* returning here and letting the rest of the handler run.
        } else {
            // Outside vertical-first zones, respect any other vertically scrollable
            // elements (e.g. modals, dropdowns) before we intercept the wheel.
            if (isScrollable(targetEl, e.deltaY)) {
                return; // Let native scroll happen
            }
        }

        // Cancel auto-scroll on user interaction
        if (isAutoScrolling) {
            isAutoScrolling = false;
            target = current; // Sync target to current so no jump
        }

        // Let native horizontal scroll pass through if it's strictly a horizontal swipe/trackpad
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            return;
        }

        // Map vertical wheel to horizontal scroll
        if (Math.abs(e.deltaY) > 0) {
            e.preventDefault();
            target += e.deltaY;
            // Clamp target to valid scroll range
            const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
            target = Math.max(0, Math.min(maxScroll, target));

            // Safety fallback if it becomes NaN
            if (isNaN(target)) target = 0;
        }
    }

    // Touch handlers for mobile page transition
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartScrollLeft = 0;
    let touchActive = false;
    let touchCancelled = false;
    let touchHasScrollableAncestor = false;

    // Helper: does this element or any parent (up to container) scroll vertically?
    function hasVerticalScrollableAncestor(el: HTMLElement | null): boolean {
        if (!el || el === container) return false;

        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        const canScrollY =
            (overflowY === 'auto' || overflowY === 'scroll') &&
            el.scrollHeight > el.clientHeight;

        if (canScrollY) return true;
        return hasVerticalScrollableAncestor(el.parentElement);
    }

    function onTouchStart(e: TouchEvent) {
        if (window.innerWidth > 768) return;

        const targetEl = e.target as HTMLElement | null;
        // We no longer cancel immediately when starting on a scrollable area.
        // Instead, we remember it and decide in onTouchMove based on gesture
        // direction (vertical vs horizontal).
        touchHasScrollableAncestor = !!(targetEl && hasVerticalScrollableAncestor(targetEl));

        // Cancel any auto-scroll when user starts interacting.
        if (isAutoScrolling) {
            isAutoScrolling = false;
            target = container.scrollLeft;
            current = container.scrollLeft;
        }

        touchActive = true;
        touchCancelled = false;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartScrollLeft = container.scrollLeft;
    }

    function onTouchMove(e: TouchEvent) {
        if (window.innerWidth > 768) return;
        if (!touchActive || touchCancelled) return;

        const moveX = e.touches[0].clientX;
        const moveY = e.touches[0].clientY;

        const xDiff = touchStartX - moveX;
        const yDiff = touchStartY - moveY;

        const absX = Math.abs(xDiff);
        const absY = Math.abs(yDiff);

        // If the gesture becomes primarily vertical *and* started over a
        // vertically scrollable region, cancel horizontal snapping so the
        // inner content can scroll naturally.
        if (touchHasScrollableAncestor && absY > absX && absY > 10) {
            touchCancelled = true;
            return;
        }

        // If the gesture is clearly horizontal, prevent the browser from
        // trying to do vertical/bounce scrolling that fights our snapping.
        if (absX > absY && absX > 10) {
            e.preventDefault();
        }
    }

    function onTouchEnd(e: TouchEvent) {
        if (window.innerWidth > 768) return;
        if (!touchActive || touchCancelled) {
            touchActive = false;
            return;
        }

        touchActive = false;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const xDiff = touchStartX - touchEndX;
        const yDiff = touchStartY - touchEndY;

        // Require a mostly-horizontal swipe and a minimum distance
        if (!(Math.abs(xDiff) > Math.abs(yDiff) && Math.abs(xDiff) > 40)) {
            return;
        }

        const sectionWidth = container.clientWidth || 1;

        // Base index on where the gesture started so the movement is predictable.
        const startIndex = Math.round(touchStartScrollLeft / sectionWidth);
        let nextIndex = startIndex;

        if (xDiff > 0) {
            // Swiped left → next page
            nextIndex = startIndex + 1;
        } else {
            // Swiped right → previous page
            nextIndex = startIndex - 1;
        }

        const maxIndex = Math.max(
            0,
            Math.round((container.scrollWidth - container.clientWidth) / sectionWidth)
        );
        nextIndex = Math.max(0, Math.min(nextIndex, maxIndex));

        const targetPos = nextIndex * sectionWidth;
        // Smoothly scroll to the target page index (800ms duration)
        scrollTo(targetPos, false, 800);
    }

    // RAF loop for smooth interpolation
    function update(timestamp: number) {
        // Ensure bounds are always respected even if container size changes (e.g. resize, flex children loading)
        if (container.clientWidth > 0 && container.scrollWidth > 0) {
            const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
            target = Math.max(0, Math.min(maxScroll, target));
            if (isNaN(target)) {
                target = 0;
            }
        }

        const actualScrollLeft = container.scrollLeft;

        // If the browser changed the scroll position natively (e.g. trackpad swipe, touch swipe)
        // Sync our internal state so we don't fight it.
        if (!isAutoScrolling && Math.abs(actualScrollLeft - Math.round(current)) > 1) {
            target = actualScrollLeft;
            current = actualScrollLeft;
        }

        if (isAutoScrolling) {
            const elapsed = timestamp - autoScrollStartTime;
            const progress = Math.min(elapsed / autoScrollDuration, 1);
            const easeProgress = easeInOutCubic(progress);

            current = autoScrollStartPos + (autoScrollTargetPos - autoScrollStartPos) * easeProgress;

            if (progress >= 1) {
                isAutoScrolling = false;
                target = current; // Sync target to end position
            }
            container.scrollLeft = Math.round(current);
        } else {
            if (Math.abs(target - current) > 0.5) {
                current = lerp(current, target, ease);
                container.scrollLeft = Math.round(current);
            } else {
                current = target;
                if (Math.round(current) !== actualScrollLeft) {
                    container.scrollLeft = Math.round(current);
                }
            }
        }

        rafId = requestAnimationFrame(update);
    }

    // Start RAF loop
    rafId = requestAnimationFrame(update);

    function onResize() {
        const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
        target = Math.min(maxScroll, target);
        current = Math.min(maxScroll, current);
        container.scrollLeft = Math.round(current);
    }

    // Attach listeners (passive: false for preventDefault)
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('touchstart', onTouchStart, { passive: true });
    // touchmove MUST be non-passive so we can preventDefault()
    // when we detect a strong horizontal swipe.
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('resize', onResize);

    // Expose scrollTo control
    function scrollTo(position: number, immediate = false, duration = 1000) {
        const constrainedPos = Math.max(0, Math.min(container.scrollWidth - container.clientWidth, position));

        if (immediate) {
            isAutoScrolling = false;
            target = constrainedPos;
            current = constrainedPos;
            container.scrollLeft = constrainedPos;
        } else {
            isAutoScrolling = true;
            autoScrollStartTime = performance.now();
            autoScrollStartPos = current;
            autoScrollTargetPos = constrainedPos;
            autoScrollDuration = duration;
            // Also update target so if auto-scroll is cancelled, we don't jump back far
            // Actually, we update target on cancellation.
        }
    }

    // Cleanup function
    const cleanup = () => {
        cancelAnimationFrame(rafId);
        container.removeEventListener('wheel', onWheel);
        container.removeEventListener('touchstart', onTouchStart);
        container.removeEventListener('touchmove', onTouchMove);
        container.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('resize', onResize);
    };

    return { cleanup, scrollTo };
}

// Export target/current for external access (e.g., for mascot sync)
export function getScrollState(container: HTMLElement) {
    return {
        current: container.scrollLeft,
        max: container.scrollWidth - container.clientWidth
    };
}
