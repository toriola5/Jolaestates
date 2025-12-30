import { supabase } from "../Utils/Supabase";

export async function uploadImageCloud(image) {
  if (!image) return null;

  const fileExt = image.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`; // Remove 'properties/' folder prefix

  // Try uploading without subfolder first
  const { error } = await supabase.storage
    .from("Jayeolaestates") // Use exact case as in your Supabase
    .upload(filePath, image, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    console.error("Error uploading image:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw error;
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("Jayeolaestates").getPublicUrl(filePath);

  console.log("Upload successful. Public URL:", publicUrl);
  return publicUrl;
}
