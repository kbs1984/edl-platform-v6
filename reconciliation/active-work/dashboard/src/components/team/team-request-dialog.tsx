// Stub component - Session 180
export function TeamRequestDialog({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold">Team Request</h2>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">Close</button>
      </div>
    </div>
  );
}
