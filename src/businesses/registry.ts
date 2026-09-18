import { BusinessIndustryConfig, BusinessIndustryId, BusinessProduct, BusinessOrder, BusinessStats } from './types';
import { glassesBusinessConfig } from './glasses/data';
import { clothesBusinessConfig } from './clothes/data';
import { foodBusinessConfig } from './food/data';
import { electronicsBusinessConfig } from './electronics/data';
import { phonesBusinessConfig } from './phones/data';

export const ALL_BUSINESSES: Record<BusinessIndustryId, BusinessIndustryConfig> = {
  glasses: glassesBusinessConfig,
  clothes: clothesBusinessConfig,
  food: foodBusinessConfig,
  electronics: electronicsBusinessConfig,
  phones: phonesBusinessConfig,
};

export const BUSINESS_IDS: BusinessIndustryId[] = ['glasses', 'clothes', 'food', 'electronics', 'phones'];

class BusinessStorageManager {
  private getStorageKey(businessId: BusinessIndustryId, entity: string): string {
    return `freelance_biz_${businessId}_${entity}`;
  }

  // Get products for a business with local overrides
  getProducts(businessId: BusinessIndustryId): BusinessProduct[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(businessId, 'products'));
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading business products', e);
    }
    const initial = ALL_BUSINESSES[businessId].sampleProducts;
    this.saveProducts(businessId, initial);
    return initial;
  }

  saveProducts(businessId: BusinessIndustryId, products: BusinessProduct[]): void {
    try {
      localStorage.setItem(this.getStorageKey(businessId, 'products'), JSON.stringify(products));
    } catch (e) {
      console.error('Error saving business products', e);
    }
  }

  // Stock manipulation
  updateStock(businessId: BusinessIndustryId, productId: string, delta: number): void {
    const products = this.getProducts(businessId);
    const updated = products.map((p) => {
      if (p.id === productId) {
        const nextStock = Math.max(0, p.stock + delta);
        return { ...p, stock: nextStock };
      }
      return p;
    });
    this.saveProducts(businessId, updated);
  }

  // Price adjustment
  updatePrice(businessId: BusinessIndustryId, productId: string, newPrice: number): void {
    const products = this.getProducts(businessId);
    const updated = products.map((p) => {
      if (p.id === productId) {
        return { ...p, price: Math.max(1, newPrice) };
      }
      return p;
    });
    this.saveProducts(businessId, updated);
  }

  // Add product
  addProduct(businessId: BusinessIndustryId, newProduct: BusinessProduct): void {
    const products = this.getProducts(businessId);
    this.saveProducts(businessId, [newProduct, ...products]);
  }

  // Delete product
  deleteProduct(businessId: BusinessIndustryId, productId: string): void {
    const products = this.getProducts(businessId);
    this.saveProducts(businessId, products.filter((p) => p.id !== productId));
  }

  // Orders
  getOrders(businessId: BusinessIndustryId): BusinessOrder[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(businessId, 'orders'));
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading business orders', e);
    }
    const initial = ALL_BUSINESSES[businessId].sampleOrders;
    this.saveOrders(businessId, initial);
    return initial;
  }

  saveOrders(businessId: BusinessIndustryId, orders: BusinessOrder[]): void {
    try {
      localStorage.setItem(this.getStorageKey(businessId, 'orders'), JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving business orders', e);
    }
  }

  updateOrderStatus(
    businessId: BusinessIndustryId,
    orderId: string,
    status: BusinessOrder['fulfillmentStatus']
  ): void {
    const orders = this.getOrders(businessId);
    const updated = orders.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus: status } : o));
    this.saveOrders(businessId, updated);
  }

  addOrder(businessId: BusinessIndustryId, order: BusinessOrder): void {
    const orders = this.getOrders(businessId);
    this.saveOrders(businessId, [order, ...orders]);
  }

  // Dynamic live stats calculation for the business
  getStats(businessId: BusinessIndustryId): BusinessStats {
    const products = this.getProducts(businessId);
    const orders = this.getOrders(businessId);

    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 8).length;
    const grossRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + ALL_BUSINESSES[businessId].initialStats.grossRevenue;
    const netProfit = Math.round(grossRevenue * 0.68);

    return {
      grossRevenue,
      netProfit,
      orderCount: orders.length + ALL_BUSINESSES[businessId].initialStats.orderCount,
      totalUnitsInStock: totalStock,
      lowStockCount: lowStock,
      activeUsers: ALL_BUSINESSES[businessId].initialStats.activeUsers + Math.floor(Math.random() * 5),
      conversionRate: ALL_BUSINESSES[businessId].initialStats.conversionRate,
    };
  }

  // Reset to original seed for demo
  resetBusiness(businessId: BusinessIndustryId): void {
    this.saveProducts(businessId, ALL_BUSINESSES[businessId].sampleProducts);
    this.saveOrders(businessId, ALL_BUSINESSES[businessId].sampleOrders);
  }
}

export const businessStorage = new BusinessStorageManager();

/**
 * Returns the exact folder & file structure that the freelancer can replicate in C:\Users\HANI\Desktop\freelance\
 */
export function getBusinessFolderTemplate(businessId: BusinessIndustryId) {
  const config = ALL_BUSINESSES[businessId];
  return {
    rootPath: `C:\\Users\\HANI\\Desktop\\freelance\\${config.folderName}`,
    files: [
      {
        path: `C:\\Users\\HANI\\Desktop\\freelance\\${config.folderName}\\${config.folderName}website\\package.json`,
        type: 'client_storefront',
        description: 'Responsive React + Vite Storefront for customer sales',
      },
      {
        path: `C:\\Users\\HANI\\Desktop\\freelance\\${config.folderName}\\${config.folderName}desktopapp\\package.json`,
        type: 'owner_desktop_app',
        description: 'Desktop OS App for owner stock control, money stats & PDF reports',
      },
      {
        path: `C:\\Users\\HANI\\Desktop\\freelance\\${config.folderName}\\backend-flask\\app.py`,
        type: 'flask_api',
        description: 'Python Flask REST API with PyMongo endpoints',
      },
      {
        path: `C:\\Users\\HANI\\Desktop\\freelance\\${config.folderName}\\mongodb-dataset\\${config.id}_dataset.json`,
        type: 'mongo_dataset',
        description: 'Localhost MongoDB collection seed dump with products & orders',
      },
    ],
  };
}
