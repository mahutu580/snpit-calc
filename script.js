// HTML要素の取得
const snptInput = document.getElementById('snpt-input'); // 変更
const calcButton = document.getElementById('calc-button');
const usdtValueSpan = document.getElementById('usdt-value');
const jpyValueSpan = document.getElementById('jpy-value');
const snptUsdtRateSpan = document.getElementById('snpt-usdt-rate');
const usdJpyRateSpan = document.getElementById('usd-jpy-rate');

// 計算ボタンがクリックされた時の処理
calcButton.addEventListener('click', async () => {
    const snptAmount = parseFloat(snptInput.value); // 変更

    if (isNaN(snptAmount) || snptAmount <= 0) {
        alert("有効なSNPTの数量を入力してください。"); // 変更
        return;
    }

    try {
        // Vercel上の自分専用プロキシを呼び出す
        const proxyResponse = await fetch(`/api/proxy?symbol=SNPTUSDT`);
        const mexcData = await proxyResponse.json();

        if (!mexcData || !mexcData.price) {
            throw new Error("MEXCから価格データを取得できませんでした。");
        }
        const snptToUsdtRate = parseFloat(mexcData.price); // 変更

        // 為替レートAPIから USD/JPY の現在レートを取得
        const exchangeRateResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const exchangeRateData = await exchangeRateResponse.json();
        const usdToJpyRate = exchangeRateData.rates.JPY;

        // 計算を実行
        const usdtValue = snptAmount * snptToUsdtRate; // 変更
        const jpyValue = usdtValue * usdToJpyRate;

        // 結果を画面に表示
        usdtValueSpan.textContent = usdtValue.toFixed(2);
        jpyValueSpan.textContent = jpyValue.toFixed(0);
        snptUsdtRateSpan.textContent = snptToUsdtRate.toFixed(6); // 変更
        usdJpyRateSpan.textContent = usdToJpyRate.toFixed(2);

    } catch (error) {
        console.error("エラーが発生しました:", error);
        alert("レートの取得中にエラーが発生しました。詳細はコンソールを確認してください。");
    }
});