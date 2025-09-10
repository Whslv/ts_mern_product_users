"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from "../components/Navbar";
import { createProduct } from "@/lib/api";
import { centsToDollars } from "@/lib/util/centsToDollars";
import { dollarsToCents } from "@/lib/util/dollarsToCents";
import { ProductCard } from "../components/ProductCard";
import { clamp2dp } from "@/lib/util/toDecimals";
import { Component } from "@/lib/types/component";


export default function AddPage() {
  const [title, setTitle] = useState("");
  const [laborMinutes, setLaborMinutes] = useState("");
  const [laborRate, setLaborRate] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [components, setComponents] = useState<Component[]>([]);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const [saving, setSaving] = useState(false);

  const totals = useMemo(() => {
    const compCents = components.reduce((sum, component) => {
      const packPriceCents = dollarsToCents(component.unitPrice);
      const pricePerUnit =
        packPriceCents / Math.max(0, component.unitQtyPerPack);
      const pricePerProduct = Math.ceil(
        pricePerUnit * Math.max(0, component.usageQtyPerProduct)
      );
      return sum + pricePerProduct;
    }, 0);

    const laborRateCents = dollarsToCents(laborRate);
    const minutes = Math.max(0, parseInt(laborMinutes || "0", 10));
    const laborCents = Math.round(laborRateCents * (minutes / 60));
    const totalCost = compCents + laborCents;
    const sellCents = dollarsToCents(sellingPrice);
    const profitCents = sellCents - totalCost;
    const profitMarginPct = totalCost > 0 ? (profitCents / totalCost) * 100 : 0;

    return {
      componentsCost: compCents,
      laborCost: laborCents,
      total: totalCost,
      profitAmount: profitCents,
      profitPct: profitMarginPct,
    };
  }, [components, laborRate, laborMinutes, sellingPrice]);

  const addComponent = () => {
    setComponents((prev) => [
      ...prev,
      {
        title: "",
        vendorUrl: "",
        unitName: "",
        unitQtyPerPack: 10,
        unitPrice: "",
        usageQtyPerProduct: 1.5,
      },
    ]);
  };

  const updateComponent = <K extends keyof Component>(
    index: number,
    key: K,
    value: Component[K]
  ) => {
    setComponents((prev) =>
      prev.map((component, i) =>
        i === index ? { ...component, [key]: value } : component
      )
    );
  };

  const removeComponent = (index: number) => {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  };

  const fieldValidator = () => {
    if (
      title.trim() &&
      laborMinutes.trim() &&
      laborRate.trim() &&
      sellingPrice.trim()
    ) {
      return true;
    } else {
      return false;
    }
  };

  function errorHandler(err: string) {
    setError(err);
    setTimeout(() => {
      setError("");
    }, 3000);
  }

  const saveProduct = async () => {
    setError("");

    if (!fieldValidator()) {
      errorHandler("Fields should have content");
      return;
    }

    const payload = {
      title: title.trim(),
      laborMinutes: Math.max(0, parseInt(laborMinutes, 10)),
      laborRatePerHour: clamp2dp(laborRate),
      sellingPrice: clamp2dp(sellingPrice),
      components: components.map((component) => ({
        title: component.title.trim(),
        vendorUrl: component.vendorUrl?.trim() || undefined,
        unitName: component.unitName.trim(),
        unitQtyPerPack: Number(component.unitQtyPerPack) || 1,
        unitPrice: clamp2dp(component.unitPrice || "0"),
        usageQtyPerProduct: Number(component.usageQtyPerProduct) || 0,
      })),
    };

    try {
      setSaving(true);
      createProduct(payload);
    } catch (error) {
      console.error(error);
    } finally {
      setError("");
      setTitle("");
      setLaborMinutes("");
      setLaborRate("");
      setSellingPrice("");
      setComponents([]);
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <Navbar />

      <div className="product">
        <h2 className="product_title title_h2">Create new product</h2>
        <div className="product_container">
          <header className="product_header">
            <div className="product_header--content">
              <h3 className="product_header--title">{title || "My product"}</h3>
              <span className="product_header--subtitle">{`Total components: ${components.length}`}</span>
            </div>

            <div className="product_input">
              <h3 className="product_input--name input__name">Name</h3>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product name"
                className={`product_input--field input__field ${error && "input__danger"}`}
              />
              <button className="fold-unfold-button"></button>
            </div>
          </header>

          <ProductCard
            error={error}
            laborMinutes={laborMinutes}
            setLaborMinutes={setLaborMinutes}
            laborRate={laborRate}
            setLaborRate={setLaborRate}
            sellingPrice={sellingPrice}
            setSellingPrice={setSellingPrice}
            saveProduct={saveProduct}
            saving={saving}
            totals={totals}
            addComponent={addComponent}
            components={components}
          />

        </div>
      </div>

      {error && (
        <div className="error-block">
          <div className="error-message">{error}</div>
        </div>
      )}

      {/* Components preview list */}
      <div className="component">
        <h2 className="product_title component_title">Components</h2>
        <div className="">
          {components.map((c, idx) => (
            <div key={idx} className="product_container component_container">
              <header className="product_header component_header">
                <div className="product_header--content component_header--content">
                  <h3 className="product_header--title component_header--title">
                    {c.title}
                  </h3>
                  <span className="product_header--subtitle component_content--subtitle">{`Total components: ${components.length}`}</span>
                </div>

                <div className="product_input component_input">
                  <h3 className="product_input--name component_input--name input__name">
                    Name
                  </h3>
                  <input
                    className="product_input--field component_input--field input__field"
                    value={c.title}
                    onChange={(e) =>
                      updateComponent(idx, "title", e.target.value)
                    }
                    placeholder={`Component name`}
                  />
                </div>
              </header>

              <section className="product_body component_body">
                <div className="product_card component_card">
                  <div className="card_input">
                    <div className="card_input_body">
                      <div>
                        <label className="card_input_body--lable input__name">
                          Vendor URL(optional)
                        </label>
                        <input
                          className="product_input--field component_input--field input__field"
                          value={c.vendorUrl || ""}
                          onChange={(e) =>
                            updateComponent(idx, "vendorUrl", e.target.value)
                          }
                          placeholder="www.amazon.com"
                        />
                      </div>
                      <button className="card_input_body--info-icon"></button>
                      <div className="card_input_body--info">
                        <p className="card_input_body--info-description">
                          Enter the link to the supplier`s product page.
                        </p>
                      </div>
                    </div>

                    <div className="card_input_body">
                      <div>
                        <label className="card_input_body--lable input__name">
                          Unit name (e.g. pcs, ml)
                        </label>
                        <input
                          className="product_input--field component_input--field input__field"
                          value={c.unitName}
                          onChange={(e) =>
                            updateComponent(idx, "unitName", e.target.value)
                          }
                          placeholder="pcs"
                        />
                      </div>
                      <button className="card_input_body--info-icon"></button>
                      <div className="card_input_body--info">
                        <p className="card_input_body--info-description">
                          Specify the unit type (e.g., pcs, ml, kg).
                        </p>
                      </div>
                    </div>

                    <div className="card_input_body">
                      <div>
                        <label className="card_input_body--lable input__name">
                          Quntity in one unit
                        </label>
                        <input
                          className="product_input--field component_input--field input__field"
                          value={c.unitQtyPerPack}
                          onChange={(e) =>
                            updateComponent(
                              idx,
                              "unitQtyPerPack",
                              Math.max(1, Number(e.target.value) || 1)
                            )
                          }
                          placeholder="Units per pack"
                        />
                      </div>
                      <button className="card_input_body--info-icon"></button>
                      <div className="card_input_body--info">
                        <p className="card_input_body--info-description">
                          Enter how many items are in one unit (e.g., 1 box = 12
                          pcs).
                        </p>
                      </div>
                    </div>

                    <div className="card_input_body">
                      <div>
                        <label className="card_input_body--lable input__name">
                          Cost
                        </label>
                        <input
                          className="product_input--field component_input--field input__field"
                          value={c.unitPrice}
                          onChange={(e) =>
                            updateComponent(
                              idx,
                              "unitPrice",
                              clamp2dp(e.target.value)
                            )
                          }
                          placeholder="19.99"
                        />
                      </div>
                      <button className="card_input_body--info-icon"></button>
                      <div className="card_input_body--info">
                        <p className="card_input_body--info-description">
                          Enter how much cost this component.
                        </p>
                      </div>
                    </div>

                    <div className="card_input_body">
                      <div>
                        <label className="card_input_body--lable input__name">
                          Quntity neede per product
                        </label>
                        <input
                          className="product_input--field component_input--field input__field"
                          value={c.usageQtyPerProduct}
                          onChange={(e) =>
                            updateComponent(
                              idx,
                              "usageQtyPerProduct",
                              Math.max(0, Number(e.target.value) || 0)
                            )
                          }
                          placeholder="1.5"
                        />
                      </div>
                      <button className="card_input_body--info-icon"></button>
                      <div className="card_input_body--info">
                        <p className="card_input_body--info-description">
                          Enter how much cost this component.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="card_bottom">
                    <div className="card_calcualtions">
                      <div className="profit-content">
                        <div className="profit-text">Cost per product:</div>
                        <div className="profit-number">
                          $
                          {(() => {
                            const packCents = dollarsToCents(c.unitPrice);
                            const perUnit =
                              packCents / Math.max(1, c.unitQtyPerPack);
                            const perProduct = Math.ceil(
                              perUnit * Math.max(0, c.usageQtyPerProduct)
                            );
                            return centsToDollars(perProduct);
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="card_buttons">
                      <button
                        className="card_button--white"
                        onClick={() => removeComponent(idx)}
                      >
                        Remove
                      </button>

                      <button
                        className="card_button--navy"
                        onClick={addComponent}
                      >
                        ADD COMPONENT #{components.length + 1}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
