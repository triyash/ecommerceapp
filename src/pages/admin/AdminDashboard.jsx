import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="space-x-4">
        <Link to="/admin/products" className="text-blue-600">Manage Products</Link>
      </div>
    </div>
  );
}
