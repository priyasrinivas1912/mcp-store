import React, { useState } from 'react';
import {
  Shield,
  Layers,
  CheckCircle2,
  Cpu,
  Terminal,
  ExternalLink,
  BookOpen,
  Zap,
  X,
  Sparkles,
  ArrowRight,
  Code2,
  Package,
  Container,
  Lock,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Play
} from 'lucide-react';
import {
  NINE_STAGE_SECURITY_PIPELINE,
  PROTOTYPE_PIPELINE_FLOW,
  IEEE_TAXONOMY_NOTE,
  PipelineStageSpec
} from '../data/securityPipelineSpecs';

interface SecurityArchitectureModalProps {
  onClose: () => void;
  onOpenLiveScanner: () => void;
}

export const SecurityArchitectureModal: React.FC<SecurityArchitectureModalProps> = ({
  onClose,
  onOpenLiveScanner
}) => {
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'matrix' | 'flow' | 'ieee_note'>('matrix');

  const selectedStage = NINE_STAGE_SECURITY_PIPELINE[selectedLayerIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#1a1a1a] flex items-center justify-between bg-[#050505]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#111111] border border-[#222222] flex items-center justify-center text-[#10b981]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-medium text-white font-serif-display">
                  MCP-Store 9-Stage Security Pipeline & Tool Mapping
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 uppercase tracking-widest">
                  Layer 0 → Layer 8
                </span>
              </div>
              <p className="text-xs text-[#737373] font-mono mt-0.5">
                Research Toolchain Specification: PolicyLayer • Semgrep • OSV-Scanner • Ghostprobe • Docker • Hermes • MCPGuard • Cosign/SLSA/Trivy • AuditCore
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#737373] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-[#1a1a1a] bg-[#080808]">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-[#141414] text-[#10b981] border border-[#10b981]/30 shadow-sm'
                : 'text-[#737373] hover:text-[#e5e5e5] hover:bg-[#111111]'
            }`}
          >
            9-Stage Tool Matrix
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              activeTab === 'flow'
                ? 'bg-[#141414] text-[#10b981] border border-[#10b981]/30 shadow-sm'
                : 'text-[#737373] hover:text-[#e5e5e5] hover:bg-[#111111]'
            }`}
          >
            Prototype Execution Pipeline
          </button>
          <button
            onClick={() => setActiveTab('ieee_note')}
            className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              activeTab === 'ieee_note'
                ? 'bg-[#141414] text-[#10b981] border border-[#10b981]/30 shadow-sm'
                : 'text-[#737373] hover:text-[#e5e5e5] hover:bg-[#111111]'
            }`}
          >
            IEEE Paper Architecture Note
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* TAB 1: 9-STAGE TOOL MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-6">
              {/* Summary Banner */}
              <div className="p-4 rounded-xl bg-[#050505] border border-[#1a1a1a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#10b981] uppercase tracking-wider">
                      Complete 9-Layer Security Architecture
                    </span>
                    <span className="text-xs text-[#555555] font-mono">(Layer 0 to Layer 8)</span>
                  </div>
                  <p className="text-xs text-[#a3a3a3] leading-relaxed">
                    Every MCP server submitted to the registry undergoes automatic validation across all 9 specialized layers, executing static AST analysis, dependency audits, sandbox jailing, runtime firewalls, and supply chain verification.
                  </p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenLiveScanner();
                  }}
                  className="px-4 py-2 rounded text-xs uppercase tracking-wider font-bold bg-[#10b981] hover:bg-[#059669] text-black flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-black text-black" />
                  Test Live Scanner
                </button>
              </div>

              {/* Grid: Left Stages List, Right Selected Stage Deep Dive */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: 9 Stages List */}
                <div className="lg:col-span-5 space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {NINE_STAGE_SECURITY_PIPELINE.map((stage) => {
                    const isSelected = selectedLayerIndex === stage.layerNumber;
                    return (
                      <button
                        key={stage.layerNumber}
                        onClick={() => setSelectedLayerIndex(stage.layerNumber)}
                        className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#111111] border-[#10b981]/50 shadow-sm'
                            : 'bg-[#050505] hover:bg-[#0f0f0f] border-[#1a1a1a]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                              isSelected
                                ? 'bg-[#10b981] text-black'
                                : 'bg-[#1a1a1a] text-[#737373]'
                            }`}
                          >
                            L{stage.layerNumber}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-[#e5e5e5]'}`}>
                                {stage.name}
                              </p>
                            </div>
                            <p className="text-[11px] text-[#10b981] font-mono">
                              {stage.toolName}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                              stage.statusInPrototype === 'LIVE_IMPLEMENTED'
                                ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/25'
                                : 'bg-[#111111] text-[#737373] border-[#222222]'
                            }`}
                          >
                            {stage.statusInPrototype === 'LIVE_IMPLEMENTED' ? 'Live Prototype' : 'Research Stub'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Selected Stage Deep Dive Details */}
                <div className="lg:col-span-7 rounded-xl bg-[#050505] border border-[#1a1a1a] p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-[#141414] pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#10b981] text-black">
                          Layer {selectedStage.layerNumber}
                        </span>
                        <span className="text-xs font-mono text-[#737373] uppercase tracking-wider">
                          {selectedStage.category}
                        </span>
                        <span className="text-[#333333]">•</span>
                        <span className="text-xs font-mono text-[#737373]">Weight: {selectedStage.weight}%</span>
                      </div>
                      <h4 className="text-lg font-medium text-white font-serif-display mt-1">
                        {selectedStage.name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-[#10b981] block">
                        {selectedStage.toolName}
                      </span>
                      {selectedStage.toolAlias && (
                        <span className="text-[10px] font-mono text-[#737373]">
                          ({selectedStage.toolAlias})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] font-bold block mb-1">
                        Primary Purpose
                      </span>
                      <p className="text-[#e5e5e5] leading-relaxed">
                        {selectedStage.purpose}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] font-bold block mb-1">
                        Technical Inspection Mechanism
                      </span>
                      <p className="text-[#a3a3a3] leading-relaxed font-mono text-[11px] bg-[#0a0a0a] p-2.5 rounded border border-[#141414]">
                        {selectedStage.mechanism}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-[#0a0a0a] p-3 rounded border border-[#141414] space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] font-bold block">
                          Inspection Inputs
                        </span>
                        <ul className="space-y-1">
                          {selectedStage.inputs.map((inp, idx) => (
                            <li key={idx} className="text-[#a3a3a3] font-mono text-[11px] flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#10b981]" />
                              {inp}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-[#0a0a0a] p-3 rounded border border-[#141414] space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] font-bold block">
                          Telemetry & Metrics
                        </span>
                        <ul className="space-y-1">
                          {selectedStage.outputs.map((out, idx) => (
                            <li key={idx} className="text-[#a3a3a3] font-mono text-[11px] flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-[#10b981]" />
                              {out}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#141414] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#555555]">Formal Publication Reference:</span>
                      <span className="text-[#10b981]">{selectedStage.paperReference}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Comparison Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#737373] font-bold">
                  Complete Tool Mapping Reference Matrix (9 Stages)
                </h4>
                <div className="overflow-x-auto rounded-xl border border-[#1a1a1a]">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#050505] text-[#737373] border-b border-[#1a1a1a] uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3">Stage</th>
                        <th className="p-3">Security Layer</th>
                        <th className="p-3">Primary Tool</th>
                        <th className="p-3">Purpose & Target</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#141414] bg-[#080808]">
                      {NINE_STAGE_SECURITY_PIPELINE.map((stg) => (
                        <tr key={stg.layerNumber} className="hover:bg-[#0e0e0e] transition-colors">
                          <td className="p-3 font-bold text-[#10b981]">L{stg.layerNumber}</td>
                          <td className="p-3 font-medium text-white">{stg.name}</td>
                          <td className="p-3 text-[#10b981] font-semibold">{stg.toolName}</td>
                          <td className="p-3 text-[#a3a3a3] max-w-md truncate font-sans text-xs">{stg.purpose}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                                stg.statusInPrototype === 'LIVE_IMPLEMENTED'
                                  ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
                                  : 'bg-[#141414] text-[#737373] border border-[#222222]'
                              }`}
                            >
                              {stg.statusInPrototype === 'LIVE_IMPLEMENTED' ? 'Practical Core' : 'Research Stub'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROTOTYPE EXECUTION FLOW */}
          {activeTab === 'flow' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#050505] border border-[#1a1a1a] space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#10b981] font-bold">
                  Practical Prototype Execution Architecture
                </h4>
                <p className="text-xs text-[#a3a3a3] leading-relaxed">
                  For the first fully-functional MCP Store prototype, the end-to-end audit pipeline is structured into 8 concrete execution phases connecting live GitHub repositories to client-ready configuration files:
                </p>
                <div className="p-3 rounded bg-[#0a0a0a] border border-[#141414] text-xs font-mono text-[#10b981] flex flex-wrap items-center gap-2">
                  <span>GitHub API</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#555555]" />
                  <span>Semgrep</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#555555]" />
                  <span>npm audit / OSV-Scanner</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#555555]" />
                  <span>Docker Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#555555]" />
                  <span>Trivy</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#555555]" />
                  <span>Cosign / SLSA</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#555555]" />
                  <span>Trust Score Engine</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#555555]" />
                  <span>Verified Report & Cert</span>
                </div>
              </div>

              {/* Step by Step Flow Cards */}
              <div className="space-y-3">
                {PROTOTYPE_PIPELINE_FLOW.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 rounded-xl bg-[#050505] border border-[#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#2a2a2a] transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className="w-8 h-8 rounded bg-[#111111] border border-[#222222] flex items-center justify-center text-xs font-mono font-bold text-[#10b981] shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                            {step.name}
                          </h5>
                          <span className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/20">
                            {step.tool}
                          </span>
                        </div>
                        <p className="text-xs text-[#a3a3a3] font-sans mt-0.5">
                          {step.note}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#10b981] shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: IEEE PAPER ARCHITECTURE NOTE */}
          {activeTab === 'ieee_note' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[#050505] border border-[#10b981]/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981]">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-white font-serif-display">
                      {IEEE_TAXONOMY_NOTE.title}
                    </h4>
                    <p className="text-xs text-[#10b981] font-mono">
                      Research Publication Formal Standardization Note
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-[#e5e5e5] leading-relaxed">
                  <p>
                    In the preliminary manuscript draft, the verification architecture was occasionally referred to with the shorthand &quot;8-layer security architecture&quot;. However, because the system initiates with <strong>Layer 0 (PolicyLayer Metadata & Risk)</strong> and concludes with <strong>Layer 8 (AuditCore External Attestation)</strong>, the pipeline consists of exactly <strong>9 distinct verification stages</strong>.
                  </p>

                  <div className="p-4 rounded bg-[#0a0a0a] border border-[#141414] space-y-2 font-mono text-xs">
                    <p className="text-[#10b981] font-bold">Standardized IEEE Taxonomy Mapping:</p>
                    <ul className="space-y-1 text-[#a3a3a3] text-[11px]">
                      <li>• <strong>Layer 0:</strong> PolicyLayer (Maintainer KYC & Manifest Policy)</li>
                      <li>• <strong>Layer 1:</strong> Semgrep / mcp-safeguard (Static AST Vulnerabilities)</li>
                      <li>• <strong>Layer 2:</strong> npm audit / OSV-Scanner (Dependency CVE Database)</li>
                      <li>• <strong>Layer 3:</strong> Ghostprobe (Dynamic JSON-RPC Fuzzing)</li>
                      <li>• <strong>Layer 4:</strong> Docker Sandbox (Syscall Jailing & Isolation)</li>
                      <li>• <strong>Layer 5:</strong> Hermes (Multi-Check Composite Audit Fusion)</li>
                      <li>• <strong>Layer 6:</strong> MCPGuard (Runtime Guardrails & Prompt Intercepts)</li>
                      <li>• <strong>Layer 7:</strong> Cosign + SLSA + Trivy (Supply Chain & SBOM)</li>
                      <li>• <strong>Layer 8:</strong> AuditCore (Third-Party Attestation Certificate)</li>
                    </ul>
                  </div>

                  <p className="text-[#a3a3a3]">
                    For the conference paper presentation and prototype demonstration, this 9-stage architecture provides a mathematically rigorous, zero-trust foundation that protects AI LLM hosts from untrusted Model Context Protocol tool execution.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#050505] flex items-center justify-between">
          <span className="text-xs font-mono text-[#737373]">
            MCP-Store v3.0.0-IEEE • 9-Stage Zero-Trust Framework
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded text-xs uppercase tracking-wider font-bold bg-[#10b981] hover:bg-[#059669] text-black cursor-pointer transition-all"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
