import React, { useState } from 'react';
import { 
  ArrowLeft, BarChart3, TrendingUp, Calendar, Download, Upload, 
  Trash2, AlertTriangle, Check, BookOpen, Clock, Star 
} from 'lucide-react';
import { SessionRecord } from '../types';
import { clearAllData, exportDataAsJson, importDataFromJson } from '../utils/storage';
import { sound } from '../utils/audio';

interface StatsScreenProps {
  sessions: SessionRecord[];
  onBack: () => void;
  onRefreshData: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({
  sessions,
  onBack,
  onRefreshData
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState<boolean>(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // Compute stats
  const totalSessions = sessions.length;
  const avgR2 = totalSessions > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.r2, 0) / totalSessions) 
    : 0;
  const maxR2 = totalSessions > 0 
    ? Math.max(...sessions.map(s => s.r2)) 
    : 0;
  const totalGain = sessions.filter(s => s.diff > 0).length;

  const handleExport = () => {
    sound.playPop();
    const jsonStr = exportDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leseflyt-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importDataFromJson(content);
        setImportMessage(result.message);
        if (result.success) {
          sound.playSuccessChime();
          onRefreshData();
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    clearAllData();
    setShowConfirmClear(false);
    sound.playPop();
    onRefreshData();
  };

  // SVG Chart points calculation
  const chartHeight = 180;
  const chartWidth = 600;
  const padding = 35;

  const maxVal = Math.max(100, ...sessions.map(s => Math.max(s.r1, s.r2, 0))) + 15;
  const minVal = 0;

  const getX = (index: number) => {
    if (sessions.length <= 1) return chartWidth / 2;
    return padding + (index / (sessions.length - 1)) * (chartWidth - padding * 2);
  };

  const getY = (val: number) => {
    return chartHeight - padding - (val / maxVal) * (chartHeight - padding * 2);
  };

  // Path strings
  const r1Points = sessions.map((s, idx) => `${getX(idx)},${getY(s.r1)}`).join(' ');
  const r2Points = sessions.map((s, idx) => `${getX(idx)},${getY(s.r2)}`).join(' ');

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-white/80 hover:bg-white border border-slate-200/80 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tilbake til forside</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Export button */}
          <button
            type="button"
            onClick={handleExport}
            className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Last ned sikkerhetskopi av data"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Eksporter</span>
          </button>

          {/* Import button */}
          <label className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Importer</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {importMessage && (
        <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-between">
          <span>{importMessage}</span>
          <button
            type="button"
            onClick={() => setImportMessage(null)}
            className="text-blue-600 hover:underline"
          >
            Lukk
          </button>
        </div>
      )}

      {/* Main card */}
      <div className="rounded-3xl bg-white/95 p-5 sm:p-7 border border-white/80 shadow-xl shadow-slate-900/5 backdrop-blur-md space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-teal-600 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Historikk og utvikling</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Lesekurve og statistikk
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Se hvordan lesehastigheten og repetert lesing utvikler seg over tid.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 border border-blue-100 text-center">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Gjennomsnitt (2. runde)
            </span>
            <div className="text-3xl font-black text-blue-950 mt-1">{avgR2}</div>
            <span className="text-[10px] text-blue-600 font-semibold">ord/min</span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50/40 border border-teal-100 text-center">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Beste tempo
            </span>
            <div className="text-3xl font-black text-teal-950 mt-1">{maxR2}</div>
            <span className="text-[10px] text-teal-600 font-semibold">ord/min</span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-100 text-center">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Fullførte økter
            </span>
            <div className="text-3xl font-black text-amber-950 mt-1">{totalSessions}</div>
            <span className="text-[10px] text-amber-600 font-semibold">totalt</span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/40 border border-purple-100 text-center">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
              Økter med økning
            </span>
            <div className="text-3xl font-black text-purple-950 mt-1">{totalGain}</div>
            <span className="text-[10px] text-purple-600 font-semibold">i 2. runde</span>
          </div>
        </div>

        {/* Chart View */}
        <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700">
              Lesehastighet per økt (ord/minutt)
            </span>
            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />
                <span className="text-slate-600">1. runde</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
                <span className="text-teal-900 font-bold">2. runde</span>
              </div>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs font-medium">
              <BookOpen className="w-8 h-8 stroke-1 text-slate-300 mb-1" />
              <span>Ingen økter er registrert ennå.</span>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 select-none">
                {/* Background grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = padding + ratio * (chartHeight - padding * 2);
                  const val = Math.round(maxVal * (1 - ratio));
                  return (
                    <g key={i}>
                      <line
                        x1={padding}
                        y1={y}
                        x2={chartWidth - padding}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={padding - 6}
                        y={y + 3}
                        fontSize="9"
                        fill="#94a3b8"
                        textAnchor="end"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Round 1 Line (Blue) */}
                {sessions.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    points={r1Points}
                  />
                )}

                {/* Round 2 Line (Teal) */}
                {sessions.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="3.5"
                    points={r2Points}
                  />
                )}

                {/* Points on lines */}
                {sessions.map((s, idx) => {
                  const x = getX(idx);
                  const y1 = getY(s.r1);
                  const y2 = getY(s.r2);

                  return (
                    <g key={idx}>
                      {/* Round 1 dot */}
                      <circle cx={x} cy={y1} r="3.5" fill="#60a5fa" stroke="#fff" strokeWidth="1.5" />
                      {/* Round 2 dot */}
                      <circle cx={x} cy={y2} r="5" fill="#0d9488" stroke="#fff" strokeWidth="2" />
                      <text
                        x={x}
                        y={y2 - 8}
                        fontSize="10"
                        fontWeight="bold"
                        fill="#0f172a"
                        textAnchor="middle"
                      >
                        {s.r2}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          <p className="text-[11px] text-slate-500 text-center font-medium">
            Grafen viser framgang i ord per minutt. Målet er mestring og trygghet, ikke å slå rekord hver eneste gang.
          </p>
        </div>

        {/* History Table */}
        {sessions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800">
              Siste økter
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Dato</th>
                    <th className="p-3">Tekst</th>
                    <th className="p-3 text-center">1. runde</th>
                    <th className="p-3 text-center">2. runde</th>
                    <th className="p-3 text-center">Endring</th>
                    <th className="p-3 text-right">Poeng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {[...sessions].reverse().slice(0, 15).map((session, idx) => (
                    <tr key={session.id || idx} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        {session.date ? new Date(session.date).toLocaleDateString('no-NO') : '-'}
                      </td>
                      <td className="p-3 font-semibold text-slate-800 max-w-[160px] truncate">
                        {session.title}
                      </td>
                      <td className="p-3 text-center text-slate-600 font-medium">
                        {session.r1} o/m
                      </td>
                      <td className="p-3 text-center font-bold text-teal-900">
                        {session.r2} o/m
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md ${
                            session.diff > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : session.diff === 0
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {session.diff > 0 ? `+${session.diff}` : session.diff}
                        </span>
                      </td>
                      <td className="p-3 text-right font-black text-amber-700">
                        +{session.points}p
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clear Data Option */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Lagret lokalt i nettleseren
          </span>

          {!showConfirmClear ? (
            <button
              type="button"
              onClick={() => setShowConfirmClear(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Nullstill all data</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-700 font-bold">Er du helt sikker?</span>
              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold cursor-pointer"
              >
                Ja, slett
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Avbryt
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
