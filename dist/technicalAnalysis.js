"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRSI = calculateRSI;
exports.isMACDGoldenCross = isMACDGoldenCross;
// 必要なインジケータ関数をtechnicalindicatorsライブラリからインポート
const technicalindicators_1 = require("technicalindicators");
// RSIを計算する関数（通常14日間）
function calculateRSI(closingPrices, period = 14) {
    // 入力データが短すぎる場合はnullを返す
    if (closingPrices.length < period)
        return null;
    // RSIの計算に必要な入力形式を構築
    const input = {
        values: closingPrices,
        period: period,
    };
    // technicalindicatorsのRSI関数を使用して計算
    const result = technicalindicators_1.RSI.calculate(input);
    // 最新のRSI値を返す（配列の最後の値）
    return result.length > 0 ? result[result.length - 1] : null;
}
// MACDを計算し、ゴールデンクロス（GC）が発生したかを判定する関数
function isMACDGoldenCross(closingPrices) {
    // 最低限必要なデータ数をチェック（MACD計算には26日以上必要）
    if (closingPrices.length < 26)
        return false;
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
    const result = technicalindicators_1.MACD.calculate(input);
    // 直近2つのMACDデータを取得してゴールデンクロスを判定
    const len = result.length;
    if (len < 2)
        return false;
    const prev = result[len - 2];
    const curr = result[len - 1];
    // ゴールデンクロス：直前はMACD < signal, 今はMACD > signal
    return prev.MACD < prev.signal && curr.MACD > curr.signal;
}
