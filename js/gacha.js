/**
 * ============================================================================
 * 🎰 악어 아케이드 도트 캡슐 가챠 머신 로직 (gacha.js)
 * 늪지대 공용 재화(가넷, 악어이빨) 연동 및 극악의 확률 도트 컬렉션 시스템
 * ============================================================================
 */

(function () {
  'use strict';

  // -------------------------------------------------------------
  // 1. 공용 재화 지갑 매니저
  // -------------------------------------------------------------
  const Wallet = {
    GARNET_KEY: 'hell_poker_yacht_garnets',
    TEETH_KEY: 'croctato_teeth_tokens',

    getGarnets() {
      // 보유 중인 가넷 수량을 로컬스토리지에서 가져옵니다.
      const val = localStorage.getItem(this.GARNET_KEY);
      return val !== null ? parseInt(val, 10) : 20;
    },

    setGarnets(val) {
      // 가넷 잔액을 저장하고 화면 표시를 업데이트합니다.
      localStorage.setItem(this.GARNET_KEY, Math.max(0, val));
      const el = document.getElementById('walletGarnetText');
      if (el) el.textContent = Math.max(0, val);
    },

    getTeeth() {
      // 보유 중인 악어이빨 수량을 로컬스토리지에서 가져옵니다.
      const val = localStorage.getItem(this.TEETH_KEY);
      return val !== null ? parseInt(val, 10) : 0;
    },

    setTeeth(val) {
      // 악어이빨 잔액을 저장하고 화면 표시를 업데이트합니다.
      localStorage.setItem(this.TEETH_KEY, Math.max(0, val));
      const el = document.getElementById('walletTeethText');
      if (el) el.textContent = Math.max(0, val);
    }
  };

  // -------------------------------------------------------------
  // 2. 레트로 8비트 사운드 이펙트 (Web Audio API)
  // -------------------------------------------------------------
  const GachaSound = {
    ctx: null,

    init() {
      // 오디오 컨텍스트를 사용자 인터랙션 시점에 초기화합니다.
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.ctx = new AudioContext();
      }
    },

    playCoin() {
      // 동전/재화 투입 시 울리는 맑은 전자음을 재생합니다.
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, t);
      osc.frequency.setValueAtTime(1318.51, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    },

    playLever() {
      // 가챠 머신 레버를 찰칵 돌릴 때의 기계음을 재생합니다.
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.15);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    },

    playCapsuleDrop() {
      // 캡슐이 덜컹 굴러 떨어질 때의 통통 튀는 효과음을 재생합니다.
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.setValueAtTime(180, t + 0.08);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    },

    playTrash() {
      // 꽝 아이템 획득 시 재생되는 힘빠지는 단조 부저음을 재생합니다.
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.35);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    },

    playRare() {
      // 레어/에픽 아이템 획득 시 재생되는 경쾌한 아케이드 팡파레를 재생합니다.
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);
      });
    },

    playJackpot() {
      // 전설 및 초극악 신화 당첨 시 재생되는 화려한 대박 팡파레를 울립니다.
      this.init();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.28);
      });
    }
  };

  // -------------------------------------------------------------
  // 3. 극악 확률 가챠 아이템 풀 (Pool & Probabilities)
  // -------------------------------------------------------------
  const TIERS = {
    TRASH: { key: 'trash', name: '꽝/폐기물', color: '#64748b', rate: 85.000 },
    NORM: { key: 'norm', name: '노말', color: '#10b981', rate: 10.000 },
    RARE: { key: 'rare', name: '레어', color: '#38bdf8', rate: 4.000 },
    EPIC: { key: 'epic', name: '에픽', color: '#a855f7', rate: 0.900 },
    LEGENDARY: { key: 'legendary', name: '전설 (극악)', color: '#f59e0b', rate: 0.090 },
    MYTHIC: { key: 'mythic', name: '신화 (0.01%)', color: '#ec4899', rate: 0.010 }
  };

  const ITEMS = [
    // 🪨 꽝/폐기물 (85.0%)
    { id: 'trash_fish', name: '썩은 생선 가시', tier: TIERS.TRASH, icon: '🐟', desc: '파리만 꼬이는 늪지의 생선 뼈다귀.', scrapValue: 1 },
    { id: 'trash_boot', name: '찢어진 고무장화', tier: TIERS.TRASH, icon: '🥾', desc: '물에 푹 젖어 썩은 냄새가 진동합니다.', scrapValue: 1 },
    { id: 'trash_fry', name: '눅눅한 감자튀김', tier: TIERS.TRASH, icon: '🍟', desc: '바삭함과 소금기가 증발한 차가운 감자튀김.', scrapValue: 1 },
    { id: 'trash_can', name: '찌그러진 빈 깡통', tier: TIERS.TRASH, icon: '🥫', desc: '발로 차면 깡- 소리만 요란하게 납니다.', scrapValue: 1 },
    { id: 'trash_receipt', name: '찢긴 영수증', tier: TIERS.TRASH, icon: '🧾', desc: '"꽝! 다음 기회에 도전하세요"라고 적혀 있습니다.', scrapValue: 1 },
    { id: 'trash_mud', name: '늪지 진흙 덩어리', tier: TIERS.TRASH, icon: '💩', desc: '손에 묻으면 하루 종일 씻겨나가지 않습니다.', scrapValue: 1 },

    // 🥉 노말 (10.0%)
    { id: 'norm_salt', name: '픽셀 맛소금', tier: TIERS.NORM, icon: '🧂', desc: '버거 패티에 살짝 뿌리면 감칠맛이 도는 픽셀 소금.', scrapValue: 3 },
    { id: 'norm_pickle', name: '아삭한 피클 조각', tier: TIERS.NORM, icon: '🥒', desc: '새콤달콤해서 느끼함을 잡아주는 오이지 조각.', scrapValue: 3 },
    { id: 'norm_chip', name: '가짜 플라스틱 칩', tier: TIERS.NORM, icon: '🪙', desc: '카지노 바닥에 굴러다니던 장난감 칩.', scrapValue: 3 },

    // 🥈 레어 (4.0%)
    { id: 'rare_gold_pickle', name: '황금 피클 뱃지', tier: TIERS.RARE, icon: '✨🥒', desc: '24K 황금 도금으로 번쩍이는 명품 피클 브로치.', scrapValue: 10 },
    { id: 'rare_dice', name: '크리스탈 다이스', tier: TIERS.RARE, icon: '🎲💎', desc: '영롱한 빛을 내뿜는 호야추 아케이드 기념 주사위.', scrapValue: 10 },
    { id: 'rare_spatula', name: '은빛 버거 뒤집개', tier: TIERS.RARE, icon: '🍳', desc: '전문 악어 셰프의 숨결이 깃든 주방 도구.', scrapValue: 10 },

    // 🥇 에픽 (0.90%)
    { id: 'epic_glasses', name: '바이퍼 선글라스', tier: TIERS.EPIC, icon: '🕶️', desc: '착용하면 카지노 악어들이 긴장하는 바이퍼 선글라스.', scrapValue: 35, image: 'images/croc_gambler_64.png' },
    { id: 'epic_chef_hat', name: '특급 셰프 모자', tier: TIERS.EPIC, icon: '👨‍🍳', desc: '늪지 1티어 햄버거 장인만 쓸 수 있는 순백의 셰프 모자.', scrapValue: 35, image: 'images/croc_chef_64.png' },
    { id: 'epic_bandana', name: '서바이벌 반다나', tier: TIERS.EPIC, icon: '🪓', desc: '20웨이브 생존 지옥을 돌파한 레인저의 붉은 두건.', scrapValue: 35, image: 'images/croc_ranger_64.png' },

    // 💎 전설 (0.09%)
    { id: 'leg_crown', name: '늪지 제국 순금 왕관', tier: TIERS.LEGENDARY, icon: '👑', desc: '늪지의 모든 악어가 머리를 조아리는 절대 군주의 보관.', scrapValue: 150, image: 'images/croc_emperor_64.png' },
    { id: 'leg_golden_croc', name: '황금 중갑 악어 상', tier: TIERS.LEGENDARY, icon: '🦖', desc: '극악의 0.09% 확률을 뚫고 획득한 기적의 황금 기념상!', scrapValue: 200, image: 'images/hrocodile_64.png' },
    { id: 'leg_burger_grail', name: '무한의 성배 버거', tier: TIERS.LEGENDARY, icon: '🍔', desc: '한 입 베어 물어도 영원히 줄어들지 않는 전설의 버거.', scrapValue: 200, image: 'images/item_burger.png' },

    // 🌌 신화 (0.01% - 만 분의 일 극악)
    { id: 'myth_cosmic_gator', name: '초차원 코스믹 악어 신', tier: TIERS.MYTHIC, icon: '🌌🪐', desc: '0.01% 기적의 확률! 시공간을 초월한 우주의 창조신 악어가 강림했습니다!', scrapValue: 1000, image: 'images/title_banner.jpg' }
  ];

  // -------------------------------------------------------------
  // 4. 도감 & 인벤토리 데이터 관리
  // -------------------------------------------------------------
  const Compendium = {
    STORAGE_KEY: 'gacha_dot_compendium_v1',
    FREE_KEY: 'gacha_last_free_date',

    getSaved() {
      // 로컬스토리지에서 획득한 도트 아이템 수량 맵을 불러옵니다.
      const val = localStorage.getItem(this.STORAGE_KEY);
      return val ? JSON.parse(val) : {};
    },

    save(data) {
      // 획득한 도트 아이템 목록을 로컬스토리지에 저장합니다.
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      this.render();
    },

    addItem(itemId) {
      // 뽑은 아이템을 도감에 누적 추가합니다.
      const data = this.getSaved();
      data[itemId] = (data[itemId] || 0) + 1;
      this.save(data);
    },

    canClaimDailyFree() {
      // 오늘 날짜 기준 일일 1회 무료 뽑기 가능 여부를 확인합니다.
      const today = new Date().toISOString().slice(0, 10);
      const last = localStorage.getItem(this.FREE_KEY);
      return last !== today;
    },

    claimDailyFree() {
      // 일일 무료 뽑기를 사용 완료 처리합니다.
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(this.FREE_KEY, today);
      this.updateFreeButton();
    },

    updateFreeButton() {
      // 무료 뽑기 버튼 상태를 활성/비활성으로 전환합니다.
      const btn = document.getElementById('btnDailyFree');
      const info = document.getElementById('dailyFreeInfoText');
      if (!btn || !info) return;

      if (this.canClaimDailyFree()) {
        btn.disabled = false;
        btn.textContent = '무료 뽑기 1회!';
        info.textContent = '🎁 오늘의 1회 무료 뽑기가 준비되어 있습니다!';
      } else {
        btn.disabled = true;
        btn.textContent = '내일 다시 가능';
        info.textContent = '✅ 오늘 무료 뽑기를 완료했습니다. (내일 00시 리셋)';
      }
    },

    render() {
      // 도감 그리드 카드 및 수집 달성률(%)을 화면에 렌더링합니다.
      const grid = document.getElementById('compendiumGrid');
      const badge = document.getElementById('invProgressBadge');
      if (!grid) return;

      const saved = this.getSaved();
      let unlockedCount = 0;

      grid.innerHTML = ITEMS.map(item => {
        const count = saved[item.id] || 0;
        const isUnlocked = count > 0;
        if (isUnlocked) unlockedCount++;

        const iconHtml = item.image
          ? `<img src="${item.image}" alt="${item.name}">`
          : `<span>${item.icon}</span>`;

        return `
          <div class="compendium-card ${isUnlocked ? 'unlocked' : 'locked'} tier-${item.tier.key}" title="${item.name}: ${item.desc} (확률: ${item.tier.rate}%)">
            ${isUnlocked && count > 1 ? `<span class="compendium-count">x${count}</span>` : ''}
            <div class="compendium-icon-box">${isUnlocked ? iconHtml : '❓'}</div>
            <div class="compendium-name">${isUnlocked ? item.name : '???'}</div>
            <span class="compendium-tier-tag" style="background:${item.tier.color}22; color:${item.tier.color}; border:1px solid ${item.tier.color}66;">
              ${item.tier.name}
            </span>
          </div>
        `;
      }).join('');

      if (badge) {
        const pct = Math.round((unlockedCount / ITEMS.length) * 100);
        badge.textContent = `도감 수집률: ${unlockedCount}/${ITEMS.length} (${pct}%)`;
      }
    },

    scrapAllTrash() {
      // 꽝/폐기물 아이템들을 일괄 분해(갈갈이)하여 가넷으로 환급합니다.
      const saved = this.getSaved();
      let totalRefund = 0;
      let trashCount = 0;

      ITEMS.forEach(item => {
        if (item.tier.key === 'trash' && saved[item.id] > 0) {
          const qty = saved[item.id];
          totalRefund += qty * item.scrapValue;
          trashCount += qty;
          delete saved[item.id];
        }
      });

      if (trashCount === 0) {
        alert('분해할 꽝/폐기물 아이템이 없습니다!');
        return;
      }

      this.save(saved);
      Wallet.setGarnets(Wallet.getGarnets() + totalRefund);
      GachaSound.playCoin();
      alert(`♻️ 폐기물 ${trashCount}개를 분해하여 가넷 🔴 +${totalRefund}개를 환급받았습니다!`);
    }
  };

  // -------------------------------------------------------------
  // 5. 캡슐 돔 캔버스 물리 도트 애니메이션
  // -------------------------------------------------------------
  const DomeAnim = {
    canvas: null,
    ctx: null,
    capsules: [],
    animId: null,
    isShaking: false,

    init() {
      // 가챠 돔 내부 캔버스와 통통 튀는 도트 캡슐들을 초기화합니다.
      this.canvas = document.getElementById('gachaDomeCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = 280;
      this.canvas.height = 240;

      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#fde047'];
      this.capsules = [];
      for (let i = 0; i < 16; i++) {
        this.capsules.push({
          x: 40 + Math.random() * 200,
          y: 80 + Math.random() * 120,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          r: 14 + Math.random() * 4,
          color: colors[i % colors.length],
          angle: Math.random() * Math.PI * 2
        });
      }
      this.loop();
    },

    triggerShake(durationMs = 800) {
      // 뽑기 시 머신을 흔들고 캡슐들을 맹렬하게 요동치게 합니다.
      this.isShaking = true;
      this.capsules.forEach(c => {
        c.vx = (Math.random() - 0.5) * 14;
        c.vy = -Math.random() * 16;
      });
      setTimeout(() => {
        this.isShaking = false;
      }, durationMs);
    },

    loop() {
      // 캡슐들의 프레임별 물리 위치를 계산하고 도트 스타일로 렌더링합니다.
      this.animId = requestAnimationFrame(() => this.loop());
      if (!this.ctx) return;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, 280, 240);

      const gravity = 0.25;
      const friction = 0.98;

      this.capsules.forEach(c => {
        c.vy += gravity;
        c.vx *= friction;
        c.vy *= friction;

        c.x += c.vx;
        c.y += c.vy;

        // 돔 내부 경계 충돌 처리
        if (c.x - c.r < 20) { c.x = 20 + c.r; c.vx *= -0.8; }
        if (c.x + c.r > 260) { c.x = 260 - c.r; c.vx *= -0.8; }
        if (c.y + c.r > 230) { c.y = 230 - c.r; c.vy *= -0.7; }
        if (c.y - c.r < 40) { c.y = 40 + c.r; c.vy *= -0.8; }

        // 도트 캡슐 렌더링 (투톤 반구)
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.angle);

        // 상단 컬러 반구
        ctx.beginPath();
        ctx.arc(0, 0, c.r, Math.PI, 0, false);
        ctx.fillStyle = c.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#05130b';
        ctx.stroke();

        // 하단 흰색 반구
        ctx.beginPath();
        ctx.arc(0, 0, c.r, 0, Math.PI, false);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.stroke();

        // 중앙 연결 밴드
        ctx.fillStyle = '#05130b';
        ctx.fillRect(-c.r, -2, c.r * 2, 4);

        ctx.restore();
      });
    }
  };

  // -------------------------------------------------------------
  // 6. 극악 가챠 추첨 알고리즘 & 결과 처리기
  // -------------------------------------------------------------
  const GachaCore = {
    isBusy: false,

    rollOne() {
      // 0.000 ~ 100.000% 난수를 발생시켜 극악의 확률 테이블에 매핑합니다.
      const rand = Math.random() * 100.0;
      let currentThreshold = 0.0;

      // 1. 신화 (0.010%)
      currentThreshold += TIERS.MYTHIC.rate;
      if (rand < currentThreshold) {
        const list = ITEMS.filter(i => i.tier.key === TIERS.MYTHIC.key);
        return list[Math.floor(Math.random() * list.length)];
      }

      // 2. 전설 (0.090%)
      currentThreshold += TIERS.LEGENDARY.rate;
      if (rand < currentThreshold) {
        const list = ITEMS.filter(i => i.tier.key === TIERS.LEGENDARY.key);
        return list[Math.floor(Math.random() * list.length)];
      }

      // 3. 에픽 (0.900%)
      currentThreshold += TIERS.EPIC.rate;
      if (rand < currentThreshold) {
        const list = ITEMS.filter(i => i.tier.key === TIERS.EPIC.key);
        return list[Math.floor(Math.random() * list.length)];
      }

      // 4. 레어 (4.000%)
      currentThreshold += TIERS.RARE.rate;
      if (rand < currentThreshold) {
        const list = ITEMS.filter(i => i.tier.key === TIERS.RARE.key);
        return list[Math.floor(Math.random() * list.length)];
      }

      // 5. 노말 (10.000%)
      currentThreshold += TIERS.NORM.rate;
      if (rand < currentThreshold) {
        const list = ITEMS.filter(i => i.tier.key === TIERS.NORM.key);
        return list[Math.floor(Math.random() * list.length)];
      }

      // 6. 꽝/폐기물 (85.000%)
      const trashList = ITEMS.filter(i => i.tier.key === TIERS.TRASH.key);
      return trashList[Math.floor(Math.random() * trashList.length)];
    },

    pull(costType, count) {
      // 재화를 검증하고 캡슐 머신 애니메이션 후 가챠를 실행합니다.
      if (this.isBusy) return;

      const garnets = Wallet.getGarnets();
      const teeth = Wallet.getTeeth();

      let reqGarnets = 0;
      let reqTeeth = 0;

      if (costType === 'free') {
        if (!Compendium.canClaimDailyFree()) {
          alert('오늘은 이미 무료 뽑기를 사용했습니다!');
          return;
        }
      } else if (costType === 'garnet') {
        reqGarnets = count === 1 ? 10 : 95;
        if (garnets < reqGarnets) {
          alert(`🔴 가넷이 부족합니다! (필요: ${reqGarnets}개 / 보유: ${garnets}개)\n호야추나 악어 룰렛에서 가넷을 획득하거나 무료 충전 버튼을 이용하세요.`);
          return;
        }
      } else if (costType === 'teeth') {
        reqTeeth = count === 1 ? 2 : 18;
        if (teeth < reqTeeth) {
          alert(`🦷 악어이빨이 부족합니다! (필요: ${reqTeeth}개 / 보유: ${teeth}개)\n호코다일 20-웨이브 서바이벌을 완주하여 악어이빨을 모아오세요!`);
          return;
        }
      }

      // 재화 차감
      if (costType === 'free') {
        Compendium.claimDailyFree();
      } else {
        if (reqGarnets > 0) Wallet.setGarnets(garnets - reqGarnets);
        if (reqTeeth > 0) Wallet.setTeeth(teeth - reqTeeth);
      }

      this.isBusy = true;
      GachaSound.playCoin();
      setTimeout(() => GachaSound.playLever(), 250);

      // 머신 흔들기 연출
      DomeAnim.triggerShake(700);

      const chuteCapsule = document.getElementById('droppedCapsule');
      if (chuteCapsule) {
        setTimeout(() => {
          GachaSound.playCapsuleDrop();
          chuteCapsule.style.display = 'block';
        }, 500);
      }

      // 결과 생성
      const results = [];
      for (let i = 0; i < count; i++) {
        const item = this.rollOne();
        results.push(item);
        Compendium.addItem(item.id);
      }

      setTimeout(() => {
        if (chuteCapsule) chuteCapsule.style.display = 'none';
        this.isBusy = false;
        this.showResultModal(results);
      }, 950);
    },

    showResultModal(items) {
      // 뽑기 결과를 모달 팝업으로 오픈하고 최고 등급에 따른 사운드를 출력합니다.
      const overlay = document.getElementById('gachaResultOverlay');
      const grid = document.getElementById('resultItemsGrid');
      const headline = document.getElementById('resultHeadline');
      const subline = document.getElementById('resultSubline');
      if (!overlay || !grid) return;

      grid.innerHTML = '';
      const isSingle = items.length === 1;

      // 최고 등급 확인
      let hasMythic = false;
      let hasLegendary = false;
      let hasEpic = false;
      let hasRare = false;

      items.forEach(item => {
        if (item.tier.key === 'mythic') hasMythic = true;
        if (item.tier.key === 'legendary') hasLegendary = true;
        if (item.tier.key === 'epic') hasEpic = true;
        if (item.tier.key === 'rare') hasRare = true;
      });

      if (hasMythic) {
        GachaSound.playJackpot();
        headline.textContent = '🌌 초차원 신화(MYTHIC) 강림!! 🌌';
        headline.style.color = '#ec4899';
        subline.textContent = '경축! 0.01% 극악의 확률을 뚫고 신화 등급을 획득하셨습니다!';
        this.triggerJackpotBanner('🌌 [초극악 신화] 초차원 코스믹 악어 신 획득!!');
      } else if (hasLegendary) {
        GachaSound.playJackpot();
        headline.textContent = '👑 전설(LEGENDARY) 대박 당첨!! 👑';
        headline.style.color = '#f59e0b';
        subline.textContent = '축하합니다! 0.09% 극악의 확률을 뚫고 전설 아이템 획득!';
        this.triggerJackpotBanner('👑 [전설 대박] 전설 등급 도트 아이템 획득!!');
      } else if (hasEpic) {
        GachaSound.playRare();
        headline.textContent = '🥇 에픽(EPIC) 아이템 획득!';
        headline.style.color = '#a855f7';
        subline.textContent = '상위 1% 미만! 희귀한 에픽 도트 장비를 획득했습니다.';
      } else if (hasRare) {
        GachaSound.playRare();
        headline.textContent = '🥈 레어(RARE) 아이템 획득!';
        headline.style.color = '#38bdf8';
        subline.textContent = '반짝이는 레어 도트 아이템을 건졌습니다.';
      } else {
        GachaSound.playTrash();
        headline.textContent = '🪨 꽝 / 폐기물 획득...';
        headline.style.color = '#94a3b8';
        subline.textContent = '극악의 85% 확률 늪에 빠졌습니다. (도감에서 가넷으로 분해 가능)';
      }

      grid.innerHTML = items.map(item => {
        const iconHtml = item.image
          ? `<img src="${item.image}" alt="${item.name}">`
          : `<span>${item.icon}</span>`;

        return `
          <div class="result-single-item ${isSingle ? 'single-view' : ''} tier-${item.tier.key}">
            <div class="result-icon">${iconHtml}</div>
            <div class="result-name">${item.name}</div>
            <span class="result-tier" style="background:${item.tier.color}22; color:${item.tier.color}; border:1px solid ${item.tier.color}66;">
              ${item.tier.name}
            </span>
            ${isSingle ? `<div class="result-desc">${item.desc}</div>` : ''}
          </div>
        `;
      }).join('');

      overlay.classList.add('active');
    },

    closeResultModal() {
      // 뽑기 결과 창을 닫고 도감과 지갑을 갱신합니다.
      const overlay = document.getElementById('gachaResultOverlay');
      if (overlay) overlay.classList.remove('active');
      Compendium.render();
    },

    triggerJackpotBanner(msg) {
      // 전설/신화 당첨 시 상단에 화려한 축하 전광판 배너를 일시적으로 띄웁니다.
      const banner = document.getElementById('jackpotBanner');
      if (!banner) return;
      banner.textContent = msg;
      banner.classList.add('show');
      setTimeout(() => {
        banner.classList.remove('show');
      }, 4500);
    }
  };

  // -------------------------------------------------------------
  // 7. 확률표 모달 컨트롤러
  // -------------------------------------------------------------
  const RatesModal = {
    open() {
      // 실시간 극악 확률 공개 모달을 엽니다.
      const overlay = document.getElementById('ratesModalOverlay');
      if (overlay) overlay.classList.add('active');
    },

    close() {
      // 실시간 극악 확률 공개 모달을 닫습니다.
      const overlay = document.getElementById('ratesModalOverlay');
      if (overlay) overlay.classList.remove('active');
    }
  };

  // -------------------------------------------------------------
  // 8. 초기 바인딩 및 부팅
  // -------------------------------------------------------------
  function initGachaApp() {
    // 가챠 화면의 모든 버튼, 지갑, 캔버스 및 단축키를 초기화합니다.
    Wallet.setGarnets(Wallet.getGarnets());
    Wallet.setTeeth(Wallet.getTeeth());

    DomeAnim.init();
    Compendium.render();
    Compendium.updateFreeButton();

    // 1회 뽑기 / 10회 뽑기 버튼 이벤트
    document.getElementById('btnPullGarnet1')?.addEventListener('click', () => GachaCore.pull('garnet', 1));
    document.getElementById('btnPullGarnet10')?.addEventListener('click', () => GachaCore.pull('garnet', 10));
    document.getElementById('btnPullTeeth1')?.addEventListener('click', () => GachaCore.pull('teeth', 1));
    document.getElementById('btnPullTeeth10')?.addEventListener('click', () => GachaCore.pull('teeth', 10));
    document.getElementById('btnDailyFree')?.addEventListener('click', () => GachaCore.pull('free', 1));

    // 무료 가넷 충전 지원금
    document.getElementById('btnRefillGarnets')?.addEventListener('click', () => {
      Wallet.setGarnets(Wallet.getGarnets() + 50);
      GachaSound.playCoin();
      alert('🎁 가챠 지원금 🔴 가넷 +50개가 지급되었습니다!');
    });

    // 꽝 일괄 분해
    document.getElementById('btnScrapTrash')?.addEventListener('click', () => Compendium.scrapAllTrash());

    // 확률표 모달
    document.getElementById('btnViewRates')?.addEventListener('click', () => RatesModal.open());
    document.getElementById('btnCloseRates')?.addEventListener('click', () => RatesModal.close());

    // 결과 모달 닫기
    document.getElementById('btnResultClose')?.addEventListener('click', () => GachaCore.closeResultModal());

    // 스페이스바로 뽑기 단축키
    window.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        const overlay = document.getElementById('gachaResultOverlay');
        if (overlay && overlay.classList.contains('active')) {
          e.preventDefault();
          GachaCore.closeResultModal();
        }
      }
    });
  }

  // DOMContentLoaded 시 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGachaApp);
  } else {
    initGachaApp();
  }

  // 전역 노출
  window.GachaCore = GachaCore;
  window.Compendium = Compendium;
  window.RatesModal = RatesModal;
  window.Wallet = Wallet;
})();

