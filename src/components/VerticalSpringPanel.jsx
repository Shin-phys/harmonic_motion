import KatexMath from './KatexMath';
import { Slider, Toggle, StepGuide } from './PanelParts';

const G = 9.8;

const STEPS = [
    {
        name: '自然長',
        desc: 'おもりをつるす前のばねです。このときのばねの下端の位置を「自然長の位置」とします。',
    },
    {
        name: 'つるしてつり合い',
        desc: 'おもりをつるすと、ばねが d だけ伸びたところで止まります。',
        detail: 'このとき上向きの弾性力 kd と下向きの重力 mg がつり合っています。kd = mg より d = mg/k。',
    },
    {
        name: '引いて放す',
        desc: 'つり合いの位置から A だけ下に引いて放すと、つり合いの位置を中心に単振動します。自然長の位置が中心ではありません。',
        detail: 'つり合いの位置からの変位を y（下向き正）とすると、弾性力は k(d + y)（上向き）、重力は mg（下向き）。合力は mg − k(d + y) = −ky（kd = mg を使う）。比例定数は k のままなので T = 2π√(m/k)。「力を表示」で確かめよう。',
    },
    {
        name: '水平に置いたばねとくらべる',
        desc: '同じおもりとばねを水平に置いて、同じ振幅で振動させます。2 つの動きはぴったりそろいます。',
        detail: '重力は振動の中心を d = mg/k だけずらすだけで、周期を変えません。鉛直でも水平でも T = 2π√(m/k)。',
    },
];

export default function VerticalSpringPanel({
    step, onStepChange, params, onParamsChange, showForces, onShowForcesChange,
}) {
    const { m, k, A } = params;
    const d = (m * G) / k;
    const T = 2 * Math.PI * Math.sqrt(m / k);

    return (
        <div className="space-y-5">
            <StepGuide steps={STEPS} index={step} onChange={onStepChange} />

            <div className="space-y-3">
                <p className="section-header">条件を変える</p>
                <Slider label="質量 m" value={m} min={0.1} max={1.0} step={0.05} display={`${m.toFixed(2)} kg`}
                    onChange={(v) => onParamsChange({ ...params, m: v })} />
                <Slider label="ばね定数 k" value={k} min={10} max={40} step={1} display={`${k.toFixed(0)} N/m`}
                    onChange={(v) => onParamsChange({ ...params, k: v })} />
                <Slider label="振幅 A" value={A} min={0.05} max={0.2} step={0.01} display={`${(A * 100).toFixed(0)} cm`}
                    onChange={(v) => onParamsChange({ ...params, A: v })} />
            </div>

            {step >= 2 && (
                <Toggle on={showForces} onClick={() => onShowForcesChange(!showForces)} color="#EF4444">
                    力を表示（弾性力・重力・合力）
                </Toggle>
            )}

            <div className="formula-card space-y-2">
                <p className="formula-label">この条件では（g = 9.8 m/s²）</p>
                <div className="flex justify-between text-sm text-slate-300">
                    <span>つり合いの位置までの伸び d</span>
                    <span className="font-mono text-amber-400">{(d * 100).toFixed(1)} cm</span>
                </div>
                <div className="flex justify-between text-sm text-slate-300">
                    <span>周期 T</span>
                    <span className="font-mono text-blue-400">{T.toFixed(2)} s</span>
                </div>
                <div className="text-sm text-slate-200 pt-1">
                    <KatexMath latex="d = \frac{mg}{k},\qquad T = 2\pi\sqrt{\frac{m}{k}}" />
                </div>
                <p className="text-xs text-slate-400">
                    m を大きくすると d も T も大きくなりますが、g は T の式に入っていません。
                </p>
            </div>
        </div>
    );
}
