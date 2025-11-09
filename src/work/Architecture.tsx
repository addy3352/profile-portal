import React, { useState, useEffect } from 'react';
import './Architecture.css';

const Architecture = () => {
    const [openAccordion, setOpenAccordion] = useState(null);

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    useEffect(() => {
        document.title = 'MCP Mesh Architecture - Governed AI Flow';

        // --- KPI Counter Animation (for visual appeal) ---
        const kpiTargets = { latency: 150, hits: 4500, denials: 12, size: 1.5 };

        function animateValue(obj, start, end, duration) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                let currentValue;
                if (obj.dataset.kpi === 'size') {
                    currentValue = (start + progress * (end - start)).toFixed(1);
                } else {
                    currentValue = Math.floor(start + progress * (end - start));
                }
                if (obj) {
                    obj.innerHTML = currentValue;
                }
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }

        const kpiElements = document.querySelectorAll('#kpi-container [data-kpi]');
        kpiElements.forEach(el => {
            const target = kpiTargets[el.dataset.kpi];
            animateValue(el, 0, target, 1500);
        });

    }, []);

    return (
        <div className="bg-slate-50 text-slate-900 antialiased">
            {/* Header */}
            <header className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-indigo-700">MCP Mesh Architecture: Governed AI Flow</h1>
                    <span className="text-slate-600">Architectural Review</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-16">

                {/* OVERVIEW & KPIs */}
                <section className="space-y-6">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                            Governed AI Flow Orchestration
                        </h2>
                        <p className="text-xl text-slate-600 leading-relaxed border-l-4 border-indigo-500 pl-4">
                            The <strong>MCP Mesh</strong> is a secure orchestration layer connecting your <strong>Profile Portal</strong>, <strong>AI Agents</strong>, and <strong>Microservices</strong> through centralized <strong>governance</strong>, <strong>zero-trust policies</strong>, and <strong>immutable audit logging</strong>.
                        </p>
                    </div>

                    {/* KPI Cards */}
                    <div id="kpi-container" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                            <div className="text-4xl font-extrabold text-indigo-600" data-kpi="latency">0</div>
                            <div className="text-sm text-slate-500 mt-1">Avg. Gateway Latency (ms)</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                            <div className="text-4xl font-extrabold text-indigo-600" data-kpi="hits">0</div>
                            <div className="text-sm text-slate-500 mt-1">Daily Policy Hits (Allowed)</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                            <div className="text-4xl font-extrabold text-red-600" data-kpi="denials">0</div>
                            <div className="text-sm text-slate-500 mt-1">Daily Denied Calls (Audit Log)</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                            <div className="text-4xl font-extrabold text-indigo-600" data-kpi="size">0.0</div>
                            <div className="text-sm text-slate-500 mt-1">Audit Log Size (MB/Day)</div>
                        </div>
                    </div>
                </section>

                {/* NEW LEFT-TO-RIGHT FLOW DIAGRAM */}
                <section id="arch-flow">
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">
                        Governed Data Flow: Profile to Microservices
                    </h3>
                    <p className="text-lg text-slate-600 max-w-4xl mx-auto text-center mb-10">
                        This diagram illustrates the data flow, showing how requests from the <strong>Profile Portal</strong> or <strong>AI Agents</strong> are securely routed through the central <strong>MCP Mesh</strong> control boundary to access specialized data services.
                    </p>

                    <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-4">
                        
                        {/* 1. External Initiators */}
                        <div className="flex lg:flex-col space-x-4 lg:space-x-0 lg:space-y-4">
                            <div className="arch-step-box bg-white border-indigo-400">
                                <div className="text-2xl text-indigo-600">🌐</div>
                                <div className="text-sm font-semibold mt-1">Profile Portal</div>
                            </div>
                            <div className="arch-step-box bg-white border-slate-400">
                                <div className="text-2xl text-slate-600">🤖</div>
                                <div className="text-sm font-semibold mt-1">ChatGPT Agent</div>
                            </div>
                        </div>

                        {/* CONNECTOR ARROW */}
                        <div className="arch-connector hidden lg:block">➔</div>
                        <div className="arch-connector lg:hidden">⬇️</div>

                        {/* 2. MCP Mesh Boundary */}
                        <div className="arch-container">
                            <h4 className="text-2xl font-extrabold text-indigo-700 mb-6 text-center border-b pb-2 border-indigo-200">
                                MCP MESH (The Governed Boundary)
                            </h4>
                            
                            <div className="flex flex-col md:flex-row items-stretch md:space-x-6 space-y-6 md:space-y-0">
                                
                                {/* A. Control Plane (Left) */}
                                <div className="w-full md:w-1/3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-inner flex flex-col justify-between">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-indigo-700 mb-3">Central Gateway</div>
                                        <div className="space-y-2">
                                            <div className="bg-indigo-200 text-indigo-900 p-2 text-sm font-medium rounded-md">1. Policy Check (Governance)</div>
                                            <div className="bg-indigo-200 text-indigo-900 p-2 text-sm font-medium rounded-md">2. Audit Logging</div>
                                            <div className="bg-indigo-200 text-indigo-900 p-2 text-sm font-medium rounded-md">3. Notification Routing</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <div className="text-sm font-bold text-slate-700">Mesh Core (DB Persistence)</div>
                                    </div>
                                </div>

                                {/* B. Routing & Data Plane (Right) */}
                                <div className="w-full md:w-2/3 p-4 bg-white border border-slate-200 rounded-lg shadow-inner">
                                    <h5 className="text-xl font-bold text-teal-700 mb-4 text-center border-b pb-2">Microservice Routing</h5>
                                    <div className="arch-microservice-group">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-teal-100 text-teal-800 p-2 rounded-md text-sm font-medium flex items-center justify-center">❤️ mcp-garmin</div>
                                            <div className="bg-teal-100 text-teal-800 p-2 rounded-md text-sm font-medium flex items-center justify-center">🥗 mcp-nutrition</div>
                                            <div className="bg-teal-100 text-teal-800 p-2 rounded-md text-sm font-medium flex items-center justify-center">👔 mcp-linkedin</div>
                                            <div className="bg-teal-100 text-teal-800 p-2 rounded-md text-sm font-medium flex items-center justify-center">🧠 agent_health</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* NEW TECHNICAL FLOW DIAGRAM (Replaces old Sequential Flow) */}
                <section id="tech-flow">
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-8 text-center">
                        Original Request Lifecycle (Technical Detail)
                    </h3>
                    <p className="text-lg text-slate-600 max-w-4xl mx-auto text-center mb-8">
                        This diagram illustrates the mandatory sequential steps and technical decisions involved in processing a single API call (`/mesh/call`) across the microservice architecture.
                    </p>

                    <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-200 overflow-x-auto">
                        <div className="flex flex-col lg:flex-row lg:space-x-8 min-w-[1200px]">
                            
                            {/* Lane 1: Client/Nginx */}
                            <div className="tech-flow-lane border-indigo-500">
                                <h4 className="font-bold text-center text-indigo-700 mb-4">1. INITIATION</h4>
                                <div className="tech-flow-step">
                                    Client sends POST to Nginx
                                    <div className="tech-flow-text">Includes `X-API-KEY` header.</div>
                                </div>
                                <div className="tech-flow-connector transform rotate-90 lg:rotate-0">➔</div>
                            </div>

                            {/* Lane 2: Gateway Check */}
                            <div className="tech-flow-lane border-purple-500">
                                <h4 className="font-bold text-center text-purple-700 mb-4">2. AUTH & POLICY CHECK</h4>
                                <div className="tech-flow-step bg-purple-50 text-purple-700 border-purple-200">
                                    Gateway Authenticates Client Role
                                    <div className="tech-flow-text">Verifies key and extracts Role (`agent-health`, `system-scheduler`).</div>
                                </div>
                                <div className="tech-flow-step bg-purple-50 text-purple-700 border-purple-200">
                                    Policy Engine Decision Point
                                    <div className="tech-flow-text">Checks `policy.yaml`: Role allowed to call Target Tool?</div>
                                </div>
                                <div className="tech-flow-connector transform rotate-90 lg:rotate-0">➔</div>
                            </div>

                            {/* Lane 3: Auditing */}
                            <div className="tech-flow-lane border-red-500">
                                <h4 className="font-bold text-center text-red-700 mb-4">3. AUDIT & LOG DECISION</h4>
                                <div className="tech-flow-step bg-red-50 text-red-700 border-red-200">
                                    Audit Log Write (IMMEDIATE)
                                    <div className="tech-flow-text">Logs `Client ID`, `Role`, `Tool`, and <strong>Decision</strong> (`ALLOW` or `DENY`).</div>
                                </div>
                                <div className="tech-flow-step bg-red-50 text-red-700 border-red-200">
                                    If DENIED, STOP Flow (403 Forbidden)
                                    <div className="tech-flow-text">Request terminates here.</div>
                                </div>
                                <div className="tech-flow-connector transform rotate-90 lg:rotate-0">➔</div>
                            </div>

                            {/* Lane 4: Execution */}
                            <div className="tech-flow-lane border-teal-500">
                                <h4 className="font-bold text-center text-teal-700 mb-4">4. EXECUTION & DATA PLANE</h4>
                                <div className="tech-flow-step bg-teal-50 text-teal-700 border-teal-200">
                                    Gateway Routes Request
                                    <div className="tech-flow-text">Routes to target service (e.g., `mcp-garmin:8000`).</div>
                                </div>
                                <div className="tech-flow-step bg-teal-50 text-teal-700 border-teal-200">
                                    Microservice Executes Tool
                                    <div className="tech-flow-text">Performs core logic (API call, data processing, DB write).</div>
                                </div>
                                <div className="tech-flow-connector transform rotate-90 lg:rotate-0">➔</div>
                            </div>

                            {/* Lane 5: Response */}
                            <div className="tech-flow-lane border-slate-500">
                                <h4 className="font-bold text-center text-slate-700 mb-4">5. RETURN RESPONSE</h4>
                                <div className="tech-flow-step bg-slate-100 text-slate-700 border-slate-300">
                                    Microservice sends Result to Gateway
                                    <div className="tech-flow-text">Typically JSON status/data.</div>
                                </div>
                                <div className="tech-flow-step bg-slate-100 text-slate-700 border-slate-300">
                                    Gateway returns final 200/500 to Client
                                    <div className="tech-flow-text">Client receives final status and payload.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* GOVERNANCE PILLARS */}
                <section className="space-y-8 mt-16">
                    <h3 className="text-3xl font-extrabold text-slate-900 mb-6 text-center">
                        Core Governance & Zero-Trust Pillars
                    </h3>
                    <p className="text-lg text-slate-600 max-w-4xl mx-auto text-center">
                        These four principles define the security and operational compliance of the mesh. Click to explore the technical depth of each pillar.
                    </p>

                    <div id="accordion-container" className="space-y-3 max-w-4xl mx-auto">
                        {/* Principle 1: Governance by Policy */}
                        <div className="bg-white rounded-lg shadow-md border border-slate-200">
                            <button className="w-full text-left p-4 flex justify-between items-center text-xl font-semibold text-indigo-700 transition-colors duration-200 hover:bg-slate-50" onClick={() => toggleAccordion('p1')}>
                                <span>1. Policy Engine & Tool Governance</span>
                                <span id="p1-icon" className={`transform transition-transform duration-300 ${openAccordion === 'p1' ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                            <div id="p1-content" className={`p-4 pt-0 text-slate-700 ${openAccordion === 'p1' ? '' : 'hidden'}`}>
                                <h4 className="font-bold mb-2 text-slate-800">Technical Implementation: `policy.yaml`</h4>
                                <p className="mb-3">**Mechanism:** All services are assigned a **Role** (e.g., `agent-health`, `system-scheduler`). The Gateway reads the declarative `policy.yaml` file, which contains explicit `allow_tools` and `deny_tools` lists for each role. This enforces **least privilege**. If a request attempts a tool not explicitly allowed for its role, it is immediately blocked at the Gateway (Zero-Trust).</p>
                            </div>
                        </div>

                        {/* Principle 2: Comprehensive Audit */}
                        <div className="bg-white rounded-lg shadow-md border border-slate-200">
                            <button className="w-full text-left p-4 flex justify-between items-center text-xl font-semibold text-indigo-700 transition-colors duration-200 hover:bg-slate-50" onClick={() => toggleAccordion('p2')}>
                                <span>2. Comprehensive & Immutable Audit Trail</span>
                                <span id="p2-icon" className={`transform transition-transform duration-300 ${openAccordion === 'p2' ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                            <div id="p2-content" className={`p-4 pt-0 text-slate-700 ${openAccordion === 'p2' ? '' : 'hidden'}`}>
                                <h4 className="font-bold mb-2 text-slate-800">Implementation: Audit Logging (Mesh Core DB)</h4>
                                <p className="mb-3">**Mechanism:** Every transaction that hits the Gateway—**both allowed and denied requests**—is recorded in an immutable audit log within the Mesh Core's SQLite database. The log includes the `client_id`, `role`, `tool`, `arguments` (with secrets redacted), and the `decision` (`allow`/`deny`). This provides a full forensic record for compliance.</p>
                            </div>
                        </div>

                        {/* Principle 3: Zero-Trust Security */}
                        <div className="bg-white rounded-lg shadow-md border border-slate-200">
                            <button className="w-full text-left p-4 flex justify-between items-center text-xl font-semibold text-indigo-700 transition-colors duration-200 hover:bg-slate-50" onClick={() => toggleAccordion('p3')}>
                                <span>3. Layered Zero-Trust Security</span>
                                <span id="p3-icon" className={`transform transition-transform duration-300 ${openAccordion === 'p3' ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                            <div id="p3-content" className={`p-4 pt-0 text-slate-700 ${openAccordion === 'p3' ? '' : 'hidden'}`}>
                                <h4 className="font-bold mb-2 text-slate-800">Implementation: TLS & Authentication</h4>
                                <p className="mb-3">**Mechanism:** External traffic is protected by **TLS termination at Nginx**. API calls from the client (Portal) use client-specific API keys (`X-API-KEY`). For internal requests (from AI agents or the Scheduler), the Gateway enforces authentication via specific internal headers (`X-Client-Role`) which must be validated against the policy before being trusted. Secrets (passwords/tokens) are never exposed to the client browser.</p>
                            </div>
                        </div>

                        {/* Principle 4: Real-Time Notification */}
                        <div className="bg-white rounded-lg shadow-md border border-slate-200">
                            <button className="w-full text-left p-4 flex justify-between items-center text-xl font-semibold text-indigo-700 transition-colors duration-200 hover:bg-slate-50" onClick={() => toggleAccordion('p4')}>
                                <span>4. Real-Time Notification & Eventing</span>
                                <span id="p4-icon" className={`transform transition-transform duration-300 ${openAccordion === 'p4' ? 'rotate-180' : ''}`}>▼</span>
                            </button>
                            <div id="p4-content" className={`p-4 pt-0 text-slate-700 ${openAccordion === 'p4' ? '' : 'hidden'}`}>
                                <h4 className="font-bold mb-2 text-slate-800">Implementation: `notify.py` Utility</h4>
                                <p className="mb-3">**Mechanism:** The `notify.py` utility is embedded across the mesh. Key services (like the Garmin sync or the Health Agent recommendation process) call the core's notification tool, which dispatches structured messages (e.g., via Twilio/WhatsApp or Webhooks) to keep the user informed of critical events, closing the loop on automation.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="text-center text-slate-500 text-sm py-8 border-t border-slate-200 mt-16">
                    © 2025 MCP Mesh Orchestrator · Governed · Auditable · Secure · Designed for Architects
                </footer>

            </main>
        </div>
    );
};

export default Architecture;
