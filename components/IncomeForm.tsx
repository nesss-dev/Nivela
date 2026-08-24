"use client";

import { useState } from "react";

interface IncomeFormProps {
  onSubmit: (data: { amount: number; date: string; source: string }) => Promise<void>;
  isLoading?: boolean;
}

export function IncomeForm({ onSubmit, isLoading = false }: IncomeFormProps) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [source, setSource] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const validateForm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("El monto debe ser mayor a 0");
      return false;
    }
    if (!date) {
      setError("La fecha es obligatoria");
      return false;
    }
    if (new Date(date) > new Date(today)) {
      setError("La fecha no puede ser futura");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    try {
      await onSubmit({
        amount: parseFloat(amount),
        date,
        source: source.trim() || "",
      });
      setAmount("");
      setDate(today);
      setSource("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al guardar el ingreso");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Registrar ingreso</h3>

      {submitError && (
        <div className="mb-4 p-4 rounded-md bg-red-50 text-red-800 text-sm" role="alert">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Monto (€)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (error) setError(null);
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="0.00"
            disabled={isLoading}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            id="date"
            type="date"
            required
            max={today}
            value={date || today}
            onChange={(e) => {
              setDate(e.target.value);
              if (error) setError(null);
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
            Fuente (opcional)
          </label>
          <input
            id="source"
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej. Cliente ACME, Proyecto web, etc."
            disabled={isLoading}
            maxLength={100}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Guardando..." : "Guardar ingreso"}
        </button>
      </form>
    </div>
  );
}