/**
 * ❄️👾 1990~2000 Classic 2D Pixel Snowflake Engine (js/snow.js)
 * -------------------------------------------------------------
 * 16-bit 고전 콘솔/PC RPG 감성의 6각 대칭 픽셀 눈결정(Pixel Crystals) 엔진
 * - 4종의 고전 2D 도트 눈결정(Dendrite, Stellar Plate, Fernlike, Diamond Sparkle) 사전 렌더링
 * - 마우스 커서의 이동에 따른 숲속 미세 기류(Wind Draft) 물리 반응
 * - 좌우 물결 흔들림(Sway)과 픽셀 회전(Stepped/Smooth Rotation)
 * - 에버포레스트(Everforest) 서리 화이트 & 에메랄드 은은한 발광
 * - 60fps 초경량 requestAnimationFrame 최적화
 */

(function () {
  'use strict';

  // 1. 캔버스 엘리먼트 마운트
  let canvas = document.getElementById('snowCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'snowCanvas';
    canvas.className = 'snow-canvas';
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // 2. 16-bit 레트로 픽셀 눈결정 4종 오프스크린 생성
  const CRYSTAL_CANVASES = [];
  const TEXTURE_SIZE = 48; // 픽셀 텍스처 그리드

  // 픽셀 그리기 헬퍼 (정수 좌표 사각 블록)
  function drawPixel(c, x, y, size, color) {
    c.fillStyle = color;
    c.fillRect(Math.round(x), Math.round(y), size, size);
  }

  function createPixelCrystal(drawFn) {
    const off = document.createElement('canvas');
    off.width = TEXTURE_SIZE;
    off.height = TEXTURE_SIZE;
    const octx = off.getContext('2d');
    octx.imageSmoothingEnabled = false;
    const cx = TEXTURE_SIZE / 2;
    const cy = TEXTURE_SIZE / 2;
    drawFn(octx, cx, cy);
    return off;
  }

  // ❄️ 픽셀 결정 1: 정통 16-bit 6각 덴드라이트 가지 결정 (Dendrite Pixel Crystal)
  CRYSTAL_CANVASES.push(createPixelCrystal((c, cx, cy) => {
    const p = 2; // 기본 픽셀 블록 크기
    // 중심 코어
    drawPixel(c, cx - p, cy - p, p * 2, '#ffffff');

    // 6방향 픽셀 가지
    for (let angle = 0; angle < 6; angle++) {
      const rad = (angle * Math.PI) / 3;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      // 주 줄기 (거리 3~18px)
      for (let r = 3; r <= 18; r += 3) {
        const x = cx + cos * r - p / 2;
        const y = cy + sin * r - p / 2;
        const color = r > 14 ? '#e5ece6' : '#ffffff';
        drawPixel(c, x, y, p, color);
      }

      // 곁가지 1 (중간 지점)
      const r1 = 8;
      const px1 = cx + cos * r1;
      const py1 = cy + sin * r1;
      const normRad1 = rad + Math.PI / 2;
      drawPixel(c, px1 + Math.cos(normRad1) * 4 - p / 2, py1 + Math.sin(normRad1) * 4 - p / 2, p, '#86efac');
      drawPixel(c, px1 - Math.cos(normRad1) * 4 - p / 2, py1 - Math.sin(normRad1) * 4 - p / 2, p, '#86efac');

      // 곁가지 2 (바깥 지점)
      const r2 = 14;
      const px2 = cx + cos * r2;
      const py2 = cy + sin * r2;
      drawPixel(c, px2 + Math.cos(normRad1) * 3 - p / 2, py2 + Math.sin(normRad1) * 3 - p / 2, p, '#4ade80');
      drawPixel(c, px2 - Math.cos(normRad1) * 3 - p / 2, py2 - Math.sin(normRad1) * 3 - p / 2, p, '#4ade80');
    }
  }));

  // ❄️ 픽셀 결정 2: 16-bit 스텔라 판상 기하학 결정 (Stellar Plate Pixel Crystal)
  CRYSTAL_CANVASES.push(createPixelCrystal((c, cx, cy) => {
    const p = 2;
    // 중심 코어
    drawPixel(c, cx - p, cy - p, p * 2, '#4ade80');

    // 6방향 다이아몬드 돌출부
    for (let angle = 0; angle < 6; angle++) {
      const rad = (angle * Math.PI) / 3;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      for (let r = 4; r <= 16; r += 3) {
        const w = r <= 10 ? 3 : 2;
        drawPixel(c, cx + cos * r - w / 2, cy + sin * r - w / 2, w, '#ffffff');
      }

      // 측면 브릿지
      const midR = 9;
      const mx = cx + cos * midR;
      const my = cy + sin * midR;
      const sideRad = rad + Math.PI / 3;
      drawPixel(c, mx + Math.cos(sideRad) * 4 - p / 2, my + Math.sin(sideRad) * 4 - p / 2, p, '#bbf7d0');
    }
  }));

  // ❄️ 픽셀 결정 3: 양치식물 깃털형 섬세한 픽셀 눈꽃 (Fernlike Pixel Flake)
  CRYSTAL_CANVASES.push(createPixelCrystal((c, cx, cy) => {
    const p = 2;
    drawPixel(c, cx - 1, cy - 1, 2, '#ffffff');

    for (let angle = 0; angle < 6; angle++) {
      const rad = (angle * Math.PI) / 3;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);

      for (let r = 3; r <= 19; r += 2.5) {
        drawPixel(c, cx + cos * r - 1, cy + sin * r - 1, p, '#f0fdf4');
      }

      // 3단 깃털 가지
      [6, 11, 15].forEach((dist, idx) => {
        const bx = cx + cos * dist;
        const by = cy + sin * dist;
        const branchLen = (3 - idx) * 2;
        const bRad = rad + Math.PI / 2.5;
        drawPixel(c, bx + Math.cos(bRad) * branchLen - 1, by + Math.sin(bRad) * branchLen - 1, p, '#86efac');
        drawPixel(c, bx - Math.cos(bRad) * branchLen - 1, by - Math.sin(bRad) * branchLen - 1, p, '#86efac');
      });
    }
  }));

  // ❄️ 픽셀 결정 4: 반짝이는 16-bit 다이아몬드 얼음 스파클 (Diamond Ice Sparkle)
  CRYSTAL_CANVASES.push(createPixelCrystal((c, cx, cy) => {
    const p = 2;
    // 4방향 롱 스파클 + 대각선 숏 스파클
    drawPixel(c, cx - p, cy - p, p * 2, '#ffffff');
    const lengths = [14, 14, 14, 14];
    for (let i = 0; i < 4; i++) {
      const rad = (i * Math.PI) / 2;
      for (let r = 3; r <= lengths[i]; r += 2.5) {
        drawPixel(c, cx + Math.cos(rad) * r - 1, cy + Math.sin(rad) * r - 1, p, r > 9 ? '#fef3c7' : '#ffffff');
      }
      // 대각선 미세 픽셀
      const diagRad = rad + Math.PI / 4;
      drawPixel(c, cx + Math.cos(diagRad) * 5 - 1, cy + Math.sin(diagRad) * 5 - 1, p, '#4ade80');
    }
  }));

  // 3. 파티클 풀 생성 (원경/중경/근경 총 85개)
  const FLAKE_COUNT = 85;
  const flakes = [];

  for (let i = 0; i < FLAKE_COUNT; i++) {
    const depth = Math.random() * 0.8 + 0.2; // 0.2 ~ 1.0
    flakes.push({
      x: Math.random() * (width || 1200),
      y: Math.random() * (height || 800),
      depth: depth,
      // 크기: 원경 8px ~ 근경 30px (정수 스케일링 느낌)
      size: Math.round(9 + depth * 22),
      // 낙하 속도 (0.4 ~ 1.6 px/frame)
      speedY: 0.35 + depth * 1.15,
      // 좌우 흔들림 진폭과 주기
      swayAmp: 10 + depth * 16,
      swayFreq: 0.008 + Math.random() * 0.012,
      swayOffset: Math.random() * Math.PI * 2,
      // 회전 속도 (도트 느낌을 살린 회전)
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.016,
      // 불투명도
      alpha: 0.25 + depth * 0.7,
      // 텍스처 타입
      type: Math.floor(Math.random() * CRYSTAL_CANVASES.length)
    });
  }

  // 4. 마우스 인터랙션: 커서 주변의 미세 기류(Wind Draft)
  let mouseX = width * 0.5;
  let mouseY = height * 0.5;
  let mouseSpeedX = 0;
  let prevMouseX = mouseX;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseSpeedX = (mouseX - prevMouseX) * 0.22;
    prevMouseX = mouseX;
  }, { passive: true });

  let windX = 0;
  let animId = null;

  // 5. 렌더 루프 (60fps)
  function render() {
    ctx.clearRect(0, 0, width, height);

    // 바람 감쇠
    windX += (mouseSpeedX - windX) * 0.04;
    mouseSpeedX *= 0.92;

    const time = Date.now() * 0.001;

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];

      // 마우스 거리 계산 및 기류 밀림
      const dx = f.x - mouseX;
      const dy = f.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const localWind = windX * f.depth;

      if (dist < 160) {
        const force = (1 - dist / 160) * 1.6;
        f.x += (dx / (dist || 1)) * force;
        f.y += (dy / (dist || 1)) * force * 0.4;
      }

      // 수직 낙하 & 좌우 부드러운 물결 흔들림
      f.y += f.speedY;
      f.x += Math.sin(time * 1.5 + f.swayOffset) * (f.swayAmp * 0.035) + localWind;
      f.rotation += f.rotSpeed;

      // 화면 경계 순환 리스폰
      if (f.y > height + 35) {
        f.y = -30;
        f.x = Math.random() * width;
      }
      if (f.x > width + 35) f.x = -30;
      if (f.x < -35) f.x = width + 30;

      // 픽셀 렌더링
      ctx.save();
      ctx.globalAlpha = f.alpha;
      ctx.translate(Math.round(f.x), Math.round(f.y));
      ctx.rotate(f.rotation);

      const offCanvas = CRYSTAL_CANVASES[f.type];
      const rSize = f.size;
      ctx.drawImage(
        offCanvas,
        Math.round(-rSize * 0.5),
        Math.round(-rSize * 0.5),
        rSize,
        rSize
      );

      ctx.restore();
    }

    animId = requestAnimationFrame(render);
  }

  // 탭 비활성화 시 절전
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(render);
    }
  });

  animId = requestAnimationFrame(render);
})();

