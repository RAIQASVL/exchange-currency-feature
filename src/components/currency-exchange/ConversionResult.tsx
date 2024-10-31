import { ConversionResult, Currency } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface ConversionResultViewProps {
    result: ConversionResult;
    fromCurrency: Currency;
    toCurrency: Currency;
    isError?: boolean; // Prop for error state
}

export function ConversionResultView({
    result,
    fromCurrency,
    toCurrency,
    isError = false
}: ConversionResultViewProps) {
    // Dynamic classes based on error state
    const containerClass = isError
        ? "bg-red-50 rounded-lg p-4 space-y-3 border border-red-200"
        : "bg-green-50 rounded-lg p-4 space-y-3 border border-green-200";

    const headerClass = isError
        ? "flex items-center justify-center gap-2 text-red-800"
        : "flex items-center justify-center gap-2 text-green-800";

    return (
        <div className={containerClass}>
            <div className={headerClass}>
                {isError ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                <h3 className="font-medium">
                    {isError ? 'Insufficient Funds' : 'Conversion Preview'}
                </h3>
            </div>

            <div className="bg-white rounded p-3 space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600">You send:</span>
                    <strong className={isError ? "text-red-600" : "text-gray-900"}>
                        {formatCurrency(result.fromAmount, fromCurrency)}
                    </strong>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">They receive:</span>
                    <strong className={isError ? "text-red-600" : "text-gray-900"}>
                        {formatCurrency(result.toAmount, toCurrency)}
                    </strong>
                </div>
                <div className={`text-sm ${isError ? 'text-red-500' : 'text-gray-500'} pt-2 border-t`}>
                    <div>Rate: 1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}</div>
                    <div>Fee: {formatCurrency(result.fee, toCurrency)}</div>
                </div>
            </div>
        </div>
    );
}