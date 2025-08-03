

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

if (!SLACK_WEBHOOK_URL) {
  console.error('❌ SLACK_WEBHOOK_URL is not set in environment variables.');
  process.exit(1);
}

const dataPath = path.resolve(__dirname, '../../data/recommendations.json');

try {
  const fileData = fs.readFileSync(dataPath, 'utf-8');
  const recommendations = JSON.parse(fileData);

  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    console.log('⚠ No recommendations found.');
    process.exit(0);
  }

  const messageBlocks = recommendations.map((rec: any, index: number) => {
    return `*${index + 1}. ${rec.symbol} - ${rec.name}*\n> ${rec.reason}\n> 上昇予測: ${rec.expectedReturn}%（確率: ${rec.confidence}%）`;
  });

  const text = `📈 *本日の推奨銘柄リスト*（${new Date().toLocaleDateString('ja-JP')}）\n\n${messageBlocks.join('\n\n')}`;

  fetch(SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
    .then((res) => {
      if (res.ok) {
        console.log('✅ Slack通知送信完了');
      } else {
        console.error('❌ Slack通知失敗:', res.statusText);
      }
    })
    .catch((err) => {
      console.error('❌ Slack通知エラー:', err);
    });
} catch (error) {
  console.error('❌ データ読み込みエラー:', error);
  process.exit(1);
}