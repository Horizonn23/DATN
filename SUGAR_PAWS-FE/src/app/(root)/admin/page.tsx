"use client";

import React from "react";
import Link from "next/link";
import {
  FaUsers,
  FaShoppingBag,
  FaClipboardList,
  FaChartLine,
  FaFileInvoiceDollar,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaPlus,
} from "react-icons/fa";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  changeType: "increase" | "decrease";
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType,
  color,
}) => (
  <div
    className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 ${color} ${
      color.includes("blue")
        ? "bg-gradient-to-br from-blue-50 to-blue-100"
        : color.includes("green")
          ? "bg-gradient-to-br from-green-50 to-green-100"
          : color.includes("purple")
            ? "bg-gradient-to-br from-purple-50 to-purple-100"
            : "bg-gradient-to-br from-pink-50 to-pink-100"
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <div className="flex items-center mt-2">
          {changeType === "increase" ? (
            <FaArrowUp className="text-green-500 text-sm mr-1" />
          ) : (
            <FaArrowDown className="text-red-500 text-sm mr-1" />
          )}
          <span
            className={`text-sm font-medium ${
              changeType === "increase" ? "text-green-500" : "text-red-500"
            }`}
          >
            {change}
          </span>
          <span className="text-gray-500 text-sm ml-1">from last month</span>
        </div>
      </div>
      <div
        className={`p-4 rounded-xl bg-gradient-to-br ${
          color.includes("blue")
            ? "from-blue-400 to-blue-600"
            : color.includes("green")
              ? "from-green-400 to-green-600"
              : color.includes("purple")
                ? "from-purple-400 to-purple-600"
                : "from-pink-400 to-pink-600"
        } text-white`}
      >
        {icon}
      </div>
    </div>
  </div>
);

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  href,
  color,
}) => (
  <Link href={href} className="group">
    <div
      className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 border border-gray-100 ${color}`}
    >
      <div className="flex items-center mb-4">
        <div
          className={`p-3 rounded-lg ${
            color.includes("blue")
              ? "bg-blue-100 text-blue-600"
              : color.includes("green")
                ? "bg-green-100 text-green-600"
                : color.includes("purple")
                  ? "bg-purple-100 text-purple-600"
                  : color.includes("pink")
                    ? "bg-pink-100 text-pink-600"
                    : "bg-yellow-100 text-yellow-600"
          } group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="font-bold text-gray-800 group-hover:text-custom-rose transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  </Link>
);

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: <FaUsers size={24} />,
      change: "+12%",
      changeType: "increase" as const,
      color: "border-blue-500",
    },
    {
      title: "Total Products",
      value: "567",
      icon: <FaShoppingBag size={24} />,
      change: "+8%",
      changeType: "increase" as const,
      color: "border-green-500",
    },
    {
      title: "Total Orders",
      value: "2,341",
      icon: <FaClipboardList size={24} />,
      change: "+15%",
      changeType: "increase" as const,
      color: "border-purple-500",
    },
    {
      title: "Monthly Revenue",
      value: "$45,234",
      icon: <FaChartLine size={24} />,
      change: "-3%",
      changeType: "decrease" as const,
      color: "border-pink-500",
    },
  ];

  const quickActions = [
    {
      title: "Manage Products",
      description: "Add, edit or remove products",
      icon: <FaShoppingBag size={20} />,
      href: "/admin/products",
      color: "hover:border-green-300",
    },
    {
      title: "View Users",
      description: "Manage user accounts and permissions",
      icon: <FaUsers size={20} />,
      href: "/admin/users",
      color: "hover:border-blue-300",
    },
    {
      title: "Process Orders",
      description: "Review and process customer orders",
      icon: <FaClipboardList size={20} />,
      href: "/admin/orders",
      color: "hover:border-purple-300",
    },
    {
      title: "Revenue Analytics",
      description: "View sales and revenue analytics",
      icon: <FaChartLine size={20} />,
      href: "/admin/revenue",
      color: "hover:border-pink-300",
    },
    {
      title: "Financial Reports",
      description: "Generate detailed financial reports",
      icon: <FaFileInvoiceDollar size={20} />,
      href: "/admin/financial-report",
      color: "hover:border-yellow-300",
    },
  ];

  const recentActivity = [
    {
      action: "New order #1234 received",
      time: "2 minutes ago",
      type: "order",
    },
    {
      action: "User Sarah Johnson registered",
      time: "15 minutes ago",
      type: "user",
    },
    {
      action: "Product Pink Bow updated",
      time: "1 hour ago",
      type: "product",
    },
    {
      action: "Payment of $89.99 processed",
      time: "2 hours ago",
      type: "payment",
    },
    {
      action: "Order #1230 shipped",
      time: "3 hours ago",
      type: "order",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s what&apos;s happening with Sugar Paws
            today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaPlus className="text-custom-rose mr-3" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <QuickAction key={index} {...action} />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaEye className="text-custom-rose mr-3" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-2 ${
                        activity.type === "order"
                          ? "bg-blue-500"
                          : activity.type === "user"
                            ? "bg-green-500"
                            : activity.type === "product"
                              ? "bg-purple-500"
                              : "bg-pink-500"
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">
                        {activity.action}
                      </p>
                      <p className="text-gray-500 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/admin/activity"
                className="block text-center mt-4 text-custom-rose hover:text-custom-wine font-medium transition-colors"
              >
                View All Activity →
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Sales Overview
            </h2>
            <div className="h-64 bg-gradient-to-br from-custom-pink/20 to-custom-rose/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <FaChartLine className="text-4xl text-custom-rose mx-auto mb-4" />
                <p className="text-gray-600">
                  Sales chart will be displayed here
                </p>
                <Link
                  href="/admin/revenue"
                  className="text-custom-rose hover:text-custom-wine font-medium"
                >
                  View Detailed Analytics →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Top Products
            </h2>
            <div className="space-y-4">
              {[
                {
                  name: "Pink Heart Necklace",
                  sales: "142 sold",
                  revenue: "$3,550",
                },
                {
                  name: "Cute Cat Ring",
                  sales: "98 sold",
                  revenue: "$2,450",
                },
                {
                  name: "Rainbow Hair Clip",
                  sales: "87 sold",
                  revenue: "$1,740",
                },
                {
                  name: "Unicorn Earrings",
                  sales: "76 sold",
                  revenue: "$1,520",
                },
              ].map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-gray-600 text-sm">{product.sales}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-custom-rose">
                      {product.revenue}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/admin/products"
              className="block text-center mt-4 text-custom-rose hover:text-custom-wine font-medium transition-colors"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
