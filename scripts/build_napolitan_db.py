"""
build_napolitan_db.py
화랑골 생활관 수칙 및 나폴리탄 게임북 시나리오를 SQLite3 RDBMS(napolitan.db)에 적재하고
웹 프론트엔드 연동용 JSON(rules.json, stages.json)을 내보내는 ETL 파이프라인
"""
import sqlite3
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "napolitan.db"
SCHEMA_PATH = DATA_DIR / "napolitan_schema.sql"
STAGES_JSON_PATH = DATA_DIR / "stages.json"
RULES_JSON_PATH = DATA_DIR / "rules.json"

CDN_BASE = "https://kimik11291129-maker.github.io"

def init_database():
    """스키마 SQL을 실행하여 테이블 구조를 초기화합니다."""
    print(f"[*] 데이터베이스 초기화: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema_sql = f.read()
    conn.executescript(schema_sql)
    conn.commit()
    conn.close()

def seed_works():
    """작품 마스터 데이터를 시딩합니다."""
    print("[*] 1. 작품 마스터(works) 적재")
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()

    works_data = [
        (
            "hwarang",
            "화랑골 생활관 생존 지침",
            "한국형 전통 오컬트 나폴리탄 인터랙티브 게임북",
            "참수리 함장 / 당직사관 편곡",
            5,
            "4.8%",
            "15~25분",
            "22시 정각, 철문이 잠기면 복도는 더 이상 사람만의 공간이 아닙니다. 13가지 금기를 지키고 06:30 아침 점호까지 온전히 살아남으십시오.",
            "images/iron_door_lock.jpg",
            f"{CDN_BASE}/images/iron_door_lock.jpg",
            f"{CDN_BASE}/gamebooks.html",
            "ACTIVE"
        ),
        (
            "subway",
            "심야 지하철 4호선 막차 수칙",
            "도심 괴담 나폴리탄 인터랙티브 게임북",
            "미스터리북(@MysteryBook3941) 레퍼런스",
            4,
            "12.3%",
            "10~15분",
            "자정이 넘은 시각, 남태령을 지나는 막차에서 절대 승객들의 눈을 마주치지 마십시오. 창문 블라인드가 내려간 칸은 존재하지 않는 칸입니다.",
            "images/creepy_corridor_night.jpg",
            f"{CDN_BASE}/images/creepy_corridor_night.jpg",
            f"{CDN_BASE}/gamebooks.html",
            "COMING_SOON"
        ),
        (
            "hospital",
            "폐쇄 병동 야간 당직 간호 지침",
            "밀실 메디컬 나폴리탄 규칙 괴담",
            "미스터리북(@MysteryBook3941) 레퍼런스",
            5,
            "7.1%",
            "15~20분",
            "404호 병실은 1998년 화재 이후 폐쇄되었습니다. 만약 404호의 호출 벨이 울리거든 벨 코드를 뽑고 뒤돌아보지 마십시오.",
            "images/companion_shadow.jpg",
            f"{CDN_BASE}/images/companion_shadow.jpg",
            f"{CDN_BASE}/gamebooks.html",
            "COMING_SOON"
        )
    ]

    cursor.executemany("""
        INSERT OR REPLACE INTO works 
        (work_id, title, subtitle, author, danger_level, survival_rate, play_time, description, cover_image, cover_url, hub_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, works_data)

    conn.commit()
    conn.close()

def parse_and_seed_rules():
    """about.html에서 13대 수칙 전문을 파싱하여 chapters 및 rules 테이블에 적재합니다."""
    print("[*] 2. 챕터 및 수칙 전문(chapters, rules) 적재")
    about_html_path = BASE_DIR / "about.html"
    
    with open(about_html_path, "r", encoding="utf-8") as f:
        html = f.read()

    # 13개 규칙 정형 데이터 세트
    rules_catalog = [
        # 제1장: 야간 통금과 밤의 결계 (Rules 1~5)
        {"chapter_no": 1, "chap_title": "제1장 · 야간 통금과 밤의 결계", "curfew": "22:00 PM", "rule_no": 1, "title": "복도의 마찰음에 대하여", "danger": "NORMAL", "audio": "scratch", "img": "images/iron_door_lock.jpg",
         "content": "22:00 이후, 호실 밖 복도에서 들려오는 모든 소리를 단순한 '건물 수축음'으로 분류하십시오. 발소리, 긁는 소리, 무거운 것을 질질 끄는 소리. 그것이 아무리 사람이나 짐승의 기척처럼 들리더라도, 당신에게는 반드시 '단순한 건물 수축음'이어야만 합니다. 의문을 품지 마십시오. 문을 열거나 문틈으로 내다보지 마십시오. 그것이 무엇인지 확인하려는 순간 — 당신이 확인당합니다."},
        {"chapter_no": 1, "chap_title": "제1장 · 야간 통금과 밤의 결계", "curfew": "22:00 PM", "rule_no": 2, "title": "순찰 무인의 놋쇠 호각", "danger": "NORMAL", "audio": "whistle", "img": "images/talisman.jpg",
         "content": "생활관 내 정식 순찰관은 반드시 놋쇠 호각을 휴대합니다. 호각의 날카로운 금속성 음파는 이곳의 모든 사칭과 흉내를 일시적으로 무력화합니다. 누군가 당신의 이름을 부르며 도움을 요청하거든, 먼저 귀를 기울이십시오. 놋쇠 호각 소리가 동반되지 않는 부름은, 부름이 아닙니다. 그것은 초대입니다. 절대 응하지 마십시오."},
        {"chapter_no": 1, "chap_title": "제1장 · 야간 통금과 밤의 결계", "curfew": "22:00 PM", "rule_no": 3, "title": "거울 속의 반 박자", "danger": "WARNING", "audio": None, "img": "images/creepy_corridor_night.jpg",
         "content": "세면대 거울 앞에 설 때, 반드시 자신의 동작을 주시하십시오. 거울 속 당신의 움직임이 반 박자 늦게 따라오거나, 어깨 너머로 존재하지 않아야 할 낡은 도포 자락이 비치거든 즉시 눈을 감으십시오. 고개를 돌리지 말고, 뒷걸음질로 거울에서 벗어나십시오. 거울은 이쪽에서 저쪽을 비추는 것이지만, 때때로 저쪽에서 이쪽을 들여다보는 창이 되기도 합니다."},
        {"chapter_no": 1, "chap_title": "제1장 · 야간 통금과 밤의 결계", "curfew": "22:00 PM", "rule_no": 4, "title": "방 안의 숫자를 세지 마라", "danger": "WARNING", "audio": None, "img": "images/companion_shadow.jpg",
         "content": "소등 후, 방 안의 인원 수를 절대로 소리 내어 세지 마십시오. 숨소리가 하나 더 많다고 느껴지더라도, 이불 속에서 기척이 하나 더 감지되더라도, 모르는 척하십시오. 숫자를 입 밖으로 내는 순간, 여분의 존재는 공식 인원으로 확정됩니다. 확정된 존재는 당신의 자리를 요구할 권리를 얻습니다."},
        {"chapter_no": 1, "chap_title": "제1장 · 야간 통금과 밤의 결계", "curfew": "22:00 PM", "rule_no": 5, "title": "붉은 경면주사의 결계", "danger": "NORMAL", "audio": None, "img": "images/talisman.jpg",
         "content": "모든 생활관 호실 출입문 상단에는 붉은 경면주사로 쓴 부적이 부착되어 있습니다. 이 부적의 글자가 번지거나 검게 변색되기 시작하면, 그 방의 결계 수명이 다해 가고 있다는 뜻입니다. 침대 밑에 비치된 결속선(흰 노끈)으로 문손잡이를 안쪽 침대 다리에 단단히 묶으십시오. 그것이 문을 열려고 당길 때 생기는 장력은 당신의 침착함으로만 버텨낼 수 있습니다."},

        # 제2장: 복도 통행 및 금기 사항 (Rules 6~9)
        {"chapter_no": 2, "chap_title": "제2장 · 복도 통행 및 금기 사항", "curfew": "00:00 AM", "rule_no": 6, "title": "혼 0반 학생의 사칭", "danger": "WARNING", "audio": "scratch", "img": "images/creepy_corridor_night.jpg",
         "content": "본 생활관에는 1반부터 7반까지의 반만 존재합니다. 복도에서 마주친 자가 자신을 '0반' 혹은 '혼(魂)반' 소속이라 밝히며 말을 걸어오거든 어떠한 대꾸도 하지 마십시오. 그들은 1983년 대화재 당시 퇴소하지 못한 수련생들의 잔류 사념입니다. 대답을 건네는 순간, 당신의 학적(學籍)은 그들의 반으로 전과(轉科) 처리됩니다."},
        {"chapter_no": 2, "chap_title": "제2장 · 복도 통행 및 금기 사항", "curfew": "00:00 AM", "rule_no": 7, "title": "중앙 계단 4번째 단의 함정", "danger": "WARNING", "audio": None, "img": "images/iron_door_lock.jpg",
         "content": "중앙 계단을 오르내릴 때, 계단 단수를 세지 마십시오. 본 건물의 중앙 계단은 18단으로 설계되었으나, 자정 이후에는 간헐적으로 19단이 됩니다. 만약 평소보다 한 걸음을 더 디뎠다고 느껴진다면 그대로 멈추십시오. 아래를 내려다보지 마십시오. 마지막 19번째 단은 계단이 아니라, 아래층으로 이어지지 않는 허공의 입구입니다."},
        {"chapter_no": 2, "chap_title": "제2장 · 복도 통행 및 금기 사항", "curfew": "00:00 AM", "rule_no": 8, "title": "세면장 3번째 칸의 잠긴 문", "danger": "FATAL", "audio": "scratch", "img": "images/beast_shadow.jpg",
         "content": "동편 세면장 3번째 칸은 항상 '고장' 팻말과 함께 굳게 잠겨 있어야 합니다. 만약 이 문이 반쯤 열려 있고 안쪽에서 흐느끼는 소리가 들려오더라도 절대 안을 들여다보거나 문을 닫아주려 하지 마십시오. 그 안에는 변기가 없습니다. 단지 세로로 길게 찢어진 무언가가 당신이 문을 건드리기를 기다리고 있을 뿐입니다."},
        {"chapter_no": 2, "chap_title": "제2장 · 복도 통행 및 금기 사항", "curfew": "00:00 AM", "rule_no": 9, "title": "기상 나팔 이전의 여명", "danger": "WARNING", "audio": None, "img": "images/blood_moon_mountain.jpg",
         "content": "창밖이 환하게 밝아오더라도, 사감실의 공식 기상 나팔 음파(06:00)가 건물 전체에 울리기 전까지는 방 밖으로 나가지 마십시오. 산속의 안개는 가끔 새벽빛의 파장을 완벽하게 흉내 냅니다. 이 '가짜 여명'에 속아 문을 열고 나간 자들은 아직까지 아무도 아침 점호장에 나타나지 않았습니다."},

        # 제3장: 이계의 접촉과 탈출 (Rules 10~13)
        {"chapter_no": 3, "chap_title": "제3장 · 이계의 접촉과 탈출", "curfew": "03:00 AM", "rule_no": 10, "title": "비상 전화의 3번 울림", "danger": "FATAL", "audio": "bell", "img": "images/iron_door_lock.jpg",
         "content": "각 층 복도 끝 비상 내선 전화는 교환대가 철거되어 통화가 불가능한 기종입니다. 이 전화의 벨이 울리기 시작하면 다음을 준수하십시오. 한 번 울림: 무시하십시오. 두 번 울림: 귀를 막으십시오. 세 번 울림: 수화기를 들지 말고 선을 뽑으십시오. 만약 수화기를 귀에 댄다면 — 반대편에서 들려오는 것은 상담원의 목소리가 아니라, 당신 자신의 마지막 단말마입니다."},
        {"chapter_no": 3, "chap_title": "제3장 · 이계의 접촉과 탈출", "curfew": "03:00 AM", "rule_no": 11, "title": "손전등 붉은 샐로판의 용도", "danger": "NORMAL", "audio": None, "img": "images/talisman.jpg",
         "content": "비상 손전등 렌즈에 붉은 셀로판지를 덧댄 것은 미적 취향이 아닙니다. 백색광은 어둠 속의 존재들에게 당신의 안구 위치를 정확하게 특정해 줍니다. 붉은 파장의 빛만이 그들의 시각 신경을 자극하지 않고 통과할 수 있습니다. 셀로판지가 찢어지거나 분실되었을 경우, 즉시 손전등을 끄고 완전한 어둠 속에서 이동하십시오. 시각을 포기하는 것이 목숨을 포기하는 것보다 낫습니다."},
        {"chapter_no": 3, "chap_title": "제3장 · 이계의 접촉과 탈출", "curfew": "03:00 AM", "rule_no": 12, "title": "신발코를 문밖으로 두지 마라", "danger": "WARNING", "audio": None, "img": "images/creepy_corridor_night.jpg",
         "content": "취침 전, 벗어둔 신발의 코를 반드시 '방 안쪽'을 향하게 정돈하십시오. 신발코가 방문이나 바깥 복도를 향해 놓여 있을 경우, 자는 동안 당신의 발은 당신의 의지와 무관하게 그 신발에 꿰어집니다. 아침에 눈을 떴을 때, 흙투성이가 된 맨발과 침대 밑에서 발견되는 당신의 신발을 보고 싶지 않다면 명심하십시오."},
        {"chapter_no": 3, "chap_title": "제3장 · 이계의 접촉과 탈출", "curfew": "03:00 AM", "rule_no": 13, "title": "어머니의 목소리로 부르거든", "danger": "FATAL", "audio": "scratch", "img": "images/beast_shadow.jpg",
         "content": "새벽 04:00경, 방문을 긁으며 당신의 어머니, 아버지, 혹은 가장 친한 동료의 목소리로 문을 열어달라고 애원하는 소리가 들릴 수 있습니다. 문틀 밑으로 익숙한 필체의 쪽지가 밀려 들어오더라도 결코 믿지 마십시오. 당신의 어머니는 이 깊은 산골짜기 폐생활관의 위치를 알지 못합니다. 문고리를 잡으려는 순간, 당신의 손은 더 이상 당신의 손이 아니게 됩니다."}
    ]

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()

    # 1) Chapters 시딩
    chapters_map = {}
    chapters_meta = [
        (1, "제1장 · 야간 통금과 밤의 결계", "22:00 PM", "철문이 닫히면 복도는 더 이상 사람만의 공간이 아닙니다."),
        (2, "제2장 · 복도 통행 및 금기 사항", "00:00 AM", "어둠 속을 걸을 때 지켜야 할 최소한의 행동 수칙."),
        (3, "제3장 · 이계의 접촉과 탈출", "03:00 AM", "가장 어두운 새벽, 이형의 존재들과 마주했을 때의 생존 지침.")
    ]
    for c_no, c_title, c_curfew, c_summary in chapters_meta:
        cursor.execute("""
            INSERT OR REPLACE INTO chapters (work_id, chapter_no, title, curfew_time, summary)
            VALUES (?, ?, ?, ?, ?)
        """, ("hwarang", c_no, c_title, c_curfew, c_summary))
        cursor.execute("SELECT chapter_id FROM chapters WHERE work_id = ? AND chapter_no = ?", ("hwarang", c_no))
        chapters_map[c_no] = cursor.fetchone()[0]

    # 2) Rules 시딩
    for r in rules_catalog:
        c_id = chapters_map[r["chapter_no"]]
        audio_url = f"{CDN_BASE}/audio/{r['audio']}.wav" if r.get("audio") else None
        image_url = f"{CDN_BASE}/{r['img']}" if r.get("img") else None
        cursor.execute("""
            INSERT OR REPLACE INTO rules 
            (chapter_id, rule_no, title, danger_level, content, evidence_audio, evidence_image, audio_url, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (c_id, r["rule_no"], r["title"], r["danger"], r["content"], r.get("audio"), r.get("img"), audio_url, image_url))

    conn.commit()
    conn.close()

    # 3) 웹 배포용 rules.json 내보내기
    with open(RULES_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(rules_catalog, f, ensure_ascii=False, indent=2)
    print(f"[*] rules.json 내보내기 완료: {len(rules_catalog)}개 수칙")

def seed_stages_and_choices():
    """stages.json에서 43개 스테이지와 분기 선택지를 SQLite에 적재합니다."""
    print("[*] 3. 게임북 스테이지 및 선택지(stages, choices) 적재")
    with open(STAGES_JSON_PATH, "r", encoding="utf-8") as f:
        stages_data = json.load(f)

    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    cursor = conn.cursor()

    total_choices = 0
    for stage_id, data in stages_data.items():
        is_ending = 1 if data.get("isEnding") else 0
        ending_type = None
        if is_ending:
            if "true_ending" in stage_id:
                ending_type = "SURVIVAL"
            elif "be" in stage_id:
                ending_type = "DEATH"
            else:
                ending_type = "END"

        gain_item_str = json.dumps(data.get("gainItem"), ensure_ascii=False) if data.get("gainItem") else None
        img_rel = data.get("image", "images/iron_door_lock.jpg")
        img_url = f"{CDN_BASE}/{img_rel}" if img_rel else None
        audio_k = data.get("audio")
        audio_u = f"{CDN_BASE}/audio/{audio_k}.wav" if audio_k else None

        cursor.execute("""
            INSERT OR REPLACE INTO stages 
            (stage_id, work_id, stage_title, time_str, san_change, image_path, image_url, audio_key, audio_url, secret_hint, gain_item_json, body_text, is_ending, ending_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            stage_id,
            "hwarang",
            data.get("stageTitle", stage_id),
            data.get("time", ""),
            data.get("sanChange", 0),
            img_rel,
            img_url,
            audio_k,
            audio_u,
            data.get("secretHint"),
            gain_item_str,
            data.get("text", ""),
            is_ending,
            ending_type
        ))

        # 기존 해당 stage의 choices 삭제 후 재삽입
        cursor.execute("DELETE FROM choices WHERE stage_id = ?", (stage_id,))
        for idx, ch in enumerate(data.get("choices", []), 1):
            cursor.execute("""
                INSERT INTO choices (stage_id, choice_order, choice_text, next_stage_id, req_item)
                VALUES (?, ?, ?, ?, ?)
            """, (
                stage_id,
                idx,
                ch.get("text", ""),
                ch.get("next", ch.get("url", "")),
                ch.get("reqItem")
            ))
            total_choices += 1

    conn.commit()
    conn.close()
    print(f"[*] stages 적재 완료: {len(stages_data)}개 스테이지, {total_choices}개 선택지 분기")

def verify_db():
    """적재된 데이터 통계와 외래키 무결성을 점검합니다."""
    print("\n================ [ 📊 napolitan.db 무결성 검증 ] ================")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    tables = ["works", "chapters", "rules", "stages", "choices"]
    for t in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {t};")
        cnt = cursor.fetchone()[0]
        print(f"  • {t:10s} : {cnt:4d} 행")

    # 무결성 검사
    cursor.execute("PRAGMA foreign_key_check;")
    fk_errors = cursor.fetchall()
    if not fk_errors:
        print("  ✨ 외래키(FK) 무결성 검사: 100% 정상 (오류 없음)")
    else:
        print(f"  ⚠️ 외래키 오류 발견: {fk_errors}")

    conn.close()
    print("=================================================================\n")

if __name__ == "__main__":
    init_database()
    seed_works()
    parse_and_seed_rules()
    seed_stages_and_choices()
    verify_db()
