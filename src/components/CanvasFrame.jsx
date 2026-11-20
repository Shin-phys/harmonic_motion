import { useEffect, useRef, useState } from 'react';

/**
 * 図（p5 の Canvas）の表示枠
 *  描画の座標（800×500 など）はそのままに、枠の大きさに合わせて表示を拡大・縮小する。
 *  fit=true  : 枠の幅と高さの両方に収める（PC・スマホ横向き）
 *  fit=false : 幅に合わせ、高さは縦横比から決める（スマホ縦向き）
 */
export default function CanvasFrame({ aspect, fit = true, children }) {
    const ref = useRef(null);
    const [size, setSize] = useState(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const update = () => {
            const w = el.clientWidth;
            const h = el.clientHeight;
            let cw = w;
            let ch = w / aspect;
            if (fit && ch > h) {
                ch = h;
                cw = h * aspect;
            }
            const next = { w: Math.max(1, Math.floor(cw)), h: Math.max(1, Math.floor(ch)) };
            setSize((s) => (s && s.w === next.w && s.h === next.h ? s : next));
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [aspect, fit]);

    return (
        <div
            ref={ref}
            className={fit ? 'relative flex-1 min-h-0 min-w-0 flex items-center justify-center' : 'relative w-full'}
            style={!fit && size ? { height: size.h } : undefined}
        >
            <div
                className="canvas-frame"
                style={size ? { width: size.w, height: size.h, '--cw': `${size.w}px`, '--ch': `${size.h}px` } : { visibility: 'hidden' }}
            >
                {children}
            </div>
        </div>
    );
}
