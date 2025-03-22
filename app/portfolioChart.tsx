import { CartesianGrid, LineChart, XAxis, YAxis, Area } from "recharts";
import ChartTooltip from "./chartTooltip";
import ChartTooltipContent from "./chartTooltipContent";

// ... existing code ...
<LineChart
  accessibilityLayer
  data={chartData}
  margin={{
    left: 12,
    right: 12,
  }}
>
  <CartesianGrid vertical={false} />
  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
  <YAxis dataKey="nav" tickLine={false} axisLine={false} tickMargin={8} />
  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
  <Area
    dataKey="nav"
    type="monotone"
    stroke="var(--color-desktop)"
    fill="var(--color-desktop)"
    fillOpacity={0.2}
    strokeWidth={2}
    dot={false}
    stackId="1"
  />
  <Area
    dataKey="navIndex"
    type="monotone"
    stroke="var(--color-mobile)"
    fill="var(--color-mobile)"
    fillOpacity={0.2}
    strokeWidth={2}
    dot={false}
    stackId="2"
  />
</LineChart>;
// ... existing code ...
