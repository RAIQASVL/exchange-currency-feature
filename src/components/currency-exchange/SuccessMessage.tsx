import { ConversionResult, Currency } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface SuccessMessageProps {
    result: ConversionResult;
    fromCurrency: Currency;
    toCurrency: Currency;
    transactionId: string;
}

export function SuccessMessage({
    result,
    fromCurrency,
    toCurrency,
    transactionId
}: SuccessMessageProps) {
    return (
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="bg-green-500 rounded-full p-1">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-green-800">
                    Conversion Successful!
                </h3>
            </div>

            <p className="text-sm text-green-700 mb-4">
                Transaction ID: {transactionId}
            </p>

            <div className="bg-white rounded-md p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-sm text-gray-500">Sent</span>
                        <p className="font-medium">
                            {formatCurrency(result.fromAmount, fromCurrency)}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500">Received</span>
                        <p className="font-medium">
                            {formatCurrency(result.toAmount, toCurrency)}
                        </p>
                    </div>
                </div>

                <div className="text-sm text-gray-600">
                    <p>Rate: 1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}</p>
                    <p>Fee: {formatCurrency(result.fee, toCurrency)}</p>
                </div>
            </div>
        </div>
    );
}