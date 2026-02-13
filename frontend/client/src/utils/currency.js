export const currencySymbol = (code) => {
  const map = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "C$",
    AUD: "A$",
  };
  return map[code] || code;
};

export const formatMoney = (amount, currency = "INR") => {
  const symbol = currencySymbol(currency);
  const n = Number(amount || 0);

  // INR grouping looks better with en-IN
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return `${symbol} ${n.toLocaleString(locale, { maximumFractionDigits: 2 })}`;
};