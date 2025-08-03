// 必要なライブラリをインポート
import fetch from 'node-fetch';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';

// 日本株の銘柄リストURL（代替）
const CSV_URL = 'https://raw.githubusercontent.com/datasets/japanese-stock-symbols/main/data/tse.csv';

// 非同期関数として実行
async function fetchTSESymbols() {
  try {
    console.log('📥 CSVファイルをダウンロード中...');
    // CSVファイルをダウンロード
    const response = await fetch(CSV_URL);
    
    if (!response.ok) {
      console.log('⚠️ 外部CSVファイルが利用できないため、サンプルデータを作成します。');
      // サンプルデータを作成
      const sampleSymbols = [
        { code: '7203', name: 'トヨタ自動車' },
        { code: '6758', name: 'ソニーグループ' },
        { code: '9984', name: 'ソフトバンクグループ' },
        { code: '6861', name: 'キーエンス' },
        { code: '6954', name: 'ファナック' },
        { code: '7974', name: '任天堂' },
        { code: '8306', name: '三菱UFJフィナンシャル・グループ' },
        { code: '9433', name: 'KDDI' },
        { code: '4502', name: '武田薬品工業' },
        { code: '4519', name: '中外製薬' }
      ];
      
      // ローカルにJSON形式で保存
      fs.writeFileSync('./tse-symbols.json', JSON.stringify(sampleSymbols, null, 2), 'utf-8');
      console.log(`✅ サンプル銘柄数: ${sampleSymbols.length}件を保存しました。`);
      return;
    }
    
    const csvText = await response.text();
    console.log(`📄 CSVファイルサイズ: ${csvText.length} 文字`);

    // CSVをパース（区切りはカンマ）
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    });

    console.log(`📊 パースされたレコード数: ${records.length}`);

    // 必要な情報だけ抽出（codeとname）
    const symbols = records.map((record: any) => ({
      code: record.Code,
      name: record.Name,
    }));

    // ローカルにJSON形式で保存
    fs.writeFileSync('./tse-symbols.json', JSON.stringify(symbols, null, 2), 'utf-8');

    console.log(`✅ 銘柄数: ${symbols.length}件を取得・保存しました。`);
  } catch (err) {
    console.error('❌ 取得に失敗しました:', err);
  }
}

// スクリプト実行
fetchTSESymbols();
