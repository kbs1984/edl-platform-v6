"use client";

import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export const SocialLoginButton = ({ type }: { type: "Google" | "Kakao"}) => {
  const router = useRouter();

  const handleLogin = (type: "Google" | "Kakao") => {
    const supabase = createClient();
  
    let error = null;
    supabase.auth.signInWithOAuth({
      provider: type.toLowerCase() as "google" | "kakao",
      options: {
        redirectTo: `${window.origin}/auth/callback`,
      }
    }).then((res) => {
      if (res.error) error = res.error.code as string;
    });
  
    if (error) {
      router.push(`/login?error=${encodeURIComponent(error)}`);
    }
  }

  let buttonStyle;
  switch (type) {
    case "Kakao":
      buttonStyle = "border-[#FEE500] bg-[#FEE500] text-background";
      break;
    case "Google":
      buttonStyle = "border-[#8e8e8e] bg-white text-background";
      break;
  }

  return (
    <button type="submit" className={`relative flex center cursor-pointer w-full h-14 pl-8 border-[1.5px] border-solid rounded-md hover:brightness-90 transition duration-300 ${buttonStyle}`} onClick={() => handleLogin(type)}>
      <div className="absolute w-5 h-5 left-[30%] top-1/2 -translate-1/2">
        <Image src={`/icons/${type.toLowerCase()}_icon.svg`} alt={""} fill />
      </div>
      <div>
        Continue with {type}
      </div>
    </button>
  );
}