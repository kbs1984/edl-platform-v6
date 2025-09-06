"use server";

import { createServerClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid"

export async function UploadUserInfoAction(formData: FormData) {
  const supabase = await createServerClient();

  try {
    const { data: { user: user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const name = formData.get("name")?.toString()
    const username = formData.get("username")?.toString()
    const gender = formData.get("gender")?.toString()
    const dateString = formData.get("dateOfBirth")?.toString()
    const dateOfBirth = dateString ? new Date(dateString) : null
    const imageFile = formData.get("imageFile");

    let imageUrl: string | null = null;
    if (imageFile && imageFile instanceof File) {
      // 고유 파일명 생성 (파일명 앞에 uuid를 붙임)
      const type = imageFile.name.split(".").pop();
      const filePath = `${user.id}/${uuidv4()}.${type}`;
      
      // Supabase Storage의 'profile-images' 버킷에 원래 존재하는 이미지 삭제후 이미지 업로드
      const { data: existingFiles, error: listError } = await supabase
        .storage
        .from("profile-images")
        .list(user.id, {
          limit: 100,
          offset: 0
        });

      if (listError) throw new Error(`Error listing existing images: ${listError.message}`);

      if (existingFiles && existingFiles.length > 0) {
        const filePathsToDelete = existingFiles.map((file) => `${user.id}/${file.name}`);
        const { error: removeError, data: data } = await supabase
          .storage
          .from("profile-images")
          .remove(filePathsToDelete);

        if (removeError) {
          throw new Error(`Error removing existing images: ${removeError.message}`);
        }
      }

      const { error: uploadError } = await supabase
        .storage
        .from("profile-images")
        .upload(filePath, imageFile);
      
      if (uploadError) throw new Error(`Image upload error: ${uploadError.message}`);
      
      const { data: publicData } = supabase
        .storage
        .from("profile-images")
        .getPublicUrl(filePath);
      
      imageUrl = publicData.publicUrl;
    }

    const { error: dbError } = await supabase
      .from("profile")
      .update({
        name: name,
        username: username,
        gender: gender,
        date_of_birth: dateOfBirth,
        image_path: imageUrl
      })
      .eq('id', user.id);

    if (dbError) throw new Error(`DB insert error: ${dbError.message}`)

    return {
      success: true,
      message: "User info saved successfully!"
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Something went wrong"
    }
  }
}