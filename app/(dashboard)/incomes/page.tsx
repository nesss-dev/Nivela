"use client";

import { useState, useEffect } from "react";
import { getIncomes, createIncome, updateIncome } from "@/app/incomes/actions";
import { IncomeForm } from "@/components/IncomeForm";
import { IncomeList } from "@/components/IncomeList";
import type { Database } from "@/lib/database.types";

type Income = Database["public"]["Tables"]["incomes"]["Row"];

export default function IncomesPage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const fetchIncomes = async () => {
    try {
      const data = await getIncomes();
      setIncomes(data);
    } catch (err) {
      console.error("Error loading incomes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    document.getElementById("income-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingIncome(null);
  };

  const handleIncomeChange = () => {
    fetchIncomes();
    setEditingIncome(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Incomes</h2>
        <p className="mt-1 text-gray-600">
          Record your income to calculate your safe salary and tax reserve.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div id="income-form">
            <IncomeForm
              action={editingIncome ? updateIncome : createIncome}
              initialData={editingIncome}
              onCancel={handleCancelEdit}
              isLoading={loading}
            />
          </div>
        </div>
        <div className="lg:col-span-2">
          <IncomeList
            initialIncomes={incomes}
            onIncomeChange={handleIncomeChange}
            onEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
}