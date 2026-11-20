import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { COLORS, drawSpring, drawDashedLine, drawGrid } from '../utils/physics';

/**
 * エネルギーを位置 x のグラフで見る（水平ばね振り子・摩擦なし）
 *  上：ばね振り子、下：同じ横軸（位置 x）で U = ½kx² の放物線と E = 一定の直線
 */
const S = 1000;          // 1 m あたりの px（横）
const X0 = 400;          // つり合いの位置（x = 0）
const TRACK_Y = 105;     // おもりの通り道
const BASE_Y = 515;      // エネルギー 0 の線
const E_PX = 240;        // E をこの高さで表示
const X_RANGE = 0.3;     // 横軸 ±0.3 m
const BOX = 34;

export default function EnergyCanvas(props) {
    const containerRef = useRef(null);
    const propsRef = useRef(props);
    useEffect(() => {
        propsRef.current = props;
    });
    const stateRef = useRef({ t: 0 });

    useEffect(() => {
        if (!containerRef.current) return undefined;
        const { m, k, A } = propsRef.current;
        const omega = Math.sqrt(k / m);
        const E = 0.5 * k * A * A;
        const eScale = E_PX / E;
        const X = (x) => X0 + x * S;
        const Y = (e) => BASE_Y - e * eScale;

        const sketch = (p) => {
            const W = 800;
            const H = 560;

            const text = (s, x, y, rgb = [255, 255, 255], a = 210, align = 'center', size = 12, vAlign = 'center') => {
                p.fill(...rgb, a);
                p.noStroke();
                p.textSize(size);
                p.textAlign(align === 'left' ? p.LEFT : align === 'right' ? p.RIGHT : p.CENTER,
                    vAlign === 'bottom' ? p.BOTTOM : vAlign === 'top' ? p.TOP : p.CENTER);
                p.text(s, x, y);
            };

            p.setup = () => {
                p.pixelDensity(2);
                p.createCanvas(W, H);
                p.textFont('Inter');
            };

            p.draw = () => {
                const st = stateRef.current;
                const { isPlaying, speedMultiplier, showSegments, showKCurve } = propsRef.current;
                p.background(13, 17, 23);
                drawGrid(p, W, H, 50);
                if (isPlaying) st.t += (p.deltaTime / 1000) * speedMultiplier;

                const x = A * Math.cos(omega * st.t);
                const v = -A * omega * Math.sin(omega * st.t);
                const U = 0.5 * k * x * x;
                const K = 0.5 * m * v * v;

                // ── ばね振り子 ──
                const wallX = 60;
                p.fill(255, 255, 255, 40);
                p.noStroke();
                p.rect(wallX - 6, TRACK_Y - 30, 6, 60);
                p.stroke(255, 255, 255, 50);
                p.strokeWeight(1);
                p.line(wallX, TRACK_Y + BOX / 2, 760, TRACK_Y + BOX / 2);
                p.stroke(...COLORS.primaryRGB, 190);
                p.strokeWeight(2);
                p.noFill();
                drawSpring(p, wallX, TRACK_Y, X(x) - BOX / 2, TRACK_Y, 14, 10);
                p.fill(...COLORS.primaryRGB);
                p.stroke(...COLORS.primaryRGB, 120);
                p.strokeWeight(1);
                p.rect(X(x) - BOX / 2, TRACK_Y - BOX / 2, BOX, BOX, 5);
                text('m', X(x), TRACK_Y, [255, 255, 255], 255, 'center', 13);
                text('ばね振り子（摩擦なし）', 70, 48, [255, 255, 255], 190, 'left', 13);

                // ── グラフの軸 ──
                p.stroke(255, 255, 255, 110);
                p.strokeWeight(1);
                p.line(X(-X_RANGE), BASE_Y, X(X_RANGE), BASE_Y);
                p.line(X0, BASE_Y, X0, Y(E * 1.25));
                text('位置 x〔m〕', X(X_RANGE) + 4, BASE_Y + 22, [255, 255, 255], 190, 'right');
                text('エネルギー〔J〕', X0 + 6, Y(E * 1.25) - 4, [255, 255, 255], 190, 'left', 12, 'bottom');
                for (let i = -3; i <= 3; i++) {
                    const xx = i / 10;
                    p.stroke(255, 255, 255, 70);
                    p.line(X(xx), BASE_Y, X(xx), BASE_Y + 5);
                    text(xx.toFixed(1), X(xx), BASE_Y + 13, [255, 255, 255], 150, 'center', 11);
                }
                // おもりの位置と横軸をつなぐ
                p.stroke(...COLORS.primaryRGB, 70);
                drawDashedLine(p, X(x), TRACK_Y + BOX / 2, X(x), BASE_Y, 4, 4);

                // 折り返し点
                p.stroke(255, 255, 255, 50);
                drawDashedLine(p, X(-A), TRACK_Y - 30, X(-A), BASE_Y, 3, 5);
                drawDashedLine(p, X(A), TRACK_Y - 30, X(A), BASE_Y, 3, 5);
                text('−A', X(-A), TRACK_Y - 38, [255, 255, 255], 170);
                text('+A', X(A), TRACK_Y - 38, [255, 255, 255], 170);

                // ── U = ½kx² ──
                p.noFill();
                p.stroke(...COLORS.greenRGB);
                p.strokeWeight(2.5);
                p.beginShape();
                for (let xx = -X_RANGE; xx <= X_RANGE + 1e-9; xx += 0.002) {
                    const uu = 0.5 * k * xx * xx;
                    if (uu <= E * 1.25) p.vertex(X(xx), Y(uu));
                }
                p.endShape();
                const labelX = Math.min(X_RANGE * 0.92, A * 1.15);
                text('U = ½kx²', X(-labelX) - 6, Y(0.5 * k * labelX * labelX), COLORS.greenRGB, 255, 'right', 13);

                // ── K = E − U（|x| ≤ A）──
                if (showKCurve) {
                    p.noFill();
                    p.stroke(...COLORS.purpleRGB, 220);
                    p.strokeWeight(2);
                    p.beginShape();
                    for (let xx = -A; xx <= A + 1e-9; xx += 0.002) p.vertex(X(xx), Y(E - 0.5 * k * xx * xx));
                    p.endShape();
                    text('K = E − ½kx²', X(-A * 0.55) - 8, Y(E - 0.5 * k * (A * 0.55) ** 2) - 4, COLORS.purpleRGB, 255, 'right', 13);
                }

                // ── E = 一定 ──
                p.stroke(...COLORS.accentRGB);
                p.strokeWeight(2);
                p.line(X(-X_RANGE), Y(E), X(X_RANGE), Y(E));
                text(`E = ½kA² = ${E.toFixed(3)} J`, X(X_RANGE), Y(E) - 12, COLORS.accentRGB, 255, 'right', 13);

                // ── いまの位置での K と U ──
                if (showSegments) {
                    const px = X(x);
                    p.strokeWeight(7);
                    p.strokeCap(p.SQUARE);
                    p.stroke(...COLORS.greenRGB, 230);
                    p.line(px, BASE_Y, px, Y(U));
                    p.stroke(...COLORS.purpleRGB, 230);
                    p.line(px, Y(U), px, Y(E));
                    p.strokeCap(p.ROUND);
                    const side = x >= 0 ? 1 : -1;
                    const ax = px + side * 12;
                    const al = side > 0 ? 'left' : 'right';
                    if (U * eScale > 14) text(`U = ${U.toFixed(3)} J`, ax, (BASE_Y + Y(U)) / 2, COLORS.greenRGB, 255, al, 13);
                    if (K * eScale > 14) text(`K = ${K.toFixed(3)} J`, ax, (Y(U) + Y(E)) / 2, COLORS.purpleRGB, 255, al, 13);
                }
                p.fill(...COLORS.accentRGB);
                p.noStroke();
                p.ellipse(X(x), Y(U), 10, 10);

                // ── 数値（ばねとグラフの間に1行で）──
                const items = [
                    [`x = ${(x * 100).toFixed(1)} cm`, [255, 255, 255]],
                    [`v = ${v.toFixed(2)} m/s`, [255, 255, 255]],
                    [`K = ${K.toFixed(3)} J`, COLORS.purpleRGB],
                    [`U = ${U.toFixed(3)} J`, COLORS.greenRGB],
                    [`K + U = ${(K + U).toFixed(3)} J`, COLORS.accentRGB],
                ];
                p.fill(0, 0, 0, 90);
                p.noStroke();
                p.rect(40, 146, 720, 28, 8);
                items.forEach(([s2, rgb], i) => text(s2, 60 + i * 142, 160, rgb, 240, 'left', 13));

                text(`t = ${st.t.toFixed(2)} s`, 10, H - 10, [255, 255, 255], 130, 'left', 12, 'bottom');
                if (!isPlaying) text('⏸ 一時停止中', W - 12, H - 10, [255, 255, 255], 70, 'right', 12, 'bottom');
            };
        };
        const inst = new p5(sketch, containerRef.current);
        return () => inst.remove();
    }, []);

    return <div ref={containerRef} className="canvas-container" />;
}
