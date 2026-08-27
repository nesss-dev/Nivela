"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";
import { revalidatePath } from "next/cache";

type IncomeUpdate = Database["public"]["Tables"]["incomes"]["Update"];

export async function createIncome(formData: FormData) {
  const amount = parseFloat(formData.get("amount") as string);
  const date = formData.get("date") as string;
  const source = formData.get("source") as string;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  const { error } = await supabase
    .from("incomes")
    .insert({
      amount,
      date,
      source,
      user_id: user.id,
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/incomes");
}

export async function getIncomes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  const { data, error } = await supabase
    .from("incomes")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function deleteIncome(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  const { error } = await supabase
    .from("incomes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/incomes");
}

export async function updateIncome(id: string, data: IncomeUpdate) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  const { data: income, error } = await supabase
    .from("incomes")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/incomes");
  return income;
}