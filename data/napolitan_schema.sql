-- =========================================================================
-- 나폴리탄 규칙 괴담 & 인터랙티브 게임북 RDBMS 스키마 (napolitan_schema.sql)
-- 데이터베이스 엔진: SQLite 3.x
-- =========================================================================

PRAGMA foreign_keys = ON;

-- 1. 작품 마스터 테이블 (다작품 확장 지원)
CREATE TABLE IF NOT EXISTS works (
    work_id TEXT PRIMARY KEY,               -- 고유 식별자 (예: 'hwarang', 'subway', 'hospital')
    title TEXT NOT NULL,                    -- 작품명 (예: '화랑골 생활관 생존 수칙')
    subtitle TEXT,                          -- 부제 (예: '한국형 나폴리탄 텍스트 어드벤처')
    author TEXT DEFAULT '참수리 함장/당직사관',
    danger_level INTEGER DEFAULT 5,         -- 위험도 (1 ~ 5성)
    survival_rate TEXT DEFAULT '4.8%',      -- 예상 생존율
    play_time TEXT DEFAULT '15~25분',       -- 평균 플레이 시간
    description TEXT,                       -- 시놉시스 요약
    cover_image TEXT,                       -- 상대 경로 (예: images/iron_door_lock.jpg)
    cover_url TEXT,                         -- 외부 CDN 링크 (예: https://.../images/...)
    hub_url TEXT,                           -- 플레이어블 웹 Hub 링크 (예: https://.../gamebooks.html)
    status TEXT DEFAULT 'ACTIVE',           -- 상태 ('ACTIVE', 'COMING_SOON', 'LOCKED')
    created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

-- 2. 수칙 챕터/장 마스터 테이블
CREATE TABLE IF NOT EXISTS chapters (
    chapter_id INTEGER PRIMARY KEY AUTOINCREMENT,
    work_id TEXT NOT NULL,
    chapter_no INTEGER NOT NULL,            -- 장 번호 (1, 2, 3...)
    title TEXT NOT NULL,                    -- 장 제목 (예: '제1장: 야간 통금과 밤의 결계')
    curfew_time TEXT,                       -- 통금 시점 (예: '22:00 PM')
    summary TEXT,                           -- 해당 장 개요
    FOREIGN KEY (work_id) REFERENCES works(work_id) ON DELETE CASCADE,
    UNIQUE(work_id, chapter_no)
);

-- 3. 수칙 전문 (Rules) 테이블
CREATE TABLE IF NOT EXISTS rules (
    rule_id INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id INTEGER NOT NULL,
    rule_no INTEGER NOT NULL,               -- 수칙 번호 (1, 2, 3...)
    title TEXT NOT NULL,                    -- 수칙 요약 제목 (예: '복도의 마찰음에 대하여')
    danger_level TEXT DEFAULT 'NORMAL',     -- 'NORMAL', 'WARNING', 'FATAL'
    content TEXT NOT NULL,                  -- 수칙 본문 지침 내용
    evidence_audio TEXT,                    -- 효과음 상대 키/경로
    evidence_image TEXT,                    -- 증거 사진 상대 경로
    audio_url TEXT,                         -- 외부 CDN 음원 스트리밍 링크
    image_url TEXT,                         -- 외부 CDN 고해상도 이미지 링크
    FOREIGN KEY (chapter_id) REFERENCES chapters(chapter_id) ON DELETE CASCADE,
    UNIQUE(chapter_id, rule_no)
);

-- 4. 인터랙티브 게임북 스테이지 (Stages) 테이블
CREATE TABLE IF NOT EXISTS stages (
    stage_id TEXT PRIMARY KEY,              -- 스테이지 고유 키 (예: 'start', 'p1_search_frame')
    work_id TEXT NOT NULL,
    stage_title TEXT NOT NULL,              -- 스테이지 타이틀 (예: '【 제1막 : 22:00 폐쇄와 마찰음 】')
    time_str TEXT,                          -- 시점 (예: '22:00 PM')
    san_change INTEGER DEFAULT 0,           -- 넋(정신력) 변화치 (-20, +10)
    image_path TEXT,                        -- 상대 경로 (images/...)
    image_url TEXT,                         -- 외부 CDN 이미지 링크 (HTTPS)
    audio_key TEXT,                         -- 오디오 키
    audio_url TEXT,                         -- 외부 CDN 음원 스트리밍 링크 (HTTPS)
    secret_hint TEXT,                       -- 숨은 혈서 힌트 내용
    gain_item_json TEXT,                    -- 획득 아이템 JSON ({"id": "talisman", "name": "주사 부적", "icon": "📜"})
    body_text TEXT NOT NULL,                -- 상황 지문 HTML 본문
    is_ending INTEGER DEFAULT 0,            -- 엔딩 여부 (0: 진행 중, 1: 엔딩)
    ending_type TEXT,                       -- 'SURVIVAL', 'DEATH', 'MISSING', 'MADNESS'
    FOREIGN KEY (work_id) REFERENCES works(work_id) ON DELETE CASCADE
);

-- 5. 스테이지별 선택지 (Choices) 테이블
CREATE TABLE IF NOT EXISTS choices (
    choice_id INTEGER PRIMARY KEY AUTOINCREMENT,
    stage_id TEXT NOT NULL,
    choice_order INTEGER NOT NULL,          -- 선택지 번호 (1, 2, 3...)
    choice_text TEXT NOT NULL,              -- 선택지 지문
    next_stage_id TEXT NOT NULL,            -- 이동할 다음 스테이지 ID
    req_item TEXT,                          -- 필요 아이템 ID (선택 조건)
    san_condition INTEGER,                  -- 필요 넋 수치 조건 (옵션)
    FOREIGN KEY (stage_id) REFERENCES stages(stage_id) ON DELETE CASCADE
);

-- 인덱스 생성 (조회 속도 최적화)
CREATE INDEX IF NOT EXISTS idx_rules_chapter ON rules(chapter_id);
CREATE INDEX IF NOT EXISTS idx_stages_work ON stages(work_id);
CREATE INDEX IF NOT EXISTS idx_choices_stage ON choices(stage_id);

