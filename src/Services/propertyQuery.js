import { supabase } from "../Utils/Supabase";

export async function queryPropertiesByID(id) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw error;
  }
  return data;
}

export async function updatePropertyByID(id, updatedData) {
  const { data, error } = await supabase
    .from("properties")
    .update(updatedData)
    .eq("id", id)
    .select();
  if (error) {
    throw error;
  }
  return data;
}

export async function uploadNewProperty(propertyData) {
  const { data, error } = await supabase
    .from("properties")
    .insert([propertyData])
    .select();
  if (error) {
    throw error;
  }
  return data;
}

export async function deletePropertyByID(id) {
  const { data, error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    throw error;
  }
  return data;
}
export async function queryAdminProperties(from, to) {
  const { data, error } = await supabase
    .from("properties")
    .select(
      "id, title, property_type, listing_type, price, state, city, bedrooms, bathrooms, toilet, status, created_at"
    )
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) {
    throw error;
  }
  return data;
}

export async function getTotalPropertiesCount() {
  const { count, error } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });
  if (error) {
    throw error;
  }
  return count;
}
