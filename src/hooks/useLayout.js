import { useEffect, useState } from 'react';

/** メディアクエリが当てはまるか */
export function useMedia(query) {
    const [hit, setHit] = useState(() => window.matchMedia(query).matches);
    useEffect(() => {
        const m = window.matchMedia(query);
        const f = () => setHit(m.matches);
        f();
        m.addEventListener('change', f);
        return () => m.removeEventListener('change', f);
    }, [query]);
    return hit;
}

/**
 * 画面の使い方
 *  wide      : PC（幅 1024px 以上）… 図とパネルを左右に並べ、1画面に収める
 *  landscape : スマホ横向き（高さが低い）… 図とパネルを左右に並べる
 *  compact   : スマホ縦・タブレット縦 … 図の下にパネル、再生ボタンは画面下に固定
 */
export function useLayoutMode() {
    const wide = useMedia('(min-width: 1024px)');
    const landscape = useMedia('(max-height: 560px) and (orientation: landscape)');
    if (landscape) return 'landscape';
    return wide ? 'wide' : 'compact';
}
