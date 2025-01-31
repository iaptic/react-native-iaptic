import { IapticRN } from "../IapticRN";
import { IapticVerifiedPurchase } from "../types";
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A transaction that has occurred
 */
interface TokenTransaction {
    /** Unique identifier from the store */
    transactionId: string;
  
    /** Type of token (e.g., 'gem', 'coin', 'credit') */
    type: string;

    /** Number of tokens earned (positive) or spent (negative) for this transaction */
    amount: number;
  
    /** When the transaction occurred */
    timestamp: number;
}

/**
 * Simple token balance manager that uses localStorage to store transactions.
 * 
 * To do this, this class the list of all transactions and their corresponding amounts.
 * 
 * When a transaction is added, it is added to the list.
 * When a transaction is removed, it is removed from the list.
 * 
 * The balance is the sum of all the amounts in the list.
 * 
 * @see IapticProductDefinition.tokenType
 * @see IapticProductDefinition.tokenValue
 * 
 * @example
 * ```typescript
 * const tokensManager = new TokensManager(iaptic);
 * // ... tokensManager is now tracking consumable purchases that have a tokenType defined.
 * const balance = tokensManager.getBalance('coin');
 * ```
 */
export class TokensManager {
  
    /**
     * Using a Map with transactionId as key ensures each transaction is only stored once
     */
    private transactions: Map<string, TokenTransaction>;

    /**
     * Key used to store transactions in localStorage
     */
    private storageKey = 'iaptic_tokens_transactions';
  
    constructor(consumePurchases: boolean = true) {
      this.storageKey = (IapticRN.getStore().config.appName ?? 'app') + '.tokens.iaptic';
      this.transactions = new Map();
      this.loadTransactions(); // Load stored transactions when instantiated
      IapticRN.getStore().addEventListener('consumable.purchased', (purchase: IapticVerifiedPurchase) => {
        const product = IapticRN.getStore().products.getDefinition(purchase.id);
        if (product && product.tokenValue && product.tokenType) {
          this.addTransaction(this.typeSafeTransactionId(purchase), product.tokenType, product.tokenValue);
        }
        if (consumePurchases) {
          IapticRN.consume(purchase);
        }
      }, 'TokensManager');
      IapticRN.getStore().addEventListener('consumable.refunded', (purchase: IapticVerifiedPurchase) => {
        this.removeTransaction(this.typeSafeTransactionId(purchase));
      }, 'TokensManager');
    }

    private typeSafeTransactionId(purchase: IapticVerifiedPurchase): string {
      return purchase.transactionId ?? purchase.purchaseId ?? purchase.id;
    }
  
    /**
     * Load transactions from localStorage
     */
    private async loadTransactions() {
      try {
        const storedTransactions = await AsyncStorage.getItem(this.storageKey);
        if (storedTransactions) {
          const parsedTransactions: TokenTransaction[] = JSON.parse(storedTransactions);
          this.transactions = new Map(
            parsedTransactions.map(t => [t.transactionId, t])
          );
        }
      } catch (error) {
        console.warn('Failed to load transactions:', error);
      }
    }
  
    /**
     * Save current transactions to localStorage
     */
    private async saveTransactions() {
      const transactionsArray = Array.from(this.transactions.values());
      await AsyncStorage.setItem(
        this.storageKey,
        JSON.stringify(transactionsArray)
      );
    }
  
    /**
     * Add a transaction to the map and persist it
     * 
     * @param transactionId - Unique identifier for the transaction
     * @param type - Type of token (e.g., 'gems', 'coins', 'credits')
     * @param amount - Number of tokens earned (positive) or spent (negative)
     */
    async addTransaction(transactionId: string, type: string, amount: number) {
      this.transactions.set(transactionId, {
        transactionId,
        type,
        amount,
        timestamp: Date.now()
      });
      await this.saveTransactions();
    }
  
    /**
     * Remove a transaction and update storage
     */
    async removeTransaction(transactionId: string) {
      this.transactions.delete(transactionId);
      await this.saveTransactions();
    }
  
    /**
     * Get balance for a specific token type
     */
    getBalance(tokenType: string): number {
      let total = 0;
      this.transactions.forEach(transaction => {
        if (transaction.type === tokenType) {
          total += transaction.amount;
        }
      });
      return total;
    }
  
    /**
     * Get all balances as a map of token type to amount
     */
    getAllBalances(): Map<string, number> {
      const balances = new Map<string, number>();
      
      this.transactions.forEach(transaction => {
        const currentBalance = balances.get(transaction.type) || 0;
        balances.set(transaction.type, currentBalance + transaction.amount);
      });

      return balances;
    }
  
    /**
     * Helper method to check if we've already processed a transaction
     * This can be used before processing a purchase to avoid double-counting
     */
    hasTransaction(transactionId: string): boolean {
      return this.transactions.has(transactionId);
    }
  
    /**
     * Get transaction history for a specific token type
     */
    getTransactions(tokenType?: string): TokenTransaction[] {
      const transactions = Array.from(this.transactions.values());
      return tokenType 
        ? transactions.filter(t => t.type === tokenType)
        : transactions;
    }
  } 