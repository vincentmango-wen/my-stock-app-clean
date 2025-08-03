"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 必要なモジュールをインポート
const fs = require("fs");
const technicalAnalysis_1 = require("../../../../lib/technicalAnalysis");
// 銘柄情報を読み込み
const symbols = JSON.parse(fs.readFileSync('./tse-symbols.json', 'utf-8'));
const priceData = JSON.parse(fs.readFileSync('./price-data.json', 'utf-8'));
// 銘柄を分析して推奨度を計算する関数
function analyzeStock(code, prices) {
    if (prices.length < 26)
        return null; // 最低26日分のデータが必要
    // RSIを計算
    const rsi = (0, technicalAnalysis_1.calculateRSI)(prices);
    if (rsi === null)
        return null;
    // MACDゴールデンクロスをチェック
    const hasGoldenCross = (0, technicalAnalysis_1.isMACDGoldenCross)(prices);
    // 直近の価格変動を計算
    const recentPrices = prices.slice(-5); // 直近5日
    const priceChange = ((recentPrices[recentPrices.length - 1] - recentPrices[0]) / recentPrices[0]) * 100;
    // ボラティリティを計算
    const returns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
    const volatility = Math.sqrt(returns.reduce((sum, ret) => sum + ret * ret, 0) / returns.length) * 100;
    // 推奨度スコアを計算
    let score = 0;
    let reasons = [];
    // RSIによる評価（30以下は買われすぎ、70以上は売られすぎ）
    if (rsi < 30) {
        score += 30;
        reasons.push('RSIが30以下で買われすぎ');
    }
    else if (rsi < 50) {
        score += 20;
        reasons.push('RSIが50以下で上昇余地あり');
    }
    else if (rsi > 70) {
        score -= 20;
        reasons.push('RSIが70以上で売られすぎ');
    }
    // MACDゴールデンクロスによる評価
    if (hasGoldenCross) {
        score += 25;
        reasons.push('MACDゴールデンクロス発生');
    }
    // 価格変動による評価
    if (priceChange > 2) {
        score += 15;
        reasons.push('直近5日で2%以上の上昇');
    }
    else if (priceChange < -2) {
        score += 10;
        reasons.push('直近5日で2%以上の下落（反発期待）');
    }
    // ボラティリティによる評価（適度なボラティリティが良い）
    if (volatility > 1 && volatility < 3) {
        score += 10;
        reasons.push('適度なボラティリティ');
    }
    // スコアが低すぎる場合は除外
    if (score < 20)
        return null;
    // 銘柄名を取得
    const symbol = symbols.find(s => s.code === code);
    if (!symbol)
        return null;
    // 上昇率予測（簡易計算）
    const predictedReturn = Math.max(0, score * 0.5).toFixed(1) + '%';
    // 確率（スコアに基づく簡易計算）
    const probability = Math.min(90, Math.max(30, score + 30)).toFixed(0) + '%';
    return {
        rank: 0, // 後で設定
        code,
        name: symbol.name,
        rsi: Math.round(rsi * 10) / 10,
        macd: hasGoldenCross ? 'GC' : 'NC',
        predictedReturn,
        probability,
        summary: `${priceChange > 0 ? '上昇' : '下落'}トレンド、ボラティリティ${volatility.toFixed(1)}%`,
        reason: reasons.join('、'),
        link: `https://finance.yahoo.co.jp/quote/${code}.T`
    };
}
// メイン処理
function generateRecommendations() {
    console.log('🔍 銘柄分析を開始...');
    const recommendations = [];
    // 各銘柄を分析
    for (const [code, prices] of Object.entries(priceData)) {
        const recommendation = analyzeStock(code, prices);
        if (recommendation) {
            recommendations.push(recommendation);
        }
    }
    // スコアでソート（高い順）
    recommendations.sort((a, b) => {
        const scoreA = parseFloat(a.predictedReturn);
        const scoreB = parseFloat(b.predictedReturn);
        return scoreB - scoreA;
    });
    // ランクを設定（上位5件のみ）
    const topRecommendations = recommendations.slice(0, 5).map((rec, index) => ({
        ...rec,
        rank: index + 1
    }));
    // 結果を保存
    fs.writeFileSync('./recommendations.json', JSON.stringify(topRecommendations, null, 2), 'utf-8');
    console.log(`✅ 推奨銘柄 ${topRecommendations.length}件を抽出しました`);
    // 結果を表示
    console.log('\n🏆 今日の推奨銘柄TOP5:');
    topRecommendations.forEach(rec => {
        console.log(`${rec.rank}. ${rec.code} ${rec.name}`);
        console.log(`   RSI: ${rec.rsi}, MACD: ${rec.macd}, 予測上昇率: ${rec.predictedReturn}, 確率: ${rec.probability}`);
        console.log(`   理由: ${rec.reason}`);
        console.log('');
    });
}
// スクリプト実行
generateRecommendations();
