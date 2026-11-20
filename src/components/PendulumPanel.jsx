import KatexMath from './KatexMath';
import { Slider, Toggle } from './PanelParts';
import { pendulumPeriods } from '../utils/physics';

const GRAVITY = [
    { label: '地球', g: 9.8 },
    { label: '月', g: 1.6 },
];

export default function PendulumPanel({ params, onParamsChange, showApprox, onShowApproxChange, showForces, onShowForcesChange }) {
    const { L, m, theta0, g } = params;
    const deg = Math.round((theta0 * 180) / Math.PI);
    const { T0, T, ratio } = pendulumPeriods(L, g, theta0);

    return (
        <div className="space-y-5">
            <div>
                <h3 className="step-title"><span className="step-name">単振り子</span></h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    長さ L の糸におもりをつけ、振れ角 θ₀ から静かに放します。
                    実際の振り子（青）と、単振動とみなした動き（黄の点線）をくらべよう。
                </p>
            </div>

            <div className="space-y-3">
                <p className="section-header">条件を変える</p>
                <Slider label="糸の長さ L" value={L} min={0.2} max={2.0} step={0.05} display={`${L.toFixed(2)} m`}
                    onChange={(v) => onParamsChange({ ...params, L: v })} />
                <Slider label="おもりの質量 m" value={m} min={0.1} max={2.0} step={0.1} display={`${m.toFixed(1)} kg`}
                    onChange={(v) => onParamsChange({ ...params, m: v })} />
                <Slider label="振れ角 θ₀" value={deg} min={5} max={80} step={5} display={`${deg}°`}
                    onChange={(v) => onParamsChange({ ...params, theta0: (v * Math.PI) / 180 })} />
                <div>
                    <div className="slider-label mb-1.5"><span>重力加速度 g</span></div>
                    <div className="flex gap-1.5">
                        {GRAVITY.map((x) => (
                            <button key={x.label} type="button"
                                className={`phase-btn flex-1 ${Math.abs(g - x.g) < 1e-9 ? 'active' : ''}`}
                                onClick={() => onParamsChange({ ...params, g: x.g })}>
                                {x.label}（{x.g} m/s²）
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="toggle-group">
                <p className="section-header">表示</p>
                <Toggle on={showApprox} onClick={() => onShowApproxChange(!showApprox)} color="#F59E0B">
                    単振動とみなした動き（点線）
                </Toggle>
                <Toggle on={showForces} onClick={() => onShowForcesChange(!showForces)} color="#EF4444">
                    力を表示（重力・張力・復元力）
                </Toggle>
            </div>

            <div className="formula-card space-y-2">
                <p className="formula-label">周期</p>
                <div className="text-sm text-slate-200"><KatexMath latex="T_0 = 2\pi\sqrt{\frac{L}{g}}" /></div>
                <div className="flex justify-between text-sm text-slate-300">
                    <span>単振動とみなした周期 T₀</span><span className="font-mono text-amber-400">{T0.toFixed(3)} s</span>
                </div>
                <div className="flex justify-between text-sm text-slate-300">
                    <span>振れ角 {deg}° での周期 T</span><span className="font-mono text-blue-400">{T.toFixed(3)} s</span>
                </div>
                <p className="text-xs text-slate-400">T は T₀ より {((ratio - 1) * 100).toFixed(1)} % 長い</p>
            </div>

            <div className="explanation-box text-sm space-y-1.5">
                <p><strong>なぜ単振動とみなせる？</strong></p>
                <p>
                    おもりを戻そうとする力は重力の接線方向の成分 −mg sin θ。
                    θ が小さいと sin θ ≈ θ、弧の長さ x = Lθ なので
                </p>
                <div><KatexMath latex="F \approx -mg\theta = -\frac{mg}{L}x" /></div>
                <p>ばね定数 k = mg/L の単振動と同じ形になり、T₀ = 2π√(L/g) が得られます。</p>
                <p className="pt-1"><strong>確かめよう</strong></p>
                <p>・m を変えても周期は変わる？</p>
                <p>・θ₀ が小さいとき（5°〜15°）と大きいとき（60°〜80°）で、青と黄の線のずれ方は？</p>
                <p>・振れ角が小さいときは周期が振幅によらない（等時性）。Mode 3 のばね振り子とくらべよう。</p>
            </div>
        </div>
    );
}
