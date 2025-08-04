// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "dgkjtbpxw",
  UPLOAD_PRESET: "profile_images", // Cloudinary's default preset for testing
  API_KEY: "757446383197323",
  API_SECRET: "pgu42vxtU8tqXdy53wFFs0vQYX8", // Keep this secure - don't expose in client code
};

// Cloudinary upload function (unsigned upload with preset)
export const uploadImageToCloudinary = async (
  imageUri: string,
  folder: string = "profile-images"
): Promise<string> => {
  try {
    const formData = new FormData();
    
    // Add the image file
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `profile-image-${Date.now()}.jpg`,
    } as any);
    
    // Unsigned upload with preset
    formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);
    formData.append('folder', folder);

    console.log("🔄 Uploading to Cloudinary...");
    console.log("Cloud Name:", CLOUDINARY_CONFIG.CLOUD_NAME);
    console.log("Upload Preset:", CLOUDINARY_CONFIG.UPLOAD_PRESET);
    console.log("Folder:", folder);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.log("❌ Error response:", errorData);
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json();
    console.log("📦 Response data:", data);
    
    if (data.error) {
      throw new Error(`Cloudinary error: ${data.error.message}`);
    }
    
    if (data.secure_url) {
      console.log("✅ Image uploaded to Cloudinary:", data.secure_url);
      return data.secure_url;
    } else {
      throw new Error('No secure URL returned from Cloudinary');
    }
  } catch (error: any) {
    console.error("❌ Cloudinary upload failed:", error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// Helper function to extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string | null => {
  try {
    const regex = new RegExp(`https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/(?:v\\d+/)?(.+)`);
    const match = url.match(regex);
    return match ? match[1].split('.')[0] : null;
  } catch {
    return null;
  }
};

// Helper function to generate optimized URL
export const getOptimizedImageUrl = (
  publicId: string,
  width: number = 400,
  height: number = 400,
  quality: string = 'auto'
): string => {
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload/w_${width},h_${height},c_fill,q_${quality},f_auto/${publicId}`;
};
