import { WebClient } from "@slack/web-api";
import dayjs from "dayjs";
import "dayjs/locale/ko.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

// --- ENV ---
const token = process.env.SLACK_BOT_TOKEN;
const channel = process.env.SLACK_CHANNEL_ID;
const LAT = process.env.CHECKIN_LAT || "37.5310";
const LON = process.env.CHECKIN_LON || "126.9140";


if (!token || !channel) {
    console.error("환경변수 SLACK_BOT_TOKEN, SLACK_CHANNEL_ID가 필요합니다.");
    process.exit(1);
}

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("ko");

const nowKST = dayjs().tz("Asia/Seoul");
const dateStr = nowKST.format("YYYY/MM/DD");
const weekdayKo = nowKST.format("dd");

// --- 한국 공휴일 체크 (공공데이터포털 API) ---
async function isKoreanHoliday(date) {
    const year = date.year();
    const month = String(date.month() + 1).padStart(2, '0');
    const apiKey = process.env.KOREAN_HOLIDAY_API_KEY;
    if (!apiKey) {
        console.warn('KOREAN_HOLIDAY_API_KEY 미설정, 공휴일 체크를 건너뜁니다.');
        return false;
    }
    
    try {
        const url = `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${apiKey}&solYear=${year}&solMonth=${month}`;
        const res = await fetch(url);
        
        if (!res.ok) {
            console.warn('공휴일 API 호출 실패, 평일로 간주');
            return false;
        }
        
        const text = await res.text();
        const dateString = `${year}${month}${String(date.date()).padStart(2, '0')}`;
        
        // XML 응답에서 locdate 태그들을 추출하여 정확히 매칭
        const holidays = [...text.matchAll(/<locdate>(\d{8})<\/locdate>/g)].map(m => m[1]);
        return holidays.includes(dateString);
    } catch (e) {
        console.warn('공휴일 확인 실패, 평일로 간주:', e.message);
        return false;
    }
}

// --- WMO 코드 → 이모지 매핑 ---
function wmoToEmoji(code) {
    const c = Number(code);
    if ([0].includes(c)) return "☀️";
    if ([1, 2].includes(c)) return "🌤️";
    if ([3].includes(c)) return "☁️";
    if ([45, 48].includes(c)) return "🌫️";
    if ([51, 53, 55].includes(c)) return "🌦️";
    if ([56, 57, 61].includes(c)) return "🌦️";
    if ([63].includes(c)) return "🌧️";
    if ([65].includes(c)) return "🌧️";
    if ([80, 81].includes(c)) return "🌦️";
    if ([82].includes(c)) return "⛈️";
    if ([66, 67, 71].includes(c)) return "🌨️";
    if ([73].includes(c)) return "🌨️";
    if ([75, 77, 85, 86].includes(c)) return "🌨️";
    if ([95, 96, 99].includes(c)) return "⛈️";
    return "🌤️"; // 기본값(대체로 맑음)
}

// --- 현재 날씨 이모지 가져오기(Open-Meteo) ---
async function getWeatherEmoji() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true&timezone=Asia%2FSeoul`;
    try {
        const res = await fetch(url, { headers: { "accept": "application/json" } });
        if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
        const data = await res.json();
        const code = data?.current_weather?.weathercode;
        return wmoToEmoji(code);
    } catch (e) {
        console.warn("날씨 조회 실패, 기본 이모지 사용:", e.message);
        return "🌤️";
    }
}

async function main() {
    // 공휴일 체크
    const isHoliday = await isKoreanHoliday(nowKST);
    if (isHoliday) {
        console.log(`${dateStr}은 공휴일입니다. 메시지를 보내지 않습니다.`);
        return;
    }
    
    // 주말 체크 (추가 안전장치)
    const dayOfWeek = nowKST.day(); // 0=일요일, 6=토요일
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        console.log(`${dateStr}은 주말입니다. 메시지를 보내지 않습니다.`);
        return;
    }
    
    const weatherEmoji = await getWeatherEmoji();

    const text = `*데일리 체크인&아웃 | ${dateStr} | ${weekdayKo} | ${weatherEmoji}*
이 스레드에 오늘의 체크인/아웃을 댓글로 남겨주세요!

[템플릿]
🌟 체크인
- 업무 (Todo + 예상 시간 or 🍅)
- 몸/마음 (각각 숫자 + 한줄 코멘트)
- 오늘 집중 포인트

✅ 체크 아웃
- 완료 vs 계획
- 성과/배움
- 개선/내일 인계`;

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