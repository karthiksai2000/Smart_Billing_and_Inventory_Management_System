import { useState } from "react";
import SalesPage from "./SalesPage";
import ProductsPage from "./ProductsPage";
import ReportsPage from "./ReportsPage";
import CustomReport from "./CustomReport";

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("sales");

  const tabs = [
    { id: "sales", label: "Sales / Billing", icon: "💳" },
    { id: "products", label: " Inventory", icon: "📱" },
    { id: "reports", label: "Sales Reports", icon: "📊" },
    { id: "custom-report", label: "Custom Reports", icon: "📈" }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "sales":
        return <SalesPage />;
      case "products":
        return <ProductsPage />;
      case "reports":
        return <ReportsPage />;
      case "custom-report":
        return <CustomReport />;
      default:
        return <SalesPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Aasha hardware, plumbing & electrical </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
