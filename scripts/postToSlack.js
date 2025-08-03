"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var dotenv = require("dotenv");
var node_fetch_1 = require("node-fetch");
dotenv.config({ path: '.env.local' });
var SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
if (!SLACK_WEBHOOK_URL) {
    console.error('❌ SLACK_WEBHOOK_URL is not set in environment variables.');
    process.exit(1);
}
var dataPath = path.resolve(__dirname, '../data/recommendationMaterials.json');
try {
    var fileData = fs.readFileSync(dataPath, 'utf-8');
    var recommendationsObject = JSON.parse(fileData);
    var recommendations = Object.entries(recommendationsObject);
    if (recommendations.length === 0) {
        console.log('⚠ No recommendations found.');
        process.exit(0);
    }
    var messageBlocks = recommendations.map(function (_a, index) {
        var symbol = _a[0], details = _a[1];
        return "\uD83D\uDFE2 *".concat(index + 1, ". ").concat(symbol, " - ").concat(details.summary, "*\n\u2022 \u7406\u7531: ").concat(details.reason, "\n\u2022 \u8A73\u7D30: ").concat(details.link);
    });
    var text = "\uD83D\uDCCA *\u672C\u65E5\u306EAI\u682A\u63A8\u5968\u30EA\u30B9\u30C8*\uFF08".concat(new Date().toLocaleDateString('ja-JP'), "\uFF09\n\n").concat(messageBlocks.join('\n\n'), "\n\n\uD83D\uDD01 \u672C\u30EA\u30B9\u30C8\u306FAI\u306B\u3088\u308B\u4E88\u6E2C\u306B\u57FA\u3065\u3044\u3066\u3044\u307E\u3059\u3002\u6295\u8CC7\u5224\u65AD\u306F\u3054\u81EA\u8EAB\u306E\u8CAC\u4EFB\u3067\u304A\u9858\u3044\u3057\u307E\u3059\u3002");
    (0, node_fetch_1.default)(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text }),
    })
        .then(function (res) {
        if (res.ok) {
            console.log('✅ Slack通知送信完了');
        }
        else {
            console.error('❌ Slack通知失敗:', res.statusText);
        }
    })
        .catch(function (err) {
        console.error('❌ Slack通知エラー:', err);
    });
}
catch (error) {
    console.error('❌ データ読み込みエラー:', error);
    process.exit(1);
}
