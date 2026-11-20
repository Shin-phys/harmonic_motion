import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { COLORS, drawDashedLine, drawGrid, drawArrow, pendulumPeriods } from '../utils/physics';

/**
 * 単振り子
 *  運動方程式 θ'' = −(g/L) sin θ をそのまま数値計算（RK4）し、
 *  単振動とみなした動き θ0 cos(ω0 t)（ω0 = √(g/L)）とくらべる
 */
const PX_PER_M = 110;
const PIVOT = { x: 235, y: 52 };
const GRAPH = { l: 60, r: 780, cy: 448, amp: 72 };
const T_SCALE = 60;
const F_SCALE = 3;

export default function PendulumCanvas(props) {
    const containerRef = useRef(null);
    const propsRef = useRef(props);
    useEffect(() => {
        propsRef.current = props;
    });

    useEffect(() => {
        if (!containerRef.current) return undefined;
        const { L, m, theta0, g } = propsRef.current;
        const w0 = Math.sqrt(g / L);
        const { T0, T: Texact, ratio } = pendulumPeriods(L, g, theta0);
        const st = { t: 0, th: theta0, om: 0, trail: [], maxima: [], prevOm: 0 };
        const deriv = (th, om) => [om, -(g / L) * Math.sin(th)];
        const rk4 = (dt) => {
            const [k1a, k1b] = deriv(st.th, st.om);
            const [k2a, k2b] = deriv(st.th + (dt / 2) * k1a, st.om + (dt / 2) * k1b);
            const [k3a, k3b] = deriv(st.th + (dt / 2) * k2a, st.om + (dt / 2) * k2b);
            const [k4a, k4b] = deriv(st.th + dt * k3a, st.om + dt * k3b);
            st.th += (dt / 6) * (k1a + 2 * k2a + 2 * k3a + k4a);
            st.om += (dt / 6) * (k1b + 2 * k2b + 2 * k3b + k4b);
        };
        const lenPx = L * PX_PER_M;
        const bobR = 9 + 7 * Math.cbrt(m);
        const deg = (r) => (r * 180) / Math.PI;

        const sketch = (p) => {
            const W = 800;
            const H = 560;
            const text = (s, x, y, rgb = [255, 255, 255], a = 210, align = 'center', size = 12) => {
                p.fill(...rgb, a);
                p.noStroke();
                p.textSize(size);
                p.textAlign(align === 'left' ? p.LEFT : align === 'right' ? p.RIGHT : p.CENTER, p.CENTER);
                p.text(s, x, y);
            };
            const bobAt = (th) => ({ x: PIVOT.x + lenPx * Math.sin(th), y: PIVOT.y + lenPx * Math.cos(th) });

            p.setup = () => {
                p.pixelDensity(2);
                p.createCanvas(W, H);
                p.textFont('Inter');
            };

            p.draw = () => {
                const { isPlaying, speedMultiplier, showForces, showApprox } = propsRef.current;
                p.background(13, 17, 23);
                drawGrid(p, W, H, 50);

                if (isPlaying) {
                    const dtFrame = Math.min(0.05, p.deltaTime / 1000) * speedMultiplier;
                    const n = Math.max(1, Math.ceil(dtFrame / 0.001));
                    for (let i = 0; i < n; i++) {
                        rk4(dtFrame / n);
                        st.t += dtFrame / n;
                        if (st.prevOm > 0 && st.om <= 0) st.maxima.push(st.t); // 右端で折り返した時刻
                        st.prevOm = st.om;
                    }
                    st.trail.push({ t: st.t, th: st.th, ap: theta0 * Math.cos(w0 * st.t) });
                    if (st.trail.length > 3000) st.trail.shift();
                }
                const thAp = theta0 * Math.cos(w0 * st.t);

                // ── 振り子 ──
                p.fill(255, 255, 255, 45);
                p.noStroke();
                p.rect(PIVOT.x - 40, PIVOT.y - 8, 80, 8);
                p.stroke(255, 255, 255, 40);
                p.strokeWeight(1);
                drawDashedLine(p, PIVOT.x, PIVOT.y, PIVOT.x, PIVOT.y + lenPx + 30, 4, 4);
                // 軌道の弧
                p.noFill();
                p.stroke(255, 255, 255, 30);
                p.arc(PIVOT.x, PIVOT.y, lenPx * 2, lenPx * 2, Math.PI / 2 - theta0, Math.PI / 2 + theta0);

                if (showApprox) {
                    const b2 = bobAt(thAp);
                    p.stroke(...COLORS.accentRGB, 90);
                    p.strokeWeight(1.5);
                    drawDashedLine(p, PIVOT.x, PIVOT.y, b2.x, b2.y, 4, 4);
                    p.noFill();
                    p.stroke(...COLORS.accentRGB, 160);
                    p.strokeWeight(2);
                    p.ellipse(b2.x, b2.y, bobR * 2, bobR * 2);
                }

                const b = bobAt(st.th);
                p.stroke(220, 220, 230);
                p.strokeWeight(1.5);
                p.line(PIVOT.x, PIVOT.y, b.x, b.y);
                p.fill(...COLORS.primaryRGB);
                p.stroke(...COLORS.primaryRGB, 120);
                p.ellipse(b.x, b.y, bobR * 2, bobR * 2);
                text('m', b.x, b.y, [255, 255, 255], 255, 'center', 12);

                // 角度
                p.noFill();
                p.stroke(...COLORS.accentRGB, 160);
                p.strokeWeight(1.5);
                const a0 = Math.PI / 2;
                if (Math.abs(st.th) > 0.01) p.arc(PIVOT.x, PIVOT.y, 70, 70, Math.min(a0, a0 - st.th), Math.max(a0, a0 - st.th));
                text(`θ = ${deg(st.th).toFixed(0)}°`, PIVOT.x + (st.th >= 0 ? -48 : 48), PIVOT.y + 50, COLORS.accentRGB, 230, 'center', 12);
                text(`L = ${L.toFixed(2)} m`, PIVOT.x + 50, PIVOT.y + 12, [255, 255, 255], 170, 'left', 12);

                // 力
                if (showForces) {
                    const mg = m * g;
                    const v = L * st.om;
                    const tension = mg * Math.cos(st.th) + (m * v * v) / L;
                    const ux = Math.sin(st.th);
                    const uy = Math.cos(st.th);
                    // 重力
                    p.stroke(251, 146, 60);
                    p.fill(251, 146, 60);
                    p.strokeWeight(2.5);
                    drawArrow(p, b.x, b.y, b.x, b.y + mg * F_SCALE, 8);
                    text('mg', b.x + 6, b.y + mg * F_SCALE + 8, [251, 146, 60], 255, 'left');
                    // 張力
                    p.stroke(96, 165, 250);
                    p.fill(96, 165, 250);
                    drawArrow(p, b.x, b.y, b.x - ux * tension * F_SCALE, b.y - uy * tension * F_SCALE, 8);
                    text('張力 S', b.x - ux * tension * F_SCALE - 8, b.y - uy * tension * F_SCALE, [96, 165, 250], 255, 'right');
                    // 接線方向の成分（復元力）
                    const ft = -mg * Math.sin(st.th);
                    const tx = Math.cos(st.th);
                    const ty = -Math.sin(st.th);
                    if (Math.abs(ft) * F_SCALE > 3) {
                        p.stroke(...COLORS.redRGB);
                        p.fill(...COLORS.redRGB);
                        p.strokeWeight(3);
                        drawArrow(p, b.x, b.y, b.x + tx * ft * F_SCALE, b.y + ty * ft * F_SCALE, 8);
                        text('mg sinθ', b.x + tx * ft * F_SCALE + (ft > 0 ? 8 : -8), b.y + ty * ft * F_SCALE - 10,
                            COLORS.redRGB, 255, ft > 0 ? 'left' : 'right');
                    }
                }

                // ── 周期の情報 ──
                const ix = 490;
                const iy = 40;
                p.fill(0, 0, 0, 90);
                p.noStroke();
                p.rect(ix - 12, iy - 14, 302, 266, 8);
                text('周期', ix, iy, [255, 255, 255], 230, 'left', 14);
                text(`単振動とみなすと  T₀ = 2π√(L/g) = ${T0.toFixed(3)} s`, ix, iy + 24, COLORS.accentRGB, 255, 'left', 12);
                text(`振れ角 ${deg(theta0).toFixed(0)}° での実際の周期  T = ${Texact.toFixed(3)} s`, ix, iy + 46, COLORS.primaryRGB, 255, 'left', 12);
                text(`T は T₀ の ${ratio.toFixed(3)} 倍（${((ratio - 1) * 100).toFixed(1)} % 長い）`, ix, iy + 68, [255, 255, 255], 220, 'left', 12);
                const meas = st.maxima.length >= 2 ? st.maxima[st.maxima.length - 1] - st.maxima[st.maxima.length - 2] : null;
                text(`シミュレーションで測った周期：${meas ? `${meas.toFixed(3)} s` : '（再生して測定）'}`, ix, iy + 90, [255, 255, 255], 200, 'left', 12);

                // T/T0 と振れ角のグラフ
                const gl = ix + 10;
                const gr = ix + 270;
                const gb = iy + 220;
                const gt = iy + 120;
                const Y = (r) => gb - ((r - 1) / 0.4) * (gb - gt);
                const X = (d) => gl + (d / 90) * (gr - gl);
                p.stroke(255, 255, 255, 90);
                p.strokeWeight(1);
                p.line(gl, gb, gr, gb);
                p.line(gl, gb, gl, gt);
                text('振れ角 θ₀', (gl + gr) / 2, gb + 27, [255, 255, 255], 160, 'center', 11);
                text('T/T₀', gl - 4, gt - 8, [255, 255, 255], 160, 'left', 11);
                [0, 30, 60, 90].forEach((d) => text(`${d}°`, X(d), gb + 12, [255, 255, 255], 130, 'center', 11));
                [1.0, 1.2, 1.4].forEach((r) => text(r.toFixed(1), gl - 6, Y(r), [255, 255, 255], 130, 'right', 11));
                p.noFill();
                p.stroke(...COLORS.primaryRGB);
                p.strokeWeight(2);
                p.beginShape();
                for (let d = 0; d <= 90; d += 1) p.vertex(X(d), Y(pendulumPeriods(1, 9.8, (d * Math.PI) / 180).ratio));
                p.endShape();
                p.stroke(...COLORS.accentRGB, 160);
                p.strokeWeight(1);
                drawDashedLine(p, gl, Y(1), gr, Y(1), 4, 4);
                if (deg(theta0) <= 90) {
                    p.fill(...COLORS.accentRGB);
                    p.noStroke();
                    p.ellipse(X(deg(theta0)), Y(ratio), 9, 9);
                }

                // ── θ-t 図 ──
                const { l, r, cy, amp } = GRAPH;
                p.fill(0, 0, 0, 50);
                p.noStroke();
                p.rect(l - 10, cy - amp - 32, r - l + 20, amp * 2 + 52, 8);
                p.stroke(255, 255, 255, 90);
                p.strokeWeight(1);
                p.line(l, cy, r, cy);
                p.line(l, cy - amp - 10, l, cy + amp + 10);
                text('θ − t 図', (l + r) / 2, cy - amp - 20, [255, 255, 255], 210, 'center', 12);
                text(`${deg(theta0).toFixed(0)}°`, l - 6, cy - amp, [255, 255, 255], 150, 'right', 11);
                text(`−${deg(theta0).toFixed(0)}°`, l - 6, cy + amp, [255, 255, 255], 150, 'right', 11);
                text('t', r + 8, cy, [255, 255, 255], 160, 'center', 12);
                const scale = amp / theta0;
                const latest = st.trail.length ? st.trail[st.trail.length - 1].t : 0;
                const scrollT = Math.max(0, latest - (r - l) / T_SCALE);
                const plot = (key, rgb, dashed) => {
                    p.noFill();
                    p.stroke(...rgb);
                    p.strokeWeight(dashed ? 1.5 : 2.2);
                    if (dashed) p.drawingContext.setLineDash([6, 5]);
                    p.beginShape();
                    for (const pt of st.trail) {
                        const px = l + (pt.t - scrollT) * T_SCALE;
                        if (px >= l && px <= r) p.vertex(px, cy - pt[key] * scale);
                    }
                    p.endShape();
                    p.drawingContext.setLineDash([]);
                };
                if (showApprox) plot('ap', COLORS.accentRGB, true);
                plot('th', COLORS.primaryRGB, false);
                text('━ 実際の振り子', r - 230, cy + amp + 8, COLORS.primaryRGB, 230, 'left', 11);
                if (showApprox) text('┅ 単振動とみなした動き', r - 130, cy + amp + 8, COLORS.accentRGB, 230, 'left', 11);

                text(`t = ${st.t.toFixed(2)} s`, 10, 14, [255, 255, 255], 130, 'left', 12);
                if (!isPlaying) text('⏸ 一時停止中', 10, 32, [255, 255, 255], 70, 'left', 12);
            };
        };
        const inst = new p5(sketch, containerRef.current);
        return () => inst.remove();
    }, []);

    return <div ref={containerRef} className="canvas-container" />;
}
