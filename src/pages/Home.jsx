import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import ProductCard from "../components/ProductCard";
import useLocalStorage from "../hooks/useLocalStorage";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useLocalStorage("cart", []);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleAdd(product) {
    const idx = cart.findIndex((c) => c.id === product.id);
    let newCart = [...cart];
    if (idx === -1) newCart.push({ ...product, qty: 1 });
    else {
      newCart[idx].qty = (newCart[idx].qty || 1) + 1;
    }
    setCart(newCart);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} p={p} onAdd={handleAdd} />
        ))}
      </div>
    </div>
  );
}
