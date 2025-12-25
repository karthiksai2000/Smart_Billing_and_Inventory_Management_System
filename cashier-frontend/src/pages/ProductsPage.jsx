import { useState, useEffect } from "react";
import { normalizeCategory } from "../utils/categories";
import { productsAPI } from "../api/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    customId: "",
    name: "",
    category: "",
    price: "",
    stock: ""
  });
  const [existingProductById, setExistingProductById] = useState(null);

  // Calculate stats for the "Available Products List" view (consistent with row badges)
  const getStock = (p) => parseInt(p?.stockQuantity ?? p?.stock ?? 0) || 0;
  const totalProducts = products.length;
  const availableProducts = products.filter(p => getStock(p) > 0).length; // any stock > 0
  const lowStockProducts = products.filter(p => getStock(p) > 0 && getStock(p) <= 20).length; // 1..20
  const outOfStockProducts = products.filter(p => getStock(p) === 0).length; // 0

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // When typing Product ID, auto-fill existing details and lock fields, so user only updates stock
  const handleCustomIdChange = (value) => {
    const trimmed = (value || '').trim();
    setNewProduct(prev => ({ ...prev, customId: trimmed }));
    if (!trimmed) {
      setExistingProductById(null);
      return;
    }
    const match = products.find(p => (p.customId || "").toString().toLowerCase() === trimmed.toLowerCase());
    if (match) {
      setExistingProductById(match);
      setNewProduct({
        customId: trimmed,
        name: match.name || "",
        category: normalizeCategory(match.category?.name || match.category || ""),
        price: (match.price != null ? match.price.toString() : "0"),
        stock: "" // let user type how much to add
      });
    } else {
      setExistingProductById(null);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!newProduct.customId || (!existingProductById && (!newProduct.name || !newProduct.category || !newProduct.price)) || !newProduct.stock) {
      alert("Please fill in all fields including Product ID");
      return;
    }

    try {
      // Check if product with same custom ID already exists
      if (!editingProduct) {
        const existingProduct = products.find(p => (p.customId || "").toString().toLowerCase() === newProduct.customId.toLowerCase());
        if (existingProduct) {
          // Product exists, update stock instead
          const updatedData = {
            customId: existingProduct.customId,
            name: existingProduct.name,
            category: existingProduct.category,
            price: existingProduct.price,
            stockQuantity: (existingProduct.stockQuantity || 0) + parseInt(newProduct.stock)
          };
          await productsAPI.update(existingProduct.id, updatedData);
          alert(`Product ID ${newProduct.customId} already exists. Stock updated by ${newProduct.stock} units.`);
        } else {
          // New product, create it
          const productData = {
            customId: newProduct.customId,
            name: newProduct.name,
            category: { name: newProduct.category }, 
            price: parseFloat(newProduct.price),
            stockQuantity: parseInt(newProduct.stock)
          };
          await productsAPI.create(productData);
        }
      } else {
        // Update existing product (PUT)
        const productData = {
          customId: newProduct.customId,
          name: newProduct.name,
          category: { name: newProduct.category }, 
          price: parseFloat(newProduct.price),
          stockQuantity: parseInt(newProduct.stock)
        };
        await productsAPI.update(editingProduct.id, productData);
      }

      // Refresh products list
      await fetchProducts();
      
      setNewProduct({ customId: "", name: "", category: "", price: "", stock: "" });
      setExistingProductById(null);
      setEditingProduct(null);
      setShowModal(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    // Handle both potential data structures (category object or string)
    setNewProduct({
      customId: product.customId || '',
      name: product.name,
      category: normalizeCategory(product.category?.name || product.category || ''),
      price: product.price?.toString() || '0',
      stock: (product.stockQuantity || product.stock || 0).toString()
    });
    setExistingProductById(null);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productsAPI.delete(productId);
        await fetchProducts(); // Refresh the list
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setNewProduct({ customId: "", name: "", category: "", price: "", stock: "" });
    setExistingProductById(null);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. NEW: Available Products Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-gray-500 text-sm">Total Products</div>
          <div className="text-2xl font-bold">{totalProducts}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-gray-500 text-sm">Available (In Stock)</div>
          <div className="text-2xl font-bold text-green-600">{availableProducts}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="text-gray-500 text-sm">Low Stock</div>
          <div className="text-2xl font-bold text-yellow-600">{lowStockProducts}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <div className="text-gray-500 text-sm">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600">{outOfStockProducts}</div>
        </div>
      </div>

      {/* 2. Main Product Management Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Products List</h2>
          <div className="flex space-x-3">
            <button
              onClick={fetchProducts}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Add Product
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Custom ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No products found. Add some products to get started.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                    {product.customId || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {normalizeCategory(product.category?.name || product.category || 'No Category')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{product.price?.toLocaleString('en-IN') || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stockQuantity || product.stock || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      (product.stockQuantity || product.stock || 0) > 20 
                        ? "bg-green-100 text-green-800" 
                        : (product.stockQuantity || product.stock || 0) > 0 
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {(product.stockQuantity || product.stock || 0) > 20 ? "In Stock" : (product.stockQuantity || product.stock || 0) > 0 ? "Low Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID (e.g., 001, 002, H001)
                </label>
                <input
                  type="text"
                  value={newProduct.customId}
                  onChange={(e) => handleCustomIdChange(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product ID"
                  disabled={editingProduct ? true : false}
                />
                {!editingProduct && existingProductById && (
                  <p className="text-xs text-blue-600 mt-1">
                    Existing product found. Details locked; enter stock to add.
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  disabled={!!existingProductById}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={!!existingProductById}
                >
                  <option value="">Select category</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  step="1"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  disabled={!!existingProductById}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingProduct || existingProductById ? 'Add to Stock' : 'Stock Quantity'}
                </label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                {!editingProduct && <p className="text-xs text-gray-500 mt-1">If Product ID exists, this amount will be added to existing stock</p>}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}