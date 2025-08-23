import { Card } from "@/components/ui/card";
import { getProfile } from "@/utils/get-user-info";
import { redirect } from "next/navigation";

export default async function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();
  if (profile.active) redirect("/");
  return (
    <div className="w-full pt-52">
      <Card className="flex flex-col min-w-64 max-w-2xl mx-auto center w-[90%] py-10 bg-card/60 shadow-2xl">
        {children}
      </Card>
    </div>
  );
}
