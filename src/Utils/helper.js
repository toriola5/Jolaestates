import { supabase } from "./Supabase";
export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Prepare property data for database operations
export const preparePropertyData = (formData, isEdit = false) => {
  const baseData = {
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
    status: "active",
    toilet: formData.toilet ? parseInt(formData.toilet) : null,
  };

  if (isEdit) {
    baseData.updated_at = new Date().toISOString();
  } else {
    baseData.created_at = new Date().toISOString();
  }

  return baseData;
};

// Generic property fetch with pagination and filters
export const fetchPropertiesWithPagination = async (options = {}) => {
  const {
    currentPage = 1,
    itemsPerPage = 10,
    filters = {},
    includeInactive = false,
    selectFields = "*",
  } = options;

  // Build base query for counting
  let countQuery = supabase
    .from("properties")
    .select("*", { count: "exact", head: true });

  if (!includeInactive) {
    countQuery = countQuery.eq("status", "active");
  }

  // Apply filters to count query
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "all") {
      countQuery = countQuery.eq(key, value);
    }
  });

  // Get total count
  const { count } = await countQuery;

  // Build data query with pagination
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let dataQuery = supabase
    .from("properties")
    .select(selectFields)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (!includeInactive) {
    dataQuery = dataQuery.eq("status", "active");
  }

  // Apply filters to data query
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "all") {
      dataQuery = dataQuery.eq(key, value);
    }
  });

  const { data, error } = await dataQuery;

  if (error) throw error;

  return {
    properties: data || [],
    totalCount: count || 0,
    currentPage,
    totalPages: Math.ceil((count || 0) / itemsPerPage),
  };
};

export const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];
  const maxVisiblePages = 5;

  // Logic for displaying page numbers with ellipses
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }
  }

  return pages;
};
