import { useMemo, useState, useEffect, useRef } from "react";
import { nigerianStates, propertyFeatures } from "../Utils/constants";
import { preparePropertyData as prepareFormData } from "../Utils/helper";

function useUpload() {
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const imagePreviewsRef = useRef([]);

  // Update ref whenever imagePreviews changes
  useEffect(() => {
    imagePreviewsRef.current = imagePreviews;
  }, [imagePreviews]);

  // Cleanup blob URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      imagePreviewsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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
    // Clean up the blob URL to prevent memory leaks
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  return {
    formData,
    images,
    imagePreviews,
    nigerianStates,
    propertyFeatures,
    handleChange,
    handleFeatureToggle,
    handleImageUpload,
    removeImage,
    setFormData,
    initialFormData,
    prepareFormData,
    isEditMode,
    setIsEditMode,
    uploadError,
    setUploadError,
  };
}

export default useUpload;
