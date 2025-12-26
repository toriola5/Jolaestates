import { useState } from "react";
import { supabase } from "../Utils/Supabase";
import { useEffect } from "react";

function useUpload() {
  const initialFormData = {
    title: "",
    propertyType: "",
    listingType: "",
    price: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    state: "",
    city: "",
    address: "",
    features: [],
    toilet: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [successful, setSuccessful] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(
    function () {
      const success = setTimeout(() => {
        setSuccessful(false);
      }, 3000);

      return () => clearTimeout(success);
    },
    [successful]
  );

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const propertyFeatures = [
    "Swimming Pool",
    "Gym",
    "Security",
    "Parking",
    "Garden",
    "Balcony",
    "Air Conditioning",
    "Furnished",
    "Serviced",
    "Pet Friendly",
    "Power Supply",
    "Water Supply",
    "Internet",
    "Elevator",
    "CCTV",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function uploadImageCloud(image) {
    if (!image) return null;

    try {
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
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  }

  async function uploadMultipleImages(images) {
    const uploadPromises = images.map((image) => uploadImageCloud(image));
    const urls = await Promise.all(uploadPromises);
    return urls.filter((url) => url !== null);
  }
  //Function adds or removes features from the features array in formData
  const handleFeatureToggle = (feature) => {
    setFormData({
      ...formData,
      features: formData.features.includes(feature)
        ? formData.features.filter((f) => f !== feature)
        : [...formData.features, feature],
    });
  };

  //
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError(null);

    try {
      // Validation checks
      if (!formData.title.trim()) {
        throw new Error("Property title is required");
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error("Valid price is required");
      }
      if (images.length === 0 && !isEditMode) {
        throw new Error("At least one image is required");
      }

      // Validate image sizes (max 5MB per image)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedImages = images.filter((img) => img.size > maxSize);
      if (oversizedImages.length > 0) {
        throw new Error(
          `Some images exceed 5MB limit. Please compress or choose smaller images.`
        );
      }

      // Validate image types
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      const invalidImages = images.filter(
        (img) => !validTypes.includes(img.type)
      );
      if (invalidImages.length > 0) {
        throw new Error("Only JPG, JPEG, PNG, and WebP images are allowed");
      }

      // Check authentication
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error(
          "Session expired. Please log in again and try uploading."
        );
      }

      console.log("Property data:", formData);
      console.log("Images:", images);

      // Upload images first with timeout protection
      const uploadPromise = uploadMultipleImages(images);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Image upload timeout after 60 seconds")),
          60000
        )
      );

      const imageUrls = await Promise.race([uploadPromise, timeoutPromise]);
      console.log("Uploaded image URLs:", imageUrls);

      if (imageUrls.length === 0 && images.length > 0) {
        throw new Error(
          "Failed to upload images. Check your internet connection and try again."
        );
      }

      // Prepare property data for database
      const propertyData = {
        title: formData.title.trim(),
        property_type: formData.propertyType,
        listing_type: formData.listingType,
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        size: formData.size ? parseFloat(formData.size) : null,
        state: formData.state,
        city: formData.city.trim(),
        address: formData.address.trim(),
        features: formData.features,
        images: imageUrls,
        created_at: new Date().toISOString(),
        status: "active",
        toilet: formData.toilet ? parseInt(formData.toilet) : null,
      };

      // Insert property into database with timeout
      const dbPromise = supabase
        .from("properties")
        .insert([propertyData])
        .select();

      const dbTimeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database operation timeout")), 30000)
      );

      const { data, error } = await Promise.race([dbPromise, dbTimeoutPromise]);

      if (error) {
        console.error("Error saving property:", error);

        // Handle specific error types
        if (error.code === "23505") {
          throw new Error("This property already exists in the database");
        } else if (error.code === "42501") {
          throw new Error("Permission denied. Please contact administrator");
        } else if (error.message.includes("JWT")) {
          throw new Error("Session expired. Please log in again");
        } else {
          throw new Error(`Failed to save property: ${error.message}`);
        }
      }

      console.log("Property saved successfully:", data);
      setSuccessful(true);
      setFormData(initialFormData);
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload property");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    formData,
    images,
    imagePreviews,
    nigerianStates,
    propertyFeatures,
    isUploading,
    uploadError,
    handleChange,
    handleFeatureToggle,
    handleImageUpload,
    removeImage,
    handleSubmit,
    successful,
    setUploadError,
    setFormData,
    setIsEditMode,
  };
}

export default useUpload;
