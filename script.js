// HTML要素の取得
const stpInput = document.getElementById('stp-input');
const calcButton = document.getElementById('calc-button');
const usdtValueSpan = document.getElementById('usdt-value');
const jpyValueSpan = document.getElementById('jpy-value');

// 計算ボタンがクリックされた時の処理
calcButton.addEventListener('click', async () => {
    const stpAmount = parseFloat(stpInput.value);

    if (isNaN(stpAmount) || stpAmount <= 0) {
        alert("有効なSTPの数量を入力してください。");
        return;
    }

    try {
        console.log("--- 計算開始 ---");

        // ★★★ Vercel上の自分専用プロキシを呼び出すように変更 ★★★
        const proxyResponse = await fetch(`/api/proxy?symbol=SNPTUSDT`);
        const mexcData = await proxyResponse.json();
        console.log("MEXCからのデータ:", mexcData);

        if (!mexcData || !mexcData.price) {
            throw new Error("MEXCから価格データを取得できませんでした。");
        }
        const stpToUsdtRate = parseFloat(mexcData.price);
        console.log("SNPT/USDTレート:", stpToUsdtRate);
        // ★★★ 変更ここまで ★★★


        // 為替レートAPIから USD/JPY の現在レートを取得
        const exchangeRateResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const exchangeRateData = await exchangeRateResponse.json();
        const usdToJpyRate = exchangeRateData.rates.JPY;
        console.log("USD/JPYレート:", usdToJpyRate);

        // 計算を実行
        const usdtValue = stpAmount * stpToUsdtRate;
        const jpyValue = usdtValue * usdToJpyRate;

        // 結果を画面に表示
        usdtValueSpan.textContent = usdtValue.toFixed(4);
        jpyValueSpan.textContent = jpyValue.toFixed(2);

    } catch (error) {
        console.error("エラーが発生しました:", error);
        alert("レートの取得中にエラーが発生しました。詳細はコンソールを確認してください。");
    }
});