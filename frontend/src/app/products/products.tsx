"use client";
import { useEffect, useState } from "react";
import { getListOfProducts } from "../../../lib/api";

export default function ProductsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getListOfProducts({ page, limit })
      .then((res) => {
        if (!active) return;
        setItems(res.data?.items || []);
        setTotal(res.data?.total || 0);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Products</h1>

      {loading ? (
        <div>Loading…</div>
      ) : items.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((p: any) => (
            <li key={p.id || p._id} className="border rounded-lg p-3">
              <div className="font-medium">{p.name}</div>
              {p.description && (
                <div className="text-sm text-slate-600">{p.description}</div>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={() => setPage((n) => Math.max(1, n - 1))}
          disabled={page === 1 || loading}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((n) => Math.min(totalPages, n + 1))}
          disabled={page >= totalPages || loading}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
