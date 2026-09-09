// ==========================================================================
// 화랑골 생활관 인터랙티브 생존 게임북 엔진 (Multi-Branch to Single Ending)
// 4대 인터랙티브 기믹 통합:
// 1. 넋(SAN) 오염 글리치 연출
// 2. 초롱불 암전 & 마우스 손전등 투시경 & 숨은 혈서 힌트
// 3. 정체불명의 동행자 시스템 (선배의 합류와 소름 돋는 진실)
// 4. 생존 증명서 / 사망 실종 통보서 발급 및 원클릭 공유
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
        secretHint: "🩸 [과거 입소자의 혈서] 바닥을 끄는 소리는 발소리가 아니다. 문틈으로 쳐다보는 순간 그 놈의 충혈된 눈과 마주친다.",
        text: `22:00 정각. 육중한 쇠사슬 감기는 소리와 함께 생활관의 모든 출입문이 굳게 닫혔습니다.<br><br>
               잠시 후, 정적을 깨고 복도 바닥에서 <strong>무언가 무거운 것을 질질 끄는 기괴한 마찰음</strong>이 천천히 당신의 호실 문 앞을 지나가기 시작합니다. 발소리가 아닙니다. 마치 뼈마디가 콘크리트 바닥을 긁는 듯한 소리입니다.`,
        choices: [
            {
                text: "① 단순한 '건물 수축음'이라 생각하며 침대에 누워 귀를 막는다.",
                next: "p1_relax_choice"
            },
            {
                text: "② 룸메이트 침대로 가 소리를 낮추고 쪽지로 대화한다.",
                next: "p1_roommate"
            },
            {
                text: "③ 벽면 문틀 주변의 미세한 틈새를 조심스럽게 살펴본다.",
                next: "p1_search_frame"
            },
            {
                text: "④ 벽을 쿵쿵 두드리며 '누구야? 조용히 해!' 소리친다.",
                next: "p1_shout"
            },
            {
                text: "⑤ 문틈(외시경)으로 바깥 복도를 살짝 내다본다.",
                next: "be1_peek"
            }
        ]
    },

    p1_search_frame: {
        stageTitle: "【 제1막 : 22:08 문틀 틈새의 발견 】",
        time: "22:08 PM",
        sanChange: +10,
        image: "images/talisman.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 붉은 주사 부적은 어긋난 그림자의 시선을 분산시킨다. 품속에 꼭 지니고 있어라.",
        gainItem: {
            id: 'talisman',
            name: '주사 부적',
            icon: '📜'
        },
        text: `당신은 까치발로 문틀 상단 구석을 조심스럽게 살폈습니다.<br><br>
               문틀 나무 틈새에 이전 입소자가 비상용으로 깊숙이 끼워둔 <strong>붉은 주사 부적</strong> 한 장이 손끝에 잡힙니다. 손톱자국이 거칠게 긁혀 있지만, 붉은 경면주사의 결계 기운은 온전히 살아있습니다.<br><br>
               부적을 품속 깊은 안주머니에 챙겨 넣자, 서늘하던 가슴이 든든해집니다.`,
        choices: [
            {
                text: "호흡을 가다듬으며 넋을 안정시킬 방법을 찾는다.",
                next: "p1_relax_choice"
            },
            {
                text: "침대로 돌아가 다음 기척에 대비한다.",
                next: "p2_companion_encounter"
            }
        ]
    },

    p1_relax_choice: {
        stageTitle: "【 제1막 : 22:20 마찰음이 지나간 뒤 】",
        time: "22:20 PM",
        sanChange: 0,
        image: "images/dorm_dark_corner.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 온기를 잃으면 넋이 먼저 무너진다. 따뜻한 차는 공포로 마비된 감각을 깨워준다.",
        text: `복도를 질질 끌며 지나가던 기괴한 소리가 마침내 저 멀리 복도 끝으로 사라졌습니다.<br><br>
               식은땀으로 등줄기가 축축합니다. 아직 자정 점호까지는 시간이 남아 있습니다. 지금 넋을 추스르지 않으면 밤을 버텨내기 어렵습니다.`,
        choices: [
            {
                text: "보온병에 담아둔 따뜻한 쑥차를 마시며 깊게 심호흡한다.",
                next: "p1_tea_relax"
            },
            {
                text: "긴장을 늦추지 않고 침대 곁의 수상한 기척에 귀를 기울인다.",
                next: "p2_companion_encounter"
            }
        ]
    },

    p1_tea_relax: {
        stageTitle: "【 🍵 제1막 : 22:30 온기와 심신 안정 】",
        time: "22:30 PM",
        sanChange: +20,
        image: "images/dorm_dark_corner.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 밤 11시가 넘으면 복도 환풍구 쪽에서 누군가 문을 두드릴 것이다. 사람일까, 흉내일까?",
        text: `어둠 속에서 보온병 뚜껑을 조용히 열자, 은은하고 구수한 쑥차 향기가 퍼집니다.<br><br>
               따뜻한 찻물을 천천히 목을 타고 넘기며 가슴 깊이 숨을 들이쉬고 내쉬었습니다. 얼어붙었던 속이 풀리고 마비되었던 감각이 서서히 제자리를 찾습니다.<br><br>
               <strong>[ 넋 회복 : 넋의 안정도가 대폭 회복되었습니다 (+20%) ]</strong>`,
        choices: [
            {
                text: "안정을 찾은 정신으로 문밖의 새로운 기척에 귀를 기울인다.",
                next: "p2_companion_encounter"
            }
        ]
    },

    p1_shout: {
        stageTitle: "【 제1막 : 22:15 숨죽인 긴장과 침묵 】",
        time: "22:15 PM",
        sanChange: -15,
        image: "images/creepy_corridor_night.jpg",
        audio: "scratch",
        secretHint: "🩸 [과거 입소자의 혈서] 소리를 지르는 자가 가장 먼저 표적이 된다. 입을 다물어라.",
        text: `벽을 두드리자, 복도의 마찰음이 당신 호실 문 바로 앞에서 딱 멈췄습니다.<br><br>
               숨 막히는 침묵 속에서 문틈 너머로 <em>키득거리는 듯한 기괴한 숨소리</em>가 들려옵니다. 다행히 문을 부수지는 않았지만, 당신의 기척이 바깥에 노출되었습니다. 소름이 돋으며 넋의 안정도가 떨어집니다. 식은땀을 닦으며 이를 악물고 침대로 돌아갑니다.`,
        choices: [
            {
                text: "쑥차를 마시며 무너진 넋을 필사적으로 추스른다.",
                next: "p1_tea_relax"
            },
            {
                text: "숨을 죽이고 문틈의 새로운 기척을 확인한다.",
                next: "p2_companion_encounter"
            }
        ]
    },

    p1_roommate: {
        stageTitle: "【 제1막 : 22:10 침대 속의 은밀한 밀담 】",
        time: "22:10 PM",
        sanChange: +5,
        image: "images/dorm_dark_corner.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 동실인과 쪽지를 나눌 때 글씨체가 어딘가 떨리고 부자연스럽지 않은지 살펴라.",
        text: `당신은 까치발로 룸메이트의 침대로 다가갔습니다. 룸메이트 역시 하얗게 질린 얼굴로 이불을 쥐고 있었습니다.<br><br>
               노트에 <em>'수칙 제1조야. 밖은 보지도 말고 대답도 하지 말자'</em>라고 적어 보여주자, 룸메이트가 고개를 끄덕이며 조금 안도한 표정을 짓습니다.`,
        choices: [
            {
                text: "룸메이트가 건네는 여분의 소지품을 확인한다.",
                next: "p1_gain_talisman"
            },
            {
                text: "각자 침대로 돌아가 불을 끄고 점호를 대비한다.",
                next: "p2_companion_encounter"
            }
        ]
    },

    p1_gain_talisman: {
        stageTitle: "【 제1막 : 22:12 룸메이트의 비상 유물 】",
        time: "22:12 PM",
        sanChange: +10,
        image: "images/talisman.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 부적의 붉은 주사는 살아서 숨 쉰다. 절대 긁어내지 마라.",
        gainItem: {
            id: 'talisman',
            name: '주사 부적',
            icon: '📜'
        },
        text: `룸메이트가 떨리는 손으로 베개 밑에서 붉은 한지 조각 하나를 꺼내 당신 손에 쥐여주었습니다.<br><br>
               <em>"어제 낮에 청소하다가 침대 밑 틈새에서 찾은 여분의 주사 부적이야... 밤에는 넋이 홀리기 쉽다니까 너도 꼭 지니고 있어."</em><br><br>
               거친 경면주사 잉크 냄새가 코끝을 스치며 공포로 떨리던 마음에 중심이 잡힙니다.`,
        choices: [
            {
                text: "부적을 품에 넣고 쑥차를 나눠 마시며 안정을 찾는다.",
                next: "p1_tea_relax"
            },
            {
                text: "부적을 품에 넣고 문밖의 낯선 긁는 소리에 집중한다.",
                next: "p2_companion_encounter"
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
            { text: "🔄 처음부터 다시 도전하기", next: "start" }
        ]
    },

    // =========================================================================
    // [ 신규 기믹 : 23:15 피투성이 안경 선배와의 조우 (조력자 vs 괴이) ]
    // =========================================================================
    p2_companion_encounter: {
        stageTitle: "【 👥 제2막 : 23:15 문틈으로 밀려온 쪽지 】",
        time: "23:15 PM",
        sanChange: 0,
        image: "images/dorm_dark_corner.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 동행은 공포를 덜어주지만, 그의 그림자가 너와 반대로 향하는지 수시로 확인해라.",
        text: `점호 시간이 다가오던 23:15경, 호실 문틈 밑으로 피 묻은 낡은 쪽지 한 장이 바스락거리며 밀려 들어옵니다.<br><br>
               <em>'옆 305호 3학년 김선우야... 우리 방 애들이 전부 이상해져서 겨우 빠져나왔어. 나 수칙 13개 전부 외우고 있어. 제발 1분만 들여보내 줘. 같이 있어야 살아남아.'</em><br><br>
               외시경 아래로 얼핏 보이는 그의 안경 렌즈 한쪽은 깨져 있고, 공포에 질려 사시나무 떨듯 떨고 있습니다.`,
        choices: [
            {
                text: "① 문을 조심스럽게 살짝 열어 선배를 방 안으로 들인다.",
                next: "p2_senior_join"
            },
            {
                text: "② '문 안의 인원은 추가될 수 없다'는 수칙을 상기하며 거절한다.",
                next: "p2_shadow"
            }
        ]
    },

    p2_senior_join: {
        stageTitle: "【 👥 제2막 : 23:18 정체불명의 동행자 합류 】",
        time: "23:18 PM",
        sanChange: +15,
        image: "images/scroll_bg.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 선배는 수칙을 완벽히 안다. 하지만 왜 10년 전 구형 명찰을 달고 있는가?",
        setCompanion: "senior",
        text: `문을 열자 찬 바람과 함께 피투성이 안경을 쓴 선배가 미끄러지듯 방 안으로 들어왔습니다.<br><br>
               선배는 문을 즉시 걸어 잠그더니 안도의 한숨을 내쉬었습니다. <em>"고마워... 점호 때 조장의 어긋난 그림자를 절대 쳐다보지 마. 내가 신호할게."</em><br><br>
               혼자가 아니라는 안도감과 함께 든든함이 차오릅니다. 하지만 선배의 손끝은 시체처럼 차갑고, 숨소리가 지나치게 고요합니다.<br>
               <strong>[ 👥 동행자 합류 : 3학년 선배? (넋 +15% 회복) ]</strong>`,
        choices: [
            {
                text: "선배와 함께 곧 닥칠 자정 점호를 맞이한다.",
                next: "p2_shadow"
            }
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
        secretHint: "🩸 [과거 입소자의 혈서] 그림자의 손가락은 8마디다. 그것을 바라보면 너의 턱관절도 함께 뒤틀린다.",
        text: `끼이익- 소리와 함께 호실 문이 열리고, 초롱불을 든 조장이 점호를 위해 들어섭니다.<br><br>
               그런데 초롱불에 비친 <strong>조장의 벽면 그림자가 소름 끼치게 어긋나 있습니다.</strong> 그림자의 손가락은 비정상적으로 길게 늘어져 있고, 관절이 기괴하게 뒤틀려 바닥에 웅크리고 있습니다. 눈앞의 조장은 태연한 얼굴로 출석부를 넘기고 있습니다.`,
        choices: [
            {
                text: "① 품 안의 주사 부적을 쥐며 마음을 가다듬는다.",
                next: "p2_talisman",
                requireItem: "talisman"
            },
            {
                text: "② 선배가 내 소매를 살짝 잡아당기며 보내는 신호에 따라 바닥만 응시한다.",
                next: "p2_headcount",
                requireCompanion: "senior"
            },
            {
                text: "③ 눈을 깜박이지 않고 표정 변화 없이 번호를 복창한다.",
                next: "p2_headcount"
            },
            {
                text: "④ 기겁하여 비명을 지르며 뒤로 물러선다.",
                next: "be2_shadow"
            }
        ]
    },

    p2_talisman: {
        stageTitle: "【 제2막 : 23:35 주사 부적의 은밀한 결계 】",
        time: "23:35 PM",
        sanChange: +15,
        image: "images/talisman.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 인원 점검이 끝나도 바로 안도하지 마라. 세 번째와 다섯 번째 사이에 숨어 있는 자가 있다.",
        text: `붉은 주사로 쓰인 부적의 온기가 손끝을 타고 전해지자, 일렁이던 벽면 그림자의 괴이한 형상이 희미하게 잦아듭니다.<br><br>
               어긋난 그림자를 자연스럽게 시야에서 지우며 담담한 목소리로 당신의 번호를 복창했습니다. 조장은 의심 없이 출석부에 체크를 마친 뒤 방을 나섰습니다. 유물이 당신의 정신을 지켜냈습니다.`,
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
            { text: "🔄 처음부터 다시 도전하기", next: "start" }
        ]
    },

    p2_headcount: {
        stageTitle: "【 제2막 : 00:00 자정 인원 점검 】",
        time: "00:00 AM",
        sanChange: 0,
        image: "images/dorm_dark_corner.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 네 번째 숨소리는 이름을 얻기 위해 기다리고 있다. 입 밖으로 숫자를 세는 순간 네 학적이 지워진다.",
        text: `조장이 나가고 문이 닫혔습니다. 방 안의 불을 끄고 침묵 속에 잠겨 있습니다.<br><br>
               그런데 어둠 속에서 들려오는 숨소리를 헤아려보니...<br>
               <em>하-아... 하-아... 하-아... 쉭-</em><br>
               방 안 옷장 옆 칠흑 같은 구석에서 <strong>분명히 존재해서는 안 될 낯선 숨소리</strong>가 들려옵니다!`,
        choices: [
            {
                text: "① 절대 소리 내지 않고, 모르는 척 침대에 누워 눈을 감는다.",
                next: "p2_search_drop"
            },
            {
                text: "② 룸메이트들과 서로 등을 맞대고 조용히 손을 잡는다.",
                next: "p2_note"
            },
            {
                text: "③ '어? 방에 왜 사람이 더 있지?' 허공을 손가락질하며 센다.",
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
        secretHint: "🩸 [과거 입소자의 혈서] 옷장 밑에서 굴러나온 쇠붙이를 놓치지 마라. 사칭의 음파를 찢을 유일한 무기다.",
        text: `말을 하면 숫자가 세어질까 두려워, 당신들은 침대 위에 모여 말없이 서로의 등을 맞댔습니다.<br><br>
               체온이 등으로 전해지자, 어두운 구석에서 들려오던 불길한 여분의 숨소리가 자리를 잡지 못하고 허공 속으로 천천히 흐려집니다. 침착한 대처로 위기를 넘겼습니다.`,
        choices: [
            {
                text: "숨소리가 사라진 옷장 구석을 조심스레 살펴본다.",
                next: "p2_find_whistle"
            },
            {
                text: "가부좌를 틀고 정화 묵송문으로 넋을 정돈한다.",
                next: "p2_meditation"
            }
        ]
    },

    p2_search_drop: {
        stageTitle: "【 제2막 : 00:08 어둠 속에서 굴러온 것 】",
        time: "00:08 AM",
        sanChange: +5,
        image: "images/dorm_dark_corner.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 옷장 바닥을 더듬어라. 묵직한 놋쇠의 감촉을 찾아라.",
        text: `침대에 누워 모르는 척 눈을 감자, 여분의 기척은 형태를 얻지 못하고 차가운 한기만 남긴 채 흩어졌습니다.<br><br>
               잠시 후, 텅 빈 옷장 아래 어둠 속에서 <em>딸깍- 데구르르</em> 하는 묵직한 쇠붙이 굴러가는 소리가 납니다.`,
        choices: [
            {
                text: "바닥에 굴러떨어진 물건을 확인한다.",
                next: "p2_find_whistle"
            },
            {
                text: "가부좌를 틀고 마음속으로 정화 주문을 암송한다.",
                next: "p2_meditation"
            }
        ]
    },

    p2_find_whistle: {
        stageTitle: "【 제2막 : 00:12 순찰 무인의 유류품 】",
        time: "00:12 AM",
        sanChange: +10,
        image: "images/whistle.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 호각은 복도에서 부는 것이 아니다. 문 안에서 밖을 향해 불어야 한다.",
        gainItem: {
            id: 'whistle',
            name: '놋쇠 호각',
            icon: '📯'
        },
        text: `바닥을 더듬자 차갑고 묵직한 금속체가 쥐어졌습니다.<br><br>
               정교한 연꽃 문양이 새겨진 <strong>순찰 무인의 놋쇠 호각</strong>입니다! 수칙 제2조에서 명시한, 교내의 모든 사칭과 홀림을 찢어발기는 신성한 유물입니다. 이전 순찰관이 떨어뜨린 것으로 보입니다.<br><br>
               당신은 호각을 바지 주머니 깊숙이 단단히 챙겨두었습니다.`,
        choices: [
            {
                text: "호각을 쥔 채 정화 묵송문으로 넋을 가다듬는다.",
                next: "p2_meditation"
            },
            {
                text: "호각을 숨기고 곧바로 새벽 시간을 대비한다.",
                next: "p3_murmur"
            }
        ]
    },

    p2_meditation: {
        stageTitle: "【 🧘 제2막 : 00:20 정화 묵송과 넋 정돈 】",
        time: "00:20 AM",
        sanChange: +20,
        image: "images/talisman.jpg",
        audio: "chant",
        secretHint: "🩸 [과거 입소자의 혈서] 새벽 1시 반, 잠꼬대가 네 목소리로 변한다. 절대 그 입을 깨우려 하지 마라.",
        text: `침대 한가운데 반듯하게 앉아 눈을 감았습니다.<br><br>
               수칙 제12조의 정화 주문을 소리 내지 않고 입안에서만 굴리며 묵송했습니다.<br>
               <em>'맑은 기운은 머물고, 탁한 것은 흩어지라...'</em><br><br>
               방 안을 맴돌던 기괴한 잔향이 씻겨 내려가고, 불안하게 뛰던 맥박이 고요하게 가라앉습니다.<br>
               <strong>[ 넋 회복 : 정화 묵송으로 넋의 안정도가 대폭 회복되었습니다 (+20%) ]</strong>`,
        choices: [
            {
                text: "맑아진 정신으로 새벽 1시 반을 맞이한다.",
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
            { text: "🔄 처음부터 다시 도전하기", next: "start" }
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
        secretHint: "🩸 [과거 입소자의 혈서] 동실인이 네 목소리로 속삭일 때 그의 손을 잡아 흔들면 목소리를 영원히 빼앗긴다.",
        text: `새벽 1시 반경, 옆 침대의 동실인이 잠꼬대를 시작합니다. 문제는 그 목소리가 <strong>당신과 토시 하나 틀리지 않은 '당신의 음색'</strong>이라는 점입니다!<br><br>
               심지어 낮에 당신 혼자 속으로만 생각했던 가장 은밀한 기억을 똑같은 목소리로 중얼거리고 있습니다. <em>"연습하는 게 아니야... 이미 다 익혔어..."</em>`,
        choices: [
            {
                text: "① 동행한 선배가 품에서 꺼내 건네준 스펀지 귀마개를 꽂는다.",
                next: "p3_earplugs",
                requireCompanion: "senior"
            },
            {
                text: "② 서랍 속 귀마개를 깊숙이 꽂고 정화 묵송문을 암송한다.",
                next: "p3_earplugs"
            },
            {
                text: "③ 이불을 머리끝까지 뒤집어쓰고 양귀를 필사적으로 틀어막는다.",
                next: "p3_call"
            },
            {
                text: "④ 너무 소름이 돋아 동실인의 어깨를 흔들어 깨운다.",
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
        secretHint: "🩸 [과거 입소자의 혈서] 02:30 문밖에서 가장 친한 친구의 목소리가 들린다. 하지만 호각 소리가 없다면 가짜다.",
        text: `스펀지 귀마개를 귓구멍 깊숙이 쑤셔 넣자, 방 안을 떠돌던 기괴한 도플갱어 음색이 먹먹한 침묵 속으로 차단되었습니다.<br><br>
               마음속으로만 정화 묵송문을 되뇌자, 귓가를 갉아먹던 음성 오염이 씻겨 내려갑니다.`,
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
            { text: "🔄 처음부터 다시 도전하기", next: "start" }
        ]
    },

    p3_call: {
        stageTitle: "【 제3막 : 02:30 놋쇠 호각 없는 부름 】",
        time: "02:30 AM",
        sanChange: 0,
        image: "images/creepy_corridor_night.jpg",
        audio: "roommate",
        secretHint: "🩸 [과거 입소자의 혈서] 호각이 있다면 지금 불어라! 문밖의 흉내 내는 놈은 호각 음파에 살갗이 찢긴다.",
        text: `얼마 후, 복도에서 다급한 발소리와 함께 방문을 쾅쾅 두드리는 소리가 납니다!<br><br>
               <em>"야! 철수야! 빨리 나와! 사감실 결계 터졌어! 다 대피하래! 나 민우야!"</em><br>
               가장 친한 동기 민우의 다급한 목소리입니다. <strong>하지만 복도에서는 순찰 무인의 놋쇠 호각 소리가 전혀 들리지 않았습니다.</strong>`,
        choices: [
            {
                text: "① 주머니 속 놋쇠 호각을 꺼내 문을 향해 힘껏 분다!",
                next: "p3_whistle_win",
                requireItem: "whistle"
            },
            {
                text: "② 호각 소리가 없음을 확인하고 이불 속에 엎드려 완벽히 침묵한다.",
                next: "p3_silent_wait"
            },
            {
                text: "③ '민우야! 진짜 너 맞아? 무슨 일이야?' 대답하며 문으로 간다.",
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
        secretHint: "🩸 [과거 입소자의 혈서] 베개 안감 속에 숨겨진 흰 실(백사)을 찾아라. 4시가 되면 반드시 필요하다.",
        text: `삐이익——! 날카롭고 서슬 퍼런 놋쇠 호각 소리가 방문을 뚫고 복도로 터져 나갑니다!<br><br>
               문밖에서 민우의 목소리로 속이려던 존재가 <strong>"크아아악!"</strong> 하는 찢어지는 비명을 지르며 복도 끝으로 허겁지겁 도망칩니다.<br>
               습득해둔 순찰 무인의 유물이 사칭 음성을 통쾌하게 격퇴했습니다!`,
        choices: [
            {
                text: "동실인들과 손을 꽉 쥐며 온기를 나눈다.",
                next: "p3_warmth"
            },
            {
                text: "수칙 13에 대비하여 베개 안감을 확인해둔다.",
                next: "p3_find_thread"
            }
        ]
    },

    p3_silent_wait: {
        stageTitle: "【 제3막 : 02:40 침묵의 인내 】",
        time: "02:40 AM",
        sanChange: -5,
        image: "images/door_thread.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 살아있는 자의 체온을 느껴라. 고립되면 환각이 시작된다.",
        text: `숨소리조차 내지 않고 침대에 엎드려 버텼습니다.<br><br>
               문밖의 존재는 한참 동안 문고리를 덜컹거리며 애원하다가, 아무 반응이 없자 낮게 투덜거리며 복도 저편으로 멀어져 갔습니다. 비록 신경이 곤두섰지만 문을 열지 않아 무사합니다.`,
        choices: [
            {
                text: "동실인들과 손을 꽉 쥐며 온기를 나눈다.",
                next: "p3_warmth"
            },
            {
                text: "수칙 13에 대비하여 베개 안감을 뒤져본다.",
                next: "p3_find_thread"
            }
        ]
    },

    p3_warmth: {
        stageTitle: "【 🤝 제3막 : 02:45 체온의 연대 】",
        time: "02:45 AM",
        sanChange: +20,
        image: "images/dorm_dark_corner.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 선배의 손을 잡았을 때 맥박이 뛰지 않았다면... 모르는 척해라.",
        text: `위기가 지나간 뒤, 당신과 룸메이트들은 침대 맡에 모여 서로의 떨리는 손을 말없이 꼭 쥐었습니다.<br><br>
               손바닥을 통해 살아있는 인간의 따뜻한 체온과 강한 심장 박동이 전해집니다. 이 공포 속에서 나 혼자가 아니라는 사실 하나만으로 얼어붙었던 영혼에 온기가 돕니다.<br><br>
               <strong>[ 넋 회복 : 동료와의 온기 연대로 넋의 안정도가 대폭 회복되었습니다 (+20%) ]</strong>`,
        choices: [
            {
                text: "수칙 13에 대비하여 베개 속 백사를 챙겨둔다.",
                next: "p3_find_thread"
            },
            {
                text: "창밖의 핏빛 기척에 대비한다.",
                next: "p4_blood_moon"
            }
        ]
    },

    p3_find_thread: {
        stageTitle: "【 제3막 : 02:50 베개 속 봉인 백사 】",
        time: "02:50 AM",
        sanChange: +10,
        image: "images/door_thread.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 창가 쪽 붉은 달빛을 직접 올려다보지 마라. 이성이 녹아내린다.",
        gainItem: {
            id: 'white_thread',
            name: '봉인 백사',
            icon: '🧵'
        },
        text: `수칙 제13조의 경고를 떠올리며, 당신은 베개 밑과 안감 솔기를 조심스럽게 더듬었습니다.<br><br>
               베개 안쪽 솔기 틈새에 가지런히 감겨 있던 <strong>질기고 팽팽한 백사(흰 실)</strong> 한 뼘이 손끝에 만져집니다! 7연속 타종 비상 정화령이 발효될 때 문고리를 봉인할 필수 결계 도구입니다.<br><br>
               실을 손닿는 머리맡에 조심스레 준비해두었습니다.`,
        choices: [
            {
                text: "창밖의 핏빛 기척에 대비한다.",
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
            { text: "🔄 처음부터 다시 도전하기", next: "start" }
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
        secretHint: "🩸 [과거 입소자의 혈서] 04:00 종이 일곱 번 울리면 외부 결계가 깨진다. 문고리를 백사로 세 바퀴 묶어라.",
        text: `새벽 3시 반, 창틀 틈새로 <strong>불길하고 끈적한 핏빛 붉은 광선</strong>이 방 안을 물들이기 시작합니다.<br><br>
               교내 뒷산 능선 위로 거대한 핏빛 보름달이 차올랐습니다. 창밖에서 신비로운 노랫소리 같은 환청이 들려오며 창문을 열어보고 싶은 충동이 강하게 듭니다.`,
        choices: [
            {
                text: "① 차광막을 단단히 내리고 창문을 등져 월광을 차단한다.",
                next: "p4_seven_bells"
            },
            {
                text: "② 방 안의 모든 불을 끄고 이불로 암실을 만들어 숨는다.",
                next: "p4_curtain"
            },
            {
                text: "③ 홀린 듯 창문을 열어 붉은 달빛을 직접 확인한다.",
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
        secretHint: "🩸 [과거 입소자의 혈서] 곧 종이 울린다. 긴장의 끈을 놓지 마라.",
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
            { text: "🔄 처음부터 다시 도전하기", next: "start" }
        ]
    },

    p4_seven_bells: {
        stageTitle: "【 🚨 제4막 : 04:00 비상 정화령 7연속 타종 】",
        time: "04:00 AM",
        sanChange: -15,
        image: "images/temple_bell_tower.jpg",
        audio: "bell",
        secretHint: "🩸 [과거 입소자의 혈서] 종이 그치고 한참 뒤에 어머니의 목소리가 들릴 것이다. 가장 취약한 기억을 파고드는 함정이다.",
        text: `차광막을 내리자마자, 생활관 뒷산에서 거대한 청동종이 울리기 시작합니다.<br>
               <strong>「당 — 당 — 당 — 당 — 당 — 당 — 당 —」</strong><br><br>
               정확히 일곱 번. <strong>비상 정화령 발효입니다!</strong><br>
               생활관 외부 결계가 깨졌습니다. 침실 밖 복도는 이제 인간의 영역이 아닙니다!`,
        choices: [
            {
                text: "① 챙겨둔 백사(흰 실)를 꺼내 문고리에 3회 결속하고 침대 중앙에 앉는다.",
                next: "p4_mother_trap",
                requireItem: "white_thread"
            },
            {
                text: "② 백사가 없어 옷 솔기의 실밥을 뜯어내며 필사적으로 문고리를 묶는다.",
                next: "p4_improvised_thread"
            },
            {
                text: "③ 당황하여 이성을 잃고 짐을 챙겨 복도 밖으로 뛰쳐나간다.",
                next: "be7_bells"
            }
        ]
    },

    p4_improvised_thread: {
        stageTitle: "【 🚨 제4막 : 04:05 불완전한 임시 결속 】",
        time: "04:05 AM",
        sanChange: -25,
        image: "images/door_thread.jpg",
        audio: "scratch",
        secretHint: "🩸 [과거 입소자의 혈서] 실이 약하다. 속으로 주문을 멈추지 마라.",
        text: `정식 백사가 준비되지 않아 옷자락을 찢어 문고리를 칭칭 감았습니다.<br><br>
               실이 팽팽하지 못해 문틈 사이로 차가운 서리 같은 한기가 계속해서 새어 들어옵니다. 문밖에서 무언가가 문고리를 덜컹거릴 때마다 심장이 내려앉습니다. 극심한 불안감 속에 식은땀이 비 오듯 쏟아집니다.`,
        choices: [
            {
                text: "침대 중앙에 주저앉아 귀를 막고 버틴다.",
                next: "p4_mother_trap"
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
            { text: "🔄 처음부터 다시 도전하기", next: "start" }
        ]
    },

    p4_mother_trap: {
        stageTitle: "【 🚨 제4막 : 04:30 가장 취약한 목소리의 덫 】",
        time: "04:30 AM",
        sanChange: -20,
        image: "images/door_thread.jpg",
        audio: "mimic",
        secretHint: "🩸 [과거 입소자의 혈서] 절대 열지 마라. 문틀을 쥐고 있는 것은 어머니가 아니라 뼈마디가 뒤틀린 짐승의 손이다.",
        text: `문고리를 결속하고 침대 한가운데 앉아 속으로 정화 주문을 읊습니다.<br><br>
               종이 그치고 한참 뒤... 방문 밖에서 울먹이는 소리와 함께 <strong>당신 어머니의 너무나 그립고 애타는 목소리</strong>가 들려옵니다.<br>
               <em>"아들아... 엄마야... 엄마가 널 데리러 왔단다... 밖이 너무 춥고 발이 아파... 문 좀 열어다오..."</em>`,
        choices: [
            {
                text: "① 품 안의 주사 부적을 꼭 쥐며 입술을 깨물고 묵송을 이어간다.",
                next: "p5_dawn",
                requireItem: "talisman"
            },
            {
                text: "② 동행한 선배가 내 손을 으스러지게 잡으며 고개를 가로젓는다.",
                next: "p4_chant_hold",
                requireCompanion: "senior"
            },
            {
                text: "③ '종이 그친 뒤에는 더더욱 열지 마라'를 되뇌며 필사적으로 참아낸다.",
                next: "p5_dawn"
            },
            {
                text: "④ 동실인들과 손을 꽉 쥐고 소리 없이 눈짓으로 버팀목이 되어준다.",
                next: "p4_chant_hold"
            },
            {
                text: "⑤ '엄마?! 엄마가 어떻게 여기에...' 눈물을 흘리며 문으로 다가간다.",
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
        secretHint: "🩸 [과거 입소자의 혈서] 05:00의 여명은 가짜다. 06:00 정규 기상 나팔이 울리기 전까지 한 발자국도 나가지 마라.",
        text: `어머니의 가슴 찢어지는 목소리에 눈물이 쏟아지려 할 때, 옆 동료가 당신의 떨리는 손을 꽉 잡았습니다.<br><br>
               서로의 온기가 마음을 다잡아 주었습니다. 문고리에 걸린 결속선은 팽팽하게 버텨냈고, 문밖의 존재는 방 안으로 들어오지 못했습니다.`,
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
        text: `손을 떨며 문을 벌컥 연 순간...<br><br>
               문밖에는 어머니가 없었습니다. 칠흑 같은 어둠 속에서 문틀을 쥐고 선 것은, 당신 어머니의 목소리로 흉내를 내며 헐떡이는 <strong>거대하고 뒤틀린 이형의 그림자</strong>였습니다.<br><br>
               <em>"종이 그치고 한참 뒤에 애타게 부르더라도... 그때는 더더욱 열지 마십시오..."</em><br>
               수칙의 마지막 문장이 귓가를 맴돌지만, 이미 늦었습니다.`,
        choices: [
            { text: "🔄 처음부터 다시 도전하기", next: "start" }
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
        secretHint: "🩸 [과거 입소자의 혈서] 창밖이 밝아 보여도 속지 마라. 시계가 06:00을 가리키고 나팔이 울려야 진짜 아침이다.",
        text: `문밖에서 어머니의 목소리로 애원하던 소리는, 당신들이 끝까지 문을 열지 않자 서서히 <em>기괴한 쇳소리와 거친 으르렁거림</em>으로 변하더니 어둠 속으로 서서히 멀어져 갔습니다.<br><br>
               창밖을 보니 푸르스름한 새벽안개가 자욱합니다. 마치 날이 밝은 것처럼 보이지만, 시계는 아직 <strong>05:00 AM</strong>을 가리키고 있습니다.`,
        choices: [
            {
                text: "① 06:00 정규 기상 나팔이 울릴 때까지 호실 안에서 침착하게 대기한다.",
                next: "p5_wait_six"
            },
            {
                text: "② '날이 밝았으니 끝났다!' 안도하며 문을 열고 조기 탈출한다.",
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
            { text: "🔄 처음부터 다시 도전하기", next: "start" }
        ]
    },

    p5_wait_six: {
        stageTitle: "【 제5막 : 05:55 여명의 인내와 정규 개문 】",
        time: "05:55 AM",
        sanChange: +15,
        image: "images/iron_door_lock.jpg",
        audio: null,
        secretHint: "🩸 [과거 입소자의 혈서] 복도 바닥에 떨어진 백색 털과 남의 명찰을 절대 줍지 마라.",
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
        secretHint: "🩸 [과거 입소자의 혈서] 앞만 보고 뛰어라. 운동장 햇살이 너를 살린다.",
        text: `복도로 나오자 밤새 벌어진 흔적이 역력합니다. 바닥 곳곳에 <strong>출처를 알 수 없는 고운 백색 털</strong>이 흩어져 있고, 302호 앞에는 반쯤 뜯겨 나간 훼손된 명찰이 떨어져 있습니다.<br><br>
               저 멀리 복도 코너에서 낯선 구형 교복을 입은 '혼 0반' 학생 개체가 무표정하게 걸어오고 있습니다.`,
        choices: [
            {
                text: "① 바닥의 털과 명찰을 일절 보지 않고 정면만 응시하며 당당히 걷는다.",
                next: "true_ending"
            },
            {
                text: "② 동실인들과 나란히 발을 맞추어 묵묵히 중앙 현관으로 전진한다.",
                next: "true_ending"
            },
            {
                text: "③ 마음속으로 정화 묵송문을 암송하며 운동장 햇살을 향해 내달린다.",
                next: "true_ending"
            },
            {
                text: "④ 바닥의 훼손된 명찰이 누구 것인지 집어 들어 확인한다.",
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
            { text: "🔄 처음부터 다시 도전하기", next: "start" }
        ]
    },

    // =========================================================================
    // [ 🏆 최종 생존 엔딩 : 동일 엔딩 수렴 (True Ending) ]
    // =========================================================================
    true_ending: {
        stageTitle: "【 🏆 생존 판정 : 06:30 아침 점호 완료 (귀환) 】",
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
            { text: "📖 안전 수칙 전문 (제1~3장) 복습하기", url: "about.html" },
            { text: "🚨 제4장 비상 정화령 지침 점검하기", url: "portfolio.html" }
        ]
    }
};

// ==========================================================================
// 게임 런타임 제어 & 신규 기믹 엔진 (글리치, 암전 투시경, 동행자, 증서)
// ==========================================================================
let currentSan = 100;
let currentCompanion = null; // null | 'senior'
let isLanternOff = false;
const playerInventory = new Set();

const ALL_RELICS = [
    { id: 'talisman', icon: '📜', name: '주사 부적' },
    { id: 'whistle', icon: '📯', name: '놋쇠 호각' },
    { id: 'white_thread', icon: '🧵', name: '봉인 백사' }
];

function updateRelicsHUD() {
    const hudEl = document.getElementById("relic-icons");
    if (!hudEl) return;

    hudEl.innerHTML = ALL_RELICS.map(r => {
        const has = playerInventory.has(r.id);
        return `<span class="relic-slot ${has ? 'acquired' : ''}" title="${r.name}: ${has ? '소지 중 (위기 시 사용 가능)' : '미소지'}">${r.icon}</span>`;
    }).join("");
}

function updateCompanionHUD() {
    const compEl = document.getElementById("companion-badge");
    if (!compEl) return;

    if (currentCompanion === "senior") {
        compEl.textContent = "선배? 👥";
        compEl.className = "companion-badge active";
        compEl.title = "동행 중: 3학년 선배 (조력자인가, 괴이인가?)";
    } else {
        compEl.textContent = "단독 👤";
        compEl.className = "companion-badge";
        compEl.title = "혼자 생존 중";
    }
}

// 암전 모드 (초롱불 끄기/켜기 토글)
function toggleLantern(btn) {
    const paper = document.getElementById("scroll-paper");
    const toggleBtn = btn || document.getElementById("lantern-toggle-btn");
    isLanternOff = !isLanternOff;

    if (isLanternOff) {
        if (paper) paper.classList.add("dark-active");
        if (toggleBtn) {
            toggleBtn.classList.add("dark-mode");
            toggleBtn.innerHTML = "🕯️ 초롱불 켜기";
        }
        if (typeof showToast === 'function') {
            showToast("🕯️ 초롱불을 껐습니다. 마우스로 어둠 속을 비춰 숨겨진 혈서를 확인하십시오.");
        }
    } else {
        if (paper) paper.classList.remove("dark-active");
        if (toggleBtn) {
            toggleBtn.classList.remove("dark-mode");
            toggleBtn.innerHTML = "🕯️ 초롱불 끄기";
        }
        if (typeof showToast === 'function') {
            showToast("🕯️ 초롱불을 켰습니다.");
        }
    }
}

// 손전등 마우스 트래킹
document.addEventListener("mousemove", (e) => {
    const paper = document.getElementById("scroll-paper");
    if (!paper || !isLanternOff) return;
    const rect = paper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    paper.style.setProperty("--mouse-x", `${x}px`);
    paper.style.setProperty("--mouse-y", `${y}px`);
});

// 결과 복사 (생존 증서 / 사망 통보서)
function copyCertificateText(isSurvival, cause) {
    const dateStr = new Date().toLocaleDateString("ko-KR");
    const relicsList = Array.from(playerInventory).map(id => {
        const item = ALL_RELICS.find(r => r.id === id);
        return item ? item.name : id;
    }).join(", ") || "없음";
    const compText = currentCompanion === "senior" ? "실종된 선배와 함께 귀환" : "단독 생존";

    let text = "";
    if (isSurvival) {
        text = `[ 📜 화랑골 생활관 불침번 수호 생존 증명서 ]\n` +
               `발급 일자: ${dateStr}\n` +
               `판정 결과: 최종 생존 (학적 유지 승인)\n` +
               `최종 넋의 안정도: ${currentSan}%\n` +
               `소지 유물: ${relicsList}\n` +
               `동행 상태: ${compText}\n` +
               `발급처: 화랑골 관리실 공인 [생존 승인]`;
    } else {
        text = `[ 💀 화랑골 생활관 학적 영구 말소 통보서 ]\n` +
               `발급 일자: ${dateStr}\n` +
               `사망/실종 사유: ${cause || "심야 금기 위반"}\n` +
               `최종 넋의 안정도: 0% (영구 격리)\n` +
               `발급처: 화랑골 사감실 [학적 말소]`;
    }

    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            if (typeof showToast === 'function') showToast("📋 증서 결과가 클립보드에 복사되었습니다!");
        }).catch(() => {
            if (typeof showToast === 'function') showToast("⚠️ 복사 실패");
        });
    }
}

function renderStage(stageKey) {
    const stage = GAME_STAGES[stageKey];
    if (!stage) return;

    // 0. 게임 시작 및 사망 후 재시작 시 넋 수치 100% 완전 복구 및 상태 초기화
    if (stageKey === "start") {
        currentSan = 100;
        currentCompanion = null;
        playerInventory.clear();
        updateRelicsHUD();
        updateCompanionHUD();
        const sanBar = document.getElementById("san-bar");
        const sanText = document.getElementById("san-text");
        if (sanBar && sanText) {
            sanBar.style.width = "100%";
            sanBar.style.backgroundColor = "#98c379";
            sanText.textContent = "100%";
        }
    }

    // 1. 유물 습득 이벤트 처리
    if (stage.gainItem && !playerInventory.has(stage.gainItem.id)) {
        playerInventory.add(stage.gainItem.id);
        updateRelicsHUD();
        if (typeof showToast === 'function') {
            showToast(`🎒 [유물 습득] ${stage.gainItem.icon} ${stage.gainItem.name}을(를) 챙겼습니다!`);
        }
    }

    // 2. 동행자 합류 이벤트 처리
    if (stage.setCompanion) {
        currentCompanion = stage.setCompanion;
        updateCompanionHUD();
    }

    // 3. 시간 갱신
    const timeEl = document.getElementById("game-time");
    if (timeEl) timeEl.textContent = stage.time;

    // 4. SAN치(넋의 안정도) 갱신 및 회복 알림
    if (stageKey !== "start") {
        currentSan = Math.max(0, Math.min(100, currentSan + (stage.sanChange || 0)));
        if (stage.sanChange && stage.sanChange > 0 && typeof showToast === 'function' && stageKey !== "true_ending") {
            showToast(`🧘 [넋 회복] 넋의 안정도가 회복되었습니다 (+${stage.sanChange}%)`);
        }
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

    // 5. 정신 오염 글리치 연출 (SAN <= 40%)
    const storyBox = document.getElementById("story-container");
    if (storyBox) {
        if (currentSan <= 40 && !stage.isEnding) {
            storyBox.classList.add("san-corrupted");
        } else {
            storyBox.classList.remove("san-corrupted");
        }
    }

    // 6. 텍스트 및 제목
    const titleEl = document.getElementById("story-stage-title");
    const textEl = document.getElementById("story-text");
    if (titleEl) titleEl.innerHTML = stage.stageTitle;

    // 동행자 반전 연출: 트루 엔딩 시 선배가 동행 중이면 반전 서사 추가
    let mainText = stage.text;
    if (stageKey === "true_ending" && currentCompanion === "senior") {
        mainText += `<br><br><div style="border-left: 3px solid #ff4455; padding-left: 12px; margin-top: 14px; color: #ff99aa;">
                     당신은 함께 살아남았다고 안도하며 밤새 동행했던 선배를 돌아보았습니다.<br><br>
                     하지만 선배의 가슴에 달린 낡은 구형 명찰에는... <strong>10년 전 생활관에서 실종 처리된 학생의 이름</strong>이 적혀 있었습니다.<br><br>
                     사감장은 마이크로 분명히 <em>"전원 1명 생존"</em>이라 발표했습니다. 사감장의 눈에는 당신 혼자만 보였던 것입니다.<br><br>
                     선배는 말없이 당신을 향해 기괴하게 미소를 짓고는, 아침 햇살과 안개 속으로 조용히 녹아 사라졌습니다.<br>
                     <em>(그는 괴이였을까, 아니면 단지 아침까지 함께 있어줄 사람이 필요했던 영혼이었을까...?)</em>
                     </div>`;
    }
    if (textEl) textEl.innerHTML = mainText;

    // 7. 암전 시 드러나는 숨은 혈서 주입
    const hintEl = document.getElementById("blood-secret-hint");
    if (hintEl) {
        if (stage.secretHint) {
            hintEl.innerHTML = stage.secretHint;
        } else {
            hintEl.innerHTML = "🩸 [벽면 혈서] 뒤를 돌아보지 마라. 불을 끄면 보이지 않던 것이 너를 주시한다.";
        }
    }

    // 8. 이미지 렌더링 (모든 스테이지 100% 필수)
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

    // 9. 선택지 버튼 렌더링 (유물 소지 & 동행자 조건 필터링)
    const choicesBox = document.getElementById("choices-container");
    if (choicesBox) {
        choicesBox.innerHTML = "";

        // 엔딩 / 배드엔딩 증명서 카드 동적 렌더링
        if (stage.isEnding) {
            const certCard = document.createElement("div");
            if (stageKey === "true_ending") {
                const relicsList = Array.from(playerInventory).map(id => {
                    const item = ALL_RELICS.find(r => r.id === id);
                    return item ? item.name : id;
                }).join(", ") || "없음";
                const compText = currentCompanion === "senior" ? "실종된 선배와 함께 귀환" : "단독 생존";

                certCard.className = "certificate-card";
                certCard.innerHTML = `
                    <h4 style="color: #ffd899; margin-bottom: 6px; font-size: 16px;">📜 화랑골 생활관 불침번 수호 생존 증명서</h4>
                    <div class="cert-seal">생 · 존 · 인 · 증</div>
                    <div class="cert-meta">
                        • <strong>판정 결과</strong> : 공식 생존 확인 (학적 유지 승인)<br>
                        • <strong>잔여 넋의 안정도</strong> : <span style="color: #98c379; font-weight: 800;">${currentSan}%</span><br>
                        • <strong>소지 결계 유물</strong> : ${relicsList}<br>
                        • <strong>동행 상태</strong> : ${compText}<br>
                        • <strong>공인 기관</strong> : 화랑골 생활관 제3종 관리사무소
                    </div>
                    <button class="cert-copy-btn" onclick="copyCertificateText(true)">📋 생존 증명서 복사 및 결과 공유</button>
                `;
            } else {
                certCard.className = "certificate-card death";
                certCard.innerHTML = `
                    <h4 style="color: #ff7788; margin-bottom: 6px; font-size: 16px;">💀 학적 영구 말소 및 교내 실종 통보서</h4>
                    <div class="cert-seal death">학 · 적 · 말 · 소</div>
                    <div class="cert-meta">
                        • <strong>판정 결과</strong> : 심야 금기 침탈로 인한 영구 실종<br>
                        • <strong>사망 원인</strong> : ${stage.stageTitle.replace(/[【】]/g, "")}<br>
                        • <strong>실종 시각</strong> : ${stage.time}<br>
                        • <strong>조치 사항</strong> : 학적 영구 말소 및 교내 기억 삭제 프로토콜 시행
                    </div>
                    <button class="cert-copy-btn" onclick="copyCertificateText(false, '${stage.stageTitle.replace(/[【】]/g, "")}')">📋 실종 통보서 복사 및 공유</button>
                `;
            }
            choicesBox.appendChild(certCard);
        }

        stage.choices.forEach(ch => {
            // 유물 필요 조건 확인
            if (ch.requireItem && !playerInventory.has(ch.requireItem)) {
                return;
            }
            // 동행자 필요 조건 확인
            if (ch.requireCompanion && currentCompanion !== ch.requireCompanion) {
                return;
            }

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

    // 10. 무대 음향/음성 효과 재생
    if (stage.audio && typeof playAudioClip === 'function') {
        try {
            playAudioClip(stage.audio, null, 0.75);
        } catch (e) {
            console.warn("오디오 재생 보류:", e);
        }
    }

    // 11. 두루마리 스크롤 상단 리셋
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
        showToast("📯 놋쇠 호각 소리가 삐이익- 울립니다! (수칙 2조 준수)");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateRelicsHUD();
    updateCompanionHUD();
    if (document.getElementById("story-container")) {
        renderStage("start");
    }
});
