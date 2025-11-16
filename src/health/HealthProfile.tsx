import { useEffect, useState } from "react";
import { Activity, Heart, Moon, TrendingUp, Droplets, Utensils, Target, Zap, AlertCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

// --- Mesh API Helpers ---
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

    if (response.status === 204) {
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
const Sparkline = ({ data, color }: SparklineProps) => {
  if (!data || data.length === 0) {
    return <div className="h-12 flex items-center justify-center text-xs text-gray-400">No data</div>;
  }
  return (
    <div className="h-12">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" stroke={color} strokeWidth={2} dot={false} dataKey="value" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Helper Functions ---
const calculateRecoveryScore = (hrv: number | null, rhr: number | null, sleep: number | null): number => {
  if (!hrv && !rhr && !sleep) return 0;
  
  let score = 0;
  let factors = 0;

  if (hrv !== null) {
    score += hrv >= 60 ? 35 : hrv >= 40 ? 20 : 10;
    factors++;
  }
  
  if (rhr !== null) {
    score += rhr <= 60 ? 35 : rhr <= 70 ? 20 : 10;
    factors++;
  }
  
  if (sleep !== null) {
    score += sleep >= 7 ? 30 : sleep >= 6 ? 15 : 5;
    factors++;
  }

  return factors > 0 ? Math.round(score / factors * 100 / 35) : 0;
};

const getRecoveryColor = (score: number) => {
  if (score >= 70) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

const getRecoveryBg = (score: number) => {
  if (score >= 70) return 'bg-green-50 border-green-200';
  if (score >= 50) return 'bg-yellow-50 border-yellow-200';
  return 'bg-red-50 border-red-200';
};

const getMetricStatus = (metric: string, value: number | null) => {
  if (value === null) return 'unknown';
  const statuses: any = {
    hrv: value >= 60 ? 'good' : value >= 40 ? 'moderate' : 'low',
    rhr: value <= 60 ? 'good' : value <= 70 ? 'moderate' : 'high',
    sleep: value >= 7 ? 'good' : value >= 6 ? 'moderate' : 'low'
  };
  return statuses[metric] || 'moderate';
};

const getStatusColor = (status: string) => {
  return {
    good: 'text-green-600 bg-green-50',
    moderate: 'text-yellow-600 bg-yellow-50',
    low: 'text-red-600 bg-red-50',
    high: 'text-red-600 bg-red-50',
    unknown: 'text-gray-400 bg-gray-50'
  }[status] || 'text-gray-400 bg-gray-50';
};

const getStatusLabel = (metric: string, value: number | null) => {
  if (value === null) return '- - -';
  const status = getMetricStatus(metric, value);
  if (metric === 'rhr') {
    return value <= 60 ? '↓ Good' : '→ Monitor';
  }
  if (metric === 'hrv') {
    return value >= 60 ? '↑ Good' : '↓ Low';
  }
  if (metric === 'sleep') {
    return value >= 7 ? '✓ Good' : '⚠ Low';
  }
  return '→';
};

export default function HealthProfile() {
  const [garmin, setGarmin] = useState<any>(null);
  const [weight, setWeight] = useState<any>(null);
  const [calories, setCalories] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    setWarning(null);
    console.log("[Data] --- Loading all data ---");
    
    try {
      const results = await Promise.allSettled([
        api.garmin(),
        api.weight(),
        api.calories(),
        api.recommendation()
      ]);
      console.log("[Data] All settled:", results);

      const [garminResult, weightResult, caloriesResult, recResult] = results;

      if (garminResult.status === 'fulfilled') {
        if (Object.keys(garminResult.value).length === 0) {
          setWarning("Garmin data is currently unavailable. Some metrics will be missing.");
        }
        setGarmin({
          latest: garminResult.value,
          last7hrv: [],
          last7rhr: [],
          last7sleep: [],
          last7runs: []
        });
      } else {
        console.error("[Data] Garmin fetch failed:", garminResult.reason);
        setWarning("Failed to load Garmin data. Recovery metrics will be limited.");
      }

      if (weightResult.status === 'fulfilled') {
        setWeight(weightResult.value);
      } else {
        console.error("[Data] Weight fetch failed:", weightResult.reason);
      }

      if (caloriesResult.status === 'fulfilled') {
        setCalories(caloriesResult.value);
      } else {
        console.error("[Data] Calories fetch failed:", caloriesResult.reason);
      }

      if (recResult.status === 'fulfilled' && recResult.value?.result) {
        setAiInsight(recResult.value.result);
      } else {
        console.error("[Data] Recommendation fetch failed");
        setAiInsight({
          training_plan: "Unable to generate recommendations without complete data.",
          nutrition_plan: "Sync your data to receive personalized nutrition guidance.",
          hydration_target_l: 3.5,
          today_focus: "Sync your health data to get personalized insights",
          motivation: "Every data point brings you closer to optimal performance."
        });
      }

      if (results.some(res => res.status === 'rejected')) {
        setError("Some data failed to load. The displayed information may be incomplete.");
      }

    } catch (err: any) {
      console.error("[Data] Unexpected error in loadData:", err);
      setError(err.message || "An unexpected error occurred while loading data.");
    } finally {
      setLoading(false);
      console.log("[Data] --- Finished loading data ---");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function syncNow(kind = "all") {
    try {
      setSyncing(true);
      setError(null);
      setWarning(null);
      console.log(`[Sync] --- Syncing ${kind} ---`);

      if (kind === "all") {
        await Promise.all([api.syncGarmin(), api.syncNutrition()]);
      } else if (kind === "garmin") {
        await api.syncGarmin();
      } else {
        await api.syncNutrition();
      }

      await loadData();

    } catch (err: any) {
      console.error(`[Sync] Sync failed for ${kind}:`, err);
      setError(err.message || `Sync failed for ${kind}`);
    } finally {
      setSyncing(false);
      console.log(`[Sync] --- Finished syncing ${kind} ---`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mb-3"></div>
          <p className="text-gray-600">Loading health data...</p>
        </div>
      </div>
    );
  }

  const latest = garmin?.latest;
  const runs = garmin?.last7runs?.map((x: any) => ({ value: x.distance_km })) ?? [];
  const hrvTrend = garmin?.last7hrv?.map((x: any) => ({ value: x })) ?? [];
  const rhrTrend = garmin?.last7rhr?.map((x: any) => ({ value: x })) ?? [];
  const sleepTrend = garmin?.last7sleep?.map((x: any) => ({ value: x })) ?? [];
  const calorieTrend = calories?.last7?.map((x: any) => ({ value: x })) ?? [];

  const hrv = latest?.hrv ?? null;
  const rhr = latest?.restingHeartRate ?? null;
  const sleepHours = latest?.sleepingSeconds ? (latest.sleepingSeconds / 3600) : null;
  const distance7days = runs.reduce((sum: number, r: any) => sum + (r.value || 0), 0);

  const recoveryScore = calculateRecoveryScore(hrv, rhr, sleepHours);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Dashboard</h1>
            <p className="text-gray-500 mt-1">Marathon Training Metrics</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => syncNow("garmin")}
              disabled={syncing}
              className="px-3 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 disabled:opacity-50 transition"
            >
              Sync Garmin
            </button>
            <button
              onClick={() => syncNow("nutrition")}
              disabled={syncing}
              className="px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50 transition"
            >
              Sync Nutrition
            </button>
            <button
              onClick={() => syncNow("all")}
              disabled={syncing}
              className="px-3 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 transition flex items-center gap-2"
            >
              {syncing && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>}
              Refresh All
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Warning Display */}
        {warning && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-900">Warning</p>
              <p className="text-sm text-yellow-700">{warning}</p>
            </div>
          </div>
        )}

        {/* Recovery Score Hero */}
        <div className={`p-6 rounded-xl border-2 ${getRecoveryBg(recoveryScore)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Recovery Score</p>
              <p className={`text-5xl font-bold ${getRecoveryColor(recoveryScore)}`}>
                {recoveryScore || '--'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {recoveryScore >= 70 ? 'Ready for intensity' : recoveryScore >= 50 ? 'Moderate training OK' : recoveryScore > 0 ? 'Recovery day needed' : 'Insufficient data'}
              </p>
            </div>
            <Zap className={`w-20 h-20 ${getRecoveryColor(recoveryScore)} opacity-20`} />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(getMetricStatus('rhr', rhr))}`}>
                {getStatusLabel('rhr', rhr)}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{rhr ?? '--'}</p>
            <p className="text-xs text-gray-500">Resting HR (bpm)</p>
            <div className="mt-2">
              <Sparkline data={rhrTrend} color="#ef4444" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(getMetricStatus('hrv', hrv))}`}>
                {getStatusLabel('hrv', hrv)}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{hrv ?? '--'}</p>
            <p className="text-xs text-gray-500">HRV (ms)</p>
            <div className="mt-2">
              <Sparkline data={hrvTrend} color="#a855f7" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Moon className="w-5 h-5 text-indigo-500" />
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(getMetricStatus('sleep', sleepHours))}`}>
                {getStatusLabel('sleep', sleepHours)}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{sleepHours ? sleepHours.toFixed(1) : '--'}</p>
            <p className="text-xs text-gray-500">Sleep (hours)</p>
            <div className="mt-2">
              <Sparkline data={sleepTrend} color="#6366f1" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              <span className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600">
                7 days
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{distance7days ? distance7days.toFixed(1) : '--'}</p>
            <p className="text-xs text-gray-500">Distance (km)</p>
            <div className="mt-2">
              <Sparkline data={runs} color="#14b8a6" />
            </div>
          </div>
        </div>

        {/* Today's Focus - Prominent Callout */}
        {aiInsight?.today_focus && (
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-xl text-white">
            <div className="flex items-start gap-3">
              <Target className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">Today's Focus</p>
                <p className="text-xl font-semibold leading-tight">{aiInsight.today_focus}</p>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Training Plan */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-teal-600" />
              <h3 className="font-semibold text-gray-900">Training Plan</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {aiInsight?.training_plan || 'No training plan available. Sync your data to receive personalized guidance.'}
            </p>
          </div>

          {/* Nutrition Plan */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Utensils className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Nutrition Plan</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {aiInsight?.nutrition_plan || 'No nutrition plan available. Sync your data to receive personalized guidance.'}
            </p>
          </div>

          {/* Hydration Target */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Hydration Target</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-blue-600">
                {aiInsight?.hydration_target_l ?? '3.5'}
              </p>
              <p className="text-gray-500">liters</p>
            </div>
            <p className="text-sm text-gray-600 mt-2">UAE climate adjusted (+0.5L for heat/humidity)</p>
          </div>

          {/* Motivation */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg text-white">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold">Motivation</h3>
            </div>
            <p className="text-lg italic leading-relaxed">
              {aiInsight?.motivation || 'Every step forward is progress. Stay consistent.'}
            </p>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Additional Metrics</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Weight</p>
              <p className="text-2xl font-semibold text-gray-900">{weight?.value ?? '--'} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Body Fat</p>
              <p className="text-2xl font-semibold text-gray-900">{weight?.bodyfat ?? '--'}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Calories (Today)</p>
              <p className="text-2xl font-semibold text-gray-900">{calories?.today ?? '--'}</p>
              <div className="mt-2">
                <Sparkline data={calorieTrend} color="#f59e0b" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}