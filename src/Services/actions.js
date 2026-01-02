import { collection, addDoc } from "firebase/firestore";
import { db } from "../Utils/firebase.js";
import { preparePropertyData } from "../Utils/helper.js";
import { uploadImageCloud } from "./imageUpload.js";
import { supabase } from "../Utils/Supabase.js";
import { redirect } from "react-router-dom";
import { updatePropertyByID } from "./propertyQuery.js";

//function to upload multiple messages used in UploadProperty action
async function uploadMultipleImages(images) {
  const uploadPromises = images.map((image) => uploadImageCloud(image));
  const urls = await Promise.all(uploadPromises);
  return urls.filter((url) => url !== null);
}

export async function uploadReview({ request }) {
  console.log("Action triggered!"); // Debug log

  const formData = await request.formData();
  const reviewData = Object.fromEntries(formData);

  const errorMessages = {};
  // Validate required fields
  if (reviewData.rating === "0") {
    errorMessages.ratingerror = "Please provide a rating.";
    return errorMessages;
  }

  await addDoc(collection(db, "Comments"), {
    fullname: reviewData.fullName,
    rating: Number(reviewData.rating),
    review: reviewData.comments,
    salutation: reviewData.title,
  }).catch((error) => {
    console.error("Error adding document: ", error);
    errorMessages.submiterror = "Failed to submit review. Please try again.";
    return errorMessages;
  });
  console.log("Review submitted successfully:", reviewData);
  return { success: true };
}

export async function UploadProperty({ request }) {
  const errorMessages = {};
  try {
    const formData = await request.formData();
    // Get the uploaded images
    const images = formData.getAll("images");
    console.log("Number of images uploaded:", images.length);

    const sortedData = {};
    for (const [key, value] of formData.entries()) {
      if (key !== "images" && key !== "features") {
        sortedData[key] = value;
      }
    }

    // Handle features separately to get all selected values
    const features = formData.getAll("features");
    sortedData.features = features;

    const propertyId = formData.get("propertyId");
    const datatoedit = preparePropertyData(sortedData);
    console.log("Prepared Data for Edit:", datatoedit);
    console.log("Features Array:", features);
    console.log("Property ID:", propertyId);
    if (propertyId && propertyId.trim() !== "") {
      try {
        await updatePropertyByID(propertyId, datatoedit);
      } catch (error) {
        console.error("Error updating property:", error);
        errorMessages.submitError =
          "Failed to update property. Please try again.";
        return errorMessages;
      }
      return redirect("/admin/properties/2");
    }

    // Process each image
    const maxSize = 5 * 1024 * 1024; // 5MB size limit per image
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    // Filter out empty file objects
    const actualImages = images.filter(
      (img) => img instanceof File && img.size > 0
    );

    if (actualImages.length === 0) {
      errorMessages.imageError = "At least one image is required";
      return errorMessages;
    }

    const invalidImages = actualImages.filter(
      (img) => !validTypes.includes(img.type)
    );
    if (invalidImages.length > 0) {
      errorMessages.imageError =
        "Only JPG, JPEG, PNG, and WebP images are allowed";
      return errorMessages;
    }

    if (actualImages.some((img) => img.size > maxSize)) {
      errorMessages.imageError =
        "Some images exceed 5MB limit. Please compress or choose smaller images.";
      return errorMessages;
    }

    const uploadPromise = uploadMultipleImages(actualImages);
    // Set a timeout for image uploads for 1minute (60000 ms)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Image upload timeout after 60 seconds")),
        60000
      )
    );
    const imageUrls = await Promise.race([uploadPromise, timeoutPromise]);

    if (imageUrls.length === 0 && actualImages.length > 0) {
      errorMessages.imageError = "Failed to upload images. Please try again.";
      return errorMessages;
    }

    console.log("Uploaded image URLs:", imageUrls);

    // Get other form data (excluding images)

    const preparedData = preparePropertyData(sortedData);
    const propertyData = {
      ...preparedData,
      images: imageUrls,
      created_at: new Date().toISOString(),
    };
    // Insert property into database with timeout
    const dbPromise = supabase
      .from("properties")
      .insert([propertyData])
      .select();

    const dbTimeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database operation timeout")), 30000)
    );

    const { error } = await Promise.race([dbPromise, dbTimeoutPromise]);

    if (error) {
      console.error("Error inserting property into database:", error);
      errorMessages.submitError =
        "Failed to upload property. Please try again.";
      return errorMessages;
    }

    console.log("Property Data (without images):", sortedData);
    console.log("Images to process:", images.length);
    return redirect("/admin/properties/1");
  } catch (error) {
    console.error("Error processing property upload:", error);

    if (error.message.includes("timeout")) {
      return {
        error:
          "Upload timeout. Please try again with smaller images or check your internet connection.",
      };
    }
    return { error: "Failed to upload property. Please try again." };
  }
}

export async function loginAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("Login attempt for email:", email);
  console.log("Password length:", password);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const errorMessages = {};

  if (!email || !password) {
    errorMessages.formerror = "Email and password are required.";
    return errorMessages;
  }

  if (error) {
    console.error("Login error:", error);
    errorMessages.formerror =
      error.message || "Failed to sign in. Please check your credentials.";
    return errorMessages;
  }
  return redirect("/admin/properties/1");
}
