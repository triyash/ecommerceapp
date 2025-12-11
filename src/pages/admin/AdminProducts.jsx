import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../services/api";

function getStorage() {
  try {
    const raw = localStorage.getItem("admin_products");
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  // init admin products from FakeStore if not present
  useEffect(() => {
    const stored = getStorage();
    if (stored && stored.length) {
      setProducts(stored);
      setLoading(false);
    } else {
      fetchProducts().then(data => {
        localStorage.setItem("admin_products", JSON.stringify(data));
        setProducts(data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, []);

  function saveAll(newList) {
    setProducts(newList);
    localStorage.setItem("admin_products", JSON.stringify(newList));
  }

  function addProduct() {
    const id = Date.now();
    const newP = { id, title, price: parseFloat(price) || 0, image: "https://via.placeholder.com/150" };
    const newList = [newP, ...products];
    saveAll(newList);
    setTitle(""); setPrice("");
  }

  function removeProduct(id) {
    const newList = products.filter(p => p.id !== id);
    saveAll(newList);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Products (Admin)</h2>

      <div className="mb-4 p-3 bg-white rounded border">
        <h3 className="font-semibold mb-2">Add new product</h3>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="border p-2 mr-2" />
        <input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" className="border p-2 mr-2 w-24" />
        <button onClick={addProduct} className="bg-green-600 text-white px-3 py-1 rounded">Add</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="p-3 bg-white border rounded">
            <img src={p.image} alt={p.title} className="h-32 object-contain mx-auto" />
            <div className="mt-2 font-semibold">{p.title}</div>
            <div>${p.price}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => removeProduct(p.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
