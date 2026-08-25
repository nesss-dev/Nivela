"use client";

import { useState } from "react";

interface IncomeFormProps {
  action: (formData: FormData) => Promise<void>;
  isLoading?: boolean;
}

export function IncomeForm({ action, isLoading = false }: IncomeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const amount = formData.get("amount") as string;
    const date = formData.get("date") as string;

    if (!amount || parseFloat(amount) <= 0) {
      setError("El monto debe ser mayor a 0");
      setIsPending(false);
      return;
    }
    if (!date) {
      setError("La fecha es obligatoria");
      setIsPending(false);
      return;
    }
    if (new Date(date) > new Date(today)) {
      setError("La fecha no puede ser futura");
      setIsPending(false);
      return;
    }

    try {
      await action(formData);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el ingreso");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Registrar ingreso</h3>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-red-50 text-red-800 text-sm" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Monto (€)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
            disabled={isPending || isLoading}
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            max={today}
            defaultValue={today}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isPending || isLoading}
          />
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
            Fuente (opcional)
          </label>
          <input
            id="source"
            name="source"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ej. Cliente ACME, Proyecto web, etc."
            disabled={isPending || isLoading}
            maxLength={100}
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isLoading}
          className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending || isLoading ? "Guardando..." : "Guardar ingreso"}
        </button>
      </form>
    </div>
  );
}