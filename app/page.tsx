'use client';

// Reactと必要なフックをインポート
import React, { useEffect, useState } from 'react';
import RecommendationsTable from '../components/RecommendationsTable';
import { StockRecommendation } from '../types/stock';

// ホームページ用コンポーネント定義
export default function HomePage() {
  // 銘柄推薦データ用のステート
  const [recommendations, setRecommendations] = useState<StockRecommendation[] | null>(null);
  // 市場サマリー用のステート
  const [marketSummary, setMarketSummary] = useState<{
    date: string;
    nikkei: string;
    topix: string;
    topics: string[];
  } | null>(null);
  // ローディング・エラーフラグ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ページマウント時にAPIからデータ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 銘柄推薦API呼び出し
        const res1 = await fetch('/api/recommendations');
        if (!res1.ok) throw new Error('Failed to fetch recommendations');
        const data1: StockRecommendation[] = await res1.json();
        setRecommendations(data1);

        // 市場概要API呼び出し
        const res2 = await fetch('/api/market-summary');
        if (!res2.ok) throw new Error('Failed to fetch market summary');
        const data2 = await res2.json();
        setMarketSummary(data2);
      } catch (e) {
        // エラーが発生した場合はエラーフラグを立てる
        setError(true);
      } finally {
        // ローディング完了
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // JSXレンダリング開始
  return (
    <main className="bg-gray-50 min-h-screen p-4 text-gray-800">
      {/* ヘッダー部分 */}
      <header className="text-center py-4">
        <h1 className="text-2xl font-bold">株分析AIレポート</h1>
        <p className="text-sm text-gray-500">最終更新：2025/08/03 07:00 JST</p>
      </header>

      {/* 市場動向セクション */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📈 市場全体の動向</h2>
        {/* データ取得成功時に表示 */}
        {marketSummary ? (
          <ul className="list-disc list-inside text-sm">
            <li>日経平均：{marketSummary.nikkei}　|　TOPIX：{marketSummary.topix}</li>
            {marketSummary.topics.map((topic, idx) => (
              <li key={idx}>{topic}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">市場データを取得中...</p>
        )}
      </section>

      {/* 状態に応じた表示切り替え */}
      {loading && <p>データを読み込み中...</p>}
      {error && <p className="text-red-600">データ取得に失敗しました。</p>}
      {recommendations && <RecommendationsTable data={recommendations} />}

      {/* フッター部分 */}
      <footer className="text-center text-xs text-gray-500 py-4">
        このページは毎朝7:00に自動更新されます。投資判断は自己責任でお願いします。<br />
        Ⓒ 2025 株分析AI by YourAppName
      </footer>
    </main>
  );
}