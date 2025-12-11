import React, { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cart, setCart] = useLocalStorage("cart", []);
  const [orders, setOrders] = useLocalStorage("orders", []);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  // calculate total
  const total = cart.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);

  function placeOrder(e) {
    e.preventDefault();

    if (!name || !address) {
      alert("Please fill your name and address.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    // New order object
    const newOrder = {
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

    // Save order to localStorage
    setOrders([newOrder, ...orders]);

    // Clear the cart
    setCart([]);

    alert("Order placed successfully!");

    // Redirect home (or to success page)
    navigate("/");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Checkout Form */}
        <form className="p-4 bg-white border rounded" onSubmit={placeOrder}>
          <h2 className="font-semibold mb-2">Shipping Details</h2>

          <input
            className="w-full border p-2 mb-2"
            placeholder="Full Name"
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
            placeholder="Shipping Address"
            rows="4"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded mt-3 w-full"
          >
            Place Order — ${total.toFixed(2)}
          </button>
        </form>

        {/* Order Summary */}
        <div className="p-4 bg-white border rounded">
          <h2 className="font-semibold mb-2">Order Summary</h2>

          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-14 object-contain"
                />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm">Qty: {item.qty || 1}</div>
                </div>
                <div className="font-semibold">
                  ${(item.price * (item.qty || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 font-bold text-lg">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
