import { useState, useEffect } from "react";
import { reportsAPI, salesAPI } from "../api/api";
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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

// Register Chart.js components
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

export default function ReportsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedItemsForRefund, setSelectedItemsForRefund] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    totalTransactions: 0,
    refundedTransactions: 0,
    refundedAmount: 0
  });

  // Fetch transactions from API
  const fetchTransactions = async (params = {}) => {
    try {
      setLoading(true);
      const transactionsResponse = await salesAPI.getAll(params);
      
      // Sort by date (most recent first)
      const sortedTransactions = (transactionsResponse.data || []).sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      setTransactions(sortedTransactions);
      setFilteredTransactions(sortedTransactions);
      
      // Calculate stats
      const refundedTxns = sortedTransactions.filter(t => t.refunded);
      const refundedAmt = refundedTxns.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
      
      setDashboardStats({
        totalSales: sortedTransactions.reduce((sum, t) => sum + (t.refunded ? 0 : (t.totalAmount || 0)), 0),
        totalTransactions: sortedTransactions.length,
        refundedTransactions: refundedTxns.length,
        refundedAmount: refundedAmt
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching reports data:', err);
      setError('Failed to load reports data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDateFilter = () => {
    if (startDate && endDate) {
      const filtered = transactions.filter(t => {
        const txnDate = new Date(t.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include entire end date
        return txnDate >= start && txnDate <= end;
      });
      setFilteredTransactions(filtered);
    } else if (startDate) {
      // Single date filter
      const filtered = transactions.filter(t => {
        const txnDate = new Date(t.date).toDateString();
        const filterDate = new Date(startDate).toDateString();
        return txnDate === filterDate;
      });
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setFilteredTransactions(transactions);
  };

  const handleRefund = async (billId) => {
    if (!window.confirm("Are you sure you want to refund this entire transaction? This will restore all items to inventory.")) {
      return;
    }
    
    try {
      await salesAPI.refund(billId);
      alert("Transaction refunded successfully! Stock has been restored.");
      fetchTransactions();
    } catch (err) {
      console.error('Error refunding bill:', err);
      alert('Failed to refund transaction. It may already be refunded.');
    }
  };

  const handlePartialRefund = async () => {
    if (selectedItemsForRefund.length === 0) {
      alert("Please select at least one item to refund.");
      return;
    }
    
    const refundAmount = selectedItemsForRefund.reduce((sum, itemId) => {
      const item = selectedTransaction.billItems.find(bi => bi.id === itemId);
      return sum + (item ? item.price * item.quantity : 0);
    }, 0);
    
    if (!window.confirm(`Are you sure you want to refund ${selectedItemsForRefund.length} item(s) for ₹${refundAmount.toLocaleString('en-IN')}? Stock will be restored.`)) {
      return;
    }
    
    try {
      await salesAPI.refundItems(selectedTransaction.id, selectedItemsForRefund);
      alert("Selected items refunded successfully! Stock has been restored.");
      setSelectedItemsForRefund([]);
      setSelectedTransaction(null);
      fetchTransactions();
    } catch (err) {
      console.error('Error refunding items:', err);
      alert('Failed to refund items. They may already be refunded.');
    }
  };

  const toggleItemForRefund = (itemId) => {
    setSelectedItemsForRefund(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const { totalSales, totalTransactions, refundedTransactions, refundedAmount } = dashboardStats;

  // Prepare chart data
  const getLast7DaysSales = () => {
    const last7Days = [];
    const salesByDay = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      last7Days.push(dateStr);
      salesByDay[dateStr] = 0;
    }
    
    filteredTransactions.forEach(txn => {
      if (!txn.refunded) {
        const txnDate = new Date(txn.date);
        const dateStr = txnDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        if (salesByDay.hasOwnProperty(dateStr)) {
          salesByDay[dateStr] += (txn.totalAmount || 0);
        }
      }
    });
    
    return {
      labels: last7Days,
      datasets: [{
        label: 'Sales (₹)',
        data: last7Days.map(day => salesByDay[day]),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };
  };

  const getDailySalesBar = () => {
    const last7Days = [];
    const salesByDay = {};
    const transactionsByDay = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      last7Days.push(dateStr);
      salesByDay[dateStr] = 0;
      transactionsByDay[dateStr] = 0;
    }
    
    filteredTransactions.forEach(txn => {
      if (!txn.refunded) {
        const txnDate = new Date(txn.date);
        const dateStr = txnDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        if (transactionsByDay.hasOwnProperty(dateStr)) {
          transactionsByDay[dateStr] += 1;
          salesByDay[dateStr] += (txn.totalAmount || 0);
        }
      }
    });
    
    return {
      labels: last7Days,
      datasets: [{
        label: 'Transactions',
        data: last7Days.map(day => transactionsByDay[day]),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderRadius: 4
      }]
    };
  };

  const getStatusDistribution = () => {
    const completed = filteredTransactions.filter(t => !t.refunded).length;
    const refunded = filteredTransactions.filter(t => t.refunded).length;
    
    return {
      labels: ['Completed', 'Refunded'],
      datasets: [{
        data: [completed, refunded],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 0
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold mt-2">₹{totalSales.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Transactions</p>
              <p className="text-3xl font-bold mt-2">{totalTransactions}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Refunds</p>
              <p className="text-3xl font-bold mt-2">{refundedTransactions}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">↩️</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Refunded Amount</p>
              <p className="text-3xl font-bold mt-2">₹{refundedAmount.toLocaleString('en-IN')}</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl">💸</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Sales Trend (Last 7 Days)</h3>
          <div className="h-64">
            <Line data={getLast7DaysSales()} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Transaction Status</h3>
          <div className="h-64">
            <Doughnut data={getStatusDistribution()} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Daily Transactions (Last 7 Days)</h3>
        <div className="h-64">
          <Bar data={getDailySalesBar()} options={chartOptions} />
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">🔍 Filter Transactions</h3>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleDateFilter}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Apply Filter
          </button>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => fetchTransactions()}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            📋 Recent Transactions 
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Showing {filteredTransactions.length} of {transactions.length})
            </span>
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3">Loading transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No transactions found for the selected date range.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{new Date(transaction.date).toLocaleDateString('en-IN')}</div>
                    <div className="text-gray-500 text-xs">{new Date(transaction.date).toLocaleTimeString('en-IN')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                    <span className={transaction.refunded ? 'text-red-600 line-through' : 'text-green-600'}>
                      ₹{(transaction.totalAmount || 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Transaction Details #{selectedTransaction.id}</h3>
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
                  <span className="text-sm text-gray-600 font-medium">Transaction ID:</span>
                  <p className="text-lg font-bold text-gray-900">#{selectedTransaction.id}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 font-medium">Status:</span>
                  <p>
                    {selectedTransaction.refunded ? (
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 mt-1">
                        Refunded
                      </span>
                    ) : (
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 mt-1">
                        Completed
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 font-medium">Date:</span>
                  <p className="font-medium">{new Date(selectedTransaction.date).toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600 font-medium">Time:</span>
                  <p className="font-medium">{new Date(selectedTransaction.date).toLocaleTimeString('en-IN')}</p>
                </div>
              </div>

              {selectedTransaction.refunded && selectedTransaction.refundedDate && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-sm text-red-800">
                    <span className="font-bold">Refunded on:</span> {new Date(selectedTransaction.refundedDate).toLocaleString('en-IN')}
                  </p>
                </div>
              )}
              
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="mr-2">🛒</span> Items Purchased
                  </span>
                  {!selectedTransaction.refunded && selectedTransaction.billItems.some(item => !item.refunded) && (
                    <span className="text-sm font-normal text-blue-600">Select items to refund</span>
                  )}
                </h4>
                <div className="space-y-2">
                  {(selectedTransaction.billItems || []).map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        item.refunded 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      {!selectedTransaction.refunded && !item.refunded && (
                        <input
                          type="checkbox"
                          checked={selectedItemsForRefund.includes(item.id)}
                          onChange={() => toggleItemForRefund(item.id)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                      <div className="flex-1 flex justify-between items-center">
                        <div className="flex-1">
                          <span className={`font-medium text-gray-900 ${item.refunded ? 'line-through' : ''}`}>
                            {item.item?.name || 'Unknown Item'}
                          </span>
                          <span className="text-gray-500 text-sm ml-2">× {item.quantity}</span>
                          {item.refunded && (
                            <span className="ml-2 text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                              REFUNDED
                            </span>
                          )}
                        </div>
                        <span className={`font-bold ${item.refunded ? 'text-red-600 line-through' : 'text-gray-900'}`}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total Amount:</span>
                  <span className={`text-2xl font-bold ${selectedTransaction.refunded ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{(selectedTransaction.totalAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {!selectedTransaction.refunded && selectedTransaction.billItems.some(item => !item.refunded) && (
                  <>
                    {selectedItemsForRefund.length > 0 && (
                      <button
                        onClick={handlePartialRefund}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
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
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
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
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
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