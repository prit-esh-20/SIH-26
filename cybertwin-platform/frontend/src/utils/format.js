export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function shortHash(hash, length = 8) {
  if (!hash) return "";
  return `${hash.slice(0, length)}…${hash.slice(-6)}`;
}
