import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct } from "../services/api";
import useLocalStorage from "../hooks/useLocalStorage";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [cart, setCart] = useLocalStorage("cart", []);

  useEffect(() => {
    fetchProduct(id).then(setP);
  }, [id]);

  function addToCart() {
    if (!p) return;
    const idx = cart.findIndex((c) => c.id === p.id);
    let newCart = [...cart];
    if (idx === -1) newCart.push({ ...p, qty: 1 });
    else newCart[idx].qty = (newCart[idx].qty || 1) + 1;
    setCart(newCart);
    alert("Added to cart");
  }

  if (!p) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <img className="w-full object-contain h-80" src={p.image} alt={p.title} />
      <div>
        <h2 className="text-2xl font-bold">{p.title}</h2>
        <p className="mt-2">{p.description}</p>
        <div className="mt-4 font-bold text-xl">${p.price}</div>
        <button onClick={addToCart} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Add to cart</button>
      </div>
    </div>
  );
}
