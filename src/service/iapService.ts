import {
  initConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  PurchaseError,
  Product,
  Purchase,
  SubscriptionPurchase,
} from 'react-native-iap';
import { Platform } from 'react-native';

// Product IDs for iOS and Android
const PRODUCT_IDS = {
  monthly: Platform.select({
    ios: 'com.rituali.monthly',
    android: 'com.rituali.monthly',
  }),
  yearly: Platform.select({
    ios: 'com.rituali.yearly',
    android: 'com.rituali.yearly',
  }),
};

export interface IAPProduct {
  productId: string;
  price: string;
  currency: string;
  localizedPrice: string;
  title: string;
  description: string;
  type: 'monthly' | 'yearly';
}

class IAPService {
  private isInitialized = false;
  private products: Product[] = [];

  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;

      await initConnection();
      this.isInitialized = true;
      console.log('IAP Service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize IAP Service:', error);
      throw error;
    }
  }

  async getProducts(): Promise<IAPProduct[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const productIds = Object.values(PRODUCT_IDS).filter(Boolean) as string[];
      this.products = await getProducts({ skus: productIds });

      return this.products.map((product) => ({
        productId: product.productId,
        price: product.price,
        currency: product.currency,
        localizedPrice: product.localizedPrice,
        title: product.title,
        description: product.description,
        type: product.productId.includes('monthly') ? 'monthly' : 'yearly',
      }));
    } catch (error) {
      console.error('Failed to get products:', error);
      throw error;
    }
  }

  async purchaseSubscription(type: 'monthly' | 'yearly'): Promise<Purchase | SubscriptionPurchase> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const productId = PRODUCT_IDS[type];
      if (!productId) {
        throw new Error(`Product ID not found for type: ${type}`);
      }

      console.log(`Attempting to purchase: ${productId}`);
      
      const purchase = await requestPurchase({
        sku: productId,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });

      if (!purchase) {
        throw new Error('Purchase failed: No purchase data received');
      }

      console.log('Purchase successful:', purchase);
      return purchase as Purchase | SubscriptionPurchase;
    } catch (error) {
      console.error('Purchase failed:', error);
      
      if (error instanceof PurchaseError) {
        switch (error.code) {
          case 'E_ALREADY_OWNED':
            throw new Error('You already own this subscription');
          case 'E_USER_CANCELLED':
            throw new Error('Purchase was cancelled');
          case 'E_ITEM_UNAVAILABLE':
            throw new Error('This item is not available for purchase');
          default:
            throw new Error(`Purchase failed: ${error.message}`);
        }
      }
      
      throw error;
    }
  }

  async finishTransaction(purchase: Purchase | SubscriptionPurchase): Promise<void> {
    try {
      await finishTransaction({
        purchase,
        isConsumable: false,
      });
      console.log('Transaction finished successfully');
    } catch (error) {
      console.error('Failed to finish transaction:', error);
      throw error;
    }
  }

  async validateReceipt(purchase: Purchase | SubscriptionPurchase): Promise<boolean> {
    try {
      return !!(purchase && purchase.transactionId);
    } catch (error) {
      console.error('Receipt validation failed:', error);
      return false;
    }
  }

  getProductById(productId: string): Product | undefined {
    return this.products.find(product => product.productId === productId);
  }

  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

export const iapService = new IAPService();
export default iapService; 