import {
  FaShoppingBag,
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { formatCurrency } from "@/helper/renderNumber";
import { Order } from "@/types/order";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: "increase" | "decrease";
  color: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeType,
  color,
  description,
}) => (
  <div
    className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 ${color} ${
      color.includes("blue")
        ? "bg-gradient-to-br from-blue-50 to-blue-100"
        : color.includes("green")
          ? "bg-gradient-to-br from-green-50 to-green-100"
          : color.includes("yellow")
            ? "bg-gradient-to-br from-yellow-50 to-yellow-100"
            : "bg-gradient-to-br from-purple-50 to-purple-100"
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {change && (
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
        )}
        {!change && (
          <span className="text-gray-500 text-sm">{description}</span>
        )}
      </div>
      <div
        className={`p-4 rounded-xl bg-gradient-to-br ${
          color.includes("blue")
            ? "from-blue-400 to-blue-600"
            : color.includes("green")
              ? "from-green-400 to-green-600"
              : color.includes("yellow")
                ? "from-yellow-400 to-yellow-600"
                : "from-purple-400 to-purple-600"
        } text-white`}
      >
        {icon}
      </div>
    </div>
  </div>
);

interface OrderStatisticsProps {
  orders: Order[] | undefined;
}

export default function OrderStatistics({ orders }: OrderStatisticsProps) {
  const totalOrders = orders?.length || 0;
  const completedOrders =
    orders?.filter((order) => order.status === "COMPLETED").length || 0;
  const pendingOrders =
    orders?.filter((order) => order.status === "PENDING").length || 0;
  const totalRevenue =
    orders?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: <FaShoppingBag size={24} />,
      change: "+12%",
      changeType: "increase" as const,
      color: "border-blue-500",
      description: "All time orders",
    },
    {
      title: "Completed Orders",
      value: completedOrders.toString(),
      icon: <FaCheckCircle size={24} />,
      change: "+8%",
      changeType: "increase" as const,
      color: "border-green-500",
      description: "Successfully delivered",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      icon: <FaClock size={24} />,
      change: "+5%",
      changeType: "increase" as const,
      color: "border-yellow-500",
      description: "Awaiting processing",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: <FaDollarSign size={24} />,
      change: "+15%",
      changeType: "increase" as const,
      color: "border-purple-500",
      description: "VND - All orders",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
