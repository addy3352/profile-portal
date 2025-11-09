import React from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Mail, Linkedin, FileDown } from 'lucide-react'

const COLORS = ['#0F766E','#70BDC9','#B08747','#94A3B8','#64748B','#334155']

const roles = [
  { name: 'Agentic AI Architecture & LLM Ops', value: 25 },
  { name: 'Data Governance & Policy', value: 25 },
  { name: 'Cloud Data & Solution Architecture', value: 30 },
  { name: 'Cloud Infrastructure Leadership', value: 20 }
]

const projects = [
  { icon: '🧠', title: 'OSIRIS — Agentic AI Platform', stack: ['Azure','Databricks','AI Foundry','Semantic Kernel','MCP Server Mesh'], blurb: 'Multi-agent orchestration, observability, and self-healing pipelines.' },
  { icon: '👥', title: 'Customer 360', stack: ['Azure','SPARK','Hadoop'], blurb: 'Unified customer model across PNR, CRM, Loyalty with governed access.' },
  { icon: '🏢', title: 'Enterprise Data Warehouse', stack: ['Databricks','Unity Catalog','Bigquery','Synapse'], blurb: 'Lakehouse modernization replacing legacy CBI 1.0/2.0.' },
  { icon: '📡', title: 'IoT Data Platform (GCP)', stack: ['GCP','BigQuery','Terraform','Ansible'], blurb: 'Real-time telemetry ingestion & analytics for devices & aircraft.' },
  { icon: '🔒', title: 'Governace  & Compliance ', stack: ['Collibra','Purview'], blurb: 'Policy-driven access, masking, lineage, and audit.' },
  { icon: '🚗', title: 'Automotive Data Monetization Platform (Smart Car)', stack: ['GCP Bigquery', 'Vertex', 'Terraform', 'Ansible'], blurb: 'High-velocity telemetry ingestion via Pub/Sub, real-time stream processing, and governed data product monetization (e.g., insurance, traffic).' }

]

const metrics = [
  { label: 'Value Delivered', value: '$50M+' },
  { label: 'AI Agents in Prod', value: '30+' },
  { label: 'Data Products Governed', value: '100+' },
  { label: 'Cross-Functional Pods Led', value: '20+' },
  { label: 'Cloud Footprint (PB)', value: '2.5' },
]

// NEW DATA ARRAY for Bar Chart (using your revised architectural weights)
const expertiseData = [
  { name: 'Agentic AI', value: 25, tech: 'LLM Ops · MLflow · Semantic Kernel/Langchain' },
  { name: 'Data & Solution Design', value: 30, tech: 'Databricks · Synapse · BigQuery' },
  { name: 'Cloud Infra Leadership', value: 20, tech: 'Infra as Code · Observablity ·  · FinOPs' },
  { name: 'Data Governance & Policy', value: 25, tech: 'Collibra · Unity Catalog · Purview' },
];

// NEW CUSTOM TOOLTIP component for the Bar Chart
const CustomExpertiseTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border shadow-md">
        <p className="font-bold text-sm">{`${label} (${data.value}%)`}</p>
        <p className="text-xs text-slate-600 mt-1">Tech Stack: {data.tech}</p>
      </div>
    );
  }
  return null;
};

const WorkDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="rounded-2xl bg-gradient-to-r from-brand-primary/10 via-brand-primary/5 to-brand-gold/10 p-6">
        <h1 className="text-3xl font-bold">Aditya Raman</h1>
        <p className="text-slate-700 mt-1">Agentic AI & Data Architecture Leader — 18 Years | Azure · GCP · OCI · Databricks</p>
        <div className="flex gap-3 mt-3 text-sm">
          <a className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white border" href="mailto:aditya.raman@gmail.com"><Mail className="h-4 w-4"/>Email</a>
          <a className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white border" href="https://www.linkedin.com/in/aditya-raman-b204709" target="_blank"><Linkedin className="h-4 w-4"/>LinkedIn</a>
          <button onClick={()=>window.print()} className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white border"><FileDown className="h-4 w-4"/>Download CV</button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-sm p-4 lg:col-span-2">
          <h2 className="font-semibold mb-2">Experience Composition</h2>
          <div className="h-64 !filter-none !grayscale-0 !text-opacity-100" >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roles} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {roles.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-sm p-4">
          <h2 className="font-semibold mb-2">Impact Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m,i)=>(
              <div key={i} className="rounded-xl border p-3">
                <div className="text-xs text-slate-500">{m.label}</div>
                <div className="text-xl font-semibold">{m.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-sm p-4">
        <h2 className="font-semibold mb-2">Key Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p,i)=>(
            <div key={i} className="rounded-xl border p-4 hover:shadow-md transition">
              <div className="text-2xl">{p.icon}</div>
              <div className="font-semibold mt-2">{p.title}</div>
              <div className="text-sm text-slate-600">{p.blurb}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.stack.map((s,j)=>(<span key={j} className="text-xs px-2 py-1 rounded-full bg-slate-100">{s}</span>))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white rounded-2xl shadow-sm p-4">
        <h2 className="font-semibold mb-2">Core Expertise (Relative)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expertiseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
        	<linearGradient id="skillGradient" x1="0" y1="0" x2="0" y2="1">
          	  <stop offset="0%" stopColor="#0F766E" />      {/* Deep Teal */}
                 <stop offset="100%" stopColor="#B08747" />   {/* Executive Gold */}
               </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
              	dataKey="name"
              	interval={0} 
                angle={-15} 
                textAnchor="end" 
                height={50} 
                style={{ fontSize: '12px' }}
              />
              <YAxis />
              {/* Using the Custom Tooltip to show underlying technologies */}
              <Tooltip content={<CustomExpertiseTooltip />} />
              {/* Used a consistent fill color for a professional look */}
              <Bar dataKey="value" fill="#007ACC" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Revised list of technologies for quick scanning */}
        <div className="flex flex-wrap gap-2 mt-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-slate-100">Databricks</span>
          <span className="px-2 py-1 rounded-full bg-slate-100">Azure </span>
          <span className="px-2 py-1 rounded-full bg-slate-100">GCP</span>
          <span className="px-2 py-1 rounded-full bg-slate-100">Docker/Kubernetes</span>
          <span className="px-2 py-1 rounded-full bg-slate-100">Terraform</span>
          <span className="px-2 py-1 rounded-full bg-slate-100">Ansible</span>
          <span className="px-2 py-1 rounded-full bg-slate-100">AI Foundry/Vertex</span>
          <span className="px-2 py-1 rounded-full bg-slate-100">Spark</span>
          <span className="px-2 py-1 rounded-full bg-slate-100">MLflow</span>
        </div>
      </motion.div>
    </div>
  )
}

export default WorkDashboard
