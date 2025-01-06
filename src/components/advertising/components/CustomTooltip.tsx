import { formatPlatformName } from "../utils/chartUtils";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-3 border-b pb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-3 py-1">
            <div 
              className="w-4 h-4 rounded-full shadow-sm" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 font-medium">
              {formatPlatformName(entry.name)}:
            </span>
            <span className="font-semibold text-gray-900">
              ${Number(entry.value).toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              })}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};