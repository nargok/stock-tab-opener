// DOMContentLoadedイベントを待ってから処理を開始
document.addEventListener('DOMContentLoaded', () => {
    // 要素を取得し、型を確認
    const stockCodeInput = document.getElementById('stockCodeInput') as HTMLInputElement;
    const openTabsButton = document.getElementById('openTabsButton') as HTMLButtonElement;

    // 要素が存在することを確認
    if (!stockCodeInput || !openTabsButton) {
        console.error('必要な要素が見つかりません');
        return;
    }

    // タブを開く関数
    const openTabs = (): void => {
        // 入力値を取得し、空白を除去
        const stockCode = stockCodeInput.value.trim();

        // 入力チェック：空欄の場合は処理を実行しない
        if (stockCode === '') {
            return;
        }

        // 3つのURLを生成
        const urls = [
            `https://finance.yahoo.co.jp/quote/${stockCode}.T`, // ヤフーファイナンス
            `https://kabutan.jp/stock/?code=${stockCode}`,      // 株探
            `https://shikiho.toyokeizai.net/stocks/${stockCode}` // 四季報オンライン
        ];

        // 各URLを新しいタブで開く
        urls.forEach(url => {
            chrome.tabs.create({ url: url });
        });

        // 処理完了後、ポップアップを閉じる
        window.close();
    };

    // ボタンクリックイベント
    openTabsButton.addEventListener('click', openTabs);

    // Enterキーイベント
    stockCodeInput.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            openTabs();
        }
    });
});