"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  getDashboard,
  getListOfProducts,
  createProduct,
} from "../../../lib/api";
import router, { Router, useRouter } from "next/router";

// --- Types that match your backend DTOs (all money in cents) ---
type ComponentDto = {
  title: string;
  vendorUrl?: string;
  unitName: string;
  unitQtyPerPack: number; // e.g. 100 pcs per pack
  unitPriceCents: number; // e.g. 1299 = $12.99
  usageQtyPerProduct: number; // e.g. 12 pcs per product
};

type ProductDto = {
  title: string;
  laborMinutes: number; // e.g. 90
  laborRateCentsPerHour: number; // e.g. 4000 = $40.00/h
  components: ComponentDto[];
};

// --- helpers ---
const emptyComponent = (): ComponentDto => ({
  title: "",
  vendorUrl: "",
  unitName: "",
  unitQtyPerPack: 1,
  unitPriceCents: 0,
  usageQtyPerProduct: 1,
});

const ceilCents = (x: number) => Math.ceil(x); // keep integer cents

export default function DashboardPage() {
  // form state (all cents are numbers)
  const [title, setTitle] = useState("");
  const [laborMinutes, setLaborMinutes] = useState<number>(60);
  const [laborRateCentsPerHour, setLaborRateCentsPerHour] =
    useState<number>(4000);
  const [components, setComponents] = useState<ComponentDto[]>([
    emptyComponent(),
  ]);

  // listing state
  const [products, setProducts] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const authorized = await getDashboard(); // optional; ensures auth/session
      const list = await getListOfProducts({ page: 1, limit: 10 });
      setProducts(list.data.items || []);
      setTotalCount(list.data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // live calculations (all in cents)
  const { perComponentCents, materialsCents, laborCents, totalCents } =
    useMemo(() => {
      const perComp = components.map((c) => {
        const perUnitCents = c.unitPriceCents / (c.unitQtyPerPack || 1); // may be fractional
        const perProduct = ceilCents(
          perUnitCents * (c.usageQtyPerProduct || 0)
        );
        return Number.isFinite(perProduct) ? perProduct : 0;
      });

      const materials = perComp.reduce((s, v) => s + v, 0);
      const labor = Math.round(laborRateCentsPerHour * (laborMinutes / 60));
      const total = materials + labor;

      return {
        perComponentCents: perComp,
        materialsCents: materials,
        laborCents: labor,
        totalCents: total,
      };
    }, [components, laborMinutes, laborRateCentsPerHour]);

  // dynamic component handlers
  const addComponent = () =>
    setComponents((prev) => [...prev, emptyComponent()]);
  const removeComponent = (idx: number) =>
    setComponents((prev) => prev.filter((_, i) => i !== idx));
  const updateComp = <K extends keyof ComponentDto>(
    i: number,
    k: K,
    v: ComponentDto[K]
  ) => {
    setComponents((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [k]: v };
      return copy;
    });
  };

  // submit: already in cents, so send as-is
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanComponents = components
      .map((c) => ({
        title: c.title.trim(),
        vendorUrl: c.vendorUrl?.trim() || undefined,
        unitName: c.unitName.trim(),
        unitQtyPerPack: Number(c.unitQtyPerPack) || 1,
        unitPriceCents: Math.max(0, Math.round(Number(c.unitPriceCents) || 0)),
        usageQtyPerProduct: Number(c.usageQtyPerProduct) || 0,
      }))
      .filter((c) => c.title && c.unitName);

    const payload: ProductDto = {
      title: title.trim(),
      laborMinutes: Math.max(0, Math.round(Number(laborMinutes) || 0)),
      laborRateCentsPerHour: Math.max(
        0,
        Math.round(Number(laborRateCentsPerHour) || 0)
      ),
      components: cleanComponents,
    };

    await createProduct(payload);
    // reset form
    setTitle("");
    setLaborMinutes(60);
    setLaborRateCentsPerHour(4000);
    setComponents([emptyComponent()]);
    await load();
  };

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      <h1>Create product (all prices in cents)</h1>

      <form onSubmit={handleCreate} style={{ display: "grid", gap: 12 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr 1fr",
            gap: 12,
          }}
        >
          <input
            placeholder="Product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <input
            type="number"
            min={0}
            step={1}
            placeholder="Labor minutes"
            value={laborMinutes}
            onChange={(e) => setLaborMinutes(Number(e.target.value))}
            required
          />

          {/* cents, integer */}
          <input
            type="number"
            min={0}
            step={1}
            placeholder="Labor rate (cents/hour)"
            value={laborRateCentsPerHour}
            onChange={(e) =>
              setLaborRateCentsPerHour(
                Math.max(0, Math.round(Number(e.target.value) || 0))
              )
            }
            required
          />
        </div>

        <h3>Components</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {components.map((c, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gap: 8,
                gridTemplateColumns: "1.2fr 1.2fr 0.7fr 0.7fr 1fr 1fr auto",
                alignItems: "center",
              }}
            >
              <input
                placeholder="Title"
                value={c.title}
                onChange={(e) => updateComp(i, "title", e.target.value)}
                required
              />
              <input
                placeholder="Vendor URL (optional)"
                value={c.vendorUrl ?? ""}
                onChange={(e) => updateComp(i, "vendorUrl", e.target.value)}
              />
              <input
                placeholder="Unit name (e.g. pcs, ml)"
                value={c.unitName}
                onChange={(e) => updateComp(i, "unitName", e.target.value)}
                required
              />
              <input
                type="number"
                min={0.0001}
                step={0.0001}
                placeholder="Qty per pack"
                value={c.unitQtyPerPack}
                onChange={(e) =>
                  updateComp(i, "unitQtyPerPack", Number(e.target.value))
                }
                required
              />
              {/* cents, integer */}
              <input
                type="number"
                min={0}
                step={1}
                placeholder="Pack price (cents)"
                value={c.unitPriceCents}
                onChange={(e) =>
                  updateComp(
                    i,
                    "unitPriceCents",
                    Math.max(0, Math.round(Number(e.target.value) || 0))
                  )
                }
                required
              />
              <input
                type="number"
                min={0.0001}
                step={0.0001}
                placeholder="Usage per product"
                value={c.usageQtyPerProduct}
                onChange={(e) =>
                  updateComp(i, "usageQtyPerProduct", Number(e.target.value))
                }
                required
              />

              <button
                type="button"
                onClick={() => removeComponent(i)}
                aria-label="Remove"
              >
                ✕
              </button>

              {/* per-component cost in cents */}
              <div style={{ gridColumn: "1 / -1", fontSize: 12, opacity: 0.8 }}>
                Cost per product (cents):{" "}
                {(() => {
                  const perUnit = c.unitPriceCents / (c.unitQtyPerPack || 1);
                  const perProduct = ceilCents(
                    perUnit * (c.usageQtyPerProduct || 0)
                  );
                  return Number.isFinite(perProduct) ? perProduct : 0;
                })()}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={addComponent}>
            + Add component
          </button>
          <button type="submit">Create product</button>
        </div>
      </form>

      {/* Live totals (cents) */}
      <section style={{ marginTop: 16 }}>
        <strong>Materials:</strong> {materialsCents}¢ &nbsp;|&nbsp;
        <strong>Labor:</strong> {laborCents}¢ &nbsp;|&nbsp;
        <strong>Total:</strong> {totalCents}¢
      </section>

      <section>
        <h2>Products ({totalCount})</h2>
        <ul>
          {products.map((p) => (
            <li key={p._id || p.id}>
              <strong>{p.title}</strong>
              {" • "}materials {p.materialsCostCents ?? 0}¢{" • "}labor{" "}
              {p.laborCostCents ?? 0}¢{" • "}total {p.totalCostCents ?? 0}¢
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
