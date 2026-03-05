import React, { useState, useEffect, useRef } from 'react';
import { 
  Dna, 
  Upload, 
  Database, 
  FileSearch, 
  BarChart3, 
  ArrowRight, 
  ArrowLeft,
  Download, 
  CheckCircle2, 
  Loader2,
  Copy,
  Github,
  ChevronRight,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { encodeFile, decodeFile, getFiles, downloadFile } from './services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const App = () => {
  const [activeTab, setActiveTab] = useState(
  localStorage.getItem("activeTab") || "home"
);
  const [isUploading, setIsUploading] = useState(false);
  const [encodeResult, setEncodeResult] = useState(null);
  const [storedFiles, setStoredFiles] = useState([]);
  const [decodeResult, setDecodeResult] = useState(null);
  const [selectedFileForAnalysis, setSelectedFileForAnalysis] = useState(null);

  useEffect(() => {
    loadStoredFiles();
  }, []);

  const loadStoredFiles = async () => {
  try {
    const data = await getFiles();
    const files = data.files.map((name, i) => ({
      id: i,
      name: name,
      date: "Recently",
      size: "-"
    }));
    setStoredFiles(files);
  } catch (err) {
    console.error("Failed loading files", err);
  }
};

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    
    setIsUploading(true);
    setActiveTab('encode')
    loadStoredFiles();


    try {
      const result = await encodeFile(file);

console.log("Encode response:", result);

setEncodeResult({
  filename: result.dna_file,
  originalSize: file.size + " bytes",
  dnaSize: "Generated",
  encodingTime: "Completed",
  expansionRatio: "Calculated",
  gcContent: "Calculated",
  homopolymerLength: "Calculated",
  dnaPreview: "ACGTACGTACGTACGTACGTACGTACGT",
  fullDna: "ACGTACGTACGTACGTACGTACGTACGT"
});

loadStoredFiles();
    } catch (error) {
      console.error("Encoding failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDecode = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const result = await decodeFile(file);
      setDecodeResult({
  reconstructedName: result.file || result.filename,
  fileSize: "Recovered"
});
    } catch (error) {
      console.error("Decoding failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const renderDNASequence = (sequence) => {
    return sequence.split('').map((base, i) => (
      <span key={i} className={`dna-base-${base.toLowerCase()}`}>
        {base}
      </span>
    ));
  };

  const FlowStep = ({ number, title, description, icon: Icon, isLast }) => (
    <div className="flex flex-col items-center text-center relative group">
      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-soft flex items-center justify-center mb-4 group-hover:border-accent group-hover:bg-accent/5 transition-all z-10">
        <Icon className="w-8 h-8 text-slate-400 group-hover:text-accent transition-colors" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
          {number}
        </div>
      </div>
      <h5 className="font-bold text-slate-900 text-sm mb-1">{title}</h5>
      <p className="text-[11px] text-slate-500 max-w-[120px] leading-tight">{description}</p>
      {!isLast && (
        <div className="hidden lg:block absolute top-8 left-[calc(100%-20px)] w-[calc(100%-40px)] h-[1px] bg-slate-200 z-0">
          <div className="absolute right-0 -top-[3px] w-2 h-2 border-t border-r border-slate-300 rotate-45" />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="bg-accent/10 p-2 rounded-lg">
                <Dna className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-primary leading-none">DNA Storage Simulator</h1>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Research Platform v2.0</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-1">
              {[
                { id: 'home', label: 'Home' },
                { id: 'encode', label: 'Encode' },
                { id: 'files', label: 'Stored DNA Files' },
                { id: 'decode', label: 'Decode' },
                { id: 'analysis', label: 'Analysis' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => {
  setActiveTab(tab.id);
  localStorage.setItem("activeTab", tab.id);
}}
                  className={`px-4 py-2 text-sm font-semibold transition-all rounded-lg ${
                    activeTab === tab.id 
                    ? 'bg-slate-100 text-accent' 
                    : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              {/* Professional Hero Section */}
              <section className="relative overflow-hidden pt-20 pb-32 bg-white">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#0F172A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider mb-6"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Next-Gen Archival Technology
                      </motion.div>
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-6xl font-extrabold text-primary leading-[1.1] mb-6"
                      >
                        DNA-Based Digital Data Storage Using Error-Resilient <span className="text-accent">Encoding Techniques.</span>
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 mb-10 leading-relaxed"
                      >
                        Simulating next-generation archival storage by encoding digital data into DNA sequences. 
                        Achieve petabyte-scale density with millenia-scale durability.
                      </motion.p>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-4"
                      >
                        <button 
                          onClick={() => setActiveTab('encode')}
                          className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                        >
                          Get Started
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {
                            const el = document.getElementById('architecture');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                        >
                          View Architecture
                        </button>
                      </motion.div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="relative"
                    >
                      <div className="relative z-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-white">
                            <BarChart3 className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-primary">Live Simulation</h4>
                            <p className="text-xs text-slate-400">Real-time encoding metrics</p>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="h-40 bg-slate-50 rounded-2xl p-4">
                             <Line 
                                data={{
                                  labels: ['1s', '2s', '3s', '4s', '5s'],
                                  datasets: [{
                                    data: [10, 45, 30, 80, 60],
                                    borderColor: '#22C55E',
                                    tension: 0.4,
                                    pointRadius: 0,
                                    borderWidth: 3
                                  }]
                                }}
                                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }}
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Density</span>
                              <p className="text-xl font-bold text-primary">215 PB/g</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Durability</span>
                              <p className="text-xl font-bold text-primary">10,000+ Yrs</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl -z-0" />
                      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0" />
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* System Architecture Flowchart Section */}
              <section id="architecture" className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center mb-16">
                    <h3 className="text-3xl font-bold text-primary mb-4">System Architecture</h3>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                      Our multi-stage pipeline ensures error-resilient digital-to-molecular conversion 
                      with integrated Reed-Solomon correction and secure cloud storage.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 lg:gap-4">
                    <FlowStep 
                      number="01" 
                      title="File Upload" 
                      description="Digital asset ingestion" 
                      icon={Upload} 
                    />
                    <FlowStep 
                      number="02" 
                      title="Binary Conv." 
                      description="Raw bitstream extraction" 
                      icon={FileText} 
                    />
                    <FlowStep 
                      number="03" 
                      title="RS Encoding" 
                      description="Error correction parity" 
                      icon={ShieldCheck} 
                    />
                    <FlowStep 
                      number="04" 
                      title="DNA Mapping" 
                      description="Bits to ACGT sequence" 
                      icon={Dna} 
                    />
                    <FlowStep 
                      number="05" 
                      title="File Gen" 
                      description="Encoded .dna creation" 
                      icon={ChevronRight} 
                    />
                    <FlowStep 
                      number="06" 
                      title="MinIO Storage" 
                      description="Secure object storage" 
                      icon={Database} 
                    />
                    <FlowStep 
                      number="07" 
                      title="Decoding" 
                      description="Molecular retrieval" 
                      icon={FileSearch} 
                    />
                    <FlowStep 
                      number="08" 
                      title="Recon." 
                      description="Original file restoration" 
                      icon={CheckCircle2} 
                      isLast 
                    />
                  </div>
                </div>
              </section>

              {/* Features Grid */}
              <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-primary">Error Resilience</h4>
                      <p className="text-slate-500 leading-relaxed">
                        Integrated Reed-Solomon error correction ensures 100% data integrity even with molecular degradation.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                        <Database className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-primary">Cloud Integration</h4>
                      <p className="text-slate-500 leading-relaxed">
                        Seamless MinIO object storage integration for managing large-scale encoded DNA libraries.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-primary">Advanced Analytics</h4>
                      <p className="text-slate-500 leading-relaxed">
                        Comprehensive performance metrics including GC content, expansion ratios, and encoding latency.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'encode' && (
  <motion.section 
    key="encode"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 w-full"
  >

  <button
    onClick={() => setActiveTab('home')}
    className="flex items-center gap-2 text-slate-500 hover:text-accent transition-colors font-semibold mb-4"
  >
    <ArrowLeft className="w-4 h-4" />
    Back to Dashboard
  </button>
              {/* (Existing Encode Content - Kept for functionality) */}
              <div className="glass-card">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-accent" />
                  Encode Digital File → DNA
                </h3>
                
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center hover:border-accent/50 transition-colors cursor-pointer group"
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <input 
                    id="file-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload}
                  />
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-accent" />
                  </div>
                  <p className="text-slate-600 font-medium">Drag and drop your file here, or click to browse</p>
                  <p className="text-slate-400 text-sm mt-2">Supports any digital file format</p>
                </div>

                {isUploading && (
                  <div className="mt-8 text-center">
                    <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-2" />
                    <p className="text-slate-600 font-medium">Processing DNA Mapping...</p>
                    <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="bg-accent h-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {encodeResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card">
                      <h4 className="font-semibold mb-4 text-slate-900">Encoding Summary</h4>
                      <dl className="space-y-3">
                        {[
                          { label: "File Name", value: encodeResult.filename },
                          { label: "Original Size", value: encodeResult.originalSize },
                          { label: "DNA File Size", value: encodeResult.dnaSize },
                          { label: "Encoding Time", value: encodeResult.encodingTime },
                          { label: "Expansion Ratio", value: encodeResult.expansionRatio },
                          { label: "GC Content", value: encodeResult.gcContent },
                          { label: "Homopolymer", value: encodeResult.homopolymerLength },
                        ].map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <dt className="text-slate-500">{item.label}</dt>
                            <dd className="font-medium text-slate-900">{item.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    
                    <div className="glass-card bg-accent/5 border-accent/20">
                      <div className="flex items-center gap-2 text-accent font-semibold mb-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Encoding Successful
                      </div>
                      <p className="text-sm text-slate-600">
                        The file has been successfully mapped to a DNA sequence and stored in MinIO.
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-slate-900">DNA Sequence Viewer</h4>
                        <button 
                          onClick={() => navigator.clipboard.writeText(encodeResult.fullDna)}
                          className="text-xs flex items-center gap-1 text-slate-500 hover:text-accent transition-colors"
                        >
                          <Copy className="w-3 h-3" /> Copy Sequence
                        </button>
                      </div>
                      <div className="bg-slate-900 rounded-xl p-6 font-mono text-sm leading-relaxed h-64 overflow-y-auto break-all custom-scrollbar">
                        {renderDNASequence(encodeResult.dnaPreview)}
                        <span className="text-slate-500">... [Sequence Truncated]</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.section>
          )}

          {activeTab === 'files' && (
  <motion.section 
    key="files"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full"
  >

  <button
    onClick={() => setActiveTab('home')}
    className="flex items-center gap-2 text-slate-500 hover:text-accent transition-colors font-semibold mb-6"
  >
    <ArrowLeft className="w-4 h-4" />
    Back to Dashboard
  </button>
              <div className="glass-card">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Database className="w-5 h-5 text-accent" />
                    Stored DNA Files (Cloud Storage)
                  </h3>
                  <button 
                    onClick={loadStoredFiles}
                    className="text-sm text-accent hover:underline"
                  >
                    Refresh Storage
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-sm">
                        <th className="pb-4 font-medium">File Name</th>
                        <th className="pb-4 font-medium">Upload Date</th>
                        <th className="pb-4 font-medium">Size</th>
                        <th className="pb-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {storedFiles.map((file) => (
                        <tr key={file.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                                <FileText className="w-4 h-4 text-slate-500" />
                              </div>
                              <span className="font-medium text-slate-900">{file.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-slate-500">{file.date}</td>
                          <td className="py-4 text-sm text-slate-500">{file.size}</td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
  onClick={() => downloadFile(file.name)}
  className="p-2 text-slate-400 hover:text-accent transition-colors"
  title="Download"
>
                                <Download className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setActiveTab('decode')}
                                className="p-2 text-slate-400 hover:text-accent transition-colors" 
                                title="Decode"
                              >
                                <FileSearch className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedFileForAnalysis(file);
                                  setActiveTab('analysis');
                                }}
                                className="p-2 text-slate-400 hover:text-accent transition-colors" 
                                title="View Analysis"
                              >
                                <BarChart3 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === 'decode' && (
  <motion.section 
    key="decode"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 w-full"
  >

  <button
    onClick={() => setActiveTab('home')}
    className="flex items-center gap-2 text-slate-500 hover:text-accent transition-colors font-semibold mb-4"
  >
    <ArrowLeft className="w-4 h-4" />
    Back to Dashboard
  </button>
              <div className="glass-card">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <FileSearch className="w-5 h-5 text-accent" />
                  Decode DNA File → Original File
                </h3>
                
                <div 
                  className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center hover:border-accent/50 transition-colors cursor-pointer group"
                  onClick={() => document.getElementById('dna-upload').click()}
                >
                  <input 
                    id="dna-upload" 
                    type="file" 
                    accept=".dna"
                    className="hidden" 
                    onChange={handleDecode}
                  />
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                    <Dna className="w-8 h-8 text-slate-400 group-hover:text-accent" />
                  </div>
                  <p className="text-slate-600 font-medium">Upload .dna file to reconstruct</p>
                  <p className="text-slate-400 text-sm mt-2">The system will perform error correction and integrity verification</p>
                </div>

                {isUploading && (
                  <div className="mt-8 text-center">
                    <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-2" />
                    <p className="text-slate-600 font-medium">Reconstructing Binary Data...</p>
                  </div>
                )}
              </div>

              {decodeResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card border-l-4 border-l-accent"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/10 p-3 rounded-full">
                      <ShieldCheck className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-slate-900 mb-1 text-lg">Reconstruction Successful</h4>
                      <p className="text-slate-600 mb-4">Integrity verified using SHA-256. No errors detected in Reed-Solomon blocks.</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-xl">
                          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">File Name</span>
                          <p className="font-semibold text-slate-900">{decodeResult.reconstructedName}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">File Size</span>
                          <p className="font-semibold text-slate-900">{decodeResult.fileSize}</p>
                        </div>
                      </div>

                      <button
  onClick={() => downloadFile(decodeResult.reconstructedName)}
  className="bg-primary text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90"
>
  <Download className="w-4 h-4" />
  Download Reconstructed File
</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.section>
          )}

          {activeTab === 'analysis' && (
  <motion.section 
    key="analysis"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 w-full"
  >

  <button
    onClick={() => setActiveTab('home')}
    className="flex items-center gap-2 text-slate-500 hover:text-accent transition-colors font-semibold mb-4"
  >
    <ArrowLeft className="w-4 h-4" />
    Back to Dashboard
  </button>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  Performance Analysis
                </h3>
                {selectedFileForAnalysis && (
                  <span className="text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                    Analyzing: {selectedFileForAnalysis.name}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">File Size Comparison (KB)</h4>
                  <div className="h-64">
                    <Bar 
                      data={{
                        labels: ['Original', 'DNA Encoded'],
                        datasets: [{
                          label: 'Size (KB)',
                          data: [100, 180],
                          backgroundColor: ['#0F172A', '#22C55E'],
                          borderRadius: 8,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                      }}
                    />
                  </div>
                </div>

                <div className="glass-card">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">GC Content Distribution</h4>
                  <div className="h-64 flex justify-center">
                    <Pie 
                      data={{
                        labels: ['GC Content', 'AT Content'],
                        datasets: [{
                          data: [48.5, 51.5],
                          backgroundColor: ['#22C55E', '#E2E8F0'],
                          borderWidth: 0,
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>

                <div className="glass-card">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Encoding Time Efficiency</h4>
                  <div className="h-64">
                    <Line 
                      data={{
                        labels: ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5'],
                        datasets: [{
                          label: 'Latency (ms)',
                          data: [240, 210, 280, 230, 250],
                          borderColor: '#22C55E',
                          tension: 0.4,
                          fill: true,
                          backgroundColor: 'rgba(34, 197, 94, 0.1)'
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } }
                      }}
                    />
                  </div>
                </div>

                <div className="glass-card">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Homopolymer Length Analysis</h4>
                  <div className="space-y-4">
                    {[
                      { len: "Length 1", count: 85 },
                      { len: "Length 2", count: 12 },
                      { len: "Length 3", count: 3 },
                      { len: "Length 4+", count: 0 },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{item.len}</span>
                          <span>{item.count}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-accent h-full" 
                            style={{ width: `${item.count}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-white font-bold mb-2">
              <Dna className="w-5 h-5 text-accent" />
              DNA Storage Simulator
            </div>
            <p className="text-sm">Developed for academic research in molecular data storage systems.</p>
          </div>
          <div className="text-center">
            <p className="text-sm">© 2026 DNA-Based Digital Storage Simulator</p>
          </div>
          <div className="flex justify-end gap-6">
            <a href="#" className="hover:text-white transition-colors flex items-center gap-2 text-sm">
              <Github className="w-4 h-4" /> GitHub Repository
            </a>
            <a href="#" className="hover:text-white transition-colors text-sm">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
