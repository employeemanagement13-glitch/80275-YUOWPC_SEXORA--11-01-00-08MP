import SectionHeader from './SectionHeader'
import LogoScroller from './home/LogoScroller'
import { LogoData } from '@/types/dataType'
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

interface SliderData {
  dark?: boolean;
  group: LogoData[];
  title: string;
  des: string;
}

const ImageSlider = ({group, title, des, dark}: SliderData) => {
    const row1Logos = group.slice(0, 4);
    const row2Logos = group.slice(4);
  return (
            <div className='py-16 md:py-24'>
            <style dangerouslySetInnerHTML={{ __html: infiniteScrollStyles }} />
            <div className="text-center pt-16 md:pt-24 pb-16">
                <SectionHeader title={title} subtitle={des} className="text-[#454648]" subtitleClassName="brightheadingpara" />
                <div className="space-y-8">
                    {/* Row 1: Scrolling Left */}
                    <LogoScroller logos={row1Logos} direction="left" dark={dark} />
                    {/* Row 2: Scrolling Right */}
                    <LogoScroller logos={row2Logos} direction="right" dark={dark} />
                </div>
            </div>
        </div>
  )
}

export default ImageSlider