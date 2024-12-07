import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Chart({ data, name, color }) {
  return (
    <ResponsiveContainer width="100%" height="85%" style={{ marginTop: 20 }}>
      <BarChart
        width={100}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="key" />
        <YAxis />
        <Legend />
        <Bar dataKey={name} barSize={30} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default Chart;
