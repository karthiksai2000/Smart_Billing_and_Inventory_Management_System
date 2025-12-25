import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { productsAPI, salesAPI, customersAPI } from "../api/api";

export default function SalesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  // GST rate (editable) in percentage, persisted locally
  const [gstRate, setGstRate] = useState(() => {
    const stored = localStorage.getItem('gstRate');
    const num = stored !== null ? parseFloat(stored) : NaN;
    return Number.isFinite(num) ? num : 0;
  });

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      try {
        let results = [];
        // Prefer searching by Product ID (customId)
        try {
          const response = await productsAPI.getByCustomId(term.trim());
          if (response?.data) {
            results = Array.isArray(response.data) ? response.data : [response.data];
          }
        } catch (apiErr) {
          // Fallback: local filter by Product ID (customId)
          results = products.filter(p => (p.customId || '').toLowerCase().includes(term.toLowerCase()));
        }
        setSearchResults(results);
      } catch (err) {
        console.error('Error searching products by ID:', err);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };


  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const effectiveRate = Number.isFinite(gstRate) ? gstRate : 0; // percentage
  const tax = subtotal * (effectiveRate / 100);
  const total = subtotal + tax;
const generateEstimationPDF = (saleData = null) => {
  try {
    const doc = new jsPDF({ format: 'a5', orientation: 'portrait' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 6;

    // footer + page break limits
    const footerHeight = 34;
    const bottomLimit = pageHeight - footerHeight - 4;

    const items = saleData?.items || cartItems;
    const customerData = saleData?.customer || customer;

    if (!items || items.length === 0) {
      alert('No items in cart');
      return;
    }

    let yPos = margin + 2;

    // ===== SHOP HEADER =====
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('AASHA HARDWARE, PLUMBING & ELECTRICALS', pageWidth / 2, yPos, { align: 'center' });

    yPos += 6;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Hardware, Polish Items & Paints Available', pageWidth / 2, yPos, { align: 'center' });

    yPos += 3.4;
    doc.text('N.T Agraharam, 4th line', pageWidth / 2, yPos, { align: 'center' });

    yPos += 3.4;
    doc.text('Mahaboob Nagar, Guntur', pageWidth / 2, yPos, { align: 'center' });


     yPos += 3.4;
    doc.setFont(undefined, 'bold');
    doc.text('Proprietor: M.Abdulla', pageWidth / 2, yPos, { align: 'center' });

    yPos += 3.4;
    doc.text('Ph no: 9246525552', pageWidth / 2, yPos, { align: 'center' });

    // ===== TITLE =====
    yPos += 6;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('ESTIMATION', pageWidth / 2, yPos, { align: 'center' });

    // ===== CUSTOMER =====
    yPos += 4;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);

    doc.text(
      `Name: ${customerData?.name ? customerData.name : '____________________________'}`,
      margin,
      yPos +=3
    );

    yPos += 5;
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, margin, yPos);

    if (customerData?.phone) {
      yPos += 3;
      doc.text(`Phone: ${customerData.phone}`, margin, yPos);
    }

    if (customerData?.email) {
      yPos += 3;
      doc.text(`Email: ${customerData.email}`, margin, yPos);
    }

    yPos += 3;
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // ===== TABLE HEADER =====
    yPos += 3;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(7);
    doc.text('S. No', margin + 1, yPos);
    doc.text('PARTICULARS', margin + 12, yPos);
    doc.text('Qty', pageWidth - margin - 30, yPos);
    doc.text('Amount', pageWidth - margin - 2, yPos, { align: 'right' });

    yPos += 2;
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 4;
    // ===== ITEMS =====
    doc.setFont(undefined, 'normal');
    let subTotal = 0;

    items.forEach((item, index) => {
      // PAGE BREAK CHECK
      if (yPos > bottomLimit) {
        doc.addPage();
        yPos = margin + 10;

        // repeat table header
        doc.setFont(undefined, 'bold');
        doc.setFontSize(10);
        doc.text('S. No', margin + 1, yPos);
        doc.text('PARTICULARS', margin + 12, yPos);
        doc.text('Qty', pageWidth - margin - 30, yPos);
        doc.text('Amount', pageWidth - margin - 2, yPos, { align: 'right' });

        yPos += 2;
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 2.5;
        doc.setFont(undefined, 'normal');
      }

      const qty = item.quantity || 0;
      const price = item.price || 0;
      const amount = qty * price;
      subTotal += amount;
 doc.setFontSize(10);
      doc.text(String(index + 1), margin + 1, yPos);
      doc.text(item.name.substring(0, 30), margin + 12, yPos);
      doc.text(String(qty), pageWidth - margin - 30, yPos);
      doc.text(`₹${amount.toLocaleString('en-IN')}`, pageWidth - margin - 2, yPos, { align: 'right' });

      yPos += 4.5;
    });

    // ===== TOTAL (SAFE) =====
  // ===== TOTAL (SAFE) =====
if (yPos > bottomLimit - 10) {
  doc.addPage();
  yPos = margin + 10;
}

const gstPercent = saleData?.gstRate ?? effectiveRate ?? 0;
const gstAmount = subTotal * (gstPercent / 100);
const grandTotal = subTotal + gstAmount;

doc.line(margin, yPos, pageWidth - margin, yPos);
yPos += 3;

doc.setFont(undefined, 'bold');
doc.text('Subtotal', pageWidth - margin - 40, yPos);
doc.text(`₹${subTotal.toLocaleString('en-IN')}`, pageWidth - margin - 2, yPos, { align: 'right' });

yPos += 4;
doc.setFont(undefined, 'bold');
doc.text(`GST (${gstPercent}%)`, pageWidth - margin - 40, yPos);
doc.text(`₹${gstAmount.toLocaleString('en-IN')}`, pageWidth - margin - 2, yPos, { align: 'right' });

yPos += 4;
doc.setFont(undefined, 'bold');
doc.text('TOTAL', pageWidth - margin - 40, yPos);
doc.text(`₹${grandTotal.toLocaleString('en-IN')}`, pageWidth - margin - 2, yPos, { align: 'right' });

    // ===== FOOTER (LAST PAGE ONLY) =====
    let footerY = pageHeight - 34;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.text('We Specialize in', pageWidth / 2, footerY, { align: 'center' });

    footerY += 4;
     doc.setFontSize(9);
    doc.text(
      'Pipe pieces, clamps, nails, ceramic materials, PVC caps,',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );


    footerY += 4;
       doc.setFontSize(10);
    doc.text(
      'cemented or painted items',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    footerY += 4;
    doc.setFont(undefined, 'bold');
     doc.setFontSize(11);
    doc.text('NOTE:', pageWidth / 2, footerY, { align: 'center' });

    doc.setFont(undefined, 'normal');
    footerY += 4;
     doc.setFontSize(9);
    doc.text(
      'Used products, and products without their original box',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    footerY += 4;
     doc.setFontSize(9);
    doc.text(
      'will not be accepted for return.',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    footerY += 4;
     doc.setFontSize(9);
    doc.text(
      'Return materials may only be brought after 4:00 PM.',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

  doc.save(`Estimation_${customer?.name || 'Customer'}_${new Date().toISOString().slice(0,10)}.pdf`);


  } catch (e) {
    console.error(e);
    alert('Failed to generate estimation PDF');
  }
};


const generateTaxInvoicePDF = (saleData = null) => {
    try {
    const doc = new jsPDF({ format: 'a5', orientation: 'portrait' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 6;

    // footer + page break limits
    const footerHeight = 34;
    const bottomLimit = pageHeight - footerHeight - 4;

    const items = saleData?.items || cartItems;
    const customerData = saleData?.customer || customer;

    if (!items || items.length === 0) {
      alert('No items in cart');
      return;
    }

    let yPos = margin + 2;

    // ===== SHOP HEADER =====
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('AASHA HARDWARE, PLUMBING & ELECTRICALS', pageWidth / 2, yPos, { align: 'center' });

    yPos += 6;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text('Hardware, Polish Items & Paints Available', pageWidth / 2, yPos, { align: 'center' });

    yPos += 3.4;
    doc.text('N.T Agraharam, 4th line', pageWidth / 2, yPos, { align: 'center' });

    yPos += 3.4;
    doc.text('Mahaboob Nagar, Guntur', pageWidth / 2, yPos, { align: 'center' });
    
     yPos += 3.4;
    doc.setFont(undefined, 'bold');
    doc.text('Proprietor: M.Abdulla', pageWidth / 2, yPos, { align: 'center' });

    yPos += 3.4;
    doc.text('Ph no: 9246525552', pageWidth / 2, yPos, { align: 'center' });

    // ===== TITLE =====
    yPos += 6;
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('TAX INVOICE', pageWidth / 2, yPos, { align: 'center' });

    // ===== CUSTOMER =====
    yPos += 4;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);

    doc.text(
      `Name: ${customerData?.name ? customerData.name : '____________________________'}`,
      margin,
      yPos +=3
    );

    yPos += 5;
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, margin, yPos);

    if (customerData?.phone) {
      yPos += 3;
      doc.text(`Phone: ${customerData.phone}`, margin, yPos);
    }

    if (customerData?.email) {
      yPos += 3;
      doc.text(`Email: ${customerData.email}`, margin, yPos);
    }

    yPos += 3;
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // ===== TABLE HEADER =====
    yPos += 3;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(7);
    doc.text('S. No', margin + 1, yPos);
    doc.text('PARTICULARS', margin + 12, yPos);
    doc.text('Qty', pageWidth - margin - 30, yPos);
    doc.text('Amount', pageWidth - margin - 2, yPos, { align: 'right' });

    yPos += 2;
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 4;

    // ===== ITEMS =====
    doc.setFont(undefined, 'normal');
    let subTotal = 0;

    items.forEach((item, index) => {
      // PAGE BREAK CHECK
      if (yPos > bottomLimit) {
        doc.addPage();
        yPos = margin + 10;

        // repeat table header
        doc.setFont(undefined, 'bold');
        doc.setFontSize(7);
        doc.text('S. No', margin + 1, yPos);
        doc.text('PARTICULARS', margin + 12, yPos);
        doc.text('Qty', pageWidth - margin - 30, yPos);
        doc.text('Amount', pageWidth - margin - 2, yPos, { align: 'right' });

        yPos += 4;
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 2.5;
        doc.setFont(undefined, 'normal');
      }

      const qty = item.quantity || 0;
      const price = item.price || 0;
      const amount = qty * price;
      subTotal += amount;
doc.setFontSize(10);
      doc.text(String(index + 1), margin + 1, yPos);
      doc.text(item.name.substring(0, 30), margin + 12, yPos);
      doc.text(String(qty), pageWidth - margin - 30, yPos);
      doc.text(`₹${amount.toLocaleString('en-IN')}`, pageWidth - margin - 2, yPos, { align: 'right' });

      yPos += 4.5;
    });

    // ===== TOTAL (SAFE) =====
  // ===== TOTAL (SAFE) =====
if (yPos > bottomLimit - 10) {
  doc.addPage();
  yPos = margin + 10;
}

const gstPercent = saleData?.gstRate ?? effectiveRate ?? 0;
const gstAmount = subTotal * (gstPercent / 100);
const grandTotal = subTotal + gstAmount;

doc.line(margin, yPos, pageWidth - margin, yPos);
yPos += 3;

doc.setFont(undefined, 'bold');
doc.text('Subtotal', pageWidth - margin - 40, yPos);
doc.text(`₹${subTotal.toLocaleString('en-IN')}`, pageWidth - margin - 2, yPos, { align: 'right' });

yPos += 4;
doc.setFont(undefined, 'bold');
doc.text(`GST (${gstPercent}%)`, pageWidth - margin - 40, yPos);
doc.text(`₹${gstAmount.toLocaleString('en-IN')}`, pageWidth - margin - 2, yPos, { align: 'right' });

yPos += 4;
doc.setFont(undefined, 'bold');
doc.text('TOTAL', pageWidth - margin - 40, yPos);
doc.text(`₹${grandTotal.toLocaleString('en-IN')}`, pageWidth - margin - 2, yPos, { align: 'right' });

    // ===== FOOTER (LAST PAGE ONLY) =====
    let footerY = pageHeight - 34;

    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    doc.text('We Specialize in', pageWidth / 2, footerY, { align: 'center' });

    footerY += 4;
     doc.setFontSize(9);
    doc.text(
      'Pipe pieces, clamps, nails, ceramic materials, PVC caps,',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );


    footerY += 4;
       doc.setFontSize(10);
    doc.text(
      'cemented or painted items',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    footerY += 4;
    doc.setFont(undefined, 'bold');
     doc.setFontSize(11);
    doc.text('NOTE:', pageWidth / 2, footerY, { align: 'center' });

    doc.setFont(undefined, 'normal');
    footerY += 4;
     doc.setFontSize(9);
    doc.text(
      'Used products, and products without their original box',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    footerY += 4;
     doc.setFontSize(9);
    doc.text(
      'will not be accepted for return.',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );

    footerY += 4;
     doc.setFontSize(9);
    doc.text(
      'Return materials may only be brought after 4:00 PM.',
      pageWidth / 2,
      footerY,
      { align: 'center' }
    );
doc.save(`Invoice_${saleData?.invoiceNo || Date.now()}.pdf`);

  
  } catch (e) {
    console.error(e);
    alert('Failed to generate tax invoice');
  }
};


  const handleCompleteSale = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare sale data for new demo endpoint
      const saleData = {
        cashierId: JSON.parse(localStorage.getItem('user'))?.id || 1,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        customer: customer.name ? customer : null,
        gstRate: Number.isFinite(gstRate) ? gstRate : 0
      };
      
      // Save sale to database using new endpoint
      await salesAPI.createFromCart(saleData);
      
      // Generate Transaction PDF after successful save (NOT Quotation)
      setTimeout(() => {
        generateTaxInvoicePDF(saleData);
      }, 100);
      
      // Clear cart after successful save
      setCartItems([]);
      setCustomer({ name: '', phone: '', email: '', address: '' });
      setShowCustomerForm(false);
      
      // Show success message without blocking PDF
      setTimeout(() => {
        alert(`Sale completed! Total: ₹${total.toLocaleString('en-IN')}\nTransaction saved successfully.`);
      }, 200);
      
    } catch (err) {
      console.error('Error completing sale:', err);
      alert('Failed to complete sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Billing Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Sales & Billing</h2>
            
            {/* Product Search */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search by Product ID (e.g., 001)"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{product.customId || '—'}</span>
                          <span className="text-gray-500 ml-2">{product.name}</span>
                          <span className="text-sm text-blue-600 ml-2">Stock: {product.stockQuantity || product.stock || 0}</span>
                        </div>
                        <span className="font-bold text-green-600">₹{product.price?.toLocaleString('en-IN') || '0'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Items Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cartItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          No items in cart. Search and add products above.
                        </td>
                      </tr>
                    ) : (
                      cartItems.map((item, index) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{item.name}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                inputMode="numeric"
                                value={item.quantity}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  const parsed = parseInt(raw, 10);
                                  const hasMax = Number.isFinite(item.stockQuantity) || Number.isFinite(item.stock);
                                  const maxQty = Number.isFinite(item.stockQuantity)
                                    ? item.stockQuantity
                                    : Number.isFinite(item.stock) ? item.stock : undefined;

                                  let next = Number.isFinite(parsed) ? parsed : 1;
                                  if (next < 1) next = 1;
                                  if (hasMax && Number.isFinite(maxQty)) next = Math.min(next, maxQty);
                                  updateQuantity(item.id, next);
                                }}
                                className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Set quantity"
                              />
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                            ₹{item.price?.toLocaleString('en-IN') || '0'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                            ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-900 font-medium text-sm"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {cartItems.length > 0 && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-700">
                    <div className="flex items-center space-x-2">
                      <label className="text-gray-700">GST (%)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={Number.isFinite(gstRate) ? gstRate : ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          const next = Number.isFinite(val) ? val : 0;
                          setGstRate(next);
                          try { localStorage.setItem('gstRate', String(next)); } catch {}
                        }}
                        className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 18"
                      />
                    </div>
                    <span>₹{tax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2">
                    <span>Total:</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => setShowCustomerForm(!showCustomerForm)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    {showCustomerForm ? 'Hide Customer Form' : 'Add Customer Details'}
                  </button>
                  <button
                    onClick={generateEstimationPDF}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    Estimation
                  </button>
                  <button
                    onClick={handleCompleteSale}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  >
                    {loading ? 'Processing...' : 'Tax Invoice'}
                  </button>
                </div>
                
                {/* Customer Form */}
                {showCustomerForm && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Customer Name"
                        value={customer.name}
                        onChange={(e) => setCustomer({...customer, name: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={customer.phone}
                        onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Email (Optional)"
                        value={customer.email}
                        onChange={(e) => setCustomer({...customer, email: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Address (Optional)"
                        value={customer.address}
                        onChange={(e) => setCustomer({...customer, address: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Available Items Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Available Items</h3>
            
            {loading ? (
              <div className="text-center text-gray-500 py-8">
                Loading items...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No products available
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden">
                  <table className="w-full text-sm table-fixed">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-gray-600 w-1/4">Product ID</th>
                        <th className="px-3 py-2 text-left text-gray-600 w-1/2">Product Name</th>
                        <th className="px-3 py-2 text-right text-gray-600 w-1/4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 truncate">{product.customId || '—'}</td>
                          <td className="px-3 py-2 truncate">{product.name}</td>
                          <td className="px-3 py-2 text-right">
                            <button
                              onClick={() => addToCart(product)}
                              disabled={(product.stockQuantity || product.stock || 0) === 0}
                              className={(product.stockQuantity || product.stock || 0) === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed px-3 py-1 rounded text-xs'
                                : 'bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs'}
                            >
                              {(product.stockQuantity || product.stock || 0) === 0 ? 'Out' : 'Add'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
