/**
 * グローバルコントロールバー
 * リセット、再生/一時停止、スローモーション機能
 */
export default function GlobalControls({
    isPlaying,
    onPlayPause,
    onReset,
    speedMultiplier,
    onSpeedChange
}) {
    return (
        <div className="flex items-center flex-wrap gap-3">

            {/* 左：メイン操作 */}
            <div className="flex items-center gap-2.5">
                {/* リセットボタン */}
                <button
                    id="btn-reset"
                    className="btn btn-danger"
                    onClick={onReset}
                    title="リセット"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1 4 1 10 7 10" />
                        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                    リセット
                </button>

                {/* 再生/一時停止ボタン */}
                <button
                    id="btn-play-pause"
                    className={`btn ${isPlaying ? 'btn-secondary' : 'btn-success'}`}
                    onClick={onPlayPause}
                    title={isPlaying ? '一時停止' : '再生'}
                >
                    {isPlaying ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                    )}
                    {isPlaying ? '一時停止' : '再生'}
                </button>
            </div>

            {/* 右：スピードコントロール */}
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-slate-600">
                <span className="text-xs text-slate-500 font-medium">速度</span>

                <div className="flex gap-1.5">
                    {[0.25, 0.5, 1.0].map((speed) => (
                        <button
                            key={speed}
                            className={`text-xs font-semibold rounded-lg transition-all cursor-pointer border-none ${
                                Math.abs(speedMultiplier - speed) < 0.01
                                    ? 'text-white'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                            onClick={() => onSpeedChange(speed)}
                            title={`${speed}x`}
                            style={{
                                padding: '0.25rem 0.5rem',
                                background: Math.abs(speedMultiplier - speed) < 0.01
                                    ? 'linear-gradient(135deg, #3B82F6, #06B6D4)'
                                    : 'rgba(51, 65, 85, 0.4)',
                                boxShadow: Math.abs(speedMultiplier - speed) < 0.01
                                    ? '0 2px 8px rgba(59, 130, 246, 0.3)'
                                    : 'none',
                            }}
                        >
                            {speed === 0.25 ? '¼×' : speed === 0.5 ? '½×' : '1×'}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
