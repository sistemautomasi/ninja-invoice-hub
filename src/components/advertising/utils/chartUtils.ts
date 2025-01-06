import { format } from "date-fns";

export const getDateRange = (selectedPeriod: string) => {
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  
  switch (selectedPeriod) {
    case "today":
      return { start: today, end: now };
    case "last7days":
      return { 
        start: new Date(now.setDate(now.getDate() - 7)), 
        end: new Date() 
      };
    case "last30days":
      return { 
        start: new Date(now.setDate(now.getDate() - 30)), 
        end: new Date() 
      };
    default:
      return { start: today, end: now };
  }
};

export const processAdCostsData = (data: any[]) => {
  return data.reduce((acc: any[], cost) => {
    const date = format(new Date(cost.date), 'MMM dd');
    const existingDate = acc.find(item => item.date === date);

    if (existingDate) {
      existingDate[cost.platform || 'Other'] = (existingDate[cost.platform || 'Other'] || 0) + Number(cost.amount);
      existingDate.total = (existingDate.total || 0) + Number(cost.amount);
    } else {
      const newEntry = {
        date,
        [cost.platform || 'Other']: Number(cost.amount),
        total: Number(cost.amount)
      };
      acc.push(newEntry);
    }

    return acc;
  }, []);
};

export const chartColors = {
  facebook: "#1877F2",
  tiktok: "#FF0050",
  google: "#EA4335",
  instagram: "#E4405F",
  Other: "#64748B",
  total: "#8B5CF6"
};

export const formatPlatformName = (platform: string) => {
  const names: Record<string, string> = {
    facebook: "Facebook Ads",
    tiktok: "TikTok Ads",
    google: "Google Ads",
    instagram: "Instagram Ads",
    Other: "Other Platforms",
    total: "Total Spend"
  };
  return names[platform] || platform;
};