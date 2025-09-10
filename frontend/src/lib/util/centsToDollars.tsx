export const centsToDollars = (c?: number | null) =>
  typeof c === "number" ? (c / 100).toFixed(2) : "-";