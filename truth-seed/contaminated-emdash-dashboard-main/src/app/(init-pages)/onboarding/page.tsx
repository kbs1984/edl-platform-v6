import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Steps } from "@/components/ui/steps";
import { Award, MessageSquare, Users } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <form className="w-full">
      <Steps current={-1} steps={["Step 1", "Step 2", "Step 3"]} />
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold tracking-tight">
          Welcome to <span className="text-primary">Emdash Debate</span>
        </CardTitle>
        <CardDescription className="text-gray-300 text-lg mt-2">
          Embrace critical thinking, master communication, and join a community of passionate debaters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8" />}
            title="Structured Debates"
            description="Engage in formal debates with clear rules and formats"
          />
          <FeatureCard
            icon={<Award className="h-8 w-8" />}
            title="Skill Development"
            description="Improve your critical thinking and persuasive speaking"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Community"
            description="Connect with like-minded debaters from around the world"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-4">
        <Link href={"/onboarding/step-1"}>
          <Button variant={"primary"} size="lg">
            Start Onboarding
          </Button>
        </Link>
      </CardFooter>
    </form>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg border border-foreground bg-card/50">
      <div className="mb-3">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  )
}

