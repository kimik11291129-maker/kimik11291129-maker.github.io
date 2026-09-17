/**
 * 🐊🌾 16-bit Pixel Pet (Hoya) & Retro Swamp Environment Engine
 * ==========================================================================
 * - Authentic 1990~2000s Classic 2D Pixel Mascot (악어 '호야')
 * - Interactive Tamagotchi companion (Idle, Eye-blink, Happy hop, Dialogues)
 * - Web Audio API 8-bit chiptune sound synthesizer (Zero external audio files)
 * - Atmospheric retro swamp waterline shelf with swaying cattails & spores
 * - 100% dependency-free, zero impact on page interactions (pointer-events safe)
 */

(function () {
  'use strict';

  // 1. Pixel Art Matrices (40 cols x 20 rows)
  const COLOR_MAP = {
    '.': '#06150b', // dark retro outline
    'G': '#15803d', // body emerald green
    'h': '#22c55e', // bright emerald scale highlight
    's': '#0e4823', // dark dorsal scales
    'W': '#ffffff', // eye sclera
    'K': '#0f172a', // pupil
    'w': '#ffffff', // eye shine
    'n': '#06150b', // nostril dot
    't': '#ffffff', // sharp tooth
    'r': '#f87171', // blush pink
    'Y': '#fef08a', // belly pale yellow
    'y': '#facc15', // belly golden yellow
    'd': '#ca8a04', // belly shade
    '~': '#4ade80', // water ripple highlight
  };

  // Frame 0: Idle pose (looking alert, breathing)
  const FRAME_IDLE = [
    '                                        ',
    '            .....                       ',
    '           .hhhhh.                      ',
    '          .hhWWWWh.     ..    ..    ..  ',
    '          .hWKKKwh.    .ss.  .ss.  .ss. ',
    '     .... .hhWWWwh.   .ssss..ssss..ssss.',
    '   ..hhhh..hhhhhhh....sssssssssssssssss.',
    '  .nnhhhhhhhhhhhhhhhhhsssssssssssssssss.',
    ' .hhhhhhhhhhhhhhhhhhhhhhhhssssssssssss. ',
    '.hhhhhhhhhhhhhhhhhhhhhhhhhhssssssssss.  ',
    '.hGGG......GGGGGGGGGGGGGGGGGssssssss.   ',
    '.hGtt.rrrr.GGGGGGGGGGGGGGGGGGGGssss.    ',
    ' .....GGGGGGGGGGGGGGGGGGGGGGGGGGGG.     ',
    '   .yyyYYYYYYYYYYYYYYYYGGGGGGGGGG.      ',
    '  .yyyyYYYYYYYYYYYYYYYYy.GGGGGGG.       ',
    '  .ddddyyyyyyyyyyyyyyyyyd.......        ',
    '   .....................                ',
    '    ~~  ~~~~   ~~~~~   ~~~   ~~~~~   ~~ ',
    '   ~~~~~   ~~~~~   ~~~~~   ~~~~~   ~~~~ ',
    '                                        '
  ];

  // Frame 1: Blink (eyelid shut)
  const FRAME_BLINK = FRAME_IDLE.map((row, idx) => {
    if (idx === 3) return '          .hhhhhhh.     ..    ..    ..  ';
    if (idx === 4) return '          .h.....h.    .ss.  .ss.  .ss. ';
    if (idx === 5) return '     .... .hhhhhhh.   .ssss..ssss..ssss.';
    return row;
  });

  // Frame 2: Happy / Clicked (eyes ^ ^, tooth smile, tail flipped up)
  const FRAME_HAPPY = [
    '                                     .. ',
    '            .....                   .ss.',
    '           .hhhhh.           ..    .sss.',
    '          .hh...hh.     ..  .ss.  .ssss.',
    '          .h.hhh.h.    .ss..ssss..sssss.',
    '     .... .hh...hh.   .ssssssssssssssss.',
    '   ..hhhh..hhhhhhh....ssssssssssssssss. ',
    '  .nnhhhhhhhhhhhhhhhhhssssssssssssssss. ',
    ' .hhhhhhhhhhhhhhhhhhhhhhhhsssssssssss.  ',
    '.hhhhhhhhhhhhhhhhhhhhhhhhhhsssssssss.   ',
    '.hGGG......GGGGGGGGGGGGGGGGGssssss..    ',
    '.hGtt.rrrr.GGGGGGGGGGGGGGGGGGGGG..      ',
    ' .....GGGGGGGGGGGGGGGGGGGGGGGGGG.       ',
    '   .yyyYYYYYYYYYYYYYYYYGGGGGGGG.        ',
    '  .yyyyYYYYYYYYYYYYYYYYy.GGGGG.         ',
    '  .ddddyyyyyyyyyyyyyyyyyd....           ',
    '   .....................                ',
    '   ~~~~   ~~~~~   ~~~   ~~~~~   ~~~~~   ',
    '    ~~  ~~~~   ~~~~~   ~~~   ~~~~~   ~~ ',
    '                                        '
  ];

  // Reeds SVG template (24x25)
  const REEDS_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 25" style="image-rendering:pixelated;shape-rendering:crispEdges;width:100%;height:100%;">
    <rect x="8" y="1" width="2" height="1" fill="#06150b"/>
    <rect x="8" y="2" width="1" height="1" fill="#06150b"/><rect x="9" y="2" width="1" height="1" fill="#92400e"/><rect x="10" y="2" width="1" height="1" fill="#06150b"/>
    <rect x="7" y="3" width="1" height="1" fill="#06150b"/><rect x="8" y="3" width="3" height="3" fill="#92400e"/><rect x="11" y="3" width="1" height="1" fill="#06150b"/>
    <rect x="7" y="4" width="1" height="1" fill="#06150b"/><rect x="11" y="4" width="1" height="1" fill="#06150b"/>
    <rect x="7" y="5" width="1" height="1" fill="#06150b"/><rect x="11" y="5" width="1" height="1" fill="#06150b"/>
    <rect x="7" y="6" width="1" height="1" fill="#06150b"/><rect x="8" y="6" width="3" height="2" fill="#92400e"/><rect x="11" y="6" width="1" height="1" fill="#06150b"/><rect x="17" y="6" width="2" height="1" fill="#06150b"/>
    <rect x="7" y="7" width="1" height="1" fill="#06150b"/><rect x="11" y="7" width="1" height="1" fill="#06150b"/><rect x="16" y="7" width="1" height="1" fill="#06150b"/><rect x="17" y="7" width="1" height="1" fill="#92400e"/><rect x="18" y="7" width="1" height="1" fill="#06150b"/>
    <rect x="8" y="8" width="1" height="1" fill="#06150b"/><rect x="9" y="8" width="1" height="1" fill="#22c55e"/><rect x="10" y="8" width="1" height="1" fill="#06150b"/><rect x="15" y="8" width="1" height="1" fill="#06150b"/><rect x="16" y="8" width="3" height="3" fill="#92400e"/><rect x="19" y="8" width="1" height="1" fill="#06150b"/>
    <rect x="3" y="9" width="1" height="1" fill="#06150b"/><rect x="9" y="9" width="1" height="1" fill="#06150b"/><rect x="10" y="9" width="1" height="1" fill="#22c55e"/><rect x="11" y="9" width="1" height="1" fill="#06150b"/><rect x="15" y="9" width="1" height="1" fill="#06150b"/><rect x="19" y="9" width="1" height="1" fill="#06150b"/>
    <rect x="2" y="10" width="1" height="1" fill="#06150b"/><rect x="3" y="10" width="1" height="1" fill="#22c55e"/><rect x="4" y="10" width="1" height="1" fill="#06150b"/><rect x="9" y="10" width="1" height="1" fill="#06150b"/><rect x="10" y="10" width="1" height="1" fill="#22c55e"/><rect x="11" y="10" width="1" height="1" fill="#06150b"/><rect x="15" y="10" width="1" height="1" fill="#06150b"/><rect x="19" y="10" width="1" height="1" fill="#06150b"/>
    <rect x="2" y="11" width="1" height="1" fill="#06150b"/><rect x="3" y="11" width="1" height="1" fill="#22c55e"/><rect x="4" y="11" width="1" height="1" fill="#06150b"/><rect x="9" y="11" width="1" height="1" fill="#06150b"/><rect x="10" y="11" width="1" height="1" fill="#22c55e"/><rect x="11" y="11" width="1" height="1" fill="#06150b"/><rect x="16" y="11" width="1" height="1" fill="#06150b"/><rect x="17" y="11" width="1" height="1" fill="#22c55e"/><rect x="18" y="11" width="1" height="1" fill="#06150b"/>
    <rect x="1" y="12" width="1" height="1" fill="#06150b"/><rect x="2" y="12" width="2" height="1" fill="#22c55e"/><rect x="4" y="12" width="1" height="1" fill="#06150b"/><rect x="8" y="12" width="1" height="1" fill="#06150b"/><rect x="9" y="12" width="1" height="1" fill="#22c55e"/><rect x="10" y="12" width="1" height="1" fill="#06150b"/><rect x="16" y="12" width="1" height="1" fill="#06150b"/><rect x="17" y="12" width="1" height="1" fill="#22c55e"/><rect x="18" y="12" width="1" height="1" fill="#06150b"/><rect x="22" y="12" width="1" height="1" fill="#06150b"/>
    <rect x="1" y="13" width="1" height="1" fill="#06150b"/><rect x="2" y="13" width="2" height="1" fill="#22c55e"/><rect x="4" y="13" width="1" height="1" fill="#06150b"/><rect x="8" y="13" width="1" height="1" fill="#06150b"/><rect x="9" y="13" width="1" height="1" fill="#22c55e"/><rect x="10" y="13" width="1" height="1" fill="#06150b"/><rect x="16" y="13" width="1" height="1" fill="#06150b"/><rect x="17" y="13" width="1" height="1" fill="#22c55e"/><rect x="18" y="13" width="1" height="1" fill="#06150b"/><rect x="21" y="13" width="1" height="1" fill="#06150b"/><rect x="22" y="13" width="1" height="1" fill="#22c55e"/><rect x="23" y="13" width="1" height="1" fill="#06150b"/>
    <rect x="1" y="14" width="1" height="1" fill="#06150b"/><rect x="2" y="14" width="2" height="1" fill="#22c55e"/><rect x="4" y="14" width="1" height="1" fill="#06150b"/><rect x="8" y="14" width="1" height="1" fill="#06150b"/><rect x="9" y="14" width="1" height="1" fill="#22c55e"/><rect x="10" y="14" width="1" height="1" fill="#06150b"/><rect x="15" y="14" width="1" height="1" fill="#06150b"/><rect x="16" y="14" width="1" height="1" fill="#22c55e"/><rect x="17" y="14" width="1" height="1" fill="#06150b"/><rect x="21" y="14" width="1" height="1" fill="#06150b"/><rect x="22" y="14" width="1" height="1" fill="#22c55e"/><rect x="23" y="14" width="1" height="1" fill="#06150b"/>
    <rect x="2" y="15" width="1" height="1" fill="#06150b"/><rect x="3" y="15" width="1" height="1" fill="#22c55e"/><rect x="4" y="15" width="1" height="1" fill="#06150b"/><rect x="8" y="15" width="1" height="1" fill="#06150b"/><rect x="9" y="15" width="1" height="1" fill="#22c55e"/><rect x="10" y="15" width="1" height="1" fill="#06150b"/><rect x="15" y="15" width="1" height="1" fill="#06150b"/><rect x="16" y="15" width="1" height="1" fill="#22c55e"/><rect x="17" y="15" width="1" height="1" fill="#06150b"/><rect x="21" y="15" width="1" height="1" fill="#06150b"/><rect x="22" y="15" width="1" height="1" fill="#22c55e"/><rect x="23" y="15" width="1" height="1" fill="#06150b"/>
    <rect x="2" y="16" width="1" height="1" fill="#06150b"/><rect x="3" y="16" width="1" height="1" fill="#22c55e"/><rect x="4" y="16" width="1" height="1" fill="#06150b"/><rect x="7" y="16" width="1" height="1" fill="#06150b"/><rect x="8" y="16" width="1" height="1" fill="#22c55e"/><rect x="9" y="16" width="1" height="1" fill="#06150b"/><rect x="15" y="16" width="1" height="1" fill="#06150b"/><rect x="16" y="16" width="1" height="1" fill="#22c55e"/><rect x="17" y="16" width="1" height="1" fill="#06150b"/><rect x="20" y="16" width="1" height="1" fill="#06150b"/><rect x="21" y="16" width="1" height="1" fill="#22c55e"/><rect x="22" y="16" width="1" height="1" fill="#06150b"/>
    <rect x="3" y="17" width="1" height="1" fill="#06150b"/><rect x="4" y="17" width="1" height="1" fill="#22c55e"/><rect x="5" y="17" width="1" height="1" fill="#06150b"/><rect x="7" y="17" width="1" height="1" fill="#06150b"/><rect x="8" y="17" width="1" height="1" fill="#22c55e"/><rect x="9" y="17" width="1" height="1" fill="#06150b"/><rect x="15" y="17" width="1" height="1" fill="#06150b"/><rect x="16" y="17" width="1" height="1" fill="#22c55e"/><rect x="17" y="17" width="1" height="1" fill="#06150b"/><rect x="20" y="17" width="1" height="1" fill="#06150b"/><rect x="21" y="17" width="1" height="1" fill="#22c55e"/><rect x="22" y="17" width="1" height="1" fill="#06150b"/>
    <rect x="3" y="18" width="1" height="1" fill="#06150b"/><rect x="4" y="18" width="1" height="1" fill="#22c55e"/><rect x="5" y="18" width="1" height="1" fill="#06150b"/><rect x="6" y="18" width="1" height="1" fill="#06150b"/><rect x="7" y="18" width="1" height="1" fill="#22c55e"/><rect x="8" y="18" width="1" height="1" fill="#06150b"/><rect x="15" y="18" width="1" height="1" fill="#06150b"/><rect x="16" y="18" width="1" height="1" fill="#22c55e"/><rect x="17" y="18" width="1" height="1" fill="#06150b"/><rect x="19" y="18" width="1" height="1" fill="#06150b"/><rect x="20" y="18" width="1" height="1" fill="#22c55e"/><rect x="21" y="18" width="1" height="1" fill="#06150b"/>
    <rect x="4" y="19" width="1" height="1" fill="#06150b"/><rect x="5" y="19" width="1" height="1" fill="#22c55e"/><rect x="6" y="19" width="1" height="1" fill="#06150b"/><rect x="7" y="19" width="1" height="1" fill="#22c55e"/><rect x="8" y="19" width="1" height="1" fill="#06150b"/><rect x="14" y="19" width="1" height="1" fill="#06150b"/><rect x="15" y="19" width="1" height="1" fill="#22c55e"/><rect x="16" y="19" width="1" height="1" fill="#06150b"/><rect x="18" y="19" width="1" height="1" fill="#06150b"/><rect x="19" y="19" width="1" height="1" fill="#22c55e"/><rect x="20" y="19" width="1" height="1" fill="#06150b"/>
    <rect x="5" y="20" width="1" height="1" fill="#06150b"/><rect x="6" y="20" width="2" height="3" fill="#22c55e"/><rect x="8" y="20" width="1" height="1" fill="#06150b"/><rect x="14" y="20" width="1" height="3" fill="#06150b"/><rect x="15" y="20" width="1" height="3" fill="#22c55e"/><rect x="16" y="20" width="1" height="3" fill="#06150b"/><rect x="18" y="20" width="1" height="3" fill="#06150b"/><rect x="19" y="20" width="1" height="3" fill="#22c55e"/><rect x="20" y="20" width="1" height="3" fill="#06150b"/>
  </svg>`;

  // 2. Pet Dialogues Pool
  const PET_DIALOGUES = [
    "안녕하세요! 디지털 빌더 김호선의 아카이브예요 🐊",
    "배고프면 늪지대 악어버거를 찾아주세요 🍔",
    "심심할 땐 상단 [게임] 탭에서 호야추 한 판! 🎲",
    "방명록에 발도장을 남겨주시면 큰 힘이 됩니다 📝",
    "포트폴리오의 [상세 연구 보고서]에서 심층 분석을 확인해보세요 📜",
    "화면 아래 갈대 숲에서 헤엄치는 중이에요~ 🌾",
    "16-bit 레트로 도트 감성, 마음에 드시나요? ✨",
    "오늘도 늪지대 개발 캠프에 오신 것을 환영합니다! 🌲"
  ];

  let currentDialogueIndex = -1;
  let bubbleTimeout = null;
  let isJumping = false;
  let currentFrame = 0; // 0: IDLE, 1: BLINK, 2: HAPPY

  // 3. Web Audio API Chiptune Jump Synth
  function playRetroBlip() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      // Note 1: E5 (659.25Hz) -> B5 (987.77Hz) fast chiptune hop
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.07);
      gain1.gain.setValueAtTime(0.06, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Note 2: E6 (1318.5Hz) bright sparkle chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1318.5, now + 0.04);
      gain2.gain.setValueAtTime(0.04, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.17);
    } catch (e) {
      // Ignore muted/restricted audio
    }
  }

  // 4. Canvas Renderer for Hoya
  function drawFrame(canvas, frameArt) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < frameArt.length; y++) {
      const row = frameArt[y];
      for (let x = 0; x < row.length; x++) {
        const char = row[x];
        const color = COLOR_MAP[char];
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }

  // 5. Mount Environment & Companion
  function initSwampAndPet() {
    // 5-1. Create Swamp Layer if not exists
    if (!document.getElementById('swampDecor')) {
      const swamp = document.createElement('div');
      swamp.id = 'swampDecor';
      swamp.className = 'swamp-decor-layer';
      swamp.setAttribute('aria-hidden', 'true');

      // Reeds placement
      const reedsContainer = document.createElement('div');
      reedsContainer.className = 'swamp-reeds-container';

      const reedPlacements = [
        { left: '20px', scale: '1.0', delay: '0s' },
        { left: '26%', scale: '0.82', delay: '0.7s' },
        { left: '52%', scale: '0.92', delay: '1.4s' },
        { left: '74%', scale: '0.78', delay: '2.1s' },
        { right: '160px', scale: '1.1', delay: '0.3s' }
      ];

      reedPlacements.forEach((item) => {
        const reedEl = document.createElement('div');
        reedEl.className = 'swamp-reed-cluster';
        if (item.left) reedEl.style.left = item.left;
        if (item.right) reedEl.style.right = item.right;
        reedEl.style.transform = `scale(${item.scale})`;
        reedEl.style.animationDelay = item.delay;
        reedEl.innerHTML = REEDS_SVG;
        reedsContainer.appendChild(reedEl);
      });

      // Swamp shelf
      const waterShelf = document.createElement('div');
      waterShelf.className = 'swamp-water-shelf';

      // Floating spores
      const sporeLayer = document.createElement('div');
      sporeLayer.className = 'swamp-spores-container';
      for (let i = 0; i < 4; i++) {
        const spore = document.createElement('div');
        spore.className = `swamp-spore-dot spore-${i + 1}`;
        sporeLayer.appendChild(spore);
      }

      swamp.appendChild(reedsContainer);
      swamp.appendChild(waterShelf);
      swamp.appendChild(sporeLayer);
      document.body.appendChild(swamp);
    }

    // 5-2. Create Pixel Pet Companion if not exists
    if (!document.getElementById('pixelPetWrap')) {
      const petWrap = document.createElement('div');
      petWrap.id = 'pixelPetWrap';
      petWrap.className = 'pixel-pet-wrap';
      petWrap.setAttribute('role', 'button');
      petWrap.setAttribute('tabindex', '0');
      petWrap.setAttribute('title', '악어 호야 (클릭해보세요!)');

      // Speech bubble
      const bubble = document.createElement('div');
      bubble.id = 'petSpeechBubble';
      bubble.className = 'pixel-speech-bubble';
      bubble.style.display = 'none';

      // Canvas
      const canvas = document.createElement('canvas');
      canvas.id = 'pixelPetCanvas';
      canvas.className = 'pixel-pet-canvas';
      canvas.width = 40;
      canvas.height = 20;

      petWrap.appendChild(bubble);
      petWrap.appendChild(canvas);
      document.body.appendChild(petWrap);

      // Initial render
      drawFrame(canvas, FRAME_IDLE);

      // Idle eye-blink routine
      setInterval(() => {
        if (isJumping || currentFrame === 2) return;
        currentFrame = 1;
        drawFrame(canvas, FRAME_BLINK);
        setTimeout(() => {
          if (!isJumping && currentFrame === 1) {
            currentFrame = 0;
            drawFrame(canvas, FRAME_IDLE);
          }
        }, 160);
      }, 3600);

      // Show dialogue function
      function triggerPetInteraction() {
        if (isJumping) return;
        isJumping = true;
        currentFrame = 2; // HAPPY frame
        drawFrame(canvas, FRAME_HAPPY);

        // Chiptune sound
        playRetroBlip();

        // Jump animation class
        petWrap.classList.add('pet-jumping');
        setTimeout(() => {
          petWrap.classList.remove('pet-jumping');
          isJumping = false;
          currentFrame = 0;
          drawFrame(canvas, FRAME_IDLE);
        }, 450);

        // Next dialogue (no back-to-back repeats)
        let nextIdx;
        do {
          nextIdx = Math.floor(Math.random() * PET_DIALOGUES.length);
        } while (nextIdx === currentDialogueIndex && PET_DIALOGUES.length > 1);
        currentDialogueIndex = nextIdx;

        bubble.textContent = PET_DIALOGUES[currentDialogueIndex];
        bubble.style.display = 'block';
        bubble.classList.remove('bubble-pop');
        // Trigger reflow for animation restart
        void bubble.offsetWidth;
        bubble.classList.add('bubble-pop');

        if (bubbleTimeout) clearTimeout(bubbleTimeout);
        bubbleTimeout = setTimeout(() => {
          bubble.style.display = 'none';
        }, 5500);
      }

      petWrap.addEventListener('click', triggerPetInteraction);
      petWrap.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerPetInteraction();
        }
      });

      // Hover reaction
      petWrap.addEventListener('mouseenter', () => {
        if (!isJumping && currentFrame === 0) {
          currentFrame = 2; // perk up happy
          drawFrame(canvas, FRAME_HAPPY);
        }
      });
      petWrap.addEventListener('mouseleave', () => {
        if (!isJumping && currentFrame === 2) {
          currentFrame = 0;
          drawFrame(canvas, FRAME_IDLE);
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwampAndPet);
  } else {
    initSwampAndPet();
  }
})();
