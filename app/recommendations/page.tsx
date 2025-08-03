'use client';

import React, { useEffect, useState } from 'react';
import { StockRecommendation } from '@/types/stock';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<StockRecommendation[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // JSON データをフェッチ
  useEffect(() => {
    fetch('/data/recommendations.json')
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data.recommendations || data);
        setLastUpdated(data.lastUpdated || null);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">今日のおすすめ銘柄</h1>
      {lastUpdated && (
        <div className="text-sm text-gray-500 mb-4">
          データ更新日時: {new Date(lastUpdated).toLocaleString('ja-JP')}
        </div>
      )}
      <h2 className="text-lg font-semibold text-gray-700 mb-2 mt-6">📈 推奨銘柄一覧</h2>
      {recommendations.length === 0 ? (
        <div className="text-gray-500">読み込み中...</div>
      ) : (
        <>
          <ul className="space-y-4">
            {recommendations.map((stock, index) => (
              <li
                key={stock.code}
                className="relative border border-gray-300 bg-white p-4 rounded-lg shadow-md hover:bg-blue-50 transition"
              >
                <span className="absolute top-2 right-4 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                  Rank {index + 1}
                </span>
                <div className="font-semibold text-lg">{stock.name} ({stock.code})</div>
                <div className="text-sm text-gray-600 mb-1">📉 RSI: {stock.rsi}</div>
                <div className="text-sm text-green-600 mb-1">📈 MACD: {stock.macdSignal}</div>
                <div className="text-sm text-gray-700 mb-1">予想上昇率: <span className="font-semibold">{stock.predictedRise}%</span></div>
                <div className="text-sm text-gray-700 mb-1">上昇確率: <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{stock.probability}%</span></div>
                <div className="text-sm text-gray-800 mb-1">
                  <span className="font-semibold">📌 推奨理由:</span> {stock.reason}
                </div>
                <a
                  href={stock.newsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 px-3 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 text-sm"
                >
                  関連ニュースを見る
                </a>
                {stock.date && (
                  <div className="text-xs text-gray-400 mt-2">
                    🗓️ 推奨日: {new Date(stock.date).toLocaleDateString('ja-JP')}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-gray-500 text-center">
            ご覧いただきありがとうございました。投資は自己責任でお願いします。
          </p>
          <div className="mt-4 text-center">
            <a href="/" className="text-blue-600 underline text-sm hover:text-blue-800">
              トップページに戻る
            </a>
          </div>
        </>
      )}
      {/* 推奨銘柄一覧セクション 終了 */}
      <footer className="mt-12 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} MyStockApp. All rights reserved.
      </footer>
    </div>
  );
}