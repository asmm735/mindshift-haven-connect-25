
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { MoodEntry } from "@/types/supabase-custom";
import { moodOptions } from "./constants";
import { MoodEntryChartData } from "./types";

type MoodChartProps = {
  moodHistory: MoodEntry[];
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const moodValue = payload[0].value;
    const moodLabel = moodOptions.find(option => option.value === moodValue)?.label;
    const entryData = payload[0].payload;
    
    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
        <p className="font-medium">{label}</p>
        <p className="text-mindshift-raspberry">{moodLabel}</p>
        {entryData.notes && (
          <p className="text-sm text-gray-600 mt-1 max-w-xs whitespace-normal break-words">
            {entryData.notes}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const MoodChart = ({ moodHistory }: MoodChartProps) => {
  const chartData: MoodEntryChartData[] = moodHistory.map(item => ({
    name: format(new Date(item.entry_date), "MMM dd"),
    mood: item.mood,
    notes: item.notes,
    moodLabel: moodOptions.find(option => option.value === item.mood)?.label ?? "",
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#666" />
          <YAxis 
            domain={[1, 10]} 
            ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} 
            stroke="#666"
            width={60}
            tickFormatter={(value) => {
              const mood = moodOptions.find(m => m.value === value);
              return mood ? mood.label : value.toString();
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="#943c64"
            strokeWidth={3}
            dot={{ stroke: "#943c64", strokeWidth: 2, r: 6, fill: "white" }}
            activeDot={{ stroke: "#943c64", strokeWidth: 2, r: 8, fill: "#943c64" }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
