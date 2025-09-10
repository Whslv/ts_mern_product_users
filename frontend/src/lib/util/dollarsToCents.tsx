export const dollarsToCents = (v: string | number) => {
  const s = String(v)
    .trim()
    .replace(/[$,\s]/g, "");
  if (!/^(?:\d+|\d*\.\d{1,2})$/.test(s)) return 0;
  return Math.round(parseFloat(s) * 100);
};
