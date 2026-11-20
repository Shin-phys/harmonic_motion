/**
 * 操作パネルで使う小さな部品（スライダー・切り替えボタン・ステップ送り）
 */

export function Slider({ label, value, min, max, step, display, onChange, ariaLabel }) {
    return (
        <div className="slider-container">
            <div className="slider-label">
                <span>{label}</span>
                <span className="slider-value">{display}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                aria-label={ariaLabel ?? label}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        </div>
    );
}

function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

export function Toggle({ on, onClick, color = '#3B82F6', children }) {
    const rgb = hexToRgb(color);
    return (
        <button
            type="button"
            className={`toggle-btn ${on ? 'active' : ''}`}
            onClick={onClick}
            aria-pressed={on}
            style={on ? { borderColor: `rgba(${rgb}, 0.35)`, background: `rgba(${rgb}, 0.1)` } : {}}
        >
            <span className="toggle-dot" style={on ? { background: color, boxShadow: `0 0 6px ${color}` } : {}} />
            {children}
        </button>
    );
}

/** ステップ式の説明（ドット・タイトル・説明・戻る／進む） */
export function StepGuide({ steps, index, onChange }) {
    const cur = steps[index];
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-center gap-1 flex-wrap">
                {steps.map((s, i) => (
                    <div key={s.name} className="flex items-center">
                        <div
                            className={`step-dot ${i === index ? 'active' : i < index ? 'completed' : ''}`}
                            title={`Step ${i + 1}: ${s.name}`}
                            role="button"
                            aria-label={`Step ${i + 1}: ${s.name}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onChange(i)}
                        />
                        {i < steps.length - 1 && (
                            <div className={`w-3 h-0.5 ${i < index ? 'bg-emerald-500/60' : 'bg-slate-700'} mx-0.5 rounded-full`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="fade-in" key={index}>
                <h3 className="step-title">
                    <span className="step-number">Step {index + 1}:</span>
                    <span className="step-name">{cur.name}</span>
                </h3>
                <p className="text-sm text-slate-300 mb-2 leading-relaxed">{cur.desc}</p>
                {cur.detail && <div className="explanation-box text-sm">{cur.detail}</div>}
            </div>
            <div className="flex gap-3">
                <button type="button" className="btn btn-secondary flex-1 justify-center" disabled={index <= 0}
                    style={{ opacity: index <= 0 ? 0.35 : 1 }} onClick={() => onChange(index - 1)}>
                    ← 戻る
                </button>
                <button type="button" className="btn btn-primary flex-1 justify-center" disabled={index >= steps.length - 1}
                    style={{ opacity: index >= steps.length - 1 ? 0.35 : 1 }} onClick={() => onChange(index + 1)}>
                    進む →
                </button>
            </div>
        </div>
    );
}
