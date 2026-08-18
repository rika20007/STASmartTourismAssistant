import React, { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import type { Currency } from '@/services/currency';

export interface WalletTransaction {
  id: string;
  type: 'topup' | 'payment' | 'refund';
  amountDZD: number;
  merchant?: string;
  createdAt: number;
  status: 'completed' | 'pending' | 'failed';
}

export type PayReason = 'INVALID_AMOUNT' | 'INSUFFICIENT';

export interface WalletContextType {
  balanceDZD: number;
  preferredCurrency: Currency;
  transactions: WalletTransaction[];
  setPreferredCurrency: (c: Currency) => void;
  topUp: (amount: number) => WalletTransaction;
  pay: (
    amount: number,
    merchant: string
  ) => { ok: boolean; tx?: WalletTransaction; reason?: PayReason };
  reset: () => void;
}

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

const seedTransactions: WalletTransaction[] = [
  {
    id: 't_seed_1',
    type: 'topup',
    amountDZD: 20000,
    merchant: 'STA Airport Counter · Algiers',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    status: 'completed',
  },
  {
    id: 't_seed_2',
    type: 'payment',
    amountDZD: 2200,
    merchant: 'Dar El Bahdja',
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    status: 'completed',
  },
];

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balanceDZD, setBalanceDZD] = useState<number>(17800);
  const [preferredCurrency, setPreferredCurrency] = useState<Currency>('EUR');
  const [transactions, setTransactions] = useState<WalletTransaction[]>(seedTransactions);

  const topUp = useCallback((amount: number) => {
    const tx: WalletTransaction = {
      id: `t_${Date.now()}`,
      type: 'topup',
      amountDZD: amount,
      merchant: 'STA Airport Counter',
      createdAt: Date.now(),
      status: 'completed',
    };
    setBalanceDZD((b) => b + amount);
    setTransactions((list) => [tx, ...list]);
    return tx;
  }, []);

  const pay = useCallback(
    (amount: number, merchant: string) => {
      if (amount <= 0) return { ok: false, reason: 'INVALID_AMOUNT' as PayReason };
      if (amount > balanceDZD) return { ok: false, reason: 'INSUFFICIENT' as PayReason };
      const tx: WalletTransaction = {
        id: `t_${Date.now()}`,
        type: 'payment',
        amountDZD: amount,
        merchant,
        createdAt: Date.now(),
        status: 'completed',
      };
      setBalanceDZD((b) => b - amount);
      setTransactions((list) => [tx, ...list]);
      return { ok: true, tx };
    },
    [balanceDZD]
  );

  const reset = useCallback(() => {
    setBalanceDZD(17800);
    setTransactions(seedTransactions);
  }, []);

  const value = useMemo<WalletContextType>(
    () => ({
      balanceDZD,
      preferredCurrency,
      transactions,
      setPreferredCurrency,
      topUp,
      pay,
      reset,
    }),
    [balanceDZD, preferredCurrency, transactions, topUp, pay, reset]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}
