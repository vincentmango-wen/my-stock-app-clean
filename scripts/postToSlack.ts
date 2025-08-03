import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

if (!SLACK_WEBHOOK_URL) {
  console.error('❌ SLACK_WEBHOOK_URL is not set in environment variables.');
  process.exit(1);
}

const dataPath = path.resolve(__dirname, '../data/recommendationMaterials.json');

try {
  const fileData = fs.readFileSync(dataPath, 'utf-8');
  const recommendationsObject = JSON.parse(fileData);
  const recommendations = Object.entries(recommendationsObject);

  if (recommendations.length === 0) {
    console.log('⚠ No recommendations found.');
    process.exit(0);
  }

  const messageBlocks = recommendations.map(([symbol, details]: [string, any], index: number) => {
    return `🟢 *${index + 1}. ${symbol} - ${details.summary}*\n• 理由: ${details.reason}\n• 詳細: ${details.link}`;
  });

  const text = `📊 *本日のAI株推奨リスト*（${new Date().toLocaleDateString('ja-JP')}）\n\n${messageBlocks.join('\n\n')}\n\n🔁 本リストはAIによる予測に基づいています。投資判断はご自身の責任でお願いします。`;

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