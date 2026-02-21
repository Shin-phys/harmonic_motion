import { useState, useCallback } from 'react';
import GlobalControls from './components/GlobalControls';
import Mode1Canvas from './components/Mode1Canvas';
import Mode1Panel from './components/Mode1Panel';
import Mode2Canvas from './components/Mode2Canvas';
import Mode2Panel from './components/Mode2Panel';
import Mode3Canvas from './components/Mode3Canvas';
import Mode3Panel from './components/Mode3Panel';
import Mode4Canvas from './components/Mode4Canvas';
import Mode4Panel from './components/Mode4Panel';

/**
 * 単振動シミュレータ メインアプリケーション
 * 3つのモードを切り替えて学習
 */
export default function App() {
  // ========== グローバル状態 ==========
  const [mode, setMode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);
  const [resetKey, setResetKey] = useState(0);

  // ========== Mode 1 状態 ==========
  const [step, setStep] = useState(1);
  const [showVectorsMode1, setShowVectorsMode1] = useState(false);
  const [showYtGraph, setShowYtGraph] = useState(true);
  const [showVtGraph, setShowVtGraph] = useState(false);
  const [showAtGraph, setShowAtGraph] = useState(false);

  // ========== Mode 2 状態 ==========
  const [phi, setPhi] = useState(Math.PI / 2);
  const [showVectors, setShowVectors] = useState(false);
  const [graphType, setGraphType] = useState('y');

  // ========== Mode 3 状態 ==========
  const [spring1, setSpring1] = useState({ m: 1.0, k: 4.0, A: 60, phi: 0 });
  const [spring2, setSpring2] = useState({ m: 2.0, k: 4.0, A: 60, phi: 0 });
  const [locked, setLocked] = useState(null);
  const [phaseDiffEnabled, setPhaseDiffEnabled] = useState(false);
  const [phaseDiff, setPhaseDiff] = useState(0);

  // ========== Mode 4 状態 ==========
  const [mu, setMu] = useState(0.1);
  const [showEquilibrium, setShowEquilibrium] = useState(true);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [showEqPlot, setShowEqPlot] = useState(false);

  // ========== ハンドラ ==========
  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1);
    setIsPlaying(false);
  }, []);

  const handlePlayPause = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const handleResetAndStart = useCallback(() => {
    setResetKey((k) => k + 1);
    setIsPlaying(true);
  }, []);

  const handleModeChange = useCallback((newMode) => {
    setMode(newMode);
    setResetKey((k) => k + 1);
    setIsPlaying(false);
  }, []);

  const updateParams = (updater) => {
    updater();
    setResetKey((k) => k + 1);
    setIsPlaying(false);
  };

  // モードタブ定義
  const modes = [
    { id: 1, label: 'Mode 1', title: '円運動から単振動へ', icon: '🔵' },
    { id: 2, label: 'Mode 2', title: '位相と式の理解', icon: '📐' },
    { id: 3, label: 'Mode 3', title: '二つの振動の比較', icon: '🔗' },
    { id: 4, label: 'Mode 4', title: '摩擦のある振動', icon: '🔥' },
  ];

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #0B0F19 0%, #111827 40%, #0F172A 70%, #0B0F19 100%)' }}>

      {/* ========== ヘッダー ========== */}
      <header className="app-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="app-title">
              ⚛ 単振動シミュレータ
            </h1>
            <p className="app-subtitle">
              Simple Harmonic Motion — Interactive Simulator
            </p>
          </div>
          <GlobalControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            speedMultiplier={speedMultiplier}
            onSpeedChange={setSpeedMultiplier}
          />
        </div>
      </header>

      {/* ========== モードタブ ========== */}
      <nav className="mode-tabs">
        <div className="max-w-7xl mx-auto flex w-full">
          {modes.map((m) => (
            <button
              key={m.id}
              id={`mode-tab-${m.id}`}
              className={`mode-tab ${mode === m.id ? 'active' : ''}`}
              onClick={() => handleModeChange(m.id)}
            >
              <span className="mode-label">{m.label}</span>
              {m.title}
            </button>
          ))}
        </div>
      </nav>

      {/* ========== メインコンテンツ ========== */}
      <main className="flex-1 px-6 py-5">
        <div className="max-w-7xl mx-auto app-layout flex gap-5" style={{ minHeight: '520px' }}>

          {/* 左側: Canvas */}
          <div className="flex-1 min-w-0">
            {mode === 1 && (
              <Mode1Canvas
                key={`m1-${resetKey}`}
                step={step}
                isPlaying={isPlaying}
                speedMultiplier={speedMultiplier}
                showVectors={showVectorsMode1}
                showYtGraph={showYtGraph}
                showVtGraph={showVtGraph}
                showAtGraph={showAtGraph}
                onTimeUpdate={() => { }}
              />
            )}
            {mode === 2 && (
              <Mode2Canvas
                key={`m2-${resetKey}`}
                isPlaying={isPlaying}
                speedMultiplier={speedMultiplier}
                phi={phi}
                amplitude={80}
                omega={2.0}
                showVectors={showVectors}
                graphType={graphType}
                onTimeUpdate={() => { }}
              />
            )}
            {mode === 3 && (
              <Mode3Canvas
                key={`m3-${resetKey}`}
                isPlaying={isPlaying}
                speedMultiplier={speedMultiplier}
                spring1={spring1}
                spring2={spring2}
                phaseDiffEnabled={phaseDiffEnabled}
                phaseDiff={phaseDiff}
                onTimeUpdate={() => { }}
              />
            )}
            {mode === 4 && (
              <Mode4Canvas
                key={`m4-${resetKey}`}
                isPlaying={isPlaying}
                speedMultiplier={speedMultiplier}
                mu={mu}
                showEquilibrium={showEquilibrium}
                showEnvelope={showEnvelope}
                showEqPlot={showEqPlot}
                onTimeUpdate={() => { }}
              />
            )}
          </div>

          {/* 右側: 操作パネル */}
          <div className="w-80 flex-shrink-0">
            <div className="control-panel sticky top-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              {mode === 1 && (
                <Mode1Panel
                  step={step}
                  onStepChange={setStep}
                  showVectors={showVectorsMode1}
                  onShowVectorsChange={setShowVectorsMode1}
                  showYtGraph={showYtGraph}
                  onShowYtGraphChange={setShowYtGraph}
                  showVtGraph={showVtGraph}
                  onShowVtGraphChange={setShowVtGraph}
                  showAtGraph={showAtGraph}
                  onShowAtGraphChange={setShowAtGraph}
                />
              )}
              {mode === 2 && (
                <Mode2Panel
                  phi={phi}
                  onPhiChange={(val) => updateParams(() => setPhi(val))}
                  showVectors={showVectors}
                  onShowVectorsChange={setShowVectors}
                  graphType={graphType}
                  onGraphTypeChange={setGraphType}
                />
              )}
              {mode === 3 && (
                <Mode3Panel
                  spring1={spring1}
                  spring2={spring2}
                  onSpring1Change={(val) => updateParams(() => setSpring1(val))}
                  onSpring2Change={(val) => updateParams(() => setSpring2(val))}
                  locked={locked}
                  onLockedChange={setLocked}
                  phaseDiffEnabled={phaseDiffEnabled}
                  onPhaseDiffEnabledChange={(val) => updateParams(() => setPhaseDiffEnabled(val))}
                  phaseDiff={phaseDiff}
                  onPhaseDiffChange={(val) => updateParams(() => setPhaseDiff(val))}
                />
              )}
              {mode === 4 && (
                <Mode4Panel
                  mu={mu}
                  onMuChange={(val) => updateParams(() => setMu(val))}
                  showEquilibrium={showEquilibrium}
                  onShowEquilibriumChange={setShowEquilibrium}
                  showEnvelope={showEnvelope}
                  onShowEnvelopeChange={setShowEnvelope}
                  showEqPlot={showEqPlot}
                  onShowEqPlotChange={setShowEqPlot}
                  onResetAndStart={handleResetAndStart}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ========== フッター ========== */}
      <footer className="app-footer">
        高校物理「単振動」教育シミュレータ — 数式とアニメーションの完全同期
      </footer>
    </div>
  );
}
