import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

const GRID = '#2a3145'
const AXIS = '#565f78'
const TEXT_DIM = '#9aa3b8'

const MEASURE_SERIES = [
  { key: 'chest', label: 'Chest', color: '#3987e5' },
  { key: 'waist', label: 'Waist', color: '#199e70' },
  { key: 'arms', label: 'Arms', color: '#9085e9' },
  { key: 'thighs', label: 'Thighs', color: '#e66767' },
]

function ChartTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-md border border-border bg-panel-raised px-3 py-2 text-xs shadow-lg">
      <div className="mb-1 font-semibold text-text-dim">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-text-dim">{p.name}:</span>
          <span className="font-semibold text-text">
            {p.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  )
}

export function WeightChart({ data }) {
  if (data.length < 2) {
    return (
      <p className="text-sm text-text-dim">Log at least two measurements to see your weight trend.</p>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="0" vertical={false} />
        <XAxis dataKey="date" stroke={AXIS} tick={{ fill: TEXT_DIM, fontSize: 11 }} tickLine={false} />
        <YAxis
          stroke={AXIS}
          tick={{ fill: TEXT_DIM, fontSize: 11 }}
          tickLine={false}
          domain={['dataMin - 5', 'dataMax + 5']}
        />
        <Tooltip content={<ChartTooltip unit=" lb" />} />
        <Line
          type="monotone"
          dataKey="weight"
          name="Weight"
          stroke="#3987e5"
          strokeWidth={2}
          dot={{ r: 4, fill: '#3987e5', strokeWidth: 0 }}
          activeDot={{ r: 6 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function MeasurementsChart({ data }) {
  if (data.length < 2) {
    return (
      <p className="text-sm text-text-dim">Log at least two measurements to see your trend lines.</p>
    )
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid stroke={GRID} strokeDasharray="0" vertical={false} />
        <XAxis dataKey="date" stroke={AXIS} tick={{ fill: TEXT_DIM, fontSize: 11 }} tickLine={false} />
        <YAxis stroke={AXIS} tick={{ fill: TEXT_DIM, fontSize: 11 }} tickLine={false} />
        <Tooltip content={<ChartTooltip unit=" in" />} />
        <Legend
          wrapperStyle={{ fontSize: 12, color: TEXT_DIM }}
          iconType="circle"
          iconSize={8}
        />
        {MEASURE_SERIES.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            dot={{ r: 4, fill: s.color, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
