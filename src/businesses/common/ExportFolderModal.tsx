import React, { useState } from 'react';
import {
  Folder,
  FolderTree,
  Download,
  Copy,
  Check,
  X,
  FileCode,
  Terminal,
  Database,
  Monitor,
  Globe,
  Sparkles,
  Layers,
  Glasses,
  Shirt,
  Utensils,
  Cpu,
  Smartphone,
} from 'lucide-react';
import { BusinessIndustryId } from '../types';
import { ALL_BUSINESSES, BUSINESS_IDS, businessStorage } from '../registry';

interface ExportFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBusinessId: BusinessIndustryId;
}

const BUSINESS_ICONS: Record<BusinessIndustryId, React.ReactNode> = {
  glasses: <Glasses className="w-4 h-4" />,
  clothes: <Shirt className="w-4 h-4" />,
  food: <Utensils className="w-4 h-4" />,
  electronics: <Cpu className="w-4 h-4" />,
  phones: <Smartphone className="w-4 h-4" />,
};

export const ExportFolderModal: React.FC<ExportFolderModalProps> = ({
  isOpen,
  onClose,
  activeBusinessId,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<BusinessIndustryId>(activeBusinessId);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentConfig = ALL_BUSINESSES[selectedFolderId];
  const products = businessStorage.getProducts(selectedFolderId);
  const orders = businessStorage.getOrders(selectedFolderId);
  const stats = businessStorage.getStats(selectedFolderId);

  // Generate automated PowerShell script to create the 5 industry parent folders
  // and their exact sub-projects: <industry>website and <industry>desktopapp
  const powershellScript = `# =====================================================================
# Freelance Multi-Business Architecture Generator for HANI
# Base Directory: C:\\Users\\HANI\\Desktop\\freelance
# =====================================================================

$baseDir = "C:\\Users\\HANI\\Desktop\\freelance"

$industries = @(
  "glasses",
  "clothes",
  "food",
  "electronics",
  "phones"
)

foreach ($ind in $industries) {
  # 1. Industry Parent Folder: e.g. C:\\Users\\HANI\\Desktop\\freelance\\clothes
  $parentPath = Join-Path -Path $baseDir -ChildPath $ind
  if (-not (Test-Path $parentPath)) {
    New-Item -ItemType Directory -Path $parentPath -Force | Out-Null
    Write-Host "[OK] Created Parent Folder: $parentPath" -ForegroundColor Yellow
  }

  # 2. Client Storefront Website: e.g. C:\\Users\\HANI\\Desktop\\freelance\\clothes\\clotheswebsite
  $websitePath = Join-Path -Path $parentPath -ChildPath ($ind + "website")
  if (-not (Test-Path $websitePath)) {
    New-Item -ItemType Directory -Path $websitePath -Force | Out-Null
    Write-Host "[OK] Created Client Website: $websitePath" -ForegroundColor Cyan
  }

  # 3. Owner Desktop Logiciel: e.g. C:\\Users\\HANI\\Desktop\\freelance\\clothes\\clothesdesktopapp
  $desktopPath = Join-Path -Path $parentPath -ChildPath ($ind + "desktopapp")
  if (-not (Test-Path $desktopPath)) {
    New-Item -ItemType Directory -Path $desktopPath -Force | Out-Null
    Write-Host "[OK] Created Owner Desktop App: $desktopPath" -ForegroundColor Green
  }

  # 4. Backend Flask API: e.g. C:\\Users\\HANI\\Desktop\\freelance\\clothes\\backend-flask
  $flaskPath = Join-Path -Path $parentPath -ChildPath "backend-flask"
  if (-not (Test-Path $flaskPath)) {
    New-Item -ItemType Directory -Path $flaskPath -Force | Out-Null
  }

  # 5. MongoDB Seed: e.g. C:\\Users\\HANI\\Desktop\\freelance\\clothes\\mongodb-dataset
  $mongoPath = Join-Path -Path $parentPath -ChildPath "mongodb-dataset"
  if (-not (Test-Path $mongoPath)) {
    New-Item -ItemType Directory -Path $mongoPath -Force | Out-Null
  }
}

Write-Host "Success! All 5 industries with their website and desktop apps created in $baseDir!" -ForegroundColor Green
`;

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadPowerShellScript = () => {
    const blob = new Blob([powershellScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'create_freelance_folders.ps1';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadBusinessDataset = () => {
    const bundle = {
      industry: currentConfig.id,
      businessName: currentConfig.clientName,
      folderPath: `C:\\Users\\HANI\\Desktop\\freelance\\${currentConfig.folderName}`,
      websitePath: `C:\\Users\\HANI\\Desktop\\freelance\\${currentConfig.folderName}\\${currentConfig.folderName}website`,
      desktopAppPath: `C:\\Users\\HANI\\Desktop\\freelance\\${currentConfig.folderName}\\${currentConfig.folderName}desktopapp`,
      databaseUri: 'mongodb://localhost:27017/freelance_' + currentConfig.id,
      products,
      orders,
      stats,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentConfig.folderName}_complete_dataset.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left my-auto max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Freelancer Multi-Client Suite
              </span>
              <span className="text-xs font-mono text-zinc-300">C:\Users\HANI\Desktop\freelance\</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
              5 Independent Folders • Website &amp; Desktop App Separated
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5 Folder Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {BUSINESS_IDS.map((id) => {
            const biz = ALL_BUSINESSES[id];
            const isSelected = selectedFolderId === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedFolderId(id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800 border-zinc-600 shadow-xl scale-102'
                    : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900/80'
                }`}
                style={
                  isSelected
                    ? {
                        borderLeft: `3px solid ${biz.theme.primary}`,
                        boxShadow: `0 4px 20px ${biz.theme.primary}33`,
                      }
                    : {}
                }
              >
                <div className="flex items-center gap-1.5 mb-1" style={{ color: biz.theme.accent }}>
                  {BUSINESS_ICONS[id]}
                  <span className="text-[11px] font-bold font-mono uppercase tracking-wider">
                    {biz.folderName}
                  </span>
                </div>
                <span className="text-xs font-bold text-white block truncate">
                  {biz.clientName}
                </span>
                <span className="text-[10px] text-zinc-400 block mt-0.5 truncate">
                  {biz.industryLabel.split('&')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Folder Directory Breakdown */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <FolderTree className="w-4 h-4 text-amber-400" />
              <span>C:\Users\HANI\Desktop\freelance\{currentConfig.folderName}\</span>
            </div>
            <button
              onClick={handleDownloadBusinessDataset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export {currentConfig.folderName} Dataset JSON</span>
            </button>
          </div>

          <div className="space-y-3 text-zinc-300">
            {/* Subfolder 1: Website */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <Globe className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">
                  {currentConfig.folderName}\{currentConfig.folderName}website\
                </p>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                  Responsive client storefront website with warm animated showcase, live cart drawer, and card checkout tailored specifically for {currentConfig.industryLabel.toLowerCase()}.
                </p>
              </div>
            </div>

            {/* Subfolder 2: Desktop App */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <Monitor className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">
                  {currentConfig.folderName}\{currentConfig.folderName}desktopapp\
                </p>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                  Native OS Desktop App ("Logiciel") for business owners to manipulate stock levels (+/-), adjust prices, check money revenue &amp; net margins, dispatch orders, and export executive PDF reports.
                </p>
              </div>
            </div>

            {/* Subfolder 3: Flask Backend */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <FileCode className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">
                  {currentConfig.folderName}\backend-flask\
                </p>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                  Python Flask REST API (<code className="text-amber-300">app.py</code>) + PyMongo connection to <code className="text-zinc-300">mongodb://localhost:27017/freelance_{currentConfig.id}</code>.
                </p>
              </div>
            </div>

            {/* Subfolder 4: MongoDB Dataset */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <Database className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">
                  {currentConfig.folderName}\mongodb-dataset\
                </p>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                  Complete collection seed dump with {products.length} products, {orders.length} orders, unit costs, pricing margins, and technical specs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* One-Click PowerShell Auto-Folder Creator */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>Auto-Generate All 5 Parent &amp; Sub-Folders in Windows PowerShell</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy('ps_script', powershellScript)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
              >
                {copiedKey === 'ps_script' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadPowerShellScript}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all shadow cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save .ps1 Script</span>
              </button>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans">
            Run this script in PowerShell to automatically generate the 5 parent folders (<code>glasses</code>, <code>clothes</code>, <code>food</code>, <code>electronics</code>, <code>phones</code>) with their respective <code>website</code> and <code>desktopapp</code> subdirectories inside <code className="text-zinc-200">C:\Users\HANI\Desktop\freelance\</code>!
          </p>
        </div>
      </div>
    </div>
  );
};
