import { WebClient } from "@slack/web-api";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

// --- ENV ---
const token = process.env.xoxb - 7947599785828 - 9452324035553 - XI8tl7ZsuO86bICGJWM4lDFQ;       // xoxb-...
const channel = process.env.C087WJ9UKV5;    // Cxxxxxxxx


if (!token || !channel) {
    console.error("환경변수 SLACK_BOT_TOKEN, SLACK_CHANNEL_ID가 필요합니다.");
    process.exit(1);
}

// --- TZ 설정: KST ---
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");
const nowKST = dayjs().tz("Asia/Seoul");
const dateStr = nowKST.format("YYYY/MM/DD");
const weekdayKo = nowKST.format("dd"); // 월/화/수/목/금/토/일 (2글자)

// --- 메시지 본문 ---
const text =
    `데일리 체크인&아웃 | ${dateStr} | ${weekdayKo} | :partly_sunny:
이 스레드에 오늘의 체크인/아웃을 댓글로 남겨주세요!

[템플릿]
:ballot_box_with_check: 체크인
- 업무 (Todo + 예상 :tomato:)
- 몸/마음 (각각 숫자 + 한줄 코멘트)
- 오늘 집중 포인트

:white_check_mark: 체크 아웃
- 완료 vs 계획
- 성과/배움
- 개선/내일 인계`;

async function main() {
    const client = new WebClient(token);
    try {
        const res = await client.chat.postMessage({ channel, text });
        console.log("메시지 전송 완료 ts:", res.ts);
    } catch (err) {
        console.error("메시지 전송 실패:", err?.data || err);
        process.exit(1);
    }
}
main();