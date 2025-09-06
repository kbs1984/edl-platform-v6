// Stub component - Session 180
export function TeamListSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200 rounded" />;
}

export function TeamDetailSkeleton() {
  return <div className="animate-pulse h-40 bg-gray-200 rounded" />;
}

// Session 180: Add missing export
export function TeamPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="animate-pulse h-20 bg-gray-200 rounded" />
      <div className="animate-pulse h-40 bg-gray-200 rounded" />
      <div className="animate-pulse h-32 bg-gray-200 rounded" />
    </div>
  );
}
