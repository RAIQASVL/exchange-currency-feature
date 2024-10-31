import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useCallback, useId } from "react";
import debounce from 'lodash/debounce';
import { Account, ConversionResult } from "@/types";
import { AccountSelect } from "./AccountSelect";
import { ConversionResult as ConversionResultComponent } from "./ConversionResult";
import { SuccessMessage } from "./SuccessMessage";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { formatCurrency } from "@/utils/formatters";

// Validation schema
const conversionFormSchema = z.object({
    fromAccountId: z.string({
        required_error: "Please select source account",
    }).min(1, "Please select source account"),

    toAccountId: z.string({
        required_error: "Please select destination account",
    }).min(1, "Please select destination account"),

    amount: z.string()
        .min(1, "Amount is required")
        .refine(val => !isNaN(Number(val)), "Amount must be a number")
        .refine(val => Number(val) > 0, "Amount must be greater than 0")
});

type ConversionFormData = z.infer<typeof conversionFormSchema>;

interface ConversionFormProps {
    accounts: Account[];
    onConvert: (data: ConversionFormData) => Promise<ConversionResult>;
}

const defaultFormValues: ConversionFormData = {
    fromAccountId: "",
    toAccountId: "",
    amount: ""
};

export function ConversionForm({ accounts, onConvert }: ConversionFormProps) {
    // Form instance ID for stable transaction IDs
    const formId = useId();

    // Component state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
    const [transactionId, setTransactionId] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);

    // Form setup
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
        setError,
        reset,
        trigger,
    } = useForm<ConversionFormData>({
        resolver: zodResolver(conversionFormSchema),
        mode: "onChange",
        defaultValues: defaultFormValues,
    });

    // Watch form values
    const fromAccountId = watch("fromAccountId");
    const toAccountId = watch("toAccountId");
    const amount = watch("amount");

    // Get account objects
    const fromAccount = accounts.find(acc => acc.id === fromAccountId);
    const toAccount = accounts.find(acc => acc.id === toAccountId);

    // Generate stable transaction ID
    const generateTransactionId = useCallback((formId: string) => {
        const timestamp = Date.now();
        return `TX-${formId}-${timestamp}`.toUpperCase();
    }, []);

    // Debounced preview calculation
    const calculatePreview = useCallback(
        debounce(async (data: ConversionFormData) => {
            if (!fromAccount || !toAccount || !data.amount) return;

            const numAmount = Number(data.amount);
            if (numAmount <= 0 || numAmount > fromAccount.balance) return;

            setPreviewLoading(true);
            try {
                const result = await onConvert(data);
                setConversionResult(result);
            } catch (error) {
                console.error('Preview calculation failed:', error);
            } finally {
                setPreviewLoading(false);
            }
        }, 300),
        [fromAccount, toAccount, onConvert]
    );

    // Update preview when form values change
    useEffect(() => {
        if (fromAccountId && toAccountId && amount) {
            const isAmountValid = !isNaN(Number(amount)) && Number(amount) > 0;
            if (isAmountValid) {
                calculatePreview({ fromAccountId, toAccountId, amount });
            }
        } else {
            setConversionResult(null);
        }

        return () => {
            calculatePreview.cancel();
        };
    }, [fromAccountId, toAccountId, amount, calculatePreview]);

    // Handle form submission
    const onSubmit = async (data: ConversionFormData) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            if (!fromAccount || !toAccount) {
                throw new Error("Invalid account selection");
            }

            const numAmount = Number(data.amount);
            if (numAmount > fromAccount.balance) {
                throw new Error("Insufficient funds");
            }

            const result = await onConvert(data);
            setConversionResult(result);
            setTransactionId(generateTransactionId(formId));
            setIsSuccess(true);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Conversion failed";
            setError("root", {
                type: "manual",
                message: errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle starting new conversion
    const handleNewConversion = useCallback(() => {
        reset(defaultFormValues);
        setIsSuccess(false);
        setConversionResult(null);
        setTransactionId("");
    }, [reset]);

    // Check account balance
    useEffect(() => {
        if (fromAccount && amount) {
            const numAmount = Number(amount);
            if (numAmount > fromAccount.balance) {
                setError("amount", {
                    type: "manual",
                    message: "Insufficient funds"
                });
            }
        }
    }, [amount, fromAccount, setError]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errors.root && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md animate-fade-in">
                    <p className="text-sm text-red-600">{errors.root.message}</p>
                </div>
            )}

            {isSuccess && conversionResult && fromAccount && toAccount ? (
                <>
                    <SuccessMessage
                        result={conversionResult}
                        fromCurrency={fromAccount.currency}
                        toCurrency={toAccount.currency}
                        transactionId={transactionId}
                    />
                    <button
                        type="button"
                        onClick={handleNewConversion}
                        className="w-full py-2 px-4 rounded-md font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    >
                        New Conversion
                    </button>
                </>
            ) : (
                <>
                    <Controller
                        name="fromAccountId"
                        control={control}
                        render={({ field }) => (
                            <AccountSelect
                                accounts={accounts}
                                value={field.value}
                                onChange={(value) => {
                                    field.onChange(value);
                                    trigger("amount"); // Re-validate amount for new balance
                                }}
                                label="From Account"
                                error={errors.fromAccountId?.message}
                            />
                        )}
                    />

                    <Controller
                        name="toAccountId"
                        control={control}
                        render={({ field }) => (
                            <AccountSelect
                                accounts={accounts}
                                value={field.value}
                                onChange={field.onChange}
                                label="To Account"
                                error={errors.toAccountId?.message}
                                excludeAccountId={fromAccountId}
                                disabled={!fromAccountId}
                            />
                        )}
                    />

                    <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Amount
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        {...field}
                                        className={`
                      w-full px-3 py-2 rounded-md border transition-colors
                      ${errors.amount ? 'border-red-500' : 'border-gray-300'}
                      focus:outline-none focus:ring-2 focus:ring-primary-500
                    `}
                                        placeholder={fromAccount ? `Max: ${fromAccount.balance.toFixed(2)}` : "0.00"}
                                        disabled={!fromAccountId || !toAccountId}
                                    />
                                    {fromAccount && field.value && !errors.amount && (
                                        <div className="absolute right-3 top-2 text-sm text-gray-500">
                                            {formatCurrency(Number(field.value), fromAccount.currency)}
                                        </div>
                                    )}
                                </div>
                                {errors.amount && (
                                    <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
                                )}
                                {fromAccount && (
                                    <p className="text-sm text-gray-500">
                                        Available: {formatCurrency(fromAccount.balance, fromAccount.currency)}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                    {/* Real-time conversion preview */}
                    {conversionResult && fromAccount && toAccount && amount && !errors.amount && (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-fade-in">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-500">You will receive:</span>
                                {previewLoading && <LoadingSpinner />}
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                                {formatCurrency(conversionResult.toAmount, toAccount.currency)}
                            </div>
                            <div className="text-xs text-gray-500 mt-2 space-y-1">
                                <p>Rate: 1 {fromAccount.currency} = {conversionResult.rate.toFixed(4)} {toAccount.currency}</p>
                                <p>Fee: {formatCurrency(conversionResult.fee, toAccount.currency)}</p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting || previewLoading || !conversionResult}
                        className={`
              w-full py-2 px-4 rounded-md font-medium transition-colors
              ${isSubmitting ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'}
              text-white disabled:opacity-50 disabled:cursor-not-allowed
            `}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <LoadingSpinner />
                                Converting...
                            </span>
                        ) : (
                            "Convert"
                        )}
                    </button>
                </>
            )}
        </form>
    );
}