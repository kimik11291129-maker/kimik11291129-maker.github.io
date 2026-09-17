/**
 * 🌌 1안: Taiga Silky GPU Aurora Waves
 * -------------------------------------------------------------
 * 100% 순수 GPU 하드웨어 가속 실키 웨이브 오로라 마운트 엔진
 * - 에메랄드 그린 + 시안 블루 + 심야 바이올렛 + 민트 틸 4개 파동
 * - filter: blur() 및 GPU 가속 키프레임 무한 실키 일렁임 연출
 */
(function () {
  'use strict';

  function initAuroraBackdrop() {
    // 기존 캔버스 제거
    const oldCanvas = document.getElementById('auroraCanvas');
    if (oldCanvas) oldCanvas.remove();

    if (document.querySelector('.aurora-backdrop')) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'aurora-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');

    for (let i = 1; i <= 4; i++) {
      const beam = document.createElement('div');
      beam.className = 'aurora-glow-' + i;
      backdrop.appendChild(beam);
    }

    document.body.prepend(backdrop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuroraBackdrop);
  } else {
    initAuroraBackdrop();
  }
})();
