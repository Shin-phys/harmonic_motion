/**
 * Mode 4: 操作パネル
 * 摩擦係数スライダー、表示切替、リセット＆スタート
 */
export default function Mode4Panel({
    mu, onMuChange,
    showEquilibrium, onShowEquilibriumChange,
    showEnvelope, onShowEnvelopeChange,
    showEqPlot, onShowEqPlotChange,
    onResetAndStart,
}) {
    const m = 1.0, k = 10.0, g = 4.0;
    const omega = Math.sqrt(k / m);
    const T = (2 * Math.PI) / omega;
    const eqDisp = mu > 0 ? (mu * m * g / k).toFixed(3) : '0';

    return (
        <div className="space-y-5">
            {/* タイトル */}
            <div>
                <h3 className="step-title">
                    <span className="step-number">Mode 4:</span>
                    <span className="step-name">摩擦のある振動</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    動摩擦のある水平面上でのバネ振動を、摩擦なしの場合と比較します。
                </p>
            </div>

            {/* μ' スライダー */}
            <div>
                <p className="section-header">動摩擦係数 μ'</p>
                <div className="slider-container">
                    <div className="slider-label">
                        <span>μ'</span>
                        <span className="slider-value">{mu.toFixed(2)}</span>
                    </div>
                    <input
                        type="range"
                        min="0" max="0.5" step="0.01"
                        value={mu}
                        onChange={(e) => onMuChange(parseFloat(e.target.value))}
                    />
                </div>
                {/* プリセット */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {[0, 0.05, 0.1, 0.2, 0.3, 0.5].map((v) => (
                        <button
                            key={v}
                            className={`phase-btn ${Math.abs(mu - v) < 0.005 ? 'active' : ''}`}
                            onClick={() => onMuChange(v)}
                        >
                            {v === 0 ? '0' : v.toFixed(2)}
                        </button>
                    ))}
                </div>
            </div>

            {/* パラメータ情報 */}
            <div className="formula-card">
                <p className="formula-label">シミュレーション パラメータ</p>
                <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                        <span>質量 m</span><span className="text-blue-400 font-mono">{m.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between">
                        <span>バネ定数 k</span><span className="text-blue-400 font-mono">{k.toFixed(1)} N/m</span>
                    </div>
                    <div className="flex justify-between">
                        <span>角振動数 ω</span><span className="text-blue-400 font-mono">{omega.toFixed(2)} rad/s</span>
                    </div>
                    <div className="flex justify-between">
                        <span>周期 T</span><span className="text-blue-400 font-mono">{T.toFixed(2)} s</span>
                    </div>
                    {mu > 0 && (
                        <div className="flex justify-between">
                            <span>平衡点のずれ μ'mg/k</span>
                            <span className="font-mono" style={{ color: '#10B981' }}>{eqDisp} m</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 表示切替 */}
            <div className="toggle-group">
                <p className="section-header">解析ツール</p>

                <button
                    className={`toggle-btn ${showEquilibrium ? 'active' : ''}`}
                    onClick={() => onShowEquilibriumChange(!showEquilibrium)}
                    style={showEquilibrium ? { borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.08)' } : {}}
                >
                    <span className="toggle-dot" style={showEquilibrium ? { background: '#10B981', boxShadow: '0 0 6px #10B981' } : {}} />
                    動的平衡点ライン
                </button>

                <button
                    className={`toggle-btn ${showEnvelope ? 'active' : ''}`}
                    onClick={() => onShowEnvelopeChange(!showEnvelope)}
                    style={showEnvelope ? { borderColor: 'rgba(6, 182, 212, 0.3)', background: 'rgba(6, 182, 212, 0.08)' } : {}}
                >
                    <span className="toggle-dot" style={showEnvelope ? { background: '#06B6D4', boxShadow: '0 0 6px #06B6D4' } : {}} />
                    包絡線（エンベロープ）
                </button>

                <button
                    className={`toggle-btn ${showEqPlot ? 'active' : ''}`}
                    onClick={() => onShowEqPlotChange(!showEqPlot)}
                    style={showEqPlot ? { borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.08)' } : {}}
                >
                    <span className="toggle-dot" style={showEqPlot ? { background: '#10B981', boxShadow: '0 0 6px #10B981' } : {}} />
                    平衡点プロット（▲マーク）
                </button>
            </div>

            {/* リセット＆スタート */}
            <button
                className="btn btn-success w-full"
                onClick={onResetAndStart}
            >
                🔄 リセット＆スタート
            </button>

            {/* 解説 */}
            <div className="explanation-box text-xs">
                <p className="mb-1"><strong>停止条件:</strong> 速度反転時に |kx| ≤ (μ'+0.05)mg なら停止</p>
                <p className="mb-1"><strong>包絡線:</strong> 動摩擦では振幅が<em>直線的に</em>減衰します</p>
                <p><strong>平衡点:</strong> 速度の向きで ±μ'mg/k に交互にシフトします</p>
            </div>
        </div>
    );
}
