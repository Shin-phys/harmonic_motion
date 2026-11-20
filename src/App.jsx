import { useState, useCallback } from 'react';
import GlobalControls from './components/GlobalControls';
import CanvasFrame from './components/CanvasFrame';
import Mode1Canvas from './components/Mode1Canvas';
import Mode1Panel from './components/Mode1Panel';
import Mode2Canvas from './components/Mode2Canvas';
import Mode2Panel from './components/Mode2Panel';
import Mode3Canvas from './components/Mode3Canvas';
import Mode3Panel from './components/Mode3Panel';
import Mode4Canvas from './components/Mode4Canvas';
import Mode4Panel from './components/Mode4Panel';
import { useLayoutMode } from './hooks/useLayout';

// モードの定義（aspect は図の縦横比：Mode 1・2 は 800×500、Mode 3・4 は 800×560）
const MODES = [
    { id: 1, label: 'Mode 1', title: '円運動から単振動へ', short: '円運動→単振動', aspect: 800 / 500 },
    { id: 2, label: 'Mode 2', title: '位相と式の理解', short: '位相と式', aspect: 800 / 500 },
    { id: 3, label: 'Mode 3', title: '二つの振動の比較', short: '振動の比較', aspect: 800 / 560 },
    { id: 4, label: 'Mode 4', title: '摩擦のある振動', short: '摩擦あり', aspect: 800 / 560 },
];

/**
 * 単振動シミュレータ メインアプリケーション
 *  PC：図と操作パネルを左右に並べ、スクロールせずに使える1画面の配置
 *  スマホ縦：図の下にパネル、再生ボタンは画面下に固定
 *  スマホ横：図と操作パネルを左右に並べる
 */
export default function App() {
    const layout = useLayoutMode();

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

    const current = MODES.find((m) => m.id === mode);
    const controls = (variant) => (
        <GlobalControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            speedMultiplier={speedMultiplier}
            onSpeedChange={setSpeedMultiplier}
            variant={variant}
        />
    );

    // ========== 図 ==========
    const canvas = (
        <>
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
                />
            )}
        </>
    );

    // ========== 操作パネル ==========
    const panel = (
        <>
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
        </>
    );

    const tabs = (
        <nav className="mode-tabs" aria-label="モード切り替え">
            <div className={`flex w-full ${layout === 'wide' ? '' : 'overflow-x-auto'}`}>
                {MODES.map((m) => (
                    <button
                        key={m.id}
                        id={`mode-tab-${m.id}`}
                        type="button"
                        aria-current={mode === m.id ? 'page' : undefined}
                        className={`mode-tab whitespace-nowrap ${mode === m.id ? 'active' : ''}`}
                        onClick={() => handleModeChange(m.id)}
                    >
                        <span className="mode-label">{layout === 'wide' ? m.label : m.id}</span>
                        {layout === 'wide' ? m.title : m.short}
                    </button>
                ))}
            </div>
        </nav>
    );

    const background = { background: 'linear-gradient(160deg, #0B0F19 0%, #111827 40%, #0F172A 70%, #0B0F19 100%)' };

    // ---------- PC ----------
    if (layout === 'wide') {
        return (
            <div className="h-[100dvh] min-h-[600px] flex flex-col" style={background}>
                <header className="app-header">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="app-title">⚛ 単振動シミュレータ</h1>
                            <p className="app-subtitle">高校物理「単振動」— 円運動との関係からばね振動まで</p>
                        </div>
                        {controls('header')}
                    </div>
                </header>
                {tabs}
                <main className="flex-1 min-h-0 flex gap-4 p-4">
                    <div className="flex-1 min-w-0 min-h-0 flex flex-col">
                        <CanvasFrame aspect={current.aspect} fit>{canvas}</CanvasFrame>
                    </div>
                    <aside className="relative w-[340px] shrink-0 min-h-0 control-panel overflow-y-auto">{panel}</aside>
                </main>
            </div>
        );
    }

    // ---------- スマホ横向き ----------
    if (layout === 'landscape') {
        return (
            <div className="h-[100dvh] flex flex-col" style={background}>
                {tabs}
                <main className="flex-1 min-h-0 flex gap-2 p-2">
                    <div className="flex-1 min-w-0 min-h-0 flex flex-col">
                        <CanvasFrame aspect={current.aspect} fit>{canvas}</CanvasFrame>
                    </div>
                    <aside className="w-[min(380px,45vw)] shrink-0 min-h-0 flex flex-col gap-2">
                        <div className="shrink-0">{controls('bar')}</div>
                        <div className="relative flex-1 min-h-0 overflow-y-auto control-panel">{panel}</div>
                    </aside>
                </main>
            </div>
        );
    }

    // ---------- スマホ縦向き・タブレット縦向き ----------
    return (
        <div className="h-[100dvh] flex flex-col" style={background}>
            <header className="px-3 pt-2">
                <h1 className="app-title">⚛ 単振動シミュレータ</h1>
            </header>
            {tabs}
            <div className="shrink-0 px-2 pt-2">
                <CanvasFrame aspect={current.aspect} fit={false}>{canvas}</CanvasFrame>
            </div>
            <main className="relative flex-1 min-h-0 overflow-y-auto p-2">
                <div className="control-panel">{panel}</div>
            </main>
            <div className="shrink-0 border-t border-slate-700/60 bg-slate-900/95 px-3 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
                {controls('bar')}
            </div>
        </div>
    );
}
