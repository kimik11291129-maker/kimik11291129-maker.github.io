// ==========================================================================
// [[나폴리탄 괴담] 심판의 날 안전수칙 시리즈 몰아보기 | 공포라디오 | 무서운이야기 | 매뉴얼 괴담 | 공포썰 | 수면영상 | 자기전 보는 영상] 화랑골 스타일 인터랙티브 나폴리탄 생존 게임북 엔진
// ==========================================================================

const GAME_STAGES = {
    "start": {
        "stageTitle": "【 제1막 : 22:00 근무의 시작과 전조 】",
        "time": "22:00 PM",
        "sanChange": 0,
        "image": "https://img.youtube.com/vi/W0qHcf8DVzc/maxresdefault.jpg",
        "audio": "ambient",
        "secretHint": "🩸 [선배의 혈서 쪽지] '카운터 하단 비상벨 3회 신고요령'을 어기는 순간, 당신은 오늘 밤 살아서 나갈 수 없다.",
        "text": "22:00 정각. 적막이 감도는 공간의 불이 차례로 꺼지고, 당신만의 홀로 남은 시간이 시작되었습니다.<br><br>카운터 위에 놓여 있던 낡은 코팅 종이에는 <strong>[[나폴리탄 괴담] 심판의 날 안전수칙 시리즈 몰아보기 | 공포라디오 | 무서운이야기 | 매뉴얼 괴담 | 공포썰 | 수면영상 | 자기전 보는 영상]</strong>이 붉은 잉크로 적혀 있습니다.<br><br>잠시 후, 쥐 죽은 듯 고요하던 문밖에서 정체불명의 소름 끼치는 소리가 들려오기 시작합니다.",
        "choices": [
            {
                "text": "① 수칙 제1조 준수: 조용히 몸을 웅크리고 숨을 죽인다.",
                "next": "p1_search_item"
            },
            {
                "text": "② 대수롭지 않게 여기며 소리를 무시하고 자리를 지킨다.",
                "next": "p1_ignore"
            },
            {
                "text": "③ 호기심 발동: 문틈으로 소리의 정체를 직접 내다본다.",
                "next": "be1_curiosity"
            }
        ]
    },
    "p1_search_item": {
        "stageTitle": "【 제1막 : 22:25 숨겨진 결계 유물 발견 】",
        "time": "22:25 PM",
        "sanChange": 10,
        "image": "images/talisman.jpg",
        "audio": null,
        "secretHint": "🩸 [혈서] 카운터 밑바닥에 숨겨진 성수와 열쇠는 자정 이후 절체절명의 순간에만 사용하라.",
        "gainItem": {
            "id": "relic_key",
            "name": "카운터 마스터키",
            "icon": "🗝️"
        },
        "text": "당신은 숨을 죽인 채 카운터 아래 수납장을 조심스럽게 살폈습니다.<br><br>서랍 안쪽 깊숙한 곳에서 이전 근무자가 남겨둔 <strong>[카운터 마스터키 🗝️]</strong>와 비상 결계 쪽지가 발견되었습니다.<br><br>열쇠를 쥐자 서늘했던 손끝에 온기가 돌며 넋의 안정도가 소폭 회복됩니다.",
        "choices": [
            {
                "text": "열쇠를 품속에 챙기고 다음 심야 순찰에 대비한다.",
                "next": "p2_encounter"
            }
        ]
    },
    "p1_ignore": {
        "stageTitle": "【 제1막 : 23:00 깊어지는 불안감 】",
        "time": "23:00 PM",
        "sanChange": -10,
        "image": "https://img.youtube.com/vi/W0qHcf8DVzc/maxresdefault.jpg",
        "audio": null,
        "secretHint": "🩸 [혈서] 방심하는 자부터 그림자가 삼킨다.",
        "text": "소리는 멎었지만, 등 뒤에서 느껴지는 기괴한 냉기는 사라지지 않았습니다.<br><br>식은땀이 이마를 타고 흐릅니다. 넋의 안정도가 서서히 갉아먹히고 있습니다.",
        "choices": [
            {
                "text": "호흡을 가다듬고 자정의 이형 기척에 집중한다.",
                "next": "p2_encounter"
            }
        ]
    },
    "p2_encounter": {
        "stageTitle": "【 제2막 : 01:30 '이형의 존재 대처' 】",
        "time": "01:30 AM",
        "sanChange": -15,
        "image": "images/creepy_corridor_night.jpg",
        "audio": "heartbeat",
        "secretHint": "🩸 [혈서] 눈을 마주치지 말고 침묵을 유지하십시오....",
        "text": "자정이 지나 새벽 01:30. 입구 센서 벨이 기괴하게 일그러진 음으로 울렸습니다.<br><br>문 앞에는 보통의 인간이라고는 믿기지 않을 만큼 <strong>목이 기괴하게 꺾인 손님</strong>이 서 있습니다.<br><br>수칙 <strong>[이형의 존재 대처]</strong>의 경고가 머릿속을 스칩니다: <em>\"눈을 마주치지 말고 침묵을 유지하십시오....\"</em>",
        "choices": [
            {
                "text": "① 수칙 준수: 시선을 완전히 바닥으로 내리깔고 침묵을 유지한다.",
                "next": "p2_safe_pass"
            },
            {
                "text": "② 유물 사용: 카운터 마스터키를 만지작거리며 비상벨 위치를 확인한다.",
                "requireItem": "relic_key",
                "next": "p2_key_use"
            },
            {
                "text": "③ 공포에 질려 '손님, 무엇을 도와드릴까요?'라며 얼굴을 똑바로 쳐다본다.",
                "next": "be2_eye_contact"
            }
        ]
    },
    "p2_safe_pass": {
        "stageTitle": "【 제2막 : 02:10 그것이 지나간 후 】",
        "time": "02:10 AM",
        "sanChange": 0,
        "image": "https://img.youtube.com/vi/W0qHcf8DVzc/maxresdefault.jpg",
        "audio": null,
        "secretHint": "🩸 [혈서] 백룸 쪽에서 붉은 액체가 흐른다면 절대 안을 들여다보지 마라.",
        "text": "심장이 찢어질 듯 쿵쾅거렸지만, 수칙대로 시선을 내리깔고 미동조차 하지 않았습니다.<br><br>그것은 몇 분 동안 당신의 머리칼을 스치듯 맴돌다, 기괴한 마찰음을 내며 밖으로 사라졌습니다.<br><br>위기를 한 번 넘겼지만, 새벽 3시의 결계가 당신을 기다리고 있습니다.",
        "choices": [
            {
                "text": "매장 안쪽 백룸의 이상 징후를 확인하러 간다.",
                "next": "p3_backroom"
            }
        ]
    },
    "p2_key_use": {
        "stageTitle": "【 제2막 : 02:10 마스터키의 결계 수호 】",
        "time": "02:10 AM",
        "sanChange": 15,
        "image": "images/talisman.jpg",
        "audio": null,
        "secretHint": "🩸 [혈서] 마스터키에 깃든 주사의 기운이 흉흉한 존재의 접근을 막아냈다.",
        "text": "주머니 속 <strong>카운터 마스터키</strong>에서 은은한 온기가 전해지며 기괴한 존재가 당신에게 손을 뻗지 못하고 물러섰습니다.<br><br>결계 유물의 힘으로 넋의 안정도가 회복되었습니다.",
        "choices": [
            {
                "text": "안도의 한숨을 쉬며 심야 제3막으로 이동한다.",
                "next": "p3_backroom"
            }
        ]
    },
    "p3_backroom": {
        "stageTitle": "【 제3막 : 03:45 '금기 구역 차단' 】",
        "time": "03:45 AM",
        "sanChange": -20,
        "image": "images/companion_shadow.jpg",
        "audio": "scratch",
        "secretHint": "🩸 [혈서] 핏자국이 있는 문은 즉시 봉인하십시오....",
        "text": "새벽 03:45. 마침내 수칙에서 가장 엄중히 경고하던 <strong>[금기 구역 차단]</strong>의 상황이 닥쳤습니다.<br><br>백룸 철문 손잡이에 검붉은 피가 흥건하게 묻어있고, 문 안쪽에서 무언가 벽을 긁는 소리가 납니다.<br><br><em>\"핏자국이 있는 문은 즉시 봉인하십시오....\"</em>",
        "choices": [
            {
                "text": "① 수칙 준수: 즉시 매장 문을 잠그고 '임시 휴업' 팻말을 세운다.",
                "next": "p4_dawn_check"
            },
            {
                "text": "② 혹시 갇힌 사람이 있는지 확인하기 위해 문고리를 조심스레 돌려본다.",
                "next": "be3_backroom_open"
            }
        ]
    },
    "p4_dawn_check": {
        "stageTitle": "【 제4막 : 05:50 '새벽의 교대 지침' 】",
        "time": "05:50 AM",
        "sanChange": 10,
        "image": "https://img.youtube.com/vi/W0qHcf8DVzc/maxresdefault.jpg",
        "audio": null,
        "secretHint": "🩸 [혈서] 마지막 10분이 가장 위험하다. 명찰의 한 글자라도 다르면 그것은 사람이 아니다.",
        "text": "창밖이 푸르스름하게 밝아오며 새벽 05:50이 되었습니다. 이제 10분만 버티면 퇴근입니다.<br><br>딸랑- 소리와 함께 교대자가 문을 열고 들어옵니다. 그가 환하게 웃으며 다가옵니다.<br><br>하지만 마지막 수칙 <strong>[새벽의 교대 지침]</strong>의 경고가 스칩니다: <em>\"명찰의 이름이 다르면 절대 문을 열지 마십시오....\"</em>",
        "choices": [
            {
                "text": "① 교대자의 명찰 이름과 얼굴을 수칙서 기록과 대조한다.",
                "next": "true_ending"
            },
            {
                "text": "② 반가운 마음에 서둘러 카운터를 넘겨주고 매장 밖으로 뛰어나간다.",
                "next": "be4_fake_worker"
            }
        ]
    },
    "true_ending": {
        "stageTitle": "【 🏅 생존 증명서 : 새벽 06:00 무사 교대 】",
        "time": "06:00 AM",
        "sanChange": 30,
        "image": "images/creepy_corridor_night.jpg",
        "audio": null,
        "isEnding": true,
        "endingType": "SURVIVAL",
        "secretHint": "🩸 [완전 생존 기록] 수칙을 한 치의 오차 없이 지켜낸 당신만이 이 지옥을 살아서 벗어났다.",
        "text": "06:00 정각. 알람 소리와 함께 진짜 교대자가 매장으로 들어왔습니다.<br><br>가짜 존재는 햇살이 비치는 순간 안개처럼 스러져 사라졌습니다.<br><br>당신은 <strong>[[나폴리탄 괴담] 심판의 날 안전수칙 시리즈 몰아보기 | 공포라디오 | 무서운이야기 | 매뉴얼 괴담 | 공포썰 | 수면영상 | 자기전 보는 영상]</strong>의 모든 금기를 꿰뚫고 완벽하게 살아남았습니다.<br>카운터 위에 정돈된 수칙서를 올려두며, 당신은 안도의 숨을 내쉽니다.",
        "choices": [
            {
                "text": "🔄 처음부터 다시 플레이하기",
                "next": "start"
            },
            {
                "text": "📚 나폴리탄 서고 허브로 돌아가기",
                "url": "gamebooks.html"
            }
        ]
    },
    "be1_curiosity": {
        "stageTitle": "【 💀 사망 실종 통보서 : 제1 배드엔딩 (금기 시선) 】",
        "time": "22:15 PM",
        "sanChange": -100,
        "image": "images/companion_shadow.jpg",
        "audio": "scratch",
        "isEnding": true,
        "endingType": "BAD",
        "secretHint": "🩸 [벽면 혈서] 보지 말라고 적힌 것은 절대 보지 말았어야 했다.",
        "text": "문틈으로 고개를 내민 순간, 바닥에 웅크리고 있던 그것의 충혈된 눈과 정확히 마주쳤습니다.<br><br>그것이 기괴하게 입을 찢으며 웃더니, 당신의 멱살을 잡고 어둠 속으로 끌고 들어갔습니다.<br><br>당신의 비명은 매장 문밖으로 빠져나가지 못했습니다.",
        "choices": [
            {
                "text": "🔄 수칙을 숙지하고 다시 도전하기",
                "next": "start"
            }
        ]
    },
    "be2_eye_contact": {
        "stageTitle": "【 💀 사망 실종 통보서 : 제2 배드엔딩 (이형의 잠식) 】",
        "time": "01:35 AM",
        "sanChange": -100,
        "image": "images/companion_shadow.jpg",
        "audio": "heartbeat",
        "isEnding": true,
        "endingType": "BAD",
        "secretHint": "🩸 [벽면 혈서] 그것의 눈을 본 자는 더 이상 인간으로 남을 수 없다.",
        "text": "공포를 이기지 못하고 그것의 눈을 응시한 순간, 시야가 새빨갛게 물들었습니다.<br><br>뇌 속으로 끔찍한 잡음이 쏟아져 들어오며, 당신의 의식은 영원히 육체로부터 분리되었습니다.<br><br>다음 날 아침, 카운터에는 당신의 옷을 입은 정체불명의 존재가 멍하니 서 있을 뿐이었습니다.",
        "choices": [
            {
                "text": "🔄 수칙을 숙지하고 다시 도전하기",
                "next": "start"
            }
        ]
    },
    "be3_backroom_open": {
        "stageTitle": "【 💀 사망 실종 통보서 : 제3 배드엔딩 (백룸 침탈) 】",
        "time": "03:48 AM",
        "sanChange": -100,
        "image": "images/iron_door_lock.jpg",
        "audio": "scratch",
        "isEnding": true,
        "endingType": "BAD",
        "secretHint": "🩸 [벽면 혈서] 핏자국이 묻은 문 뒤편은 이미 현실의 세계가 아니다.",
        "text": "철컥 소리와 함께 문을 열자마자, 검붉은 촉수와 악취가 쏟아져 나오며 당신을 삼켰습니다.<br><br>문은 저절로 굳게 닫혔고, 바깥 매장에는 당신의 떨어진 이름표만이 덩그러니 남았습니다.",
        "choices": [
            {
                "text": "🔄 수칙을 숙지하고 다시 도전하기",
                "next": "start"
            }
        ]
    },
    "be4_fake_worker": {
        "stageTitle": "【 💀 사망 실종 통보서 : 제4 배드엔딩 (가짜 교대자) 】",
        "time": "05:55 AM",
        "sanChange": -100,
        "image": "images/creepy_corridor_night.jpg",
        "audio": null,
        "isEnding": true,
        "endingType": "BAD",
        "secretHint": "🩸 [벽면 혈서] 마지막 순간의 방심이 영원한 어둠을 부른다.",
        "text": "명찰을 확인하지 않고 반갑게 문을 열어준 순간, 교대자의 얼굴 가죽이 흘러내렸습니다.<br><br>새벽 햇살이 비치기 불과 5분 전, 당신은 그것과 '영원한 교대'를 맺고 말았습니다.",
        "choices": [
            {
                "text": "🔄 수칙을 숙지하고 다시 도전하기",
                "next": "start"
            }
        ]
    }
};

let currentSan = 100;
let playerInventory = new Set();
let currentCompanion = "solo";
let isLanternOn = true;

function showToast(msg) {
    let toast = document.getElementById("game-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "game-toast";
        toast.style.position = "fixed";
        toast.style.bottom = "24px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.background = "rgba(20,20,30,0.95)";
        toast.style.color = "#ffd899";
        toast.style.padding = "10px 18px";
        toast.style.borderRadius = "8px";
        toast.style.border = "1px solid #b72b2b";
        toast.style.zIndex = "9999";
        toast.style.fontSize = "13px";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 2500);
}

function toggleLantern(btn) {
    isLanternOn = !isLanternOn;
    const overlay = document.getElementById("flashlight-overlay");
    if (isLanternOn) {
        btn.textContent = "🕯️ 초롱불 끄기";
        if (overlay) overlay.style.display = "none";
        document.body.classList.remove("dark-mode");
    } else {
        btn.textContent = "🕯️ 초롱불 켜기";
        if (overlay) overlay.style.display = "block";
        document.body.classList.add("dark-mode");
        showToast("🕯️ 초롱불을 껐습니다. 마우스 손전등으로 숨겨진 혈서를 찾아보세요.");
    }
}

function toggleBGM(btn) {
    btn.textContent = btn.textContent.includes("🔇") ? "🔊 심야 앰비언스" : "🔇 심야 앰비언스";
}

function updateSanHUD() {
    const bar = document.getElementById("san-bar");
    const text = document.getElementById("san-text");
    if (bar) bar.style.width = Math.max(0, Math.min(100, currentSan)) + "%";
    if (text) text.textContent = currentSan + "%";
}

function updateRelicsHUD() {
    const el = document.getElementById("relic-icons");
    if (!el) return;
    if (playerInventory.size === 0) {
        el.textContent = "없음";
        return;
    }
    el.innerHTML = Array.from(playerInventory).map(id => '<span class="relic-badge">🗝️ 소지</span>').join(" ");
}

function renderStage(stageKey) {
    const stage = GAME_STAGES[stageKey];
    if (!stage) return;

    // SAN치 반영
    if (stage.sanChange) {
        currentSan = Math.max(0, Math.min(100, currentSan + stage.sanChange));
        updateSanHUD();
    }

    // 아이템 획득
    if (stage.gainItem) {
        playerInventory.add(stage.gainItem.id);
        updateRelicsHUD();
        showToast(`🎁 [아이템 획득] ${stage.gainItem.name}`);
    }

    // 시간 반영
    const timeEl = document.getElementById("game-time");
    if (timeEl && stage.time) timeEl.textContent = stage.time;

    // 타이틀 & 지문
    const titleEl = document.getElementById("story-stage-title");
    const textEl = document.getElementById("story-text");
    if (titleEl) titleEl.innerHTML = stage.stageTitle;
    if (textEl) textEl.innerHTML = stage.text;

    // 혈서 힌트
    const hintEl = document.getElementById("blood-secret-hint");
    if (hintEl) {
        hintEl.innerHTML = stage.secretHint || "🩸 [벽면 혈서] 수칙을 벗어난 행동은 죽음을 부른다.";
    }

    // 선택지 버튼 렌더링
    const choicesBox = document.getElementById("choices-container");
    if (choicesBox) {
        choicesBox.innerHTML = "";

        // 엔딩 증명서 카드
        if (stage.isEnding) {
            const card = document.createElement("div");
            if (stage.endingType === "SURVIVAL") {
                card.style.background = "rgba(46, 204, 113, 0.15)";
                card.style.border = "1px solid #2ecc71";
                card.style.padding = "14px";
                card.style.borderRadius = "8px";
                card.style.marginBottom = "14px";
                card.innerHTML = `<h4 style="color:#2ecc71;">🏅 [공식 생존 증명서]</h4><p style="font-size:13px; color:#eee;">귀하는 밤을 무사히 넘기고 생존을 확인받았습니다.<br>최종 넋 안정도: ${currentSan}%</p>`;
            } else {
                card.style.background = "rgba(231, 76, 60, 0.15)";
                card.style.border = "1px solid #e74c3c";
                card.style.padding = "14px";
                card.style.borderRadius = "8px";
                card.style.marginBottom = "14px";
                card.innerHTML = `<h4 style="color:#ff5555;">💀 [영구 실종 통보서]</h4><p style="font-size:13px; color:#eee;">심야 수칙 위반으로 영구 실종 처리되었습니다.<br>사망 시각: ${stage.time}</p>`;
            }
            choicesBox.appendChild(card);
        }

        stage.choices.forEach(ch => {
            if (ch.requireItem && !playerInventory.has(ch.requireItem)) {
                return;
            }
            const btn = document.createElement("button");
            btn.className = "choice-btn";
            btn.style.display = "block";
            btn.style.width = "100%";
            btn.style.textAlign = "left";
            btn.style.padding = "12px 14px";
            btn.style.margin = "8px 0";
            btn.style.background = "#1a1d26";
            btn.style.border = "1px solid rgba(255,255,255,0.15)";
            btn.style.color = "#eee";
            btn.style.borderRadius = "6px";
            btn.style.cursor = "pointer";
            btn.innerHTML = ch.text;

            btn.onclick = () => {
                if (ch.url) {
                    window.location.href = ch.url;
                } else if (ch.next) {
                    renderStage(ch.next);
                }
            };
            choicesBox.appendChild(btn);
        });
    }

    const scrollArea = document.querySelector(".scroll-content-area");
    if (scrollArea) scrollArea.scrollTop = 0;
}

document.addEventListener("DOMContentLoaded", () => {
    updateSanHUD();
    updateRelicsHUD();
    if (document.getElementById("story-container")) {
        renderStage("start");
    }
});
