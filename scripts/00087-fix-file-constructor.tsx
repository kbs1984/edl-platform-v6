// Session 00087: Fix for File Constructor Issue in Onboarding Step 2
// 
// The problem: Node.js 18 doesn't have File constructor globally available
// It's experimental in Node 18 and requires import from 'buffer'
//
// Solution: Skip the File creation for existing images (not needed for display)
// Only create File objects for new uploads from user input
//
// REPLACE the useEffect in:
// truth-seed/emdash-dashboard-main/src/components/onboarding-step-2-form.tsx
// Starting at line 44

  // handle initial image setting
  useEffect(() => {
    if (!profile.image_path) return

    // SESSION 00087 FIX: Don't try to create File from existing image
    // Just set the preview URL directly
    setImagePreview(profile.image_path)
    
    // We don't need to create a File object for existing images
    // The File is only needed for NEW uploads
    // If user doesn't change image, we'll handle that in submit
  }, [profile.image_path])

// ALSO UPDATE the handleSubmit function (around line 135) to handle optional imageFile:

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // SESSION 00087 FIX: Make imageFile optional for users with existing images
    if (
      formData.name === "" ||
      formData.username === "" ||
      formData.gender === "" ||
      !formData.dateOfBirth
      // Remove the imageFile requirement - it's optional if user has existing image
    ) {
      return alert("Please fill in all required fields");
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("username", formData.username);
    data.append("gender", formData.gender);
    data.append("dateOfBirth", formData.dateOfBirth.toISOString());
    
    // SESSION 00087 FIX: Only append imageFile if user uploaded a new one
    if (formData.imageFile) {
      data.append("imageFile", formData.imageFile);
    }

    const result = await UploadUserInfoAction(data);

    if (result.success) return router.push("/onboarding/step-3");

    alert(result.message);
    setIsSubmitting(false);
  }