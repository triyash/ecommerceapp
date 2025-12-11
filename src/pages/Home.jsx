import React, { useEffect, useState, useMemo } from "react";
import { fetchProducts, fetchCategories } from "../services/api";
import ProductCard from "../components/ProductCard";
import useLocalStorage from "../hooks/useLocalStorage";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("all");

  // cart
  const [cart, setCart] = useLocalStorage("cart", []);

  // fetch data
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [prods, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
        if (!mounted) return;
        setProducts(prods || []);
        setCategories(cats || []);
      } catch (e) {
        console.error("Failed to load products or categories", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  // debounce search -> update debouncedSearch 300ms after user stops typing
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // add to cart
  function handleAdd(product) {
    const idx = cart.findIndex((c) => c.id === product.id);
    let newCart = [...cart];
    if (idx === -1) newCart.push({ ...product, qty: 1 });
    else newCart[idx].qty = (newCart[idx].qty || 1) + 1;
    setCart(newCart);
    alert("Added to cart");
  }

  // derived filtered list (memoized)
  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === "all" || (p.category || "").toLowerCase() === category.toLowerCase();
      const matchesSearch =
        q === "" ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [products, debouncedSearch, category]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Search & Filters */}
      <div className="mb-6 grid sm:grid-cols-2 gap-4 items-center">
        <div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products (title or description)..."
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex gap-3 items-center">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearch("");
              setDebouncedSearch("");
              setCategory("all");
            }}
            className="bg-gray-200 px-3 py-1 rounded"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Results header */}
      <div className="mb-3 text-sm text-gray-600">
        Showing <strong>{filtered.length}</strong> of {products.length} products
        {debouncedSearch ? <> — search: “{debouncedSearch}”</> : null}
        {category !== "all" ? <> — category: {category}</> : null}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="p-4 bg-white rounded border">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((p) => (
            // reuse ProductCard but pass onAdd handler
            <div key={p.id} className="">
              <ProductCard p={p} onAdd={handleAdd} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
