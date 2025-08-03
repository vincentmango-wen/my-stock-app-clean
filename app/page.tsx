'use client';

import React from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">My Stock App</h1>
      <p className="text-gray-700 text-lg mb-6 text-center max-w-md">
        株式市場の動向をAIと統計で解析し、注目銘柄を毎日自動でピックアップします。
      </p>
      <a
        href="/recommendations"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        今日のおすすめ銘柄を見る
      </a>
    </main>
  );
}