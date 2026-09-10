// ==========================================================================
// 1. 화면 해상도/창 크기에 맞춘 두루마리 최적 배율(Auto-Fit) 계산 로직
// ==========================================================================
function updateResponsiveScale() {
    const viewport = document.querySelector(".desk-viewport");
    if (!viewport) return;

    const vWidth = viewport.clientWidth || window.innerWidth;
    const vHeight = viewport.clientHeight || window.innerHeight;

    // 1) 줌아웃 상태 기본 배율: 두루마리와 소품이 화면 안에 예쁘게 들어가도록
    const scaleOutW = (vWidth * 0.94) / 1050;
    const scaleOutH = (vHeight * 0.94) / 720;
    const baseScale = Math.min(scaleOutW, scaleOutH, 1.0);
    document.documentElement.style.setProperty("--base-scale", baseScale.toFixed(3));

    // 2) 줌인 상태 최적 배율: 920x560 두루마리가 화면의 86% 높이 안에 쏙 들어가도록
    const targetH = vHeight * 0.88;
    const targetW = vWidth * 0.92;
    
    const scaleInH = targetH / 560;
    const scaleInW = targetW / 920;
    const optimalZoomScale = Math.max(0.85, Math.min(scaleInH, scaleInW, 1.55));

    document.documentElement.style.setProperty("--zoom-scale", optimalZoomScale.toFixed(3));
}

window.addEventListener("resize", updateResponsiveScale);

// ==========================================================================
// 2. DOM 로드 완료 후 줌인 및 sessionStorage 복원 로직
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    updateResponsiveScale();

    const viewport = document.querySelector(".desk-viewport");
    const canvas = document.querySelector(".desk-canvas");
    const isEntered = sessionStorage.getItem("entered_monitor");

    // [핵심 1] 이미 두루마리를 펼친 이력이 있다면 트랜지션 없이 즉시 줌인 유지
    if (isEntered === "true" && viewport && canvas) {
        canvas.style.transition = "none";
        viewport.classList.add("is-zoomed");
        setTimeout(() => {
            canvas.style.transition = "transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)";
        }, 50);
    }

    // [핵심 2] 두루마리 클릭 시 줌인 실행
    const triggerArea = document.querySelector(".scroll-trigger-area");
    if (triggerArea && viewport) {
        triggerArea.addEventListener("click", (e) => {
            if (!viewport.classList.contains("is-zoomed")) {
                updateResponsiveScale();
                viewport.classList.add("is-zoomed");
                sessionStorage.setItem("entered_monitor", "true");
            }
        });
    }

    // [편의 기능] 책상 전체 보기(줌아웃) 버튼
    const zoomOutBtn = document.getElementById("zoom-out-btn");
    if (zoomOutBtn && viewport) {
        zoomOutBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            viewport.classList.remove("is-zoomed");
            sessionStorage.removeItem("entered_monitor");
            updateResponsiveScale();
        });
    }
});

// ==========================================================================
// 3. 정화 묵송문 클립보드 복사 & 토스트 팝업
// ==========================================================================
function copyAmuletText(text) {
    if (!navigator.clipboard) {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        showToast("📿 정화 묵송문 복사 완료 (절대 입 밖으로 내지 마십시오)");
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showToast("📿 정화 묵송문 복사 완료 (마음속으로만 읊으십시오)");
    }).catch(err => {
        console.error("복사 실패:", err);
        showToast("⚠️ 복사 권한 오류");
    });
}

function copyEmailToClipboard(email) {
    copyAmuletText(email);
}

function showToast(message) {
    let toast = document.querySelector(".toast-popup");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast-popup";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

// ==========================================================================
// 4. 생존 체크리스트 인터랙션
// ==========================================================================
function toggleCheck(checkbox) {
    const parent = checkbox.closest(".checklist-item");
    if (parent) {
        if (checkbox.checked) {
            parent.classList.add("checked");
        } else {
            parent.classList.remove("checked");
        }
    }
}

// ==========================================================================
// 5. 제4장 7연속 타종 경보 시뮬레이터 (실제 대종 소리 연동)
// ==========================================================================
let bellInterval = null;
function triggerBellSequence() {
    const display = document.getElementById("bell-display");
    const btn = document.getElementById("bell-btn");
    const viewport = document.querySelector(".desk-viewport");
    
    if (!display || !btn || bellInterval) return;

    btn.disabled = true;
    btn.style.opacity = "0.5";
    if (viewport) viewport.classList.add("alarm-mode");

    let count = 1;
    display.textContent = `🔔 [1/7] 「당 —」`;
    playAudioClip('bell');
    showToast("⚠️ 타종 개시: 즉시 백사(흰 실)를 문고리에 결속하십시오!");

    bellInterval = setInterval(() => {
        count++;
        if (count <= 7) {
            display.textContent = `🔔 [${count}/7] 「당 —」`;
            playAudioClip('bell');
        } else {
            clearInterval(bellInterval);
            bellInterval = null;
            display.innerHTML = `<span style="color:#ff3344">🚨 7회 타종 완료! 백사 결속 완료! 절대 문을 열지 마십시오.</span>`;
            showToast("🚨 7연속 타종 종료: 누구의 목소리에도 결코 문을 열지 마십시오!");
            btn.disabled = false;
            btn.style.opacity = "1";
            
            setTimeout(() => {
                if (viewport) viewport.classList.remove("alarm-mode");
            }, 6000);
        }
    }, 1200);
}

// ==========================================================================
// 6. 음향 매니저 및 실시간 오디오 제어 엔진
// ==========================================================================
const AUDIO_ASSETS = {
    bell: 'audio/temple_bell.wav',
    whistle: 'audio/brass_whistle.wav',
    scratch: 'audio/corridor_scratch.wav',
    drone: 'audio/ambient_drone.wav',
    broadcast: 'audio/emergency_broadcast.wav',
    mimic: 'audio/creepy_mimic_whisper.wav',
    roommate: 'audio/roommate_mimic.wav',
    chant: 'audio/purification_chant.wav'
};

const activeAudioInstances = {};
let bgmAudio = null;
let isBgmPlaying = false;

/**
 * 단발성 오디오 클립 재생
 * @param {string} key AUDIO_ASSETS의 키
 * @param {HTMLElement} [btnElement] 연동된 버튼 (애니메이션 토글용)
 * @param {number} [volume=0.85] 볼륨 (0.0 ~ 1.0)
 */
function playAudioClip(key, btnElement, volume = 0.85) {
    const rawSrc = AUDIO_ASSETS[key];
    if (!rawSrc) return;
    const src = rawSrc + '?v=20260909_06';

    // 만약 이미 재생 중인 같은 단발 오디오가 있다면 중지 후 재시작 또는 토글
    if (activeAudioInstances[key]) {
        activeAudioInstances[key].pause();
        activeAudioInstances[key].currentTime = 0;
        if (btnElement && btnElement.classList.contains('playing')) {
            btnElement.classList.remove('playing');
            delete activeAudioInstances[key];
            return;
        }
    }

    const audio = new Audio(src);
    audio.volume = volume;
    activeAudioInstances[key] = audio;

    if (btnElement) {
        btnElement.classList.add('playing');
        audio.onended = () => {
            btnElement.classList.remove('playing');
            delete activeAudioInstances[key];
        };
        audio.onerror = () => {
            btnElement.classList.remove('playing');
            delete activeAudioInstances[key];
        };
    } else {
        audio.onended = () => {
            delete activeAudioInstances[key];
        };
    }

    audio.play().catch(e => {
        console.warn("오디오 자동재생 제한 또는 파일 로드 오류:", e);
        if (btnElement) btnElement.classList.remove('playing');
    });
}

/**
 * 심야 앰비언스 BGM 토글
 */
function toggleBGM(btnElement) {
    if (!bgmAudio) {
        bgmAudio = new Audio(AUDIO_ASSETS.drone + '?v=20260909_06');
        bgmAudio.loop = true;
        bgmAudio.volume = 0.55;
    }

    const btn = btnElement || document.querySelector('.sound-toggle-btn');

    if (isBgmPlaying) {
        bgmAudio.pause();
        isBgmPlaying = false;
        if (btn) {
            btn.classList.remove('active');
            btn.innerHTML = '🔇 심야 앰비언스 켜기';
        }
        showToast("🔇 심야 배경 음향이 꺼졌습니다.");
    } else {
        bgmAudio.play().then(() => {
            isBgmPlaying = true;
            if (btn) {
                btn.classList.add('active');
                btn.innerHTML = '🔊 심야 앰비언스 작동 중';
            }
            showToast("🎧 심야 저주파 앰비언스가 작동합니다.");
        }).catch(err => {
            console.warn("브라우저 인터랙션 제한:", err);
            showToast("⚠️ 화면을 클릭한 후 다시 시도하십시오.");
        });
    }
}

/**
 * 놋쇠 호각 소품 클릭 시 호각 소리와 함께 토스트 출력
 */
function ringWhistleProp() {
    playAudioClip('whistle', null, 0.95);
    showToast("📯 순찰 무인의 놋쇠 호각이 날카롭게 울립니다. (Rule 2 준수)");
}

// ==========================================================================
// 8. 글로벌 블로그형 좌측 상단 슬라이딩 메뉴 & 프로젝트 모달 제어
// ==========================================================================
function togglePortfolioDrawer(forceState) {
    const drawer = document.getElementById("portfolio-drawer");
    const backdrop = document.getElementById("portfolio-drawer-backdrop");
    if (!drawer || !backdrop) return;

    const isOpen = typeof forceState === "boolean" ? forceState : !drawer.classList.contains("is-open");
    if (isOpen) {
        drawer.classList.add("is-open");
        backdrop.classList.add("is-open");
    } else {
        drawer.classList.remove("is-open");
        backdrop.classList.remove("is-open");
    }
}

function closePortfolioDrawer() {
    togglePortfolioDrawer(false);
}

// 프로젝트 상세 모달 데이터 및 제어
const PORTFOLIO_PROJECTS_DATA = {
    ulsan_bus: {
        title: "울산 시내버스 개편 빅데이터 분석 및 3-Win 에듀-DRT 맞춤형 정책 제안",
        category: "Public Big Data Analytics / Mobility Policy & DRT Simulation",
        content: `
            <h4>📌 1. 프로젝트 배경 및 문제 정의</h4>
            <p>2024년 12월 21일, 울산광역시는 522개 노선을 정비하며 '평균 이동시간 단축'이라는 성공적 성과를 발표했습니다. 그러나 신도시(매곡·송정)와 농소권 외곽 주민, 청소년들은 <strong>"버스가 30분 넘게 안 온다", "만차로 등교를 못 한다"</strong>며 거센 민원을 제기했습니다. 본 프로젝트는 시청 발표 수치 이면의 통계적 착시를 팩트체크하고, 구조적 병목 원인을 규명하여 실행 가능한 대안을 제시하고자 착수되었습니다.</p>

            <h4>🗂️ 2. 활용 데이터셋 (6종 23개 공공 빅데이터 전수 융합)</h4>
            <ul>
                <li><strong>국토교통부 STCIS 교통카드 빅데이터 (14개 파일)</strong>: 4개 시점(2024.07, 2024.11, 2025.11, 2026.07) 통행시간, 통행거리, 수단/환승 통행량 19,067건 전수 가공</li>
                <li><strong>울산시 버스 노선망 전수 데이터</strong>: 522개 노선 계통수, 배차간격, 기종점 데이터셋</li>
                <li><strong>정류소 공간정보 & 최다 이용 정류장</strong>: TOP 10 거점 정류장 및 정류소 위치 GIS 좌표 데이터</li>
                <li><strong>통계청 인구구조 & 북구 초·중·고교 현황</strong>: 22개교 학군 공간정보 및 신도시 연령대별 인구 분포</li>
                <li><strong>언론 보도 및 타 지자체 DRT 운영 실증 데이터</strong>: 8대 언론 기사 텍스트 및 수요응답형 버스 운영 계획서</li>
            </ul>

            <h4>⚙️ 3. 공정한 분석을 위한 데이터 정제 4대 원칙</h4>
            <ol>
                <li><strong>표 정리하기 (Unmerge)</strong>: STCIS 엑셀 병합 셀 복원(Forward Fill)을 통한 정형화</li>
                <li><strong>가짜 데이터(0) 필터링</strong>: 새벽 미운행 시간대의 '0분'을 제외하여 평균 하향 왜곡 방지</li>
                <li><strong>공정한 단위 표준화 (분/km)</strong>: 노선 우회에 따른 거리 변화를 통제하기 위해 '1km당 이동시간' 지표 신설</li>
                <li><strong>동일 계절 통제 (Seasonal Control)</strong>: 방학·날씨 등 외생변수 통제를 위해 개편 전(2024.11)과 개편 후(2025.11) 동월 1:1 매칭 비교</li>
            </ol>

            <h4>🚨 4. 핵심 분석 결과 및 실증 발견</h4>
            <div class="modal-chart-card">
                <img src="images/ulsan_bus/average_trap.png" alt="평균의 함정 팩트체크 차트">
                <figcaption>▲ [팩트체크] 울산시 전체 평균(개선) vs 도심(7.8% 단축) vs 외곽 농소권(21.3% 소요시간 폭증)의 심슨의 역설</figcaption>
            </div>
            <ul>
                <li><strong>[평균의 함정 규명]</strong>: 시청 발표와 달리 도심(남구·중구)은 통행시간이 7.8% 개선된 반면, 외곽 농소권은 21.3% 악화되어 <strong>'교통 양극화'</strong>가 심화됨을 실증</li>
                <li><strong>[출근-등교 만차 충돌]</strong>: 07:00~08:00 시간대 직장인 통근 수요와 중고등학생 등교 수요가 동일 노선에 동시 집중되어 탑승 거부 및 통학 대란 발생</li>
                <li><strong>[노선 쏠림의 참상]</strong>: 7번 국도(산업로) 단일 축에 44개 노선이 중복 쏠림 운행되는 반면, 유소년 인구 비율이 높은 신도시(매곡·송정)는 단 1~2개 노선에 불과 (44배 격차)</li>
                <li><strong>[32분 배차 공백]</strong>: 버스 회사 간 출발 시간 미조정으로 3~4대가 동시에 몰려온 뒤 32분간 정류장에 버스가 없는 '배차 쏠림' 실태 확인</li>
            </ul>

            <div class="modal-chart-grid">
                <div class="modal-chart-card">
                    <img src="images/ulsan_bus/bunching_timeline.png" alt="32분 배차 공백 타임라인">
                    <figcaption>▲ 32분 배차 공백 및 쏠림 타임라인</figcaption>
                </div>
                <div class="modal-chart-card">
                    <img src="images/ulsan_bus/route_sankey.png" alt="7번 국도 노선 쏠림 Sankey">
                    <figcaption>▲ 7번 국도 쏠림 vs 신도시 단절 Sankey</figcaption>
                </div>
            </div>

            <h4>💡 5. 맞춤형 정책 대안 : 『3-Win 에듀-DRT』 및 운영 솔루션</h4>
            <div class="modal-chart-card">
                <img src="images/ulsan_bus/drt_effect.png" alt="3-Win 에듀-DRT 기대효과">
                <figcaption>▲ 타 지자체 실증 기반 3-Win 에듀-DRT 도입 전후 정량적 기대효과 비교</figcaption>
            </div>
            <ul>
                <li><strong>[제안 1: 3-Win 에듀-DRT 4대 회랑]</strong>: 
                    시간대별 수요 전환형 탄력 버스 도입.<br>
                    • <em>07:30~08:30</em>: 매곡·송정 ↔ 호계·농소 중고교 '학생 통학 전용 셔틀' (통학시간 35~45분 → 12~16분 단축)<br>
                    • <em>09:30~16:30</em>: 어르신 대상 호계시장·시티병원 복지 순환 셔틀<br>
                    • <em>17:30~19:30</em>: 북울산역 KTX/동해선 연계 직장인 퇴근 환승 피더(Feeder) 버스
                </li>
                <li><strong>[제안 2: 버스 회사 간 통합 시차 배차제]</strong>: 개별 회사별 임의 출발을 금지하고 5~7분 등간격 배차 규칙 적용으로 대기시간 35분 → 7분 감축</li>
                <li><strong>[제안 3: 외곽-도심 논스톱 직행 버스 신설]</strong>: 중간 정류장 경유를 최소화하여 공업탑/시외터미널 직통 연결</li>
            </ul>

            <h4>📊 6. 정량적 기대효과 종합</h4>
            <table>
                <thead>
                    <tr>
                        <th>평가 지표</th>
                        <th>개편 직후 (현재)</th>
                        <th>3-Win 솔루션 도입 후</th>
                        <th>개선 효과</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>평균 대기시간</strong></td>
                        <td>35분 이상 (쏠림 발생)</td>
                        <td><strong>12분 이내</strong></td>
                        <td><strong>약 65% 대폭 단축</strong></td>
                    </tr>
                    <tr>
                        <td><strong>통학 소요시간</strong></td>
                        <td>35 ~ 45분</td>
                        <td><strong>12 ~ 16분</strong></td>
                        <td><strong>20분 이상 통학 시간 절약</strong></td>
                    </tr>
                    <tr>
                        <td><strong>환승 횟수</strong></td>
                        <td>1~2회 (환승 단절)</td>
                        <td><strong>0회 (직통 연결)</strong></td>
                        <td><strong>환승 스트레스 100% 해소</strong></td>
                    </tr>
                    <tr>
                        <td><strong>시민 만족도</strong></td>
                        <td>48.2점 (민원 폭증)</td>
                        <td><strong>89.5점</strong></td>
                        <td><strong>41.3점 대폭 상승</strong></td>
                    </tr>
                    <tr>
                        <td><strong>지자체 재정</strong></td>
                        <td>빈 버스 보조금 낭비</td>
                        <td><strong>수요 기반 효율 운행</strong></td>
                        <td><strong>운행비용 약 18% 절감</strong></td>
                    </tr>
                </tbody>
            </table>

            <div style="margin-top: 18px; text-align: center; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <a href="bus_map.html" target="_blank" class="project-modal-btn" style="background: rgba(230, 126, 34, 0.2); border-color: #e67e22; color: #f39c12; font-size: 13px; padding: 8px 18px; text-decoration: none;">
                    🗺️ 울산 농소권 노선 병목 인터랙티브 맵 열기 ↗
                </a>
            </div>
        `
    },
    shopping: {
        title: "NAVER API HUB 쇼핑인사이트 & 데이터랩 빅데이터 분석기",
        category: "Data Engineering / Big Data Analytics",
        content: `
            <h4>📌 프로젝트 개요 및 핵심 목표</h4>
            <p>네이버 데이터랩 쇼핑인사이트 웹 백엔드 비동기(Ajax) 엔드포인트 역공학 크롤링과 공식 NAVER API HUB(NCP API Gateway)의 8대 쇼핑인사이트 API 전수 연동을 융합한 빅데이터 쇼핑 트렌드 수집·통계 분석 파이프라인(<code>과제_쇼핑_완성.py</code>)입니다.</p>
            
            <h4>⚙️ 핵심 아키텍처 및 구현 스키마</h4>
            <ul>
                <li><strong>인증 헤더 규격화</strong>: <code>X-NCP-APIGW-API-KEY-ID</code>, <code>X-NCP-APIGW-API-KEY</code> 환경 변수(.env) 보안 관리</li>
                <li><strong>8대 공식 엔드포인트 전수 연동</strong>: 분야별/기기별/성별/연령별 트렌드 및 키워드 기반 세부 트렌드 수집</li>
                <li><strong>11대 스키마 정밀 모델링</strong>: [순위, 상대인기지수, 카테고리, 품목분류, 소비목적_타겟, 시장동향_코멘트, 쇼핑바로가기URL] 등 실무형 필드 구조화</li>
                <li><strong>4대 시계열 통계 엔진</strong>: 기초 통계량, 상대 점유율, 모멘텀 추세 판정, 최전성기 피크일 산출</li>
                <li><strong>안정적 익스포트</strong>: 엑셀 호환 UTF-8-SIG 2중 CSV 저장 및 터미널 ASCII 바 차트 시각화</li>
            </ul>
            <div class="modal-code-snippet">
# 핵심 통계 지표 산출 예시
df['점유율(%)'] = (df['클릭비율'] / df['클릭비율'].sum()) * 100
momentum = df['클릭비율'].pct_change().mean() # 모멘텀 산출
peak_date = df.loc[df['클릭비율'].idxmax()]['조회일자'] # 피크일
            </div>
        `
    },
    series: {
        title: "네이버 시리즈 웹소설 8대 장르 실시간 랭킹 & 통계 분석 엔진",
        category: "Web Scraping / Content Analytics",
        content: `
            <h4>📌 프로젝트 개요 및 핵심 목표</h4>
            <p>네이버 시리즈 웹소설 실시간 TOP 100 랭킹을 무손실 스크래핑하고, 8대 장르별(로맨스, 판타지, 무협 등) 시장 점유율 및 작품별 평점·독점율을 다각도로 분석하여 리포트하는 엔진(<code>naver_series_analyzer.py</code>)입니다.</p>
            
            <h4>⚙️ 기술 특징 및 알고리즘</h4>
            <ul>
                <li><strong>무손실 DOM 파싱</strong>: <code>em</code> 태그 결합 다중 자릿수 순위 및 변동폭 정밀 파싱</li>
                <li><strong>O(1) 장르 매칭 사전</strong>: 8대 장르 키워드 해시 룩업을 통한 초고속 메타데이터 분류</li>
                <li><strong>4대 심층 통계</strong>: 장르별 시장 점유율(%), 평균 평점 만족도, 플랫폼 독점율, 이벤트 프로모션율 분석</li>
                <li><strong>터미널 3단 리포트</strong>: TOP 10 랭킹표 + 점유율 ASCII 바 차트 + 통계 요약표 자동 렌더링</li>
            </ul>
        `
    },
    control_app: {
        title: "참수리 함교 기상관제실 : 출항 15분 전 AI 당직사관 챗봇 & 기상 대시보드",
        category: "Desktop GUI & LLM Agent",
        content: `
            <h4>📌 프로젝트 개요 및 핵심 목표</h4>
            <p>사용자(참수리 함장님)와 AI(참수리 당직사관)의 군사 지휘 페르소나를 기반으로, 출항 15분 전 기상 초민감 대응 및 기상 분석 보고서를 제출하는 데스크톱 관제 애플리케이션(<code>app.py</code> / <code>chat-ui</code>)입니다.</p>
            
            <h4>⚙️ 핵심 아키텍처 및 기능</h4>
            <ul>
                <li><strong>GPT-5.6-Luna 전용 연동</strong>: 엄격한 해군 당직사관 페르소나(복명복창 및 긴급 브리핑) 탑재</li>
                <li><strong>긴급 출항 15분 전 기상 감응</strong>: 풍속, 돌풍, 파고, 너울 데이터에 따른 즉각적인 출항 가부 점검</li>
                <li><strong>CSV 기상 보고서 자동 생성</strong>: 지휘관 명령 수신 시 <code>weather_report.csv</code> 편제 및 즉시 제출 파이프라인</li>
                <li><strong>무소음 백그라운드 런처</strong>: <code>run_silent.vbs</code> 및 원클릭 바로가기 지원</li>
            </ul>
        `
    },
    keyword_app: {
        title: "참수리 블로그 키워드 관제소 : GPT-5.6-Luna 웹 정찰 & 보고서 생성기",
        category: "AI Agent & Web Scraping / Desktop App",
        content: `
            <h4>📌 프로젝트 개요 및 핵심 목표</h4>
            <p>사용자(참수리 함장님)가 검색할 타깃 키워드(어종, 해역, 작전 단어 등)를 지정하면, 네이버 웹 문서를 실시간 정찰·스크래핑하고 GPT-5.6-Luna가 전술 브리핑 형태의 마크다운 보고서(.md)와 기사 데이터셋(.csv)을 자동 편성하는 지휘 정찰 시스템(<code>search_app.py</code> / <code>keyword-ui</code>)입니다.</p>
            
            <h4>⚙️ 시스템 특징 및 워크플로우</h4>
            <ul>
                <li><strong>타깃 키워드 정찰 스크래퍼</strong>: 검색 키워드별 1~5페이지(최대 50건) 웹 문서 실시간 DOM 추출 및 중복 제거</li>
                <li><strong>GPT-5.6-Luna 전술 브리핑 생성</strong>: 정찰된 기사 데이터를 심층 요약 분석하여 구조화된 마크다운 보고서 자동 집필</li>
                <li><strong>클라이언트 마크다운 실시간 렌더러</strong>: Vanilla JS 기반 커스텀 마크다운 파서로 표, 인라인 코드, 외부 링크 즉시 렌더링</li>
                <li><strong>CSV & MD 데이터 영구 아카이빙</strong>: <code>keyword_articles_*.csv</code> 및 <code>keyword_report_*.md</code> 원클릭 클립보드 복사 및 저장</li>
                <li><strong>원클릭 실행 바로가기</strong>: <code>참수리 블로그 키워드 관제소.lnk</code> 및 <code>run_search_silent.vbs</code> 연계 무소음 구동</li>
            </ul>
        `
    },
    news_scraper: {
        title: "네이버 뉴스 정적 본문 스크래퍼 & 텍스트 정제 파이프라인",
        category: "Text Mining / ETL Pipeline",
        content: `
            <h4>📌 프로젝트 개요 및 핵심 목표</h4>
            <p>네이버 뉴스 정적 페이지를 대상으로 언론사별 기사 본문 구조를 분석하여 무손실 텍스트 추출 및 정제, DataFrame 변환 및 CSV 저장까지 원스톱으로 처리하는 스크래퍼(<code>naver_news_scraper.py</code>)입니다.</p>
            
            <h4>⚙️ 데이터 정제 전략</h4>
            <ul>
                <li><strong>노이즈 필터링</strong>: 기자 이메일, 저작권 문구, 광고 배너 정규표현식(Regex) 일괄 제거</li>
                <li><strong>구조화 스키마</strong>: [언론사, 기사제목, 송고일시, 정제본문, URL] 표준 DataFrame 변환</li>
                <li><strong>UTF-8-SIG 인코딩</strong>: 한글 깨짐 없는 Excel 호환 CSV 파이프라인 확립</li>
            </ul>
        `
    }
};

function openProjectModal(projectId) {
    const data = PORTFOLIO_PROJECTS_DATA[projectId];
    if (!data) return;

    const modal = document.getElementById("project-detail-modal-backdrop");
    const titleEl = document.getElementById("modal-project-title");
    const categoryEl = document.getElementById("modal-project-category");
    const bodyEl = document.getElementById("modal-project-body");

    if (modal && titleEl && categoryEl && bodyEl) {
        titleEl.textContent = data.title;
        categoryEl.textContent = data.category;
        bodyEl.innerHTML = data.content;
        modal.classList.add("is-open");
    }
}

function closeProjectModal() {
    const modal = document.getElementById("project-detail-modal-backdrop");
    if (modal) modal.classList.remove("is-open");
}

// ESC 키로 사이드바 및 모달 닫기
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closePortfolioDrawer();
        closeProjectModal();
    }
});

