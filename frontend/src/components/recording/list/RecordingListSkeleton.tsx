const SKELETON_CARD_COUNT = 4;

export default function RecordingListSkeleton() {
  return (
    <div
      className="space-y-6 animate-rsm-fade"
      role="status"
      aria-label="Memuat daftar rekaman"
    >
      <div className="space-y-4">
        <div className="rsm-skeleton h-4 w-32 rounded-full" />
        <div className="rsm-skeleton h-10 w-2/3 rounded-xl sm:w-1/2" />
        <div className="rsm-skeleton h-4 w-full max-w-md rounded-lg" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="rsm-skeleton h-4 w-28 rounded-full" />
        <div className="rsm-skeleton h-10 w-full max-w-xs rounded-full" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
          <div
            key={`recording-skeleton-${index}`}
            className="flex items-start gap-4 rounded-2xl border border-(--rsm-line)] bg-(--rsm-card)] px-5 py-4"
          >
            <div className="hidden pt-1 sm:block">
              <div className="rsm-skeleton h-4 w-6 rounded-full" />
            </div>

            <div className="flex-1 space-y-3">
              <div className="rsm-skeleton h-5 w-2/3 rounded-lg" />
              <div className="rsm-skeleton h-3.5 w-1/2 rounded-full" />
            </div>

            <div className="rsm-skeleton h-6 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
