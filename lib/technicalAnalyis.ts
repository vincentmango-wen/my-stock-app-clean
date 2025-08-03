

// 銘柄ごとの終値データに基づいて、RSIとMACD条件で絞り込む関数
export function filterByTechnicalSignals(
  priceDataMap: Record<string, number[]>
): string[] {
  // 条件を満たす銘柄コードを格納する配列
  const selectedSymbols: string[] = [];

  // 各銘柄コードと終値データに対して処理
  for (const [symbol, closingPrices] of Object.entries(priceDataMap)) {
    // RSIが30以下か確認
    const rsi = calculateRSI(closingPrices);
    const isRSIOk = rsi !== null && rsi <= 30;

    // MACDがゴールデンクロスになっているか確認
    const isMACDOk = isMACDGoldenCross(closingPrices);

    // 両方の条件を満たした場合、その銘柄を選択
    if (isRSIOk && isMACDOk) {
      selectedSymbols.push(symbol);
    }
  }

  // フィルタリングされた銘柄コードを返す
  return selectedSymbols;
}

// 必要なインジケータ関数をtechnicalindicatorsライブラリからインポート
import { RSI, MACD } from 'technicalindicators';

// RSIを計算する関数（通常14日間）
export function calculateRSI(closingPrices: number[], period = 14): number | null {
  // 入力データが短すぎる場合はnullを返す
  if (closingPrices.length < period) return null;

  // RSIの計算に必要な入力形式を構築
  const input = {
    values: closingPrices,
    period: period,
  };

  // technicalindicatorsのRSI関数を使用して計算
  const result = RSI.calculate(input);

  // 最新のRSI値を返す（配列の最後の値）
  return result.length > 0 ? result[result.length - 1] : null;
}

// MACDを計算し、ゴールデンクロス（GC）が発生したかを判定する関数
export function isMACDGoldenCross(closingPrices: number[]): boolean {
  // 最低限必要なデータ数をチェック（MACD計算には26日以上必要）
  if (closingPrices.length < 26) return false;

  // MACDの入力定義（短期12日・長期26日・シグナル9日）
  const input = {
    values: closingPrices,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false,
  };

  // MACDとシグナル線を計算
  const result = MACD.calculate(input);

  // 直近2つのMACDデータを取得してゴールデンクロスを判定
  const len = result.length;
  if (len < 2) return false;

  const prev = result[len - 2];
  const curr = result[len - 1];

  // ゴールデンクロス：直前はMACD < signal, 今はMACD > signal
  return prev.MACD < prev.signal && curr.MACD > curr.signal;
}