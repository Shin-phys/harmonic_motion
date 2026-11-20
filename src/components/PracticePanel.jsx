import { useState } from 'react';
import { PHI_BASIC, PHI_ALL, gradePractice, newPracticeState, formulaText } from '../utils/practice';

const HINTS = {
    A: '振幅 A は、中心（y = 0）から山の頂上までの高さです。',
    T: '周期 T は、同じ状態にもどるまでの時間です。山から次の山まで（または谷から次の谷まで）の時間を読もう。',
    phi: 't = 0 の点（黄色）に注目。y(0) = A sin φ と、そこから上に動くか下に動くかで φ が決まります。',
};

function Mark({ ok }) {
    return <span className={`ml-2 text-sm font-semibold ${ok ? 'text-emerald-400' : 'text-rose-400'}`}>{ok ? '✓ 正解' : '✗'}</span>;
}

export default function PracticePanel({ state, onChange }) {
    const [showHint, setShowHint] = useState(false);
    const phis = state.level === 'advanced' ? PHI_ALL : PHI_BASIC;
    const r = state.checked ? state.result : null;
    const set = (patch) => onChange({ ...state, ...patch });

    const check = () => {
        const result = gradePractice(state);
        const score = state.checked ? state.score : {
            correct: state.score.correct + (result.all ? 1 : 0),
            total: state.score.total + 1,
        };
        onChange({ ...state, checked: true, result, score });
    };
    const next = (level = state.level) => {
        setShowHint(false);
        onChange(newPracticeState(level, state.q, state.score));
    };

    const inputCls = 'w-24 rounded-lg border border-slate-600 bg-slate-900 px-2 py-1.5 text-right font-mono text-slate-100';

    return (
        <div className="space-y-4">
            <div>
                <h3 className="step-title"><span className="step-name">y-t 図から式を読み取る</span></h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                    グラフの単振動を y = A sin(2πt/T + φ) と表すとき、A・T・φ を答えよう。
                </p>
            </div>

            <div className="flex gap-1.5" role="group" aria-label="レベル">
                {[['basic', '基本（φ は 0, π/2, π, 3π/2）'], ['advanced', '発展（φ は π/6 や π/4 の倍数）']].map(([id, label]) => (
                    <button key={id} type="button" onClick={() => next(id)}
                        className={`phase-btn flex-1 text-xs leading-snug py-1.5 ${state.level === id ? 'active' : ''}`}>
                        {label}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                <label className="flex items-center justify-between gap-2 text-sm text-slate-200">
                    <span>振幅 A</span>
                    <span className="flex items-center gap-1.5">
                        <input className={inputCls} inputMode="decimal" value={state.A} disabled={state.checked}
                            onChange={(e) => set({ A: e.target.value })} aria-label="振幅 A（cm）" />
                        <span className="w-6">cm</span>
                        {r && <Mark ok={r.okA} />}
                    </span>
                </label>
                <label className="flex items-center justify-between gap-2 text-sm text-slate-200">
                    <span>周期 T</span>
                    <span className="flex items-center gap-1.5">
                        <input className={inputCls} inputMode="decimal" value={state.T} disabled={state.checked}
                            onChange={(e) => set({ T: e.target.value })} aria-label="周期 T（s）" />
                        <span className="w-6">s</span>
                        {r && <Mark ok={r.okT} />}
                    </span>
                </label>
                <div>
                    <div className="text-sm text-slate-200 mb-1.5">初期位相 φ {r && <Mark ok={r.okPhi} />}</div>
                    <div className={`grid gap-1.5 ${phis.length > 4 ? 'grid-cols-4' : 'grid-cols-4'}`}>
                        {phis.map((x) => (
                            <button key={x.label} type="button" disabled={state.checked}
                                className={`phase-btn ${state.phi === x.v ? 'active' : ''}`}
                                onClick={() => set({ phi: x.v })}>
                                {x.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {!state.checked ? (
                <div className="flex gap-2">
                    <button type="button" className="btn btn-secondary justify-center" onClick={() => setShowHint((v) => !v)}>
                        💡 ヒント
                    </button>
                    <button type="button" className="btn btn-primary flex-1 justify-center"
                        disabled={state.A === '' || state.T === '' || state.phi === null}
                        style={{ opacity: state.A === '' || state.T === '' || state.phi === null ? 0.4 : 1 }}
                        onClick={check}>
                        答え合わせ
                    </button>
                </div>
            ) : (
                <button type="button" className="btn btn-success w-full justify-center" onClick={() => next()}>
                    次の問題 →
                </button>
            )}

            {showHint && !state.checked && (
                <div className="explanation-box text-sm space-y-1">
                    <p>A：{HINTS.A}</p>
                    <p>T：{HINTS.T}</p>
                    <p>φ：{HINTS.phi}</p>
                </div>
            )}

            {r && (
                <div className={`rounded-xl border p-3 space-y-1.5 ${r.all ? 'border-emerald-400/50 bg-emerald-900/30' : 'border-amber-400/40 bg-amber-900/20'}`}>
                    <p className="font-semibold text-slate-100">{r.all ? '🎉 全部正解！' : 'もう一度グラフを見てみよう'}</p>
                    <p className="text-sm text-slate-200 font-mono">{formulaText(state.q)}</p>
                    {!r.okA && <p className="text-sm text-amber-200">A：{HINTS.A}（正解 {state.q.A.toFixed(1)} cm）</p>}
                    {!r.okT && <p className="text-sm text-amber-200">T：{HINTS.T}（正解 {state.q.T} s）</p>}
                    {!r.okPhi && <p className="text-sm text-amber-200">φ：{HINTS.phi}（正解 {state.q.phi.label}）</p>}
                    <p className="text-xs text-slate-400">グラフの点線が、あなたの答えの曲線です。</p>
                </div>
            )}

            <p className="text-sm text-slate-400">
                成績：{state.score.correct} / {state.score.total} 問 全問正解
            </p>
        </div>
    );
}
