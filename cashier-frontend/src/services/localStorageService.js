// Local Storage Service to simulate database operations
class LocalStorageService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Initialize products if not exists
    if (!localStorage.getItem('products')) {
      const initialProducts = [
        { id: 1, name: "LED Bulb 9W", category: "Electrical", price: 120, stock: 100, createdAt: new Date().toISOString() },
        { id: 2, name: "PVC Pipe 1\"", category: "Plumbing", price: 90, stock: 80, createdAt: new Date().toISOString() },
        { id: 3, name: "Hammer", category: "Hardware", price: 350, stock: 40, createdAt: new Date().toISOString() },
        { id: 4, name: "Wire 1.5mm (90m)", category: "Electrical", price: 1450, stock: 25, createdAt: new Date().toISOString() },
        { id: 5, name: "Elbow Joint 1/2\"", category: "Plumbing", price: 25, stock: 150, createdAt: new Date().toISOString() },
        { id: 6, name: "Screwdriver Set", category: "Hardware", price: 299, stock: 60, createdAt: new Date().toISOString() },
        { id: 7, name: "Switch (2 Way)", category: "Electrical", price: 85, stock: 120, createdAt: new Date().toISOString() },
        { id: 8, name: "Water Tap", category: "Plumbing", price: 220, stock: 50, createdAt: new Date().toISOString() },
        { id: 9, name: "Drill Bits (Set)", category: "Hardware", price: 499, stock: 35, createdAt: new Date().toISOString() },
        { id: 10, name: "MCB 16A", category: "Electrical", price: 320, stock: 30, createdAt: new Date().toISOString() }
      ];
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }

    // Initialize sales if not exists
    if (!localStorage.getItem('sales')) {
      localStorage.setItem('sales', JSON.stringify([]));
    }

    // Initialize next IDs
    if (!localStorage.getItem('nextProductId')) {
      localStorage.setItem('nextProductId', '11');
    }
    if (!localStorage.getItem('nextSaleId')) {
      localStorage.setItem('nextSaleId', '1');
    }
  }

  // Product operations
  async getAllProducts() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    return { data: products };
  }

  async getProductById(id) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === parseInt(id));
    return product ? { data: product } : null;
  }

  async searchProducts(query) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    return { data: filtered };
  }

  async createProduct(productData) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const nextId = parseInt(localStorage.getItem('nextProductId'));
    
    const newProduct = {
      id: nextId,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('nextProductId', (nextId + 1).toString());
    
    return { data: newProduct };
  }

  async updateProduct(id, productData) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const index = products.findIndex(p => p.id === parseInt(id));
    
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...productData,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem('products', JSON.stringify(products));
      return { data: products[index] };
    }
    throw new Error('Product not found');
  }

  async deleteProduct(id) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const filtered = products.filter(p => p.id !== parseInt(id));
    localStorage.setItem('products', JSON.stringify(filtered));
    return { data: { success: true } };
  }

  // Sales operations
  async getAllSales() {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    return { data: sales };
  }

  async createSale(saleData) {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const nextId = parseInt(localStorage.getItem('nextSaleId'));
    
    const newSale = {
      id: `TXN${nextId.toString().padStart(3, '0')}`,
      ...saleData,
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN'),
      createdAt: new Date().toISOString()
    };
    
    sales.push(newSale);
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('nextSaleId', (nextId + 1).toString());
    
    // Update product stock
    await this.updateProductStock(saleData.items);
    
    return { data: newSale };
  }

  async updateProductStock(items) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    items.forEach(item => {
      const productIndex = products.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) {
        products[productIndex].stock -= item.quantity;
      }
    });
    
    localStorage.setItem('products', JSON.stringify(products));
  }

  // Dashboard stats
  async getDashboardStats() {
    const sales = JSON.parse(localStorage.getItem('sales') || '[]');
    const completedSales = sales.filter(s => s.status === 'Completed');
    const refundedSales = sales.filter(s => s.status === 'Refunded');
    
    const totalSales = completedSales.reduce((sum, sale) => sum + sale.total, 0);
    
    return {
      data: {
        totalSales,
        totalTransactions: completedSales.length,
        refundedTransactions: refundedSales.length
      }
    };
  }
}

export default new LocalStorageService();
