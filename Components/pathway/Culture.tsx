"use client"
import ImageSlider from '../SubComponents/ImageSlider';
import { cultureImages } from '@/lib/data'
const infiniteScrollStyles = `
  /* Keyframes for Leftward Scroll */
  @keyframes scrollLeft {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  /* Keyframes for Rightward Scroll */
  @keyframes scrollRight {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }

  /* Base classes for the scrolling container */
  .scroller-left {
    animation: scrollLeft 40s linear infinite;
  }
  .scroller-right {
    animation: scrollRight 40s linear infinite;
  }
`;
const Culture = () => {
    return (
        <ImageSlider title='Culture & Lifestyle' des='Experience a vibrant work culture that celebrates creativity, collaboration, and milestones through unforgettable moments.' group={cultureImages} dark={true} />
    )
}

export default Culture