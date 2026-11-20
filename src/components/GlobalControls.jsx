/**
 * 再生・リセット・速度の操作
 *  variant="header" : PC のヘッダー用
 *  variant="bar"    : スマホの画面下・横向きのパネル上部用（大きめのボタン）
 */
const SPEEDS = [
    { v: 0.25, label: '¼×' },
    { v: 0.5, label: '½×' },
    { v: 1.0, label: '1×' },
];

function ResetIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
    );
}

function PlayPauseIcon({ playing }) {
    return playing ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
    ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="5,3 19,12 5,21" />
        </svg>
    );
}

export default function GlobalControls({
    isPlaying,
    onPlayPause,
    onReset,
    speedMultiplier,
    onSpeedChange,
    variant = 'header',
}) {
    const bar = variant === 'bar';
    return (
        <div className={`flex flex-wrap items-center gap-2 ${bar ? 'w-full' : ''}`}>
            <button
                id="btn-reset"
                type="button"
                className={`btn btn-danger ${bar ? 'px-3' : ''}`}
                onClick={onReset}
                title="リセット"
                aria-label="リセット"
            >
                <ResetIcon />
                <span className={bar ? 'hidden min-[420px]:inline' : ''}>リセット</span>
            </button>

            <button
                id="btn-play-pause"
                type="button"
                className={`btn whitespace-nowrap ${isPlaying ? 'btn-secondary' : 'btn-success'} ${bar ? 'flex-1 min-w-[6rem] justify-center' : ''}`}
                onClick={onPlayPause}
                title={isPlaying ? '一時停止' : '再生'}
            >
                <PlayPauseIcon playing={isPlaying} />
                {isPlaying ? '一時停止' : '再生'}
            </button>

            <div className={`flex items-center gap-1.5 ${bar ? '' : 'ml-1 pl-3 border-l border-slate-600'}`}>
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">速度</span>
                <div className="flex gap-1" role="group" aria-label="再生速度">
                    {SPEEDS.map(({ v, label }) => {
                        const active = Math.abs(speedMultiplier - v) < 0.01;
                        return (
                            <button
                                key={v}
                                type="button"
                                aria-pressed={active}
                                className={`rounded-lg text-sm font-semibold transition-colors ${bar ? 'px-2.5 py-2' : 'px-2 py-1'}
                                    ${active ? 'bg-sky-500 text-white shadow' : 'bg-slate-700/60 text-slate-300 hover:bg-slate-600'}`}
                                onClick={() => onSpeedChange(v)}
                                title={`${v} 倍速`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
