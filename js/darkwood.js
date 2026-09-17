/**
 * 🕯️ Darkwood Retro Pixel Engine (다크우드 레트로 픽셀 가스등 & 불씨 엔진)
 * --------------------------------------------------------------------------
 * - 100% 구식 레트로 픽셀(Old-School Pixel Art) 렌더링 (저해상도 버퍼 + pixelated 스케일)
 * - 관성을 가진 가스등(Gas Lantern) 조명: 마우스 추적, 불꽃 일렁임(Flicker), 픽셀 디더링 빛 번짐
 * - 타오르는 픽셀 불씨(Pixel Embers) 상승 + 숲속 부유 포자(Pixel Spores) 산란
 * - 칠흑 같은 숲속 묵직한 외곽 픽셀 비네팅(Vignette)
 * - 초경량 60fps 최적화
 */

(function () {
  'use strict';

  // 1. 캔버스 마운트
  let canvas = document.getElementById('darkwoodCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'darkwoodCanvas';
    canvas.className = 'darkwood-canvas';
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 구식 픽셀 도트 배율 (실제 화면 3~4픽셀당 1개 도트 블록)
  const PIXEL_SCALE = 3;
  let renderWidth = 0;
  let renderHeight = 0;
  let screenWidth = 0;
  let screenHeight = 0;

  function resize() {
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    renderWidth = Math.max(1, Math.floor(screenWidth / PIXEL_SCALE));
    renderHeight = Math.max(1, Math.floor(screenHeight / PIXEL_SCALE));

    canvas.width = renderWidth;
    canvas.height = renderHeight;

    // 레트로 픽셀 앤티앨리어싱 제거
    ctx.imageSmoothingEnabled = false;
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // 2. 가스등(Lantern) 물리 상태
  let mouseX = renderWidth / 2;
  let mouseY = renderHeight / 3;
  let lanternX = mouseX;
  let lanternY = mouseY;
  let hasUserMoved = false;

  window.addEventListener('mousemove', (e) => {
    hasUserMoved = true;
    mouseX = e.clientX / PIXEL_SCALE;
    mouseY = e.clientY / PIXEL_SCALE;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      hasUserMoved = true;
      mouseX = e.touches[0].clientX / PIXEL_SCALE;
      mouseY = e.touches[0].clientY / PIXEL_SCALE;
    }
  }, { passive: true });

  // 3. 픽셀 불씨(Embers) & 숲속 포자(Spores) 파티클 풀
  const PARTICLE_COUNT = 85;
  const particles = [];

  // 색상 팔레트 (다크우드 레트로 픽셀)
  const EMBER_COLORS = [
    '#ffdd66', // 타오르는 백열심
    '#ff9922', // 가스등 앰버
    '#f97316', // 불꽃 주황
    '#dc2626', // 붉은 숯불씨
    '#7f1d1d'  // 식어가는 잉걸불
  ];

  const SPORE_COLORS = [
    '#5c6347', // 눅눅한 숲속 이끼 포자
    '#78716c', // 고목 잿빛 부유물
    '#44403c', // 어두운 나무껍질 파편
    '#854d0e'  // 썩은 호박빛 곰팡이
  ];

  class PixelParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      // 60% 확률로 상승 불씨, 40% 확률로 부유 포자
      this.isEmber = Math.random() < 0.65;
      this.size = Math.random() < 0.25 ? 2 : 1; // 1x1 또는 2x2 도트

      if (this.isEmber) {
        // 불씨: 화면 하단이나 가스등 주변에서 생성되어 상승
        if (!initial && Math.random() < 0.4 && hasUserMoved) {
          this.x = lanternX + (Math.random() - 0.5) * 60;
          this.y = lanternY + (Math.random() - 0.5) * 40;
        } else {
          this.x = Math.random() * renderWidth;
          this.y = initial ? Math.random() * renderHeight : renderHeight + 5;
        }
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -(0.3 + Math.random() * 0.7); // 위로 상승
        this.color = EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)];
        this.life = 0;
        this.maxLife = 120 + Math.random() * 150;
      } else {
        // 포자: 사방으로 천천히 유영
        this.x = Math.random() * renderWidth;
        this.y = initial ? Math.random() * renderHeight : Math.random() * renderHeight;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.color = SPORE_COLORS[Math.floor(Math.random() * SPORE_COLORS.length)];
        this.life = 0;
        this.maxLife = 200 + Math.random() * 200;
      }
    }

    update() {
      this.life++;
      if (this.life >= this.maxLife) {
        this.reset();
        return;
      }

      // 바람 및 미세 흔들림
      this.x += this.vx + Math.sin(this.life * 0.05) * 0.2;
      this.y += this.vy;

      // 화면 경계 체크
      if (this.x < -10 || this.x > renderWidth + 10 || this.y < -10 || this.y > renderHeight + 10) {
        this.reset();
      }
    }

    draw(ctx, lX, lY) {
      // 가스등과의 거리 계산
      const dx = this.x - lX;
      const dy = this.y - lY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 가스등 불빛 반경 내에 있으면 밝아짐
      let alpha = 1 - this.life / this.maxLife;
      if (this.isEmber) {
        alpha = Math.min(1, alpha * 1.3);
      } else {
        // 포자는 조명 근처일 때만 은은하게 비침
        const lightBoost = Math.max(0, 1 - dist / 110);
        alpha = Math.min(0.85, alpha * (0.25 + lightBoost * 0.75));
      }

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      // 정수 픽셀 격자에 맞춰 찍기 (구식 도트 룩 보장)
      const px = Math.floor(this.x);
      const py = Math.floor(this.y);
      ctx.fillRect(px, py, this.size, this.size);
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new PixelParticle());
  }

  // 4. 레트로 픽셀 가스등 조명 렌더링 (Dithered Stepped Pixel Glow)
  let tick = 0;

  function drawPixelLantern(ctx, x, y) {
    // 유기적 불꽃 일렁임(Flicker)
    const flicker = Math.sin(tick * 0.12) * 3 + Math.sin(tick * 0.37) * 2 + (Math.random() - 0.5) * 2.5;
    const baseRadius = 85 + flicker;

    const ix = Math.floor(x);
    const iy = Math.floor(y);

    // 4단계 구식 픽셀 동심원 계단식 빛 퍼짐 (Stepped Pixel Bands)
    // 외곽 어둠 속 1단계 (잔잔한 앰버 림)
    ctx.beginPath();
    ctx.arc(ix, iy, baseRadius * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(217, 119, 6, 0.04)';
    ctx.fill();

    // 2단계 (다크우드 숲속 따스한 불빛)
    ctx.beginPath();
    ctx.arc(ix, iy, baseRadius * 1.1, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(234, 88, 12, 0.08)';
    ctx.fill();

    // 3단계 (가스등 내부 심장부)
    ctx.beginPath();
    ctx.arc(ix, iy, baseRadius * 0.65, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.13)';
    ctx.fill();

    // 4단계 (중심 백열 픽셀 코어)
    ctx.beginPath();
    ctx.arc(ix, iy, baseRadius * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 225, 120, 0.22)';
    ctx.fill();

    // 중심 가스등 심지 작은 픽셀
    ctx.fillStyle = '#ffedd5';
    ctx.fillRect(ix - 1, iy - 1, 2, 2);
  }

  // 5. 숲속 외곽 픽셀 비네팅 (Vignette)
  function drawPixelVignette(ctx) {
    // 테두리 영역에 묵직한 어둠의 픽셀 그라데이션
    const grad = ctx.createRadialGradient(
      renderWidth / 2, renderHeight / 2, Math.min(renderWidth, renderHeight) * 0.25,
      renderWidth / 2, renderHeight / 2, Math.max(renderWidth, renderHeight) * 0.72
    );
    grad.addColorStop(0, 'rgba(13, 11, 9, 0)');
    grad.addColorStop(0.65, 'rgba(13, 11, 9, 0.45)');
    grad.addColorStop(1, 'rgba(9, 7, 5, 0.88)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, renderWidth, renderHeight);
  }

  // 6. 메인 애니메이션 루프 (60fps)
  let isRunning = true;

  function render() {
    if (!isRunning) return;

    tick++;

    // 기본 숲속 배경 클리어 (썩은 고목 흑갈색 베이스)
    ctx.fillStyle = '#0d0b09';
    ctx.fillRect(0, 0, renderWidth, renderHeight);

    // 마우스 가스등 부드러운 물리 관성 추적
    if (!hasUserMoved) {
      // 사용자 입력 전에는 화면 중앙 상단에서 자연스럽게 흔들림
      mouseX = (renderWidth / 2) + Math.sin(tick * 0.02) * (renderWidth * 0.15);
      mouseY = (renderHeight / 3) + Math.cos(tick * 0.03) * 20;
    }
    lanternX += (mouseX - lanternX) * 0.075;
    lanternY += (mouseY - lanternY) * 0.075;

    // 1) 가스등 조명 렌더링
    drawPixelLantern(ctx, lanternX, lanternY);

    // 2) 픽셀 불씨 & 포자 업데이트 및 렌더링
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(ctx, lanternX, lanternY);
    }

    // 3) 외곽 비네팅 렌더링
    drawPixelVignette(ctx);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

  // 7. 탭 비활성화 시 자동 절전
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
    } else {
      if (!isRunning) {
        isRunning = true;
        requestAnimationFrame(render);
      }
    }
  });

})();
