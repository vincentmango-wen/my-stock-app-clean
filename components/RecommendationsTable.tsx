

import React from 'react';
import { StockRecommendation } from '../types/stock';

interface RecommendationsTableProps {
  data: StockRecommendation[];
}

const RecommendationsTable: React.FC<RecommendationsTableProps> = ({ data }) => {
  return (
    <section className="mb-8 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-2">🏅 今日の注目銘柄TOP5</h2>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-2 py-1">Rank</th>
            <th className="border px-2 py-1">銘柄コード</th>
            <th className="border px-2 py-1">銘柄名</th>
            <th className="border px-2 py-1">RSI</th>
            <th className="border px-2 py-1">MACD</th>
            <th className="border px-2 py-1">上昇率予測</th>
            <th className="border px-2 py-1">確率</th>
            <th className="border px-2 py-1">材料概要</th>
            <th className="border px-2 py-1">推奨理由</th>
            <th className="border px-2 py-1">ニュース</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.code} className="hover:bg-gray-100">
              <td className="border px-2 py-1 text-center">{item.rank}</td>
              <td className="border px-2 py-1 text-center">{item.code}</td>
              <td className="border px-2 py-1 text-center">{item.name}</td>
              <td className="border px-2 py-1 text-center">{item.rsi}</td>
              <td className="border px-2 py-1 text-center">{item.macd}</td>
              <td className="border px-2 py-1 text-center text-green-600">{item.predictedReturn}</td>
              <td className="border px-2 py-1 text-center">{item.probability}</td>
              <td className="border px-2 py-1">{item.summary}</td>
              <td className="border px-2 py-1">{item.reason}</td>
              <td className="border px-2 py-1 text-blue-600 underline">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  記事へ
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default RecommendationsTable;