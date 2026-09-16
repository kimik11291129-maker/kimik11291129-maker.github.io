/**
 * HoYatch (호야추 다이스)
 * - 11개 주사위 풀 (빨강, 검정, 특수 와일드)
 * - 17대 족보 (원페어, 투페어, 트리플(+10), 포카드(+20), 풀하우스(+15), 플러시 70점, 요트, 스티플 100점, 파이브카드 플러시 200점)
 * - 가넷 덱빌딩 HoYatch 상점 (와일드 추가, 리롤 증가, 색상 염색, 점수 연구)
 * - 초보자 친화적 AI 추천 뱃지, 업적 챌린지 및 스텝 가이드 시스템
 */

// -------------------------------------------------------------
// 1. Web Audio API 신디사이저 (손맛 사운드)
// -------------------------------------------------------------
const SoundFX = {
  ctx: null,
  init() {
    if (!this.ctx) {
      const AudioContext = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext));
      if (AudioContext) {
        try {
          this.ctx = new AudioContext();
        } catch (e) {}
      }
    }
  },
  playClick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  },
  playRoll() {
    this.init();
    if (!this.ctx) return;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220 + Math.random() * 400, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      }, i * 60);
    }
  },
  playScore() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.2);
    });
  },
  playBuy() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.25, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.07 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.15);
    });
  },
  playJackpot() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.50];
    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);
      gain.gain.setValueAtTime(0.15, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.09 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.35);
    });
  },
  playAchievement() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6 팡파레
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.22, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.35);
    });
  }
};

// -------------------------------------------------------------
// 2. 17대 족보 메타데이터 정의 (HoYatch 세분화)
// -------------------------------------------------------------
const CATEGORIES = [
  // 상단 6종
  { id: 'ones', name: 'Aces (1s)', section: 'upper', desc: '1 눈금들의 합산' },
  { id: 'twos', name: 'Deuces (2s)', section: 'upper', desc: '2 눈금들의 합산' },
  { id: 'threes', name: 'Threes (3s)', section: 'upper', desc: '3 눈금들의 합산' },
  { id: 'fours', name: 'Fours (4s)', section: 'upper', desc: '4 눈금들의 합산' },
  { id: 'fives', name: 'Fives (5s)', section: 'upper', desc: '5 눈금들의 합산' },
  { id: 'sixes', name: 'Sixes (6s)', section: 'upper', desc: '6 눈금들의 합산' },
  // 하단 11종
  { id: 'one_pair', name: 'One Pair (원페어)', section: 'lower', desc: '같은 숫자 2개 (해당 숫자×2)' },
  { id: 'two_pair', name: 'Two Pair (투페어)', section: 'lower', desc: '같은 숫자 2개 + 2개 (네 숫자 합산)' },
  { id: 'three_kind', name: '3 of a Kind (트리플)', section: 'lower', desc: '같은 숫자 3개 이상 (5개 총합 + 10점)' },
  { id: 'four_kind', name: '4 of a Kind (포커)', section: 'lower', desc: '같은 숫자 4개 이상 (5개 총합 + 20점)' },
  { id: 'full_house', name: 'Full House (풀하우스)', section: 'lower', desc: '3개 세트 + 2개 세트 (5개 총합 + 15점)' },
  { id: 'choice', name: 'Choice (초이스)', section: 'lower', desc: '조건 없이 주사위 5개 총합' },
  { id: 's_straight', name: 'Small Straight (스몰)', section: 'lower', desc: '1-2-3-4-5 연속 완성 (30점)' },
  { id: 'l_straight', name: 'Large Straight (라지)', section: 'lower', desc: '2-3-4-5-6 연속 완성 (40점)' },
  { id: 'flush', name: 'Flush (플러시) 🌈', section: 'lower', desc: '5개 모두 같은 색! (70점)' },
  { id: 'yacht', name: 'Yacht (요트) 🎲', section: 'lower', desc: '5개 숫자 모두 일치! (50점)' },
  { id: 'str_flush', name: 'Straight Flush ⚡', section: 'lower', desc: '연속 숫자 + 색깔 통일! (100점)' },
  { id: 'five_plus', name: 'Five Card Flush 👑', section: 'lower', desc: '숫자 5개 일치 + 색깔 통일! (200점)' }
];

// -------------------------------------------------------------
// 3. 로컬 스토리지 영구 보관 매니저 (가넷 및 업적 영구 저장)
// -------------------------------------------------------------
const STORAGE = {
  GARNETS_KEY: 'hell_poker_yacht_garnets',
  ACHIEVEMENTS_KEY: 'hell_poker_yacht_achievements',

  getGarnets() {
    // 저장된 가넷 보유량을 불러오거나 초기 기본값 20개를 반환합니다.
    try {
      const saved = localStorage.getItem(this.GARNETS_KEY);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage access failed:', e);
    }
    return 20; // 초기 기본 지급 20 가넷
  },

  setGarnets(val) {
    // 플레이어의 현재 가넷 수량을 브라우저에 안전하게 저장합니다.
    try {
      localStorage.setItem(this.GARNETS_KEY, val);
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  getAchievements() {
    // 달성 완료된 업적 ID 목록 배열을 로컬스토리지에서 가져옵니다.
    try {
      const saved = localStorage.getItem(this.ACHIEVEMENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage access failed:', e);
    }
    return [];
  },

  saveAchievements(list) {
    // 달성한 업적 ID 목록을 JSON 문자열 형태로 로컬스토리지에 저장합니다.
    try {
      localStorage.setItem(this.ACHIEVEMENTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  LEADERBOARD_KEY: 'hell_poker_yacht_leaderboard',

  getLeaderboard() {
    // 저장된 명예의 전당 랭킹 목록을 불러오거나 초기 디폴트 챔피언 3인을 반환합니다.
    try {
      const saved = localStorage.getItem(this.LEADERBOARD_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage leaderboard access failed:', e);
    }
    return [
      { name: '카지노 킹', score: 320, combos: '👑 파이브카드+, ⚡ 스티플', garnets: 150, date: '2026.09.15' },
      { name: '빨간 주사위', score: 285, combos: '⚡ 스티플, 🎯 상단보너스', garnets: 85, date: '2026.09.15' },
      { name: '야추 마스터', score: 255, combos: '🎲 요트, 🌈 플러시', garnets: 60, date: '2026.09.16' }
    ];
  },

  saveLeaderboard(list) {
    // 명예의 전당 랭킹 목록을 로컬스토리지에 저장합니다.
    try {
      localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage leaderboard save failed:', e);
    }
  },

  clearLeaderboard() {
    // 명예의 전당 랭킹 기록을 완전히 초기화합니다.
    try {
      localStorage.removeItem(this.LEADERBOARD_KEY);
    } catch (e) {
      console.warn('LocalStorage leaderboard clear failed:', e);
    }
  },

  CHEF_PERKS_KEY: 'hoyatch_chef_perks',

  getChefPerks() {
    // 셰프 연구소 영구 특성 해금 데이터를 로컬스토리지에서 가져옵니다.
    try {
      const saved = localStorage.getItem(this.CHEF_PERKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage chef perks access failed:', e);
    }
    return {
      wild_starter: 0,
      relic_reroll: 0,
      start_stash: 0,
      spicy_sauce: 0,
      extra_bun: 0
    };
  },

  saveChefPerks(data) {
    // 셰프 연구소 영구 특성 해금 데이터를 로컬스토리지에 저장합니다.
    try {
      localStorage.setItem(this.CHEF_PERKS_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage chef perks save failed:', e);
    }
  }
};

// -------------------------------------------------------------
// 3-1. 셰프 연구소 모험 영구 특성 데이터 및 관리자 (ChefLabManager)
// -------------------------------------------------------------
const CHEF_PERKS_DATA = [
  {
    id: 'wild_starter',
    name: '🥒 황금 피클 스타터',
    desc: '모험 모드 시작 시 덱에 황금 피클 와일드 주사위 1개 영구 추가 (초기 와일드 2개로 시작)',
    cost: 50,
    maxLevel: 1,
    icon: '🥒'
  },
  {
    id: 'relic_reroll',
    name: '🔄 셰프의 감각 (유물 리롤)',
    desc: '보스 처치 후 버거 유물 선택지를 1회 다시 뽑을 수 있는 무료 리롤 기회 부여',
    cost: 40,
    maxLevel: 1,
    icon: '🔄'
  },
  {
    id: 'start_stash',
    name: '💰 늪지대 시작 지원금',
    desc: '모험 모드를 시작할 때마다 버거 가넷 +30개를 즉시 지급받습니다.',
    cost: 35,
    maxLevel: 1,
    icon: '💰'
  },
  {
    id: 'spicy_sauce',
    name: '🔥 특제 핫소스 연구',
    desc: '모험 모드에서 가하는 모든 족보 타격 공격력이 영구히 +15% 증폭됩니다.',
    cost: 60,
    maxLevel: 1,
    icon: '🔥'
  },
  {
    id: 'extra_bun',
    name: '🍔 더블 번 리롤러',
    desc: '모험 모드 기본 주사위 굴리기 기회가 영구히 +1회 추가됩니다. (기본 3회 ➔ 4회)',
    cost: 70,
    maxLevel: 1,
    icon: '🍔'
  }
];

const ChefLabManager = {
  getPerks() {
    return STORAGE.getChefPerks();
  },

  hasPerk(id) {
    const perks = this.getPerks();
    return Boolean(perks[id] && perks[id] > 0);
  },

  buyPerk(id) {
    const perk = CHEF_PERKS_DATA.find(p => p.id === id);
    if (!perk) return false;
    const currentGarnets = STORAGE.getGarnets();
    const perks = this.getPerks();
    const currentLvl = perks[id] || 0;

    if (currentLvl >= perk.maxLevel) {
      alert('이미 최고 레벨까지 연구 완료된 특성입니다!');
      return false;
    }
    if (currentGarnets < perk.cost) {
      alert(`가넷이 부족합니다! (필요: 🔴 ${perk.cost} / 보유: 🔴 ${currentGarnets})`);
      return false;
    }

    STORAGE.setGarnets(currentGarnets - perk.cost);
    perks[id] = currentLvl + 1;
    STORAGE.saveChefPerks(perks);

    SoundFX.playJackpot();
    UI.showToast({
      title: '🧪 특성 연구 완료!',
      desc: `[${perk.name}] 연구 완료! 모험 모드에 영구 적용됩니다.`,
      icon: perk.icon
    });

    UI.updateGarnetDisplay();
    UI.renderChefLab();
    return true;
  }
};

// -------------------------------------------------------------
// 3-2. 명예의 전당 랭킹 데이터 관리자 (LeaderboardManager)
// -------------------------------------------------------------
const LeaderboardManager = {
  cache: null,

  async fetchFromDB() {
    // 서버 SQLite DB에서 최신 명예의 전당 랭킹 목록을 조회합니다.
    const res = await fetch('/api/hoyatch/leaderboard');
    if (res.ok) {
      this.cache = await res.json();
      return this.cache;
    }
    return STORAGE.getLeaderboard();
  },

  getTopList() {
    // 캐시된 랭킹 목록 또는 기본 랭킹을 반환합니다.
    if (this.cache && this.cache.length > 0) {
      return this.cache;
    }
    return STORAGE.getLeaderboard();
  },

  async addEntry(playerName, score, combos, garnets) {
    // 새로운 랭킹 기록을 서버 SQLite DB에 영구 저장합니다.
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    
    const newRecord = {
      name: (playerName || '도전자').trim().slice(0, 8),
      score: score,
      combos: combos || '완주 달성',
      garnets: garnets || 0,
      date: dateStr
    };

    await fetch('/api/hoyatch/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    });

    return await this.fetchFromDB();
  },

  async clear() {
    // 랭킹 데이터를 서버 SQLite DB에서 초기화합니다.
    await fetch('/api/hoyatch/leaderboard', { method: 'DELETE' });
    return await this.fetchFromDB();
  }
};

// -------------------------------------------------------------
// 4. 업적 챌린지 13종 메타데이터 정의
// -------------------------------------------------------------
const ACHIEVEMENTS_DATA = [
  {
    id: 'first_roll',
    title: '첫 투구',
    desc: '주사위를 처음으로 굴려 게임을 시작하세요.',
    reward: 10,
    icon: '🎲'
  },
  {
    id: 'first_pair',
    title: '페어의 시작',
    desc: '원페어 또는 투페어 족보에 점수를 기록하세요.',
    reward: 10,
    icon: '✌️'
  },
  {
    id: 'first_flush',
    title: '붉거나 검거나',
    desc: '5개 주사위 색깔이 모두 같은 플러시(Flush)를 달성하세요!',
    reward: 25,
    icon: '🌈'
  },
  {
    id: 'first_straight',
    title: '스트레이트 행진',
    desc: '스몰 또는 라지 스트레이트를 성공시켜 점수를 기록하세요.',
    reward: 30,
    icon: '📏'
  },
  {
    id: 'wild_chosen',
    title: '요술 주사위',
    desc: '특수 와일드[★] 주사위의 눈금을 직접 지정하여 발동하세요.',
    reward: 20,
    icon: '🌟'
  },
  {
    id: 'first_yacht',
    title: '신의 주사위 (Yacht)',
    desc: '5개 숫자가 모두 같은 50점 요트(Yacht)를 달성하세요!',
    reward: 50,
    icon: '👑'
  },
  {
    id: 'str_flush_god',
    title: '기적의 섬광',
    desc: '연속 숫자와 색깔 통일을 동시에 맞추는 스트레이트 플러시(100점) 달성!',
    reward: 100,
    icon: '⚡'
  },
  {
    id: 'five_plus_jackpot',
    title: '전설의 파이브카드 플러시',
    desc: '같은 숫자 5개 + 색상 통일! 200점 대박 잭팟 파이브카드 플러시를 달성하세요!',
    reward: 150,
    icon: '💎'
  },
  {
    id: 'upper_bonus_champ',
    title: '상단 싹쓸이 (+35점)',
    desc: '상단 족보 합산 63점을 돌파하여 +35점 보너스를 쟁취하세요!',
    reward: 40,
    icon: '🎯'
  },
  {
    id: 'shop_patron',
    title: 'HoYatch 단골손님',
    desc: 'HoYatch 상점에서 아이템 또는 강화를 1회 이상 구매하세요.',
    reward: 25,
    icon: '🛒'
  },
  {
    id: 'max_roller',
    title: '무한 리롤러',
    desc: '리롤 횟수 업그레이드를 구매하여 굴리기 기회를 4회 이상으로 늘리세요.',
    reward: 30,
    icon: '🔄'
  },
  {
    id: 'garnet_rich',
    title: '가넷 대부호',
    desc: '보유 가넷 100개 이상을 달성하세요!',
    reward: 35,
    icon: '💰'
  },
  {
    id: 'grand_finisher',
    title: '명예의 완주자',
    desc: '17라운드를 완주하고 최종 점수 250점 이상을 달성하세요!',
    reward: 50,
    icon: '🏆'
  }
];

// -------------------------------------------------------------
// 5. 업적 판정 및 보상 지급 관리자 (AchievementManager)
// -------------------------------------------------------------
const AchievementManager = {
  unlockedIds: new Set(),

  init() {
    // 저장된 달성 업적 목록을 불러와 Set에 동기화합니다.
    const saved = STORAGE.getAchievements();
    this.unlockedIds = new Set(saved);
  },

  isUnlocked(id) {
    // 특정 업적이 이미 클리어되었는지 확인합니다.
    return this.unlockedIds.has(id);
  },

  unlock(id) {
    // 업적을 클리어 처리하고 가넷 보상 지급, 효과음, 토스트 알림을 실행합니다.
    if (this.unlockedIds.has(id)) return;
    const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
    if (!ach) return;

    this.unlockedIds.add(id);
    STORAGE.saveAchievements([...this.unlockedIds]);

    // 보상 가넷 지급
    if (Game.addGarnets) {
      Game.addGarnets(ach.reward);
    }

    // 팡파레 효과음 재생
    SoundFX.playAchievement();

    // 화면 우상단 플로팅 토스트 팝업
    UI.showToast(ach);

    // 업적 모달이 열려있거나 열릴 때를 위해 재렌더링
    UI.renderAchievements();
  },

  check(triggerType, data = {}) {
    // 인게임 각종 상황(굴리기, 선택, 구매, 종료)에서 달성 가능한 업적을 즉각 검사합니다.
    if (triggerType === 'roll') {
      this.unlock('first_roll');
    } else if (triggerType === 'wild') {
      this.unlock('wild_chosen');
    } else if (triggerType === 'score') {
      const { catId, score, upperBonusReached } = data;
      if (['one_pair', 'two_pair'].includes(catId) && score > 0) {
        this.unlock('first_pair');
      }
      if (catId === 'flush' && score > 0) {
        this.unlock('first_flush');
      }
      if (['s_straight', 'l_straight'].includes(catId) && score > 0) {
        this.unlock('first_straight');
      }
      if (catId === 'yacht' && score > 0) {
        this.unlock('first_yacht');
      }
      if (catId === 'str_flush' && score > 0) {
        this.unlock('str_flush_god');
      }
      if (catId === 'five_plus' && score > 0) {
        this.unlock('five_plus_jackpot');
      }
      if (upperBonusReached) {
        this.unlock('upper_bonus_champ');
      }
    } else if (triggerType === 'shop') {
      this.unlock('shop_patron');
      if (data.maxRolls && data.maxRolls >= 4) {
        this.unlock('max_roller');
      }
    } else if (triggerType === 'finish') {
      if (data.finalTotal && data.finalTotal >= 250) {
        this.unlock('grand_finisher');
      }
    }

    // 보유 가넷 100개 돌파 상시 검사
    if (Game.garnets && Game.garnets >= 100) {
      this.unlock('garnet_rich');
    }
  }
};

// -------------------------------------------------------------
// 6. 게임 상태 및 HoYatch 관리 객체 (Game State)
// -------------------------------------------------------------
const Game = {
  round: 1,
  totalRounds: 17,
  rollsLeft: 3,
  maxRolls: 3,        // 상점 업그레이드 가능 (최대 5회)
  garnets: 20,        // 보유 가넷 (업적 및 점수로 획득, 영구 보존)
  scores: {},
  currentDice: [],
  isRolling: false,
  activeWildIndex: 0,

  // 덱빌딩 파라미터 (상점 업그레이드)
  deck: {
    redCount: 5,
    blackCount: 5,
    wildCount: 1,
    powerupLevel: 0   // 플러시/스트레이트/요트 보너스 (+10점 단위)
  },

  addGarnets(amount) {
    // 가넷을 획득하고 로컬스토리지에 저장하며 UI를 갱신합니다.
    this.garnets += amount;
    STORAGE.setGarnets(this.garnets);
    UI.updateHeader();
    AchievementManager.check('garnet');
  },

  spendGarnets(amount) {
    // 상점 등에서 가넷을 소모하고 성공 여부를 반환합니다.
    if (this.garnets < amount) return false;
    this.garnets -= amount;
    STORAGE.setGarnets(this.garnets);
    UI.updateHeader();
    return true;
  },

  createMasterPool() {
    // 덱 구성에 따라 11개(또는 업그레이드된 수량)의 마스터 주사위 풀을 생성합니다.
    const pool = [];
    for (let i = 1; i <= this.deck.redCount; i++) {
      pool.push({ id: `red_${i}`, color: 'red', isSpecial: false, faces: [1, 2, 3, 4, 5, 6] });
    }
    for (let i = 1; i <= this.deck.blackCount; i++) {
      pool.push({ id: `black_${i}`, color: 'black', isSpecial: false, faces: [1, 2, 3, 4, 5, 6] });
    }
    for (let i = 1; i <= this.deck.wildCount; i++) {
      pool.push({ id: `special_${i}`, color: 'wild', isSpecial: true, faces: ['★', 2, 3, 4, 5, 6] });
    }
    return pool;
  },

  drawFiveDice() {
    // 마스터 주사위 풀을 무작위 셔플한 뒤 이번 턴에 사용할 5개를 추첨합니다.
    const masterPool = this.createMasterPool();
    for (let i = masterPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [masterPool[i], masterPool[j]] = [masterPool[j], masterPool[i]];
    }
    return masterPool.slice(0, 5).map(die => ({
      ...die,
      value: 1,
      wildChosen: 6,
      isKept: false
    }));
  },

  init() {
    // 게임 라운드와 주사위 풀을 초기화하고 저장된 가넷과 업적을 동기화합니다.
    this.round = 1;
    this.maxRolls = 3;
    this.rollsLeft = this.maxRolls;
    this.garnets = STORAGE.getGarnets();
    this.scores = {};
    this.isRolling = false;
    this.currentDice = [];
    this.deck = { redCount: 5, blackCount: 5, wildCount: 1, powerupLevel: 0 };

    AchievementManager.init();
    UI.initScoreSheet();
    UI.updateHeader();
    UI.updateRollControls();
    UI.renderDice();
    UI.updatePoolText();
    UI.updateStepGuide(1);
    UI.setNotice('🎲 [주사위 굴리기] 버튼을 눌러 라운드 1을 시작하세요! (HoYatch 상점에서 주사위 덱을 강화할 수 있습니다)');
  },

  openWildChoiceModal(diceIndex) {
    // 플레이어가 언제든 원하는 와일드 주사위의 눈금을 실시간 변경하도록 모달을 엽니다.
    if (this.rollsLeft === this.maxRolls || this.currentDice.length === 0) return;
    if (diceIndex !== undefined && diceIndex >= 0 && diceIndex < this.currentDice.length) {
      this.activeWildIndex = diceIndex;
    } else {
      const idx = this.currentDice.findIndex(d => d.isSpecial && d.value === '★');
      this.activeWildIndex = (idx !== -1) ? idx : 0;
    }
    const targetDie = this.currentDice[this.activeWildIndex];
    const currentVal = (targetDie && targetDie.wildChosen) ? targetDie.wildChosen : 6;
    UI.openWildModal(currentVal, this.activeWildIndex);
  },

  roll() {
    // 고정(Keep)되지 않은 활성 주사위들을 무작위 굴립니다.
    if (this.rollsLeft <= 0 || this.isRolling) return;
    this.isRolling = true;
    SoundFX.playRoll();

    if (this.rollsLeft === this.maxRolls) {
      this.currentDice = this.drawFiveDice();
    }

    UI.setRollingAnimation(true);
    UI.setNotice('주사위가 구르는 중...');

    setTimeout(() => {
      this.currentDice.forEach((die, idx) => {
        if (!die.isKept) {
          const randFace = die.faces[Math.floor(Math.random() * die.faces.length)];
          die.value = randFace;
          if (die.isSpecial && randFace === '★') {
            if (!die.wildChosen) die.wildChosen = 6;
          }
        }
      });

      this.rollsLeft--;
      this.isRolling = false;
      UI.setRollingAnimation(false);
      UI.renderDice();
      UI.updateRollControls();

      // 첫 굴리기 업적 검사
      AchievementManager.check('roll');

      UI.updateScorePreviews();
      this.updateNoticeAfterRoll();
    }, 550);
  },

  updateNoticeAfterRoll() {
    // 주사위를 굴린 직후 플레이어가 해야 할 행동을 가이드 바와 알림 텍스트로 안내합니다.
    const hasWild = this.currentDice.some(d => d.isSpecial && d.value === '★');
    const wildHint = hasWild ? ' (🌟 와일드 주사위의 [1~6] 미니 칩을 눌러 원하는 숫자로 언제든 바꿀 수 있습니다!)' : '';

    if (this.rollsLeft > 0) {
      UI.updateStepGuide(2);
      UI.setNotice(`굴리기 완료! 주사위를 클릭해 고정(KEEP)하거나, 오른쪽 스코어보드에서 [⭐ 추천!] 칸을 눌러 점수를 기록하세요.${wildHint}`);
    } else {
      UI.updateStepGuide(3);
      UI.setNotice(`남은 굴리기가 끝났습니다! 오른쪽 스코어보드에서 점수를 기록할 족보를 선택하세요.${wildHint}`);
    }
  },

  toggleKeep(diceIndex) {
    // 주사위의 고정(KEEP) 상태를 반전시킵니다.
    if (this.rollsLeft === this.maxRolls || this.isRolling) return;
    const die = this.currentDice[diceIndex];
    die.isKept = !die.isKept;
    SoundFX.playClick();
    UI.renderDice();
  },

  setWildValue(chosenNum, diceIndex) {
    // 특수 와일드[★] 주사위에 플레이어가 원하는 숫자를 실시간으로 적용합니다.
    let targetDie = null;
    if (diceIndex !== undefined && this.currentDice[diceIndex]?.isSpecial && this.currentDice[diceIndex]?.value === '★') {
      targetDie = this.currentDice[diceIndex];
    } else {
      targetDie = this.currentDice.find(d => d.isSpecial && d.value === '★');
    }

    if (targetDie) {
      targetDie.wildChosen = chosenNum;
    }
    SoundFX.playClick();
    UI.closeWildModal();
    UI.renderDice();
    UI.updateScorePreviews();
    this.updateNoticeAfterRoll();

    // 와일드 주사위 발동 업적 검사
    AchievementManager.check('wild');
  },

  selectCategory(catId) {
    // 선택한 족보 칸에 점수를 확정 기록하고 가넷 보상 및 라운드를 진행합니다.
    if (this.rollsLeft === this.maxRolls) {
      alert('주사위를 최소 한 번 이상 굴린 후 점수를 기록할 수 있습니다!');
      return;
    }
    if (this.scores[catId] !== undefined) return;

    const calculatedScores = Evaluator.calculateAll(this.currentDice, this.deck.powerupLevel);
    const score = calculatedScores[catId] || 0;
    this.scores[catId] = score;

    // 가넷 보상 지급 (점수에 비례 + 특수 족보 달성 보너스)
    let earnedGarnets = Math.floor(score / 2);
    if (score > 0) {
      if (catId === 'flush') earnedGarnets += 10;
      if (catId === 'yacht') earnedGarnets += 20;
      if (catId === 'str_flush') earnedGarnets += 30;
      if (catId === 'five_plus') earnedGarnets += 50;
    }
    earnedGarnets = Math.max(5, earnedGarnets);
    this.addGarnets(earnedGarnets);

    // 상단 보너스 달성 여부 검사
    let upperSum = 0;
    CATEGORIES.filter(c => c.section === 'upper').forEach(c => {
      if (this.scores[c.id] !== undefined) upperSum += this.scores[c.id];
    });
    const upperBonusReached = (upperSum >= 63);

    // 업적 검사
    AchievementManager.check('score', { catId, score, upperBonusReached });

    // 사운드 분기
    if (['flush', 'yacht', 'str_flush', 'five_plus'].includes(catId) && score > 0) {
      SoundFX.playJackpot();
    } else {
      SoundFX.playScore();
    }

    this.round++;
    if (this.round > this.totalRounds) {
      this.finishGame();
    } else {
      this.rollsLeft = this.maxRolls;
      this.currentDice = [];
      UI.renderDice();
      UI.updateRollControls();
      UI.updateHeader();
      UI.renderLockedScores();
      UI.clearScorePreviews();
      UI.updateStepGuide(1);
      UI.setNotice(`라운드 ${this.round} 시작! [주사위 굴리기]를 눌러주세요. (가넷 +${earnedGarnets}🔴 획득!)`);
    }
  },

  // ---------------- HoYatch 상점 구매 로직 ----------------
  buyWild() {
    // 가넷을 소모하여 와일드 주사위를 추가합니다 (최대 3개).
    const cost = 40;
    if (this.garnets < cost) return alert('가넷이 부족합니다!');
    if (this.deck.wildCount >= 3) return alert('와일드 주사위는 최대 3개까지 보유할 수 있습니다!');
    this.spendGarnets(cost);
    this.deck.wildCount++;
    SoundFX.playBuy();
    UI.updateHeader();
    UI.updatePoolText();
    UI.updateShopModal();
    AchievementManager.check('shop', { type: 'wild' });
  },

  buyReroll() {
    // 가넷을 소모하여 한 턴당 주사위 리롤 횟수를 1회 증가시킵니다 (최대 5회).
    const cost = 50;
    if (this.garnets < cost) return alert('가넷이 부족합니다!');
    if (this.maxRolls >= 5) return alert('굴리기 횟수는 최대 5회까지 업그레이드 가능합니다!');
    this.spendGarnets(cost);
    this.maxRolls++;
    if (this.rollsLeft < this.maxRolls) this.rollsLeft++;
    SoundFX.playBuy();
    UI.updateHeader();
    UI.updateRollControls();
    UI.updateShopModal();
    AchievementManager.check('shop', { type: 'reroll', maxRolls: this.maxRolls });
  },

  buyDye() {
    // 가넷을 소모하여 검은 주사위를 빨간 주사위로 영구 염색합니다.
    const cost = 30;
    if (this.garnets < cost) return alert('가넷이 부족합니다!');
    if (this.deck.blackCount <= 0) return alert('이미 모든 주사위가 빨간색으로 염색되었습니다!');
    this.spendGarnets(cost);
    this.deck.blackCount--;
    this.deck.redCount++;
    SoundFX.playBuy();
    UI.updateHeader();
    UI.updatePoolText();
    UI.updateShopModal();
    AchievementManager.check('shop', { type: 'dye' });
  },

  buyPowerup() {
    // 가넷을 소모하여 플러시, 스트레이트, 요트 점수를 영구히 +10점 상승시킵니다.
    const cost = 35;
    if (this.garnets < cost) return alert('가넷이 부족합니다!');
    this.spendGarnets(cost);
    this.deck.powerupLevel++;
    SoundFX.playBuy();
    UI.updateHeader();
    UI.updateShopModal();
    AchievementManager.check('shop', { type: 'powerup' });
  },

  finishGame() {
    // 17라운드 종료 후 총점을 계산하고 업적 달성 검사 및 결과 모달을 엽니다.
    let upperSum = 0;
    CATEGORIES.filter(c => c.section === 'upper').forEach(c => upperSum += (this.scores[c.id] || 0));
    const bonus = upperSum >= 63 ? 35 : 0;
    let lowerSum = 0;
    CATEGORIES.filter(c => c.section === 'lower').forEach(c => lowerSum += (this.scores[c.id] || 0));
    const finalTotal = upperSum + bonus + lowerSum;

    // 핵심 달성 콤보 요약 태그
    const comboList = [];
    if (this.scores['five_plus'] > 0) comboList.push('👑 파이브카드+');
    if (this.scores['str_flush'] > 0) comboList.push('⚡ 스티플');
    if (this.scores['yacht'] > 0) comboList.push('🎲 요트');
    if (this.scores['flush'] > 0) comboList.push('🌈 플러시');
    if (bonus > 0) comboList.push('🎯 상단보너스');
    if (comboList.length === 0) comboList.push('17R 완주');

    this.lastGameSummary = {
      finalTotal,
      upperSum,
      bonus,
      lowerSum,
      combos: comboList.slice(0, 2).join(', '),
      garnets: this.garnets
    };

    AchievementManager.check('finish', { finalTotal });

    UI.renderLockedScores();
    UI.updateHeader();
    UI.showGameOverModal(this.lastGameSummary);
  },

  async saveRanking(playerName) {
    // 플레이어 닉네임과 최종 점수를 명예의 전당 랭킹 DB에 등록합니다.
    if (!this.lastGameSummary) return;
    const name = (playerName || '도전자').trim() || '도전자';
    await LeaderboardManager.addEntry(name, this.lastGameSummary.finalTotal, this.lastGameSummary.combos, this.lastGameSummary.garnets);
    SoundFX.playAchievement();
    UI.onRankingRegistered();
  }
};

// -------------------------------------------------------------
// 4. 17대 족보 판정 및 AI 최선의 수 분석 (Evaluator)
// -------------------------------------------------------------
const Evaluator = {
  getEffectiveValues(dice) {
    return dice.map(d => (d.isSpecial && d.value === '★') ? d.wildChosen : d.value);
  },

  calculateAll(dice, powerupLevel = 0) {
    if (!dice || dice.length < 5) return {};
    const vals = this.getEffectiveValues(dice);
    const sum = vals.reduce((a, b) => a + b, 0);

    const counts = {};
    for (let i = 1; i <= 6; i++) counts[i] = 0;
    vals.forEach(v => counts[v] = (counts[v] || 0) + 1);
    const countList = Object.values(counts);

    // 상점 파워업 보너스
    const bonusDmg = powerupLevel * 10;

    const scores = {
      ones: counts[1] * 1,
      twos: counts[2] * 2,
      threes: counts[3] * 3,
      fours: counts[4] * 4,
      fives: counts[5] * 5,
      sixes: counts[6] * 6,
      choice: sum
    };

    // 1. One Pair (원페어) - 가장 높은 페어 숫자 x 2
    let maxPairVal = 0;
    for (let i = 6; i >= 1; i--) {
      if (counts[i] >= 2) {
        maxPairVal = i;
        break;
      }
    }
    scores.one_pair = maxPairVal * 2;

    // 2. Two Pair (투페어)
    const pairs = [];
    for (let i = 6; i >= 1; i--) {
      if (counts[i] >= 2) pairs.push(i);
    }
    if (pairs.length >= 2 || countList.includes(4)) {
      const p1 = pairs[0];
      const p2 = pairs[1] !== undefined ? pairs[1] : pairs[0];
      scores.two_pair = (p1 * 2) + (p2 * 2);
    } else {
      scores.two_pair = 0;
    }

    // 3. 3 of a Kind (트리플: 주사위 5개 총합 + 10점)
    scores.three_kind = countList.some(c => c >= 3) ? (sum + 10) : 0;

    // 4. 4 of a Kind (포커: 주사위 5개 총합 + 20점)
    scores.four_kind = countList.some(c => c >= 4) ? (sum + 20) : 0;

    // 5. Full House (풀하우스: 주사위 5개 총합 + 15점)
    const has3 = countList.includes(3);
    const has2 = countList.includes(2);
    const has5 = countList.includes(5);
    scores.full_house = ((has3 && has2) || has5) ? (sum + 15) : 0;

    // 6. Small Straight (1-2-3-4-5: 30점)
    const hasSStr = [1, 2, 3, 4, 5].every(n => counts[n] >= 1);
    scores.s_straight = hasSStr ? (30 + bonusDmg) : 0;

    // 7. Large Straight (2-3-4-5-6: 40점)
    const hasLStr = [2, 3, 4, 5, 6].every(n => counts[n] >= 1);
    scores.l_straight = hasLStr ? (40 + bonusDmg) : 0;

    // 8. Flush (플러시: 70점) 🌈
    let redCount = 0;
    let blackCount = 0;
    let wildCount = 0;
    dice.forEach(d => {
      if (d.color === 'red') redCount++;
      else if (d.color === 'black') blackCount++;
      else if (d.color === 'wild') wildCount++;
    });
    const isFlush = (redCount + wildCount === 5) || (blackCount + wildCount === 5);
    scores.flush = isFlush ? (70 + bonusDmg) : 0;

    // 9. Yacht (요트: 50점)
    const isYacht = countList.some(c => c === 5);
    scores.yacht = isYacht ? (50 + bonusDmg) : 0;

    // 10. Straight Flush (스트레이트 플러시: 100점)
    const isStraight = hasSStr || hasLStr;
    scores.str_flush = (isStraight && isFlush) ? (100 + bonusDmg) : 0;

    // 11. Five Card Flush (파이브카드 플러시: 200점)
    scores.five_plus = (isYacht && isFlush) ? (200 + bonusDmg) : 0;

    return scores;
  },

  // 초보자를 위한 AI 최적 족보 추천 계산
  getBestCategory(dice, currentScores, powerupLevel) {
    const scores = this.calculateAll(dice, powerupLevel);
    let bestCat = null;
    let highestScore = -1;

    // 우선순위: 잭팟 족보 > 높은 점수 > 상단 족보
    const priority = ['five_plus', 'str_flush', 'flush', 'yacht', 'four_kind', 'full_house', 'three_kind', 'l_straight', 's_straight', 'two_pair', 'sixes', 'fives', 'fours', 'one_pair', 'choice', 'threes', 'twos', 'ones'];

    priority.forEach(catId => {
      if (currentScores[catId] === undefined) {
        const score = scores[catId] || 0;
        if (score > highestScore) {
          highestScore = score;
          bestCat = catId;
        }
      }
    });

    return bestCat;
  }
};

// -------------------------------------------------------------
// 5-A. 1vs1 실시간 WebSocket 매칭 매니저 (PvPOnlineManager)
// -------------------------------------------------------------
const PvPOnlineManager = {
  ws: null,
  nickname: '늪지대 악어',
  matchType: null, // 'quick' | 'custom'
  queueStartTime: null,
  queueTimer: null,

  connect(onOpen) {
    // FastAPI WebSocket 백엔드와 연결을 수립하고 메시지 이벤트를 바인딩합니다.
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      if (onOpen) onOpen();
      return;
    }
    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
      this.ws = null;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:1129';
    const url = `${protocol}//${host}/ws/hoyatch/pvp`;

    try {
      this.ws = new WebSocket(url);
    } catch (e) {
      console.error('PvP WebSocket connection error:', e);
      alert('대전 매칭 서버에 연결할 수 없습니다. (URL: ' + url + ')');
      return;
    }

    this.ws.onopen = () => {
      console.log('PvP WebSocket connected successfully:', url);
      if (onOpen) onOpen();
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (e) {
        console.error('PvP ws message parse error:', e, event.data);
      }
    };

    this.ws.onclose = () => {
      console.log('PvP WebSocket disconnected');
      this.stopQueueTimer();
    };

    this.ws.onerror = (err) => {
      console.error('PvP WebSocket error:', err);
    };
  },

  send(msg) {
    // 활성화된 웹소켓 세션으로 JSON 메시지를 전송합니다.
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  },

  startQuickMatch(nickname) {
    // 빠른 랜덤 매칭 큐에 진입하고 탐색 레이더 UI 및 타이머를 가동합니다.
    this.nickname = nickname || '늪지대 악어';
    this.matchType = 'quick';
    this.connect(() => {
      this.send({ type: 'join_queue', nickname: this.nickname });
      UI.setPvpQueueUI('searching');
      this.startQueueTimer();
    });
  },

  cancelQueue() {
    // 매칭 대기열 참가를 취소하고 레이더 UI를 초기화합니다.
    this.send({ type: 'cancel_queue' });
    this.stopQueueTimer();
    UI.setPvpQueueUI('initial');
  },

  createCustomRoom(nickname) {
    // 4자리 고유 방 코드를 생성하는 비공개 초대방 개설을 서버에 요청합니다.
    this.nickname = nickname || '늪지대 악어';
    this.matchType = 'custom';
    this.connect(() => {
      this.send({ type: 'create_custom_room', nickname: this.nickname });
    });
  },

  joinCustomRoom(code, nickname) {
    // 친구가 공유한 4자리 코드로 해당 비공개 방에 입장합니다.
    if (!code || code.trim() === '') {
      alert('입장할 4자리 방 코드를 입력해주세요!');
      return;
    }
    this.nickname = nickname || '늪지대 악어';
    this.matchType = 'custom';
    this.connect(() => {
      this.send({ type: 'join_custom_room', room_code: code.trim().toUpperCase(), nickname: this.nickname });
    });
  },

  startQueueTimer() {
    // 매칭 탐색 경과 시간을 0.5초 간격으로 UI에 실시간 갱신합니다.
    this.stopQueueTimer();
    this.queueStartTime = Date.now();
    this.queueTimer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.queueStartTime) / 1000);
      const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const secs = String(elapsed % 60).padStart(2, '0');
      if (UI.dom.pvpQueueTimeText) {
        UI.dom.pvpQueueTimeText.textContent = `⏱️ ${mins}:${secs}`;
      }
    }, 500);
  },

  stopQueueTimer() {
    // 매칭 탐색 타이머를 중단하고 00:00으로 리셋합니다.
    if (this.queueTimer) {
      clearInterval(this.queueTimer);
      this.queueTimer = null;
    }
    if (UI.dom.pvpQueueTimeText) {
      UI.dom.pvpQueueTimeText.textContent = '⏱️ 00:00';
    }
  },

  handleMessage(data) {
    // 서버로부터 수신된 웹소켓 패킷 유형에 따라 적절한 핸들러를 호출합니다.
    switch (data.type) {
      case 'queued':
      case 'queue_waiting':
        if (UI.dom.pvpQueueStatusText) {
          UI.dom.pvpQueueStatusText.textContent = data.message || '상대 플레이어를 찾는 중...';
        }
        break;

      case 'room_created':
        if (UI.dom.roomCodeDisplayBox) UI.dom.roomCodeDisplayBox.style.display = 'block';
        if (UI.dom.createdRoomCodeText) UI.dom.createdRoomCodeText.textContent = data.room_code;
        break;

      case 'room_error':
        alert(`방 입장 오류: ${data.message}`);
        break;

      case 'match_found':
      case 'match_start':
        this.stopQueueTimer();
        UI.closePvpMatchModal();
        PvPGame.startOnlineMatch({
          role: data.role,
          my_name: data.my_nickname || data.my_name,
          opponent_name: data.opponent_nickname || data.opponent_name
        });
        break;

      case 'opponent_action':
      case 'game_action':
        PvPGame.handleOpponentAction(data.action);
        break;

      case 'opponent_disconnected':
        PvPGame.handleOpponentDisconnected(data.message);
        break;
    }
  },

  disconnect() {
    // 웹소켓 연결을 안전하게 종료하고 상태를 클리어합니다.
    if (this.ws) {
      try {
        this.send({ type: 'leave' });
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    this.stopQueueTimer();
  }
};

// -------------------------------------------------------------
// 5-B. 1vs1 대전 모드 엔진 (PvPGame) - 온라인 & AI 봇 완벽 지원
// -------------------------------------------------------------
const PvPGame = {
  round: 1,
  totalRounds: 17,
  currentPlayer: 1, // 1 or 2
  maxRolls: 3,
  rollsLeft: 3,
  isRolling: false,
  currentDice: [],
  p1Scores: {},
  p2Scores: {},
  deck: { redCount: 5, blackCount: 5, wildCount: 1, powerupLevel: 0 },

  // 온라인 & AI 상태
  isOnline: false,
  isAi: false,
  myRole: 'p1', // 'p1' | 'p2'
  myNickname: 'Player 1',
  opponentNickname: 'Player 2',
  turnTimer: null,
  turnSecondsLeft: 45,

  isMyTurn() {
    // 현재 조작 권한이 내게 있는지 판별합니다 (온라인/AI/로컬 분기).
    if (this.isOnline) {
      const activeRole = this.currentPlayer === 1 ? 'p1' : 'p2';
      return this.myRole === activeRole;
    }
    if (this.isAi) {
      return this.currentPlayer === 1;
    }
    return true; // 로컬 2인용
  },

  init() {
    // 1vs1 대전 모드의 상태를 초기화하고 첫 번째 플레이어(P1)의 차례를 세팅합니다.
    this.round = 1;
    this.currentPlayer = 1;
    this.maxRolls = 3;
    this.rollsLeft = this.maxRolls;
    this.isRolling = false;
    this.currentDice = [];
    this.p1Scores = {};
    this.p2Scores = {};
    this.deck = { redCount: 5, blackCount: 5, wildCount: 1, powerupLevel: 0 };
    this.stopTurnTimer();

    UI.initScoreSheet();
    this.updatePvPStatus();
    UI.updateRollControls();
    UI.renderDice();
    UI.updatePoolText();
    this.startTurnTimer();

    if (this.isOnline) {
      if (this.myRole === 'p1') {
        UI.setNotice(`⚔️ [내 턴] 선공입니다! 주사위를 굴려 라운드 1을 시작하세요. (상대: ${this.opponentNickname})`);
      } else {
        UI.setNotice(`⏳ 상대방 (${this.opponentNickname})의 선공 턴입니다. 주사위를 굴릴 때까지 잠시 대기하세요.`);
      }
    } else if (this.isAi) {
      UI.setNotice(`⚔️ [내 턴] 악어 AI 봇과의 대결! [주사위 굴리기] 버튼을 눌러 라운드 1을 시작하세요.`);
    } else {
      UI.setNotice('⚔️ Player 1의 턴입니다! [주사위 굴리기] 버튼을 눌러 라운드 1을 시작하세요.');
    }
  },

  startOnlineMatch(matchData) {
    // 원격 온라인 상대와의 매칭이 성사되었을 때 게임을 초기화하고 화면을 세팅합니다.
    this.isOnline = true;
    this.isAi = false;
    this.myRole = matchData.role; // 'p1' or 'p2'
    this.myNickname = matchData.my_name || (this.myRole === 'p1' ? 'Player 1' : 'Player 2');
    this.opponentNickname = matchData.opponent_name || '상대 플레이어';

    ModeManager.setMode('pvp');

    if (UI.dom.pvpNameP1 && UI.dom.pvpNameP2) {
      if (this.myRole === 'p1') {
        UI.dom.pvpNameP1.textContent = `${this.myNickname} (나)`;
        UI.dom.pvpNameP2.textContent = `${this.opponentNickname} (상대)`;
      } else {
        UI.dom.pvpNameP1.textContent = `${this.opponentNickname} (상대)`;
        UI.dom.pvpNameP2.textContent = `${this.myNickname} (나)`;
      }
    }
  },

  startAiMatch(nickname) {
    // 대기 중 즉시 똑똑한 악어 AI 봇과 1:1 연습 대전을 개시합니다.
    this.isOnline = false;
    this.isAi = true;
    this.myRole = 'p1';
    this.myNickname = nickname || '늪지대 악어';
    this.opponentNickname = '🐊 악어 AI 봇';

    UI.closePvpMatchModal();
    ModeManager.setMode('pvp');

    if (UI.dom.pvpNameP1 && UI.dom.pvpNameP2) {
      UI.dom.pvpNameP1.textContent = `${this.myNickname} (나)`;
      UI.dom.pvpNameP2.textContent = '🐊 악어 AI 봇';
    }
  },

  startTurnTimer() {
    // 45초 턴 제한시간 타이머를 시작하고 1초마다 카운트다운을 수행합니다.
    this.stopTurnTimer();
    this.turnSecondsLeft = 45;
    this.updateTimerDisplay();

    this.turnTimer = setInterval(() => {
      this.turnSecondsLeft--;
      this.updateTimerDisplay();
      if (this.turnSecondsLeft <= 0) {
        this.stopTurnTimer();
        this.handleTurnTimeout();
      }
    }, 1000);
  },

  stopTurnTimer() {
    // 가동 중인 턴 타이머를 정지합니다.
    if (this.turnTimer) {
      clearInterval(this.turnTimer);
      this.turnTimer = null;
    }
  },

  updateTimerDisplay() {
    // 상단 턴 타이머 뱃지 텍스트 및 10초 이하 경고 색상을 갱신합니다.
    if (UI.dom.pvpTimerBadge) {
      UI.dom.pvpTimerBadge.textContent = `⏱️ ${this.turnSecondsLeft}초`;
      if (this.turnSecondsLeft <= 10) {
        UI.dom.pvpTimerBadge.style.color = '#ef4444';
        UI.dom.pvpTimerBadge.style.borderColor = '#ef4444';
      } else {
        UI.dom.pvpTimerBadge.style.color = '';
        UI.dom.pvpTimerBadge.style.borderColor = '';
      }
    }
  },

  handleTurnTimeout() {
    // 45초 초과 시 빈 족보에 자동 기록하여 턴을 안전하게 강제 종료합니다.
    if (this.isMyTurn()) {
      UI.setNotice('⚠️ 턴 시간(45초)이 초과되어 비어있는 족보에 자동 기록됩니다!');
      if (this.currentDice.length === 0) {
        this.currentDice = this.drawFiveDice();
        this.rollsLeft--;
      }
      const curScores = this.getCurrentPlayerScores();
      const emptyCat = CATEGORIES.find(c => curScores[c.id] === undefined);
      if (emptyCat) {
        this.selectCategory(emptyCat.id);
      }
    }
  },

  createMasterPool() {
    // 대전 모드의 기본 11개 주사위 풀(빨강 5, 검정 5, 특수 와일드 1)을 생성합니다.
    const pool = [];
    for (let i = 1; i <= this.deck.redCount; i++) {
      pool.push({ id: `red_${i}`, color: 'red', isSpecial: false, faces: [1, 2, 3, 4, 5, 6] });
    }
    for (let i = 1; i <= this.deck.blackCount; i++) {
      pool.push({ id: `black_${i}`, color: 'black', isSpecial: false, faces: [1, 2, 3, 4, 5, 6] });
    }
    for (let i = 1; i <= this.deck.wildCount; i++) {
      pool.push({ id: `special_${i}`, color: 'wild', isSpecial: true, faces: ['★', 2, 3, 4, 5, 6] });
    }
    return pool;
  },

  drawFiveDice() {
    // 주사위 풀을 셔플하고 5개를 추첨합니다.
    const masterPool = this.createMasterPool();
    for (let i = masterPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [masterPool[i], masterPool[j]] = [masterPool[j], masterPool[i]];
    }
    return masterPool.slice(0, 5).map(die => ({
      ...die,
      value: 1,
      wildChosen: 6,
      isKept: false
    }));
  },

  roll() {
    // 현재 플레이어의 활성 주사위를 굴리고 온라인인 경우 상대방에게 패킷을 동기화합니다.
    if (!this.isMyTurn()) return;
    if (this.rollsLeft <= 0 || this.isRolling) return;
    this.isRolling = true;
    SoundFX.playRoll();

    if (this.rollsLeft === this.maxRolls) {
      this.currentDice = this.drawFiveDice();
    }

    UI.setRollingAnimation(true);
    const pName = this.isOnline 
      ? (this.myRole === 'p1' ? this.myNickname : this.opponentNickname) 
      : `Player ${this.currentPlayer}`;
    UI.setNotice(`주사위가 구르는 중... (${pName})`);

    setTimeout(() => {
      this.currentDice.forEach(die => {
        if (!die.isKept) {
          const randFace = die.faces[Math.floor(Math.random() * die.faces.length)];
          die.value = randFace;
          if (die.isSpecial && randFace === '★') {
            if (!die.wildChosen) die.wildChosen = 6;
          }
        }
      });

      this.rollsLeft--;
      this.isRolling = false;
      UI.setRollingAnimation(false);
      UI.renderDice();
      UI.updateRollControls();
      UI.updateScorePreviews();
      this.updateNoticeAfterRoll();

      if (this.isOnline) {
        PvPOnlineManager.send({
          type: 'game_action',
          action: {
            act: 'roll',
            dice: this.currentDice,
            rollsLeft: this.rollsLeft
          }
        });
      }
    }, 550);
  },

  updateNoticeAfterRoll() {
    // 굴리기 완료 후 현재 턴 플레이어에게 행동 가이드를 안내합니다.
    const hasWild = this.currentDice.some(d => d.isSpecial && d.value === '★');
    const wildHint = hasWild ? ' (🌟 와일드 주사위의 [1~6] 미니 칩으로 언제든 눈금 변경 가능!)' : '';
    const pName = this.isOnline
      ? (this.isMyTurn() ? `${this.myNickname} (내 차례)` : `${this.opponentNickname} (상대 차례)`)
      : `Player ${this.currentPlayer}`;

    if (this.rollsLeft > 0) {
      UI.setNotice(`[${pName}] 굴리기 완료! 주사위를 고정(KEEP)하거나, 점수를 기록할 족보를 선택하세요.${wildHint}`);
    } else {
      UI.setNotice(`[${pName}] 남은 굴리기가 끝났습니다! 점수를 기록할 족보를 선택하세요.${wildHint}`);
    }
  },

  toggleKeep(diceIndex) {
    // 주사위 고정(KEEP) 상태를 반전하고 온라인 상대에게 동기화합니다.
    if (!this.isMyTurn()) return;
    if (this.rollsLeft === this.maxRolls || this.isRolling) return;
    const die = this.currentDice[diceIndex];
    if (!die) return;
    die.isKept = !die.isKept;
    SoundFX.playClick();
    UI.renderDice();

    if (this.isOnline) {
      PvPOnlineManager.send({
        type: 'game_action',
        action: {
          act: 'keep_toggle',
          diceIndex: diceIndex,
          isKept: die.isKept
        }
      });
    }
  },

  setWildValue(chosenNum, diceIndex) {
    // 와일드카드 주사위의 눈금을 실시간으로 변경하고 동기화합니다.
    if (!this.isMyTurn()) return;
    let targetDie = null;
    let targetIdx = diceIndex;
    if (diceIndex !== undefined && this.currentDice[diceIndex]?.isSpecial && this.currentDice[diceIndex]?.value === '★') {
      targetDie = this.currentDice[diceIndex];
    } else {
      targetIdx = this.currentDice.findIndex(d => d.isSpecial && d.value === '★');
      if (targetIdx !== -1) targetDie = this.currentDice[targetIdx];
    }

    if (targetDie) {
      targetDie.wildChosen = chosenNum;
    }
    SoundFX.playClick();
    UI.closeWildModal();
    UI.renderDice();
    UI.updateScorePreviews();
    this.updateNoticeAfterRoll();

    if (this.isOnline) {
      PvPOnlineManager.send({
        type: 'game_action',
        action: {
          act: 'wild_change',
          diceIndex: targetIdx,
          wildChosen: chosenNum
        }
      });
    }
  },

  getCurrentPlayerScores() {
    // 현재 턴 플레이어의 스코어 객체를 반환합니다.
    return this.currentPlayer === 1 ? this.p1Scores : this.p2Scores;
  },

  getP1Total() {
    // Player 1의 상단 합계, 보너스, 하단 합계, 총점을 계산합니다.
    let upper = 0;
    CATEGORIES.filter(c => c.section === 'upper').forEach(c => {
      if (this.p1Scores[c.id] !== undefined) upper += this.p1Scores[c.id];
    });
    const bonus = upper >= 63 ? 35 : 0;
    let lower = 0;
    CATEGORIES.filter(c => c.section === 'lower').forEach(c => {
      if (this.p1Scores[c.id] !== undefined) lower += this.p1Scores[c.id];
    });
    return { upper, bonus, lower, total: upper + bonus + lower };
  },

  getP2Total() {
    // Player 2의 상단 합계, 보너스, 하단 합계, 총점을 계산합니다.
    let upper = 0;
    CATEGORIES.filter(c => c.section === 'upper').forEach(c => {
      if (this.p2Scores[c.id] !== undefined) upper += this.p2Scores[c.id];
    });
    const bonus = upper >= 63 ? 35 : 0;
    let lower = 0;
    CATEGORIES.filter(c => c.section === 'lower').forEach(c => {
      if (this.p2Scores[c.id] !== undefined) lower += this.p2Scores[c.id];
    });
    return { upper, bonus, lower, total: upper + bonus + lower };
  },

  getMyTotal() {
    // 온라인 대전 시 내 점수 총합을 반환합니다.
    return this.myRole === 'p1' ? this.getP1Total() : this.getP2Total();
  },

  getOpponentTotal() {
    // 온라인 대전 시 상대방 점수 총합을 반환합니다.
    return this.myRole === 'p1' ? this.getP2Total() : this.getP1Total();
  },

  selectCategory(catId) {
    // 현재 플레이어가 선택한 족보 칸에 점수를 확정 기록하고 상대방 턴으로 전환합니다.
    if (!this.isMyTurn()) return;
    if (this.rollsLeft === this.maxRolls) {
      alert('주사위를 최소 한 번 이상 굴린 후 점수를 기록할 수 있습니다!');
      return;
    }
    const curScores = this.getCurrentPlayerScores();
    if (curScores[catId] !== undefined) return;

    const calculatedScores = Evaluator.calculateAll(this.currentDice, 0);
    const score = calculatedScores[catId] || 0;
    curScores[catId] = score;

    if (['flush', 'yacht', 'str_flush', 'five_plus'].includes(catId) && score > 0) {
      SoundFX.playJackpot();
    } else {
      SoundFX.playScore();
    }

    const prevPlayer = this.currentPlayer;
    const nextPlayer = prevPlayer === 1 ? 2 : 1;
    const nextRound = prevPlayer === 2 ? this.round + 1 : this.round;

    if (this.isOnline) {
      PvPOnlineManager.send({
        type: 'game_action',
        action: {
          act: 'score_lock',
          catId: catId,
          score: score,
          player: prevPlayer,
          nextPlayer: nextPlayer,
          nextRound: nextRound
        }
      });
    }

    this.advanceTurn(nextPlayer, nextRound);
  },

  advanceTurn(nextPlayer, nextRound) {
    // 턴을 다음 플레이어로 넘기고 상태 및 45초 타이머를 갱신합니다.
    this.currentPlayer = nextPlayer;
    this.round = nextRound;
    this.rollsLeft = this.maxRolls;
    this.currentDice = [];

    if (this.round > this.totalRounds) {
      this.stopTurnTimer();
      this.finishGame();
      return;
    }

    this.updatePvPStatus();
    UI.renderDice();
    UI.updateRollControls();
    UI.renderLockedScores();
    UI.clearScorePreviews();
    this.startTurnTimer();

    if (this.isOnline) {
      if (this.isMyTurn()) {
        UI.setNotice(`⚔️ [내 턴] 내 차례입니다! 주사위를 굴리세요. (현재: 나 ${this.getMyTotal().total}점 vs 상대 ${this.getOpponentTotal().total}점)`);
      } else {
        UI.setNotice(`⏳ 상대방 (${this.opponentNickname})의 턴입니다. 주사위를 굴리고 있습니다...`);
      }
    } else if (this.isAi) {
      if (this.currentPlayer === 1) {
        UI.setNotice(`⚔️ [내 턴] 내 차례입니다! 주사위를 굴리세요. (나 ${this.getP1Total().total}점 vs AI ${this.getP2Total().total}점)`);
      } else {
        UI.setNotice(`🐊 악어 AI 봇이 주사위를 굴릴 준비를 하고 있습니다...`);
        this.runAiTurn();
      }
    } else {
      const pName = `Player ${this.currentPlayer}`;
      UI.setNotice(`⚔️ ${pName}의 턴입니다! (현재 스코어: P1 ${this.getP1Total().total}점 vs P2 ${this.getP2Total().total}점)`);
    }
  },

  handleOpponentAction(action) {
    // 원격 온라인 상대방이 보낸 주사위/고정/점수 액션을 실시간으로 화면에 미러링합니다.
    if (!action) return;

    if (action.act === 'roll') {
      this.currentDice = action.dice || [];
      this.rollsLeft = action.rollsLeft;
      SoundFX.playRoll();
      UI.setRollingAnimation(true);
      setTimeout(() => {
        UI.setRollingAnimation(false);
        UI.renderDice();
        UI.updateRollControls();
        UI.updateScorePreviews();
        UI.setNotice(`상대방(${this.opponentNickname})이 주사위를 굴렸습니다. (남은 굴리기: ${this.rollsLeft}회)`);
      }, 550);
    } else if (action.act === 'keep_toggle') {
      if (this.currentDice[action.diceIndex]) {
        this.currentDice[action.diceIndex].isKept = action.isKept;
        SoundFX.playClick();
        UI.renderDice();
      }
    } else if (action.act === 'wild_change') {
      const d = action.diceIndex !== undefined 
        ? this.currentDice[action.diceIndex] 
        : this.currentDice.find(die => die.isSpecial && die.value === '★');
      if (d) {
        d.wildChosen = action.wildChosen;
        SoundFX.playClick();
        UI.renderDice();
        UI.updateScorePreviews();
      }
    } else if (action.act === 'score_lock') {
      const targetScores = action.player === 1 ? this.p1Scores : this.p2Scores;
      targetScores[action.catId] = action.score;
      if (['flush', 'yacht', 'str_flush', 'five_plus'].includes(action.catId) && action.score > 0) {
        SoundFX.playJackpot();
      } else {
        SoundFX.playScore();
      }
      this.advanceTurn(action.nextPlayer, action.nextRound);
    }
  },

  handleOpponentDisconnected(message) {
    // 원격 상대방의 연결이 끊어졌을 때 몰수승 처리하고 보상 가넷을 지급합니다.
    this.stopTurnTimer();
    const rewardGarnets = 50;
    const currentGarnets = STORAGE.getGarnets();
    STORAGE.setGarnets(currentGarnets + rewardGarnets);
    if (Game.garnets !== undefined) Game.garnets = currentGarnets + rewardGarnets;
    if (UI.dom.garnetCount) UI.dom.garnetCount.textContent = `🔴 ${STORAGE.getGarnets()}`;

    SoundFX.playJackpot();
    alert(`📢 ${message || '상대방의 연결이 끊어졌습니다.'}\n\n🏆 기권승으로 챔피언 상금 🔴 +50 가넷을 획득했습니다!`);
    ModeManager.openLobby();
  },

  runAiTurn() {
    // 악어 AI 봇이 주사위를 굴리고 최적의 족보를 전략적으로 선택하는 3단계 인공지능 루프
    if (!this.isAi || this.currentPlayer !== 2) return;

    setTimeout(() => {
      if (this.currentPlayer !== 2) return;
      this.currentDice = this.drawFiveDice();
      this.currentDice.forEach(die => {
        const randFace = die.faces[Math.floor(Math.random() * die.faces.length)];
        die.value = randFace;
        if (die.isSpecial && randFace === '★') die.wildChosen = 6;
      });
      this.rollsLeft = 2;
      SoundFX.playRoll();
      UI.renderDice();
      UI.updateRollControls();
      UI.updateScorePreviews();
      UI.setNotice('🐊 악어 AI 봇이 첫 번째 주사위를 굴렸습니다. 고정할 주사위를 분석 중...');

      setTimeout(() => {
        if (this.currentPlayer !== 2) return;
        const curScores = this.p2Scores;
        const counts = {};
        this.currentDice.forEach(d => {
          const v = (d.isSpecial && d.value === '★') ? d.wildChosen : d.value;
          counts[v] = (counts[v] || 0) + 1;
        });
        let maxVal = 6;
        let maxCount = 0;
        Object.entries(counts).forEach(([v, c]) => {
          if (c > maxCount) {
            maxCount = c;
            maxVal = parseInt(v, 10);
          }
        });

        this.currentDice.forEach(die => {
          const v = (die.isSpecial && die.value === '★') ? die.wildChosen : die.value;
          if (v === maxVal || die.isSpecial) {
            die.isKept = true;
          }
        });
        SoundFX.playClick();
        UI.renderDice();

        setTimeout(() => {
          if (this.currentPlayer !== 2) return;
          this.currentDice.forEach(die => {
            if (!die.isKept) {
              die.value = die.faces[Math.floor(Math.random() * die.faces.length)];
            }
          });
          this.rollsLeft = 1;
          SoundFX.playRoll();
          UI.renderDice();
          UI.updateRollControls();
          UI.updateScorePreviews();
          UI.setNotice('🐊 악어 AI 봇이 두 번째 주사위를 굴렸습니다. 최종 점수 기록할 족보를 선택 중...');

          setTimeout(() => {
            if (this.currentPlayer !== 2) return;
            const finalScores = Evaluator.calculateAll(this.currentDice, 0);
            let chosenCat = null;
            let highestScore = -1;

            CATEGORIES.forEach(cat => {
              if (curScores[cat.id] === undefined) {
                const s = finalScores[cat.id] || 0;
                if (s > highestScore) {
                  highestScore = s;
                  chosenCat = cat.id;
                }
              }
            });

            if (!chosenCat) {
              chosenCat = CATEGORIES.find(c => curScores[c.id] === undefined)?.id;
            }

            if (chosenCat) {
              const score = finalScores[chosenCat] || 0;
              curScores[chosenCat] = score;

              if (['flush', 'yacht', 'str_flush', 'five_plus'].includes(chosenCat) && score > 0) {
                SoundFX.playJackpot();
              } else {
                SoundFX.playScore();
              }

              const catName = CATEGORIES.find(c => c.id === chosenCat)?.name || chosenCat;
              UI.setNotice(`🐊 악어 AI 봇이 [${catName}]에 ${score}점을 기록했습니다!`);

              const nextPlayer = 1;
              const nextRound = this.round + 1;
              this.advanceTurn(nextPlayer, nextRound);
            }
          }, 1000);
        }, 800);
      }, 900);
    }, 800);
  },

  updatePvPStatus() {
    // 1vs1 대전 상단 상태 바, 플레이어 닉네임, 턴 하이라이트 및 점수를 갱신합니다.
    const p1 = this.getP1Total();
    const p2 = this.getP2Total();

    if (UI.dom.pvpRoundText) UI.dom.pvpRoundText.textContent = Math.min(this.round, this.totalRounds);
    if (UI.dom.pvpScoreP1) UI.dom.pvpScoreP1.textContent = `${p1.total}점`;
    if (UI.dom.pvpScoreP2) UI.dom.pvpScoreP2.textContent = `${p2.total}점`;

    if (UI.dom.pvpCardP1 && UI.dom.pvpCardP2) {
      if (this.currentPlayer === 1) {
        UI.dom.pvpCardP1.classList.add('active');
        UI.dom.pvpCardP2.classList.remove('active');
        if (UI.dom.pvpTurnP1) UI.dom.pvpTurnP1.style.display = 'inline-block';
        if (UI.dom.pvpTurnP2) UI.dom.pvpTurnP2.style.display = 'none';
      } else {
        UI.dom.pvpCardP1.classList.remove('active');
        UI.dom.pvpCardP2.classList.add('active');
        if (UI.dom.pvpTurnP1) UI.dom.pvpTurnP1.style.display = 'none';
        if (UI.dom.pvpTurnP2) UI.dom.pvpTurnP2.style.display = 'inline-block';
      }
    }

    if (UI.dom.upperSubtotal) UI.dom.upperSubtotal.textContent = `${p1.upper} / 63`;
    if (UI.dom.upperBonus) UI.dom.upperBonus.textContent = p1.bonus > 0 ? '+35 (달성!)' : '0';
    if (UI.dom.upperSubtotalP2) UI.dom.upperSubtotalP2.textContent = `${p2.upper} / 63`;
    if (UI.dom.upperBonusP2) UI.dom.upperBonusP2.textContent = p2.bonus > 0 ? '+35 (달성!)' : '0';

    if (UI.dom.garnetCount) {
      UI.dom.garnetCount.textContent = `🔴 ${STORAGE.getGarnets()}`;
    }

    UI.renderLockedScores();
  },

  finishGame() {
    // 17라운드 완주 후 최종 승패를 판정하고 보상 가넷을 지급하며 결과 모달을 엽니다.
    this.stopTurnTimer();
    const p1 = this.getP1Total();
    const p2 = this.getP2Total();

    let winnerMsg = '';
    let rewardMsg = '';
    let rewardGarnets = 0;

    const p1Name = this.isOnline 
      ? (this.myRole === 'p1' ? `${this.myNickname} (나)` : `${this.opponentNickname} (상대)`)
      : (this.isAi ? `${this.myNickname} (나)` : 'Player 1');
    const p2Name = this.isOnline 
      ? (this.myRole === 'p2' ? `${this.myNickname} (나)` : `${this.opponentNickname} (상대)`)
      : (this.isAi ? '🐊 악어 AI 봇' : 'Player 2');

    const iWon = (this.myRole === 'p1' && p1.total > p2.total) || (this.myRole === 'p2' && p2.total > p1.total);
    const tie = p1.total === p2.total;

    if (this.isOnline || this.isAi) {
      if (iWon) {
        winnerMsg = `🏆 ${this.myNickname} 최종 승리!`;
        rewardMsg = `챔피언 상금 🔴 +50 가넷을 획득했습니다!`;
        rewardGarnets = 50;
      } else if (tie) {
        winnerMsg = '🤝 치열한 무승부!';
        rewardMsg = '사이좋게 🔴 +25 가넷씩 나누어 가집니다!';
        rewardGarnets = 25;
      } else {
        winnerMsg = `💥 ${this.opponentNickname} 승리!`;
        rewardMsg = '아쉽게 패배했습니다. 다음 대결에서 복수하세요!';
        rewardGarnets = 10;
      }
    } else {
      if (p1.total > p2.total) {
        winnerMsg = '🏆 Player 1 최종 승리!';
        rewardMsg = 'Player 1이 승리하여 챔피언 상금 🔴 +50 가넷을 획득했습니다!';
        rewardGarnets = 50;
      } else if (p2.total > p1.total) {
        winnerMsg = '🏆 Player 2 최종 승리!';
        rewardMsg = 'Player 2가 승리하여 챔피언 상금 🔴 +50 가넷을 획득했습니다!';
        rewardGarnets = 50;
      } else {
        winnerMsg = '🤝 치열한 무승부!';
        rewardMsg = '무승부로 사이좋게 🔴 +25 가넷씩 나누어 가집니다!';
        rewardGarnets = 25;
      }
    }

    const currentGarnets = STORAGE.getGarnets();
    STORAGE.setGarnets(currentGarnets + rewardGarnets);
    if (Game.garnets !== undefined) Game.garnets = currentGarnets + rewardGarnets;
    if (UI.dom.garnetCount) UI.dom.garnetCount.textContent = `🔴 ${STORAGE.getGarnets()}`;

    SoundFX.playJackpot();

    if (UI.dom.pvpWinnerText) UI.dom.pvpWinnerText.textContent = winnerMsg;
    if (UI.dom.pvpFinalScoreP1) UI.dom.pvpFinalScoreP1.textContent = `${p1.total}점`;
    if (UI.dom.pvpFinalScoreP2) UI.dom.pvpFinalScoreP2.textContent = `${p2.total}점`;
    if (UI.dom.pvpFinalDetailP1) UI.dom.pvpFinalDetailP1.textContent = `${p1Name} (상단 ${p1.upper} / 하단 ${p1.lower})`;
    if (UI.dom.pvpFinalDetailP2) UI.dom.pvpFinalDetailP2.textContent = `${p2Name} (상단 ${p2.upper} / 하단 ${p2.lower})`;
    if (UI.dom.pvpRewardMsg) UI.dom.pvpRewardMsg.textContent = rewardMsg;

    UI.dom.pvpGameOverModal.classList.add('active');
  }
};

// -------------------------------------------------------------
// 6. All I Gator 호야추 모험 모드 보스 디펜스 엔진 (AdventureGame)
// -------------------------------------------------------------
const ASSET_BASE = (typeof window !== 'undefined' && window.HOYATCH_ASSET_BASE) ? window.HOYATCH_ASSET_BASE : 'assets/';

const ADVENTURE_BOSSES = [
  { stage: 1, name: '버거 먹는 아기 악어', icon: '🐊', hp: 100, turns: 5, gimmick: '초반 탐험: 기본 족보로 가볍게 워밍업 타격!', image: null },
  { stage: 2, name: '검보 피자 셰프 악어', icon: '🍕', hp: 160, turns: 5, gimmick: '피자 셰프: 짝수 눈금 점수 +50% 추가 화력!', image: null },
  { stage: 3, name: '늪지 격투가 검보 킥', icon: '🥋', hp: 220, turns: 5, gimmick: '격투 연타 콤보: 페어/세트류 족보(트리플/포카드/풀하우스/투페어) 데미지 +50% 증폭!', image: null },
  { stage: 4, name: '심연의 언데드 뼈악어', icon: '☠️', hp: 320, turns: 6, gimmick: '뼈의 저주: 플러시 & 스트레이트(스몰/라지/스티플) 데미지 +50% 증폭!', image: null },
  { stage: 5, name: '메카 게이터 버거 킹', icon: '👑', hp: 480, turns: 6, gimmick: '최종 결전: 대형 족보(포카드/풀하우스/요트/스티플/파이브카드) 데미지 2.0배 초대형 증폭!', image: null }
];

const ADVENTURE_RELICS = [
  { id: 'red_demon', name: '🔴 케첩 레드 부스터', desc: '패의 케첩 레드 주사위 1개당 최종 데미지 +5 추가 피해' },
  { id: 'black_shroud', name: '⚫ BBQ 블랙 시크릿', desc: '패의 BBQ 블랙 주사위 1개당 최종 데미지 +5 추가 피해' },
  { id: 'lucky_seven', name: '🍀 럭키 버거 세븐', desc: '주사위 눈금 합이 7의 배수(7, 14, 21...)일 때 총 피해량 1.4배' },
  { id: 'king_power', name: '🍔 더블 패티 파워', desc: '페어류 족보(원페어/투페어/트리플/포카드/풀하우스) 데미지 +20' },
  { id: 'storm_straight', name: '🗼 타워 버거 스트레이트', desc: '스트레이트 족보 성공 시 데미지 +30' },
  { id: 'midas', name: '💎 가넷 마이다스', desc: '공격할 때마다 버거 가넷 +6개 즉시 획득' },
  { id: 'infinite_wheel', name: '🔄 무한 리필 티켓', desc: '매 턴 주사위 굴리기 기회 +1회 영구 추가' },
  { id: 'wild_joker', name: '🥒 황금 피클 와일드', desc: '덱에 특수 와일드 주사위 1개 영구 추가' }
];

const AdventureGame = {
  stage: 1,
  currentHp: 100,
  maxHp: 100,
  turnsLeft: 5,
  totalDamageDealt: 0,
  earnedGarnets: 0,
  relics: [],
  scores: {},
  deck: { redCount: 5, blackCount: 5, wildCount: 1, powerupLevel: 0 },
  maxRolls: 3,
  rollsLeft: 3,
  isRolling: false,
  currentDice: [],
  isGameOver: false,

  relicRerollsLeft: 0,

  init() {
    // All I Gator 호야추 모험 모드를 1단계부터 초기화합니다.
    this.stage = 1;
    this.totalDamageDealt = 0;
    this.earnedGarnets = 0;
    this.relics = [];
    this.isGameOver = false;

    // 셰프 연구소 영구 특성 반영
    const perks = ChefLabManager.getPerks();
    const wildCount = 1 + (perks.wild_starter ? 1 : 0);
    this.deck = { redCount: 5, blackCount: 5, wildCount: wildCount, powerupLevel: 0 };

    // 늪지대 시작 지원금 특성
    if (perks.start_stash) {
      this.earnedGarnets += 30;
      STORAGE.setGarnets(STORAGE.getGarnets() + 30);
      UI.updateGarnetDisplay();
    }

    // 셰프의 감각 (유물 리롤 횟수)
    this.relicRerollsLeft = perks.relic_reroll ? 1 : 0;

    UI.initScoreSheet();
    this.setupStage(1);
  },

  setupStage(stageNum) {
    // 지정된 보스 스테이지의 HP, 턴 제한, 족보 점수판을 세팅합니다.
    this.stage = stageNum;
    const boss = ADVENTURE_BOSSES[stageNum - 1];
    this.maxHp = boss.hp;
    this.currentHp = boss.hp;
    this.turnsLeft = boss.turns;
    this.scores = {}; // 보스마다 17대 족보를 새롭게 모두 사용 가능!

    this.updateMaxRolls();
    this.rollsLeft = this.maxRolls;
    this.currentDice = [];

    this.updateAdventureUI();
    UI.renderDice();
    UI.updateRollControls();
    UI.renderLockedScores();
    UI.clearScorePreviews();
    UI.updatePoolText();
    UI.setNotice(`⚔️ Stage ${stageNum}: [${boss.name}] 출현! (HP: ${boss.hp} | 공격 기회: ${boss.turns}턴) [주사위 굴리기]로 첫 공격을 준비하세요!`);
  },

  updateMaxRolls() {
    // 셰프 연구소 더블 번, 유물 효과에 맞춰 최대 굴리기 횟수를 계산합니다.
    let base = 3;
    const perks = ChefLabManager.getPerks();
    if (perks.extra_bun) base += 1;
    if (this.hasRelic('infinite_wheel')) base += 1;
    this.maxRolls = base;
  },

  hasRelic(id) {
    // 특정 시너지 유물을 보유하고 있는지 확인합니다.
    return this.relics.some(r => r.id === id);
  },

  createMasterPool() {
    // 모험 모드 덱에 따른 주사위 풀을 생성합니다.
    const pool = [];
    for (let i = 1; i <= this.deck.redCount; i++) {
      pool.push({ id: `red_${i}`, color: 'red', isSpecial: false, faces: [1, 2, 3, 4, 5, 6] });
    }
    for (let i = 1; i <= this.deck.blackCount; i++) {
      pool.push({ id: `black_${i}`, color: 'black', isSpecial: false, faces: [1, 2, 3, 4, 5, 6] });
    }
    for (let i = 1; i <= this.deck.wildCount; i++) {
      pool.push({ id: `special_${i}`, color: 'wild', isSpecial: true, faces: ['★', 2, 3, 4, 5, 6] });
    }
    return pool;
  },

  drawFiveDice() {
    // 주사위 풀을 셔플하고 5개를 추첨합니다.
    const masterPool = this.createMasterPool();
    for (let i = masterPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [masterPool[i], masterPool[j]] = [masterPool[j], masterPool[i]];
    }
    return masterPool.slice(0, 5).map(die => ({
      ...die,
      value: 1,
      wildChosen: 6,
      isKept: false
    }));
  },

  roll() {
    // 보스 공격을 위한 주사위를 굴립니다.
    if (this.rollsLeft <= 0 || this.isRolling) return;
    this.isRolling = true;
    SoundFX.playRoll();

    if (this.rollsLeft === this.maxRolls) {
      this.currentDice = this.drawFiveDice();
    }

    UI.setRollingAnimation(true);
    UI.setNotice('주사위가 구르는 중... 보스에게 가할 데미지를 장전합니다!');

    setTimeout(() => {
      this.currentDice.forEach(die => {
        if (!die.isKept) {
          const randFace = die.faces[Math.floor(Math.random() * die.faces.length)];
          die.value = randFace;
          if (die.isSpecial && randFace === '★') {
            if (!die.wildChosen) die.wildChosen = 6;
          }
        }
      });

      this.rollsLeft--;
      this.isRolling = false;
      UI.setRollingAnimation(false);
      UI.renderDice();
      UI.updateRollControls();
      UI.updateScorePreviews();
      this.updateNoticeAfterRoll();
    }, 550);
  },

  updateNoticeAfterRoll() {
    // 굴리기 후 보스 타격 및 족보 선택을 안내합니다.
    const hasWild = this.currentDice.some(d => d.isSpecial && d.value === '★');
    const wildHint = hasWild ? ' (🌟 와일드 주사위의 [1~6] 미니 칩으로 언제든 눈금 변경 가능!)' : '';

    if (this.rollsLeft > 0) {
      UI.setNotice(`굴리기 완료! 주사위를 고정(KEEP)하거나, 오른쪽 스코어보드에서 족보를 선택해 보스를 타격하세요! (남은 공격 기회: ${this.turnsLeft}턴)${wildHint}`);
    } else {
      UI.setNotice(`남은 굴리기가 끝났습니다! 오른쪽 스코어보드에서 보스를 타격할 족보를 선택하세요!${wildHint}`);
    }
  },

  toggleKeep(diceIndex) {
    // 주사위 고정 상태를 반전합니다.
    if (this.rollsLeft === this.maxRolls || this.isRolling) return;
    const die = this.currentDice[diceIndex];
    die.isKept = !die.isKept;
    SoundFX.playClick();
    UI.renderDice();
  },

  setWildValue(chosenNum, diceIndex) {
    // 와일드 주사위의 눈금을 실시간으로 변경하고 예상 데미지를 재계산합니다.
    let targetDie = null;
    if (diceIndex !== undefined && this.currentDice[diceIndex]?.isSpecial && this.currentDice[diceIndex]?.value === '★') {
      targetDie = this.currentDice[diceIndex];
    } else {
      targetDie = this.currentDice.find(d => d.isSpecial && d.value === '★');
    }

    if (targetDie) {
      targetDie.wildChosen = chosenNum;
    }
    SoundFX.playClick();
    UI.closeWildModal();
    UI.renderDice();
    UI.updateScorePreviews();
    this.updateNoticeAfterRoll();
  },

  calculateCategoryDamage(catId) {
    // 족보 점수에 보스 기믹과 시너지 유물 효과를 모두 곱연산/가산하여 최종 타격 데미지를 산출합니다.
    if (!this.currentDice || this.currentDice.length === 0) return 0;
    const baseScores = Evaluator.calculateAll(this.currentDice, 0);
    let baseScore = baseScores[catId] || 0;
    if (baseScore === 0) return 0;

    // 1. 보스 기믹 적용
    if (this.stage === 2) {
      // 검보 피자 셰프: 짝수 눈금 점수 +50%
      if (['twos', 'fours', 'sixes', 'two_pair'].includes(catId)) {
        baseScore = Math.floor(baseScore * 1.5);
      }
    } else if (this.stage === 3) {
      // 늪지 격투가 검보 킥: 격투 연타 콤보 (페어/세트류 족보) 데미지 +50% 대폭 증폭!
      if (['one_pair', 'two_pair', 'three_kind', 'four_kind', 'full_house'].includes(catId)) {
        baseScore = Math.floor(baseScore * 1.5);
      }
    } else if (this.stage === 4) {
      // 심연의 언데드 뼈악어: 플러시 & 스트레이트(스몰/라지/스티플) 1.5배
      if (['flush', 's_straight', 'l_straight', 'str_flush'].includes(catId)) {
        baseScore = Math.floor(baseScore * 1.5);
      }
    } else if (this.stage === 5) {
      // 메카 게이터 버거 킹: 대형 족보(포카드/풀하우스/요트/스티플/파이브카드) 2.0배 초대형 증폭!
      if (['four_kind', 'full_house', 'yacht', 'str_flush', 'five_plus'].includes(catId)) {
        baseScore = baseScore * 2;
      }
    }

    // 2. 유물 가산 보너스
    let addDmg = 0;
    if (this.hasRelic('red_demon')) {
      const redCount = this.currentDice.filter(d => d.color === 'red' || (d.color === 'wild')).length;
      addDmg += redCount * 5;
    }
    if (this.hasRelic('black_shroud')) {
      const blackCount = this.currentDice.filter(d => d.color === 'black' || (d.color === 'wild')).length;
      addDmg += blackCount * 5;
    }
    if (this.hasRelic('king_power')) {
      if (['one_pair', 'two_pair', 'three_kind', 'four_kind', 'full_house'].includes(catId)) {
        addDmg += 20;
      }
    }
    if (this.hasRelic('storm_straight')) {
      if (['s_straight', 'l_straight', 'str_flush'].includes(catId)) {
        addDmg += 30;
      }
    }

    let finalDmg = baseScore + addDmg;

    // 3. 유물 배수 보너스 (럭키 세븐: 눈금 총합 7의 배수 시 1.4배)
    if (this.hasRelic('lucky_seven')) {
      const sum = this.currentDice.reduce((acc, d) => {
        const val = (d.isSpecial && d.value === '★') ? (d.wildChosen || 6) : (typeof d.value === 'number' ? d.value : 0);
        return acc + val;
      }, 0);
      if (sum % 7 === 0) {
        finalDmg = Math.floor(finalDmg * 1.4);
      }
    }

    // 4. 모험 덱 패티 파워업 보너스 (+10 per Lv)
    if (this.deck.powerupLevel > 0) {
      finalDmg += this.deck.powerupLevel * 10;
    }

    // 5. 셰프 연구소: 특제 핫소스 연구 (+15% 증폭)
    if (ChefLabManager.hasPerk('spicy_sauce')) {
      finalDmg = Math.floor(finalDmg * 1.15);
    }

    return finalDmg;
  },

  getBestCategory() {
    // 아직 사용하지 않은 족보 중 가장 높은 데미지를 주는 족보를 추천합니다.
    let bestCat = null;
    let maxDmg = -1;
    CATEGORIES.forEach(cat => {
      if (this.scores[cat.id] === undefined) {
        const dmg = this.calculateCategoryDamage(cat.id);
        if (dmg > maxDmg) {
          maxDmg = dmg;
          bestCat = cat.id;
        }
      }
    });
    return bestCat;
  },

  selectCategory(catId) {
    // 족보를 확정하여 보스를 타격하고 체력 차감 및 스테이지 클리어/패배를 판정합니다.
    if (this.rollsLeft === this.maxRolls) {
      alert('주사위를 최소 한 번 이상 굴린 후 공격할 수 있습니다!');
      return;
    }
    if (this.scores[catId] !== undefined) return;

    const dmg = this.calculateCategoryDamage(catId);
    this.scores[catId] = dmg;
    this.currentHp = Math.max(0, this.currentHp - dmg);
    this.totalDamageDealt += dmg;
    this.turnsLeft--;

    // 미다스의 손길 유물 효과 (+6 가넷)
    if (this.hasRelic('midas')) {
      this.earnedGarnets += 6;
      STORAGE.setGarnets(STORAGE.getGarnets() + 6);
    }

    if (dmg >= 50) {
      SoundFX.playJackpot();
    } else {
      SoundFX.playScore();
    }

    this.updateAdventureUI();

    if (this.currentHp <= 0) {
      // 보스 처치 성공!
      SoundFX.playJackpot();
      const stageReward = 20 + this.stage * 15;
      this.earnedGarnets += stageReward;
      STORAGE.setGarnets(STORAGE.getGarnets() + stageReward);
      this.updateAdventureUI();

      if (this.stage >= 5) {
        // 5대 보스 올클리어!
        this.finishAdventure(true);
      } else {
        // 유물 선택 모달 띄우기
        UI.setNotice(`🎉 Stage ${this.stage} [${ADVENTURE_BOSSES[this.stage - 1].name}] 격파 성공! (보상 +${stageReward}🔴 가넷 획득) 전리품 시너지 유물을 선택하세요!`);
        setTimeout(() => {
          this.openRelicSelection();
        }, 650);
      }
    } else if (this.turnsLeft <= 0) {
      // 턴 소진 패배
      this.finishAdventure(false);
    } else {
      // 다음 공격 턴 준비
      this.updateMaxRolls();
      this.rollsLeft = this.maxRolls;
      this.currentDice = [];
      UI.renderDice();
      UI.updateRollControls();
      UI.renderLockedScores();
      UI.clearScorePreviews();
      UI.setNotice(`💥 보스에게 ${dmg} 데미지 작렬! (남은 HP: ${this.currentHp} | 공격 기회: ${this.turnsLeft}회 남음) [주사위 굴리기]로 다음 공격을 진행하세요!`);
    }
  },

  updateAdventureUI() {
    // 보스 HP 바, 스테이지 태그, 공격 기회, 유물 목록, 가넷을 갱신합니다.
    const boss = ADVENTURE_BOSSES[this.stage - 1];
    const bossEmojiEl = document.getElementById('advBossAvatarEmoji');
    if (bossEmojiEl) bossEmojiEl.textContent = boss.icon;
    if (UI.dom.advBossImg && boss.image) UI.dom.advBossImg.src = boss.image;
    if (UI.dom.advBossIcon) UI.dom.advBossIcon.textContent = boss.icon;
    if (UI.dom.advBossName) UI.dom.advBossName.textContent = boss.name;
    if (UI.dom.advStageTag) UI.dom.advStageTag.textContent = `Stage ${this.stage} / 5`;
    if (UI.dom.advBossGimmick) UI.dom.advBossGimmick.textContent = `특성: ${boss.gimmick}`;

    const pct = Math.max(0, Math.min(100, (this.currentHp / this.maxHp) * 100));
    if (UI.dom.advBossHpBar) UI.dom.advBossHpBar.style.width = `${pct}%`;
    if (UI.dom.advBossHpLabel) UI.dom.advBossHpLabel.textContent = `${this.currentHp} / ${this.maxHp} HP`;
    if (UI.dom.advTurnsLeft) UI.dom.advTurnsLeft.textContent = this.turnsLeft;

    if (UI.dom.advRelicsList) {
      UI.dom.advRelicsList.innerHTML = '';
      if (this.relics.length === 0) {
        UI.dom.advRelicsList.innerHTML = '<span class="relic-pill" style="opacity: 0.5;">유물 없음</span>';
      } else {
        this.relics.forEach(r => {
          const span = document.createElement('span');
          span.className = 'relic-pill';
          span.textContent = r.name;
          span.title = r.desc;
          UI.dom.advRelicsList.appendChild(span);
        });
      }
    }

    if (UI.dom.totalScore) UI.dom.totalScore.textContent = this.totalDamageDealt;
    if (UI.dom.garnetCount) UI.dom.garnetCount.textContent = `🔴 ${STORAGE.getGarnets()}`;
  },

  openRelicSelection() {
    // 획득 가능한 시너지 유물 중 무작위 3개를 추첨하여 선택 모달을 엽니다.
    const unowned = ADVENTURE_RELICS.filter(r => !this.relics.some(owned => owned.id === r.id));
    for (let i = unowned.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unowned[i], unowned[j]] = [unowned[j], unowned[i]];
    }
    const choices = unowned.slice(0, 3);

    if (UI.dom.relicChoicesGrid) {
      UI.dom.relicChoicesGrid.innerHTML = '';
      choices.forEach(relic => {
        const card = document.createElement('div');
        card.className = 'relic-card';
        card.innerHTML = `
          <div class="relic-card-title">${relic.name}</div>
          <div class="relic-card-desc">${relic.desc}</div>
          <button class="btn-primary" style="width: 100%; margin-top: 14px; font-size: 13px; font-weight: 800;">이 유물 획득 ➔</button>
        `;
        card.addEventListener('click', () => {
          this.chooseRelic(relic);
        });
        UI.dom.relicChoicesGrid.appendChild(card);
      });
    }

    // 셰프의 감각 (유물 리롤 버튼) 상태 갱신
    if (UI.dom.btnRerollRelics) {
      if (this.relicRerollsLeft > 0) {
        UI.dom.btnRerollRelics.style.display = 'inline-block';
        UI.dom.btnRerollRelics.textContent = `🔄 셰프의 감각 (유물 다시 뽑기 ${this.relicRerollsLeft}회 남음)`;
      } else {
        UI.dom.btnRerollRelics.style.display = 'none';
      }
    }

    UI.dom.relicModal.classList.add('active');
  },

  rerollRelics() {
    // 셰프 연구소 영구 특성: 유물 선택지를 1회 다시 뽑습니다.
    if (this.relicRerollsLeft <= 0) {
      alert('유물 다시 뽑기 기회를 모두 사용했습니다!');
      return;
    }
    this.relicRerollsLeft--;
    SoundFX.playRoll();
    this.openRelicSelection();
  },

  chooseRelic(relic) {
    // 유물을 선택하여 장착하고 2단계 주사위 덱빌딩 드래프트로 연결합니다.
    this.relics.push(relic);
    UI.dom.relicModal.classList.remove('active');
    SoundFX.playBuy();

    if (relic.id === 'wild_joker') {
      this.deck.wildCount = Math.min(4, this.deck.wildCount + 1);
    }

    // 2단계: 주사위 덱빌딩 드래프트 모달 띄우기
    this.openDiceDraft();
  },

  openDiceDraft() {
    // 보스 처치 보상 2단계: 모험 덱을 강화할 전리품 주사위를 선택합니다.
    const options = [
      {
        id: 'draft_red',
        name: '🔴 케첩 레드 주사위 +1개',
        desc: '모험 덱에 빨간색 주사위를 영구 추가하여 레드 플러시 확률을 극대화합니다.',
        icon: '🔴',
        apply: () => { this.deck.redCount += 1; }
      },
      {
        id: 'draft_black',
        name: '⚫ BBQ 블랙 주사위 +1개',
        desc: '모험 덱에 검은색 주사위를 영구 추가하여 블랙 플러시 완성도를 높입니다.',
        icon: '⚫',
        apply: () => { this.deck.blackCount += 1; }
      },
      {
        id: 'draft_wild',
        name: '🥒 황금 피클 와일드 +1개',
        desc: '원하는 숫자로 언제든 자유롭게 바꿀 수 있는 만능 와일드 주사위를 추가합니다.',
        icon: '🥒',
        apply: () => { this.deck.wildCount = Math.min(4, this.deck.wildCount + 1); }
      },
      {
        id: 'draft_patty',
        name: '🍔 패티 파워업 (족보 딜 +10)',
        desc: '모든 공격 성공 시 최종 타격 데미지에 +10 추가 피해를 영구 가산합니다.',
        icon: '🍔',
        apply: () => { this.deck.powerupLevel += 1; }
      }
    ];

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    const choices = options.slice(0, 3);

    if (UI.dom.diceDraftGrid) {
      UI.dom.diceDraftGrid.innerHTML = '';
      choices.forEach(opt => {
        const card = document.createElement('div');
        card.className = 'dice-draft-card';
        card.innerHTML = `
          <div class="draft-card-icon">${opt.icon}</div>
          <div class="draft-card-title">${opt.name}</div>
          <div class="draft-card-desc">${opt.desc}</div>
          <button class="btn-primary" style="width: 100%; margin-top: 12px; font-size: 13px; font-weight: 800;">이 주사위 영입 ➔</button>
        `;
        card.addEventListener('click', () => {
          this.chooseDiceDraft(opt);
        });
        UI.dom.diceDraftGrid.appendChild(card);
      });
    }

    if (UI.dom.diceDraftModal) {
      UI.dom.diceDraftModal.classList.add('active');
    } else {
      this.setupStage(this.stage + 1);
    }
  },

  chooseDiceDraft(choice) {
    // 선택한 전리품 주사위를 덱에 추가하고 다음 보스 스테이지로 전진합니다.
    choice.apply();
    if (UI.dom.diceDraftModal) {
      UI.dom.diceDraftModal.classList.remove('active');
    }
    SoundFX.playBuy();
    UI.showToast({
      title: '🎲 전리품 주사위 영입!',
      desc: `[${choice.name}]을(를) 모험 덱에 성공적으로 장착했습니다!`,
      icon: choice.icon
    });
    this.setupStage(this.stage + 1);
  },

  finishAdventure(isWin) {
    // 모험 종료(승리 또는 패배) 화면을 구성하고 결과 모달을 엽니다.
    this.isGameOver = true;
    if (isWin) {
      UI.dom.advOverIcon.textContent = '🏆';
      UI.dom.advOverTitle.textContent = '🎉 모험 올클리어 (Victory)!';
      UI.dom.advOverDesc.textContent = '5대 보스를 모두 쓰러뜨리고 왕국에 평화를 되찾았습니다! 전설의 챔피언으로 등극하셨습니다.';
      const clearReward = 150;
      this.earnedGarnets += clearReward;
      STORAGE.setGarnets(STORAGE.getGarnets() + clearReward);
    } else {
      UI.dom.advOverIcon.textContent = '💀';
      UI.dom.advOverTitle.textContent = '모험 실패 (Defeat)';
      UI.dom.advOverDesc.textContent = `Stage ${this.stage} [${ADVENTURE_BOSSES[this.stage - 1].name}]의 벽을 넘지 못했습니다. 다음엔 더 강력한 시너지 유물로 재도전해보세요!`;
    }

    UI.dom.advOverStats.innerHTML = `
      <div><strong>• 도달한 스테이지:</strong> Stage ${this.stage} / 5</div>
      <div><strong>• 누적 타격 데미지:</strong> ${this.totalDamageDealt} DMG</div>
      <div><strong>• 획득한 시너지 유물:</strong> ${this.relics.map(r => r.name).join(', ') || '없음'}</div>
      <div><strong>• 이번 모험 획득 가넷:</strong> 🔴 +${this.earnedGarnets}개</div>
      <div><strong>• 현재 총 보유 가넷:</strong> 🔴 ${STORAGE.getGarnets()}개</div>
    `;

    UI.dom.advGameOverModal.classList.add('active');
  }
};

// -------------------------------------------------------------
// 7. 게임 모드 통합 관리자 (ModeManager)
// -------------------------------------------------------------
const ModeManager = {
  currentMode: 'solo', // 'solo' | 'pvp' | 'adventure'

  getCurrentGame() {
    // 현재 활성화된 게임 모드의 인스턴스를 반환합니다.
    if (this.currentMode === 'pvp') return PvPGame;
    if (this.currentMode === 'adventure') return AdventureGame;
    return Game;
  },

  openLobby() {
    // 3대 모드 선택 로비 모달을 엽니다.
    UI.dom.lobbyModal.classList.add('active');
  },

  closeLobby() {
    // 모드 선택 로비 모달을 닫습니다.
    UI.dom.lobbyModal.classList.remove('active');
  },

  setMode(mode) {
    // 솔로, 1vs1 대전, 헬포커 모험 중 선택한 모드로 전환하고 화면 레이아웃을 맞춤 재구성합니다.
    if (!['solo', 'pvp', 'adventure'].includes(mode)) return;
    this.currentMode = mode;
    this.closeLobby();

    // 스코어 시트 초기화
    UI.initScoreSheet();

    if (mode === 'solo') {
      document.body.classList.remove('pvp-mode-active');
      UI.dom.modeTitleTag.textContent = '🏆 솔로 클래식';
      UI.dom.modeTitleTag.className = 'mode-title-tag mode-solo';
      UI.dom.headerSubtitle.textContent = '주사위 덱빌딩 & 17대 족보 챌린지';
      UI.dom.headerRoundBadge.style.display = 'inline-flex';
      UI.dom.roundTotalText.textContent = '/ 17';
      UI.dom.headerScoreBadge.style.display = 'inline-flex';
      UI.dom.scoreBadgeLabel.textContent = '총점';
      UI.dom.stepGuideBar.style.display = 'flex';
      UI.dom.pvpStatusBar.style.display = 'none';
      UI.dom.adventureStatusBar.style.display = 'none';
      UI.dom.btnOpenShop.style.display = 'inline-flex';
      UI.dom.poolStatusText.style.display = 'block';

      document.querySelectorAll('.col-p2').forEach(el => el.style.display = 'none');
      if (UI.dom.thUpperP1) UI.dom.thUpperP1.textContent = '점수';
      if (UI.dom.thLowerP1) UI.dom.thLowerP1.textContent = '점수';

      Game.init();
    } else if (mode === 'pvp') {
      document.body.classList.add('pvp-mode-active');
      UI.dom.modeTitleTag.textContent = '⚔️ 1vs1 온라인 대전';
      UI.dom.modeTitleTag.className = 'mode-title-tag mode-pvp';
      UI.dom.headerSubtitle.textContent = '실시간 온라인 2인 턴제 점수 쟁탈전';
      UI.dom.headerRoundBadge.style.display = 'none';
      UI.dom.headerScoreBadge.style.display = 'none';
      UI.dom.stepGuideBar.style.display = 'none';
      UI.dom.pvpStatusBar.style.display = 'flex';
      UI.dom.adventureStatusBar.style.display = 'none';
      UI.dom.btnOpenShop.style.display = 'none';
      UI.dom.poolStatusText.style.display = 'block';

      document.querySelectorAll('.col-p2').forEach(el => el.style.display = '');
      UI.updatePvPTableHeaders();

      PvPGame.init();
    } else if (mode === 'adventure') {
      document.body.classList.remove('pvp-mode-active');
      UI.dom.modeTitleTag.textContent = '🐊 악어 보스 디펜스';
      UI.dom.modeTitleTag.className = 'mode-title-tag mode-adventure';
      UI.dom.headerSubtitle.textContent = '5대 악어 보스 격파 & 버거 유물 덱빌딩 디펜스';
      UI.dom.headerRoundBadge.style.display = 'none';
      UI.dom.headerScoreBadge.style.display = 'inline-flex';
      UI.dom.scoreBadgeLabel.textContent = '누적 딜량';
      UI.dom.stepGuideBar.style.display = 'none';
      UI.dom.pvpStatusBar.style.display = 'none';
      UI.dom.adventureStatusBar.style.display = 'flex';
      UI.dom.btnOpenShop.style.display = 'none';
      UI.dom.poolStatusText.style.display = 'block';

      document.querySelectorAll('.col-p2').forEach(el => el.style.display = 'none');
      if (UI.dom.thUpperP1) UI.dom.thUpperP1.textContent = '타격 데미지';
      if (UI.dom.thLowerP1) UI.dom.thLowerP1.textContent = '타격 데미지';

      AdventureGame.init();
    }
  },

  roll() {
    // 현재 활성화된 모드의 게임에 굴리기를 요청합니다.
    this.getCurrentGame().roll();
  },

  toggleKeep(index) {
    // 현재 활성화된 모드의 게임에 주사위 고정/해제를 요청합니다.
    this.getCurrentGame().toggleKeep(index);
  },

  setWildValue(index, val) {
    // 현재 활성화된 모드의 게임에 와일드 주사위 눈금 변경을 적용합니다.
    this.getCurrentGame().setWildValue(val, index);
  },

  selectCategory(catId) {
    // 현재 활성화된 모드의 게임에 족보 점수 기록을 요청합니다.
    this.getCurrentGame().selectCategory(catId);
  }
};

// -------------------------------------------------------------
// 8. DOM 렌더링 및 초보자 UI 매니저 (UI Controller)
// -------------------------------------------------------------
const UI = {
  dom: {
    round: document.getElementById('currentRound'),
    totalScore: document.getElementById('totalScore'),
    garnetCount: document.getElementById('garnetCount'),
    rollsText: document.getElementById('rollsLeftText'),
    rollDots: document.getElementById('rollDotsContainer'),
    poolStatusText: document.getElementById('poolStatusText'),
    btnRoll: document.getElementById('btnRoll'),
    btnReset: document.getElementById('btnReset'),
    btnHelp: document.getElementById('btnHelp'),
    btnOpenShop: document.getElementById('btnOpenShop'),
    btnGoLobby: document.getElementById('btnGoLobby'),
    modeTitleTag: document.getElementById('modeTitleTag'),
    headerSubtitle: document.getElementById('headerSubtitle'),
    headerRoundBadge: document.getElementById('headerRoundBadge'),
    headerScoreBadge: document.getElementById('headerScoreBadge'),
    scoreBadgeLabel: document.getElementById('scoreBadgeLabel'),
    roundTotalText: document.getElementById('roundTotalText'),
    notice: document.getElementById('gameNotice'),
    activeDice: document.getElementById('activeDiceContainer'),
    keptDice: document.getElementById('keptDiceContainer'),
    upperBody: document.getElementById('upperTableBody'),
    lowerBody: document.getElementById('lowerTableBody'),
    upperSubtotal: document.getElementById('upperSubtotal'),
    upperBonus: document.getElementById('upperBonus'),
    thUpperP1: document.getElementById('thUpperP1'),
    thUpperP2: document.getElementById('thUpperP2'),
    thLowerP1: document.getElementById('thLowerP1'),
    thLowerP2: document.getElementById('thLowerP2'),
    upperSubtotalP2: document.getElementById('upperSubtotalP2'),
    upperBonusP2: document.getElementById('upperBonusP2'),
    guideStep1: document.getElementById('guideStep1'),
    guideStep2: document.getElementById('guideStep2'),
    guideStep3: document.getElementById('guideStep3'),
    stepGuideBar: document.getElementById('stepGuideBar'),
    // 1vs1 대전 모드 요소
    pvpStatusBar: document.getElementById('pvpStatusBar'),
    pvpCardP1: document.getElementById('pvpCardP1'),
    pvpCardP2: document.getElementById('pvpCardP2'),
    pvpNameP1: document.getElementById('pvpNameP1'),
    pvpNameP2: document.getElementById('pvpNameP2'),
    pvpScoreP1: document.getElementById('pvpScoreP1'),
    pvpScoreP2: document.getElementById('pvpScoreP2'),
    pvpTurnP1: document.getElementById('pvpTurnP1'),
    pvpTurnP2: document.getElementById('pvpTurnP2'),
    pvpTimerBadge: document.getElementById('pvpTimerBadge'),
    pvpRoundText: document.getElementById('pvpRoundText'),
    // 1vs1 온라인 매칭 모달 요소
    pvpMatchModal: document.getElementById('pvpMatchModal'),
    pvpNicknameInput: document.getElementById('pvpNicknameInput'),
    tabPvpQuick: document.getElementById('tabPvpQuick'),
    tabPvpCustom: document.getElementById('tabPvpCustom'),
    panelPvpQuick: document.getElementById('panelPvpQuick'),
    panelPvpCustom: document.getElementById('panelPvpCustom'),
    pvpQueueInitial: document.getElementById('pvpQueueInitial'),
    btnStartQuickMatch: document.getElementById('btnStartQuickMatch'),
    pvpQueueSearching: document.getElementById('pvpQueueSearching'),
    pvpQueueStatusText: document.getElementById('pvpQueueStatusText'),
    pvpQueueTimeText: document.getElementById('pvpQueueTimeText'),
    btnPlayWithAiBot: document.getElementById('btnPlayWithAiBot'),
    btnCancelQueue: document.getElementById('btnCancelQueue'),
    btnCreateCustomRoom: document.getElementById('btnCreateCustomRoom'),
    roomCodeDisplayBox: document.getElementById('roomCodeDisplayBox'),
    createdRoomCodeText: document.getElementById('createdRoomCodeText'),
    inputJoinRoomCode: document.getElementById('inputJoinRoomCode'),
    btnJoinCustomRoom: document.getElementById('btnJoinCustomRoom'),
    btnClosePvpMatch: document.getElementById('btnClosePvpMatch'),
    // 모험 모드 요소
    adventureStatusBar: document.getElementById('adventureStatusBar'),
    advBossImg: document.getElementById('advBossImg'),
    advBossIcon: document.getElementById('advBossIcon'),
    advBossName: document.getElementById('advBossName'),
    advStageTag: document.getElementById('advStageTag'),
    advBossGimmick: document.getElementById('advBossGimmick'),
    advBossHpBar: document.getElementById('advBossHpBar'),
    advBossHpLabel: document.getElementById('advBossHpLabel'),
    advTurnsLeft: document.getElementById('advTurnsLeft'),
    advRelicsList: document.getElementById('advRelicsList'),
    // 모달들
    lobbyModal: document.getElementById('lobbyModal'),
    btnSelectSolo: document.getElementById('btnSelectSolo'),
    btnSelectPvP: document.getElementById('btnSelectPvP'),
    btnSelectAdventure: document.getElementById('btnSelectAdventure'),
    btnCloseLobby: document.getElementById('btnCloseLobby'),
    btnOpenChefLabFromLobby: document.getElementById('btnOpenChefLabFromLobby'),
    relicModal: document.getElementById('relicModal'),
    relicChoicesGrid: document.getElementById('relicChoicesGrid'),
    btnRerollRelics: document.getElementById('btnRerollRelics'),
    diceDraftModal: document.getElementById('diceDraftModal'),
    diceDraftGrid: document.getElementById('diceDraftGrid'),
    pvpGameOverModal: document.getElementById('pvpGameOverModal'),
    pvpWinnerText: document.getElementById('pvpWinnerText'),
    pvpFinalScoreP1: document.getElementById('pvpFinalScoreP1'),
    pvpFinalScoreP2: document.getElementById('pvpFinalScoreP2'),
    pvpFinalDetailP1: document.getElementById('pvpFinalDetailP1'),
    pvpFinalDetailP2: document.getElementById('pvpFinalDetailP2'),
    pvpRewardMsg: document.getElementById('pvpRewardMsg'),
    btnPvpRestart: document.getElementById('btnPvpRestart'),
    btnPvpGoLobby: document.getElementById('btnPvpGoLobby'),
    advGameOverModal: document.getElementById('advGameOverModal'),
    advOverIcon: document.getElementById('advOverIcon'),
    advOverTitle: document.getElementById('advOverTitle'),
    advOverDesc: document.getElementById('advOverDesc'),
    advOverStats: document.getElementById('advOverStats'),
    btnAdvRestart: document.getElementById('btnAdvRestart'),
    btnAdvGoLobby: document.getElementById('btnAdvGoLobby'),
    // 업적 시스템
    btnOpenAchievements: document.getElementById('btnOpenAchievements'),
    achievementModal: document.getElementById('achievementModal'),
    btnCloseAchievements: document.getElementById('btnCloseAchievements'),
    achievementList: document.getElementById('achievementList'),
    achievementProgressText: document.getElementById('achievementProgressText'),
    toastContainer: document.getElementById('toastContainer'),
    // 상점 및 모달들
    wildModal: document.getElementById('wildModal'),
    btnCloseWild: document.getElementById('btnCloseWild'),
    helpModal: document.getElementById('helpModal'),
    btnCloseHelp: document.getElementById('btnCloseHelp'),
    shopModal: document.getElementById('shopModal'),
    btnCloseShop: document.getElementById('btnCloseShop'),
    tabShopStandard: document.getElementById('tabShopStandard'),
    tabShopChefLab: document.getElementById('tabShopChefLab'),
    shopStandardPanel: document.getElementById('shopStandardPanel'),
    shopChefLabPanel: document.getElementById('shopChefLabPanel'),
    chefLabGrid: document.getElementById('chefLabGrid'),
    shopGarnetCount: document.getElementById('shopGarnetCount'),
    shopWildCount: document.getElementById('shopWildCount'),
    shopMaxRolls: document.getElementById('shopMaxRolls'),
    shopRedCount: document.getElementById('shopRedCount'),
    shopPowerLvl: document.getElementById('shopPowerLvl'),
    btnBuyWild: document.getElementById('btnBuyWild'),
    btnBuyReroll: document.getElementById('btnBuyReroll'),
    btnBuyDye: document.getElementById('btnBuyDye'),
    btnBuyPowerup: document.getElementById('btnBuyPowerup'),
    gameOverModal: document.getElementById('gameOverModal'),
    finalScoreDisplay: document.getElementById('finalScoreDisplay'),
    finalBreakdown: document.getElementById('finalBreakdown'),
    btnModalRestart: document.getElementById('btnModalRestart'),
    btnViewLeaderboardFromOver: document.getElementById('btnViewLeaderboardFromOver'),
    rankingPlayerName: document.getElementById('rankingPlayerName'),
    btnSaveRanking: document.getElementById('btnSaveRanking'),
    rankingRegisteredMsg: document.getElementById('rankingRegisteredMsg'),
    rankingRegisterBox: document.getElementById('rankingRegisterBox'),
    // 명예의 전당 (랭킹 모달)
    btnOpenLeaderboard: document.getElementById('btnOpenLeaderboard'),
    leaderboardModal: document.getElementById('leaderboardModal'),
    btnCloseLeaderboard: document.getElementById('btnCloseLeaderboard'),
    btnClearLeaderboard: document.getElementById('btnClearLeaderboard'),
    leaderboardBody: document.getElementById('leaderboardBody'),
    emptyLeaderboard: document.getElementById('emptyLeaderboard')
  },

  initScoreSheet() {
    // 스코어보드의 17대 족보 테이블 행을 동적으로 초기화합니다.
    this.dom.upperBody.innerHTML = '';
    this.dom.lowerBody.innerHTML = '';

    const isPvP = (typeof ModeManager !== 'undefined' && ModeManager.currentMode === 'pvp');

    CATEGORIES.forEach(cat => {
      const tr = document.createElement('tr');
      tr.className = `score-row row-${cat.id}`;
      tr.id = `row_${cat.id}`;

      tr.innerHTML = `
        <td class="cat-col">
          <span class="cat-name">${cat.name}</span>
          <span class="best-badge" id="badge_${cat.id}" style="display: none;">⭐ 추천!</span>
        </td>
        <td class="cat-desc">${cat.desc}</td>
        <td class="cat-score col-p1" id="score_${cat.id}">-</td>
        <td class="cat-score col-p2" id="score_p2_${cat.id}" style="${isPvP ? '' : 'display: none;'}">-</td>
      `;

      tr.addEventListener('click', () => {
        if (!tr.classList.contains('locked') && tr.classList.contains('selectable')) {
          if (typeof ModeManager !== 'undefined' && ModeManager.currentMode === 'pvp') {
            PvPGame.selectCategory(cat.id);
          } else if (typeof ModeManager !== 'undefined' && ModeManager.currentMode === 'adventure') {
            AdventureGame.selectCategory(cat.id);
          } else {
            Game.selectCategory(cat.id);
          }
        }
      });

      if (cat.section === 'upper') {
        this.dom.upperBody.appendChild(tr);
      } else {
        this.dom.lowerBody.appendChild(tr);
      }
    });

    if (isPvP) {
      this.updatePvPTableHeaders();
    }
  },

  updatePvPTableHeaders() {
    // 1vs1 대전 모드에서 내 역할과 상대 역할에 맞추어 스코어 테이블 헤더 명찰을 선명하게 렌더링합니다.
    if (!this.dom.thUpperP1 || !this.dom.thUpperP2 || !this.dom.thLowerP1 || !this.dom.thLowerP2) return;
    if (typeof ModeManager === 'undefined' || ModeManager.currentMode !== 'pvp') return;

    const isOnline = (typeof PvPGame !== 'undefined' && PvPGame.isOnline);
    const isAi = (typeof PvPGame !== 'undefined' && PvPGame.isAi);
    const myRole = (typeof PvPGame !== 'undefined') ? PvPGame.myRole : 'p1';
    const isMeP1 = (isOnline ? myRole === 'p1' : true);
    const isMeP2 = (isOnline ? myRole === 'p2' : false);

    let p1Text = '';
    let p2Text = '';

    if (isOnline) {
      const myNick = (PvPGame && PvPGame.myNickname) ? PvPGame.myNickname : '나';
      const oppNick = (PvPGame && PvPGame.opponentNickname) ? PvPGame.opponentNickname : '상대';
      p1Text = isMeP1 ? `🔴 ${myNick} (나) ⭐` : `🔴 ${oppNick} (상대)`;
      p2Text = isMeP2 ? `🔵 ${myNick} (나) ⭐` : `🔵 ${oppNick} (상대)`;
    } else if (isAi) {
      p1Text = `🔴 ${PvPGame.myNickname || '나'} (나) ⭐`;
      p2Text = '🐊 악어 AI 봇';
    } else {
      p1Text = '🔴 Player 1';
      p2Text = '🔵 Player 2';
    }

    const p1Html = `<span class="pvp-th-badge p1 ${isMeP1 ? 'is-me' : ''}">${p1Text}</span>`;
    const p2Html = `<span class="pvp-th-badge p2 ${isMeP2 ? 'is-me' : ''}">${p2Text}</span>`;

    this.dom.thUpperP1.innerHTML = p1Html;
    this.dom.thLowerP1.innerHTML = p1Html;
    this.dom.thUpperP2.innerHTML = p2Html;
    this.dom.thLowerP2.innerHTML = p2Html;
  },

  updateHeader() {
    // 현재 활성화된 모드에 따라 헤더 및 상단 상태 표시줄을 갱신합니다.
    if (typeof ModeManager === 'undefined') return;

    if (ModeManager.currentMode === 'solo') {
      this.dom.round.textContent = Math.min(Game.round, Game.totalRounds);
      if (this.dom.garnetCount) {
        this.dom.garnetCount.textContent = `🔴 ${Game.garnets}`;
      }
      
      let upperSum = 0;
      CATEGORIES.filter(c => c.section === 'upper').forEach(c => {
        if (Game.scores[c.id] !== undefined) upperSum += Game.scores[c.id];
      });

      const hasBonus = upperSum >= 63;
      const bonus = hasBonus ? 35 : 0;
      this.dom.upperSubtotal.textContent = `${upperSum} / 63`;
      this.dom.upperBonus.textContent = hasBonus ? '+35 (달성!)' : '0';

      let totalSum = upperSum + bonus;
      CATEGORIES.filter(c => c.section === 'lower').forEach(c => {
        if (Game.scores[c.id] !== undefined) totalSum += Game.scores[c.id];
      });

      this.dom.totalScore.textContent = totalSum;
    } else if (ModeManager.currentMode === 'pvp') {
      PvPGame.updatePvPStatus();
    } else if (ModeManager.currentMode === 'adventure') {
      AdventureGame.updateAdventureUI();
    }
  },

  updatePoolText() {
    // 남은 주머니 주사위 구성을 텍스트로 보여줍니다.
    const curGame = (typeof ModeManager !== 'undefined') ? ModeManager.getCurrentGame() : Game;
    const d = curGame.deck;
    this.dom.poolStatusText.textContent = `주머니: 🔴 빨강 ${d.redCount}개 | ⚫ 검정 ${d.blackCount}개 | 🌟 특수 ${d.wildCount}개`;
  },

  updateRollControls() {
    // 남은 굴리기 횟수 도트 표시 및 굴리기 버튼 상태를 현재 모드와 동기화합니다.
    const curGame = (typeof ModeManager !== 'undefined') ? ModeManager.getCurrentGame() : Game;
    const rollsLeft = curGame.rollsLeft;
    const maxRolls = curGame.maxRolls;
    const isFinished = (curGame.isGameOver || (curGame.round && curGame.round > curGame.totalRounds) || (curGame.turnsLeft !== undefined && curGame.turnsLeft <= 0));

    this.dom.rollsText.textContent = `${rollsLeft}회`;
    this.dom.rollDots.innerHTML = '';
    for (let i = 0; i < maxRolls; i++) {
      const dot = document.createElement('span');
      dot.className = `roll-dot ${i >= rollsLeft ? 'used' : ''}`;
      this.dom.rollDots.appendChild(dot);
    }

    const isPvPNotMyTurn = (typeof ModeManager !== 'undefined' && ModeManager.currentMode === 'pvp' && typeof PvPGame !== 'undefined' && !PvPGame.isMyTurn());

    if (rollsLeft > 0 && !isFinished) {
      if (isPvPNotMyTurn) {
        this.dom.btnRoll.disabled = true;
        this.dom.btnRoll.querySelector('.btn-text').textContent = '상대방 턴 진행 중...';
      } else {
        this.dom.btnRoll.disabled = false;
        this.dom.btnRoll.querySelector('.btn-text').textContent = 
          rollsLeft === maxRolls ? '🎲 주사위 5개 뽑고 굴리기' : `🎲 다시 굴리기 (${rollsLeft}회 남음)`;
      }
    } else {
      this.dom.btnRoll.disabled = true;
      if (isPvPNotMyTurn) {
        this.dom.btnRoll.querySelector('.btn-text').textContent = '상대방 턴 진행 중...';
      } else {
        this.dom.btnRoll.querySelector('.btn-text').textContent = isFinished ? '게임 종료!' : '우측에서 점수를 기록하세요!';
      }
    }
  },

  updateStepGuide(stepNum) {
    // 3단계 초보자 가이드 바 중 현재 진행 중인 스텝을 하이라이트합니다.
    this.dom.guideStep1.className = `guide-step ${stepNum === 1 ? 'active' : ''}`;
    this.dom.guideStep2.className = `guide-step ${stepNum === 2 ? 'active' : ''}`;
    this.dom.guideStep3.className = `guide-step ${stepNum === 3 ? 'active' : ''}`;
  },

  setNotice(msg) {
    // 주사위 테이블 하단 안내 메시지 박스의 내용을 변경합니다.
    this.dom.notice.textContent = msg;
  },

  setRollingAnimation(isRolling) {
    // 주사위 카드들에 흔들림 롤링 애니메이션 클래스를 적용하거나 해제합니다.
    document.querySelectorAll('.dice-card').forEach(el => {
      if (!el.classList.contains('kept')) {
        if (isRolling) el.classList.add('rolling');
        else el.classList.remove('rolling');
      }
    });
  },

  renderDice() {
    // 현재 5개의 주사위를 렌더링하고, 와일드카드 주사위에는 1클릭 인라인 미니 칩(1~6)을 직접 부착합니다.
    this.dom.activeDice.innerHTML = '';
    this.dom.keptDice.innerHTML = '';

    const curGame = (typeof ModeManager !== 'undefined') ? ModeManager.getCurrentGame() : Game;

    curGame.currentDice.forEach((die, index) => {
      const card = document.createElement('div');
      card.className = `dice-card ${die.color} ${die.isKept ? 'kept' : ''}`;
      card.title = die.isKept ? '클릭하여 고정 해제' : '클릭하여 고정(KEEP)';

      if (die.isKept) {
        const lockTag = document.createElement('span');
        lockTag.className = 'dice-lock-tag';
        lockTag.textContent = '🔒 고정';
        card.appendChild(lockTag);
      }

      if (die.isSpecial && die.value === '★') {
        const starBox = document.createElement('div');
        starBox.className = 'wild-star-display';
        starBox.innerHTML = `<span class="wild-star-icon">★</span><span class="wild-num-val">${die.wildChosen}</span>`;

        // 🌟 원클릭 인라인 미니 칩 (1~6 즉각 선택 및 점수판 실시간 동기화)
        const chipsWrap = document.createElement('div');
        chipsWrap.className = 'wild-inline-chips';
        chipsWrap.title = '원하는 눈금 숫자를 클릭하여 실시간 변경';
        for (let n = 1; n <= 6; n++) {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = `chip-btn ${die.wildChosen === n ? 'active' : ''}`;
          chip.textContent = n;
          chip.title = `눈금을 ${n}(으)로 즉시 변경`;
          chip.addEventListener('click', (e) => {
            e.stopPropagation(); // 카드 고정(Keep) 클릭 방지
            ModeManager.setWildValue(index, n);
          });
          chipsWrap.appendChild(chip);
        }

        card.appendChild(starBox);
        card.appendChild(chipsWrap);
      } else {
        card.appendChild(this.createPipGrid(die.value));
      }

      card.addEventListener('click', () => ModeManager.toggleKeep(index));

      if (die.isKept) {
        this.dom.keptDice.appendChild(card);
      } else {
        this.dom.activeDice.appendChild(card);
      }
    });
  },

  createPipGrid(val) {
    // 3x3 격자 그리드를 생성하여 주사위 눈금(Pip)을 정교하게 렌더링합니다.
    const grid = document.createElement('div');
    grid.className = 'pip-grid';
    const pipMaps = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    const activePips = pipMaps[val] || [];
    for (let i = 0; i < 9; i++) {
      const pip = document.createElement('div');
      pip.className = activePips.includes(i) ? 'pip' : 'pip empty';
      grid.appendChild(pip);
    }
    return grid;
  },

  updateScorePreviews() {
    // 현재 모드에 맞추어 족보 예상 점수를 계산하고 AI 최적 추천 뱃지를 붙입니다.
    const mode = (typeof ModeManager !== 'undefined') ? ModeManager.currentMode : 'solo';

    if (mode === 'solo') {
      if (Game.rollsLeft === Game.maxRolls || Game.currentDice.length === 0) return;
      const scores = Evaluator.calculateAll(Game.currentDice, Game.deck.powerupLevel);
      const bestCat = Evaluator.getBestCategory(Game.currentDice, Game.scores, Game.deck.powerupLevel);

      CATEGORIES.forEach(cat => {
        const row = document.getElementById(`row_${cat.id}`);
        const scoreCell = document.getElementById(`score_${cat.id}`);
        const badge = document.getElementById(`badge_${cat.id}`);

        if (Game.scores[cat.id] === undefined && row && scoreCell) {
          row.classList.add('selectable');
          const previewVal = scores[cat.id] || 0;
          scoreCell.textContent = `+${previewVal}`;
          scoreCell.classList.add('preview');

          if (cat.id === bestCat && previewVal > 0) {
            row.classList.add('is-best');
            if (badge) badge.style.display = 'inline-block';
          } else {
            row.classList.remove('is-best');
            if (badge) badge.style.display = 'none';
          }
        }
      });
    } else if (mode === 'pvp') {
      if (PvPGame.rollsLeft === PvPGame.maxRolls || PvPGame.currentDice.length === 0) return;
      const scores = Evaluator.calculateAll(PvPGame.currentDice, 0);
      const curScores = PvPGame.getCurrentPlayerScores();
      const bestCat = Evaluator.getBestCategory(PvPGame.currentDice, curScores, 0);
      const activeScoreId = PvPGame.currentPlayer === 1 ? 'score_' : 'score_p2_';

      CATEGORIES.forEach(cat => {
        const row = document.getElementById(`row_${cat.id}`);
        const scoreCell = document.getElementById(`${activeScoreId}${cat.id}`);
        const badge = document.getElementById(`badge_${cat.id}`);

        if (curScores[cat.id] === undefined && row && scoreCell) {
          row.classList.add('selectable');
          const previewVal = scores[cat.id] || 0;
          scoreCell.textContent = previewVal === 0 ? '+0' : `+${previewVal}`;
          scoreCell.classList.add('preview', 'active-preview');
          if (previewVal === 0) {
            scoreCell.classList.add('zero-preview');
          } else {
            scoreCell.classList.remove('zero-preview');
          }

          if (cat.id === bestCat && previewVal > 0) {
            row.classList.add('is-best');
            if (badge) badge.style.display = 'inline-block';
          } else {
            row.classList.remove('is-best');
            if (badge) badge.style.display = 'none';
          }
        }
      });
    } else if (mode === 'adventure') {
      if (AdventureGame.rollsLeft === AdventureGame.maxRolls || AdventureGame.currentDice.length === 0) return;
      const bestCat = AdventureGame.getBestCategory();

      CATEGORIES.forEach(cat => {
        const row = document.getElementById(`row_${cat.id}`);
        const scoreCell = document.getElementById(`score_${cat.id}`);
        const badge = document.getElementById(`badge_${cat.id}`);

        if (AdventureGame.scores[cat.id] === undefined && row && scoreCell) {
          row.classList.add('selectable');
          const dmg = AdventureGame.calculateCategoryDamage(cat.id);
          scoreCell.textContent = `💥 +${dmg}`;
          scoreCell.classList.add('preview');

          if (cat.id === bestCat && dmg > 0) {
            row.classList.add('is-best');
            if (badge) badge.style.display = 'inline-block';
          } else {
            row.classList.remove('is-best');
            if (badge) badge.style.display = 'none';
          }
        }
      });
    }
  },

  clearScorePreviews() {
    // 미기록 족보 칸들의 임시 점수 미리보기와 추천 뱃지를 지웁니다.
    const isPvP = (typeof ModeManager !== 'undefined' && ModeManager.currentMode === 'pvp');
    const p1Scores = isPvP ? PvPGame.p1Scores : (typeof ModeManager !== 'undefined' && ModeManager.currentMode === 'adventure' ? AdventureGame.scores : Game.scores);
    const p2Scores = isPvP ? PvPGame.p2Scores : {};

    CATEGORIES.forEach(cat => {
      const row = document.getElementById(`row_${cat.id}`);
      const scoreCell1 = document.getElementById(`score_${cat.id}`);
      const scoreCell2 = document.getElementById(`score_p2_${cat.id}`);
      const badge = document.getElementById(`badge_${cat.id}`);

      if (row) row.classList.remove('selectable', 'is-best');
      if (badge) badge.style.display = 'none';

      if (p1Scores[cat.id] === undefined && scoreCell1) {
        scoreCell1.textContent = '-';
        scoreCell1.classList.remove('preview', 'active-preview', 'zero-preview');
      }
      if (isPvP && p2Scores[cat.id] === undefined && scoreCell2) {
        scoreCell2.textContent = '-';
        scoreCell2.classList.remove('preview', 'active-preview', 'zero-preview');
      }
    });
  },

  renderLockedScores() {
    // 현재 모드에 따라 이미 확정 기록된 족보 칸들을 렌더링합니다.
    const mode = (typeof ModeManager !== 'undefined') ? ModeManager.currentMode : 'solo';

    if (mode === 'solo') {
      CATEGORIES.forEach(cat => {
        const row = document.getElementById(`row_${cat.id}`);
        const scoreCell = document.getElementById(`score_${cat.id}`);
        const badge = document.getElementById(`badge_${cat.id}`);
        if (!row || !scoreCell) return;

        if (Game.scores[cat.id] !== undefined) {
          row.classList.add('locked');
          row.classList.remove('selectable', 'is-best');
          if (badge) badge.style.display = 'none';
          scoreCell.textContent = Game.scores[cat.id];
          scoreCell.classList.remove('preview');
        } else {
          row.classList.remove('locked');
        }
      });
    } else if (mode === 'pvp') {
      const curPlayer = PvPGame.currentPlayer;

      // 1. 현재 턴 플레이어 열 하이라이트 & 대기 플레이어 열 딤 처리
      document.querySelectorAll('.col-p1').forEach(el => {
        if (curPlayer === 1) {
          el.classList.add('active-turn');
          el.classList.remove('inactive-turn');
        } else {
          el.classList.remove('active-turn');
          el.classList.add('inactive-turn');
        }
      });
      document.querySelectorAll('.col-p2').forEach(el => {
        if (curPlayer === 2) {
          el.classList.add('active-turn');
          el.classList.remove('inactive-turn');
        } else {
          el.classList.remove('active-turn');
          el.classList.add('inactive-turn');
        }
      });

      // 2. 테이블 헤더 명찰 최신화 (나 vs 상대)
      this.updatePvPTableHeaders();

      CATEGORIES.forEach(cat => {
        const row = document.getElementById(`row_${cat.id}`);
        const scoreCell1 = document.getElementById(`score_${cat.id}`);
        const scoreCell2 = document.getElementById(`score_p2_${cat.id}`);
        const badge = document.getElementById(`badge_${cat.id}`);
        if (!row) return;

        const p1Done = PvPGame.p1Scores[cat.id] !== undefined;
        const p2Done = PvPGame.p2Scores[cat.id] !== undefined;

        if (p1Done && scoreCell1) {
          const val1 = PvPGame.p1Scores[cat.id];
          scoreCell1.textContent = val1;
          scoreCell1.classList.remove('preview', 'active-preview', 'zero-preview');
          scoreCell1.classList.add('locked', 'p1-score');
          if (val1 === 0) scoreCell1.classList.add('zero-score');
          else scoreCell1.classList.remove('zero-score');
        } else if (scoreCell1) {
          scoreCell1.classList.remove('locked', 'p1-score', 'zero-score');
        }

        if (p2Done && scoreCell2) {
          const val2 = PvPGame.p2Scores[cat.id];
          scoreCell2.textContent = val2;
          scoreCell2.classList.remove('preview', 'active-preview', 'zero-preview');
          scoreCell2.classList.add('locked', 'p2-score');
          if (val2 === 0) scoreCell2.classList.add('zero-score');
          else scoreCell2.classList.remove('zero-score');
        } else if (scoreCell2) {
          scoreCell2.classList.remove('locked', 'p2-score', 'zero-score');
        }

        const isLockedForCur = (curPlayer === 1 ? p1Done : p2Done);
        if (isLockedForCur) {
          row.classList.add('locked');
          row.classList.remove('selectable', 'is-best');
          if (badge) badge.style.display = 'none';
        } else {
          row.classList.remove('locked');
        }
      });
    } else if (mode === 'adventure') {
      CATEGORIES.forEach(cat => {
        const row = document.getElementById(`row_${cat.id}`);
        const scoreCell = document.getElementById(`score_${cat.id}`);
        const badge = document.getElementById(`badge_${cat.id}`);
        if (!row || !scoreCell) return;

        if (AdventureGame.scores[cat.id] !== undefined) {
          row.classList.add('locked');
          row.classList.remove('selectable', 'is-best');
          if (badge) badge.style.display = 'none';
          scoreCell.textContent = `${AdventureGame.scores[cat.id]} DMG`;
          scoreCell.classList.remove('preview');
        } else {
          row.classList.remove('locked');
        }
      });
    }
  },

  // ---------------- 업적 UI ----------------
  openAchievementModal() {
    // 업적 목록 모달을 열고 최신 클리어 상태를 화면에 반영합니다.
    this.renderAchievements();
    this.dom.achievementModal.classList.add('active');
  },

  closeAchievementModal() {
    // 업적 목록 모달을 닫습니다.
    this.dom.achievementModal.classList.remove('active');
  },

  renderAchievements() {
    // 13종의 업적 카드들을 렌더링하고 달성 여부 및 보상 태그를 표시합니다.
    const list = this.dom.achievementList;
    if (!list) return;
    list.innerHTML = '';
    const unlockedIds = AchievementManager.unlockedIds;
    let unlockedCount = 0;

    ACHIEVEMENTS_DATA.forEach(ach => {
      const isDone = unlockedIds.has(ach.id);
      if (isDone) unlockedCount++;

      const card = document.createElement('div');
      card.className = `achievement-card ${isDone ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="ach-icon">${ach.icon}</div>
        <div class="ach-info">
          <div class="ach-title">${ach.title}</div>
          <div class="ach-desc">${ach.desc}</div>
        </div>
        <div class="ach-right">
          <div class="ach-reward-tag">🔴 +${ach.reward} 가넷</div>
          <div class="ach-status-badge ${isDone ? 'completed' : 'locked'}">
            ${isDone ? '✅ 달성 완료' : '🔒 미달성'}
          </div>
        </div>
      `;
      list.appendChild(card);
    });

    if (this.dom.achievementProgressText) {
      this.dom.achievementProgressText.textContent = `${unlockedCount} / ${ACHIEVEMENTS_DATA.length}`;
    }
  },

  showToast(ach) {
    // 화면 우상단에 화려한 업적 달성 토스트 알림을 띄우고 3.5초 뒤 자동 제거합니다.
    const container = this.dom.toastContainer || document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-achievement';
    toast.innerHTML = `
      <div class="toast-icon">${ach.icon}</div>
      <div class="toast-body">
        <div class="toast-badge">🏆 업적 달성!</div>
        <div class="toast-title">${ach.title}</div>
        <div class="toast-reward">+${ach.reward} 가넷 🔴 획득!</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        if (toast.remove) toast.remove();
        else if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 3500);
  },

  // ---------------- HoYatch 상점 및 셰프 연구소 UI ----------------
  updateGarnetDisplay() {
    // 모든 화면(헤더, 상점 등)의 가넷 보유량을 일괄 갱신합니다.
    const total = STORAGE.getGarnets();
    if (typeof Game !== 'undefined' && Game.garnets !== undefined) Game.garnets = total;
    if (this.dom.garnetCount) this.dom.garnetCount.textContent = `🔴 ${total}`;
    if (this.dom.shopGarnetCount) this.dom.shopGarnetCount.textContent = `🔴 ${total}`;
  },

  switchShopTab(tabName) {
    // 일반 상점과 셰프 연구소(모험 모드 영구 특성) 탭을 전환합니다.
    if (tabName === 'cheflab') {
      if (this.dom.tabShopChefLab) this.dom.tabShopChefLab.classList.add('active');
      if (this.dom.tabShopStandard) this.dom.tabShopStandard.classList.remove('active');
      if (this.dom.shopChefLabPanel) this.dom.shopChefLabPanel.style.display = 'block';
      if (this.dom.shopStandardPanel) this.dom.shopStandardPanel.style.display = 'none';
      this.renderChefLab();
    } else {
      if (this.dom.tabShopStandard) this.dom.tabShopStandard.classList.add('active');
      if (this.dom.tabShopChefLab) this.dom.tabShopChefLab.classList.remove('active');
      if (this.dom.shopStandardPanel) this.dom.shopStandardPanel.style.display = 'block';
      if (this.dom.shopChefLabPanel) this.dom.shopChefLabPanel.style.display = 'none';
      this.updateShopModal();
    }
  },

  openShopModal(defaultTab = 'standard') {
    // 가넷 상점 모달을 열고 지정된 탭을 활성화합니다.
    this.updateShopModal();
    this.switchShopTab(defaultTab);
    this.dom.shopModal.classList.add('active');
  },

  closeShopModal() {
    // 가넷 상점 모달을 닫습니다.
    this.dom.shopModal.classList.remove('active');
  },

  updateShopModal() {
    // 일반 상점 패널 내부의 수치 및 구매 가능 상태를 갱신합니다.
    const total = STORAGE.getGarnets();
    if (this.dom.shopGarnetCount) {
      this.dom.shopGarnetCount.textContent = `🔴 ${total}`;
    }
    const d = Game.deck;
    if (this.dom.shopWildCount) this.dom.shopWildCount.textContent = d.wildCount;
    if (this.dom.shopMaxRolls) this.dom.shopMaxRolls.textContent = Game.maxRolls;
    if (this.dom.shopRedCount) this.dom.shopRedCount.textContent = d.redCount;
    if (this.dom.shopPowerLvl) this.dom.shopPowerLvl.textContent = d.powerupLevel;

    if (this.dom.btnBuyWild) this.dom.btnBuyWild.disabled = (total < 40 || d.wildCount >= 3);
    if (this.dom.btnBuyReroll) this.dom.btnBuyReroll.disabled = (total < 50 || Game.maxRolls >= 5);
    if (this.dom.btnBuyDye) this.dom.btnBuyDye.disabled = (total < 30 || d.blackCount <= 0);
    if (this.dom.btnBuyPowerup) this.dom.btnBuyPowerup.disabled = (total < 35);
  },

  renderChefLab() {
    // 셰프 연구소 영구 특성 5종의 카드와 구매 버튼을 렌더링합니다.
    if (!this.dom.chefLabGrid) return;
    const perks = ChefLabManager.getPerks();
    const currentGarnets = STORAGE.getGarnets();
    this.dom.chefLabGrid.innerHTML = '';

    CHEF_PERKS_DATA.forEach(perk => {
      const currentLvl = perks[perk.id] || 0;
      const isMax = currentLvl >= perk.maxLevel;
      const canAfford = currentGarnets >= perk.cost;

      const card = document.createElement('div');
      card.className = `chef-perk-card ${isMax ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="perk-header">
          <span class="perk-icon">${perk.icon}</span>
          <div class="perk-titles">
            <strong class="perk-name">${perk.name}</strong>
            <span class="perk-status">${isMax ? '✅ 연구 완료 (영구 적용)' : `Lv.${currentLvl} / ${perk.maxLevel}`}</span>
          </div>
        </div>
        <p class="perk-desc">${perk.desc}</p>
        <div class="perk-action">
          <span class="perk-cost">${isMax ? '최고 레벨' : `🔴 ${perk.cost} 가넷`}</span>
          <button class="btn-buy-perk" ${isMax || !canAfford ? 'disabled' : ''}>
            ${isMax ? '연구 완료' : '연구하기'}
          </button>
        </div>
      `;

      const btn = card.querySelector('.btn-buy-perk');
      if (btn && !isMax) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          ChefLabManager.buyPerk(perk.id);
        });
      }
      this.dom.chefLabGrid.appendChild(card);
    });
  },

  openWildModal(currentVal = 6, activeIndex = 0) {
    // 와일드 주사위가 굴려졌거나 눈금 변경 요청 시 숫자 선택 모달을 엽니다.
    document.querySelectorAll('.btn-wild-choice').forEach(btn => {
      const val = parseInt(btn.getAttribute('data-val'), 10);
      if (val === currentVal) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
    this.dom.wildModal.classList.add('active');
  },

  closeWildModal() {
    // 와일드 주사위 숫자 선택 모달을 닫습니다.
    this.dom.wildModal.classList.remove('active');
  },

  openPvpMatchModal() {
    // 1:1 온라인 대전 매칭 모달을 열고 빠른 매칭 탭과 초기 UI 상태를 준비합니다.
    if (this.dom.pvpMatchModal) {
      this.setPvpQueueUI('initial');
      this.switchPvpTab('quick');
      this.dom.pvpMatchModal.classList.add('active');
    }
  },

  closePvpMatchModal() {
    // 1:1 온라인 대전 매칭 모달을 닫고 진행 중이던 매칭 대기열을 취소합니다.
    if (this.dom.pvpMatchModal) {
      this.dom.pvpMatchModal.classList.remove('active');
    }
    PvPOnlineManager.cancelQueue();
  },

  setPvpQueueUI(state) {
    // 빠른 매칭 대기 상태에 따라 탐색 레이더 애니메이션을 토글합니다.
    if (this.dom.pvpQueueInitial && this.dom.pvpQueueSearching) {
      if (state === 'searching') {
        this.dom.pvpQueueInitial.style.display = 'none';
        this.dom.pvpQueueSearching.style.display = 'block';
      } else {
        this.dom.pvpQueueInitial.style.display = 'block';
        this.dom.pvpQueueSearching.style.display = 'none';
      }
    }
  },

  switchPvpTab(tabName) {
    // 빠른 매칭 패널과 친구 초대 방 코드 패널 간의 탭을 전환합니다.
    if (this.dom.tabPvpQuick && this.dom.tabPvpCustom && this.dom.panelPvpQuick && this.dom.panelPvpCustom) {
      if (tabName === 'quick') {
        this.dom.tabPvpQuick.classList.add('active');
        this.dom.tabPvpCustom.classList.remove('active');
        this.dom.panelPvpQuick.style.display = 'block';
        this.dom.panelPvpCustom.style.display = 'none';
      } else {
        this.dom.tabPvpQuick.classList.remove('active');
        this.dom.tabPvpCustom.classList.add('active');
        this.dom.panelPvpQuick.style.display = 'none';
        this.dom.panelPvpCustom.style.display = 'block';
      }
    }
  },

  openHelpModal() {
    // 30초 룰북 모달을 엽니다.
    this.dom.helpModal.classList.add('active');
  },

  closeHelpModal() {
    // 30초 룰북 모달을 닫습니다.
    this.dom.helpModal.classList.remove('active');
  },

  showGameOverModal(summary) {
    // 17라운드 완주 후 최종 성적표와 보유 가넷 요약을 보여주고 랭킹 등록을 활성화합니다.
    const s = summary || Game.lastGameSummary || { finalTotal: 0, upperSum: 0, bonus: 0, lowerSum: 0 };
    this.dom.finalScoreDisplay.textContent = `${s.finalTotal}점`;
    this.dom.finalBreakdown.innerHTML = `
      <div><strong>• 상단 점수:</strong> ${s.upperSum}점 ${s.bonus > 0 ? '(+35점 보너스 달성!)' : '(보너스 미달성)'}</div>
      <div>• 하단 족보 점수: ${s.lowerSum}점</div>
      <div>• 최종 보유 가넷: 🔴 ${Game.garnets}개</div>
      <div>• 플러시(70점): ${Game.scores['flush'] > 0 ? '✅ 달성' : '❌ 미달성'}</div>
      <div>• 스트레이트 플러시(100점): ${Game.scores['str_flush'] > 0 ? '⚡ 달성!' : '❌ 미달성'}</div>
      <div>• 파이브카드 플러시(200점): ${Game.scores['five_plus'] > 0 ? '👑 전설 잭팟 달성!' : '❌ 미달성'}</div>
    `;

    // 랭킹 등록 영역 상태 초기화
    if (this.dom.btnSaveRanking) {
      this.dom.btnSaveRanking.disabled = false;
      this.dom.btnSaveRanking.textContent = '🏆 랭킹 등록';
    }
    if (this.dom.rankingRegisteredMsg && this.dom.rankingRegisteredMsg.style) {
      this.dom.rankingRegisteredMsg.style.display = 'none';
    }
    if (this.dom.rankingPlayerName) {
      try {
        const savedName = localStorage.getItem('hell_poker_player_name') || '도전자';
        this.dom.rankingPlayerName.value = savedName;
      } catch (e) {}
    }

    this.dom.gameOverModal.classList.add('active');
  },

  onRankingRegistered() {
    // 랭킹 등록 완료 상태를 화면에 표시하고 명예의 전당 모달을 엽니다.
    if (this.dom.btnSaveRanking) {
      this.dom.btnSaveRanking.disabled = true;
      this.dom.btnSaveRanking.textContent = '등록 완료 ✅';
    }
    if (this.dom.rankingRegisteredMsg && this.dom.rankingRegisteredMsg.style) {
      this.dom.rankingRegisteredMsg.style.display = 'block';
    }
    if (this.dom.rankingPlayerName) {
      try {
        localStorage.setItem('hell_poker_player_name', this.dom.rankingPlayerName.value.trim());
      } catch (e) {}
    }
    setTimeout(() => {
      this.openLeaderboardModal();
    }, 600);
  },

  // ---------------- 명예의 전당 UI ----------------
  async openLeaderboardModal() {
    // 명예의 전당 모달을 열고 최신 랭킹 순위표를 렌더링합니다.
    await LeaderboardManager.fetchFromDB();
    this.renderLeaderboard();
    this.dom.leaderboardModal.classList.add('active');
  },

  closeLeaderboardModal() {
    // 명예의 전당 모달을 닫습니다.
    this.dom.leaderboardModal.classList.remove('active');
  },

  renderLeaderboard() {
    // 저장된 탑 10 랭킹 목록을 순위별로 테이블에 렌더링합니다.
    const tbody = this.dom.leaderboardBody;
    const emptyEl = this.dom.emptyLeaderboard;
    if (!tbody) return;
    tbody.innerHTML = '';

    const list = LeaderboardManager.getTopList();
    if (!list || list.length === 0) {
      if (emptyEl && emptyEl.style) emptyEl.style.display = 'block';
      return;
    }
    if (emptyEl && emptyEl.style) emptyEl.style.display = 'none';

    list.forEach((entry, idx) => {
      const tr = document.createElement('tr');
      const rank = idx + 1;
      let rankBadgeHtml = `${rank}`;
      let rowClass = '';

      if (rank === 1) {
        rankBadgeHtml = '🥇';
        rowClass = 'rank-1';
      } else if (rank === 2) {
        rankBadgeHtml = '🥈';
        rowClass = 'rank-2';
      } else if (rank === 3) {
        rankBadgeHtml = '🥉';
        rowClass = 'rank-3';
      }

      tr.className = rowClass;
      tr.innerHTML = `
        <td><span class="rank-badge ${rank <= 3 ? 'top-' + rank : ''}">${rankBadgeHtml}</span></td>
        <td class="player-name-cell"><strong>${entry.name}</strong></td>
        <td class="score-highlight-cell">${entry.score}점</td>
        <td><span class="combo-tag">${entry.combos}</span></td>
        <td class="garnet-cell">🔴 ${entry.garnets}</td>
        <td class="date-cell">${entry.date}</td>
      `;
      tbody.appendChild(tr);
    });
  },

  closeGameOverModal() {
    // 게임 종료 결과 모달을 닫습니다.
    this.dom.gameOverModal.classList.remove('active');
  }
};

// -------------------------------------------------------------
// 9. 이벤트 바인딩 및 부트스트랩
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 기본 모드: 솔로 클래식 모드로 시작
  ModeManager.setMode('solo');

  // 주사위 굴리기 (현재 모드 디스패치)
  if (UI.dom.btnRoll) {
    UI.dom.btnRoll.addEventListener('click', () => ModeManager.roll());
  }

  // 게임 재시작 버튼 (현재 모드 디스패치)
  if (UI.dom.btnReset) {
    UI.dom.btnReset.addEventListener('click', () => {
      const modeName = ModeManager.currentMode === 'pvp' ? '1vs1 대전' : (ModeManager.currentMode === 'adventure' ? '악어 보스 디펜스' : '솔로');
      if (confirm(`[${modeName}] 게임을 새로 시작하시겠습니까? (현재 판의 점수가 초기화되며, 획득한 가넷과 업적은 보존됩니다)`)) {
        if (ModeManager.currentMode === 'pvp') PvPGame.init();
        else if (ModeManager.currentMode === 'adventure') AdventureGame.init();
        else Game.init();
      }
    });
  }

  // ---------------- 메인 로비 (모드 선택 허브) ----------------
  if (UI.dom.btnGoLobby) {
    UI.dom.btnGoLobby.addEventListener('click', () => ModeManager.openLobby());
  }
  if (UI.dom.btnCloseLobby) {
    UI.dom.btnCloseLobby.addEventListener('click', () => ModeManager.closeLobby());
  }
  if (UI.dom.btnSelectSolo) {
    UI.dom.btnSelectSolo.addEventListener('click', () => ModeManager.setMode('solo'));
  }
  if (UI.dom.btnSelectPvP) {
    UI.dom.btnSelectPvP.addEventListener('click', () => {
      ModeManager.closeLobby();
      UI.openPvpMatchModal();
    });
  }
  if (UI.dom.btnSelectAdventure) {
    UI.dom.btnSelectAdventure.addEventListener('click', () => ModeManager.setMode('adventure'));
  }

  // ---------------- 1vs1 온라인 매칭 모달 이벤트 ----------------
  if (UI.dom.btnClosePvpMatch) {
    UI.dom.btnClosePvpMatch.addEventListener('click', () => UI.closePvpMatchModal());
  }
  if (UI.dom.tabPvpQuick) {
    UI.dom.tabPvpQuick.addEventListener('click', () => UI.switchPvpTab('quick'));
  }
  if (UI.dom.tabPvpCustom) {
    UI.dom.tabPvpCustom.addEventListener('click', () => UI.switchPvpTab('custom'));
  }
  if (UI.dom.btnStartQuickMatch) {
    UI.dom.btnStartQuickMatch.addEventListener('click', () => {
      const nick = UI.dom.pvpNicknameInput ? UI.dom.pvpNicknameInput.value.trim() : '늪지대 악어';
      PvPOnlineManager.startQuickMatch(nick);
    });
  }
  if (UI.dom.btnCancelQueue) {
    UI.dom.btnCancelQueue.addEventListener('click', () => PvPOnlineManager.cancelQueue());
  }
  if (UI.dom.btnPlayWithAiBot) {
    UI.dom.btnPlayWithAiBot.addEventListener('click', () => {
      const nick = UI.dom.pvpNicknameInput ? UI.dom.pvpNicknameInput.value.trim() : '늪지대 악어';
      PvPOnlineManager.cancelQueue();
      PvPGame.startAiMatch(nick);
    });
  }
  if (UI.dom.btnCreateCustomRoom) {
    UI.dom.btnCreateCustomRoom.addEventListener('click', () => {
      const nick = UI.dom.pvpNicknameInput ? UI.dom.pvpNicknameInput.value.trim() : '늪지대 악어';
      PvPOnlineManager.createCustomRoom(nick);
    });
  }
  if (UI.dom.btnJoinCustomRoom) {
    UI.dom.btnJoinCustomRoom.addEventListener('click', () => {
      const code = UI.dom.inputJoinRoomCode ? UI.dom.inputJoinRoomCode.value.trim() : '';
      const nick = UI.dom.pvpNicknameInput ? UI.dom.pvpNicknameInput.value.trim() : '늪지대 악어';
      PvPOnlineManager.joinCustomRoom(code, nick);
    });
  }

  // ---------------- 1vs1 대전 결과 모달 버튼 ----------------
  if (UI.dom.btnPvpRestart) {
    UI.dom.btnPvpRestart.addEventListener('click', () => {
      UI.dom.pvpGameOverModal.classList.remove('active');
      if (PvPGame.isAi) {
        PvPGame.startAiMatch(PvPGame.myNickname);
      } else if (PvPGame.isOnline) {
        UI.openPvpMatchModal();
      } else {
        PvPGame.init();
      }
    });
  }
  if (UI.dom.btnPvpGoLobby) {
    UI.dom.btnPvpGoLobby.addEventListener('click', () => {
      UI.dom.pvpGameOverModal.classList.remove('active');
      ModeManager.openLobby();
    });
  }

  // ---------------- 헬포커 모험 결과 모달 버튼 ----------------
  if (UI.dom.btnAdvRestart) {
    UI.dom.btnAdvRestart.addEventListener('click', () => {
      UI.dom.advGameOverModal.classList.remove('active');
      AdventureGame.init();
    });
  }
  if (UI.dom.btnAdvGoLobby) {
    UI.dom.btnAdvGoLobby.addEventListener('click', () => {
      UI.dom.advGameOverModal.classList.remove('active');
      ModeManager.openLobby();
    });
  }

  // ---------------- 상점 및 셰프 연구소 모달 열기/닫기/탭 전환 ----------------
  if (UI.dom.btnOpenShop) {
    UI.dom.btnOpenShop.addEventListener('click', () => UI.openShopModal('standard'));
  }
  if (UI.dom.btnCloseShop) {
    UI.dom.btnCloseShop.addEventListener('click', () => UI.closeShopModal());
  }
  if (UI.dom.tabShopStandard) {
    UI.dom.tabShopStandard.addEventListener('click', () => UI.switchShopTab('standard'));
  }
  if (UI.dom.tabShopChefLab) {
    UI.dom.tabShopChefLab.addEventListener('click', () => UI.switchShopTab('cheflab'));
  }
  if (UI.dom.btnOpenChefLabFromLobby) {
    UI.dom.btnOpenChefLabFromLobby.addEventListener('click', () => {
      UI.closeLobbyModal();
      UI.openShopModal('cheflab');
    });
  }

  // ---------------- 모험 모드 전리품 유물 리롤 ----------------
  if (UI.dom.btnRerollRelics) {
    UI.dom.btnRerollRelics.addEventListener('click', () => AdventureGame.rerollRelics());
  }

  // ---------------- 업적 모달 열기/닫기 ----------------
  if (UI.dom.btnOpenAchievements) {
    UI.dom.btnOpenAchievements.addEventListener('click', () => UI.openAchievementModal());
  }
  if (UI.dom.btnCloseAchievements) {
    UI.dom.btnCloseAchievements.addEventListener('click', () => UI.closeAchievementModal());
  }

  // ---------------- 명예의 전당 모달 열기/닫기/초기화 ----------------
  if (UI.dom.btnOpenLeaderboard) {
    UI.dom.btnOpenLeaderboard.addEventListener('click', () => UI.openLeaderboardModal());
  }
  if (UI.dom.btnCloseLeaderboard) {
    UI.dom.btnCloseLeaderboard.addEventListener('click', () => UI.closeLeaderboardModal());
  }
  if (UI.dom.btnClearLeaderboard) {
    UI.dom.btnClearLeaderboard.addEventListener('click', async () => {
      if (confirm('명예의 전당 랭킹 기록을 모두 초기화하시겠습니까?')) {
        await LeaderboardManager.clear();
        UI.renderLeaderboard();
      }
    });
  }
  if (UI.dom.btnViewLeaderboardFromOver) {
    UI.dom.btnViewLeaderboardFromOver.addEventListener('click', () => {
      UI.closeGameOverModal();
      UI.openLeaderboardModal();
    });
  }

  // ---------------- 랭킹 등록 버튼 ----------------
  if (UI.dom.btnSaveRanking) {
    UI.dom.btnSaveRanking.addEventListener('click', async () => {
      const name = UI.dom.rankingPlayerName ? UI.dom.rankingPlayerName.value : '도전자';
      await Game.saveRanking(name);
    });
  }

  // ---------------- 상점 아이템 구매 ----------------
  if (UI.dom.btnBuyWild) UI.dom.btnBuyWild.addEventListener('click', () => Game.buyWild());
  if (UI.dom.btnBuyReroll) UI.dom.btnBuyReroll.addEventListener('click', () => Game.buyReroll());
  if (UI.dom.btnBuyDye) UI.dom.btnBuyDye.addEventListener('click', () => Game.buyDye());
  if (UI.dom.btnBuyPowerup) UI.dom.btnBuyPowerup.addEventListener('click', () => Game.buyPowerup());

  // ---------------- 룰북 모달 ----------------
  if (UI.dom.btnHelp) UI.dom.btnHelp.addEventListener('click', () => UI.openHelpModal());
  if (UI.dom.btnCloseHelp) UI.dom.btnCloseHelp.addEventListener('click', () => UI.closeHelpModal());

  // ---------------- 와일드 모달 닫기 ----------------
  if (UI.dom.btnCloseWild) {
    UI.dom.btnCloseWild.addEventListener('click', () => UI.closeWildModal());
  }

  // ---------------- 모달 바깥 배경 클릭 시 닫기 ----------------
  [
    UI.dom.shopModal,
    UI.dom.helpModal,
    UI.dom.achievementModal,
    UI.dom.leaderboardModal,
    UI.dom.wildModal,
    UI.dom.lobbyModal,
    UI.dom.pvpMatchModal,
    UI.dom.pvpGameOverModal,
    UI.dom.advGameOverModal,
    UI.dom.diceDraftModal
  ].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          if (modal === UI.dom.pvpMatchModal) {
            PvPOnlineManager.cancelQueue();
          }
        }
      });
    }
  });

  // ---------------- 와일드 모달 1~6 버튼 ----------------
  document.querySelectorAll('.btn-wild-choice').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const val = parseInt(e.target.getAttribute('data-val'), 10);
      ModeManager.setWildValue(undefined, val);
      UI.closeWildModal();
    });
  });

  // ---------------- 솔로 모드 재도전 ----------------
  if (UI.dom.btnModalRestart) {
    UI.dom.btnModalRestart.addEventListener('click', () => {
      UI.closeGameOverModal();
      Game.init();
    });
  }

  // ---------------- 명예의 전당 SQLite DB 최신 랭킹 사전 동기화 ----------------
  LeaderboardManager.fetchFromDB();
});
