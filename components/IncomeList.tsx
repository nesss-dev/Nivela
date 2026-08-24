"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";

type Income = Database["public"]["Tables"]["incomes"]["Row"];

interface IncomeListProps {
  initialIncomes?: Income[];
  onIncomeChange?: () => void;
}

export function IncomeList({ initialIncomes = [], onIncomeChange }: IncomeListProps) {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [loading, setLoading] = useState(!initialIncomes.length);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!initialIncomes.length) {
      fetchIncomes();
    }
  }, [initialIncomes.length]);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("Usuario no autenticado");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("incomes")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (fetchError) throw fetchError;
      setIncomes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar ingresos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este ingreso?")) return;

    try {
      setDeletingId(id);
      const supabase = createClient();
      const { error: deleteError } = await supabase.from("incomes").delete().eq("id", id);

      if (deleteError) throw deleteError;

      setIncomes((prev) => prev.filter((income) => income.id !== id));
      onIncomeChange?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar el ingreso");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="p-4 rounded-md bg-red-50 text-red-800 text-sm" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Mis ingresos</h3>
      </div>

      {incomes.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No hay ingresos registrados aún</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {incomes.map((income) => (
            <div
              key={income.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-gray-900">
                    {formatCurrency(income.amount)}
                  </span>
                  {income.source && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {income.source}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{formatDate(income.date)}</p>
              </div>
              <button
                onClick={() => handleDelete(income.id)}
                disabled={deletingId === income.id}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === income.id ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}