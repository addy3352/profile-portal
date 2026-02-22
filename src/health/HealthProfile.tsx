import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Activity, Heart, Moon, TrendingUp, Droplets, Utensils, Target, Zap, AlertCircle, BookOpen, ArrowRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ReferenceLine, PieChart, Pie } from "recharts";

// --- Mesh API Helpers ---
const fetchWithLogs = async (url: string, options: RequestInit = {}) => {
//  const finalOptions = { ...options, cache: "no-store" as const };
  const token = localStorage.getItem("hp_token");
  const finalOptions = {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { "x-api-key": token } : {})
    },
    cache: "no-store" as const
  };
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
  caloriesTrend: () => fetchWithLogs(`/mcp/call/calories/trend`),
  activitiesTrend: () => fetchWithLogs(`/mcp/call/activities/trend`),
  recommendation: () => fetchWithLogs(`/mcp/call/ai/recommendation`, { method: "POST" }),
  syncGarmin: () => fetchWithLogs(`/mcp/call/sync/garmin`, { method: "POST" }),
  syncNutrition: () => fetchWithLogs(`/mcp/call/sync/nutrition`, { method: "POST" }),
  medical: () => fetchWithLogs(`/mcp/call/medical/latest`)
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
const getReadiness = (hrv: number | null, rhr: number | null, sleep: number | null) => {
  if (hrv === null || rhr === null || sleep === null) {
    return { title: 'Sync Required', color: 'text-gray-400', bg: 'bg-gray-50 border-gray-200', msg: 'Sync data to see readiness' };
  }

  let stress = 0;
  if (hrv < 40) stress++;
  if (rhr > 70) stress++;
  if (sleep < 6) stress++;

  if (stress === 0) {
    return { title: 'Prime Condition', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', msg: 'Ready for high intensity training' };
  } else if (stress === 1) {
    return { title: 'Good State', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-200', msg: 'Balanced state for normal training' };
  } else if (stress === 2) {
    return { title: 'Fatigued', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200', msg: 'Consider active recovery or light training' };
  } else {
    return { title: 'Rest Needed', color: 'text-red-600', bg: 'bg-red-50 border-red-200', msg: 'Focus on sleep and recovery today' };
  }
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg text-sm z-50">
        <p className="font-semibold text-gray-900 mb-1">{data.name}</p>
        <div className="space-y-1">
          <p className="text-gray-600">
            <span className="font-medium text-gray-900">{Math.round(data.displayVal)}</span>
            <span className="text-gray-400 mx-1">/</span>
            {Math.round(data.displayMax)} {data.unit}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

// --- Blog Helper ---
const parseFrontmatter = (text: string) => {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { metadata: {}, content: text };
  
  const metadataLines = match[1].split('\n');
  const metadata: Record<string, string> = {};
  
  metadataLines.forEach(line => {
    const [key, ...value] = line.split(':');
    if (key && value) metadata[key.trim()] = value.join(':').trim();
  });
  
  return { metadata, content: match[2] };
};

export default function HealthProfile() {
  const [garmin, setGarmin] = useState<any>(null);
  const [weight, setWeight] = useState<any>(null);
  const [calories, setCalories] = useState<any>(null);
  const [caloriesTrend, setCaloriesTrend] = useState<any[]>([]);
  const [activitiesTrend, setActivitiesTrend] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [medical, setMedical] = useState<any>(null);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hp_token");
    const envPass = import.meta.env.VITE_HEALTH_PASS;
    if (!token || !envPass || token !== envPass.trim()) {
      navigate("/login");
    }
  }, [navigate]);

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
        api.recommendation(),
        api.medical(),
        api.caloriesTrend(),
        api.activitiesTrend()
      ]);
      console.log("[Data] All settled:", results);

      const [garminResult, weightResult, caloriesResult, recResult, medicalResult, caloriesTrendResult, activitiesTrendResult] = results;

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
        const isServerIssue = garminResult.reason?.message?.includes('504') || garminResult.reason?.message?.includes('502');
        setWarning(isServerIssue 
          ? "Garmin data unavailable (Server Error). Please try refreshing later." 
          : "Failed to load Garmin data. Recovery metrics will be limited.");
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

      if (medicalResult.status === 'fulfilled') {
        setMedical(medicalResult.value);
      } else {
        console.error("[Data] Medical fetch failed:", medicalResult.reason);
      }

      if (caloriesTrendResult.status === 'fulfilled') {
        const val = caloriesTrendResult.value;
        const data = val?.result?.data || val?.data || (Array.isArray(val) ? val : []);
        setCaloriesTrend(Array.isArray(data) ? data : []);
      } else {
        console.error("[Data] Calories trend fetch failed:", caloriesTrendResult.reason);
      }

      if (activitiesTrendResult.status === 'fulfilled') {
        const val = activitiesTrendResult.value;
        const data = val?.result?.data || val?.data || (Array.isArray(val) ? val : []);
        setActivitiesTrend(Array.isArray(data) ? data : []);
      } else {
        console.error("[Data] Activities trend fetch failed:", activitiesTrendResult.reason);
      }

      if (results.some(res => res.status === 'rejected')) {
        const hasServerIssue = results.some(
          res => res.status === 'rejected' && (res.reason?.message?.includes('504') || res.reason?.message?.includes('502'))
        );
        setError(hasServerIssue 
          ? "Server unreachable (502/504). The backend service appears to be down." 
          : "Some data failed to load. The displayed information may be incomplete.");
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

  // Load Blog Data
  useEffect(() => {
    const modules = import.meta.glob('/src/content/posts/*.md', { query: '?raw', import: 'default', eager: true });
    const posts = Object.entries(modules).map(([path, content]) => {
      const { metadata } = parseFrontmatter(content as string);
      return {
        slug: path.split('/').pop()?.replace('.md', '') || '',
        title: metadata.title || 'Untitled',
        date: metadata.date || '',
        description: metadata.description || ''
      };
    });
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentPosts(posts.slice(0, 2));
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

  const hrv = latest?.hrv ?? null;
  const distance = latest?.distance ?? null;
  const rhr = latest?.restingHeartRate ?? null;
  const sleepHours = latest?.measurableAsleepDuration ? (latest.measurableAsleepDuration / 3600) : null;
  const distance7days = runs.reduce((sum: number, r: any) => sum + (r.value || 0), 0);

  const readiness = getReadiness(hrv, rhr, sleepHours);

  const targetCalories = 2000;

  const createMacroData = (name: string, current: number, target: number, unit: string, fill: string, isKcal = false) => {
    const valInKcal = isKcal ? current : (name === 'Fat' ? current * 9 : current * 4);
    const targetInKcal = isKcal ? target : (name === 'Fat' ? target * 9 : target * 4);
    
    return {
      name,
      displayVal: current,
      displayMax: target,
      unit,
      fill,
      filled: Math.min(valInKcal, targetInKcal),
      remaining: Math.max(0, targetInKcal - valInKcal),
      excess: Math.max(0, valInKcal - targetInKcal)
    };
  };

  const macroData = [
    createMacroData('Calories', calories?.calories || 0, targetCalories, 'kcal', '#10b981', true),
    createMacroData('Carbs', calories?.carbs || 0, (targetCalories * 0.45) / 4, 'g', '#3b82f6'),
    createMacroData('Protein', calories?.protein || 0, (targetCalories * 0.35) / 4, 'g', '#a855f7'),
    createMacroData('Fat', calories?.fat || 0, (targetCalories * 0.20) / 9, 'g', '#eab308'),
  ];

  const activityStats = (Array.isArray(activitiesTrend) ? activitiesTrend : []).reduce((acc: any, curr: any) => {
    if (!curr) return acc;
    const type = curr.activity_type || 'Other';
    if (!acc[type]) {
      acc[type] = { name: type, duration: 0, calories: 0 };
    }
    const dur = Number(curr.duration);
    const cal = Number(curr.calories);
    if (!isNaN(dur)) acc[type].duration += dur * 60;
    if (!isNaN(cal)) acc[type].calories += cal;
    return acc;
  }, {});
  const activityPieData = Object.values(activityStats);
  const totalDurationSeconds = activityPieData.reduce((sum: number, item: any) => sum + item.duration, 0);
  const totalCalories = activityPieData.reduce((sum: number, item: any) => sum + item.calories, 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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

        {/* Readiness Hero */}
        <div className={`p-6 rounded-xl border-2 ${readiness.bg}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Training Readiness</p>
              <p className={`text-4xl font-bold ${readiness.color}`}>
                {readiness.title}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {readiness.msg}
              </p>
            </div>
            <Zap className={`w-20 h-20 ${readiness.color} opacity-20`} />
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
            <p className="text-2xl font-bold text-gray-900">{distance ?? '--'}</p>
            <p className="text-xs text-gray-500">Distance (km)</p>
            <div className="mt-2">
              <Sparkline data={runs} color="#14b8a6" />
            </div>
          </div>
        </div>

        {/* Activity Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-6">Activity Distribution (7 Days)</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <div className="text-center mb-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Duration</h4>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {Math.floor(totalDurationSeconds / 3600)}h {Math.round((totalDurationSeconds % 3600) / 60)}m
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Avg {Math.round(totalDurationSeconds / 7 / 60)}m / day
                </p>
              </div>
              <div className="h-64 w-full">
                {activityPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="duration"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {activityPieData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${Math.floor(value / 60)}m`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">No activity data</div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-center mb-4">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Calories</h4>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {totalCalories} <span className="text-lg font-normal text-gray-500">kcal</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Avg {Math.round(totalCalories / 7)} kcal / day
                </p>
              </div>
              <div className="h-64 w-full">
                {activityPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="calories"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {activityPieData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">No activity data</div>
                )}
              </div>
            </div>
          </div>
        </div>

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
        </div>

        {/* Secondary Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 h-full">
          <h3 className="font-semibold text-gray-900 mb-4">Nutrition & Body Composition</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Weight</p>
              <p className="text-2xl font-semibold text-gray-900">{weight?.value ?? '--'} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Body Fat</p>
              <p className="text-2xl font-semibold text-gray-900">{weight?.bodyfat ?? '--'}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Lean Mass</p>
              <p className="text-2xl font-semibold text-gray-900">
                {weight?.value && weight?.bodyfat
                  ? (weight.value * (1 - weight.bodyfat / 100)).toFixed(1)
                  : '--'} <span className="text-lg text-gray-500">kg</span>
              </p>
            </div>
          </div>

          <div className="mt-8 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={macroData}
                margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
                barSize={24}
              >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                <Bar dataKey="filled" stackId="a" radius={[4, 0, 0, 4]}>
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                <Bar dataKey="remaining" stackId="a" radius={[0, 4, 4, 0]}>
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-rem-${index}`} fill={entry.fill} fillOpacity={0.2} />
                  ))}
                </Bar>
                <Bar dataKey="excess" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calorie Trend Chart */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 h-full">
          <h3 className="font-semibold text-gray-900 mb-4">Calorie Consumption Trend (7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={caloriesTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{fontSize: 12}} 
                  tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <ReferenceLine y={2000} label="Target (2000)" stroke="#ef4444" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={2} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        </div>

        {/* Medical Metrics */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-gray-900">Medical Stats</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Cholesterol</p>
              <p className="text-2xl font-semibold text-gray-900">{medical?.cholesterol ?? '--'} <span className="text-lg text-gray-500">mg/dL</span></p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">LDL Cholesterol</p>
              <p className="text-2xl font-semibold text-gray-900">{medical?.ldl ?? '--'} <span className="text-lg text-gray-500">mg/dL</span></p>
            </div>
          </div>
        </div>

        {/* Latest Articles */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Latest Articles</h3>
            </div>
            <Link to="/blog" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {recentPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="block group">
                <div className="p-4 rounded-lg bg-gray-50 border border-gray-100 group-hover:border-blue-200 group-hover:bg-blue-50 transition">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-700 mb-1">{post.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{post.description}</p>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
              </Link>
            ))}
            {recentPosts.length === 0 && <p className="text-gray-500 text-sm">No articles found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}