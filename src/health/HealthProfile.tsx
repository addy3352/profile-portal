import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import toast from "react-hot-toast";

// --- Mesh API Helpers ---
// Enhanced fetch to include logging, error handling, and no-caching.
const fetchWithLogs = async (url: string, options: RequestInit = {}) => {
  const finalOptions = { ...options, cache: "no-store" as const };
  console.log(`[API] Fetching: ${url}`, finalOptions);

  try {
    const response = await fetch(url, finalOptions);
    console.log(`[API] Response from ${url}: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API] Error on ${url}:`, errorText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (response.status === 204) { // No Content
      console.log(`[API] No content from ${url}`);
      return null;
    }

    const data = await response.json();
    console.log(`[API] Data from ${url}:`, data);
    return data;
  } catch (error) {
    console.error(`[API] Network or parsing error on ${url}:`, error);
    throw error;
  }
};

const api = {
  garmin: () => fetchWithLogs(`/mcp/call/garmin/latest`, { method: "POST" }),
  weight: () => fetchWithLogs(`/mcp/call/weight/latest`),
  calories: () => fetchWithLogs(`/mcp/call/calories/latest`),
  recommendation: () => fetchWithLogs(`/mcp/call/ai/recommendation`, { method: "POST" }),
  syncGarmin: () => fetchWithLogs(`/mcp/call/sync/garmin`, { method: "POST" }),
  syncNutrition: () => fetchWithLogs(`/mcp/call/sync/nutrition`, { method: "POST" })
};


// --- Sparkline Chart ---
interface SparklineProps {
  data: any[];
  color: string;
}
const Sparkline = ({ data, color }: SparklineProps) => (
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
interface MiniMetricProps {
  title: string;
  value: React.ReactNode;
  trend: any[];
}
const MiniMetric = ({ title, value, trend }: MiniMetricProps) => (
  <div className="bg-white rounded-xl shadow-sm p-2">
    <div className="text-[11px] text-slate-600">{title}</div>
    <div className="text-sm font-semibold text-slate-900">{value ?? "--"}</div>
    <Sparkline data={trend} color="#0F766E" />
  </div>
);

// --- Agent-Health Card ---
interface HealthCoachCardProps {
  rec: React.ReactNode;
}
const HealthCoachCard = ({ rec }: HealthCoachCardProps) => (
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  // === Load Data ===
  async function loadData() {
    setLoading(true);
    setError(null);
    console.log("[Data] --- Loading all data ---");
    try {
      // Use Promise.allSettled to allow partial data loading
      const results = await Promise.allSettled([
        api.garmin(),
        api.weight(),
        api.calories(),
        api.recommendation()
      ]);
      console.log("[Data] All settled:", results);

      const [garminResult, weightResult, caloriesResult, recResult] = results;

      if (garminResult.status === 'fulfilled') {
        setGarmin({
          latest: garminResult.value,
          last7hrv: [],
          last7rhr: [],
          last7sleep: [],
          last7runs: []
        });
      } else console.error("[Data] Garmin fetch failed:", garminResult.reason);

      if (weightResult.status === 'fulfilled') setWeight(weightResult.value);
      else console.error("[Data] Weight fetch failed:", weightResult.reason);

      if (caloriesResult.status === 'fulfilled') setCalories(caloriesResult.value);
      else console.error("[Data] Calories fetch failed:", caloriesResult.reason);

      if (recResult.status === 'fulfilled' && recResult.value?.result) {
        const { training_plan, nutrition_plan, motivation, today_focus } = recResult.value.result;
        const formattedRecommendation = `
**Training Plan:**
${training_plan || 'N/A'}

**Nutrition Plan:**
${nutrition_plan || 'N/A'}

**Today's Focus:**
${today_focus || 'N/A'}

**Motivation:**
${motivation || 'N/A'}
        `;
        setRec(formattedRecommendation);
      } else {
        setRec("No new recommendation available.");
      }

      // Set a general error if any of the critical fetches failed
      if (results.some(res => res.status === 'rejected')) {
        setError("Some data failed to load. The displayed information may be incomplete.");
        toast.error("Some data failed to load.");
      }

    } catch (err: any) {
      console.error("[Data] Unexpected error in loadData:", err);
      setError(err.message || "An unexpected error occurred while loading data.");
      toast.error(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
      console.log("[Data] --- Finished loading data ---");
    }
  }


  useEffect(() => {
    loadData();
  }, []);

  // === Sync Handler ===
  async function syncNow(kind = "all") {
    try {
      setSyncing(true);
      setError(null);
      console.log(`[Sync] --- Syncing ${kind} ---`);

      if (kind === "all") {
        await Promise.all([api.syncGarmin(), api.syncNutrition()]);
      } else if (kind === "garmin") {
        await api.syncGarmin();
      } else {
        await api.syncNutrition();
      }

      toast.success("✨ Sync request sent. Fetching new data...");
      await loadData();

    } catch (err: any) {
      console.error(`[Sync] Sync failed for ${kind}:`, err);
      setError(err.message || `Sync failed for ${kind}`);
      toast.error(err.message || `Sync failed for ${kind}`);
    } finally {
      setSyncing(false);
      console.log(`[Sync] --- Finished syncing ${kind} ---`);
    }
  }

  if (loading) {
    return <div className="p-4 text-sm text-slate-600">Fetching health data…</div>;
  }

  // Display a general error message, but still attempt to render the rest of the component
  const ErrorDisplay = () => error ? (
     <div className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-50 rounded-md">
        <strong>Warning:</strong> {error}
    </div>
  ) : null;


  const latest = garmin?.latest;
  const runs = garmin?.last7runs?.map((x) => ({ value: x.distance_km })) ?? [];
  const hrvTrend = garmin?.last7hrv?.map((x) => ({ value: x })) ?? [];
  const rhrTrend = garmin?.last7rhr?.map((x) => ({ value: x })) ?? [];
  const sleepTrend = garmin?.last7sleep?.map((x) => ({ value: x })) ?? [];

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

      {/* Error Display */}
      <ErrorDisplay />

      {/* Vitals + Calories Summary */}
      <div className="grid grid-cols-3 gap-2">
        <MiniMetric title="Weight (kg)" value={weight?.value} trend={[]} />
        <MiniMetric title="Body Fat (%)" value={weight?.bodyfat} trend={[]} />
        <MiniMetric title="Calories" value={calories?.today} trend={calories?.last7?.map(x => ({value:x})) ?? []} />
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
        <MiniMetric title="RHR (bpm)" value={latest?.restingHeartRate} trend={rhrTrend} />
        <MiniMetric title="Sleep (hr)" value={latest?.sleepingSeconds ? (latest.sleepingSeconds / 3600).toFixed(1) : null} trend={sleepTrend} />
      </div>
    </div>
  );
}

