import React, { useState } from 'react';
import clsx from 'clsx';

interface InteractiveVideoProps {
    children: React.ReactNode;
    className?: string;
}

const InteractiveVideo: React.FC<InteractiveVideoProps> = ({ children, className }) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div
            className={clsx("relative w-full h-full", className)}
            onMouseLeave={() => setIsActive(false)}
        >
            {/* 
        The overlay captures pointer events (like wheel for scrolling) 
        until the user clicks on it to interact with the video.
      */}
            {!isActive && (
                <div
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={() => setIsActive(true)}
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
