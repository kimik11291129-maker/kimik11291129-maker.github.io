// ==========================================================================
// 화랑골 생활관 인터랙티브 생존 게임북 엔진 (Multi-Branch to Single Ending)
// 모든 선택지 페이지 전용 이미지 100% 매핑 & 동일 생존 엔딩 수렴 구조
// ==========================================================================

const GAME_STAGES = {
    // =========================================================================
    // [ 제1막 : 22:00 폐쇄와 바닥의 마찰음 ]
    // =========================================================================
    start: {
        stageTitle: "【 제1막 : 22:00 폐쇄와 마찰음 】",
        time: "22:00 PM",
        sanChange: 0,
        image: "images/iron_door_lock.jpg",
        audio: "scratch",
        text: `22:00 정각. 육중한 쇠사슬 감기는 소리와 함께 생활관의 모든 출입문이 굳게 닫혔습니다.<br><br>
               잠시 후, 정적을 깨고 복도 바닥에서 <strong>무언가 무거운 것을 질질 끄는 기괴한 마찰음</strong>이 천천히 당신의 호실 문 앞을 지나가기 시작합니다. 발소리가 아닙니다. 마치 뼈마디가 콘크리트 바닥을 긁는 듯한 소리입니다.`,
        choices: [
            {
                text: "① [정공법] '공간 압착 소음'으로 분류하고 침대에 누워 귀를 막는다.",
                next: "p2_shadow"
            },
            {
                text: "② [도발 분기] 벽을 쿵쿵 두드리며 '누구야? 조용히 해!' 소리친다.",
                next: "p1_shout"
            },
            {
                text: "③ [협동 분기] 룸메이트 침대로 가 소리를 낮추고 쪽지로 대화한다.",
                next: "p1_roommate"
            },
            {
                text: "④ [위험] 문틈(외시경)으로 바깥 복도를 살짝 내다본다.",
                next: "be1_peek"
            }
        ]
    },

    p1_shout: {
        stageTitle: "【 제1막 : 22:15 숨죽인 긴장과 침묵 】",
        time: "22:15 PM",
        sanChange: -15,
        image: "images/creepy_corridor_night.jpg",
        audio: "scratch",
        text: `벽을 두드리자, 복도의 마찰음이 당신 호실 문 바로 앞에서 딱 멈췄습니다.<br><br>
               숨 막히는 침묵 속에서 문틈 너머로 <em>키득거리는 듯한 기괴한 숨소리</em>가 들려옵니다. 다행히 문을 억지로 부수지는 않았지만, 당신의 존재가 바깥에 노출되었습니다. 소름이 돋으며 넋의 안정도가 떨어집니다. 식은땀을 닦으며 이를 악물고 침대로 돌아갑니다.`,
        choices: [
            {
                text: "숨을 죽이고 자정 점호 시간을 기다린다.",
                next: "p2_shadow"
            }
        ]
    },

    p1_roommate: {
        stageTitle: "【 제1막 : 22:10 침대 속의 은밀한 밀담 】",
        time: "22:10 PM",
        sanChange: +5,
        image: "images/dorm_dark_corner.jpg",
        audio: null,
        text: `당신은 까치발로 룸메이트의 침대로 다가갔습니다. 룸메이트 역시 하얗게 질린 얼굴로 이불을 쥐고 있었습니다.<br><br>
               노트에 <em>'수칙 제1조야. 밖은 보지도 말고 대답도 하지 말자'</em>라고 적어 보여주자, 룸메이트가 고개를 끄덕이며 조금 안도한 표정을 짓습니다. 둘이서 함께 의지하니 공포가 다소 가라앉습니다.`,
        choices: [
            {
                text: "각자 침대로 돌아가 불을 끄고 점호를 대비한다.",
                next: "p2_shadow"
            }
        ]
    },

    be1_peek: {
        stageTitle: "【 💀 배드 엔딩 01 : 결계 밖의 시선 】",
        time: "22:05 PM",
        sanChange: -100,
        isEnding: true,
        image: "images/hidden_staircase.jpg",
        audio: "scratch",
        text: `문틈으로 눈을 갖다 댄 순간, 바깥 복도는 불이 꺼진 채 텅 비어 있었습니다.<br><br>
               안도하며 돌아서려는 찰나, 문틈 반대편 어둠 속에서 <strong>누군가의 충혈된 눈동자가 이미 당신과 눈을 마주치고 있었다는 사실</strong>을 깨닫습니다.<br><br>
               <em>"문 안에서 이동 중인 것은 아무것도 없다고 경고했을 텐데..."</em><br>
               방 안으로 스며든 냉기와 함께 당신의 의식은 영구 격리 구역으로 빨려 들어갑니다.`,
        choices: [
            { text: "🔄 이전 시점으로 되돌아가기", next: "start" }
        ]
    },

    // =========================================================================
    // [ 제2막 : 23:30 ~ 00:00 자정 점호와 여분의 숨소리 ]
    // =========================================================================
    p2_shadow: {
        stageTitle: "【 제2막 : 23:30 자정 점호와 어긋난 그림자 】",
        time: "23:30 PM",
        sanChange: 0,
        image: "images/beast_shadow.jpg",
        audio: "drone",
        text: `끼이익- 소리와 함께 호실 문이 열리고, 초롱불을 든 조장이 점호를 위해 들어섭니다.<br><br>
               그런데 초롱불에 비친 <strong>조장의 벽면 그림자가 소름 끼치게 어긋나 있습니다.</strong> 그림자의 손가락은 비정상적으로 길게 늘어져 있고, 관절이 기괴하게 뒤틀려 바닥에 웅크리고 있습니다. 눈앞의 조장은 태연한 얼굴로 출석부를 넘기고 있습니다.`,
        choices: [
            {
                text: "① [정공법] 눈을 깜박이지 않고 표정 변화 없이 번호를 복창한다.",
                next: "p2_headcount"
            },
            {
                text: "② [유물 활용] 품 안의 주사 부적(朱砂符籍)을 쥐며 마음을 가다듬는다.",
                next: "p2_talisman"
            },
            {
                text: "③ [위험] 기겁하여 비명을 지르며 뒤로 물러선다.",
                next: "be2_shadow"
            }
        ]
    },

    p2_talisman: {
        stageTitle: "【 제2막 : 23:35 주사 부적의 은밀한 결계 】",
        time: "23:35 PM",
        sanChange: +10,
        image: "images/talisman.jpg",
        audio: null,
        text: `붉은 주사(朱砂)로 쓰인 부적의 거친 한지 감촉이 손끝에 닿자, 불안하게 뛰던 심장이 차분히 가라앉습니다.<br><br>
               어긋난 그림자를 애써 시야에서 지우며 담담한 목소리로 당신의 번호를 복창했습니다. 조장은 의심 없이 출석부에 체크를 마친 뒤 방을 나섰습니다.`,
        choices: [
            {
                text: "문이 닫힌 후 방 안의 기척을 점검한다.",
                next: "p2_headcount"
            }
        ]
    },

    be2_shadow: {
        stageTitle: "【 💀 배드 엔딩 02 : 미숙한 흉내의 자각 】",
        time: "23:32 PM",
        sanChange: -100,
        isEnding: true,
        image: "images/beast_shadow.jpg",
        audio: "scratch",
        text: `당신이 비명을 지르며 뒷걸음질 치자, 조장의 동작이 그 자리에 딱 멈춥니다.<br><br>
               조장은 서서히 고개를 180도 기괴하게 돌리며, 전혀 사람의 것이 아닌 찢어질 듯한 미소를 짓습니다.<br><br>
               <em>"아직 사람의 자세를 완벽히 따라 하지 못했는데... 눈치챘구나?"</em><br>
               그림자의 기다란 손가락이 벽에서 뻗어 나와 당신의 목을 틀어쥡니다.`,
        choices: [
            { text: "🔄 점호 직전으로 되돌아가기", next: "p2_shadow" }
        ]
    },

    p2_headcount: {
        stageTitle: "【 제2막 : 00:00 자정 인원 점검 】",
        time: "00:00 AM",
        sanChange: 0,
        image: "images/dorm_dark_corner.jpg",
        audio: null,
        text: `조장이 나가고 문이 닫혔습니다. 방 안에는 당신을 포함해 <strong>원래 3명</strong>이 있어야 합니다.<br><br>
               그런데 어둠 속에서 들려오는 숨소리를 헤아려보니...<br>
               <em>하-아... 하-아... 하-아... 쉭-</em><br>
               방 안 옷장 옆 칠흑 같은 구석에서 <strong>네 번째의 낯선 숨소리</strong>가 들려옵니다!`,
        choices: [
            {
                text: "① [정공법] 절대 소리 내지 않고, 모르는 척 침대에 누워 눈을 감는다.",
                next: "p3_murmur"
            },
            {
                text: "② [협동 분기] 룸메이트들과 서로 등을 맞대고 조용히 손을 잡는다.",
                next: "p2_note"
            },
            {
                text: "③ [위험] '어? 방에 왜 네 명이 있지?' 허공을 손가락질하며 센다.",
                next: "be3_count"
            }
        ]
    },

    p2_note: {
        stageTitle: "【 제2막 : 00:05 등 맞댄 침묵의 연대 】",
        time: "00:05 AM",
        sanChange: +5,
        image: "images/scroll_bg.jpg",
        audio: null,
        text: `말을 하면 숫자가 세어질까 두려워, 당신들은 침대 위에 모여 말없이 서로의 등을 맞댔습니다.<br><br>
               원래 인원 셋의 체온이 등으로 전해지자, 어두운 구석에서 들려오던 불길한 네 번째 숨소리가 자리를 잡지 못하고 허공 속으로 천천히 흐려집니다. 침착한 대처로 위기를 넘겼습니다.`,
        choices: [
            {
                text: "새벽 시련을 향해 시간을 흘려보낸다.",
                next: "p3_murmur"
            }
        ]
    },

    be3_count: {
        stageTitle: "【 💀 배드 엔딩 03 : 신원 확정과 학적 말소 】",
        time: "00:03 AM",
        sanChange: -100,
        isEnding: true,
        image: "images/hidden_staircase.jpg",
        audio: "scratch",
        text: `당신이 손가락으로 어두운 구석을 가리키며 '넷!'이라고 외친 순간, 허공의 낯선 기척이 굳건한 형태를 갖추기 시작합니다.<br><br>
               당신이 숫자를 입 밖으로 내어 부르는 순간, 그 존재는 공식 신원으로 확정되었습니다.<br>
               그리고... <strong>대신 당신의 존재와 이름이 학적에서 완전히 지워졌습니다.</strong><br>
               다음 날, 룸메이트들은 당신이 처음부터 그 방에 없었던 사람인 양 행동할 것입니다.`,
        choices: [
            { text: "🔄 인원 점검 시점으로 되돌아가기", next: "p2_headcount" }
        ]
    },

    // =========================================================================
    // [ 제3막 : 01:30 ~ 02:30 잠꼬대와 문밖의 유혹 ]
    // =========================================================================
    p3_murmur: {
        stageTitle: "【 제3막 : 01:30 잠꼬대 엉킴 현상 】",
        time: "01:30 AM",
        sanChange: 0,
        image: "images/dorm_dark_corner.jpg",
        audio: "roommate",
        text: `새벽 1시 반경, 옆 침대의 동실인이 잠꼬대를 시작합니다. 문제는 그 목소리가 <strong>당신과 토시 하나 틀리지 않은 '당신의 음색'</strong>이라는 점입니다!<br><br>
               심지어 낮에 당신 혼자 속으로만 생각했던 가장 은밀한 기억을 똑같은 목소리로 중얼거리고 있습니다. <em>"연습하는 게 아니야... 이미 다 익혔어..."</em>`,
        choices: [
            {
                text: "① [정공법] 이불을 머리끝까지 뒤집어쓰고 양귀를 필사적으로 틀어막는다.",
                next: "p3_call"
            },
            {
                text: "② [차단 분기] 서랍 속 귀마개를 깊숙이 꽂고 정화 묵송문을 암송한다.",
                next: "p3_earplugs"
            },
            {
                text: "③ [위험] 너무 소름이 돋아 동실인의 어깨를 흔들어 깨운다.",
                next: "be4_voice"
            }
        ]
    },

    p3_earplugs: {
        stageTitle: "【 제3막 : 01:40 완전 차음과 내면의 평정 】",
        time: "01:40 AM",
        sanChange: +10,
        image: "images/dorm_dark_corner.jpg",
        audio: null,
        text: `스펀지 귀마개를 귓구멍 깊숙이 쑤셔 넣자, 방 안을 떠돌던 기괴한 도플갱어 음색이 먹먹한 침묵 속으로 차단되었습니다.<br><br>
               마음속으로만 <em>'옴 바즈라 사트바...'</em> 묵송문을 되뇌자, 귓가를 갉아먹던 음성 오염이 씻겨 내려갑니다.`,
        choices: [
            {
                text: "고요 속에서 새벽 2시 반을 맞이한다.",
                next: "p3_call"
            }
        ]
    },

    be4_voice: {
        stageTitle: "【 💀 배드 엔딩 04 : 완성된 음색 표본 】",
        time: "01:32 AM",
        sanChange: -100,
        isEnding: true,
        image: "images/dorm_dark_corner.jpg",
        audio: "scratch",
        text: `동실인의 어깨를 흔들자, 그가 스르륵 고개를 돌립니다. 그러나 눈은 여전히 감겨 있습니다.<br><br>
               그의 입에서 정확히 당신의 음색과 억양으로 차가운 목소리가 흘러나옵니다.<br>
               <em>"연습하는 게 아니야... 이미 다 익혔어."</em><br><br>
               그 순간, 당신 자신의 목에서는 짐승의 쉰 비명 소리만이 터져 나옵니다. 목소리가 완전히 강탈당했습니다.`,
        choices: [
            { text: "🔄 잠꼬대 시점으로 되돌아가기", next: "p3_murmur" }
        ]
    },

    p3_call: {
        stageTitle: "【 제3막 : 02:30 놋쇠 호각 없는 부름 】",
        time: "02:30 AM",
        sanChange: 0,
        image: "images/creepy_corridor_night.jpg",
        audio: "roommate",
        text: `얼마 후, 복도에서 다급한 발소리와 함께 방문을 쾅쾅 두드리는 소리가 납니다!<br><br>
               <em>"야! 철수야! 빨리 나와! 사감실 결계 터졌어! 다 대피하래! 나 민우야!"</em><br>
               가장 친한 동기 민우의 다급한 목소리입니다. <strong>하지만 복도에서는 순찰 무인의 놋쇠 호각 소리가 전혀 들리지 않았습니다.</strong>`,
        choices: [
            {
                text: "① [유물 활용] 책상 위의 [놋쇠 호각]을 집어 들고 문을 향해 힘껏 분다!",
                next: "p3_whistle_win"
            },
            {
                text: "② [정공법] 호각 소리가 없음을 확인하고 이불 속에 엎드려 완벽히 침묵한다.",
                next: "p3_silent_wait"
            },
            {
                text: "③ [위험] '민우야! 진짜 너 맞아? 무슨 일이야?' 대답하며 문으로 간다.",
                next: "be5_call"
            }
        ]
    },

    p3_whistle_win: {
        stageTitle: "【 제3막 : 02:35 놋쇠 호각의 정화 파동 】",
        time: "02:35 AM",
        sanChange: +15,
        image: "images/whistle.jpg",
        audio: "whistle",
        text: `삐이익——! 날카롭고 서슬 퍼런 놋쇠 호각 소리가 방문을 뚫고 복도로 터져 나갑니다!<br><br>
               문밖에서 민우의 목소리로 속이려던 존재가 <strong>"크아아악!"</strong> 하는 찢어지는 비명을 지르며 복도 끝으로 허겁지겁 도망칩니다.<br>
               순찰 무인의 신성한 호각이 사칭 음성을 격퇴했습니다!`,
        choices: [
            {
                text: "숨을 고르고 새벽 3시 반의 월광을 대비한다.",
                next: "p4_blood_moon"
            }
        ]
    },

    p3_silent_wait: {
        stageTitle: "【 제3막 : 02:40 침묵의 인내 】",
        time: "02:40 AM",
        sanChange: -5,
        image: "images/door_thread.jpg",
        audio: null,
        text: `숨소리조차 내지 않고 침대에 엎드려 버텼습니다.<br><br>
               문밖의 존재는 한참 동안 문고리를 덜컹거리며 애원하다가, 아무 반응이 없자 낮게 투덜거리며 복도 저편으로 멀어져 갔습니다. 비록 신경이 곤두섰지만 문을 열지 않아 무사합니다.`,
        choices: [
            {
                text: "가쁜 숨을 내쉬며 창가 쪽의 기척에 집중한다.",
                next: "p4_blood_moon"
            }
        ]
    },

    be5_call: {
        stageTitle: "【 💀 배드 엔딩 05 : 박제된 목소리 】",
        time: "02:33 AM",
        sanChange: -100,
        isEnding: true,
        image: "images/hidden_staircase.jpg",
        audio: "mimic",
        text: `당신이 '민우야!'라고 대답하는 순간, 문밖의 다급한 목소리가 뚝 끊깁니다.<br><br>
               문틈 아래로 스르륵 검은 액체가 흘러들며, 당신의 목구멍 안쪽이 타는 듯이 뜨거워집니다.<br>
               순찰 무인의 호각 없는 부름에 한 번이라도 반응하면 목소리가 표본으로 채취됩니다.<br><br>
               내일부터 누군가는 당신의 목소리로 다른 학생을 속여 문을 열게 만들 것입니다.`,
        choices: [
            { text: "🔄 부름 직전으로 되돌아가기", next: "p3_call" }
        ]
    },

    // =========================================================================
    // [ 제4막 : 03:30 ~ 04:30 핏빛 달과 비상 정화령 ]
    // =========================================================================
    p4_blood_moon: {
        stageTitle: "【 제4막 : 03:30 핏빛 보름달의 월광 】",
        time: "03:30 AM",
        sanChange: 0,
        image: "images/blood_moon.jpg",
        audio: "drone",
        text: `새벽 3시 반, 창틀 틈새로 <strong>불길하고 끈적한 핏빛 붉은 광선</strong>이 방 안을 물들이기 시작합니다.<br><br>
               교내 뒷산 능선 위로 거대한 핏빛 보름달이 차올랐습니다. 창밖에서 신비로운 노랫소리 같은 환청이 들려오며 창문을 열어보고 싶은 충동이 강하게 듭니다.`,
        choices: [
            {
                text: "① [정공법] 차광막을 단단히 내리고 창문을 등져 월광을 차단한다.",
                next: "p4_seven_bells"
            },
            {
                text: "② [은신 분기] 방 안의 모든 불을 끄고 이불로 암실을 만들어 숨는다.",
                next: "p4_curtain"
            },
            {
                text: "③ [위험] 홀린 듯 창문을 열어 붉은 달빛을 직접 확인한다.",
                next: "be6_moon"
            }
        ]
    },

    p4_curtain: {
        stageTitle: "【 제4막 : 03:40 암실 봉인과 차단 】",
        time: "03:40 AM",
        sanChange: +5,
        image: "images/blood_moon.jpg",
        audio: null,
        text: `두꺼운 차광 커튼을 치고 옷장 속 담요까지 덧대어 핏빛 달빛을 완벽하게 차단했습니다.<br><br>
               방 안이 칠흑 같은 어둠에 잠기자, 창밖에서 들려오던 매혹적인 쇳소리 노랫가락도 힘을 잃고 흩어집니다.`,
        choices: [
            {
                text: "어둠 속에서 긴장을 늦추지 않고 대기한다.",
                next: "p4_seven_bells"
            }
        ]
    },

    be6_moon: {
        stageTitle: "【 💀 배드 엔딩 06 : 자아의 앙금 붕괴 】",
        time: "03:35 AM",
        sanChange: -100,
        isEnding: true,
        image: "images/blood_moon.jpg",
        audio: "scratch",
        text: `창문을 연 순간, 차가운 핏빛 월광이 당신의 온몸을 직격합니다.<br><br>
               내면의 깊은 앙금이 펄펄 끓어오르며 살갗 아래에서 뼈마디가 뒤틀리고 변형되기 시작합니다.<br>
               <em>"아아... 나도 사람이 아니었구나..."</em><br>
               당신은 스스로 창문을 뛰어넘어 붉은 달밤의 어두운 산속으로 사라졌습니다.`,
        choices: [
            { text: "🔄 월광 출현 시점으로 되돌아가기", next: "p4_blood_moon" }
        ]
    },

    p4_seven_bells: {
        stageTitle: "【 🚨 제4막 : 04:00 비상 정화령 7연속 타종 】",
        time: "04:00 AM",
        sanChange: -15,
        image: "images/temple_bell_tower.jpg",
        audio: "bell",
        text: `차광막을 내리자마자, 생활관 뒷산에서 거대한 청동종이 울리기 시작합니다.<br>
               <strong>「당 — 당 — 당 — 당 — 당 — 당 — 당 —」</strong><br><br>
               정확히 일곱 번. <strong>비상 정화령 발효입니다!</strong><br>
               생활관 외부 결계가 깨졌습니다. 침실 밖 복도는 이제 인간의 영역이 아닙니다!`,
        choices: [
            {
                text: "① [정공법] 베개 밑 백사(흰 실)를 꺼내 문고리에 3회 결속하고 침대 중앙에 앉는다.",
                next: "p4_mother_trap"
            },
            {
                text: "② [위험] 당황하여 이성을 잃고 짐을 챙겨 복도 밖으로 뛰쳐나간다.",
                next: "be7_bells"
            }
        ]
    },

    be7_bells: {
        stageTitle: "【 💀 배드 엔딩 07 : 정화령 표적 격리 】",
        time: "04:02 AM",
        sanChange: -100,
        isEnding: true,
        image: "images/hidden_staircase.jpg",
        audio: "scratch",
        text: `종소리에 놀라 복도로 뛰쳐나간 순간, 복도 끝의 공간이 뒤틀려 본 건물에 존재하지 않는 칠흑의 지하 계단이 나타납니다.<br><br>
               어둠 속에서 수많은 낯선 목소리들이 당신의 이름을 부르며 계단 아래로 끌어당깁니다.<br>
               비상 정화령 상황에서 방 밖으로 나온 자는 정화 표적으로 간주되어 영구 격리됩니다.`,
        choices: [
            { text: "🔄 타종 직전으로 되돌아가기", next: "p4_seven_bells" }
        ]
    },

    p4_mother_trap: {
        stageTitle: "【 🚨 제4막 : 04:30 가장 취약한 목소리의 덫 】",
        time: "04:30 AM",
        sanChange: -20,
        image: "images/door_thread.jpg",
        audio: "mimic",
        text: `백사를 문고리에 세 번 팽팽히 감고 침대 한가운데 앉아 속으로 정화 주문을 읊습니다.<br><br>
               종이 그치고 한참 뒤... 방문 밖에서 울먹이는 소리와 함께 <strong>당신 어머니의 너무나 그립고 애타는 목소리</strong>가 들려옵니다.<br>
               <em>"아들아... 엄마야... 엄마가 널 데리러 왔단다... 밖이 너무 춥고 발이 아파... 문 좀 열어다오..."</em>`,
        choices: [
            {
                text: "① [정공법] '종이 그친 뒤에는 더더욱 열지 마라'를 되뇌며 입술을 깨물고 묵송한다.",
                next: "p5_dawn"
            },
            {
                text: "② [협동 분기] 동실인들과 손을 꽉 쥐고 소리 없이 눈짓으로 버팀목이 되어준다.",
                next: "p4_chant_hold"
            },
            {
                text: "③ [위험] '엄마?! 엄마가 어떻게 여기에...' 눈물을 흘리며 백사를 푼다.",
                next: "be8_mother"
            }
        ]
    },

    p4_chant_hold: {
        stageTitle: "【 🚨 제4막 : 04:35 연대의 묵송과 결계 방어 】",
        time: "04:35 AM",
        sanChange: +15,
        image: "images/talisman.jpg",
        audio: null,
        text: `어머니의 가슴 찢어지는 목소리에 눈물이 쏟아지려 할 때, 옆 동실인이 당신의 떨리는 손을 꽉 잡았습니다.<br><br>
               서로의 온기와 주사 부적의 기운이 마음을 다잡아 주었습니다. 문고리에 걸린 백사는 팽팽하게 버텨냈고, 문밖의 존재는 문을 열 수 없었습니다.`,
        choices: [
            {
                text: "새벽빛이 스며들 때까지 침묵을 지킨다.",
                next: "p5_dawn"
            }
        ]
    },

    be8_mother: {
        stageTitle: "【 💀 배드 엔딩 08 : 기억의 미끼 】",
        time: "04:35 AM",
        sanChange: -100,
        isEnding: true,
        image: "images/door_thread.jpg",
        audio: "scratch",
        text: `손을 떨며 백사를 풀고 문을 벌컥 연 순간...<br><br>
               문밖에는 어머니가 없었습니다. 칠흑 같은 어둠 속에서 문틀을 쥐고 선 것은, 당신 어머니의 목소리로 흉내를 내며 헐떡이는 <strong>거대하고 뒤틀린 이형의 그림자</strong>였습니다.<br><br>
               <em>"종이 그치고 한참 뒤에 애타게 부르더라도... 그때는 더더욱 열지 마십시오..."</em><br>
               수칙의 마지막 문장이 귓가를 맴돌지만, 이미 늦었습니다.`,
        choices: [
            { text: "🔄 어머니의 목소리 시점으로 되돌아가기", next: "p4_mother_trap" }
        ]
    },

    // =========================================================================
    // [ 제5막 : 05:00 ~ 06:30 여명과 탈출, 그리고 최종 생존 귀환 ]
    // =========================================================================
    p5_dawn: {
        stageTitle: "【 제5막 : 05:00 여명의 환각과 후퇴 】",
        time: "05:00 AM",
        sanChange: +20,
        image: "images/blood_moon.jpg",
        audio: null,
        text: `문밖에서 어머니의 목소리로 애원하던 소리는, 당신들이 끝까지 문을 열지 않자 서서히 <em>기괴한 쇳소리와 거친 짐승의 으르렁거림</em>으로 변하더니 어둠 속으로 서서히 멀어져 갔습니다.<br><br>
               창밖을 보니 푸르스름한 새벽안개가 자욱합니다. 마치 날이 밝은 것처럼 보이지만, 시계는 아직 <strong>05:00 AM</strong>을 가리키고 있습니다.`,
        choices: [
            {
                text: "① [정공법] 06:00 정규 기상 나팔이 울릴 때까지 호실 안에서 침착하게 대기한다.",
                next: "p5_wait_six"
            },
            {
                text: "② [위험] '날이 밝았으니 끝났다!' 안도하며 문을 열고 조기 탈출한다.",
                next: "be9_early"
            }
        ]
    },

    be9_early: {
        stageTitle: "【 💀 배드 엔딩 09 : 여명의 기만 】",
        time: "05:05 AM",
        sanChange: -100,
        isEnding: true,
        image: "images/hidden_staircase.jpg",
        audio: "scratch",
        text: `05:00에 복도로 뛰어나간 순간, 새벽빛이라 여겼던 푸른빛이 순식간에 차가운 잿빛 안개로 돌변합니다.<br><br>
               정규 타종 전의 여명은 바깥의 존재가 부리는 마지막 환각이었습니다.<br>
               결계가 풀리지 않은 복도에서 당신은 안개와 함께 온데간데없이 사라졌습니다.`,
        choices: [
            { text: "🔄 05:00 시점으로 되돌아가기", next: "p5_dawn" }
        ]
    },

    p5_wait_six: {
        stageTitle: "【 제5막 : 05:55 여명의 인내와 정규 개문 】",
        time: "05:55 AM",
        sanChange: +15,
        image: "images/iron_door_lock.jpg",
        audio: null,
        text: `조급한 마음을 누르고 1분, 1초를 세며 방 안에서 기다렸습니다.<br><br>
               <strong>뿌우우우——! 댕 — 댕 — 댕 —!</strong><br>
               06:00 정각! 교내 방송 스피커에서 우렁찬 기상 나팔 소리와 함께 정규 아침 점호 타종이 울려 퍼집니다!<br>
               복도의 무거운 철문 쇠사슬이 풀리는 소리가 들립니다. 드디어 밤의 결계가 정식으로 해제되었습니다!`,
        choices: [
            {
                text: "호실 문을 열고 운동장 점호장을 향해 복도로 나선다.",
                next: "p5_hallway"
            }
        ]
    },

    p5_hallway: {
        stageTitle: "【 제5막 : 06:05 복도의 잔류물과 최종 관문 】",
        time: "06:05 AM",
        sanChange: 0,
        image: "images/creepy_corridor_night.jpg",
        audio: "chant",
        text: `복도로 나오자 밤새 벌어진 흔적이 역력합니다. 바닥 곳곳에 <strong>출처를 알 수 없는 고운 백색 털</strong>이 흩어져 있고, 302호 앞에는 반쯤 뜯겨 나간 훼손된 명찰이 떨어져 있습니다.<br><br>
               저 멀리 복도 코너에서 낯선 구형 교복을 입은 '혼 0반' 학생 개체가 무표정하게 걸어오고 있습니다.`,
        choices: [
            {
                text: "① [정공 침묵] 바닥의 털과 명찰을 일절 보지 않고 정면만 응시하며 당당히 걷는다.",
                next: "true_ending"
            },
            {
                text: "② [협동 전진] 동실인들과 나란히 발을 맞추어 묵묵히 중앙 현관으로 전진한다.",
                next: "true_ending"
            },
            {
                text: "③ [질주 탈출] 마음속으로 정화 묵송문을 암송하며 운동장 햇살을 향해 내달린다.",
                next: "true_ending"
            },
            {
                text: "④ [위험] 바닥의 훼손된 명찰이 누구 것인지 집어 들어 확인한다.",
                next: "be10_ghost"
            }
        ]
    },

    be10_ghost: {
        stageTitle: "【 💀 배드 엔딩 10 : 지워진 자의 명찰 】",
        time: "06:07 AM",
        sanChange: -100,
        isEnding: true,
        image: "images/hidden_staircase.jpg",
        audio: "scratch",
        text: `바닥의 훼손된 명찰을 집어 든 순간, 명찰에 묻어 있던 차가운 기름 같은 액체가 손끝으로 스며듭니다.<br><br>
               가슴에 찬 당신의 명찰 글자가 흐릿해지며 어젯밤 사라진 누군가의 학번으로 바뀌어 버렸습니다.<br>
               뒤이어 다가온 사감실 순찰대에게 신원 불명자로 체포되어 영구 격리 구역으로 이송됩니다.`,
        choices: [
            { text: "🔄 복도 출현 시점으로 되돌아가기", next: "p5_hallway" }
        ]
    },

    // =========================================================================
    // [ 🏆 최종 생존 엔딩 : 동일 엔딩 수렴 (True Ending) ]
    // =========================================================================
    true_ending: {
        stageTitle: "【 🏆 生存 判定 : 06:30 아침 점호 완료 (귀환) 】",
        time: "06:30 AM",
        sanChange: +50,
        isEnding: true,
        image: "images/iron_door_lock.jpg",
        audio: "bell",
        text: `당신은 바닥의 기괴한 잔류물과 '혼 0반' 개체에 눈길 한 번 주지 않고 무사히 중앙 현관을 통과해 넓은 운동장에 발을 디뎠습니다.<br><br>
               상쾌한 아침 햇살이 차가웠던 이마를 따스하게 비추고, 산에서 불어오는 맑은 바람이 밤새 억눌렸던 공포를 씻어냅니다.<br><br>
               단상 위 사감장의 위엄 있는 목소리가 마이크를 타고 울려 퍼집니다.<br>
               <em>"오늘 2026년 심야 점호... 전원 생존 및 본인 식별 확인 완료. 학적 유지 승인."</em><br><br>
               당신은 13가지 금기와 인지 왜곡의 수많은 시련을 지혜와 용기로 이겨내고, <strong>화랑골 생활관의 밤에서 온전히 살아남았습니다.</strong><br><br>
               <strong>[ 칭호 획득 : 화랑골 생활관 불침번 수호 생존자 ]</strong>`,
        choices: [
            { text: "📜 다른 생존 경로(가지)로 다시 도전하기", next: "start" },
            { text: "📖 안전 수칙 전문 (第1~3章) 복습하기", url: "about.html" },
            { text: "🚨 제4장 비상 정화령 지침 점검하기", url: "portfolio.html" }
        ]
    }
};

// ==========================================================================
// 게임 런타임 제어 로직
// ==========================================================================
let currentSan = 100;

function renderStage(stageKey) {
    const stage = GAME_STAGES[stageKey];
    if (!stage) return;

    // 1. 시간 갱신
    const timeEl = document.getElementById("game-time");
    if (timeEl) timeEl.textContent = stage.time;

    // 2. SAN치(넋의 안정도) 갱신
    if (stageKey === "start") {
        currentSan = 100;
    } else {
        currentSan = Math.max(0, Math.min(100, currentSan + (stage.sanChange || 0)));
    }

    const sanBar = document.getElementById("san-bar");
    const sanText = document.getElementById("san-text");
    if (sanBar && sanText) {
        sanBar.style.width = currentSan + "%";
        sanText.textContent = currentSan + "%";
        if (currentSan <= 30) {
            sanBar.style.backgroundColor = "#ff2233";
        } else if (currentSan <= 60) {
            sanBar.style.backgroundColor = "#e5c07b";
        } else {
            sanBar.style.backgroundColor = "#98c379";
        }
    }

    // 3. 텍스트 및 제목
    const titleEl = document.getElementById("story-stage-title");
    const textEl = document.getElementById("story-text");
    if (titleEl) titleEl.innerHTML = stage.stageTitle;
    if (textEl) textEl.innerHTML = stage.text;

    // 4. 이미지 렌더링 (모든 스테이지 100% 필수)
    const imgBox = document.getElementById("story-image-box");
    if (imgBox) {
        if (stage.image) {
            imgBox.style.display = "block";
            imgBox.innerHTML = `<img src="${stage.image}" alt="현장 채증 사진" class="story-inline-img">`;
        } else {
            imgBox.style.display = "none";
            imgBox.innerHTML = "";
        }
    }

    // 5. 선택지 버튼 렌더링
    const choicesBox = document.getElementById("choices-container");
    if (choicesBox) {
        choicesBox.innerHTML = "";
        stage.choices.forEach(ch => {
            const btn = document.createElement("button");
            btn.className = "choice-btn";
            if (stage.isEnding) {
                btn.classList.add(stageKey === "true_ending" ? "choice-win" : "choice-retry");
            }
            btn.innerHTML = ch.text;
            btn.onclick = () => {
                if (ch.url) {
                    window.location.href = ch.url;
                } else if (ch.next) {
                    renderStage(ch.next);
                }
            };
            choicesBox.appendChild(btn);
        });
    }

    // 6. 무대 음향/음성 효과 재생
    if (stage.audio && typeof playAudioClip === 'function') {
        try {
            playAudioClip(stage.audio, null, 0.75);
        } catch (e) {
            console.warn("오디오 재생 보류:", e);
        }
    }

    // 7. 두루마리 스크롤 상단 리셋
    const scrollArea = document.querySelector(".scroll-content-area");
    if (scrollArea) scrollArea.scrollTop = 0;
}

// 놋쇠 호각 소품 클릭 시 상호작용
function useWhistleInGame() {
    if (typeof playAudioClip === 'function') {
        playAudioClip('whistle', null, 0.95);
    }
    const timeEl = document.getElementById("game-time");
    const curTime = timeEl ? timeEl.textContent : "";
    if (curTime.includes("02:30")) {
        renderStage("p3_whistle_win");
    } else {
        showToast("📯 놋쇠 호각 소리가 삐이익- 울립니다! (Rule 2 준수)");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("story-container")) {
        renderStage("start");
    }
});
