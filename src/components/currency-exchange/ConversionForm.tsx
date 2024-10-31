import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Account, ConversionResult, Currency } from '@/types';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { calculateConversion } from '@/lib/api/mock';
import { ConversionResultView } from './ConversionResult';
import { SuccessMessage } from './SuccessMessage';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { formatCurrency } from '@/utils/formatters';

const formSchema = z.object({
    fromAccountId: z.string().min(1, 'Please select source account'),
    toAccountId: z.string().min(1, 'Please select destination account'),
    amount: z.string()
        .min(1, 'Amount is required')
        .refine(val => !isNaN(Number(val)), 'Must be a valid number')
        .refine(val => Number(val) > 0, 'Amount must be greater than 0')
});

type FormData = z.infer<typeof formSchema>;

interface ConversionFormProps {
    accounts: Account[];
}

export function ConversionForm({ accounts }: ConversionFormProps) {
    const { getRate } = useExchangeRates();
    const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [success, setSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState<string>('');

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fromAccountId: '',
            toAccountId: '',
            amount: ''
        }
    });

    // Watch form values
    const fromAccountId = watch('fromAccountId');
    const toAccountId = watch('toAccountId');
    const amount = watch('amount');

    const fromAccount = accounts.find(acc => acc.id === fromAccountId);
    const toAccount = accounts.find(acc => acc.id === toAccountId);

    // Real-time conversion calculation
    useEffect(() => {
        const calculatePreview = async () => {
            if (!fromAccount || !toAccount || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
                setConversionResult(null);
                return;
            }

            const rate = getRate(fromAccount.currency, toAccount.currency);
            if (rate === 0) return;

            setIsCalculating(true);
            try {
                const result = await calculateConversion(Number(amount), rate);
                setConversionResult(result);
            } catch (error) {
                console.error('Preview calculation failed:', error);
                setConversionResult(null);
            } finally {
                setIsCalculating(false);
            }
        };

        calculatePreview();
    }, [fromAccount, toAccount, amount, getRate]);

    const validateAmount = (value: string) => {
        if (!fromAccount) return true;
        const numAmount = Number(value);
        return numAmount <= fromAccount.balance || 'Insufficient funds';
    };

    const onSubmit = useCallback(async (data: FormData) => {
        if (!fromAccount || !toAccount || !conversionResult) return;

        try {
            setSuccess(true);
            setTransactionId(`TX-${Date.now().toString(36).toUpperCase()}`);
        } catch (error) {
            console.error('Conversion failed:', error);
            setSuccess(false);
        }
    }, [fromAccount, toAccount, conversionResult]);

    const handleNewConversion = () => {
        reset();
        setConversionResult(null);
        setSuccess(false);
        setTransactionId('');
    };

    if (success && conversionResult && fromAccount && toAccount) {
        return (
            <div className="space-y-4">
                <SuccessMessage
                    result={conversionResult}
                    fromCurrency={fromAccount.currency}
                    toCurrency={toAccount.currency}
                    transactionId={transactionId}
                />
                <button
                    onClick={handleNewConversion}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    New Conversion
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-lg mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Controller
                    name="fromAccountId"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                From Account
                            </label>
                            <select
                                {...field}
                                className={`w-full px-3 py-2 rounded-md border 
                                    ${errors.fromAccountId ? 'border-red-500' : 'border-gray-300'}
                                    focus:ring-2 focus:ring-blue-500`}
                            >
                                <option value="">Select account</option>
                                {accounts.map(account => (
                                    <option key={account.id} value={account.id}>
                                        {account.name} - {formatCurrency(account.balance, account.currency)}
                                    </option>
                                ))}
                            </select>
                            {errors.fromAccountId && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.fromAccountId.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                <Controller
                    name="toAccountId"
                    control={control}
                    render={({ field }) => (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                To Account
                            </label>
                            <select
                                {...field}
                                className={`w-full px-3 py-2 rounded-md border 
                                    ${errors.toAccountId ? 'border-red-500' : 'border-gray-300'}
                                    focus:ring-2 focus:ring-blue-500`}
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
                            {errors.toAccountId && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.toAccountId.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                <Controller
                    name="amount"
                    control={control}
                    rules={{ validate: validateAmount }}
                    render={({ field }) => (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount
                            </label>
                            <input
                                type="number"
                                {...field}
                                min="0"
                                step="0.01"
                                className={`w-full px-3 py-2 rounded-md border 
                                    ${errors.amount ? 'border-red-500' : 'border-gray-300'}
                                    focus:ring-2 focus:ring-blue-500`}
                                placeholder={fromAccount ? `Max: ${fromAccount.balance}` : "Enter amount"}
                                disabled={!fromAccountId || !toAccountId}
                            />
                            {fromAccount && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Available: {formatCurrency(fromAccount.balance, fromAccount.currency)}
                                </p>
                            )}
                            {errors.amount && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.amount.message}
                                </p>
                            )}
                        </div>
                    )}
                />

                {/* Real-time conversion preview */}
                {conversionResult && fromAccount && toAccount && !errors.amount && (
                    <div className="rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Preview</span>
                            {isCalculating && <LoadingSpinner />}
                        </div>
                        <ConversionResultView
                            result={conversionResult}
                            fromCurrency={fromAccount.currency}
                            toCurrency={toAccount.currency}
                            isError={Number(amount) > fromAccount.balance}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || isCalculating || !conversionResult}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                        disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner />
                            Converting...
                        </span>
                    ) : (
                        'Convert'
                    )}
                </button>
            </form>
        </div>
    );
}