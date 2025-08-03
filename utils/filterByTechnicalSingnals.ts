

// テクニカル指標（RSIとMACD）を使って銘柄をフィルタリングするユーティリティ関数
import fs from 'fs';
import path from 'path';
import { RSI, MACD } from 'technicalindicators';

// 1. price-data.jsonからヒストリカル終値データを読み込む
//    ファイルは { [code: string]: number[] } の形式（code: 終値配列）
const pricePath = path.resolve(__dirname, '../price-data.json');
const priceData: Record<string, number[]> = JSON.parse(fs.readFileSync(pricePath, 'utf-8'));

/**
 * 2. RSIとMACDを計算し、
 * 3. RSI < 30 かつ MACDゴールデンクロス（signal上抜け）銘柄のみ抽出
 * 4. 該当する銘柄コード配列を返す
 */
export function filterByTechnicalSignals(): string[] {
  const matched: string[] = [];

  for (const code of Object.keys(priceData)) {
    const closes = priceData[code];
    if (closes.length < 26) continue; // MACD計算には26日以上必要

    // --- RSI計算（期間14） ---
    const rsiValues = RSI.calculate({ values: closes, period: 14 });
    if (rsiValues.length === 0) continue;
    const latestRSI = rsiValues[rsiValues.length - 1];

    // --- MACD計算（デフォルト: fast=12, slow=26, signal=9） ---
    const macdInput = {
      values: closes,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false,
    };
    const macdValues = MACD.calculate(macdInput);
    if (macdValues.length < 2) continue;
    const prevMACD = macdValues[macdValues.length - 2];
    const latestMACD = macdValues[macdValues.length - 1];

    // --- フィルタ条件:
    // 1. RSIが30未満
    // 2. MACDがゴールデンクロス（前回MACD < signal, 今回MACD > signal）
    if (
      latestRSI < 30 &&
      prevMACD.MACD < prevMACD.signal &&
      latestMACD.MACD > latestMACD.signal
    ) {
      matched.push(code);
    }
  }

  // 4. 条件を満たす銘柄コード配列を返す
  return matched;
}