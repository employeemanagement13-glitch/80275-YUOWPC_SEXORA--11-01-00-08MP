export default function ProductDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-20 animate-pulse text-[#454648]">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl bg-neutral-200" />
        <div className="space-y-2">
          <div className="w-24 h-4 bg-neutral-200 rounded" />
          <div className="w-64 h-10 bg-neutral-200 rounded" />
        </div>
      </div>

      {/* Tagline Skeleton */}
      <div className="w-3/4 max-w-2xl h-6 bg-neutral-200 rounded mb-8" />

      {/* Hero Media Skeleton */}
      <div className="w-full h-80 rounded-2xl bg-neutral-200 mb-12" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-[#f6f6f6] rounded-xl border border-[#eaeaea] space-y-2 text-center">
            <div className="w-16 h-8 bg-neutral-200 rounded mx-auto" />
            <div className="w-24 h-4 bg-neutral-200 rounded mx-auto" />
          </div>
        ))}
      </div>

      {/* Two Column Problem / Solution Skeleton */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="p-8 bg-[#f6f6f6] rounded-xl border border-[#eaeaea] space-y-3">
          <div className="w-32 h-6 bg-neutral-200 rounded mb-4" />
          <div className="w-full h-4 bg-neutral-200 rounded" />
          <div className="w-5/6 h-4 bg-neutral-200 rounded" />
          <div className="w-4/6 h-4 bg-neutral-200 rounded" />
        </div>
        <div className="p-8 bg-[#f6f6f6] rounded-xl border border-[#eaeaea] space-y-3">
          <div className="w-32 h-6 bg-neutral-200 rounded mb-4" />
          <div className="w-full h-4 bg-neutral-200 rounded" />
          <div className="w-5/6 h-4 bg-neutral-200 rounded" />
          <div className="w-4/6 h-4 bg-neutral-200 rounded" />
        </div>
      </div>

      {/* Features Skeleton */}
      <div className="mb-16">
        <div className="w-40 h-8 bg-neutral-200 rounded mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-[#f6f6f6] rounded-xl border border-[#eaeaea] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-200" />
              <div className="w-32 h-5 bg-neutral-200 rounded" />
              <div className="w-full h-4 bg-neutral-200 rounded" />
              <div className="w-4/5 h-4 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

