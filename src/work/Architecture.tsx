import React, { useState, useEffect } from 'react';

const ArchitectureEnhanced = () => {
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
    <div className="bg-slate-50 text-slate-900">
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">MCP Mesh Architecture: Enhanced</h1>
          <span className="text-slate-600">Discoverable · Portable · Unified</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-16">
        {/* KPIs */}
        <section>
          <div id="kpi-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 text-center">
            {['latency', 'hits', 'denials', 'size', 'tools'].map((kpi, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <div className={`text-4xl font-extrabold ${kpi === 'denials' ? 'text-red-600' : 'text-indigo-600'}`} data-kpi={kpi}>0</div>
                <div className="text-sm text-slate-500 capitalize">{kpi}</div>
              </div>
            ))}
          </div>
        </section>

        {/* MCP Mesh Flow */}
        <section>
          <h3 className="text-3xl font-extrabold text-center mb-6">Governed Flow with Discoverability</h3>
          <p className="text-lg text-slate-600 max-w-4xl mx-auto text-center mb-8">
            The <strong>MCP Mesh</strong> is a secure orchestration layer connecting your <strong>Profile Portal</strong>, <strong>AI Agents</strong>, and <strong>Microservices</strong> through centralized <strong>governance</strong>, <strong>zero-trust policies</strong>, and <strong>immutable audit logging</strong>.
          </p>

          {/* Inputs from Portal and AI Agents (Outside Mesh) */}
          <div className="flex flex-col items-center space-y-3 mb-6">
            <div className="flex justify-center space-x-8">
              <div className="bg-white border border-indigo-400 rounded-xl shadow p-4 text-center w-36">
                <div className="text-2xl">🌐</div>
                <div className="text-sm font-semibold mt-1">Profile Portal</div>
              </div>
              <div className="bg-white border border-slate-400 rounded-xl shadow p-4 text-center w-36">
                <div className="text-2xl">🤖</div>
                <div className="text-sm font-semibold mt-1">ChatGPT Agent</div>
              </div>
            </div>
            <div className="text-3xl text-slate-400">⬇️</div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-indigo-200">
            <h4 className="text-2xl font-extrabold text-indigo-700 mb-4 text-center border-b pb-2 border-indigo-200">
              MCP MESH (The Governed Boundary)
            </h4>

            <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
              <div className="w-full md:w-1/3 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <div className="text-center font-bold text-indigo-700">Central Gateway</div>
                <div className="mt-2 space-y-2">
                  <div className="bg-indigo-200 p-2 rounded-md text-sm">Policy Validation</div>
                  <div className="bg-indigo-200 p-2 rounded-md text-sm">Audit Logging</div>
                  <div className="bg-indigo-200 p-2 rounded-md text-sm">Event Notifications</div>
                </div>
              </div>

              <div className="w-full md:w-2/3 bg-white p-4 rounded-lg border border-slate-200">
                <h5 className="text-teal-700 font-bold mb-3 text-center">Dynamic Microservice Routing</h5>
                <div className="bg-indigo-100 text-indigo-800 p-2 rounded-md text-sm font-medium mb-3 text-center">
                  📚 Tool Registry (Dynamic Discovery)
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-teal-100 p-2 rounded text-center">❤️ mcp-garmin</div>
                  <div className="bg-teal-100 p-2 rounded text-center">🥗 mcp-nutrition</div>
                  <div className="bg-teal-100 p-2 rounded text-center">👔 mcp-linkedin</div>
                  <div className="bg-teal-100 p-2 rounded text-center">🧠 agent_health</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Advantages */}
        <section className="space-y-10 mt-20">
          <h3 className="text-3xl font-extrabold text-center">Platform Advantages of MCP Mesh</h3>
          <p className="text-lg text-slate-600 max-w-4xl mx-auto text-center">
            The MCP Mesh modernizes integration across agents and portals, improving discoverability, consistency, and operational trust. Its platform-first design ensures extensibility and resilience across environments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="text-3xl text-indigo-600 mb-3">🔍</div>
              <h4 className="font-bold mb-2 text-slate-800">Unified Discoverability</h4>
              <p className="text-sm text-slate-600">
                All tools are automatically registered and discoverable via <code>/mesh/tools</code>. Agents dynamically retrieve capabilities, ensuring adaptive and self-aware interoperability.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="text-3xl text-indigo-600 mb-3">🌐</div>
              <h4 className="font-bold mb-2 text-slate-800">Single Governed Gateway</h4>
              <p className="text-sm text-slate-600">
                All requests route through <code>https://mesh.aditya-raman.com</code>, providing a unified governance layer that ensures observability, policy enforcement, and secure data exchange.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="text-3xl text-indigo-600 mb-3">📦</div>
              <h4 className="font-bold mb-2 text-slate-800">Containerized Portability</h4>
              <p className="text-sm text-slate-600">
                Every microservice and the gateway run as containerized units — deployable across DigitalOcean, Azure, or Kubernetes — ensuring flexibility, scalability, and high availability.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center text-slate-500 text-sm py-8 border-t border-slate-200 mt-16">
        © 2025 MCP Mesh Orchestrator · Discoverable · Portable · Secure
      </footer>
    </div>
  );
};

export default ArchitectureEnhanced;