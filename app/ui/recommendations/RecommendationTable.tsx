

// RecommendationTable.tsx

'use client';

import { useEffect, useState } from 'react';

// APIレスポンスの型定義（必要に応じて拡張）
type Recommendation = {
  rank: number;
  code: string;
  name: string;
  rsi: number | null;
  macd: string;
  predictedReturn: string;
  probability: string;
  summary: string;
  reason: string;
  link: string;
};

export default function RecommendationTable() {
  const [data, setData] = useState<Recommendation[]>([]);

  // ページロード時にAPIからデータ取得
  useEffect(() => {
    fetch('/api/recommendations')
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Rank</th>
            <th className="px-4 py-2 border">銘柄コード</th>
            <th className="px-4 py-2 border">銘柄名</th>
            <th className="px-4 py-2 border">RSI</th>
            <th className="px-4 py-2 border">MACD</th>
            <th className="px-4 py-2 border">上昇率予測</th>
            <th className="px-4 py-2 border">確率</th>
            {/* 新しいカラム: 材料概要, 推奨理由, ニュース */}
            <th className="px-4 py-2 border">材料概要</th>
            <th className="px-4 py-2 border">推奨理由</th>
            <th className="px-4 py-2 border">ニュース</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rec) => (
            <tr key={rec.code}>
              <td className="px-4 py-2 border">{rec.rank}</td>
              <td className="px-4 py-2 border">{rec.code}</td>
              <td className="px-4 py-2 border">{rec.name}</td>
              <td className="px-4 py-2 border">{rec.rsi ?? '-'}</td>
              <td className="px-4 py-2 border">{rec.macd}</td>
              <td className="px-4 py-2 border">{rec.predictedReturn}</td>
              <td className="px-4 py-2 border">{rec.probability}</td>
              {/* 新しいカラムの値を表示 */}
              <td className="px-4 py-2 border">{rec.summary}</td>
              <td className="px-4 py-2 border">{rec.reason}</td>
              <td className="px-4 py-2 border text-blue-600 underline">
                {/* ニュースリンクをクリック可能に */}
                <a href={rec.link} target="_blank" rel="noopener noreferrer">
                  リンク
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}