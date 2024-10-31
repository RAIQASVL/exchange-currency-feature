import { ConversionResult as ConversionResultType, Currency } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface ConversionResultProps {
    result: ConversionResultType;
    fromCurrency: Currency;
    toCurrency: Currency;
}

export function ConversionResultView({
    result,
    fromCurrency,
    toCurrency
}: ConversionResultProps) {
    return (
        <div className="bg-green-50 rounded-lg p-4 space-y-3 border border-green-200">
            <div className="flex items-center justify-center gap-2 text-green-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="font-medium">Conversion Preview</h3>
            </div>

            <div className="bg-white rounded p-3 space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600">You send:</span>
                    <strong>{formatCurrency(result.fromAmount, fromCurrency)}</strong>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">They receive:</span>
                    <strong>{formatCurrency(result.toAmount, toCurrency)}</strong>
                </div>
                <div className="text-sm text-gray-500 pt-2 border-t">
                    <div>Rate: 1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}</div>
                    <div>Fee: {formatCurrency(result.fee, toCurrency)}</div>
                </div>
            </div>
        </div>
    );
}