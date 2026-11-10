import React from 'react'
import LogoComponent from './LogoComponent';
import { LogoData } from '@/types/dataType';
interface LogoScrollParams{
        logos: LogoData[];
        direction: 'left' | 'right';
        dark: boolean | undefined;
}
const LogoScroller: React.FC<LogoScrollParams> = ({ logos, direction, dark }) => {
    // Duplicate the logos array 3 times to ensure seamless infinite loop
    const duplicatedLogos = [...logos, ...logos, ...logos];
    const isMuted = true; // Always muted for Featured By section

    return (
        // Wrapper to hide the overflow
        <div className="overflow-hidden w-full relative">
            {/* The inner container that scrolls, w-max makes it as wide as all content */}
            <div className={`flex w-max ${direction === 'left' ? 'scroller-left' : 'scroller-right'}`}>
                {duplicatedLogos.map((logo, index) => (
                    // Key is combined with index to ensure uniqueness after duplication
                    <LogoComponent key={`${logo.id}-${index}`} logo={logo} isMuted={isMuted} dark={dark} />
                ))}
            </div>
        </div>
    );
};

export default LogoScroller