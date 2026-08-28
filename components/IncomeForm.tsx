"use client";

import { useState, useEffect } from "react";
import type { Database } from "@/lib/database.types";

type Income = Database["public"]["Tables"]["incomes"]["Row"];

interface IncomeFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: Income | null;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function IncomeForm({ action, initialData = null, onCancel, isLoading = false }: IncomeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Detectar si estamos en modo edición
  useEffect(() => {
    setIsEditing(!!initialData);
  }, [initialData]);

  // Pre-llenar el formulario cuando hay initialData
  useEffect(() => {
    if (initialData) {
      const amountInput = document.getElementById("amount") as HTMLInputElement;
      const dateInput = document.getElementById("date") as HTMLInputElement;
      const sourceInput = document.getElementById("source") as HTMLInputElement;

      if (amountInput) amountInput.value = initialData.amount.toString();
      if (dateInput) dateInput.value = initialData.date;
      if (sourceInput) sourceInput.value = initialData.source || "";
    }
  }, [initialData]);

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

    // Si estamos editando, agregar el ID al FormData
    if (isEditing && initialData) {
      formData.append("id", initialData.id);
    }

    try {
      await action(formData);
      form.reset();
      onCancel?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el ingreso");
    } finally {
      setIsPending(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {isEditing ? "Edit Income" : "Add Income"}
        </h3>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-red-50 text-red-800 text-sm" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (€)
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={initialData?.amount.toString() || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
            disabled={isPending || isLoading}
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            max={today}
            defaultValue={initialData?.date || today}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isPending || isLoading}
          />
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
            Source (optional)
          </label>
          <input
            id="source"
            name="source"
            type="text"
            defaultValue={initialData?.source || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. ACME Client, Web Project, etc."
            disabled={isPending || isLoading}
            maxLength={100}
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isLoading}
          className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending || isLoading ? "Saving..." : isEditing ? "Update Income" : "Save Income"}
        </button>
      </form>
    </div>
  );
}