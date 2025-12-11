import React, { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function AdminOrders() {
  const [orders, setOrders] = useLocalStorage("orders", []);
  const [selected, setSelected] = useState(null);

  function save(updated) {
    setOrders(updated);
  }

  function changeStatus(id, newStatus) {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: newStatus } : o
    );
    save(updated);
  }

  function deleteOrder(id) {
    if (!confirm("Delete order?")) return;
    const updated = orders.filter((o) => o.id !== id);
    save(updated);
    if (selected && selected.id === id) setSelected(null);
  }

  if (!orders || orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="p-4 bg-white rounded border">No orders found.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="p-3 bg-white border rounded flex justify-between items-start">
              <div>
                <div className="font-semibold">Order #{o.id}</div>
                <div className="text-sm text-gray-600">{new Date(o.createdAt || o.created_at || Date.now()).toLocaleString()}</div>
                <div className="mt-1">Name: {o.name || (o.customer && o.customer.name) || "—"}</div>
                <div className="mt-1">Total: ${((o.total)||0).toFixed(2)}</div>
                <div className="mt-1">Status: <span className="font-medium">{o.status || "pending"}</span></div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={() => setSelected(o)}
                  className="text-blue-600 text-sm"
                >
                  View
                </button>

                {o.status !== "completed" ? (
                  <button
                    onClick={() => changeStatus(o.id, "completed")}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Mark Completed
                  </button>
                ) : (
                  <button
                    onClick={() => changeStatus(o.id, "pending")}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Mark Pending
                  </button>
                )}

                <button
                  onClick={() => deleteOrder(o.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="p-4 bg-white border rounded">
        <h2 className="font-semibold mb-2">Order Details</h2>

        {!selected ? (
          <div className="text-sm text-gray-600">Select an order to view details.</div>
        ) : (
          <div>
            <div className="mb-2"><strong>Order #{selected.id}</strong></div>
            <div className="text-sm text-gray-700 mb-2">Name: {selected.name || (selected.customer && selected.customer.name)}</div>
            <div className="text-sm text-gray-700 mb-2">Address: {selected.address || (selected.shipping && selected.shipping.address) || "—"}</div>

            <div className="mt-2">
              <div className="font-semibold mb-1">Items</div>
              <div className="space-y-2">
                {(selected.items || []).map((it) => (
                  <div key={it.id} className="flex items-center gap-3">
                    <img src={it.image} alt={it.title} className="w-12 h-12 object-contain" />
                    <div>
                      <div className="text-sm">{it.title}</div>
                      <div className="text-xs text-gray-600">Qty: {it.qty || 1} — ${it.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 font-bold">Total: ${((selected.total)||0).toFixed(2)}</div>
            <div className="mt-2 text-sm text-gray-500">Status: {selected.status || "pending"}</div>
          </div>
        )}
      </aside>
    </div>
  );
}
