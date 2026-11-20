import { useMemo } from 'react';
import KatexMath from './KatexMath';
import { formatPhase } from '../utils/physics';

/**
 * Mode 3: 操作パネル
 * 2つのばね振り子のパラメータ調整、ロック機能、位相差
 */

function periodOf(spring) {
    const w = Math.sqrt(spring.k / spring.m);
    const T = (2 * Math.PI) / w;
    return { w, T, f: 1 / T };
}

/**
 * 1つのばね振り子のスライダー群
 * （親の中で定義すると、値が変わるたびに作り直されてドラッグが途切れるため、外に置く）
 */
function SpringSliders({ spring, springNum, color, locked, onParam }) {
    const calc = useMemo(() => periodOf(spring), [spring]);
    return (
        <div className="p-3 rounded-lg border" style={{ background: 'rgba(0,0,0,0.2)', borderColor: `${color}33` }}>
            <h4 className="text-sm font-semibold mb-3" style={{ color }}>
                ばね振り子 {springNum}
            </h4>

            <div className="slider-container mb-3">
                <div className="slider-label">
                    <span className="flex items-center gap-1">
                        質量 m
                        {locked === 'm' && <span className="text-amber-400 text-xs">🔒</span>}
                    </span>
                    <span className="slider-value">{spring.m.toFixed(1)} kg</span>
                </div>
                <input
                    type="range" min="0.1" max="5" step="0.1"
                    value={spring.m}
                    aria-label={`ばね振り子${springNum}の質量`}
                    onChange={(e) => onParam(springNum, 'm', parseFloat(e.target.value))}
                />
            </div>

            <div className="slider-container mb-3">
                <div className="slider-label">
                    <span className="flex items-center gap-1">
                        ばね定数 k
                        {locked === 'k' && <span className="text-amber-400 text-xs">🔒</span>}
                    </span>
                    <span className="slider-value">{spring.k.toFixed(1)} N/m</span>
                </div>
                <input
                    type="range" min="0.5" max="20" step="0.5"
                    value={spring.k}
                    aria-label={`ばね振り子${springNum}のばね定数`}
                    onChange={(e) => onParam(springNum, 'k', parseFloat(e.target.value))}
                />
            </div>

            <div className="slider-container mb-3">
                <div className="slider-label">
                    <span>振幅 A</span>
                    <span className="slider-value">{(spring.A / 10).toFixed(1)} cm</span>
                </div>
                <input
                    type="range" min="20" max="80" step="5"
                    value={spring.A}
                    aria-label={`ばね振り子${springNum}の振幅`}
                    onChange={(e) => onParam(springNum, 'A', parseFloat(e.target.value))}
                />
            </div>

            <div className="mt-2 text-sm text-slate-300 space-y-1">
                <div><KatexMath latex={`T = 2\\pi\\sqrt{\\frac{m}{k}} = ${calc.T.toFixed(2)}\\ \\text{s}`} /></div>
                <div><KatexMath latex={`f = \\frac{1}{T} = ${calc.f.toFixed(2)}\\ \\text{Hz}`} /></div>
            </div>
        </div>
    );
}

export default function Mode3Panel({
    spring1, spring2,
    onSpring1Change, onSpring2Change,
    locked, onLockedChange,
    phaseDiffEnabled, onPhaseDiffEnabledChange,
    phaseDiff, onPhaseDiffChange,
}) {
    const sameT = Math.abs(periodOf(spring1).T - periodOf(spring2).T) < 1e-6;

    // パラメータ変更（ロック中は両方そろえる）
    const handleParam = (springNum, param, value) => {
        if (springNum === 1) {
            onSpring1Change({ ...spring1, [param]: value });
            if (locked === param) onSpring2Change({ ...spring2, [param]: value });
        } else {
            onSpring2Change({ ...spring2, [param]: value });
            if (locked === param) onSpring1Change({ ...spring1, [param]: value });
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-blue-400 mb-2">パラメータをそろえる</h3>
                <div className="flex gap-1 flex-wrap">
                    {[
                        { key: null, label: 'なし' },
                        { key: 'm', label: '質量 m' },
                        { key: 'k', label: 'ばね定数 k' },
                    ].map(({ key, label }) => (
                        <button
                            key={label}
                            type="button"
                            className={`lock-toggle ${locked === key ? 'locked' : ''}`}
                            onClick={() => onLockedChange(key)}
                        >
                            {locked === key ? '🔒' : '🔓'} {label}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                    そろえた量は、片方を動かすともう片方も同じ値になります。
                </p>
            </div>

            <SpringSliders spring={spring1} springNum={1} color="#3B82F6" locked={locked} onParam={handleParam} />
            <SpringSliders spring={spring2} springNum={2} color="#F59E0B" locked={locked} onParam={handleParam} />

            {/* 位相差 */}
            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                        type="checkbox"
                        checked={phaseDiffEnabled}
                        onChange={(e) => onPhaseDiffEnabledChange(e.target.checked)}
                        className="w-4 h-4 rounded accent-blue-500"
                    />
                    <span className="text-sm text-slate-300">ばね振り子 2 の位相をずらす</span>
                </label>

                {phaseDiffEnabled && (
                    <div className="slider-container fade-in">
                        <div className="slider-label">
                            <span>位相差</span>
                            <span className="slider-value">{formatPhase(phaseDiff)}</span>
                        </div>
                        <input
                            type="range" min="0" max={2 * Math.PI} step={Math.PI / 12}
                            value={phaseDiff}
                            aria-label="位相差"
                            onChange={(e) => onPhaseDiffChange(parseFloat(e.target.value))}
                        />
                        {!sameT && (
                            <p className="text-xs text-amber-300 mt-1">
                                周期が異なると、位相差は時間とともに変わっていきます。m と k をそろえて比べよう。
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="explanation-box text-sm space-y-1.5">
                <p><strong>周期を決めるもの：</strong>周期は質量 m とばね定数 k だけで決まります。</p>
                <div><KatexMath latex="T = 2\pi\sqrt{\frac{m}{k}}" /></div>
                <p><strong>等時性：</strong>振幅 A を変えても周期 T は変わりません。2 つの振幅だけを変えて確かめてみよう。</p>
            </div>
        </div>
    );
}
