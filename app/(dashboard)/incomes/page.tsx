import { getIncomes, createIncome } from "@/app/incomes/actions";
import { IncomeForm } from "@/components/IncomeForm";
import { IncomeList } from "@/components/IncomeList";

export default async function IncomesPage() {
  const incomes = await getIncomes();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mis ingresos</h2>
        <p className="mt-1 text-gray-600">
          Registra tus ingresos para calcular tu sueldo seguro y el apartado de impuestos.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <IncomeForm action={createIncome} />
        </div>
        <div className="lg:col-span-2">
          <IncomeList initialIncomes={incomes} />
        </div>
      </div>
    </div>
  );
}