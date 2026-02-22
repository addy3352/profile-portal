import React, { useState, useEffect } from 'react';
import {
  Server, Shield, ToyBrick, Cloud, Database, Cpu, GitBranch, Globe,
  ArrowDown, ChevronDown, Network, Building, Bot, Mail, Phone, Linkedin, Sun,
  HeartPulse, Salad, Briefcase, MessageSquare, CloudSun, CheckCircle, XCircle, CircleDot,
  Container, Wind, Lock, Search, Globe2
} from 'lucide-react';

const ArchitectureEnhanced = () => {
  const [isServersExpanded, setServersExpanded] = useState(false);
  const [isDataExpanded, setDataExpanded] = useState(false);

  useEffect(() => {
    document.title = 'MCP Mesh Architecture - Enhanced';
    const kpiTargets = { latency: 150, hits: 4500, denials: 12, size: 1.5, tools: 8 };
    const animateValue = (obj, start, end, duration) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = obj.dataset.kpi === 'size' ? (start + progress * (end - start)).toFixed(1) : Math.floor(start + progress * (end - start));
        obj.innerHTML = value;
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };
    document.querySelectorAll('#kpi-container [data-kpi]').forEach((el) => animateValue(el, 0, kpiTargets[el.dataset.kpi], 1500));
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-indigo-700 flex items-center gap-3">
            <GitBranch className="w-7 h-7" />
            <span>MCP Mesh Architecture</span>
          </h1>
          <div className="hidden sm:flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Discoverable</div>
            <div className="flex items-center gap-1"><Container className="w-4 h-4 text-blue-500" /> Portable</div>
            <div className="flex items-center gap-1"><Shield className="w-4 h-4 text-purple-500" /> Unified</div>
          </div>
        </div>
      </header>

      <main className="max-w-8xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
        {/* KPIs */}
        <section>
          <div id="kpi-container" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
            {[{id: 'latency', label: 'Latency (ms)', icon: <HeartPulse/>}, {id: 'hits', label: 'Hits', icon: <CircleDot/>}, {id: 'denials', label: 'Denials', icon: <XCircle/>}, {id: 'size', label: 'Size (MB)', icon: <Database/>}, {id: 'tools', label: 'Tools', icon: <ToyBrick/>}].map((kpi) => (
              <div key={kpi.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className={`text-4xl font-bold ${kpi.id === 'denials' ? 'text-red-500' : 'text-indigo-600'}`} data-kpi={kpi.id}>0</div>
                <div className="text-xs text-slate-500 capitalize mt-1 flex items-center justify-center gap-1.5">
                  {React.cloneElement(kpi.icon, { className: "w-3.5 h-3.5" })}
                  <span>{kpi.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Infrastructure Architecture */}
        <section className="space-y-8 group/infra">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Infrastructure & Data Flow</h2>
            <p className="text-md text-slate-600 max-w-4xl mx-auto">
              The <strong>MCP Mesh</strong> orchestrates secure communication between your <strong>Profile Portal</strong>, <strong>AI Agents</strong>, and <strong>External APIs</strong> through a centralized, policy-driven gateway.
            </p>
          </div>

          {/* Top Layer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {/* Profile Portal */}
            <div className="group/portal transition-all duration-300 infra-card">
              <div className="card-header bg-blue-600">
                <Globe className="w-5 h-5" />
                <span>DigitalOcean App Platform</span>
              </div>
              <div className="p-6 bg-white border-2 border-blue-600 rounded-b-lg">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <h4 className="text-lg font-bold text-blue-800">Profile Portal</h4>
                  </div>
                  <div className="text-center text-xs text-slate-600 mb-3">
                    <code className="bg-blue-100 text-blue-800 px-2 py-1 rounded">profile.aditya-raman.com</code>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="bg-white p-2 rounded border border-blue-200">React Frontend</div>
                    <div className="bg-white p-2 rounded border border-blue-200">User Dashboard</div>
                    <div className="bg-white p-2 rounded border border-blue-200">Health Metrics</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Agents */}
            <div className="group/agents transition-all duration-300 infra-card">
              <div className="card-header bg-purple-600">
                <Bot className="w-5 h-5" />
                <span>External AI Agents</span>
              </div>
              <div className="p-6 bg-white border-2 border-purple-600 rounded-b-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 text-center">
                    <Bot className="w-8 h-8 mx-auto mb-2 text-purple-700" />
                    <div className="text-sm font-bold text-purple-800">ChatGPT</div>
                    <div className="text-xs text-slate-500">OpenAI</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 text-center">
                    <Cpu className="w-8 h-8 mx-auto mb-2 text-purple-700" />
                    <div className="text-sm font-bold text-purple-800">Claude</div>
                    <div className="text-xs text-slate-500">Anthropic</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Arrow */}
          <div className="flex justify-center">
            <ArrowDown className="w-8 h-8 text-slate-400 group-hover/infra:text-indigo-500 transition-colors" />
          </div>

          {/* MCP Mesh Droplet */}
          <div className="max-w-5xl mx-auto infra-card group/mesh transition-all duration-300">
            <div className="card-header bg-cyan-700">
              <Server className="w-5 h-5" />
              <span>DigitalOcean Droplet (Ubuntu 22.04)</span>
            </div>
            <div className="bg-white border-4 border-cyan-700 rounded-b-lg shadow-lg p-6 space-y-6">
              <h3 className="text-2xl font-bold text-cyan-800 text-center">
                MCP MESH (Governed Gateway)
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Central Gateway */}
                <div className="sub-card border-indigo-300">
                  <div className="sub-card-header text-indigo-800">
                    <Shield className="w-6 h-6" /> Central Gateway
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="list-item">Policy Validation</div>
                    <div className="list-item">Audit Logging</div>
                    <div className="list-item">Rate Limiting</div>
                  </div>
                </div>

                {/* Tool Registry */}
                <div className="sub-card border-purple-300">
                  <div className="sub-card-header text-purple-800">
                    <ToyBrick className="w-6 h-6" /> Tool Registry
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="list-item">Service Discovery</div>
                    <div className="list-item">Schema Registry</div>
                    <div className="list-item">Health Checks</div>
                  </div>
                </div>

                {/* MCP Servers */}
                <div className="sub-card border-teal-300">
                  <div
                    className="sub-card-header text-teal-800 cursor-pointer"
                    onClick={() => setServersExpanded(!isServersExpanded)}
                  >
                    <Cpu className="w-6 h-6" /> MCP Servers
                    <ChevronDown className={`w-5 h-5 ml-auto transform transition-transform ${isServersExpanded ? 'rotate-180' : ''}`} />
                  </div>
                  {isServersExpanded && (
                    <div className="p-4 space-y-2">
                      <div className="list-item justify-between"><span><HeartPulse className="w-4 h-4 text-red-500 inline-block mr-2"/>mcp-garmin</span> <span className="text-green-600 font-bold">●</span></div>
                      <div className="list-item justify-between"><span><Salad className="w-4 h-4 text-green-500 inline-block mr-2"/>mcp-nutrition</span> <span className="text-green-600 font-bold">●</span></div>
                      <div className="list-item justify-between"><span><Briefcase className="w-4 h-4 text-blue-500 inline-block mr-2"/>mcp-linkedin</span> <span className="text-green-600 font-bold">●</span></div>
                      <div className="list-item justify-between"><span><MessageSquare className="w-4 h-4 text-orange-500 inline-block mr-2"/>mcp-twilio</span> <span className="text-green-600 font-bold">●</span></div>
                      <div className="list-item justify-between"><span><CloudSun className="w-4 h-4 text-yellow-500 inline-block mr-2"/>mcp-weather</span> <span className="text-green-600 font-bold">●</span></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Data Layer */}
              <div className="sub-card border-amber-300">
                <div
                  className="sub-card-header text-amber-800 cursor-pointer"
                  onClick={() => setDataExpanded(!isDataExpanded)}
                >
                  <Database className="w-6 h-6" /> Data Storage Layer
                  <ChevronDown className={`w-5 h-5 ml-auto transform transition-transform ${isDataExpanded ? 'rotate-180' : ''}`} />
                </div>
                {isDataExpanded && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white border border-amber-400 p-3 rounded-lg">
                      <div className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                        <Database className="w-4 h-4" /> mesh.db (SQLite)
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="bg-amber-50 p-1.5 rounded">Garmin Activities</div>
                        <div className="bg-amber-50 p-1.5 rounded">Health Metrics</div>
                        <div className="bg-amber-50 p-1.5 rounded">Sync History</div>
                      </div>
                    </div>
                    <div className="bg-white border border-indigo-400 p-3 rounded-lg">
                      <div className="font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                        <Network className="w-4 h-4" /> Mesh Data API
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="bg-indigo-50 p-1.5 rounded">REST Endpoints</div>
                        <div className="bg-indigo-50 p-1.5 rounded">Read-Only Access</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Orchestration Layer */}
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                <div className="text-sm font-semibold text-slate-700 mb-2 text-center">Container Orchestration</div>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="bg-white p-2 rounded border border-slate-300 flex items-center justify-center gap-1.5"><Container className="w-4 h-4"/>Docker</div>
                  <div className="bg-white p-2 rounded border border-slate-300 flex items-center justify-center gap-1.5"><Wind className="w-4 h-4"/>Nginx</div>
                  <div className="bg-white p-2 rounded border border-slate-300 flex items-center justify-center gap-1.5"><Lock className="w-4 h-4"/>Let's Encrypt</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Connection Arrow */}
          <div className="flex justify-center">
            <ArrowDown className="w-8 h-8 text-slate-400 group-hover/infra:text-indigo-500 transition-colors" />
          </div>

          {/* External APIs */}
          <div className="max-w-5xl mx-auto infra-card group/external transition-all duration-300">
            <div className="card-header bg-slate-700">
              <Building className="w-5 h-5" />
              <span>External Data Sources</span>
            </div>
            <div className="bg-white border-4 border-slate-700 rounded-b-lg shadow-lg p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Garmin */}
                <div className="api-card border-red-300">
                  <HeartPulse className="w-6 h-6 mx-auto mb-2 text-red-600" />
                  <h4 className="api-card-title text-red-800">Garmin API</h4>
                </div>
                {/* Twilio */}
                <div className="api-card border-orange-300">
                  <Phone className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <h4 className="api-card-title text-orange-800">Twilio API</h4>
                </div>
                {/* LinkedIn */}
                <div className="api-card border-blue-400">
                  <Linkedin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <h4 className="api-card-title text-blue-800">LinkedIn API</h4>
                </div>
                {/* Weather */}
                <div className="api-card border-sky-300">
                  <Sun className="w-6 h-6 mx-auto mb-2 text-sky-600" />
                  <h4 className="api-card-title text-sky-800">Weather.com</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Advantages */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Platform Advantages of MCP Mesh</h2>
            <p className="text-md text-slate-600 max-w-4xl mx-auto">
              The MCP Mesh modernizes integration across agents and portals, improving discoverability, consistency, and operational trust. Its platform-first design ensures extensibility and resilience across environments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Unified Discoverability */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg text-slate-800">Unified Discoverability</h4>
              </div>
              <p className="text-sm text-slate-600">
                All tools are automatically registered and discoverable via <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/mesh/tools</code>. Agents dynamically retrieve capabilities, ensuring adaptive and self-aware interoperability.
              </p>
            </div>
            {/* Single Governed Gateway */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg text-slate-800">Single Governed Gateway</h4>
              </div>
              <p className="text-sm text-slate-600">
                All requests route through <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">mesh.aditya-raman.com</code>, providing a unified governance layer that ensures observability, policy enforcement, and secure data exchange.
              </p>
            </div>
            {/* Containerized Portability */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                  <Container className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg text-slate-800">Containerized Portability</h4>
              </div>
              <p className="text-sm text-slate-600">
                Every microservice and the gateway run as containerized units — deployable across DigitalOcean, Azure, or Kubernetes — ensuring flexibility, scalability, and high availability.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center text-slate-500 text-sm py-6 border-t border-slate-200 mt-12">
        © 2025 MCP Mesh Orchestrator
      </footer>
    </div>
  );
};

export default ArchitectureEnhanced;
