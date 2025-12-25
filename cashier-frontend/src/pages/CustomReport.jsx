import { useState, useEffect } from "react";
import { salesAPI } from "../api/api";
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { normalizeCategory } from "../utils/categories";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CustomReport() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedItemsForRefund, setSelectedItemsForRefund] = useState([]);
  const [reportStats, setReportStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    avgTransactionValue: 0,
    refundedAmount: 0
  });

  const fetchTransactions = async (params = {}) => {
    try {
      setLoading(true);
      const response = await salesAPI.getAll(params);
      const sorted = (response.data || []).sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setTransactions(sorted);
      setFilteredTransactions(sorted);
      calculateStats(sorted);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load transaction data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const activeTransactions = data.filter(t => !t.refunded);
    const totalSales = activeTransactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
    const refunded = data.filter(t => t.refunded).reduce((sum, t) => sum + (t.totalAmount || 0), 0);
    
    setReportStats({
      totalSales,
      totalTransactions: activeTransactions.length,
      avgTransactionValue: activeTransactions.length > 0 ? totalSales / activeTransactions.length : 0,
      refundedAmount: refunded
    });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Quick filter functions
  const handleQuickFilter = (filterType) => {
    const now = new Date();
    let start, end;

    switch(filterType) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear() + 1, 0, 1);
        break;
      case 'all':
        setFilteredTransactions(transactions);
        calculateStats(transactions);
        setStartDate("");
        setEndDate("");
        return;
      default:
        return;
    }

    applyDateFilter(start, end);
  };

  const applyDateFilter = (start, end) => {
    const filtered = transactions.filter(t => {
      const txnDate = new Date(t.date);
      return txnDate >= start && txnDate < end;
    });
    setFilteredTransactions(filtered);
    calculateStats(filtered);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const handleCustomDateFilter = () => {
    if (startDate && endDate) {
      const filtered = transactions.filter(t => {
        const txnDate = new Date(t.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return txnDate >= start && txnDate <= end;
      });
      setFilteredTransactions(filtered);
      calculateStats(filtered);
    } else if (startDate) {
      const filtered = transactions.filter(t => {
        const txnDate = new Date(t.date).toDateString();
        const filterDate = new Date(startDate).toDateString();
        return txnDate === filterDate;
      });
      setFilteredTransactions(filtered);
      calculateStats(filtered);
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilteredTransactions(transactions);
    calculateStats(transactions);
  };

  const handleRefund = async (billId) => {
    if (!window.confirm("Refund entire transaction?")) return;
    try {
      await salesAPI.refund(billId);
      alert("Refunded successfully!");
      fetchTransactions();
    } catch (err) {
      alert('Refund failed');
    }
  };

  const handlePartialRefund = async () => {
    if (selectedItemsForRefund.length === 0) {
      alert("Select items to refund");
      return;
    }
    const refundAmount = selectedItemsForRefund.reduce((sum, itemId) => {
      const item = selectedTransaction.billItems.find(bi => bi.id === itemId);
      return sum + (item ? item.price * item.quantity : 0);
    }, 0);
    
    if (!window.confirm(`Refund ₹${refundAmount.toLocaleString('en-IN')}?`)) return;
    
    try {
      await salesAPI.refundItems(selectedTransaction.id, selectedItemsForRefund);
      alert("Items refunded!");
      setSelectedItemsForRefund([]);
      setSelectedTransaction(null);
      fetchTransactions();
    } catch (err) {
      alert('Refund failed');
    }
  };

  const toggleItemForRefund = (itemId) => {
    setSelectedItemsForRefund(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Chart data functions
  const getSalesLineChart = () => {
    const salesByDate = {};
    
    filteredTransactions.forEach(t => {
      if (!t.refunded) {
        const date = new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        salesByDate[date] = (salesByDate[date] || 0) + (t.totalAmount || 0);
      }
    });

    const sortedDates = Object.keys(salesByDate).sort();
    
    return {
      labels: sortedDates,
      datasets: [{
        label: 'Daily Sales (₹)',
        data: sortedDates.map(d => salesByDate[d]),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };
  };

  const getCategoryChart = () => {
    const categoryData = {};
    
    filteredTransactions.forEach(t => {
      if (!t.refunded) {
        t.billItems?.forEach(item => {
          const cat = normalizeCategory(item.item?.category?.name || 'Other');
          categoryData[cat] = (categoryData[cat] || 0) + (item.price * item.quantity);
        });
      }
    });

    return {
      labels: Object.keys(categoryData),
      datasets: [{
        label: 'Sales by Category (₹)',
        data: Object.values(categoryData),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(251, 146, 60, 0.8)'
        ]
      }]
    };
  };

  const getStatusChart = () => {
    const completed = filteredTransactions.filter(t => !t.refunded).length;
    const refunded = filteredTransactions.filter(t => t.refunded).length;
    
    return {
      labels: ['Completed', 'Refunded'],
      datasets: [{
        data: [completed, refunded],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ]
      }]
    };
  };

  const getTopProductsChart = () => {
    const productData = {};
    
    filteredTransactions.forEach(t => {
      if (!t.refunded) {
        t.billItems?.forEach(item => {
          const name = item.item?.name || 'Unknown';
          productData[name] = (productData[name] || 0) + item.quantity;
        });
      }
    });

    const sorted = Object.entries(productData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return {
      labels: sorted.map(([name]) => name),
      datasets: [{
        label: 'Units Sold',
        data: sorted.map(([, qty]) => qty),
        backgroundColor: 'rgba(168, 85, 247, 0.8)'
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } }
  };

  const { totalSales, totalTransactions, avgTransactionValue, refundedAmount } = reportStats;

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Quick Filter Buttons */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">📅 Quick Filters</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleQuickFilter('today')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => handleQuickFilter('month')}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            This Month
          </button>
          <button
            onClick={() => handleQuickFilter('year')}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            This Year
          </button>
          <button
            onClick={() => handleQuickFilter('all')}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
          >
            All Data
          </button>
        </div>
      </div>

      {/* Custom Date Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">🔍 Custom Date Filter</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleCustomDateFilter}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-green-100 text-sm font-medium">Total Sales</p>
          <p className="text-3xl font-bold mt-2">₹{totalSales.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-blue-100 text-sm font-medium">Transactions</p>
          <p className="text-3xl font-bold mt-2">{totalTransactions}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-purple-100 text-sm font-medium">Avg Value</p>
          <p className="text-3xl font-bold mt-2">₹{avgTransactionValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <p className="text-red-100 text-sm font-medium">Refunded</p>
          <p className="text-3xl font-bold mt-2">₹{refundedAmount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Sales Trend</h3>
          <div className="h-64">
            <Line data={getSalesLineChart()} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Transaction Status</h3>
          <div className="h-64">
            <Doughnut data={getStatusChart()} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Sales by Category</h3>
          <div className="h-64">
            <Pie data={getCategoryChart()} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Top Products</h3>
          <div className="h-64">
            <Bar data={getTopProductsChart()} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          📋 Filtered Transactions ({filteredTransactions.length})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">#{transaction.id}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>{new Date(transaction.date).toLocaleDateString('en-IN')}</div>
                      <div className="text-gray-500 text-xs">{new Date(transaction.date).toLocaleTimeString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right">
                      <span className={transaction.refunded ? 'text-red-600 line-through' : 'text-green-600'}>
                        ₹{(transaction.totalAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {transaction.refunded ? (
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Refunded
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="text-blue-600 hover:text-blue-900 font-medium mr-3"
                      >
                        View
                      </button>
                      {!transaction.refunded && (
                        <button
                          onClick={() => handleRefund(transaction.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Transaction #{selectedTransaction.id}</h3>
                <button
                  onClick={() => {
                    setSelectedTransaction(null);
                    setSelectedItemsForRefund([]);
                  }}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600 font-medium">ID:</span>
                  <p className="text-lg font-bold">#{selectedTransaction.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 font-medium">Status:</span>
                  <p>
                    {selectedTransaction.refunded ? (
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
                        Refunded
                      </span>
                    ) : (
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 font-medium">Date:</span>
                  <p>{new Date(selectedTransaction.date).toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 font-medium">Time:</span>
                  <p>{new Date(selectedTransaction.date).toLocaleTimeString('en-IN')}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
                  <span>🛒 Items</span>
                  {!selectedTransaction.refunded && selectedTransaction.billItems.some(item => !item.refunded) && (
                    <span className="text-sm font-normal text-blue-600">Select to refund</span>
                  )}
                </h4>
                <div className="space-y-2">
                  {(selectedTransaction.billItems || []).map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        item.refunded ? 'bg-red-50' : 'bg-gray-50'
                      }`}
                    >
                      {!selectedTransaction.refunded && !item.refunded && (
                        <input
                          type="checkbox"
                          checked={selectedItemsForRefund.includes(item.id)}
                          onChange={() => toggleItemForRefund(item.id)}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                      )}
                      <div className="flex-1 flex justify-between">
                        <span className={item.refunded ? 'line-through' : ''}>
                          {item.item?.name} × {item.quantity}
                        </span>
                        <span className={item.refunded ? 'text-red-600 line-through' : 'font-bold'}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {!selectedTransaction.refunded && selectedTransaction.billItems.some(item => !item.refunded) && (
                  <>
                    {selectedItemsForRefund.length > 0 && (
                      <button
                        onClick={handlePartialRefund}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium"
                      >
                        Refund Selected ({selectedItemsForRefund.length})
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedTransaction(null);
                        setSelectedItemsForRefund([]);
                        handleRefund(selectedTransaction.id);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium"
                    >
                      Refund All
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setSelectedTransaction(null);
                    setSelectedItemsForRefund([]);
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
