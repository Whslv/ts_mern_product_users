import { centsToDollars } from "@/lib/util/centsToDollars";
import { InputField } from "./InputField";
import { clamp2dp } from "@/lib/util/toDecimals";
import { Component } from "@/lib/types/component";

type Props = {
  error: string;
  laborMinutes: string;
  setLaborMinutes: (laborMinutes: string) => void;
  laborRate: string;
  setLaborRate: (laborRate: string) => void;
  sellingPrice: string;
  setSellingPrice: (sellingPrice: string) => void;
  saveProduct: () => void;
  saving: boolean;
  totals: {
    componentsCost: number;
    laborCost: number;
    total: number;
    profitAmount: number;
    profitPct: number;
  };
  addComponent: () => void;
  components:Component[]
};

export const ProductCard: React.FC<Props> = ({
  error,
  laborMinutes,
  setLaborMinutes,
  laborRate,
  setLaborRate,
  sellingPrice,
  setSellingPrice,
  saveProduct,
  saving,
  totals,
  addComponent,
  components,
}) => {
  return (
    <section className="product_body">
      <div className="product_card">
        <div className="card_input">
          <InputField
            error={error}
            label="Labor time (minutes)"
            value={laborMinutes}
            type="number"
            onChange={(value) => setLaborMinutes(value)}
            placeholder="480"
            hint="Enter the amount of time required to craft or maintain this product until it is ready to be sent to the client."
          />
          <InputField
            error={error}
            label="Labor cost"
            value={laborRate}
            onChange={(value) => setLaborRate(clamp2dp(value))}
            placeholder="25.15"
            hint="Enter the labor cost required to produce or maintain this product."
          />
          <InputField
            error={error}
            label="Selling price"
            value={sellingPrice}
            onChange={(value) => setSellingPrice(clamp2dp(value))}
            placeholder="199.99"
            hint="Enter the selling price you will charge the client for this product."
          />
        </div>
        <div className="card_bottom">
          <div className="card_calcualtions">
            <div className="total">
              <div className="total-content">
                <div className="total-text">Components cost:</div>
                <div className="total-number">
                  ${centsToDollars(totals.componentsCost)}
                </div>
              </div>
              <div className="total-content">
                <div className="total-text">Labor cost:</div>
                <div className="total-number">
                  ${centsToDollars(totals.laborCost)}
                </div>
              </div>
              <div className="total-content">
                <div className="total-text">Total amount:</div>
                <div className="total-number">
                  ${centsToDollars(totals.total)}
                </div>
              </div>
            </div>
            <div className="profit">
              <div className="profit-content">
                <div className="profit-text">Profit margin:</div>
                <div className="profit-number">
                  {totals.profitPct.toFixed(1)}%
                </div>
              </div>
              <div className="profit-content">
                <div className="profit-text">Profit amount:</div>
                <div className="profit-number">
                  ${centsToDollars(totals.profitAmount)}
                </div>
              </div>
            </div>
          </div>
          <div className="card_buttons">
            <button
              className="card_button--orange"
              onClick={saveProduct}
              // disabled={saving || !fieldValidator()}
            >
              {saving ? "SAVING..." : "SAVE PRODUCT"}
            </button>
            <button className="card_button--navy" onClick={addComponent}>
              ADD COMPONENT #{components.length + 1}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
