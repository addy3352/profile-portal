import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import toast from "react-hot-toast";

// --- Mesh API Helpers ---
// Calls are now routed through the Nginx proxy defined in nginx.conf.template
// The proxy adds the required API key on the server side.

const api = {
  garmin: () => fetch(`/mcp/call/garmin/latest`, { method: "POST" }).then((r) => r.json()),
  weight: () => fetch(`/mcp/call/weight/latest`).then((r) => r.json()),
  calories: () => fetch(`/mcp/call/calories/latest`).then((r) => r.json()),
  recommendation: () => fetch(`/mcp/call/ai/recommendation`, { method: "POST" }).then((r) => r.json()),

  syncGarmin: () => fetch(`/mcp/call/sync/garmin`, { method: "POST" }),
  syncNutrition: () => fetch(`/mcp/call/sync/nutrition`, { method: "POST" })
};

// --- Sparkline Chart ---
const Sparkline = ({ data, color }) => (
  <div className="h-12">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          stroke={color}
          strokeWidth={2}
          dot={false}
          dataKey="value"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

// --- Mini Metric Card ---
const MiniMetric = ({ title, value, trend }) => (
  <div className="bg-white rounded-xl shadow-sm p-2">
    <div className="text-[11px] text-slate-600">{title}</div>
    <div className="text-sm font-semibold text-slate-900">{value ?? "--"}</div>
    <Sparkline data={trend} color="#0F766E" />
  </div>
);

// --- Agent-Health Card ---
const HealthCoachCard = ({ rec }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
    <h3 className="text-sm font-semibold mb-1">🧠 Agent-Health Insight</h3>
    <p className="text-xs text-slate-700 whitespace-pre-line">{rec ?? "Loading..."}</p>
  </div>
);

export default function HealthProfile() {

  // === Auth check (TEMPORARILY COMMENTED OUT FOR DEBUGGING) ===
  /*
  const token = localStorage.getItem("hp_token");
  useEffect(() => {
    if (!token || token !== import.meta.env.VITE_HEALTH_PASS) {
      window.location.href = "/signin";
    }
  }, [token]);
  */

  // === State ===
  const [garmin, setGarmin] = useState<any>(null);
  const [weight, setWeight] = useState<any>(null);
  const [calories, setCalories] = useState<any>(null);
  const [rec, setRec] = useState<string>("");
  const [syncing, setSyncing] = useState<boolean>(false);

  // === Load Data ===
  async function loadData() {
    const [g, w, c, r] = await Promise.all([
      api.garmin(),
      api.weight(),
      api.calories(),
      api.recommendation()
    ]);
    setGarmin(g);
    setWeight(w);
    setCalories(c);
    setRec(r?.advice);
  }

  useEffect(() => {
    loadData();
  }, []);

  // === Sync Handler ===
  async function syncNow(kind = "all") {
    try {
      setSyncing(true);

      if (kind === "all") {
        await Promise.all([
          api.syncGarmin(),
          api.syncNutrition()
        ]);
      } else if (kind === "garmin") {
        await api.syncGarmin();
      } else {
        await api.syncNutrition();
      }

      await loadData();
      toast.success("✨ Data synced successfully");
    } catch (err) {
      console.error(err);
      toast.error("Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  if (!garmin || !weight || !calories) {
    return <div className="p-4 text-sm text-slate-600">Fetching health data…</div>;
  }

  const latest = garmin.latest;
  const runs = garmin.last7runs?.map((x) => ({ value: x.distance_km })) ?? [];
  const hrvTrend = garmin.last7hrv?.map((x) => ({ value: x })) ?? [];
  const rhrTrend = garmin.last7rhr?.map((x) => ({ value: x })) ?? [];
  const sleepTrend = garmin.last7sleep?.map((x) => ({ value: x })) ?? [];

  return (
    <div className="space-y-4 p-4">

      {/* Sync Controls */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => syncNow("garmin")}
          disabled={syncing}
          className="px-3 py-1 rounded bg-teal-600 text-white text-xs hover:bg-teal-700 disabled:opacity-50"
        >
          {syncing ? "Syncing…" : "Sync Garmin"}
        </button>

        <button
          onClick={() => syncNow("nutrition")}
          disabled={syncing}
          className="px-3 py-1 rounded bg-amber-600 text-white text-xs hover:bg-amber-700 disabled:opacity-50"
        >
          {syncing ? "Syncing…" : "Sync Nutrition"}
        </button>

        <button
          onClick={() => syncNow("all")}
          disabled={syncing}
          className="px-3 py-1 rounded bg-slate-700 text-white text-xs hover:bg-slate-900 disabled:opacity-50 flex items-center gap-1"
        >
          {syncing ? (
            <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
          ) : "Refresh All"}
        </button>
      </div>

      {/* Vitals + Calories Summary */}
      <div className="grid grid-cols-3 gap-2">
        <MiniMetric title="Weight (kg)" value={weight.value} trend={[]} />
        <MiniMetric title="Body Fat (%)" value={weight.bodyfat} trend={[]} />
        <MiniMetric title="Calories" value={calories.today} trend={calories.last7?.map(x => ({value:x})) ?? []} />
      </div>

      {/* AI Recommendation */}
      <HealthCoachCard rec={rec} />

      {/* Run Trend */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-sm font-semibold mb-1">Running — Last 7 Activities</h3>
        <Sparkline data={runs} color="#0F766E" />
      </div>

      {/* Recovery Trends */}
      <div className="grid grid-cols-3 gap-2">
        <MiniMetric title="HRV (ms)" value={latest?.hrv} trend={hrvTrend} />
        <MiniMetric title="RHR (bpm)" value={latest?.rhr} trend={rhrTrend} />
        <MiniMetric title="Sleep (hr)" value={latest?.sleep} trend={sleepTrend} />
      </div>
    </div>
  );
}

