"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";

type Income = Database["public"]["Tables"]["incomes"]["Row"];

interface IncomeListProps {
  initialIncomes?: Income[];
  onIncomeChange?: () => void;
  onEdit?: (income: Income) => void;
}

const ITEMS_PER_PAGE = 20;

export function IncomeList({ initialIncomes = [], onIncomeChange, onEdit }: IncomeListProps) {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [loading, setLoading] = useState(!initialIncomes.length);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialIncomes.length >= ITEMS_PER_PAGE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchIncomes = useCallback(async (pageNum: number = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("User not authenticated");
        return;
      }

      const from = (pageNum - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error: fetchError, count } = await supabase
        .from("incomes")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .range(from, to);

      if (fetchError) throw fetchError;

      if (pageNum === 1) {
        setIncomes(data || []);
      } else {
        setIncomes((prev: Income[]) => [...prev, ...(data || [])]);
      }

      setHasMore((data?.length || 0) === ITEMS_PER_PAGE && (count ? from + data.length < count : false));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading incomes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialIncomes.length) {
      fetchIncomes(1);
    } else {
      setHasMore(initialIncomes.length >= ITEMS_PER_PAGE);
    }
  }, [initialIncomes.length, fetchIncomes]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev: number) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  useEffect(() => {
    if (page > 1) {
      fetchIncomes(page);
    }
  }, [page, fetchIncomes]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this income?")) return;

    try {
      setDeletingId(id);
      const supabase = createClient();
      const { error: deleteError } = await supabase.from("incomes").delete().eq("id", id);

      if (deleteError) throw deleteError;

      setIncomes((prev: Income[]) => prev.filter((income) => income.id !== id));
      onIncomeChange?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting income");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading && incomes.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error && incomes.length === 0) {
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
        <h3 className="text-lg font-medium text-gray-900">My Incomes</h3>
      </div>

      {incomes.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No incomes recorded yet</p>
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
              <div className="flex items-center space-x-3">
                {onEdit && (
                  <button
                    onClick={() => onEdit(income)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(income.id)}
                  disabled={deletingId === income.id}
                  className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === income.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}

          {/* Load more trigger */}
          <div ref={loadMoreRef} className="px-6 py-4 text-center">
            {hasMore && loading && (
              <div className="flex items-center justify-center space-x-2 text-gray-500">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span>Loading more...</span>
              </div>
            )}
            {hasMore && !loading && (
              <button
                onClick={() => setPage((prev: number) => prev + 1)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Load more
              </button>
            )}
            {!hasMore && incomes.length > 0 && (
              <p className="text-gray-500 text-sm">No more incomes</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}