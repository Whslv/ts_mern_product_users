export const clamp2dp = (v: string) => {
  const cleaned = v.replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) return parts[0] + "." + parts.slice(1).join("");
  if (parts[1]?.length > 2) parts[1] = parts[1].slice(0, 2);
  return parts.join(".");
};
