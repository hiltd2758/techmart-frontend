
const Brand = () => {
  return (
    <div className="w-full min-h-[200px] bg-white pt-5">
      <div className="lg:container mx-auto">
        <div className="w-full min-h-[200px] flex items-center justify-between gap-8">
          {/* brand wrapper */}
          <div className="cursor-pointer">
            <img src="/brands/brand_1.png" alt="Apple - Leading technology brand" />
          </div>
          <div className="cursor-pointer">
            <img src="/brands/brand_2.png" alt="Samsung - Smartphones and electronics" />
          </div>
          <div className="cursor-pointer">
            <img src="/brands/brand_3.png" alt="Dell - Laptops and computers" />
          </div>
          <div className="cursor-pointer">
            <img src="/brands/brand_4.png" alt="Asus - Gaming laptops and components" />
          </div>
          <div className="cursor-pointer">
            <img src="/brands/brand_5.png" alt="Sony - Audio devices and headphones" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brand;