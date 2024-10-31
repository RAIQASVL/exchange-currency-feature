import { useState, useCallback } from 'react';
import { Account, ConversionResult, Currency } from '@/types';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { calculateConversion } from '@/lib/api/mock';
import { ConversionResultView } from './ConversionResult';
import { SuccessMessage } from './SuccessMessage';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';

interface ConversionFormProps {
    accounts: Account[];
}

export function ConversionForm({ accounts }: ConversionFormProps) {
    const [fromAccountId, setFromAccountId] = useState('');
    const [toAccountId, setToAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ConversionResult | null>(null);
    const [transactionId, setTransactionId] = useState<string>('');
    const { getRate } = useExchangeRates();

    const fromAccount = accounts.find(acc => acc.id === fromAccountId);
    const toAccount = accounts.find(acc => acc.id === toAccountId);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fromAccount || !toAccount || !amount) return;

        const rate = getRate(fromAccount.currency, toAccount.currency);
        if (rate === 0) return;

        setLoading(true);
        try {
            const result = await calculateConversion(Number(amount), rate);
            setResult(result);
            setTransactionId(`TX-${Date.now().toString(36)}`);
        } catch (error) {
            console.error('Conversion failed:', error);
        } finally {
            setLoading(false);
        }
    }, [fromAccount, toAccount, amount, getRate]);

    const resetForm = useCallback(() => {
        setFromAccountId('');
        setToAccountId('');
        setAmount('');
        setResult(null);
        setTransactionId('');
    }, []);

    return (
        <div className="space-y-6 max-w-lg mx-auto">
            {result && transactionId && fromAccount && toAccount ? (
                <>
                    <SuccessMessage
                        result={result}
                        fromCurrency={fromAccount.currency}
                        toCurrency={toAccount.currency}
                        transactionId={transactionId}
                    />
                    <button
                        onClick={resetForm}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        New Conversion
                    </button>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            From Account
                        </label>
                        <select
                            value={fromAccountId}
                            onChange={(e) => {
                                setFromAccountId(e.target.value);
                                setResult(null);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select account</option>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.name} - {formatCurrency(account.balance, account.currency)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            To Account
                        </label>
                        <select
                            value={toAccountId}
                            onChange={(e) => {
                                setToAccountId(e.target.value);
                                setResult(null);
                            }}
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            disabled={!fromAccountId}
                        >
                            <option value="">Select account</option>
                            {accounts
                                .filter(acc => acc.id !== fromAccountId)
                                .map(account => (
                                    <option key={account.id} value={account.id}>
                                        {account.name} - {formatCurrency(account.balance, account.currency)}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setResult(null);
                            }}
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            placeholder={fromAccount ? `Max: ${fromAccount.balance}` : "Enter amount"}
                            disabled={!fromAccountId || !toAccountId}
                        />
                        {fromAccount && (
                            <p className="text-sm text-gray-500 mt-1">
                                Available: {formatCurrency(fromAccount.balance, fromAccount.currency)}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !fromAccountId || !toAccountId || !amount}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <LoadingSpinner />
                                Converting...
                            </span>
                        ) : (
                            'Convert'
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}