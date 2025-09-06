import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { stringFromBase64URL } from "@supabase/ssr";
import Link from "next/link";
import { redirect } from "next/navigation";

// 1. 역할 및 상태별 메세지 정보를 객체 형태로 정리
//    가령 role=student & query=true 이면 "student.noGuardian"으로 매핑,
//    role=student & query!=true 이면 "student.hasGuardian"으로 매핑
//    역할에 따라 judge, guardian도 각각 key를 만들어 관리합니다.
const cardMessages = {
  student: {
    noGuardian: {
      header: "You’re Almost Ready!",
      paragraphs: [
        `Your profile setup is complete, and you now have basic access to our platform. 
         To fully participate in debates, please add your Guardian email in Profile Settings.`,
        `In the meantime, feel free to read existing discussions and get familiar with our community.
         We look forward to hearing your insights once you’re fully set up!`,
      ],
    },
    hasGuardian: {
      header: "You’re All Set!",
      paragraphs: [
        `Your profile setup is complete, and you now have full access to our debate platform.
         Feel free to explore existing discussions, create new topics, and connect with fellow members.`,
        `Welcome aboard, and enjoy your debates!`,
      ],
    },
  },
  guardian: {
    header: "Welcome, Guardian!",
    paragraphs: [
      `Your Guardian profile is ready. You can now oversee your student's debate activities on our platform.
       Thank you for ensuring a safe and supportive environment for everyone.`,
      `Please stay updated with our guidelines and feel free to reach out if you have any questions.
       We appreciate your involvement in nurturing a respectful debate community!`,
    ],
  },
  judge: {
    header: "Welcome, Judge!",
    paragraphs: [
      `Your account is fully set up. As a judge, you can moderate debates, evaluate arguments, and provide feedback.`,
      `We value your fair judgment and expertise. Be sure to review our scoring criteria and guidelines
       for a smooth and impartial judging experience. Thank you for joining us!`,
    ],
  },
  default: {
    header: "Welcome!",
    paragraphs: [
      `Your profile setup seems to be complete, but we couldn’t identify your role.
       Please contact support if you believe this is an error.`,
    ],
  },
};

// 2. 역할 및 query 값을 바탕으로 cardMessages 객체에서 적절한 텍스트를 추출하는 함수
function getCardContent(role: string, query?: string) {
  if (role === "student") {
    // Guardian 메일 미등록 상태(query === "true") vs. 등록 상태
    if (query === "true") {
      return cardMessages.student.noGuardian;
    } else {
      return cardMessages.student.hasGuardian;
    }
  } else if (role === "guardian") {
    return cardMessages.guardian;
  } else if (role === "judge") {
    return cardMessages.judge;
  }
  // 그 외에는 default
  return cardMessages.default;
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = (await searchParams)!;

  let role: string, query: string | undefined;
  try {
    role = stringFromBase64URL(params.type as string);
    if (params.query) {
      query = stringFromBase64URL(params.query as string);
    }
  } catch {
    // URL 파라미터가 이상할 경우 홈으로 리다이렉트
    redirect("/");
  }

  // 3. 추출한 role, query 값을 바탕으로 해당하는 메시지 가져오기
  const { header, paragraphs } = getCardContent(role, query);

  return (
    <div className="w-full pt-52">
      <Card className="flex flex-col min-w-64 max-w-xl mx-auto center w-[90%] py-5 bg-card/80 shadow-2xl">
        {/* 4. 헤더 및 본문 내용 렌더링 */}
        <CardHeader className="text-xl">{header}</CardHeader>
        <CardContent className="space-y-4 indent-2 max-w-lg leading-7">
          {paragraphs.map((text, idx) => (
            <p key={idx}>{text}</p>
          ))}
        </CardContent>
        <CardFooter className="mt-4">
          <Link href={"/"}>
            <Button>Go to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
