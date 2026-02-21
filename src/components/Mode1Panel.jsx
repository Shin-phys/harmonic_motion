/**
 * Mode 1: 操作パネル
 * ステップ制御、ベクトル表示、グラフ切り替え
 */
export default function Mode1Panel({
    step,
    onStepChange,
    showVectors,
    onShowVectorsChange,
    showYtGraph,
    onShowYtGraphChange,
    showVtGraph,
    onShowVtGraphChange,
    showAtGraph,
    onShowAtGraphChange
}) {
    const stepsConfig = [
        {
            id: 1,
            title: 'Step 1',
            name: '等速円運動',
            desc: '半径 A、角速度 ω で等速円運動する物体を観察します。',
            detail: '物体は一定の速さで円軌道上を回り続けます。',
        },
        {
            id: 1.5,
            title: 'Step 1.5',
            name: '速度と加速度',
            desc: '円運動における速度ベクトルと加速度ベクトルを表示します。',
            detail: '速度は接線方向、加速度は中心方向を向いています。',
        },
        {
            id: 2,
            title: 'Step 2',
            name: 'y軸への投影',
            desc: '円運動の y 座標だけを取り出すと、上下に振動する運動になります。',
            detail: 'これが単振動の本質です。円運動を「横から見た」ものと同じです。',
        },
        {
            id: 3,
            title: 'Step 3',
            name: 'バネ接続',
            desc: '投影点にバネを接続します。バネの伸縮と投影点の動きが完全に一致します。',
            detail: 'バネの復元力 F = −kx が、この単振動を生み出します。',
        },
        {
            id: 4,
            title: 'Step 4',
            name: 'y-t グラフ',
            desc: '時間経過に伴う変位をグラフにプロットします。正弦波が現れます。',
            detail: 'y = A sin(ωt + φ) という式が、この波形を完全に記述します。',
        },
        {
            id: 5,
            title: 'Step 5',
            name: '速度と加速度の考察',
            desc: '次は速度と加速度について考えてみましょう。',
            detail: '円運動の速度と加速度が、単振動でどのように現れるかを確認します。',
        },
        {
            id: 6,
            title: 'Step 6',
            name: 'ベクトルの投影',
            desc: '速度ベクトルと加速度ベクトルをy軸へ投影します。',
            detail: '速度のy成分はy軸の隣に、加速度ベクトルは重心を始点として表示されます。',
        },
        {
            id: 7,
            title: 'Step 7',
            name: 'エネルギー保存',
            desc: '運動エネルギーと弾性エネルギーの変化を観察します。',
            detail: '摩擦がない場合、二つのエネルギーの和（力学的エネルギー）は常に一定です。',
        },
    ];

    const currentStepIndex = stepsConfig.findIndex((s) => s.id === step);
    const currentStepConfig = stepsConfig[currentStepIndex];

    const handlePrev = () => {
        if (currentStepIndex > 0) {
            onStepChange(stepsConfig[currentStepIndex - 1].id);
        }
    };

    const handleNext = () => {
        if (currentStepIndex < stepsConfig.length - 1) {
            onStepChange(stepsConfig[currentStepIndex + 1].id);
        }
    };

    return (
        <div className="space-y-5">
            {/* ステップインジケーター */}
            <div className="flex items-center justify-center gap-1 flex-wrap">
                {stepsConfig.map((s, i) => (
                    <div key={s.id} className="flex items-center">
                        <div
                            className={`step-dot ${s.id === step ? 'active' : i < currentStepIndex ? 'completed' : ''}`}
                            title={`${s.title}: ${s.name}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onStepChange(s.id)}
                        />
                        {i < stepsConfig.length - 1 && (
                            <div className={`w-3 h-0.5 ${i < currentStepIndex ? 'bg-emerald-500/60' : 'bg-slate-700'} mx-0.5 rounded-full`} />
                        )}
                    </div>
                ))}
            </div>

            {/* 現在のステップ情報 */}
            <div className="fade-in" key={step}>
                <h3 className="step-title">
                    <span className="step-number">{currentStepConfig?.title}:</span>
                    <span className="step-name">{currentStepConfig?.name}</span>
                </h3>
                <p className="text-sm text-slate-300 mb-3 leading-relaxed">
                    {currentStepConfig?.desc}
                </p>
                <div className="explanation-box">
                    {currentStepConfig?.detail}
                </div>
            </div>

            {/* Step 2, 3, 4: ベクトル表示切り替え */}
            {(step === 2 || step === 3 || step === 4) && (
                <div className="fade-in">
                    <button
                        className={`toggle-btn w-full ${showVectors ? 'active' : ''}`}
                        onClick={() => onShowVectorsChange(!showVectors)}
                        style={showVectors ? { borderColor: 'rgba(139, 92, 246, 0.3)', background: 'rgba(139, 92, 246, 0.08)' } : {}}
                    >
                        <span className="toggle-dot" style={showVectors ? { background: '#8B5CF6', boxShadow: '0 0 6px #8B5CF6' } : {}} />
                        {showVectors ? '速度・加速度ベクトルを表示中' : '速度・加速度ベクトルを表示'}
                    </button>
                </div>
            )}

            {/* Step 6 & 7: グラフ表示切り替えボタン */}
            {(step === 6 || step === 7) && (
                <div className="fade-in toggle-group">
                    <p className="section-header">グラフ表示</p>

                    {/* y-tグラフ */}
                    <button
                        className={`toggle-btn ${showYtGraph ? 'active' : ''}`}
                        onClick={() => onShowYtGraphChange(!showYtGraph)}
                        style={showYtGraph ? { borderColor: 'rgba(59, 130, 246, 0.3)', background: 'rgba(59, 130, 246, 0.08)' } : {}}
                    >
                        <span className="toggle-dot" style={showYtGraph ? { background: '#3B82F6', boxShadow: '0 0 6px #3B82F6' } : {}} />
                        y-t グラフ（変位）
                    </button>

                    {/* v-tグラフ */}
                    <button
                        className={`toggle-btn ${showVtGraph ? 'active' : ''}`}
                        onClick={() => onShowVtGraphChange(!showVtGraph)}
                        style={showVtGraph ? { borderColor: 'rgba(139, 92, 246, 0.3)', background: 'rgba(139, 92, 246, 0.08)' } : {}}
                    >
                        <span className="toggle-dot" style={showVtGraph ? { background: '#8B5CF6', boxShadow: '0 0 6px #8B5CF6' } : {}} />
                        v-t グラフ（速度）
                    </button>

                    {/* a-tグラフ */}
                    <button
                        className={`toggle-btn ${showAtGraph ? 'active' : ''}`}
                        onClick={() => onShowAtGraphChange(!showAtGraph)}
                        style={showAtGraph ? { borderColor: 'rgba(249, 115, 22, 0.3)', background: 'rgba(249, 115, 22, 0.08)' } : {}}
                    >
                        <span className="toggle-dot" style={showAtGraph ? { background: '#F97316', boxShadow: '0 0 6px #F97316' } : {}} />
                        a-t グラフ（加速度）
                    </button>

                    <p className="text-xs text-slate-500 pl-5">
                        ※ グラフ領域に重ねて表示します
                    </p>
                </div>
            )}

            {/* ナビゲーションボタン */}
            <div className="flex gap-3 pt-2">
                <button
                    className="btn btn-secondary flex-1"
                    onClick={handlePrev}
                    disabled={currentStepIndex <= 0}
                    style={{ opacity: currentStepIndex <= 0 ? 0.35 : 1 }}
                >
                    ← 戻る
                </button>
                <button
                    className="btn btn-primary flex-1"
                    onClick={handleNext}
                    disabled={currentStepIndex >= stepsConfig.length - 1}
                    style={{ opacity: currentStepIndex >= stepsConfig.length - 1 ? 0.35 : 1 }}
                >
                    進む →
                </button>
            </div>

            {/* 数式情報 (Step 2以降) */}
            {step >= 2 && (
                <div className="formula-card fade-in">
                    <p className="formula-label">現在の運動式</p>
                    <p className="text-sm font-mono" style={{ color: '#60A5FA' }}>
                        y = A sin(ωt + π/2) = A cos(ωt)
                    </p>
                </div>
            )}
        </div>
    );
}
