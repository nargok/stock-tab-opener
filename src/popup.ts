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
    const openTabs = async (): Promise<void> => {
        // 入力値を取得し、空白を除去
        const stockCode = stockCodeInput.value.trim();

        // 入力チェック：空欄の場合は処理を実行しない
        if (stockCode === '') {
            return;
        }

        // サイト設定を定義
        const sites = [
            {
                name: 'ヤフーファイナンス',
                domain: 'finance.yahoo.co.jp',
                urlPattern: `https://finance.yahoo.co.jp/quote/${stockCode}.T`
            },
            {
                name: '株探',
                domain: 'kabutan.jp',
                urlPattern: `https://kabutan.jp/stock/?code=${stockCode}`
            },
            {
                name: '四季報オンライン',
                domain: 'shikiho.toyokeizai.net',
                urlPattern: `https://shikiho.toyokeizai.net/stocks/${stockCode}`
            }
        ];

        // 各サイトに対して既存のタブをチェックし、更新または新規作成
        for (const site of sites) {
            try {
                // ドメインベースで既存のタブを検索
                const existingTabs = await chrome.tabs.query({ 
                    url: `*://${site.domain}/*` 
                });
                
                if (existingTabs.length > 0) {
                    // 既存のタブが見つかった場合は最初のタブを新しいURLで更新
                    const tabToUpdate = existingTabs[0];
                    if (tabToUpdate && tabToUpdate.id !== undefined) {
                        await chrome.tabs.update(tabToUpdate.id, { 
                            url: site.urlPattern,
                            active: false // フォーカスを移さない
                        });
                        console.log(`${site.name}の既存タブを更新しました: ${site.urlPattern}`);
                    }
                } else {
                    // 既存のタブが見つからない場合は新しいタブを作成
                    await chrome.tabs.create({ 
                        url: site.urlPattern,
                        active: false // フォーカスを移さない
                    });
                    console.log(`${site.name}の新しいタブを作成しました: ${site.urlPattern}`);
                }
            } catch (error) {
                console.error(`${site.name}のタブ処理中にエラーが発生しました:`, error);
                // エラーが発生した場合は新しいタブを作成
                try {
                    await chrome.tabs.create({ 
                        url: site.urlPattern,
                        active: false
                    });
                } catch (createError) {
                    console.error(`${site.name}の新しいタブの作成に失敗しました:`, createError);
                }
            }
        }

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