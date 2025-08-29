import { Card } from "@/components/ui/card";
import { Tab } from "@/components/ui/tabs";

export default async function InfoPage({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const tab = (await searchParams)?.tab || 'general';
  const items = [
    { title: "Personal Information", link: "/settings" },
    { title: "School Information", link: "/settings?tab=school" },
    { title: "Guardian Information", link: "/settings?tab=guardian" },
    { title: "Login & Password", link: "/settings?tab=password" },
  ]
  return (
    <>
      <div className="flex flex-col pt-32 items-center justify-start w-full h-full">
        <Tab items={items} />
        <Card className="w-full max-w-4xl p-4 mt-4 h-96">
        </Card>
      </div>
    </>
  );
}