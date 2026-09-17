/**
 * 🌌 Taiga Interactive Arctic Aurora Stream Engine
 * -------------------------------------------------------------
 * 100% 순수 HTML5 Canvas & Web Audio/GPU 가속 오로라 광선 엔진
 * - 북극광(Aurora Borealis): 에메랄드 그린 + 시안 블루 + 바이올렛 퍼플
 * - 마우스 좌표에 반응하여 부드럽게 굽이치는 실크 리본 인터랙션
 * - CPU 최적화: requestAnimationFrame & 탭 비활성화 시 자동 절전
 */

(function () {
  'use strict';

  // 캔버스 초기화 또는 생성
  let canvas = document.getElementById('auroraCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'auroraCanvas';
    canvas.className = 'aurora-canvas';
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;

  // 마우스 위치 및 스프링 보간
  const mouse = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.25,
    targetX: window.innerWidth * 0.5,
    targetY: window.innerHeight * 0.25,
    speed: 0,
    isHover: false
  };

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

  window.addEventListener('mousemove', function (e) {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isHover = true;
  }, { passive: true });

  window.addEventListener('mouseleave', function () {
    mouse.isHover = false;
    mouse.targetX = width * 0.5;
    mouse.targetY = height * 0.22;
  });

  // 오로라 리본 레이어 설정 (에메랄드, 시안, 바이올렛, 딥 틸)
  const RIBBONS = [
    {
      baseY: 0.16,
      amplitude: 55,
      frequency: 0.0022,
      speed: 0.00075,
      curtainHeight: 280,
      colorTop: 'rgba(56, 189, 248, 0.0)',       // 하늘색 페이드
      colorMid: 'rgba(34, 211, 238, 0.42)',      // 오로라 시안
      colorCore: 'rgba(74, 222, 128, 0.52)',     // 메인 에메랄드
      colorBottom: 'rgba(168, 85, 247, 0.28)',   // 퍼플 잔광
      mouseInfluence: 0.35,
      phase: 0
    },
    {
      baseY: 0.22,
      amplitude: 70,
      frequency: 0.0018,
      speed: 0.0006,
      curtainHeight: 340,
      colorTop: 'rgba(34, 211, 238, 0.0)',
      colorMid: 'rgba(74, 222, 128, 0.48)',      // 밝은 에메랄드 민트
      colorCore: 'rgba(16, 185, 129, 0.38)',
      colorBottom: 'rgba(147, 51, 234, 0.22)',   // 심야 바이올렛
      mouseInfluence: 0.45,
      phase: 2.1
    },
    {
      baseY: 0.28,
      amplitude: 60,
      frequency: 0.0026,
      speed: 0.0009,
      curtainHeight: 310,
      colorTop: 'rgba(168, 85, 247, 0.0)',
      colorMid: 'rgba(192, 132, 252, 0.35)',     // 오로라 라일락
      colorCore: 'rgba(45, 212, 191, 0.45)',     // 틸 에메랄드
      colorBottom: 'rgba(6, 78, 59, 0.0)',
      mouseInfluence: 0.25,
      phase: 4.2
    },
    {
      baseY: 0.12,
      amplitude: 40,
      frequency: 0.0031,
      speed: 0.0011,
      curtainHeight: 220,
      colorTop: 'rgba(16, 185, 129, 0.0)',
      colorMid: 'rgba(110, 231, 183, 0.38)',     // 형광 민트
      colorCore: 'rgba(56, 189, 248, 0.32)',
      colorBottom: 'rgba(0, 0, 0, 0)',
      mouseInfluence: 0.2,
      phase: 1.2
    }
  ];

  let time = 0;
  let animId = null;

  function drawAurora() {
    ctx.clearRect(0, 0, width, height);

    // 마우스 위치 스프링 보간 (부드러운 추종)
    const lerp = 0.045;
    mouse.x += (mouse.targetX - mouse.x) * lerp;
    mouse.y += (mouse.targetY - mouse.y) * lerp;

    time += 1;

    // 블렌드 모드: 오로라 빛이 겹치면 눈부시게 밝아짐
    ctx.globalCompositeOperation = 'screen';

    for (let r = 0; r < RIBBONS.length; r++) {
      const rib = RIBBONS[r];
      const ribbonBaseY = height * rib.baseY;
      const step = 8; // 가로 정밀도 (px)
      const points = [];

      // 커브 포인트 계산
      for (let x = 0; x <= width + step; x += step) {
        // 복합 사인파 (파동 1 + 파동 2 + 파동 3)
        const wave1 = Math.sin(x * rib.frequency + time * rib.speed + rib.phase);
        const wave2 = Math.cos(x * rib.frequency * 1.8 - time * rib.speed * 0.7 + rib.phase * 0.5);
        const wave3 = Math.sin(x * 0.0008 + time * rib.speed * 1.4);

        let y = ribbonBaseY + (wave1 * 0.6 + wave2 * 0.3 + wave3 * 0.1) * rib.amplitude;

        // 마우스 상호작용 (마우스 위치 주변으로 오로라 커튼이 굽이쳐 끌려옴)
        const dx = x - mouse.x;
        const dist = Math.abs(dx);
        const mouseRadius = width * 0.38;
        if (dist < mouseRadius) {
          const factor = Math.cos((dist / mouseRadius) * (Math.PI * 0.5));
          const pull = (mouse.y - ribbonBaseY) * factor * rib.mouseInfluence;
          y += pull;
        }

        points.push({ x, y });
      }

      if (points.length < 2) continue;

      // 상단 파동 커브를 따라 오로라 수직 광선 커튼 렌더링
      const curtainHeight = rib.curtainHeight;

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      // 하단으로 커튼을 닫음
      for (let i = points.length - 1; i >= 0; i--) {
        ctx.lineTo(points[i].x, points[i].y + curtainHeight);
      }
      ctx.closePath();

      // 수직 오로라 그라데이션
      const avgY = ribbonBaseY;
      const grad = ctx.createLinearGradient(0, avgY - 40, 0, avgY + curtainHeight);
      grad.addColorStop(0, rib.colorTop);
      grad.addColorStop(0.22, rib.colorMid);
      grad.addColorStop(0.55, rib.colorCore);
      grad.addColorStop(0.85, rib.colorBottom);
      grad.addColorStop(1, 'rgba(12, 20, 16, 0.0)');

      ctx.fillStyle = grad;
      ctx.fill();

      // 오로라 볏(Crest) 샤프 네온 라인 하이라이트
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = rib.colorMid;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';
    animId = requestAnimationFrame(drawAurora);
  }

  // 탭 가시성 변화 시 절전
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (animId) cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(drawAurora);
    }
  });

  animId = requestAnimationFrame(drawAurora);
})();
