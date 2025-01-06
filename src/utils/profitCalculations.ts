interface Cost {
  cost_type: string;
  amount: number;
  date: string;
}

export const calculateTotalCostsByType = (costs: Cost[] | null, type: string, startDate: Date, endDate: Date) => {
  if (!costs) return 0;
  
  return costs.reduce((total, cost) => {
    const costDate = new Date(cost.date);
    if (cost.cost_type === type && 
        costDate >= startDate && 
        costDate <= endDate) {
      return total + Number(cost.amount);
    }
    return total;
  }, 0);
};

export const calculateNetProfit = (
  revenue: number,
  productCosts: number,
  advertisingCosts: number,
  shippingCosts: number
) => {
  const totalCosts = productCosts + advertisingCosts + shippingCosts;
  return revenue - totalCosts;
};

export const calculateProfitMargin = (netProfit: number, revenue: number) => {
  return revenue > 0 ? (netProfit / revenue) * 100 : 0;
};