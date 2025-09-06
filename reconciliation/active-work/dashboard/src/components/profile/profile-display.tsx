// Stub component - Session 180
export function ProfileDisplay({ profile }: any) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{profile?.name || 'User Profile'}</h1>
      <p className="text-gray-600 mt-2">{profile?.bio || 'Profile display coming soon'}</p>
    </div>
  );
}