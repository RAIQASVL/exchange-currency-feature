"use client";

import { type FormEvent, useState } from "react";
import "./globals.css";
import "./ConvertMoneyForm.css";

type Currency = "USD" | "EUR" | "GBP";

interface AccountDTO {
    id: string;
    name: string;
    currency: string;
    balance: number;
}

type ExchangeRatesDTO = { [key: `${string}-${string}`]: number };

interface ConversionResult {
    fromAmount: number;
    toAmount: number;
    rate: number;
    fee: number;
}

const fetchExchangeRates = () => {
    // Implement fetching exchange rates here
    // fetch data from /exchange-rates.json
};

const simulateConversion = (
    fromAmount: number,
    fromCurrency: string,
    toCurrency: string,
    // exchangeRates
) => {
    // Implement conversion simulation here
    // const rate = exchangeRates[`${fromCurrency}-${toCurrency}`] or 1;
    // const toAmount = amount * (rate || 1);
    // fee is 1% of fromAmount
    // return type is ConversionResult
};

const App = () => {
    const [fromAccount, setFromAccount] = useState("");
    const [toAccount, setToAccount] = useState("");
    const [amount, setAmount] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="convert-money-form">
                <div className="form-group">
                    <label htmlFor="fromAccount">From Account:</label>
                    <select
                        id="fromAccount"
                        value={fromAccount}
                        onChange={(e) => setFromAccount(e.target.value)}
                    >
                        <option value="">Select account</option>
                        {/* Implement account options here */}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="toAccount">To Account:</label>
                    <select
                        id="toAccount"
                        value={toAccount}
                        onChange={(e) => setToAccount(e.target.value)}
                    >
                        <option value="">Select account</option>
                        {/* Implement account options here */}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Amount:</label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0"
                        step="0.01"
                    />
                </div>

                <button className="submit-button">Convert</button>
            </form>

            {/* Implement conversion result display here */}
        </div>
    );
};

export default App;
