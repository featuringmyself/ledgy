"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/currency";

interface Payment {
  id: number;
  amount: number;
  project: {
    name: string;
    currency: string;
  };
  type: string;
  status: string;
}

export default function AddTransactionPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [formData, setFormData] = useState({
    paymentId: "",
    amount: "",
    method: "BANK_TRANSFER",
    reference: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/payments")
      .then(res => res.json())
      .then((data: Payment[]) => setPayments(data.filter(p => p.status !== 'PAID')));
  }, []);

  const handlePaymentChange = (paymentId: string) => {
    const payment = payments.find(p => p.id === parseInt(paymentId));
    setSelectedPayment(payment);
    setFormData({ ...formData, paymentId });
  };

  const fillFullAmount = () => {
    if (selectedPayment) {
      setFormData({ ...formData, amount: selectedPayment.amount.toString() });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transactionData = {
        paymentId: parseInt(formData.paymentId),
        amount: parseFloat(formData.amount),
        ...(showDetails && {
          method: formData.method,
          reference: formData.reference,
          notes: formData.notes,
        })
      };

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        router.push("/payments/transactions");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Record Payment</h1>
        <p className="text-sm text-gray-600 mt-1">Log actual money received from client</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="paymentId">Payment</Label>
          <select
            id="paymentId"
            value={formData.paymentId}
            onChange={(e) => handlePaymentChange(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
            required
          >
            <option value="">Select a payment</option>
            {payments.map((payment: Payment) => (
              <option key={payment.id} value={payment.id}>
                {payment.project.name} - {payment.type} - {formatCurrency(payment.amount, payment.project.currency)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="amount">Amount {selectedPayment && `(${selectedPayment.project.currency})`}</Label>
            {selectedPayment && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillFullAmount}
              >
                Fill Full Amount ({formatCurrency(selectedPayment.amount, selectedPayment.project.currency)})
              </Button>
            )}
          </div>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showDetails"
            checked={showDetails}
            onCheckedChange={setShowDetails}
          />
          <Label htmlFor="showDetails">Add payment method and details</Label>
        </div>

        {showDetails && (
          <>
            <div>
              <Label htmlFor="method">Payment Method</Label>
              <select
                id="method"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="PAYPAL">PayPal</option>
                <option value="CASH">Cash</option>
                <option value="CHECK">Check</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Transaction reference or ID"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Optional notes"
              />
            </div>
          </>
        )}

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Recording..." : "Record Transaction"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}