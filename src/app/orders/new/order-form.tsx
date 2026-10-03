"use client";

import { useState } from "react";
import Link from "next/link";
import { createOrder } from "../actions";
import { useRouter } from "next/navigation";

export default function OrderForm({ 
  products, 
  inventoryItems, 
  employees 
}: { 
  products: any[]; 
  inventoryItems: any[]; 
  employees: any[] 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    governorate: "",
    address: "",
    primaryPhone: "",
    secondaryPhone: "",
    dateOfBirth: "",
  });

  const [orderInfo, setOrderInfo] = useState({
    productId: "",
    size: "",
    quantity: 1,
    inventoryId: "",
  });

  const [shippingInfo, setShippingInfo] = useState({
    mode: "AUTO",
    cost: 0,
  });

  const [paymentInfo, setPaymentInfo] = useState({
    codAmount: 0,
    depositAmount: 0,
  });

  const [expenses, setExpenses] = useState({
    printingCost: 0,
    transportationCost: 0,
    deliveryCost: 0,
    advertisingShare: 0,
  });

  const [callCenter, setCallCenter] = useState({
    employeeId: "",
  });

  const selectedInventory = inventoryItems.find(i => 
    i.productId === orderInfo.productId && 
    (!orderInfo.size || i.size === orderInfo.size)
  );
  const rawMaterialCost = selectedInventory ? selectedInventory.unitCost : 0;
  const remainingAmount = paymentInfo.codAmount - paymentInfo.depositAmount;
  
  const totalExpenses =
    expenses.printingCost +
    shippingInfo.cost +
    expenses.transportationCost +
    expenses.deliveryCost +
    expenses.advertisingShare;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      customer: customerInfo,
      order: { ...orderInfo, inventoryId: selectedInventory?.id || "" },
      shipping: shippingInfo,
      payment: paymentInfo,
      expenses,
      callCenter
    };

    const result = await createOrder(payload);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/orders");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-12">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
            {error}
          </div>
        )}
        
        {/* 1. Customer Information */}
        <section>
          <h2 className="text-lg font-medium text-neutral-900 border-b border-neutral-200 pb-2 mb-6">
            1. Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Customer Name *</span>
              <input
                required
                type="text"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Primary Phone *</span>
              <input
                required
                type="tel"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                value={customerInfo.primaryPhone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, primaryPhone: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Secondary Phone</span>
              <input
                type="tel"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                value={customerInfo.secondaryPhone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, secondaryPhone: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Date of Birth</span>
              <input
                type="date"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                value={customerInfo.dateOfBirth}
                onChange={(e) => setCustomerInfo({ ...customerInfo, dateOfBirth: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Governorate *</span>
              <select
                required
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-accent"
                value={customerInfo.governorate}
                onChange={(e) => setCustomerInfo({ ...customerInfo, governorate: e.target.value })}
              >
                <option value="">Select a governorate...</option>
                <option value="Cairo">Cairo</option>
                <option value="Alexandria">Alexandria</option>
                <option value="Giza">Giza</option>
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Full Address *</span>
              <input
                required
                type="text"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              />
            </label>
          </div>
        </section>

        {/* 2. Order Information */}
        <section>
          <h2 className="text-lg font-medium text-neutral-900 border-b border-neutral-200 pb-2 mb-6">
            2. Order Information & Inventory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Product *</span>
              <select
                required
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-accent"
                value={orderInfo.productId}
                onChange={(e) => setOrderInfo({ ...orderInfo, productId: e.target.value })}
              >
                <option value="">Select Product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Size</span>
              <select
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-accent"
                value={orderInfo.size}
                onChange={(e) => setOrderInfo({ ...orderInfo, size: e.target.value })}
              >
                <option value="">No Size / Default</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
              </select>
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Quantity *</span>
              <input
                required
                type="number"
                min="1"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                value={orderInfo.quantity}
                onChange={(e) => setOrderInfo({ ...orderInfo, quantity: parseInt(e.target.value) || 1 })}
              />
            </label>

          </div>
          {selectedInventory && (
            <div className="mt-4 p-4 bg-neutral-50 rounded border border-neutral-200">
              <p className="text-sm text-neutral-700">
                <span className="font-medium text-neutral-900">Raw-material cost for this inventory:</span> {rawMaterialCost} EGP
              </p>
            </div>
          )}
        </section>

        {/* 3. Shipping & Logistics */}
        <section>
          <h2 className="text-lg font-medium text-neutral-900 border-b border-neutral-200 pb-2 mb-6">
            3. Shipping
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="shippingMode"
                  value="AUTO"
                  checked={shippingInfo.mode === "AUTO"}
                  onChange={() => setShippingInfo({ ...shippingInfo, mode: "AUTO", cost: 50 })}
                  className="accent-accent"
                />
                <span className="text-sm font-medium text-neutral-700">Automatic (Based on Governorate)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="shippingMode"
                  value="MANUAL"
                  checked={shippingInfo.mode === "MANUAL"}
                  onChange={() => setShippingInfo({ ...shippingInfo, mode: "MANUAL", cost: 0 })}
                  className="accent-accent"
                />
                <span className="text-sm font-medium text-neutral-700">Manual Entry</span>
              </label>
            </div>
            
            <label className="block max-w-xs mt-4">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Shipping Cost</span>
              <input
                type="number"
                min="0"
                disabled={shippingInfo.mode === "AUTO"}
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent disabled:bg-neutral-100"
                value={shippingInfo.cost}
                onChange={(e) => setShippingInfo({ ...shippingInfo, cost: parseFloat(e.target.value) || 0 })}
              />
            </label>
          </div>
        </section>

        {/* 4. Payment & Expenses */}
        <section>
          <h2 className="text-lg font-medium text-neutral-900 border-b border-neutral-200 pb-2 mb-6">
            4. Payment & Expenses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">COD Amount</span>
              <input
                type="number"
                min="0"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                value={paymentInfo.codAmount}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, codAmount: parseFloat(e.target.value) || 0 })}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Deposit Amount</span>
              <input
                type="number"
                min="0"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                value={paymentInfo.depositAmount}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, depositAmount: parseFloat(e.target.value) || 0 })}
              />
            </label>
          </div>
          
          <h3 className="text-sm font-medium text-neutral-900 mt-8 mb-4">Additional Expenses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Printing Cost</span>
              <input
                type="number"
                min="0"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                value={expenses.printingCost}
                onChange={(e) => setExpenses({ ...expenses, printingCost: parseFloat(e.target.value) || 0 })}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Transportation Cost</span>
              <input
                type="number"
                min="0"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                value={expenses.transportationCost}
                onChange={(e) => setExpenses({ ...expenses, transportationCost: parseFloat(e.target.value) || 0 })}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Delivery / Driver Cost</span>
              <input
                type="number"
                min="0"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                value={expenses.deliveryCost}
                onChange={(e) => setExpenses({ ...expenses, deliveryCost: parseFloat(e.target.value) || 0 })}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Advertising Share</span>
              <input
                type="number"
                min="0"
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent"
                value={expenses.advertisingShare}
                onChange={(e) => setExpenses({ ...expenses, advertisingShare: parseFloat(e.target.value) || 0 })}
              />
            </label>
          </div>
        </section>

        {/* 5. Call Center */}
        <section>
          <h2 className="text-lg font-medium text-neutral-900 border-b border-neutral-200 pb-2 mb-6">
            5. Call Center
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="block text-sm font-medium text-neutral-700 mb-2">Employee</span>
              <select
                className="w-full border border-neutral-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-accent"
                value={callCenter.employeeId}
                onChange={(e) => setCallCenter({ employeeId: e.target.value })}
              >
                <option value="">No Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.commissionPercent}% Commission)</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 bg-neutral-900 text-white rounded font-medium text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Confirming..." : "Confirm Order"}
          </button>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div>
        <div className="bg-neutral-50 border border-neutral-200 rounded p-6 sticky top-8">
          <h2 className="text-base font-medium text-neutral-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4 text-sm text-neutral-700">
            <div className="flex justify-between">
              <span>Product</span>
              <span className="font-medium text-neutral-900">{products.find(p => p.id === orderInfo.productId)?.name || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Size</span>
              <span className="font-medium text-neutral-900">{orderInfo.size || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity</span>
              <span className="font-medium text-neutral-900">{orderInfo.quantity}</span>
            </div>
            
            <div className="border-t border-neutral-200 pt-4 mt-4" />
            
            <div className="flex justify-between">
              <span>Raw-material Cost</span>
              <span className="font-medium text-neutral-900">{rawMaterialCost} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>COD Amount</span>
              <span className="font-medium text-neutral-900">{paymentInfo.codAmount} EGP</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Deposit</span>
              <span>- {paymentInfo.depositAmount} EGP</span>
            </div>
            
            <div className="flex justify-between font-medium text-neutral-900 text-base pt-2">
              <span>Remaining Amount</span>
              <span>{remainingAmount} EGP</span>
            </div>

            <div className="border-t border-neutral-200 pt-4 mt-4" />
            
            <div className="flex justify-between">
              <span>Shipping Cost</span>
              <span>{shippingInfo.cost} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>Printing Cost</span>
              <span>{expenses.printingCost} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>Transportation Cost</span>
              <span>{expenses.transportationCost} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Cost</span>
              <span>{expenses.deliveryCost} EGP</span>
            </div>
            <div className="flex justify-between">
              <span>Advertising Share</span>
              <span>{expenses.advertisingShare} EGP</span>
            </div>
            
            <div className="flex justify-between font-medium text-neutral-900 pt-2">
              <span>Total Additional Expenses</span>
              <span>{totalExpenses} EGP</span>
            </div>

            <div className="border-t border-neutral-200 pt-4 mt-4" />
            
            <div className="flex justify-between">
              <span>Call Center</span>
              <span className="font-medium text-neutral-900">
                {employees.find(e => e.id === callCenter.employeeId)?.name || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
