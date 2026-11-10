import React from 'react'
import { LogoGroupSectionProps } from '@/types/dataType';
import LogoComponent from '../SubComponents/home/LogoComponent';
import SectionHeader from '../SubComponents/SectionHeader';
const TrustedClients: React.FC<LogoGroupSectionProps> = ({ group }) => {
    // Trusted clients are not muted/grayscale
    const isMuted = false;

    return (
        <div className="text-center pt-16 md:pt-24 pb-16">
            {(group.subtitle !== undefined) ? <SectionHeader title={`${group.title}`} subtitle={`${group.subtitle} ` || ""} className='text-[#454648]' subtitleClassName='brightheadingpara' /> : <SectionHeader title={`${group.title}`} subtitle="" className='text-[#454648]' subtitleClassName='brightheadingpara' />
            }

            {/* Logo Grid */}
            <div className="flex justify-center items-center flex-wrap gap-x-2 gap-y-8 max-w-5xl mx-auto filter saturate-150">
                {group.logos.map(logo => (
                    // Uses the text-based path of LogoComponent
                    <LogoComponent key={logo.id} logo={logo} pathway={group.pathway} isMuted={isMuted} />
                ))}
            </div>
        </div>
    );
};

export default TrustedClients