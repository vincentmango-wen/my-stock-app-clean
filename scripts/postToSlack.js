"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var dotenv_1 = require("dotenv");
var node_fetch_1 = require("node-fetch");
dotenv_1.default.config();
var SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
if (!SLACK_WEBHOOK_URL) {
    console.error('❌ SLACK_WEBHOOK_URL is not set in environment variables.');
    process.exit(1);
}
var dataPath = path_1.default.resolve(__dirname, '../../data/recommendations.json');
try {
    var fileData = fs_1.default.readFileSync(dataPath, 'utf-8');
    var recommendations = JSON.parse(fileData);
    if (!Array.isArray(recommendations) || recommendations.length === 0) {
        console.log('⚠ No recommendations found.');
        process.exit(0);
    }
    var messageBlocks = recommendations.map(function (rec, index) {
        return "*".concat(index + 1, ". ").concat(rec.symbol, " - ").concat(rec.name, "*\n> ").concat(rec.reason, "\n> \u4E0A\u6607\u4E88\u6E2C: ").concat(rec.expectedReturn, "%\uFF08\u78BA\u7387: ").concat(rec.confidence, "%\uFF09");
    });
    var text = "\uD83D\uDCC8 *\u672C\u65E5\u306E\u63A8\u5968\u9298\u67C4\u30EA\u30B9\u30C8*\uFF08".concat(new Date().toLocaleDateString('ja-JP'), "\uFF09\n\n").concat(messageBlocks.join('\n\n'));
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
