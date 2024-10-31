'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ConversionForm } from '@/components/currency-exchange/ConversionForm';
import { useAccounts } from '@/hooks/useAccounts';

export default function Home() {
    const { accounts, loading, error } = useAccounts();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="mt-2 text-gray-600">Loading accounts...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="bg-red-50 text-red-800 rounded-lg p-4 max-w-md">
                    <h3 className="text-lg font-medium mb-2">Error</h3>
                    <p>{error.message}</p>
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
                <ConversionForm accounts={accounts} />
            </div>
        </div>
    );
}