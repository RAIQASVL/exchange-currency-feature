'use client';

import dynamic from 'next/dynamic';
import { useAccounts } from '@/hooks/useAccounts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Dynamically import the ConversionForm component with no SSR
const ConversionForm = dynamic(
    () => import('@/components/currency-exchange/ConversionForm').then(mod => mod.ConversionForm),
    {
        ssr: false,
        loading: () => (
            <div className="flex justify-center p-8">
                <LoadingSpinner />
            </div>
        )
    }
);

export default function Home() {
    const { accounts, loading: loadingAccounts, error: accountsError } = useAccounts();

    if (loadingAccounts) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-2 text-gray-600">Loading accounts...</p>
                </div>
            </div>
        );
    }

    if (accountsError) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="bg-red-50 text-red-800 rounded-lg p-4 max-w-md">
                    <h3 className="text-lg font-medium mb-2">Error</h3>
                    <p>{accountsError.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Currency Exchange
                </h1>

                <ConversionForm
                    accounts={accounts}
                    onConvert={async ({ fromAccountId, toAccountId, amount }) => {
                        const fromAccount = accounts.find(acc => acc.id === fromAccountId);
                        const toAccount = accounts.find(acc => acc.id === toAccountId);

                        if (!fromAccount || !toAccount) {
                            throw new Error('Invalid accounts selected');
                        }

                        // Simulate API call with consistent result
                        return {
                            fromAmount: parseFloat(amount),
                            toAmount: parseFloat(amount) * 1.1, // Example rate
                            rate: 1.1,
                            fee: parseFloat(amount) * 0.01,
                        };
                    }}
                />
            </div>
        </div>
    );
}