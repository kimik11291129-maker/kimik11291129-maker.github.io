// ==========================================================================
// [[나폴리탄 괴담] 심판의 날 안전수칙 시리즈 몰아보기 | 공포라디오 | 무서운이야기 | 매뉴얼 괴담 | 공포썰 | 수면영상 | 자기전 보는 영상] 화랑골 인터랙티브 나폴리탄 게임북 엔진
// ==========================================================================

const GAME_STAGES = {
    "start": {
        "stageTitle": "【 제1막 : 22:00 PM 수칙서의 발견과 개막 】",
        "time": "22:00 PM",
        "sanChange": 0,
        "image": "images/creepy_corridor_night.jpg",
        "audio": "drone",
        "secretHint": "🩸 [선배 피해자의 혈서] '축하드립니다이 수서를 받았다는 것은 귀하가' 수칙을 가볍게 여기는 순간, 오늘 밤은 당신의 무덤이 된다.",
        "text": "<strong>[나폴리탄 괴담] 심판의 날 안전수칙 시리즈 몰아보기 | 공포라디오 | 무서운이야기 | 매뉴얼 괴담 | 공포썰 | 수면영상 | 자기전 보는 영상</strong>의 현장에 발을 들이자 묵직한 침묵과 함께 바깥과의 경계가 차단되었습니다.<br><br>정면 낡은 판자에 붉은 잉크로 휘갈겨 쓴 <strong>[생존 안내 수칙서]</strong>가 놓여 있습니다. 총 6가지 금기가 적혀 있습니다.<br><br>원작 작가 <em>미스터리북</em>의 기록에 따르면, 첫 번째 수칙 <strong>[축하드립니다이 수서를 받았다는 것은 귀하가]</strong>의 전조가 서서히 시작되려 합니다.",
        "choices": [
            {
                "text": "① 수칙 제1조 [축하드립니다이 수서를 받았다는 것은 귀하가]에 집중하며 숨을 죽인다.",
                "next": "stage_r1"
            },
            {
                "text": "② 현장 주변을 조심스럽게 탐색하여 비상 방어 도구를 찾는다.",
                "next": "stage_search_item"
            },
            {
                "text": "③ 헛소리라 여기며 수칙을 무시하고 태연하게 행동한다.",
                "next": "bad_end_disregard"
            }
        ],
        "isEnding": false,
        "endingType": null
    },
    "stage_search_item": {
        "stageTitle": "【 제1막 : 22:15 숨겨진 결계 유물 발견 】",
        "time": "22:15 PM",
        "sanChange": 10,
        "image": "images/talisman.jpg",
        "audio": "whistle",
        "secretHint": "🩸 [혈서] 손에 쥔 비상 도구는 자정이 넘은 위급 상황에서 단 한 번 당신의 목숨을 건질 것이다.",
        "gainItem": {
            "id": "relic_item",
            "name": "비상 결계 부적",
            "icon": "📜"
        },
        "text": "당신은 숨을 죽인 채 서랍 안쪽 깊숙한 곳을 조심스럽게 살폈습니다.<br><br>이전 생존자가 숨겨둔 <strong>[비상 결계 부적 📜]</strong>과 경고 쪽지가 발견되었습니다.<br><br>유물을 품에 챙기자 서늘했던 손끝에 온기가 돌며 넋의 안정도가 소폭 회복됩니다 (+10%).",
        "choices": [
            {
                "text": "유물을 지닌 채 제1수칙 [축하드립니다이 수서를 받았다는 것은 귀하가]의 이상 징후에 대처한다.",
                "next": "stage_r1"
            }
        ],
        "isEnding": false,
        "endingType": null
    },
    "stage_r1": {
        "stageTitle": "【 제1막 : 23:20 PM 축하드립니다이 수서를 받았다는 것은 귀하가 】",
        "time": "23:20 PM",
        "sanChange": -20,
        "image": "images/beast_shadow.jpg",
        "audio": "drone",
        "secretHint": "🩸 [혈서 힌트] 제1조 '축하드립니다이 수서를 받았다는 것은 귀하가': 의문을 갖지 마라. 지침대로 행동하지 않으면 그것이 바로 눈앞까지 다가온다.",
        "text": "시각은 23:20 PM. 주변 공기가 급격히 냉각되며 <strong>제 1 수칙 [축하드립니다이 수서를 받았다는 것은 귀하가]</strong>의 현상이 나타나기 시작합니다.<br><br><em>\"축하드립니다이 수서를 받았다는 것은 귀하가 그만큼 가치가 있는 존재로 판단되었다 것입니다이 수칙을 받지 못한 인간들은 지금으로부터 3일 뒤 찾아올 심판의 날에서 끔찍한 최후를 맞이할 것입니다 그러나 귀하는 저희의 생각하에 목숨을 연명할 가치가 있다고 판단되었기에 끔찍한 최후는 면할 수 있는 기회를 받으셨습니다 다음 사항을...\"</em><br><br>수칙서의 경고대로 한 치의 오차도 없는 공포가 바로 눈앞까지 닥쳐왔습니다.",
        "choices": [
            {
                "text": "① [수칙 준수] 지침에 따라 철저하게 행동하며 버틴다.",
                "next": "stage_r2"
            },
            {
                "text": "② [유물 활용] 소지한 결계 부적의 기운으로 위기를 모면한다.",
                "requireItem": "relic_item",
                "next": "stage_r2"
            },
            {
                "text": "③ [수칙 위반] 호기심을 참지 못하거나 공포에 질려 금기된 행동을 저지른다.",
                "next": "bad_end_r1"
            }
        ],
        "isEnding": false,
        "endingType": null
    },
    "bad_end_r1": {
        "stageTitle": "💀 【 영구 실종 : 제1수칙 [축하드립니다이 수서를 받았다는 것은 귀하가] 위반 】",
        "time": "23:20 PM",
        "sanChange": -100,
        "image": "images/beast_shadow.jpg",
        "audio": "mimic",
        "secretHint": "🩸 [사망 확인서] 수칙을 지키지 않은 자에게 두 번째 기회는 주어지지 않습니다.",
        "text": "당신은 제 1 수칙 <strong>[축하드립니다이 수서를 받았다는 것은 귀하가]</strong>의 금기를 깨뜨렸습니다.<br><br><em>\"축하드립니다이 수서를 받았다는 것은 귀하가 그만큼 가치가 있는 존재로 판단되었다 것입니다이 수칙을 받지 못한 인간들은 지금으로부터 3일 뒤 찾아올 심판의 날에서 끔찍한 최후를 맞이...\"</em><br><br>그것이 순식간에 당신의 숨통을 조여왔으며, 차가운 어둠 속으로 끌려들어 갔습니다.<br>당신의 이름은 실종자 명단에 영구히 기록되었습니다.",
        "choices": [
            {
                "text": "🔄 처음부터 다시 시도한다.",
                "next": "start"
            },
            {
                "text": "📚 나폴리탄 서고로 돌아가기",
                "url": "gamebooks.html"
            }
        ],
        "isEnding": true,
        "endingType": "DEATH"
    },
    "stage_r2": {
        "stageTitle": "【 제1막 : 01:00 AM 종말의 축제 해당 수서 1에서 3쪽 1번을 】",
        "time": "01:00 AM",
        "sanChange": -5,
        "image": "images/creepy_corridor_night.jpg",
        "audio": "drone",
        "secretHint": "🩸 [혈서 힌트] 제2조 '종말의 축제 해당 수서 1에서 3쪽 1번을': 의문을 갖지 마라. 지침대로 행동하지 않으면 그것이 바로 눈앞까지 다가온다.",
        "text": "시각은 01:00 AM. 주변 공기가 급격히 냉각되며 <strong>제 2 수칙 [종말의 축제 해당 수서 1에서 3쪽 1번을]</strong>의 현상이 나타나기 시작합니다.<br><br><em>\"종말의 축제 해당 수서 1에서 3쪽 1번을 4에서 6쪽 쪽은 2번을 7에서 9쪽 3번을 10에서 12 쪽은 4번을 12에서 15 쪽은 5번을 다룹니다 반드시 숙지하여 우리와 함께 새로운 세상을 목도하게 바랍니다\"</em><br><br>수칙서의 경고대로 한 치의 오차도 없는 공포가 바로 눈앞까지 닥쳐왔습니다.",
        "choices": [
            {
                "text": "① [수칙 준수] 지침에 따라 철저하게 행동하며 버틴다.",
                "next": "stage_r3"
            },
            {
                "text": "② [유물 활용] 소지한 결계 부적의 기운으로 위기를 모면한다.",
                "requireItem": "relic_item",
                "next": "stage_r3"
            },
            {
                "text": "③ [수칙 위반] 호기심을 참지 못하거나 공포에 질려 금기된 행동을 저지른다.",
                "next": "bad_end_r2"
            }
        ],
        "isEnding": false,
        "endingType": null
    },
    "bad_end_r2": {
        "stageTitle": "💀 【 영구 실종 : 제2수칙 [종말의 축제 해당 수서 1에서 3쪽 1번을] 위반 】",
        "time": "01:00 AM",
        "sanChange": -100,
        "image": "images/beast_shadow.jpg",
        "audio": "mimic",
        "secretHint": "🩸 [사망 확인서] 수칙을 지키지 않은 자에게 두 번째 기회는 주어지지 않습니다.",
        "text": "당신은 제 2 수칙 <strong>[종말의 축제 해당 수서 1에서 3쪽 1번을]</strong>의 금기를 깨뜨렸습니다.<br><br><em>\"종말의 축제 해당 수서 1에서 3쪽 1번을 4에서 6쪽 쪽은 2번을 7에서 9쪽 3번을 10에서 12 쪽은 4번을 12에서 15 쪽은 5번을 다룹니다 반드시 숙지하여 우리와 함께 ...\"</em><br><br>그것이 순식간에 당신의 숨통을 조여왔으며, 차가운 어둠 속으로 끌려들어 갔습니다.<br>당신의 이름은 실종자 명단에 영구히 기록되었습니다.",
        "choices": [
            {
                "text": "🔄 처음부터 다시 시도한다.",
                "next": "start"
            },
            {
                "text": "📚 나폴리탄 서고로 돌아가기",
                "url": "gamebooks.html"
            }
        ],
        "isEnding": true,
        "endingType": "DEATH"
    },
    "stage_r3": {
        "stageTitle": "【 제2막 : 02:30 AM 전염병의 축제입니다 남극 연구동 토층 하단에 】",
        "time": "02:30 AM",
        "sanChange": -20,
        "image": "images/companion_shadow.jpg",
        "audio": "drone",
        "secretHint": "🩸 [혈서 힌트] 제3조 '전염병의 축제입니다 남극 연구동 토층 하단에': 의문을 갖지 마라. 지침대로 행동하지 않으면 그것이 바로 눈앞까지 다가온다.",
        "text": "시각은 02:30 AM. 주변 공기가 급격히 냉각되며 <strong>제 3 수칙 [전염병의 축제입니다 남극 연구동 토층 하단에]</strong>의 현상이 나타나기 시작합니다.<br><br><em>\"전염병의 축제입니다 남극 연구동 토층 하단에 숨겨져 있던 미지의 고대 바이러스가 우리의 조력자에 의해 세상에 드러나기 시작함으로써 시작됩니다 해당 바이러스는 접촉 전염 인수공통 감염병으로 신경전달 물질의 작용을 어그러 뜨려 몸의 주인이 몸을 자유롭게 쓸 수 없게 만들고 뇌가 내장 기관에 내리는 명령을 왜곡하여 몸을 깨뜨립...\"</em><br><br>수칙서의 경고대로 한 치의 오차도 없는 공포가 바로 눈앞까지 닥쳐왔습니다.",
        "choices": [
            {
                "text": "① [수칙 준수] 지침에 따라 철저하게 행동하며 버틴다.",
                "next": "stage_r4"
            },
            {
                "text": "② [유물 활용] 소지한 결계 부적의 기운으로 위기를 모면한다.",
                "requireItem": "relic_item",
                "next": "stage_r4"
            },
            {
                "text": "③ [수칙 위반] 호기심을 참지 못하거나 공포에 질려 금기된 행동을 저지른다.",
                "next": "bad_end_r3"
            }
        ],
        "isEnding": false,
        "endingType": null
    },
    "bad_end_r3": {
        "stageTitle": "💀 【 영구 실종 : 제3수칙 [전염병의 축제입니다 남극 연구동 토층 하단에] 위반 】",
        "time": "02:30 AM",
        "sanChange": -100,
        "image": "images/beast_shadow.jpg",
        "audio": "mimic",
        "secretHint": "🩸 [사망 확인서] 수칙을 지키지 않은 자에게 두 번째 기회는 주어지지 않습니다.",
        "text": "당신은 제 3 수칙 <strong>[전염병의 축제입니다 남극 연구동 토층 하단에]</strong>의 금기를 깨뜨렸습니다.<br><br><em>\"전염병의 축제입니다 남극 연구동 토층 하단에 숨겨져 있던 미지의 고대 바이러스가 우리의 조력자에 의해 세상에 드러나기 시작함으로써 시작됩니다 해당 바이러스는 접촉 전염 인수공통 감...\"</em><br><br>그것이 순식간에 당신의 숨통을 조여왔으며, 차가운 어둠 속으로 끌려들어 갔습니다.<br>당신의 이름은 실종자 명단에 영구히 기록되었습니다.",
        "choices": [
            {
                "text": "🔄 처음부터 다시 시도한다.",
                "next": "start"
            },
            {
                "text": "📚 나폴리탄 서고로 돌아가기",
                "url": "gamebooks.html"
            }
        ],
        "isEnding": true,
        "endingType": "DEATH"
    },
    "stage_r4": {
        "stageTitle": "【 제2막 : 03:45 AM 종말의 축제 종료까지 살아남는다면 당신은 모 】",
        "time": "03:45 AM",
        "sanChange": -20,
        "image": "images/beast_shadow.jpg",
        "audio": "broadcast",
        "secretHint": "🩸 [혈서 힌트] 제4조 '종말의 축제 종료까지 살아남는다면 당신은 모': 의문을 갖지 마라. 지침대로 행동하지 않으면 그것이 바로 눈앞까지 다가온다.",
        "text": "시각은 03:45 AM. 주변 공기가 급격히 냉각되며 <strong>제 4 수칙 [종말의 축제 종료까지 살아남는다면 당신은 모]</strong>의 현상이 나타나기 시작합니다.<br><br><em>\"종말의 축제 종료까지 살아남는다면 당신은 모든 노고에 대한 보상으로 영원한 구원을 받을 수 있을 것입니다 부이 끝까지 살아남아 저희를 즐겁게 해주세요 나는이 말하 좀 스럽지만 아무튼 미지의 존재에게 구원을 받아 수서를 지닌 사람이다 세상에 미지의 바이러스가 퍼진지 언 5일째 나는 요즘 집에서 책을 읽거나 내 최애 브이로거...\"</em><br><br>수칙서의 경고대로 한 치의 오차도 없는 공포가 바로 눈앞까지 닥쳐왔습니다.",
        "choices": [
            {
                "text": "① [수칙 준수] 지침에 따라 철저하게 행동하며 버틴다.",
                "next": "stage_r5"
            },
            {
                "text": "② [유물 활용] 소지한 결계 부적의 기운으로 위기를 모면한다.",
                "requireItem": "relic_item",
                "next": "stage_r5"
            },
            {
                "text": "③ [수칙 위반] 호기심을 참지 못하거나 공포에 질려 금기된 행동을 저지른다.",
                "next": "bad_end_r4"
            }
        ],
        "isEnding": false,
        "endingType": null
    },
    "bad_end_r4": {
        "stageTitle": "💀 【 영구 실종 : 제4수칙 [종말의 축제 종료까지 살아남는다면 당신은 모] 위반 】",
        "time": "03:45 AM",
        "sanChange": -100,
        "image": "images/beast_shadow.jpg",
        "audio": "mimic",
        "secretHint": "🩸 [사망 확인서] 수칙을 지키지 않은 자에게 두 번째 기회는 주어지지 않습니다.",
        "text": "당신은 제 4 수칙 <strong>[종말의 축제 종료까지 살아남는다면 당신은 모]</strong>의 금기를 깨뜨렸습니다.<br><br><em>\"종말의 축제 종료까지 살아남는다면 당신은 모든 노고에 대한 보상으로 영원한 구원을 받을 수 있을 것입니다 부이 끝까지 살아남아 저희를 즐겁게 해주세요 나는이 말하 좀 스럽지만 아무...\"</em><br><br>그것이 순식간에 당신의 숨통을 조여왔으며, 차가운 어둠 속으로 끌려들어 갔습니다.<br>당신의 이름은 실종자 명단에 영구히 기록되었습니다.",
        "choices": [
            {
                "text": "🔄 처음부터 다시 시도한다.",
                "next": "start"
            },
            {
                "text": "📚 나폴리탄 서고로 돌아가기",
                "url": "gamebooks.html"
            }
        ],
        "isEnding": true,
        "endingType": "DEATH"
    },
    "stage_r5": {
        "stageTitle": "【 제3막 : 05:10 AM 빛과 어둠의 축제부터 저희가 임의로 시스템을 】",
        "time": "05:10 AM",
        "sanChange": -5,
        "image": "images/creepy_corridor_night.jpg",
        "audio": "drone",
        "secretHint": "🩸 [혈서 힌트] 제5조 '빛과 어둠의 축제부터 저희가 임의로 시스템을': 의문을 갖지 마라. 지침대로 행동하지 않으면 그것이 바로 눈앞까지 다가온다.",
        "text": "시각은 05:10 AM. 주변 공기가 급격히 냉각되며 <strong>제 5 수칙 [빛과 어둠의 축제부터 저희가 임의로 시스템을]</strong>의 현상이 나타나기 시작합니다.<br><br><em>\"빛과 어둠의 축제부터 저희가 임의로 시스템을 투입할 것입니다 시스템이란 인간계의 물리 법칙을 깨뜨리고 개입된 새로운 체계입니다 저희보다 상위 체계이기 저희의 임의적 조작이 불가능합니다\"</em><br><br>수칙서의 경고대로 한 치의 오차도 없는 공포가 바로 눈앞까지 닥쳐왔습니다.",
        "choices": [
            {
                "text": "① [수칙 준수] 지침에 따라 철저하게 행동하며 버틴다.",
                "next": "stage_r6"
            },
            {
                "text": "② [유물 활용] 소지한 결계 부적의 기운으로 위기를 모면한다.",
                "requireItem": "relic_item",
                "next": "stage_r6"
            },
            {
                "text": "③ [수칙 위반] 호기심을 참지 못하거나 공포에 질려 금기된 행동을 저지른다.",
                "next": "bad_end_r5"
            }
        ],
        "isEnding": false,
        "endingType": null
    },
    "bad_end_r5": {
        "stageTitle": "💀 【 영구 실종 : 제5수칙 [빛과 어둠의 축제부터 저희가 임의로 시스템을] 위반 】",
        "time": "05:10 AM",
        "sanChange": -100,
        "image": "images/beast_shadow.jpg",
        "audio": "mimic",
        "secretHint": "🩸 [사망 확인서] 수칙을 지키지 않은 자에게 두 번째 기회는 주어지지 않습니다.",
        "text": "당신은 제 5 수칙 <strong>[빛과 어둠의 축제부터 저희가 임의로 시스템을]</strong>의 금기를 깨뜨렸습니다.<br><br><em>\"빛과 어둠의 축제부터 저희가 임의로 시스템을 투입할 것입니다 시스템이란 인간계의 물리 법칙을 깨뜨리고 개입된 새로운 체계입니다 저희보다 상위 체계이기 저희의 임의적 조작이 불가능합...\"</em><br><br>그것이 순식간에 당신의 숨통을 조여왔으며, 차가운 어둠 속으로 끌려들어 갔습니다.<br>당신의 이름은 실종자 명단에 영구히 기록되었습니다.",
        "choices": [
            {
                "text": "🔄 처음부터 다시 시도한다.",
                "next": "start"
            },
            {
                "text": "📚 나폴리탄 서고로 돌아가기",
                "url": "gamebooks.html"
            }
        ],
        "isEnding": true,
        "endingType": "DEATH"
    },
    "stage_r6": {
        "stageTitle": "【 제3막 : 06:00 AM 빛과 어둠의 축제 부턴 시스템이 개입되어 인 】",
        "time": "06:00 AM",
        "sanChange": -20,
        "image": "images/beast_shadow.jpg",
        "audio": "mimic",
        "secretHint": "🩸 [혈서 힌트] 제6조 '빛과 어둠의 축제 부턴 시스템이 개입되어 인': 의문을 갖지 마라. 지침대로 행동하지 않으면 그것이 바로 눈앞까지 다가온다.",
        "text": "시각은 06:00 AM. 주변 공기가 급격히 냉각되며 <strong>제 6 수칙 [빛과 어둠의 축제 부턴 시스템이 개입되어 인]</strong>의 현상이 나타나기 시작합니다.<br><br><em>\"빛과 어둠의 축제 부턴 시스템이 개입되어 인간 종이 주행성 인간과 야행성 인간으로 부류가 나뉘게 됩니다 앞서서 축제 시작 전 반드시 짝을 만들어야 한다고 언급했습니다 전염병에 축제가 종료되고 세상의 모든 감염 생물들이 소멸하기 시작한 뒤 정확히 1분 후 자신과 가장 가까운 생명체가 매칭되기 됩니다 만약 자신의 시야 범위 ...\"</em><br><br>수칙서의 경고대로 한 치의 오차도 없는 공포가 바로 눈앞까지 닥쳐왔습니다.",
        "choices": [
            {
                "text": "① [수칙 준수] 지침에 따라 철저하게 행동하며 버틴다.",
                "next": "true_survival_end"
            },
            {
                "text": "② [유물 활용] 소지한 결계 부적의 기운으로 위기를 모면한다.",
                "requireItem": "relic_item",
                "next": "true_survival_end"
            },
            {
                "text": "③ [수칙 위반] 호기심을 참지 못하거나 공포에 질려 금기된 행동을 저지른다.",
                "next": "bad_end_r6"
            }
        ],
        "isEnding": false,
        "endingType": null
    },
    "bad_end_r6": {
        "stageTitle": "💀 【 영구 실종 : 제6수칙 [빛과 어둠의 축제 부턴 시스템이 개입되어 인] 위반 】",
        "time": "06:00 AM",
        "sanChange": -100,
        "image": "images/beast_shadow.jpg",
        "audio": "mimic",
        "secretHint": "🩸 [사망 확인서] 수칙을 지키지 않은 자에게 두 번째 기회는 주어지지 않습니다.",
        "text": "당신은 제 6 수칙 <strong>[빛과 어둠의 축제 부턴 시스템이 개입되어 인]</strong>의 금기를 깨뜨렸습니다.<br><br><em>\"빛과 어둠의 축제 부턴 시스템이 개입되어 인간 종이 주행성 인간과 야행성 인간으로 부류가 나뉘게 됩니다 앞서서 축제 시작 전 반드시 짝을 만들어야 한다고 언급했습니다 전염병에 축제...\"</em><br><br>그것이 순식간에 당신의 숨통을 조여왔으며, 차가운 어둠 속으로 끌려들어 갔습니다.<br>당신의 이름은 실종자 명단에 영구히 기록되었습니다.",
        "choices": [
            {
                "text": "🔄 처음부터 다시 시도한다.",
                "next": "start"
            },
            {
                "text": "📚 나폴리탄 서고로 돌아가기",
                "url": "gamebooks.html"
            }
        ],
        "isEnding": true,
        "endingType": "DEATH"
    },
    "bad_end_disregard": {
        "stageTitle": "💀 【 영구 실종 : 수칙서 경시 및 오만 】",
        "time": "22:05 PM",
        "sanChange": -100,
        "image": "images/beast_shadow.jpg",
        "audio": "scratch",
        "secretHint": "🩸 [혈서] 오만한 자가 가장 먼저 사라진다.",
        "text": "수칙서를 무시하고 돌아선 순간, 뒤편의 허공이 뒤틀리며 형용할 수 없는 존재가 당신을 덮쳤습니다.<br><br>첫 번째 전조조차 넘기지 못하고 당신의 의식은 완전히 소멸되었습니다.",
        "choices": [
            {
                "text": "🔄 처음부터 다시 시도한다.",
                "next": "start"
            },
            {
                "text": "📚 나폴리탄 서고로 돌아가기",
                "url": "gamebooks.html"
            }
        ],
        "isEnding": true,
        "endingType": "DEATH"
    },
    "true_survival_end": {
        "stageTitle": "🏅 【 트루 엔딩 : 새벽 06:30 여명의 생존 증명 】",
        "time": "06:30 AM",
        "sanChange": 30,
        "image": "images/blood_moon_mountain.jpg",
        "audio": "bell",
        "secretHint": "🩸 [생존 기록] 모든 금기를 극복하고 밤을 이겨낸 자만이 아침의 햇살을 마주할 자격을 얻는다.",
        "text": "창밖으로 푸르스름한 여명이 밝아오며, 길고 참혹했던 밤의 결계가 무너져 내립니다.<br><br>당신은 <strong>[[나폴리탄 괴담] 심판의 날 안전수칙 시리즈 몰아보기 | 공포라디오 | 무서운이야기 | 매뉴얼 괴담 | 공포썰 | 수면영상 | 자기전 보는 영상]</strong>의 6가지 모든 금기를 엄격히 준수하여 끝내 살아남았습니다.<br><br>주변의 모든 이형의 기척은 깨끗이 정화되었으며, 공식 <strong>[생존 증명서]</strong>가 발급되었습니다.",
        "choices": [
            {
                "text": "📚 나폴리탄 금기 서고(gamebooks.html)로 복귀",
                "url": "gamebooks.html"
            },
            {
                "text": "📺 원작 영상 시청하기",
                "url": "https://www.youtube.com/watch?v=W0qHcf8DVzc"
            },
            {
                "text": "🔄 다른 분기를 위해 다시 도전하기",
                "next": "start"
            }
        ],
        "isEnding": true,
        "endingType": "SURVIVAL"
    }
};

let currentSan = 100;
const playerInventory = new Set();
let isLanternOn = true;

function showToast(msg) {
    let toast = document.getElementById("game-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "game-toast";
        toast.style.position = "fixed";
        toast.style.bottom = "24px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.background = "rgba(20,20,30,0.95)";
        toast.style.color = "#ffd899";
        toast.style.padding = "10px 18px";
        toast.style.borderRadius = "8px";
        toast.style.border = "1px solid #b72b2b";
        toast.style.zIndex = "9999";
        toast.style.fontSize = "13px";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = "block";
    setTimeout(() => { toast.style.display = "none"; }, 2500);
}

function toggleLantern(btn) {
    isLanternOn = !isLanternOn;
    const overlay = document.getElementById("flashlight-overlay");
    if (isLanternOn) {
        btn.textContent = "🕯️ 초롱불 끄기";
        if (overlay) overlay.style.display = "none";
        document.body.classList.remove("dark-mode");
    } else {
        btn.textContent = "🕯️ 초롱불 켜기";
        if (overlay) overlay.style.display = "block";
        document.body.classList.add("dark-mode");
        showToast("🕯️ 초롱불을 껐습니다. 마우스 손전등으로 숨겨진 혈서를 찾아보세요.");
    }
}

function toggleBGM(btn) {
    if (typeof window.toggleBGM === "function") {
        window.toggleBGM(btn);
    } else {
        btn.textContent = btn.textContent.includes("🔇") ? "🔊 심야 앰비언스" : "🔇 심야 앰비언스";
    }
}

function updateSanHUD() {
    const bar = document.getElementById("san-bar");
    const text = document.getElementById("san-text");
    if (bar) bar.style.width = Math.max(0, Math.min(100, currentSan)) + "%";
    if (text) text.textContent = currentSan + "%";
}

function updateRelicsHUD() {
    const el = document.getElementById("relic-icons");
    if (!el) return;
    if (playerInventory.size === 0) {
        el.textContent = "없음";
        return;
    }
    el.innerHTML = Array.from(playerInventory).map(id => '<span class="relic-badge">📜 소지</span>').join(" ");
}

function renderStage(stageKey) {
    const stage = GAME_STAGES[stageKey];
    if (!stage) return;

    // 1. 화랑골 오디오 재생 규칙 (AUDIO_ASSETS 연동)
    if (stage.audio && typeof window.playAudioClip === "function") {
        window.playAudioClip(stage.audio);
    }

    // 2. SAN치 반영
    if (stage.sanChange) {
        currentSan = Math.max(0, Math.min(100, currentSan + stage.sanChange));
        updateSanHUD();
    }

    // 3. 아이템 획득
    if (stage.gainItem) {
        playerInventory.add(stage.gainItem.id);
        updateRelicsHUD();
        showToast(`🎁 [아이템 획득] ${stage.gainItem.name}`);
    }

    // 4. 시간 반영
    const timeEl = document.getElementById("game-time");
    if (timeEl && stage.time) timeEl.textContent = stage.time;

    // 5. 타이틀 & 지문
    const titleEl = document.getElementById("story-stage-title");
    const textEl = document.getElementById("story-text");
    if (titleEl) titleEl.innerHTML = stage.stageTitle;
    if (textEl) textEl.innerHTML = stage.text;

    // 6. 혈서 힌트 (손전등 암전 모드)
    const hintEl = document.getElementById("blood-secret-hint");
    if (hintEl) {
        hintEl.innerHTML = stage.secretHint || "🩸 [벽면 혈서] 수칙을 벗어난 행동은 죽음을 부른다.";
    }

    // 7. 선택지 버튼 렌더링
    const choicesBox = document.getElementById("choices-container");
    if (choicesBox) {
        choicesBox.innerHTML = "";

        // 엔딩 증명서 카드 (생존/사망)
        if (stage.isEnding) {
            const card = document.createElement("div");
            if (stage.endingType === "SURVIVAL") {
                card.style.background = "rgba(46, 204, 113, 0.15)";
                card.style.border = "1px solid #2ecc71";
                card.style.padding = "14px";
                card.style.borderRadius = "8px";
                card.style.marginBottom = "14px";
                card.innerHTML = `<h4 style="color:#2ecc71;">🏅 [공식 생존 증명서]</h4><p style="font-size:13px; color:#eee;">귀하는 밤을 무사히 넘기고 생존을 공식 확인받았습니다.<br>최종 넋 안정도: ${currentSan}%</p>`;
            } else {
                card.style.background = "rgba(231, 76, 60, 0.15)";
                card.style.border = "1px solid #e74c3c";
                card.style.padding = "14px";
                card.style.borderRadius = "8px";
                card.style.marginBottom = "14px";
                card.innerHTML = `<h4 style="color:#ff5555;">💀 [영구 실종/사망 통보서]</h4><p style="font-size:13px; color:#eee;">심야 금기 위반으로 영구 실종 처리되었습니다.<br>사망 시각: ${stage.time}</p>`;
            }
            choicesBox.appendChild(card);
        }

        stage.choices.forEach(ch => {
            if (ch.requireItem && !playerInventory.has(ch.requireItem)) {
                return;
            }
            const btn = document.createElement("button");
            btn.className = "choice-btn";
            btn.style.display = "block";
            btn.style.width = "100%";
            btn.style.textAlign = "left";
            btn.style.padding = "12px 14px";
            btn.style.margin = "8px 0";
            btn.style.background = "#1a1d26";
            btn.style.border = "1px solid rgba(255,255,255,0.15)";
            btn.style.color = "#eee";
            btn.style.borderRadius = "6px";
            btn.style.cursor = "pointer";
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

    const scrollArea = document.querySelector(".scroll-content-area");
    if (scrollArea) scrollArea.scrollTop = 0;
}

document.addEventListener("DOMContentLoaded", () => {
    updateSanHUD();
    updateRelicsHUD();
    if (document.getElementById("story-container")) {
        renderStage("start");
    }
});
