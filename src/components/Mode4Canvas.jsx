import { useEffect, useRef, useCallback } from 'react';
import p5 from 'p5';
import { COLORS, drawSpring, drawDashedLine, drawGrid } from '../utils/physics';

/**
 * Mode 4: 摩擦のある振動
 * 上段: 摩擦なし（解析解）、下段: 摩擦あり（シンプレクティック・オイラー）
 */
export default function Mode4Canvas({
    isPlaying, speedMultiplier, mu,
    showEquilibrium, showEnvelope, showEqPlot,
    onTimeUpdate
}) {
    const containerRef = useRef(null);
    const p5Ref = useRef(null);
    const stateRef = useRef({
        t: 0,
        x_f: 1.0, v_f: 0, stopped: false,
        trail1: [], trail2: [],
        peaks: [{ t: 0, y: 1.0 }],
        eqPoints: [],
    });

    // 物理パラメータ
    const m = 1.0, k = 10.0, A0 = 1.0, g = 4.0;
    const omega = Math.sqrt(k / m);
    const pxScale = 70;

    const sketch = useCallback((p) => {
        const W = 800, H = 560;
        // レイアウト
        const sys1Cy = 120, sys2Cy = 390;
        const sysLeft = 25, eqX = 170;
        const graphLeft = 310, graphRight = W - 25;
        const graphW = graphRight - graphLeft;
        const graph1Cy = 120, graph2Cy = 390;
        const graphAmpPx = 80;

        p.setup = () => { p.createCanvas(W, H); p.textFont('Inter'); };

        p.draw = () => {
            const state = stateRef.current;
            p.background(13, 17, 23);
            drawGrid(p, W, H, 50);

            // ── 時間進行 & 物理計算 ──
            if (isPlaying) {
                const dtFrame = (p.deltaTime / 1000) * speedMultiplier;
                const dtPhys = 0.0002;
                const nSteps = Math.max(1, Math.floor(dtFrame / dtPhys));
                const dt = dtFrame / nSteps;

                for (let i = 0; i < nSteps; i++) {
                    if (!state.stopped) {
                        const oldV = state.v_f;
                        let fric = 0;
                        if (Math.abs(state.v_f) > 1e-10) {
                            fric = -Math.sign(state.v_f) * mu * m * g;
                        }
                        const a = (-k * state.x_f + fric) / m;
                        state.v_f += a * dt;

                        // 符号反転検出
                        if (Math.abs(oldV) > 1e-8 && oldV * state.v_f <= 0) {
                            state.peaks.push({ t: state.t, y: state.x_f });
                            if (mu > 0) {
                                const eqY = oldV > 0 ? -mu * m * g / k : mu * m * g / k;
                                state.eqPoints.push({ t: state.t, y: eqY });
                            }
                            if (mu > 0 && Math.abs(k * state.x_f) <= (mu + 0.05) * m * g) {
                                state.v_f = 0;
                                state.stopped = true;
                            }
                        }
                        if (!state.stopped) state.x_f += state.v_f * dt;
                    }
                    state.t += dt;
                }
                const yClean = A0 * Math.cos(omega * state.t);
                state.trail1.push({ t: state.t, y: yClean });
                state.trail2.push({ t: state.t, y: state.x_f });
                if (state.trail1.length > 2500) { state.trail1.shift(); state.trail2.shift(); }
            }

            const yClean = A0 * Math.cos(omega * state.t);
            const yFric = state.x_f;

            // ── 系1: 摩擦なし ──
            drawSys(p, sysLeft, sys1Cy, eqX, yClean * pxScale, '摩擦なし', COLORS.primaryRGB, false);
            // ── 系2: 摩擦あり ──
            drawSys(p, sysLeft, sys2Cy, eqX, yFric * pxScale, `摩擦あり (μ'=${mu.toFixed(2)})`, COLORS.accentRGB, true);

            // 動的平衡点ライン
            if (showEquilibrium && !state.stopped && mu > 0) {
                const eqPos = (state.v_f >= 0 ? -1 : 1) * mu * m * g / k;
                const epx = eqX + eqPos * pxScale;
                p.stroke(16, 185, 129, 160);
                p.strokeWeight(2);
                drawDashedLine(p, epx, sys2Cy - 35, epx, sys2Cy + 35, 4, 3);
                p.fill(16, 185, 129, 200);
                p.noStroke();
                p.textSize(8);
                p.textAlign(p.CENTER, p.TOP);
                p.text('平衡点', epx, sys2Cy + 37);
            }

            // ── 区切り線 ──
            p.stroke(255, 255, 255, 15);
            p.strokeWeight(1);
            p.line(15, H / 2, W - 15, H / 2);
            // ラベル
            p.fill(255, 255, 255, 40);
            p.noStroke();
            p.textSize(9);
            p.textAlign(p.LEFT, p.CENTER);
            p.text('▲ 摩擦なし', 15, H / 2 - 8);
            p.text('▼ 摩擦あり', 15, H / 2 + 10);

            // ── y-tグラフ (上段: 摩擦なし) ──
            drawGraph(p, graphLeft, graphRight, graphW, graph1Cy, graphAmpPx,
                state.trail1, COLORS.primaryRGB, 'y-t（摩擦なし）', null, null, false, false);

            // ── y-tグラフ (下段: 摩擦あり + 包絡線 + 平衡点プロット) ──
            drawGraph(p, graphLeft, graphRight, graphW, graph2Cy, graphAmpPx,
                state.trail2, COLORS.accentRGB, 'y-t（摩擦あり）',
                showEnvelope ? state.peaks : null,
                showEqPlot ? state.eqPoints : null,
                showEquilibrium, mu);

            // 時間表示
            p.fill(255, 255, 255, 120);
            p.noStroke();
            p.textSize(11);
            p.textAlign(p.LEFT, p.TOP);
            p.text(`t = ${state.t.toFixed(2)} s`, 10, 10);
            if (state.stopped) {
                p.fill(249, 115, 22, 200);
                p.text('■ 停止', 100, 10);
            }
            if (!isPlaying) {
                p.fill(255, 255, 255, 40);
                p.textSize(12);
                p.textAlign(p.CENTER, p.BOTTOM);
                p.text('⏸ 一時停止中', W / 2, H - 10);
            }
            if (onTimeUpdate) onTimeUpdate(state.t, { yClean, yFric });
        };

        // ── 水平バネ系の描画 ──
        function drawSys(p, left, cy, eqXpos, disp, label, col, hasFric) {
            // 背景
            p.fill(255, 255, 255, 6);
            p.noStroke();
            p.rect(left - 5, cy - 60, 260, 120, 8);
            // 壁
            p.fill(255, 255, 255, 35);
            p.noStroke();
            p.rect(left, cy - 28, 5, 56);
            p.stroke(255, 255, 255, 50);
            p.strokeWeight(1);
            for (let i = 0; i < 5; i++) p.line(left, cy - 22 + i * 11, left - 5, cy - 17 + i * 11);
            // 平衡位置
            p.stroke(255, 255, 255, 25);
            p.strokeWeight(1);
            drawDashedLine(p, eqXpos, cy - 45, eqXpos, cy + 45, 3, 3);
            // バネ & 質量
            const mx = eqXpos + disp;
            p.stroke(...col, 170);
            p.strokeWeight(2);
            drawSpring(p, left + 5, cy, mx - 14, cy, 12, 10);
            p.fill(...col);
            p.stroke(...col, 80);
            p.strokeWeight(1);
            p.rectMode(p.CENTER);
            p.rect(mx, cy, 28, 28, 4);
            p.rectMode(p.CORNER);
            p.fill(255);
            p.noStroke();
            p.textSize(10);
            p.textAlign(p.CENTER, p.CENTER);
            p.text('m', mx, cy);
            // 摩擦面
            if (hasFric) {
                p.stroke(255, 255, 255, 40);
                p.strokeWeight(1);
                p.line(left - 8, cy + 15, left + 255, cy + 15);
                p.stroke(255, 255, 255, 18);
                for (let x = left; x < left + 255; x += 7) p.line(x, cy + 15, x - 3, cy + 20);
            }
            // ラベル
            p.fill(255, 255, 255, 130);
            p.noStroke();
            p.textSize(10);
            p.textAlign(p.LEFT, p.TOP);
            p.text(label, left, cy - 56);
        }

        // ── グラフ描画 ──
        function drawGraph(p, gL, gR, gW, gCy, ampPx, trail, col, title, peaks, eqPts, showEqLine, muVal) {
            // 背景
            p.fill(0, 0, 0, 30);
            p.noStroke();
            p.rect(gL - 8, gCy - ampPx - 25, gW + 16, ampPx * 2 + 50, 6);
            // 軸
            p.stroke(255, 255, 255, 50);
            p.strokeWeight(1);
            p.line(gL, gCy, gR, gCy);
            p.line(gL, gCy - ampPx - 10, gL, gCy + ampPx + 10);
            // 振幅ライン
            p.stroke(255, 255, 255, 15);
            p.strokeWeight(0.5);
            drawDashedLine(p, gL, gCy - ampPx, gR, gCy - ampPx, 4, 4);
            drawDashedLine(p, gL, gCy + ampPx, gR, gCy + ampPx, 4, 4);
            // ラベル
            p.fill(255, 255, 255, 70);
            p.noStroke();
            p.textSize(10);
            p.textAlign(p.CENTER, p.TOP);
            p.text(title, (gL + gR) / 2, gCy - ampPx - 22);
            p.textAlign(p.RIGHT, p.CENTER);
            p.textSize(9);
            p.text('A', gL - 5, gCy - ampPx);
            p.text('-A', gL - 5, gCy + ampPx);
            p.textAlign(p.CENTER, p.TOP);
            p.text('t', gR + 10, gCy - 5);

            if (trail.length < 2) return;
            const tScale = 40;
            const latestT = trail[trail.length - 1].t;
            const scrollT = Math.max(0, latestT - gW / tScale);
            const yScale = ampPx / A0;

            // 平衡点水平ライン（摩擦あり系のみ）
            if (showEqLine && muVal > 0) {
                const eqPhy = muVal * m * g / k;
                const eqPx = eqPhy * yScale;
                p.stroke(16, 185, 129, 50);
                p.strokeWeight(0.5);
                drawDashedLine(p, gL, gCy - eqPx, gR, gCy - eqPx, 3, 4);
                drawDashedLine(p, gL, gCy + eqPx, gR, gCy + eqPx, 3, 4);
                p.fill(16, 185, 129, 60);
                p.noStroke();
                p.textSize(7);
                p.textAlign(p.LEFT, p.CENTER);
                p.text('+μ\'mg/k', gR - 45, gCy - eqPx);
                p.text('-μ\'mg/k', gR - 45, gCy + eqPx);
            }

            // 波形プロット
            p.stroke(...col, 220);
            p.strokeWeight(1.5);
            p.noFill();
            p.beginShape();
            for (const pt of trail) {
                const px = gL + (pt.t - scrollT) * tScale;
                if (px >= gL && px <= gR) p.vertex(px, gCy - pt.y * yScale);
            }
            p.endShape();

            // 現在点
            const cpx = gL + (latestT - scrollT) * tScale;
            if (cpx >= gL && cpx <= gR) {
                const lastY = trail[trail.length - 1].y;
                p.fill(...col);
                p.noStroke();
                p.ellipse(cpx, gCy - lastY * yScale, 7, 7);
                p.fill(...col, 35);
                p.ellipse(cpx, gCy - lastY * yScale, 14, 14);
            }

            // 包絡線
            if (peaks && peaks.length >= 2) {
                const posPeaks = peaks.filter(pk => pk.y > 0);
                const negPeaks = peaks.filter(pk => pk.y <= 0);
                const drawEnv = (arr, r, g2, b) => {
                    if (arr.length < 2) return;
                    p.stroke(r, g2, b, 140);
                    p.strokeWeight(1);
                    for (let i = 0; i < arr.length - 1; i++) {
                        const x1 = gL + (arr[i].t - scrollT) * tScale;
                        const x2 = gL + (arr[i + 1].t - scrollT) * tScale;
                        if (x2 >= gL && x1 <= gR) {
                            drawDashedLine(p, Math.max(x1, gL), gCy - arr[i].y * yScale,
                                Math.min(x2, gR), gCy - arr[i + 1].y * yScale, 5, 3);
                        }
                    }
                };
                drawEnv(posPeaks, 6, 182, 212);
                drawEnv(negPeaks, 6, 182, 212);
            }

            // 平衡点プロット（三角マーク）
            if (eqPts && eqPts.length > 0) {
                p.fill(16, 185, 129, 220);
                p.noStroke();
                for (const ep of eqPts) {
                    const px = gL + (ep.t - scrollT) * tScale;
                    if (px >= gL && px <= gR) {
                        const py = gCy - ep.y * yScale;
                        p.triangle(px - 4, py + 4, px + 4, py + 4, px, py - 4);
                    }
                }
            }
        }
    }, [isPlaying, speedMultiplier, mu, showEquilibrium, showEnvelope, showEqPlot, onTimeUpdate]);

    useEffect(() => {
        if (!containerRef.current) return;
        const inst = new p5(sketch, containerRef.current);
        p5Ref.current = inst;
        return () => { inst.remove(); p5Ref.current = null; };
    }, [sketch]);

    return <div ref={containerRef} className="canvas-container" />;
}
