import { useMemo } from 'react';
import KatexMath from './KatexMath';
import { phaseToLatex, getSpecialForm, formatPhase } from '../utils/physics';

/**
 * Mode 2: 操作パネル
 * 位相設定、ベクトル表示切替、グラフ選択
 */

// 位相のスナップ値
const PHASE_SNAPS = [
    { value: 0, label: '0' },
    { value: Math.PI / 6, label: 'π/6' },
    { value: Math.PI / 4, label: 'π/4' },
    { value: Math.PI / 3, label: 'π/3' },
    { value: Math.PI / 2, label: 'π/2' },
    { value: (2 * Math.PI) / 3, label: '2π/3' },
    { value: (3 * Math.PI) / 4, label: '3π/4' },
    { value: (5 * Math.PI) / 6, label: '5π/6' },
    { value: Math.PI, label: 'π' },
    { value: (7 * Math.PI) / 6, label: '7π/6' },
    { value: (5 * Math.PI) / 4, label: '5π/4' },
    { value: (4 * Math.PI) / 3, label: '4π/3' },
    { value: (3 * Math.PI) / 2, label: '3π/2' },
    { value: (5 * Math.PI) / 3, label: '5π/3' },
    { value: (7 * Math.PI) / 4, label: '7π/4' },
    { value: (11 * Math.PI) / 6, label: '11π/6' },
];

export default function Mode2Panel({
    phi, onPhiChange,
    showVectors, onShowVectorsChange,
    graphType, onGraphTypeChange,
}) {
    // 位相スライダーの値をスナップ
    const snapPhase = (rawValue) => {
        let closest = PHASE_SNAPS[0];
        let minDist = Infinity;
        for (const snap of PHASE_SNAPS) {
            const dist = Math.abs(rawValue - snap.value);
            if (dist < minDist) {
                minDist = dist;
                closest = snap;
            }
        }
        if (minDist < 0.15) return closest.value;
        return rawValue;
    };

    // 数式の計算
    const generalForm = useMemo(() => {
        const phiLatex = phaseToLatex(phi);
        if (Math.abs(phi) < 0.01) {
            return 'y = A \\sin(\\omega t)';
        }
        return `y = A \\sin(\\omega t + ${phiLatex})`;
    }, [phi]);

    const specialForm = useMemo(() => getSpecialForm(phi), [phi]);

    return (
        <div className="space-y-5">
            {/* 位相設定 */}
            <div>
                <p className="section-header">初期位相 φ の設定</p>
                <div className="slider-container">
                    <div className="slider-label">
                        <span>初期位相</span>
                        <span className="slider-value">{formatPhase(phi)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max={2 * Math.PI}
                        step="0.01"
                        value={phi}
                        onChange={(e) => onPhiChange(snapPhase(parseFloat(e.target.value)))}
                    />
                </div>

                {/* スナップボタン */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                    {PHASE_SNAPS.map((snap) => (
                        <button
                            key={snap.label}
                            className={`phase-btn ${Math.abs(phi - snap.value) < 0.05 ? 'active' : ''}`}
                            onClick={() => onPhiChange(snap.value)}
                        >
                            {snap.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 数式表示 */}
            <div className="formula-card">
                <p className="formula-label">一般形</p>
                <div className="text-center mb-3">
                    <KatexMath latex={generalForm} displayMode />
                </div>

                <p className="formula-label">特殊形</p>
                <div className="text-center mb-3">
                    <KatexMath latex={specialForm.latex} displayMode />
                </div>

                <div className="explanation-box text-xs">
                    {specialForm.explanation}
                </div>
            </div>

            {/* ベクトル表示トグル */}
            <div>
                <label className="custom-checkbox">
                    <input
                        type="checkbox"
                        checked={showVectors}
                        onChange={(e) => onShowVectorsChange(e.target.checked)}
                    />
                    <span>
                        ベクトル表示（変位 <span style={{ color: '#10B981' }}>x</span> & 復元力 <span style={{ color: '#EF4444' }}>F = −kx</span>）
                    </span>
                </label>
            </div>

            {/* グラフ切替 */}
            <div>
                <p className="section-header">グラフ選択</p>
                <div className="flex gap-1.5">
                    {[
                        { key: 'y', label: 'y-t' },
                        { key: 'v', label: 'v-t' },
                        { key: 'a', label: 'a-t' },
                        { key: 'all', label: '全て' },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            className={`btn text-xs flex-1 ${graphType === key ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => onGraphTypeChange(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 物理量のリアルタイム表示 */}
            <div className="formula-card">
                <p className="formula-label">主要な関係式</p>
                <div className="space-y-1.5">
                    <KatexMath latex="v = A\omega \cos(\omega t + \phi)" className="text-xs" />{', '}
                    <KatexMath latex="a = -A\omega^2 \sin(\omega t + \phi) = -\omega^2 y" className="text-xs" />{', '}
                    <KatexMath latex="F = ma = -kx" className="text-xs" />
                </div>
            </div>
        </div>
    );
}
