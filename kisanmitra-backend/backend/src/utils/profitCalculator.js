// Deterministic, explainable "best market" math -- no AI needed for this part.
// transportRatePerKm: rupees per km for a round trip; defaults to a rough national average.
function estimateTransportCost(distanceKm, { ratePerKm = 35, roundTrip = true } = {}) {
  const multiplier = roundTrip ? 2 : 1;
  return Math.round(distanceKm * ratePerKm * multiplier);
}

// quantityKg * pricePerKg - transport - storage - platformFee
function calculateNetProfit({ quantityKg, pricePerKg, distanceKm, storageCostPerKgPerDay = 0, storageDays = 0, platformFeePercent = 0 }) {
  const grossRevenue = quantityKg * pricePerKg;
  const transportCost = estimateTransportCost(distanceKm);
  const storageCost = storageCostPerKgPerDay * storageDays * quantityKg;
  const platformFee = Math.round((grossRevenue * platformFeePercent) / 100);
  const netProfit = grossRevenue - transportCost - storageCost - platformFee;

  return {
    grossRevenue,
    transportCost,
    storageCost,
    platformFee,
    netProfit: Math.round(netProfit),
  };
}

// Ranks a list of { marketName, pricePerKg, distanceKm } options by net profit for a given quantity.
function rankMarketsByNetProfit(quantityKg, options) {
  return options
    .map((opt) => ({ ...opt, ...calculateNetProfit({ quantityKg, pricePerKg: opt.pricePerKg, distanceKm: opt.distanceKm }) }))
    .sort((a, b) => b.netProfit - a.netProfit);
}

module.exports = { estimateTransportCost, calculateNetProfit, rankMarketsByNetProfit };
