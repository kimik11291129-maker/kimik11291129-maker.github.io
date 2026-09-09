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
    const src = AUDIO_ASSETS[key];
    if (!src) return;

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
        bgmAudio = new Audio(AUDIO_ASSETS.drone);
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

