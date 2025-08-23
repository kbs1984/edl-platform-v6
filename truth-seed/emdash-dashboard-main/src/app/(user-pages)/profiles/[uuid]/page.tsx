export default async function Page({
  params,
}: Readonly<{
  params: Promise<{
    uuid: string;
  }>;
}>) {
  const { uuid } = await params;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      <p>UUID: {uuid}</p>
    </div>
  );
}