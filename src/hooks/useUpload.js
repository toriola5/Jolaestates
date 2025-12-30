import { useMemo, useState } from "react";
import { supabase } from "../Utils/Supabase";
import { updatePropertyByID } from "../Services/propertyQuery";
import { AdminContext } from "../Contexts/AdminProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImageCloud } from "../Services/imageUpload";
import { nigerianStates, propertyFeatures } from "../Utils/constants";
import { preparePropertyData as prepareFormData } from "../Utils/helper";

function useUpload() {
  const { dispatch } = useContext(AdminContext);
  const navigate = useNavigate();
  const initialFormData = useMemo(
    () => ({
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
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);

  //effect would clear the success message after 3 seconds

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

      const preparedData = prepareFormData(formData);
      /*Property data includes images and created_at because they are not part of formData 
      the function would also be used in the editform upload */
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

      const { data, error } = await Promise.race([dbPromise, dbTimeoutPromise]);

      if (error) {
        switch (error.code) {
          case "23505":
            throw new Error("This property already exists in the database");
          case "42501":
            throw new Error("Permission denied. Please contact administrator");
          default:
            if (error.message.includes("JWT")) {
              throw new Error("Session expired. Please log in again");
            } else {
              throw new Error(`Failed to save property: ${error.message}`);
            }
        }
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned from database after insertion");
      }

      // Handle specific error types

      console.log("Property saved successfully:", data);
      setFormData(initialFormData);
      setImages([]);
      setImagePreviews([]);
      dispatch({
        type: "SET_MESSAGE",
        payload: { message: "Property uploaded successfully", type: "success" },
      });
      navigate("/admin/properties");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload property");
    } finally {
      setIsUploading(false);
    }
  };

  async function handleEditUpload(e, id) {
    e.preventDefault();
    const preparedData = prepareFormData(formData, true); // true for edit mode
    const propertyData = {
      ...preparedData,
      updated_at: new Date().toISOString(),
    };
    try {
      const data = await updatePropertyByID(id, propertyData);
      setFormData(data[0]);
      dispatch({
        type: "SET_MESSAGE",
        payload: {
          message: "Property edited successfully!",
          type: "success",
        },
      });
      navigate("/admin/properties");
    } catch (error) {
      console.error("Error updating property:", error);
      setUploadError(error.message || "Failed to update property details.");
    }
  }

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
    setUploadError,
    setFormData,
    setIsEditMode,
    initialFormData,
    prepareFormData,
    handleEditUpload,
  };
}

export default useUpload;
