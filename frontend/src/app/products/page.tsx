"use client";
import { useEffect, useState } from "react";
import { deleteProduct, getListOfProducts } from "../../lib/api";
import { centsToDollars } from "../../lib/util/centsToDollars";
import { Product } from "@/lib/types/product";
import { Navbar } from "../components/Navbar";

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      deleteProduct(id);
      const newListOfProducts = items.filter((item) => item._id !== id);
      if (newListOfProducts) {
        setLoading(false);
      }
      setItems(newListOfProducts);
    } catch (error: any) {
      setErr(error?.message || "Failed to delete product");
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getListOfProducts({ page: 1, limit: 50 });
        setItems(res.data.items ?? []);
        setTotal(res.data.total ?? 0);
      } catch (e: any) {
        setErr(e?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="container">
      <Navbar />

      <main className="products">
        <div className="products_header">
          <h1 className="products_header-title title_h2">My Products</h1>
          <div className="products_header-subtitle subtitle_h2">
            Showing {items.length} of {total}
          </div>
        </div>

        {loading && <div className="title_h2">Loading…</div>}
        {err && <div className="title_h2">{err}</div>}

        {!loading && !err && items.length === 0 && (
          <div className="title_h2">No products yet.</div>
        )}

        {!loading && !err && items.length > 0 && (
          <>
            <div id="searchbar" className="searchbar">
              <input
                type="text"
                className="searchbar-input input__field"
                placeholder="Search"
              />
              <a href="" className="searchbar_icon icon"></a>
            </div>

            <div className="products_cards">
              {items.map((p) => (
                <div key={p._id} className="products_card ">
                  <div className="products_card-header">
                    <h2 className="products_card-title title_h2">{p.title}</h2>
                    <h3 className="products_card-stock title_h3">In stock</h3>
                    <div className="products_card-subtitle subtitle_h2">
                      Components: {p.components?.length ?? 0}
                    </div>
                  </div>

                  <div className="products_card-image">
                    <a href="#" className="iamge"></a>
                  </div>

                  <div className="products_card_bottom">
                    <div className="total">
                      <div className="total-content">
                        <div className="total-text">Components:</div>
                        <div className="total-number">
                          ${centsToDollars(p.materialsCostCents)}
                        </div>
                      </div>
                      <div className="total-content">
                        <div className="total-text">Labor:</div>
                        <div className="total-number">
                          ${centsToDollars(p.laborCostCents)}
                        </div>
                      </div>
                      <div className="total-content">
                        <div className="total-text">Total:</div>
                        <div className="total-number">
                          ${centsToDollars(p.totalCostCents)}
                        </div>
                      </div>
                    </div>
                    <div className="profit">
                      <div className="profit-content">
                        <div className="profit-text">Margin:</div>
                        <div className="profit-number">
                          {typeof p.profitMarginPercent === "number"
                            ? `${p.profitMarginPercent.toFixed(1)}%`
                            : "-"}
                        </div>
                      </div>
                      <div className="profit-content">
                        <div className="profit-text">Price:</div>
                        <div className="profit-number">
                          ${centsToDollars(p.sellingPriceCents)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="products_card_buttons">
                    <button
                      className="card_button--white"
                      onClick={() => {
                        handleDelete(p._id);
                      }}
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </button>
                    <button className="card_button--navy">Details</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
