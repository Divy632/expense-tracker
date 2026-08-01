const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
};

export const formatMoney = (amount, currency = 'USD') => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  const value = Number(amount || 0);
  const formatted = Math.abs(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${value < 0 ? '-' : ''}${symbol}${formatted}`;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

export const formatDateInput = (date) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().split('T')[0];
};
