import axios from "axios";
const API_BASE = "https://fakestoreapi.com";

export async function fetchProducts() {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
}

export async function fetchProduct(id) {
  const res = await axios.get(`${API_BASE}/products/${id}`);
  return res.data;
}


export async function fetchCategories() {
  const res = await axios.get(`${API_BASE}/products/categories`);

  return res.data;
}
