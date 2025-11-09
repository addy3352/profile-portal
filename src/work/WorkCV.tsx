import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Mail, Linkedin } from 'lucide-react'

const COLORS = ['#0F766E','#70BDC9','#B08747','#94A3B8','#64748B','#334155']

const roles = [
  { name: 'Agentic AI Architecture & LLM Ops', value: 25 },
  { name: 'Data Governance Strategy & Policy', value: 25 },
  { name: 'Cloud Data & Solution  Architecture', value: 30 },
  { name: 'Cloud Platform Starategy & Leadership', value: 20 }
]

const projects = [
  { icon: '🧠', title: 'OSIRIS — Agentic AI Platform', blurb: 'Multi-agent orchestration & self-healing pipelines on Azure & Databricks.' },
  { icon: '👥', title: 'Customer 360 Platform', blurb: 'Unified customer model integrating PNR, CRM & Loyalty.' },
  { icon: '🏢', title: 'Enterprise Data Warehouse', blurb: 'Modernized CBI into Lakehouse (Delta + Unity Catalog).' },
  { icon: '📡', title: 'IoT Data Platform (GCP)', blurb: 'Real-time telemetry in Pub/Sub + BigQuery.' },
  { icon: '🚗', title: 'Automotive Data Monetization Platform (Smart Car)',  blurb: 'High-velocity telemetry ingestion via Pub/Sub, real-time stream processing, and governed data product monetization (e.g., insurance, traffic).'}
]

const WorkCV: React.FC = () => {
  return (
    <div className="cv-page bg-white rounded-2xl shadow-sm p-8 print:p-0">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aditya Raman</h1>
          <p className="text-slate-700">Agentic AI & Data Architect • 18 Years • Azure · GCP · OCI · Databricks</p>
        </div>
        <div className="text-sm text-slate-600">
          <div className="flex items-center gap-2"><Mail className="h-4 w-4"/><a href="mailto:aditya.raman@gmail.com" className="underline">aditya.raman@gmail.com</a></div>
          <div className="flex items-center gap-2"><Linkedin className="h-4 w-4"/><a className="underline" href="https://www.linkedin.com/in/aditya-raman-b204709" target="_blank">linkedin.com/in/aditya-raman-b204709</a></div>
        </div>
      </div>

      <section className="mt-4">
        <h2 className="font-semibold">Profile</h2>
        <p className="text-sm text-slate-700">
          Architect and leader with 14+ years in data & AI. Builds Agentic AI platforms, governance frameworks, and cloud-native architectures across Azure, GCP, and OCI.
        </p>
      </section>

      <section className="mt-4 grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <h3 className="font-semibold">Experience Composition</h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={roles} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={1}>
                  {roles.map((_, i)=>(<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="text-xs text-slate-600 list-disc ml-4 mt-2">
            <li>Agentic AI · AI Foundry/Vertex · MCP</li>
            <li>Governance · Lineage · DQ · Policy</li>
            <li>Lakehouse · Delta · Unity Catalog</li>
          </ul>
        </div>
        <div className="col-span-2">
          <h3 className="font-semibold">Key Projects</h3>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {projects.map((p,i)=>(
              <div key={i} className="rounded-lg border p-3">
                <div className="text-xl">{p.icon}</div>
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-slate-600">{p.blurb}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <h3 className="font-semibold">Key Skills</h3>
          <div className="flex flex-wrap gap-2 text-xs mt-2">
            <span className="px-2 py-1 rounded-full bg-slate-100">Databricks</span>
            <span className="px-2 py-1 rounded-full bg-slate-100">Azure ADF</span>
            <span className="px-2 py-1 rounded-full bg-slate-100">APIM</span>
            <span className="px-2 py-1 rounded-full bg-slate-100">AKS/ACA</span>
            <span className="px-2 py-1 rounded-full bg-slate-100">Terraform</span>
            <span className="px-2 py-1 rounded-full bg-slate-100">Ansible</span>
            <span className="px-2 py-1 rounded-full bg-slate-100">Unity Catalog</span>
            <span className="px-2 py-1 rounded-full bg-slate-100">Spark</span>
            <span className="px-2 py-1 rounded-full bg-slate-100">MLflow</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Education & Certifications</h3>
          <ul className="text-xs text-slate-700 list-disc ml-4 mt-2">
            <li>MBA — CUHK</li>
            <li>B.Tech — CUSAT</li>
            <li>Terraform Associate</li>
            <li>SnowPro Core</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

export default WorkCV
