/**
 * 練習：y-t 図から A・T・φ を読み取る
 *  y = A sin(2πt/T + φ)、A は cm、T は s
 */
export const A_CHOICES = [1.0, 1.5, 2.0, 2.5, 3.0];
export const T_CHOICES = [0.8, 1.2, 1.6, 2.0, 2.4];

const P = Math.PI;
export const PHI_BASIC = [
    { v: 0, label: '0' },
    { v: P / 2, label: 'π/2' },
    { v: P, label: 'π' },
    { v: (3 * P) / 2, label: '3π/2' },
];
export const PHI_ALL = [
    { v: 0, label: '0' }, { v: P / 6, label: 'π/6' }, { v: P / 4, label: 'π/4' }, { v: P / 3, label: 'π/3' },
    { v: P / 2, label: 'π/2' }, { v: (2 * P) / 3, label: '2π/3' }, { v: (3 * P) / 4, label: '3π/4' }, { v: (5 * P) / 6, label: '5π/6' },
    { v: P, label: 'π' }, { v: (7 * P) / 6, label: '7π/6' }, { v: (5 * P) / 4, label: '5π/4' }, { v: (4 * P) / 3, label: '4π/3' },
    { v: (3 * P) / 2, label: '3π/2' }, { v: (5 * P) / 3, label: '5π/3' }, { v: (7 * P) / 4, label: '7π/4' }, { v: (11 * P) / 6, label: '11π/6' },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** 新しい問題（前の問題と同じ組み合わせは避ける） */
export function newQuestion(level, prev = null) {
    const phis = level === 'advanced' ? PHI_ALL.filter((x) => !PHI_BASIC.some((b) => b.v === x.v)) : PHI_BASIC;
    for (let i = 0; i < 20; i++) {
        const q = { A: pick(A_CHOICES), T: pick(T_CHOICES), phi: pick(phis) };
        if (!prev || q.A !== prev.A || q.T !== prev.T || q.phi.v !== prev.phi.v) return q;
    }
    return { A: pick(A_CHOICES), T: pick(T_CHOICES), phi: pick(phis) };
}

export function newPracticeState(level = 'basic', prev = null, score = { correct: 0, total: 0 }) {
    return { level, q: newQuestion(level, prev), A: '', T: '', phi: null, checked: false, result: null, score };
}

const num = (s) => {
    const x = parseFloat(String(s).replace(/[，,]/g, '.').replace(/[０-９．]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0)));
    return Number.isFinite(x) ? x : null;
};

export function gradePractice(state) {
    const A = num(state.A);
    const T = num(state.T);
    const okA = A !== null && Math.abs(A - state.q.A) <= 0.1 + 1e-9;
    const okT = T !== null && Math.abs(T - state.q.T) <= 0.05 + 1e-9;
    const okPhi = state.phi !== null && Math.abs(state.phi - state.q.phi.v) < 1e-9;
    return { okA, okT, okPhi, all: okA && okT && okPhi, A, T };
}

/** 答えの式（数値入り） */
export function formulaText(q) {
    const w = `2π/${q.T}`;
    const phase = q.phi.v === 0 ? '' : ` + ${q.phi.label}`;
    return `y = ${q.A.toFixed(1)} sin(${w}·t${phase})〔cm〕`;
}
