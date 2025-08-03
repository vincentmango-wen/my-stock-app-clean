import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
// テクニカル分析のフィルタ関数をインポート
import { filterByTechnicalSignals } from '.@/lib/technicalAnalysis';
// Yahoo Finance ライブラリをインポート
import yahooFinance from 'yahoo-finance2';

// 銘柄ごとの材料情報を読み込む（JSONファイルから）
const materialsPath = path.resolve(process.cwd(), 'data/recommendationMaterials.json');
const materialData: Record<string, { summary: string; reason: string; link: string }> = fs.existsSync(materialsPath)
  ? JSON.parse(fs.readFileSync(materialsPath, 'utf-8'))
  : {};

// APIハンドラー：推奨銘柄を返す
export async function GET() {
  // 対象とする日本株の銘柄コード（Yahoo形式：.T付き）
  const symbols: Record<string, string> = {
    '7203': '7203.T', // トヨタ
    '6758': '6758.T', // ソニー
    '9984': '9984.T', // ソフトバンクグループ
    '9432': '9432.T', // NTT
    '8306': '8306.T', // 三菱UFJ
  };

  // 銘柄ごとの終値配列を格納するためのMap
  const priceData: Record<string, number[]> = {};

  // 各銘柄の過去データをYahooから取得
  for (const [code, yfSymbol] of Object.entries(symbols)) {
    try {
      const result = await yahooFinance.historical(yfSymbol, {
        period1: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 過去60日
        interval: '1d',
      });
      // 終値だけを抽出して保存
      priceData[code] = result.map((item) => item.close).filter((n): n is number => n != null);
    } catch (err) {
      console.error(`Error fetching ${yfSymbol}:`, err);
    }
  }

  // フィルタに合格した銘柄コードを取得
  const passedSymbols = filterByTechnicalSignals(priceData);

  // 推奨銘柄の詳細データ（通常はDBから取得）
  const allRecommendations = {
    '7203': {
      code: '7203',
      name: 'トヨタ',
      predictedReturn: '+4.2%',
      probability: '82%',
      summary: 'EV開発強化の提携発表',
      reason: 'EV市場拡大に対応した業務提携（ロイター）',
      link: 'https://example.com/news1',
    },
    '6758': {
      code: '6758',
      name: 'ソニー',
      predictedReturn: '+3.1%',
      probability: '76%',
      summary: '新規事業部立ち上げ',
      reason: '生成AI分野への参入で株価注目（日本経済新聞）',
      link: 'https://example.com/news2',
    },
    '9984': {
      code: '9984',
      name: 'ソフトバンクグループ',
      predictedReturn: '+5.0%',
      probability: '80%',
      summary: 'AI投資強化計画を発表',
      reason: '生成AI関連銘柄として再評価（Bloomberg）',
      link: 'https://example.com/news3',
    },
    '9432': {
      code: '9432',
      name: 'NTT',
      predictedReturn: '+2.8%',
      probability: '70%',
      summary: '新通信技術の研究発表',
      reason: '光通信の革新が期待される（日経）',
      link: 'https://example.com/news4',
    },
    '8306': {
      code: '8306',
      name: '三菱UFJ',
      predictedReturn: '+1.9%',
      probability: '65%',
      summary: '海外銀行との業務提携',
      reason: 'グローバル展開に強み（ロイター）',
      link: 'https://example.com/news5',
    },
  };

  // 条件を満たした銘柄だけを返却データとして整形
  const result = passedSymbols.map((code: string, index: number) => {
    // 銘柄ごとの材料情報を取得（JSONファイルから）
    const material = materialData[code] || {
      summary: '情報なし',
      reason: '該当ニュースが見つかりませんでした',
      link: '',
    };

    return {
      rank: index + 1,
      rsi: null,
      macd: 'GC',
      code,
      name: allRecommendations[code]?.name || '不明',
      predictedReturn: allRecommendations[code]?.predictedReturn || '',
      probability: allRecommendations[code]?.probability || '',
      summary: material.summary,
      reason: material.reason,
      link: material.link,
    };
  });

  // 結果をJSONで返却
  return NextResponse.json(result);
}