import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ p, onAdd }) {
  return (
    <div className="border rounded p-4 bg-white">
      <img src={p.image} alt={p.title} className="h-40 object-contain mx-auto" />
      <h3 className="mt-2 font-semibold text-sm">{p.title}</h3>
      <p className="mt-1 font-bold">${p.price}</p>
      <div className="mt-3 flex justify-between">
        <Link to={`/product/${p.id}`} className="text-blue-600">View</Link>
        <button onClick={() => onAdd && onAdd(p)} className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
      </div>
    </div>
  );
}
