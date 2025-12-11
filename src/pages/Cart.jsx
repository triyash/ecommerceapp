import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export default function Cart() {
  const [cart, setCart] = useLocalStorage("cart", []);

  const total = cart.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);

  function removeItem(id) {
    setCart(cart.filter((c) => c.id !== id));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      {cart.length === 0 ? (
        <div>No items</div>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-2 border rounded mb-2 bg-white">
              <img src={item.image} alt="" className="w-16 h-16 object-contain" />
              <div className="flex-1">
                <div>{item.title}</div>
                <div>${item.price}</div>
              </div>
              <div>Qty: {item.qty || 1}</div>
              <button onClick={() => removeItem(item.id)} className="text-red-600">Remove</button>
            </div>
          ))}

          <div className="mt-4 font-bold">Total: ${total.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}
