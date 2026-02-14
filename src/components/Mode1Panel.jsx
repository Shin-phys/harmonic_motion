export default function Mode1Panel({
    step,
    onStepChange,
    showVectors,
    onShowVectorsChange,
    showVtGraph,
    onShowVtGraphChange,
    showAtGraph,
    onShowAtGraphChange
}) {
    const stepsConfig = [
        {
            id: 1,
            title: 'Step 1: 等速円運動',
            desc: '半径 A、角速度 ω で等速円運動する物体を観察します。',
            detail: '物体は一定の速さで円軌道上を回り続けます。',
        },
        {
            id: 1.5,
            title: 'Step 1.5: 速度と加速度',
            desc: '円運動における速度ベクトルと加速度ベクトルを表示します。',
            detail: '速度は接線方向、加速度は中心方向を向いています。',
        },
        {
            id: 2,
            title: 'Step 2: y軸への投影',
            desc: '円運動の y 座標だけを取り出すと、上下に振動する運動になります。',
            detail: 'これが単振動の本質です。円運動を「横から見た」ものと同じです。',
        },
        {
            id: 3,
            title: 'Step 3: バネ接続',
            desc: '投影点にバネを接続します。バネの伸縮と投影点の動きが完全に一致します。',
            detail: 'バネの復元力 F = −kx が、この単振動を生み出します。',
        },
        {
            id: 4,
            title: 'Step 4: y-t グラフ',
            desc: '時間経過に伴う変位をグラフにプロットします。正弦波が現れます。',
            detail: 'y = A sin(ωt + φ) という式が、この波形を完全に記述します。',
        },
        {
            id: 5,
            title: 'Step 5: 速度と加速度の考察',
            desc: '次は速度と加速度について考えてみましょう。',
            detail: '円運動の速度と加速度が、単振動でどのように現れるかを確認します。',
        },
        {
            id: 6,
            title: 'Step 6: ベクトルの投影',
            desc: '速度ベクトルと加速度ベクトルをy軸へ投影します。',
            detail: '速度のy成分はy軸の隣に、加速度ベクトルは重心を始点として表示されます。',
        },
        {
            id: 7,
            title: 'Step 7: エネルギー保存',
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
        <div className="space-y-4">
            {/* ステップインジケーター */}
            <div className="flex items-center justify-center gap-1 mb-4 flex-wrap">
                {stepsConfig.map((s, i) => (
                    <div key={s.id} className="flex items-center">
                        <div
                            className={`step-dot ${s.id === step ? 'active' : i < currentStepIndex ? 'completed' : ''}`}
                            title={s.title}
                        />
                        {i < stepsConfig.length - 1 && (
                            <div className={`w-3 h-0.5 ${i < currentStepIndex ? 'bg-green-500' : 'bg-slate-600'} mx-0.5`} />
                        )}
                    </div>
                ))}
            </div>

            {/* 現在のステップ情報 */}
            <div className="fade-in" key={step}>
                <h3 className="text-sm font-semibold text-blue-400 mb-1">
                    {currentStepConfig?.title}
                </h3>
                <p className="text-sm text-slate-300 mb-2">
                    {currentStepConfig?.desc}
                </p>
                <div className="explanation-box">
                    {currentStepConfig?.detail}
                </div>
            </div>

            {/* Step 2, 3, 4: ベクトル表示切り替えボタン */}
            {(step === 2 || step === 3 || step === 4) && (
                <div className="mt-4 fade-in">
                    <button
                        className={`btn w-full ${showVectors ? 'btn-primary' : 'btn-secondary'} border border-slate-600 text-xs`}
                        onClick={() => onShowVectorsChange(!showVectors)}
                    >
                        {showVectors ? '速度・加速度ベクトルを表示中 (ON)' : '速度・加速度ベクトルを表示 (OFF)'}
                    </button>
                </div>
            )}

            {/* Step 6 & 7: グラフ表示切り替えボタン */}
            {(step === 6 || step === 7) && (
                <div className="mt-4 fade-in space-y-2">
                    <button
                        className={`btn w-full ${showVtGraph ? 'bg-purple-600 text-white' : 'btn-secondary'} border border-slate-600 text-xs`}
                        onClick={() => onShowVtGraphChange(!showVtGraph)}
                    >
                        {showVtGraph ? 'v-t グラフ (速度) を表示中' : 'v-t グラフ (速度) を表示'}
                    </button>
                    <button
                        className={`btn w-full ${showAtGraph ? 'bg-orange-600 text-white' : 'btn-secondary'} border border-slate-600 text-xs`}
                        onClick={() => onShowAtGraphChange(!showAtGraph)}
                    >
                        {showAtGraph ? 'a-t グラフ (加速度) を表示中' : 'a-t グラフ (加速度) を表示'}
                    </button>
                    <p className="text-xs text-slate-400 mt-1 pl-1">
                        ※ y-tグラフの上に重ねて表示します
                    </p>
                </div>
            )}

            {/* ナビゲーションボタン */}
            <div className="flex gap-2 mt-6">
                <button
                    className="btn btn-secondary flex-1"
                    onClick={handlePrev}
                    disabled={currentStepIndex <= 0}
                    style={{ opacity: currentStepIndex <= 0 ? 0.4 : 1 }}
                >
                    ← 戻る
                </button>
                <button
                    className="btn btn-primary flex-1"
                    onClick={handleNext}
                    disabled={currentStepIndex >= stepsConfig.length - 1}
                    style={{ opacity: currentStepIndex >= stepsConfig.length - 1 ? 0.4 : 1 }}
                >
                    進む →
                </button>
            </div>

            {/* 数式情報 (Step 2以降) */}
            {step >= 2 && (
                <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 fade-in">
                    <p className="text-xs text-slate-400 mb-1">現在の運動を記述する式:</p>
                    <p className="text-sm text-blue-300 font-mono">
                        y = A sin(ωt + π/2) = A cos(ωt)
                    </p>
                </div>
            )}
        </div>
    );
}
