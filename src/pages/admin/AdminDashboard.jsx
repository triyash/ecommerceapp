import React from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../../hooks/useLocalStorage";

export default function AdminDashboard() {
  // Load products saved in localStorage by Admin
  const [products] = useLocalStorage("admin_products", []);
  
  // Load orders saved during checkout
  const [orders] = useLocalStorage("orders", []);

  // Calculate Metrics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        
        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Total Products</h2>
          <p className="text-xl font-bold">{totalProducts}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Total Orders</h2>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Pending Orders</h2>
          <p className="text-xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h2 className="font-semibold">Total Revenue</h2>
          <p className="text-xl font-bold text-green-600">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>

      </div>

      {/* Navigation Links */}
      <div className="flex gap-6">
        <Link to="/admin/products" className="text-blue-600 font-semibold">
          ➤ Manage Products
        </Link>

        <Link to="/admin/orders" className="text-blue-600 font-semibold">
          ➤ Manage Orders
        </Link>
      </div>
    </div>
  );
}
