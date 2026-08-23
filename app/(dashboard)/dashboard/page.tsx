"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-gray-600">
          Bienvenido, {user?.email}. Aquí verás tu resumen financiero.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Sueldo Seguro</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">€0,00</p>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Apartado Impuestos</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">€0,00</p>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Ingresos este mes</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">€0,00</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Próximos pasos</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Registra tus primeros ingresos</li>
          <li>• Configura tu % de impuestos</li>
          <li>• Define el período para el cálculo del sueldo seguro</li>
        </ul>
      </div>
    </div>
  );
}