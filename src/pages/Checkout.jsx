import React, { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useLocalStorage("cart", []);
  const [orders, setOrders] = useLocalStorage("orders", []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const total = cart.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);

  function placeOrder(e) {
    e?.preventDefault();
    if (!name || !address || cart.length === 0) {
      alert("Please enter name, address and make sure cart is not empty.");
      return;
    }

    const order = {
      id: Date.now(),
      name,
      email,
      phone,
      address,
      items: cart,
      total: Number(total.toFixed(2)),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // save order (prepend so admin sees newest first)
    setOrders([order, ...orders]);

    // clear cart
    setCart([]);

    // feedback + redirect to order success / admin or home
    alert("Order placed successfully!");
    navigate("/"); // go to home (or use /order-success if you create a page)
  }

  if (cart.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <div className="p-4 bg-white border rounded">Your cart is empty.</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <form className="p-4 bg-white border rounded" onSubmit={placeOrder}>
          <h2 className="font-semibold mb-2">Contact & Shipping</h2>

          <input
            className="w-full border p-2 mb-2"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border p-2 mb-2"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border p-2 mb-2"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <textarea
            className="w-full border p-2 mb-2"
            rows="4"
            placeholder="Shipping address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>

          <div className="mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Place Order — ${total.toFixed(2)}
            </button>
          </div>
        </form>

        <div className="p-4 bg-white border rounded">
          <h2 className="font-semibold mb-2">Order Summary</h2>

          <div className="space-y-3">
            {cart.map((it) => (
              <div key={it.id} className="flex items-center gap-3">
                <img src={it.image} alt={it.title} className="w-16 h-16 object-contain" />
                <div className="flex-1">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm text-gray-600">Qty: {it.qty || 1}</div>
                </div>
                <div className="font-semibold">${((it.price * (it.qty || 1)) || 0).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 font-bold text-lg">Total: ${total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
