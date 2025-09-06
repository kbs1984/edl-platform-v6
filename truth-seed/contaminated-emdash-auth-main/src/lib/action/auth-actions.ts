"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const confirm = formData.get("confirm")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) return encodedRedirect("error", "/sign-up", "Email and password are required");
  if (!confirm) return encodedRedirect("error", "/sign-up", "Password confirm is required");
  if (confirm !== password) return encodedRedirect("error", "/sign-up", "Password and password confirm should be the same");
  
  if (password.length < 10) return encodedRedirect("error", "/sign-up", "Password must be at least 10 characters long");
  if (!/[A-Za-z]/.test(password)) return encodedRedirect("error", "/sign-up", "Password must include at least one English letter");
  if (!/[0-9]/.test(password)) return encodedRedirect("error", "/sign-up", "Password must include at least one digit");
  const allowedSpecialCharRegex = /[!"#$%&'()*+,\-./:;<=>?@\[₩\]\^_`{\|}~]/;
  if (!allowedSpecialCharRegex.test(password)) return encodedRedirect("error", "/sign-up", "Password must include at least one allowed special character");
  const allowedCharsRegex = /^[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@\[₩\]\^_`{\|}~]+$/;
  if (!allowedCharsRegex.test(password)) return encodedRedirect("error", "/sign-up", "Password contains invalid characters or whitespace is not allowed");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return redirect("/thank-you");
  }
};

export const loginAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/login", error.message);
  }
  
  const cookieStore = await cookies();
  const tokens = cookieStore.getAll();

  // 토큰 루트페이지 전파
  tokens.forEach((token) => {
    cookieStore.set(token.name, token.value, {
      httpOnly: true,
      path: "/",
      domain: `.${process.env.ROOT_URL}`,
    });
  });

  return redirect(`http://${process.env.DASHBOARD_URL}`);
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password. It may take few minutes",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};
