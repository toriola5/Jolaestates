import styles from "./PropertyUpload.module.css";
import useUpload from "../../hooks/useUpload";
import Loading from "../../ui/Loading";
import ErrorMsg from "../../ui/ErrorMsg";
import { useEffect } from "react";
import { useActionData, useParams } from "react-router-dom";
import { queryPropertiesByID } from "../../Services/propertyQuery";
import { Form, useNavigation } from "react-router-dom";

//TODO : Sanitize and validate form inputs before submission.

function PropertyUpload({ isEditMode = false }) {
  const { propertyId } = useParams();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const message = useActionData();

  // Use URL param first, then context id as fallback
  const id = propertyId;
  const {
    formData,
    nigerianStates,
    propertyFeatures,
    handleFeatureToggle,
    handleImageUpload,
    imagePreviews,
    removeImage,
    uploadError,
    setUploadError,
    setFormData,
    setIsEditMode,
    initialFormData,
  } = useUpload();

  useEffect(() => {
    setIsEditMode(isEditMode);
    if (!isEditMode) {
      // Reset form for new upload
      setFormData(initialFormData);
    }
  }, [isEditMode, setIsEditMode, setFormData, initialFormData]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await queryPropertiesByID(id);
        setFormData({
          ...data,
          propertyType: data.property_type,
          listingType: data.listing_type,
        });
      } catch (error) {
        console.error("Error fetching property:", error);
        setUploadError(
          error.message || "Failed to fetch property details for editing."
        );
      }
    };

    if (isEditMode) {
      fetchProperty();
    }
  }, [id, isEditMode, setFormData, setUploadError]); // Now uses the combined id

  if (uploadError)
    return (
      <ErrorMsg message={uploadError} setError={() => setUploadError(null)} />
    );
  return (
    <div className={styles.uploadContainer}>
      {message?.submitError && (
        <p className={styles.errorMessage}>{` ** ${message.submitError}`}</p>
      )}
      <div className={styles.uploadContent}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>
              {isEditMode ? "Edit Property" : "Upload Property"}
            </h2>
            <p className={styles.subtitle}>
              {isEditMode
                ? "Edit property listing"
                : "Add a new property listing"}
            </p>
          </div>
        </div>

        <Form
          method="POST"
          action={
            isEditMode ? `/admin/edit-property/${id}` : "/admin/upload-property"
          }
          className={styles.uploadForm}
          encType="multipart/form-data"
        >
          <input type="hidden" name="propertyId" value={id || ""} />

          {/* Basic Information */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Basic Information</h3>

            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                Property Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                defaultValue={formData.title}
                // onChange={handleChange}
                required
                className={styles.input}
                placeholder="e.g., Luxury 3 Bedroom Apartment"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="propertyType" className={styles.label}>
                  Property Type *
                </label>
                <select
                  id="propertyType"
                  name="propertyType"
                  defaultValue={formData.propertyType}
                  // onChange={handleChange}
                  required
                  className={styles.select}
                  key={formData.propertyType}
                >
                  <option value="">Select Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Bungalow">Bungalow</option>
                  <option value="Mansion">Mansion</option>
                  <option value="Land">Land</option>
                  <option value="Commercial">Commercial Property</option>
                  <option value="Office Space">Office Space</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="listingType" className={styles.label}>
                  Listing Type *
                </label>
                <select
                  id="listingType"
                  name="listingType"
                  // value={formData.listingType}
                  defaultValue={formData.listingType}
                  // onChange={handleChange}
                  required
                  className={styles.select}
                  key={formData.listingType}
                >
                  <option value="">Select Type</option>
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                  <option value="Shortlet">Shortlet</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                Price (₦) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                // value={formData.price}
                defaultValue={formData.price}
                // onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter price in Naira"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={formData.description}
                // value={formData.description}
                // onChange={handleChange}
                required
                className={styles.textarea}
                placeholder="Describe the property..."
                rows="5"
              />
            </div>
          </div>

          {/* Property Details */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Property Details</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="bedrooms" className={styles.label}>
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  defaultValue={formData.bedrooms}
                  // value={formData.bedrooms}
                  // onChange={handleChange}
                  className={styles.input}
                  placeholder="Number of bedrooms"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="toilet" className={styles.label}>
                  Toilets
                </label>
                <input
                  type="number"
                  id="toilet"
                  name="toilet"
                  defaultValue={formData.toilet}
                  // value={formData.toilet}
                  // onChange={handleChange}
                  className={styles.input}
                  placeholder="Number of toilets"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bathrooms" className={styles.label}>
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  defaultValue={formData.bathrooms}
                  // value={formData.bathrooms}
                  // onChange={handleChange}
                  className={styles.input}
                  placeholder="Number of bathrooms"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="size" className={styles.label}>
                  Size (sqm)
                </label>
                <input
                  type="number"
                  id="size"
                  name="size"
                  defaultValue={formData.size}
                  // value={formData.size}
                  // onChange={handleChange}
                  className={styles.input}
                  placeholder="Size in square meters"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Location (Nigeria)</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="state" className={styles.label}>
                  State *
                </label>
                <select
                  key={formData.state}
                  id="state"
                  name="state"
                  defaultValue={formData.state}
                  // value={formData.state}
                  // onChange={handleChange}
                  required
                  className={styles.select}
                >
                  <option value="">Select State</option>
                  {nigerianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="city" className={styles.label}>
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={formData.city}
                  // value={formData.city}
                  // onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.label}>
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                defaultValue={formData.address}
                // value={formData.address}
                // onChange={handleChange}
                required
                className={styles.input}
                placeholder="Enter full address"
              />
            </div>
          </div>

          {/* Features */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Features & Amenities</h3>
            <div className={styles.featuresGrid}>
              {propertyFeatures.map((feature) => (
                <label key={feature} className={styles.featureLabel}>
                  <input
                    type="checkbox"
                    name="features"
                    checked={formData.features.includes(feature)}
                    value={feature}
                    onChange={() => handleFeatureToggle(feature)}
                    className={styles.checkbox}
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          {!isEditMode && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Property Images</h3>

              <div className={styles.imageUpload}>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                />
                <label htmlFor="images" className={styles.fileLabel}>
                  <span>📸</span>
                  <span>Click to upload images</span>
                  <span className={styles.fileHint}>
                    Upload multiple images
                  </span>
                </label>
                {message?.imageError && (
                  <p
                    className={styles.errorMessage}
                  >{` ** ${message.imageError}`}</p>
                )}
              </div>

              {imagePreviews.length > 0 && (
                <div className={styles.imagePreviewGrid}>
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className={styles.imagePreview}>
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className={styles.removeImage}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isEditMode ? null : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.submitButton}
            >
              {isSubmitting ? "Uploading..." : "Upload Property"}
            </button>
          )}
          {isEditMode ? (
            <button
              disabled={isSubmitting}
              // onClick={(e) => handleEditUpload(e, id)}
              className={styles.submitButton}
            >
              {isSubmitting ? "Editing..." : "Edit Property"}
            </button>
          ) : null}
        </Form>
      </div>
    </div>
  );
}

export default PropertyUpload;
