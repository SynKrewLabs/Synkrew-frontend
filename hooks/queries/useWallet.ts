/**
 * SynKrew — Wallet & Transactions Query Hooks
 * Path: hooks/queries/useWallet.ts
 */

import { useQuery } from '@tanstack/react-query';
import { WalletService } from '../../services/wallet';

export const WALLET_QUERY_KEYS = {
  all: ['wallet'] as const,
  balance: () => [...WALLET_QUERY_KEYS.all, 'balance'] as const,
  history: (groupId?: string) => [...WALLET_QUERY_KEYS.all, 'history', groupId || 'all'] as const,
};

export function useWalletBalanceQuery() {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.balance(),
    queryFn: () => WalletService.getWalletBalance(),
  });
}

export function useTransactionHistoryQuery(groupId?: string) {
  return useQuery({
    queryKey: WALLET_QUERY_KEYS.history(groupId),
    queryFn: () => WalletService.getTransactionHistory(groupId),
  });
}
