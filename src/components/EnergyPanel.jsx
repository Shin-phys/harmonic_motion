import KatexMath from './KatexMath';
import { Slider, Toggle } from './PanelParts';

export default function EnergyPanel({ params, onParamsChange, showSegments, onShowSegmentsChange, showKCurve, onShowKCurveChange }) {
    const { m, k, A } = params;
    const E = 0.5 * k * A * A;
    const vmax = A * Math.sqrt(k / m);

    return (
        <div className="space-y-5">
            <div>
                <h3 className="step-title">
                    <span className="step-name">エネルギーを位置 x のグラフで見る</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    下のグラフの横軸は、上のおもりの位置 x とそろえてあります。
                    おもりの真下で、緑の長さが位置エネルギー U、紫の長さが運動エネルギー K です。
                </p>
            </div>

            <div className="space-y-3">
                <p className="section-header">条件を変える</p>
                <Slider label="ばね定数 k" value={k} min={5} max={40} step={1} display={`${k.toFixed(0)} N/m`}
                    onChange={(v) => onParamsChange({ ...params, k: v })} />
                <Slider label="振幅 A" value={A} min={0.05} max={0.25} step={0.01} display={`${(A * 100).toFixed(0)} cm`}
                    onChange={(v) => onParamsChange({ ...params, A: v })} />
                <Slider label="質量 m" value={m} min={0.5} max={2.0} step={0.1} display={`${m.toFixed(1)} kg`}
                    onChange={(v) => onParamsChange({ ...params, m: v })} />
            </div>

            <div className="toggle-group">
                <p className="section-header">表示</p>
                <Toggle on={showSegments} onClick={() => onShowSegmentsChange(!showSegments)} color="#10B981">
                    いまの位置での K と U
                </Toggle>
                <Toggle on={showKCurve} onClick={() => onShowKCurveChange(!showKCurve)} color="#8B5CF6">
                    K のグラフ（K = E − ½kx²）
                </Toggle>
            </div>

            <div className="formula-card space-y-2">
                <p className="formula-label">この条件では</p>
                <div className="text-sm text-slate-200"><KatexMath latex="\tfrac12 mv^2 + \tfrac12 kx^2 = \tfrac12 kA^2" /></div>
                <div className="flex justify-between text-sm text-slate-300">
                    <span>力学的エネルギー E</span><span className="font-mono text-amber-400">{E.toFixed(3)} J</span>
                </div>
                <div className="flex justify-between text-sm text-slate-300">
                    <span>最大の速さ（x = 0）</span><span className="font-mono text-blue-400">{vmax.toFixed(2)} m/s</span>
                </div>
            </div>

            <div className="explanation-box text-sm space-y-1.5">
                <p><strong>考えてみよう</strong></p>
                <p>・x = 0 では U と K はどうなっている？ x = ±A ではどう？</p>
                <p>・A を 2 倍にすると、E は何倍になる？</p>
                <p>・m を大きくすると、グラフのどこが変わり、どこが変わらない？（動きの速さにも注目）</p>
            </div>
        </div>
    );
}
