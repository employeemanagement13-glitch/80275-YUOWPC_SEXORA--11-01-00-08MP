import BeAPartSection from "@/Components/pathway/BeAPart"
import Culture from "@/Components/pathway/Culture"
import PathwaySection from "@/Components/pathway/PathwaySection"
import WhyJoinUsSection from "@/Components/pathway/WhyJoinUs"
const page = () => {
  return (
    <div className='h-fit w-full box-border p-0 m-0'>
        <PathwaySection />
        <BeAPartSection/>
        <Culture/>
        <WhyJoinUsSection />
    </div>
  )
}

export default page