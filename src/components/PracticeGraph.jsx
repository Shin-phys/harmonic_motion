/**
 * 練習：問題の y-t 図（SVG）
 *  答え合わせ後は、入力した A・T・φ の曲線を点線で重ねる
 */
const W = 800;
const H = 500;
const L = 76;
const R = 772;
const TOP = 34;
const BOT = 446;
const T_MAX = 4.0;
const Y_MAX = 3.5;

const X = (t) => L + (t / T_MAX) * (R - L);
const Y = (y) => (TOP + BOT) / 2 - (y / Y_MAX) * ((BOT - TOP) / 2);

function curve(A, T, phi) {
    const pts = [];
    for (let i = 0; i <= 800; i++) {
        const t = (T_MAX * i) / 800;
        pts.push(`${X(t).toFixed(1)},${Y(A * Math.sin((2 * Math.PI * t) / T + phi)).toFixed(1)}`);
    }
    return pts.join(' ');
}

export default function PracticeGraph({ q, overlay = null }) {
    const tLines = Array.from({ length: Math.round(T_MAX / 0.1) + 1 }, (_, i) => i * 0.1);
    const yLines = Array.from({ length: Math.round((2 * Y_MAX) / 0.25) + 1 }, (_, i) => -Y_MAX + i * 0.25);
    const y0 = q.A * Math.sin(q.phi.v);

    return (
        <div className="canvas-container">
            <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-full" role="img" aria-label="y-t 図（練習問題）">
                <rect x="0" y="0" width={W} height={H} fill="#0D1117" />
                {/* 方眼 */}
                {tLines.map((t) => {
                    const major = Math.abs(t * 5 - Math.round(t * 5)) < 1e-6;
                    return (
                        <g key={`t${t.toFixed(1)}`}>
                            <line x1={X(t)} x2={X(t)} y1={TOP} y2={BOT} stroke="white" strokeOpacity={major ? 0.16 : 0.06} />
                            {major && (
                                <text x={X(t)} y={BOT + 18} fill="#94A3B8" fontSize="13" textAnchor="middle">{t.toFixed(1)}</text>
                            )}
                        </g>
                    );
                })}
                {yLines.map((y) => {
                    const major = Math.abs(y * 2 - Math.round(y * 2)) < 1e-6;
                    return (
                        <g key={`y${y.toFixed(2)}`}>
                            <line x1={L} x2={R} y1={Y(y)} y2={Y(y)} stroke="white" strokeOpacity={major ? 0.16 : 0.06} />
                            {major && (
                                <text x={L - 8} y={Y(y) + 4} fill="#94A3B8" fontSize="13" textAnchor="end">{y.toFixed(1)}</text>
                            )}
                        </g>
                    );
                })}
                {/* 軸 */}
                <line x1={L} x2={R} y1={Y(0)} y2={Y(0)} stroke="white" strokeOpacity="0.7" />
                <line x1={L} x2={L} y1={TOP} y2={BOT} stroke="white" strokeOpacity="0.7" />
                <text x={R} y={Y(0) - 8} fill="#E2E8F0" fontSize="14" textAnchor="end">t〔s〕</text>
                <text x={L - 8} y={TOP - 12} fill="#E2E8F0" fontSize="14" textAnchor="end">y〔cm〕</text>

                {/* 問題の曲線 */}
                <polyline points={curve(q.A, q.T, q.phi.v)} fill="none" stroke="#3B82F6" strokeWidth="3" />
                <circle cx={X(0)} cy={Y(y0)} r="6" fill="#F59E0B" />
                <text x={X(0) + 10} y={Y(y0) - 10} fill="#F59E0B" fontSize="13">t = 0</text>

                {/* 入力した答えの曲線 */}
                {overlay && (
                    <polyline points={curve(overlay.A, overlay.T, overlay.phi)} fill="none" stroke="#F97316"
                        strokeWidth="2.5" strokeDasharray="8 6" />
                )}
                {overlay && (
                    <g>
                        <line x1={R - 250} x2={R - 222} y1={TOP + 14} y2={TOP + 14} stroke="#3B82F6" strokeWidth="3" />
                        <text x={R - 216} y={TOP + 18} fill="#CBD5E1" fontSize="13">問題</text>
                        <line x1={R - 160} x2={R - 132} y1={TOP + 14} y2={TOP + 14} stroke="#F97316" strokeWidth="2.5" strokeDasharray="8 6" />
                        <text x={R - 126} y={TOP + 18} fill="#CBD5E1" fontSize="13">あなたの答え</text>
                    </g>
                )}
            </svg>
        </div>
    );
}
