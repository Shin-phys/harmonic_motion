import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { COLORS, drawSpring, drawDashedLine, drawGrid, drawArrow } from '../utils/physics';

/**
 * 鉛直ばね振り子：自然長 → つり合いの位置 → 振動 → 水平ばねとの比較
 *  座標：下向きを正とし、y はつり合いの位置からの変位（y = A cos ωt、下に引いて放す）
 */
const G = 9.8;
const S = 200;           // 1 m あたりの px
const CEIL_Y = 50;       // 天井
const L0 = 0.4;          // ばねの自然長 [m]
const NAT_Y = CEIL_Y + L0 * S;
const COL = [85, 205, 330];
const BOX = 34;
const GRAPH_L = 525;
const GRAPH_R = 780;
const T_SCALE = 60;      // グラフ：1 s あたりの px
const F_SCALE = 5;       // 力の矢印：1 N あたりの px

export default function VerticalSpringCanvas(props) {
    const containerRef = useRef(null);
    const propsRef = useRef(props);
    useEffect(() => {
        propsRef.current = props;
    });
    const stateRef = useRef({ t: 0, trail: [] });

    useEffect(() => {
        if (!containerRef.current) return undefined;
        const { m, k, A } = propsRef.current;
        const omega = Math.sqrt(k / m);
        const d = (m * G) / k;           // つり合いの位置での伸び [m]
        const EQ_Y = NAT_Y + d * S;

        const sketch = (p) => {
            const W = 800;
            const H = 560;

            const ceiling = (x) => {
                p.fill(255, 255, 255, 40);
                p.noStroke();
                p.rect(x - 22, CEIL_Y - 6, 44, 6);
                p.stroke(255, 255, 255, 70);
                p.strokeWeight(1);
                for (let i = 0; i < 8; i++) p.line(x - 20 + i * 6, CEIL_Y - 6, x - 24 + i * 6, CEIL_Y - 12);
            };

            const massBox = (x, yTop, rgb, label = 'm') => {
                p.fill(...rgb);
                p.stroke(...rgb, 120);
                p.strokeWeight(1);
                p.rect(x - BOX / 2, yTop, BOX, BOX, 5);
                p.fill(255);
                p.noStroke();
                p.textSize(13);
                p.textAlign(p.CENTER, p.CENTER);
                p.text(label, x, yTop + BOX / 2);
            };

            const label = (txt, x, y, rgb = [255, 255, 255], a = 200, align = 'center', size = 12) => {
                p.fill(...rgb, a);
                p.noStroke();
                p.textSize(size);
                p.textAlign(align === 'left' ? p.LEFT : align === 'right' ? p.RIGHT : p.CENTER, p.CENTER);
                p.text(txt, x, y);
            };

            const forceArrow = (x, y0, F, rgb, txt, side = 1) => {
                const len = F * F_SCALE;
                if (Math.abs(len) < 2) return;
                p.stroke(...rgb);
                p.fill(...rgb);
                p.strokeWeight(3);
                drawArrow(p, x, y0, x, y0 + len, 9);
                label(txt, x + side * 8, y0 + len / 2, rgb, 255, side > 0 ? 'left' : 'right', 12);
            };

            p.setup = () => {
                p.pixelDensity(2);
                p.createCanvas(W, H);
                p.textFont('Inter');
            };

            p.draw = () => {
                const state = stateRef.current;
                const { step, isPlaying, speedMultiplier, showForces } = propsRef.current;
                p.background(13, 17, 23);
                drawGrid(p, W, H, 50);

                if (isPlaying && step >= 2) state.t += (p.deltaTime / 1000) * speedMultiplier;
                const y = A * Math.cos(omega * state.t);      // つり合いの位置からの変位（下向き正）
                const posY = EQ_Y + y * S;

                // ── 基準線（自然長・つり合いの位置）──
                const lineRight = step >= 2 ? GRAPH_R : COL[step] + 60;
                p.stroke(255, 255, 255, 70);
                p.strokeWeight(1);
                drawDashedLine(p, 30, NAT_Y, lineRight, NAT_Y, 6, 5);
                label('自然長', 28, NAT_Y - 10, [255, 255, 255], 170, 'left');
                if (step >= 2) label('自然長の位置', GRAPH_R - 4, NAT_Y - 10, [255, 255, 255], 170, 'right');
                if (step >= 1) {
                    p.stroke(...COLORS.greenRGB, 170);
                    drawDashedLine(p, 30, EQ_Y, lineRight, EQ_Y, 6, 5);
                    label('つり合い', 28, EQ_Y - 10, COLORS.greenRGB, 230, 'left');

                }

                // ── ① 自然長 ──
                ceiling(COL[0]);
                p.stroke(...COLORS.primaryRGB, 190);
                p.strokeWeight(2);
                p.noFill();
                drawSpring(p, COL[0], CEIL_Y, COL[0], NAT_Y, 12, 10);
                label('① ばねだけ', COL[0], 22);

                // ── ② つり合い ──
                if (step >= 1) {
                    ceiling(COL[1]);
                    p.stroke(...COLORS.primaryRGB, 190);
                    p.strokeWeight(2);
                    p.noFill();
                    drawSpring(p, COL[1], CEIL_Y, COL[1], EQ_Y, 12, 10);
                    massBox(COL[1], EQ_Y, COLORS.primaryRGB);
                    // 伸び d
                    p.stroke(...COLORS.accentRGB);
                    p.fill(...COLORS.accentRGB);
                    p.strokeWeight(1.5);
                    if (d * S > 14) {
                        drawArrow(p, COL[1] + 30, NAT_Y, COL[1] + 30, EQ_Y, 7);
                        drawArrow(p, COL[1] + 30, EQ_Y, COL[1] + 30, NAT_Y, 7);
                    }
                    label('d', COL[1] + 38, (NAT_Y + EQ_Y) / 2, COLORS.accentRGB, 255, 'left', 14);
                    label(`伸び d = mg/k = ${(d * 100).toFixed(1)} cm`, COL[1], EQ_Y + BOX + 18, COLORS.accentRGB, 255);
                    // 力のつり合い
                    if (step === 1 || showForces) {
                        const cy = EQ_Y + BOX / 2;
                        forceArrow(COL[1] - 26, cy, -k * d, [96, 165, 250], `弾性力 kd`, -1);
                        forceArrow(COL[1] - 26, cy, m * G, [251, 146, 60], `重力 mg`, -1);
                    }
                    label('② つるしてつり合い', COL[1], 22);
                }

                // ── ③ 振動 ──
                if (step >= 2) {
                    ceiling(COL[2]);
                    p.stroke(...COLORS.primaryRGB, 190);
                    p.strokeWeight(2);
                    p.noFill();
                    drawSpring(p, COL[2], CEIL_Y, COL[2], posY, 12, 10);
                    massBox(COL[2], posY, COLORS.primaryRGB);
                    // 振幅の範囲
                    p.stroke(...COLORS.primaryRGB, 90);
                    p.strokeWeight(1);
                    drawDashedLine(p, COL[2] - 50, EQ_Y - A * S, COL[2] - 22, EQ_Y - A * S, 3, 3);
                    drawDashedLine(p, COL[2] - 50, EQ_Y + A * S, COL[2] - 22, EQ_Y + A * S, 3, 3);
                    label('−A', COL[2] - 54, EQ_Y - A * S, COLORS.primaryRGB, 220, 'right');
                    label('+A', COL[2] - 54, EQ_Y + A * S, COLORS.primaryRGB, 220, 'right');

                    if (showForces) {
                        const cy = posY + BOX / 2;
                        // 弾性力と重力（矢印の先にラベル）、少し右に合力
                        const fs = -k * (d + y) * F_SCALE;
                        const fg = m * G * F_SCALE;
                        forceArrow(COL[2] + 26, cy, -k * (d + y), [96, 165, 250], '', 1);
                        forceArrow(COL[2] + 26, cy, m * G, [251, 146, 60], '', 1);
                        label('k(d+y)', COL[2] + 32, cy + fs + 6, [96, 165, 250], 255, 'left');
                        label('mg', COL[2] + 32, cy + fg - 6, [251, 146, 60], 255, 'left');
                        forceArrow(COL[2] + 100, cy, -k * y, COLORS.redRGB, '', 1);
                        label('合力 −ky', COL[2] + 108, cy, COLORS.redRGB, 255, 'left');
                    }
                    label('③ 引いて放す', COL[2], 22);

                    // y-t 図（縦の位置は装置とそろえる）
                    if (isPlaying) {
                        state.trail.push({ t: state.t, py: posY });
                        if (state.trail.length > 3000) state.trail.shift();
                    }
                    p.fill(0, 0, 0, 50);
                    p.noStroke();
                    p.rect(GRAPH_L - 10, CEIL_Y, GRAPH_R - GRAPH_L + 20, EQ_Y + A * S + 50 - CEIL_Y, 8);
                    p.stroke(255, 255, 255, 90);
                    p.strokeWeight(1);
                    p.line(GRAPH_L, CEIL_Y + 10, GRAPH_L, EQ_Y + A * S + 40);
                    label('位置（下向き）− 時間', (GRAPH_L + GRAPH_R) / 2, CEIL_Y + 16, [255, 255, 255], 200);
                    label('t →', GRAPH_R - 8, EQ_Y + A * S + 34, [255, 255, 255], 160, 'right');
                    label('緑の点線：つり合いの位置 ＝ 振動の中心', GRAPH_L + 6, EQ_Y + A * S + 34, COLORS.greenRGB, 230, 'left', 11);
                    const latest = state.trail.length ? state.trail[state.trail.length - 1].t : 0;
                    const scrollT = Math.max(0, latest - (GRAPH_R - GRAPH_L) / T_SCALE);
                    p.stroke(...COLORS.primaryRGB);
                    p.strokeWeight(2);
                    p.noFill();
                    p.beginShape();
                    for (const pt of state.trail) {
                        const px = GRAPH_L + (pt.t - scrollT) * T_SCALE;
                        if (px >= GRAPH_L && px <= GRAPH_R) p.vertex(px, pt.py);
                    }
                    p.endShape();
                    const cx = GRAPH_L + (latest - scrollT) * T_SCALE;
                    p.fill(...COLORS.primaryRGB);
                    p.noStroke();
                    p.ellipse(Math.min(cx, GRAPH_R), posY + BOX / 2 - BOX / 2, 9, 9);
                    p.stroke(...COLORS.primaryRGB, 60);
                    p.strokeWeight(1);
                    drawDashedLine(p, COL[2] + BOX / 2, posY, Math.min(cx, GRAPH_R) - 5, posY, 4, 4);
                }

                // ── ④ 水平ばねとの比較 ──
                if (step >= 3) {
                    const hy = 495;
                    const wallX = 60;
                    const eqX = 300;
                    const xh = eqX + y * S;
                    p.fill(255, 255, 255, 8);
                    p.noStroke();
                    p.rect(30, hy - 50, 740, 92, 8);
                    p.fill(255, 255, 255, 40);
                    p.rect(wallX - 6, hy - 26, 6, 52);
                    p.stroke(255, 255, 255, 50);
                    p.line(wallX - 8, hy + 18, 760, hy + 18);
                    p.stroke(...COLORS.accentRGB, 190);
                    p.strokeWeight(2);
                    p.noFill();
                    drawSpring(p, wallX, hy, xh - BOX / 2, hy, 12, 9);
                    massBox(xh, hy - BOX / 2, COLORS.accentRGB);
                    p.stroke(255, 255, 255, 60);
                    p.strokeWeight(1);
                    drawDashedLine(p, eqX, hy - 40, eqX, hy + 16, 3, 3);
                    label('④ 同じ m・k を水平に置くと（摩擦なし）', 40, hy - 38, COLORS.accentRGB, 230, 'left');
                    const T = (2 * Math.PI) / omega;
                    label(`どちらも T = 2π√(m/k) = ${T.toFixed(2)} s`, 470, hy, [255, 255, 255], 230, 'left', 14);
                    label('重力は振動の中心をずらすだけ', 470, hy + 22, COLORS.greenRGB, 230, 'left', 12);
                }

                // 時間
                p.fill(255, 255, 255, 130);
                p.noStroke();
                p.textSize(12);
                p.textAlign(p.LEFT, p.BOTTOM);
                if (step >= 2) p.text(`t = ${state.t.toFixed(2)} s`, 10, H - 8);
                if (step >= 2 && !isPlaying) {
                    p.fill(255, 255, 255, 70);
                    p.textAlign(p.RIGHT, p.BOTTOM);
                    p.text('⏸ 一時停止中（再生で動き出す）', W - 12, H - 8);
                }
            };
        };
        const inst = new p5(sketch, containerRef.current);
        return () => inst.remove();
    }, []);

    return <div ref={containerRef} className="canvas-container" />;
}
