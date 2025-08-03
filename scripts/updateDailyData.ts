

/**
 * 毎朝7時に自動で実行される株データ更新スクリプト。
 * 株価を取得し、テクニカル条件でフィルタリングされたおすすめ銘柄を更新する。
 */

import { fetchLatestPrices } from '../app/api/market-summary/scripts/fetchPricesFromYahoo';
import { filterByTechnicalSignals } from '../app/lib/technical/filterByTechnicalSignals';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('[開始] 毎朝の株データ更新');

  // 株価データを取得（price-data.jsonを更新）
  await fetchLatestPrices();

  // テクニカル条件でフィルタリング
  const filteredRecommendations = await filterByTechnicalSignals();

  // 結果をrecommendations.jsonに保存
  const outputPath = path.join(process.cwd(), 'data', 'recommendations.json');
  fs.writeFileSync(outputPath, JSON.stringify(filteredRecommendations, null, 2));

  console.log('[完了] 更新完了:', outputPath);
}

main().catch((error) => {
  console.error('[エラー] 処理中に例外が発生しました:', error);
  process.exit(1);
});