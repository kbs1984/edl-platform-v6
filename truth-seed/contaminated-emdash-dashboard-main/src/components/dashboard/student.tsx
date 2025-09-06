import { Copy, Handshake, LucideIcon, Scale, UsersRound } from "lucide-react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Profile, Student } from "@/types"
import { getLevelFromExp, requiredExpForLevel } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { ChallengeEnableToggle } from "./challenge-enable-toggle"
import { Username } from "./username"

export const StudentDashboard = ({ profile, student }: { profile: Profile, student: Student }) => {
  const { level, exp } = getLevelFromExp(student.exp);

  return (
    <div className="grid-cols-6 gap-4 grid px-10 py-5 lg:grid-cols-12">
      <Card className="col-span-6 flex p-4 gap-4 flex-col justify-between h-64">
        <div className="flex flex-col items-start justify-between md:flex-row">
          <div className="flex gap-4 items-center">
            <div>
              <Image src={profile.image_path!} className="rounded-full border border-secondary" alt={""} width={100} height={100} />
            </div>
            <div>
              <div className="text-2xl font-bold"> {profile.name} </div>
              <div className="flex items-center mt-2">
                <Username username={profile.username!} />
              </div>
              <div> {profile.email} </div>
            </div>
          </div>
          <div>
            {/* <div> {student.ranking} </div> */}
            <div> <ChallengeEnableToggle student={student} /></div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pl-5 pr-2">
            <div> Lv. {level} </div>
            <div> {exp} / {requiredExpForLevel(level + 1)} </div>
          </div>
          <div className="pl-4">
            <Progress value={exp} max={requiredExpForLevel(level + 1)} />
          </div>
        </div>
      </Card>
      <Card className="col-span-3 flex p-4">
        <div> Messages </div>
        <div>
          
        </div>
      </Card>
      <Card className="col-span-3 flex flex-col p-4">
        <div> Notifications </div> {/* Invites, etc. */}
        <div>

        </div>
      </Card>
      <Card className="col-span-8 flex p-4 h-64">
        <div> Upcoming Debates </div>
        <div>

        </div>
      </Card>
      <Card className="col-span-4 flex p-4">
        <div> Recent Activity </div>
        <div>

        </div>
      </Card>
      <Card className="col-span-4 p-4 h-64">
        <div className="ml-2"> Rules </div>
        <div className="mt-4 flex flex-col gap-2">
          <RuleButton title="Rules of Engagement" Icon={Handshake} />
          <RuleButton title="Team Roles" Icon={UsersRound} />
          <RuleButton title="Judge Ballot" Icon={Scale} />
        </div>
      </Card>
      <Card className="col-span-4 flex p-4 h-64">
        <div> Recent Debate Motions </div>
        <div>

        </div>
      </Card>
      <Card className="col-span-4 flex p-4 h-64">
        <div> {student.division} division Rankings </div>
        <div>

        </div>
      </Card>
    </div>
  )
}

const RuleButton = ({ title, Icon }: { title: string, Icon: LucideIcon }) => {
  return (
    <div className="w-full border border-secondary rounded-md px-4 py-3 cursor-pointer hover:bg-secondary-foreground/20 flex items-center text-sm">
      <Icon className="w-6 h-6 inline mr-2" />
      {title}
    </div>
  )
}