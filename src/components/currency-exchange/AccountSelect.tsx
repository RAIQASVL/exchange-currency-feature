import { Account } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface AccountSelectProps {
    accounts: Account[];
    value: string;
    onChange: (value: string) => void;
    label: string;
    error?: string;
    disabled?: boolean;
    excludeAccountId?: string;
}

export function AccountSelect({
    accounts,
    value,
    onChange,
    label,
    error,
    disabled,
    excludeAccountId
}: AccountSelectProps) {
    const filteredAccounts = accounts.filter(account =>
        account.id !== excludeAccountId
    );

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`
          w-full px-3 py-2 rounded-md border transition-colors
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100' : 'bg-white'}
          focus:outline-none focus:ring-2 focus:ring-primary-500
        `}
            >
                <option value="">Select account</option>
                {filteredAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                        {account.name} - {formatCurrency(account.balance, account.currency)}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
        </div>
    );
}