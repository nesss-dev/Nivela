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
          Welcome, {user?.email}. Here is your financial summary.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Safe Salary</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">€0.00</p>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Tax Reserve</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">€0.00</p>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Income this month</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">€0.00</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Next Steps</h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Record your first incomes</li>
          <li>• Configure your tax percentage</li>
          <li>• Define the period for safe salary calculation</li>
        </ul>
      </div>
    </div>
  );
}