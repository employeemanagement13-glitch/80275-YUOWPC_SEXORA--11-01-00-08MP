import React from 'react'


// --- 2. CallToActionButton Component ---
interface CallToActionButtonProps {
    text: string;
    href: string;
    className?: string;
}

const CallToActionButton: React.FC<CallToActionButtonProps> = ({ text, href, className = "" }) => {
    return (
        <a href={href} className={`inline-block ${className}`}>
            <button className={`
        px-10 py-4 
        rounded-xl 
        buttonstyles
        tracking-wide
      `}>
                {text}
            </button>
        </a>
    );
};

export default CallToActionButton