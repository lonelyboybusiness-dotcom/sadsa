import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

interface InteractiveVideoProps {
    children: React.ReactNode;
    className?: string;
}

const InteractiveVideo: React.FC<InteractiveVideoProps> = ({ children, className }) => {
    const [isActive, setIsActive] = useState(false);
    const [isCoarsePointer, setIsCoarsePointer] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'matchMedia' in window) {
            try {
                const mq = window.matchMedia('(pointer: coarse)');
                setIsCoarsePointer(mq.matches);
            } catch {
                setIsCoarsePointer(false);
            }
        }
    }, []);

    // On touch devices, we keep a transparent overlay above the video so that
    // horizontal swipe gestures still reach the horizontal scroller container
    // instead of being swallowed entirely by the YouTube iframe. On desktop,
    // we preserve the existing "click to activate video controls" behavior.
    const showOverlay = isCoarsePointer ? true : !isActive;

    return (
        <div
            className={clsx("relative w-full h-full", className)}
            onMouseLeave={() => setIsActive(false)}
        >
            {/* 
        The overlay captures pointer events (like wheel for scrolling) 
        until the user clicks on it to interact with the video.
      */}
            {showOverlay && (
                <div
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={!isCoarsePointer ? () => setIsActive(true) : undefined}
                    // Ensure touch gestures are captured here so they bubble up
                    // to the horizontal scroller instead of being eaten by the iframe.
                    style={isCoarsePointer ? { touchAction: 'none' } : undefined}
                    title="Click to interact with video"
                />
            )}
            <div className="w-full h-full relative z-0">
                {children}
            </div>
        </div>
    );
};

export default InteractiveVideo;
