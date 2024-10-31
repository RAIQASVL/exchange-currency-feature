import { ConversionResult as ConversionResultType } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface ConversionResultProps {
    result: ConversionResultType;
    fromCurrency: string;
    toCurrency: string;
}

export function ConversionResult({
    result,
    fromCurrency,
    toCurrency
}: ConversionResultProps) {
    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                Conversion Preview
            </h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Exchange Rate:</span>
                    <span className="font-medium">
                        1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">You Send:</span>
                    <span className="font-medium">
                        {formatCurrency(result.fromAmount, fromCurrency)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Fee (1%):</span>
                    <span className="font-medium">
                        {formatCurrency(result.fee, toCurrency)}
                    </span>
                </div>
                <div className="flex justify-between text-base">
                    <span className="text-gray-900 font-medium">They Receive:</span>
                    <span className="text-gray-900 font-medium">
                        {formatCurrency(result.toAmount, toCurrency)}
                    </span>
                </div>
            </div>
        </div>
    );
}