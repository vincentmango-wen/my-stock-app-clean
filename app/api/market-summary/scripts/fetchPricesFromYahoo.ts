// 必要なモジュールをインポート
import * as fs from 'fs';
import yahooFinance from 'yahoo-finance2';

// 銘柄コード一覧ファイルの読み込み
const symbols = JSON.parse(fs.readFileSync('./tse-symbols.json', 'utf-8')) as { code: string; name: string }[];

// 出力用データ格納オブジェクト
const priceMap: Record<string, number[]> = {};

// 処理を非同期で実行
async function fetchPrices() {
  for (const { code } of symbols) {
    const yfCode = `${code}.T`; // Yahoo Finance用コードに変換
    try {
      const result = await yahooFinance.historical(yfCode, {
        period1: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 過去60日
        interval: '1d',
      });

      // 終値（close）を抽出し、nullを除外
      const closes = result.map(r => r.close).filter((v): v is number => v != null);

      // 終値が十分な場合のみ記録（例: 25日以上）
      if (closes.length >= 25) {
        priceMap[code] = closes;
        console.log(`✅ ${code} 件数: ${closes.length}`);
      }
    } catch (err) {
      console.warn(`⚠️ ${code} 取得失敗:`, (err as Error).message);
    }
  }

  // 結果をJSONファイルとして保存
  fs.writeFileSync('./price-data.json', JSON.stringify(priceMap, null, 2), 'utf-8');
  console.log(`📦 保存完了: ${Object.keys(priceMap).length} 銘柄`);
}

// スクリプト起動
fetchPrices();
