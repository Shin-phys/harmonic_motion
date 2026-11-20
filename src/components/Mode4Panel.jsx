import { MODE4 } from '../utils/physics';

/**
 * Mode 4: 操作パネル
 * 動摩擦係数スライダー、表示切替、リセット＆スタート
 */
const PRESETS = [0, 0.02, 0.05, 0.1, 0.15, 0.2, 0.25];

function Toggle({ on, onClick, color, rgb, children }) {
    return (
        <button
            type="button"
            className={`toggle-btn ${on ? 'active' : ''}`}
            onClick={onClick}
            aria-pressed={on}
            style={on ? { borderColor: `rgba(${rgb}, 0.3)`, background: `rgba(${rgb}, 0.08)` } : {}}
        >
            <span className="toggle-dot" style={on ? { background: color, boxShadow: `0 0 6px ${color}` } : {}} />
            {children}
        </button>
    );
}

export default function Mode4Panel({
    mu, onMuChange,
    showEquilibrium, onShowEquilibriumChange,
    showEnvelope, onShowEnvelopeChange,
    showEqPlot, onShowEqPlotChange,
    onResetAndStart,
}) {
    const { m, k, g, A0, muStaticExtra } = MODE4;
    const omega = Math.sqrt(k / m);
    const T = (2 * Math.PI) / omega;
    const shift = (mu * m * g) / k;

    return (
        <div className="space-y-5">
            {/* タイトル */}
            <div>
                <h3 className="step-title">
                    <span className="step-number">発展：</span>
                    <span className="step-name">摩擦のある振動</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    動摩擦のある水平面上のばね振り子を、摩擦がない場合とくらべます。
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
                        min="0" max="0.25" step="0.01"
                        value={mu}
                        aria-label="動摩擦係数"
                        onChange={(e) => onMuChange(parseFloat(e.target.value))}
                    />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {PRESETS.map((v) => (
                        <button
                            key={v}
                            type="button"
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
                <p className="formula-label">条件</p>
                <div className="space-y-1 text-sm text-slate-300">
                    {[
                        ['質量 m', `${m.toFixed(1)} kg`],
                        ['ばね定数 k', `${k.toFixed(1)} N/m`],
                        ['重力加速度 g', `${g.toFixed(1)} m/s²`],
                        ['はじめの変位', `${A0.toFixed(1)} m`],
                        ['角振動数 ω', `${omega.toFixed(2)} rad/s`],
                        ['周期 T', `${T.toFixed(2)} s`],
                        ["静止摩擦係数 μ", `${(mu + muStaticExtra).toFixed(2)}（μ' + ${muStaticExtra}）`],
                    ].map(([a, b]) => (
                        <div key={a} className="flex justify-between gap-2">
                            <span>{a}</span><span className="text-blue-400 font-mono whitespace-nowrap">{b}</span>
                        </div>
                    ))}
                    {mu > 0 && (
                        <div className="flex justify-between gap-2">
                            <span>振動の中心のずれ μ'mg/k</span>
                            <span className="font-mono whitespace-nowrap" style={{ color: '#10B981' }}>{shift.toFixed(3)} m</span>
                        </div>
                    )}
                </div>
            </div>

            {/* 表示切替 */}
            <div className="toggle-group">
                <p className="section-header">表示</p>
                <Toggle on={showEquilibrium} onClick={() => onShowEquilibriumChange(!showEquilibrium)} color="#10B981" rgb="16, 185, 129">
                    振動の中心の位置
                </Toggle>
                <Toggle on={showEnvelope} onClick={() => onShowEnvelopeChange(!showEnvelope)} color="#06B6D4" rgb="6, 182, 212">
                    振幅の減り方（包絡線）
                </Toggle>
                <Toggle on={showEqPlot} onClick={() => onShowEqPlotChange(!showEqPlot)} color="#10B981" rgb="16, 185, 129">
                    半周期ごとの振動の中心（▲）
                </Toggle>
            </div>

            <button type="button" className="btn btn-success w-full justify-center" onClick={onResetAndStart}>
                🔄 リセットしてスタート
            </button>

            {/* 解説 */}
            <div className="explanation-box text-sm space-y-1.5">
                <p><strong>振動の中心：</strong>動摩擦力 μ'mg は運動の向きと逆にはたらくので、半周期ごとに振動の中心が ±μ'mg/k だけずれます。</p>
                <p><strong>振幅の減り方：</strong>半周期ごとに 2μ'mg/k ずつ、<em>一定の割合ではなく一定の量</em>で（直線的に）減ります。</p>
                <p><strong>止まる条件：</strong>速度が 0 になった瞬間に、ばねの弾性力 k|x| が最大静止摩擦力 μmg 以下なら、そこで止まります。</p>
            </div>
        </div>
    );
}
