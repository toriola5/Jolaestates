import { useState } from "react";
import { supabase } from "../Utils/Supabase";

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
  };

  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

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
      console.log("Property data:", formData);
      console.log("Images:", images);

      // Upload images first
      const imageUrls = await uploadMultipleImages(images);
      console.log("Uploaded image URLs:", imageUrls);

      if (imageUrls.length === 0 && images.length > 0) {
        throw new Error("Failed to upload images");
      }

      // Prepare property data for database
      const propertyData = {
        title: formData.title,
        property_type: formData.propertyType,
        listing_type: formData.listingType,
        price: parseFloat(formData.price),
        description: formData.description,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        size: formData.size ? parseFloat(formData.size) : null,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        features: formData.features,
        images: imageUrls,
        created_at: new Date().toISOString(),
        status: "active",
      };

      // Insert property into database
      const { data, error } = await supabase
        .from("properties")
        .insert([propertyData])
        .select();

      if (error) {
        console.error("Error saving property:", error);
        throw new Error(`Failed to save property: ${error.message}`);
      }

      console.log("Property saved successfully:", data);
      alert("Property uploaded successfully!");
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
  };
}

export default useUpload;
