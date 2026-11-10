export default function ProductsLoading() {
  return (
    <div className="w-[80vw] max-md:w-full mx-auto mt-20 px-4 py-8 animate-pulse text-[#454648]">
      {/* Title Placeholder */}
      <div className="w-48 h-10 bg-neutral-200 rounded mx-auto mb-6" />

      {/* Searchbar Placeholder */}
      <div className="w-full h-12 bg-neutral-200 rounded-xl mb-6" />

      {/* Categories Placeholder */}
      <div className="flex gap-3 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-24 h-10 bg-neutral-200 rounded-lg" />
        ))}
      </div>

      {/* Product Cards Grid Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-5 bg-[#f6f6f6] border border-[#eaeaea] rounded-xl space-y-4">
            <div className="w-full h-48 bg-neutral-200 rounded-xl" />
            <div className="w-28 h-4 bg-neutral-200 rounded" />
            <div className="w-3/4 h-6 bg-neutral-200 rounded" />
            <div className="w-full h-12 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

