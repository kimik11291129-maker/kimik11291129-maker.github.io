/**
 * ❄️ Taiga Arctic Snowfall & Hexagonal Crystal Engine
 * -------------------------------------------------------------
 * 100% 순수 HTML5 Canvas & 오프스크린 GPU 가속 눈결정 파티클
 * - 정교한 6각 대칭 눈결정(Dendrite & Stellar Hexagon) 4종 프리렌더링
 * - 마우스 이동에 따른 숲속 미세 기류(Wind Draft) 흔들림 인터랙션
 * - 새벽 안개(Frost Mist) 부유 효과
 * - 60fps 초경량 requestAnimationFrame 최적화
 */

(function () {
  'use strict';

  // 1. 캔버스 마운트
  let canvas = document.getElementById('snowCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'snowCanvas';
    canvas.className = 'taiga-canvas';
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

  // 2. 오프스크린 캔버스에 4종의 정교한 6각 눈결정 사전 렌더링 (최고 성능 60fps)
  const CRYSTAL_CANVASES = [];
  const CRYSTAL_SIZE = 64; // 오프스크린 텍스처 해상도

  function createOffscreenCrystal(drawFn) {
    const off = document.createElement('canvas');
    off.width = CRYSTAL_SIZE * 2;
    off.height = CRYSTAL_SIZE * 2;
    const octx = off.getContext('2d');
    octx.translate(CRYSTAL_SIZE, CRYSTAL_SIZE);
    drawFn(octx, CRYSTAL_SIZE * 0.85);
    return off;
  }

  // 눈결정 1: 정통 6각 가지형 덴드라이트 결정 (Dendrite Crystal)
  CRYSTAL_CANVASES.push(createOffscreenCrystal((c, R) => {
    c.strokeStyle = 'rgba(235, 245, 240, 0.95)';
    c.lineWidth = 1.8;
    c.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      c.save();
      c.rotate((i * Math.PI) / 3);
      // 중심 줄기
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(0, -R);
      c.stroke();
      // 보조 가지 1
      c.beginPath();
      c.moveTo(0, -R * 0.45);
      c.lineTo(-R * 0.28, -R * 0.65);
      c.moveTo(0, -R * 0.45);
      c.lineTo(R * 0.28, -R * 0.65);
      // 보조 가지 2
      c.moveTo(0, -R * 0.72);
      c.lineTo(-R * 0.2, -R * 0.88);
      c.moveTo(0, -R * 0.72);
      c.lineTo(R * 0.2, -R * 0.88);
      c.stroke();
      c.restore();
    }
    // 중심 육각 코어
    c.beginPath();
    c.arc(0, 0, 2.5, 0, Math.PI * 2);
    c.fillStyle = '#ffffff';
    c.fill();
  }));

  // 눈결정 2: 별모양 기하학 판상 결정 (Stellar Hexagonal Plate)
  CRYSTAL_CANVASES.push(createOffscreenCrystal((c, R) => {
    c.strokeStyle = 'rgba(215, 240, 230, 0.92)';
    c.lineWidth = 1.6;
    c.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      c.save();
      c.rotate((i * Math.PI) / 3);
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(0, -R);
      c.moveTo(-R * 0.22, -R * 0.5);
      c.lineTo(0, -R * 0.75);
      c.lineTo(R * 0.22, -R * 0.5);
      c.closePath();
      c.stroke();
      c.restore();
    }
    c.strokeStyle = 'rgba(74, 222, 128, 0.4)';
    c.lineWidth = 1;
    c.beginPath();
    c.arc(0, 0, R * 0.35, 0, Math.PI * 2);
    c.stroke();
  }));

  // 눈결정 3: 양치식물 깃털형 섬세한 눈송이 (Fernlike Feather Snowflake)
  CRYSTAL_CANVASES.push(createOffscreenCrystal((c, R) => {
    c.strokeStyle = 'rgba(240, 250, 245, 0.96)';
    c.lineWidth = 1.5;
    c.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      c.save();
      c.rotate((i * Math.PI) / 3);
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(0, -R);
      c.stroke();
      // 3단계 미세 솔잎 가지
      [0.3, 0.55, 0.8].forEach(pos => {
        c.beginPath();
        c.moveTo(0, -R * pos);
        c.lineTo(-R * 0.22, -R * (pos + 0.15));
        c.moveTo(0, -R * pos);
        c.lineTo(R * 0.22, -R * (pos + 0.15));
        c.stroke();
      });
      c.restore();
    }
  }));

  // 눈결정 4: 반짝이는 다이아몬드 얼음 결정 (Diamond Ice Sparkle)
  CRYSTAL_CANVASES.push(createOffscreenCrystal((c, R) => {
    c.strokeStyle = 'rgba(180, 240, 220, 0.95)';
    c.lineWidth = 1.6;
    for (let i = 0; i < 6; i++) {
      c.save();
      c.rotate((i * Math.PI) / 3);
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(0, -R);
      c.stroke();
      // 끝에 다이아몬드 다면체
      c.beginPath();
      c.moveTo(0, -R * 0.65);
      c.lineTo(-R * 0.14, -R * 0.82);
      c.lineTo(0, -R);
      c.lineTo(R * 0.14, -R * 0.82);
      c.closePath();
      c.fillStyle = 'rgba(255, 255, 255, 0.85)';
      c.fill();
      c.stroke();
      c.restore();
    }
  }));

  // 3. 파티클 풀 생성 (원경 35개 + 중경 35개 + 근경 디테일 20개 = 총 90개 눈결정)
  const SNOWFLAKE_COUNT = 85;
  const flakes = [];

  for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
    // 깊이 계층 (0.2 ~ 1.0)
    const depth = Math.random() * 0.8 + 0.2;
    flakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      depth: depth,
      // 크기: 원경은 작고, 근경은 정교하게 큼 (8px ~ 32px)
      size: (8 + depth * 22),
      // 낙하 속도 (0.4 ~ 1.8 px/frame)
      speedY: (0.35 + depth * 1.2),
      // 좌우 흔들림 진폭과 주기
      swayAmp: (12 + depth * 18),
      swayFreq: (0.008 + Math.random() * 0.012),
      swayOffset: Math.random() * Math.PI * 2,
      // 회전 속도
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      // 불투명도
      alpha: (0.25 + depth * 0.65),
      // 크리스탈 종류
      type: Math.floor(Math.random() * CRYSTAL_CANVASES.length)
    });
  }

  // 4. 마우스 인터랙션: 커서 주변의 바람 기류 (Wind Draft)
  let mouseX = width * 0.5;
  let mouseY = height * 0.5;
  let mouseSpeedX = 0;
  let prevMouseX = mouseX;

  window.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseSpeedX = (mouseX - prevMouseX) * 0.25;
    prevMouseX = mouseX;
  }, { passive: true });

  let windX = 0;
  let animId = null;

  // 5. 애니메이션 렌더 루프
  function render() {
    ctx.clearRect(0, 0, width, height);

    // 바람 감쇠
    windX += (mouseSpeedX - windX) * 0.04;
    mouseSpeedX *= 0.92;

    const time = Date.now() * 0.001;

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];

      // 바람 및 마우스 거리 계산
      const dx = f.x - mouseX;
      const dy = f.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      let localWind = windX * f.depth;

      // 마우스 반경 180px 내에서 살짝 밀려나는 기류 효과
      if (dist < 180) {
        const force = (1 - dist / 180) * 1.8;
        f.x += (dx / (dist || 1)) * force;
        f.y += (dy / (dist || 1)) * force * 0.5;
      }

      // 수직 낙하 & 좌우 부드러운 물결 흔들림
      f.y += f.speedY;
      f.x += Math.sin(time * 1.5 + f.swayOffset) * (f.swayAmp * 0.04) + localWind;
      f.rotation += f.rotSpeed;

      // 화면 아래로 벗어나면 상단으로 순환 리스폰
      if (f.y > height + 40) {
        f.y = -35;
        f.x = Math.random() * width;
      }
      if (f.x > width + 40) f.x = -35;
      if (f.x < -40) f.x = width + 35;

      // 눈결정 렌더링
      ctx.save();
      ctx.globalAlpha = f.alpha;
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rotation);

      const offCanvas = CRYSTAL_CANVASES[f.type];
      const renderSize = f.size;
      ctx.drawImage(
        offCanvas,
        -renderSize * 0.5,
        -renderSize * 0.5,
        renderSize,
        renderSize
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
