const BAR_HEIGHTS = [38, 62, 48, 80, 55, 92, 44, 70, 58, 86, 40, 66, 50, 78];

export default function DetailSkeleton() {
  return (
    <div
      className="space-y-8 animate-rsm-fade"
      role="status"
      aria-label="Memuat detail rekaman"
    >
      <div className="space-y-8">
        <div className="rsm-skeleton h-9 w-44 rounded-full" />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rsm-skeleton h-6 w-40 rounded-full" />
            <div className="rsm-skeleton h-6 w-24 rounded-full" />
          </div>

          <div className="rsm-skeleton h-12 w-3/4 rounded-xl" />
          
          <div className="rsm-skeleton h-5 w-1/2 rounded-lg" />
        </div>

        <div className="rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] px-5 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="rsm-skeleton h-3 w-32 rounded-full" />
            <div className="rsm-skeleton h-3 w-12 rounded-full" />
          </div>

          <div className="flex h-20 items-end gap-0.75">
            {BAR_HEIGHTS.map((height, index) => (
              <div
                key={`placeholder-${index}`}
                className="rsm-skeleton flex-1 rounded-full"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rsm-skeleton h-72 rounded-2xl lg:col-span-2" />
        <div className="rsm-skeleton h-96 rounded-2xl lg:col-span-3" />
      </div>

      <div className="rsm-skeleton h-36 rounded-2xl" />
    </div>
  );
}
