// Stub component - Session 180
export function TeamHeader({ team }: any) {
  return (
    <div className="border-b pb-4">
      <h1 className="text-2xl font-bold">{team?.name || 'Team'}</h1>
      <p className="text-gray-600">{team?.description || 'Team header coming soon'}</p>
    </div>
  );
}