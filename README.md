# 내 오늘의 일기 (하루)

오늘 하루를 글로 적으면, 생성형 AI가 감정과 장면을 분석해 짱구 스타일 캔버스 애니메이션으로 만들어주는 감성 일기 웹 서비스입니다.

- 서비스: https://haru-diary.web.app/

## 주요 기능

- **일기 작성 → 애니메이션 생성**: 하루를 문장으로 적으면 문장 단위로 장면이 나뉘어 애니메이션화됩니다.
- **AI 분석 (Gemini API)**: Google Gemini 1.5 Flash가 문맥을 분석해 행동(action)·장소(location)·소품(props)·감정(emotion)·등장인물 수(charCount)·시간대·날씨 등을 JSON으로 추출합니다.
- **키워드 폴백 모드**: API 키가 없어도 사전 정의된 키워드 매칭으로 감정과 장면을 분석해 서비스가 항상 동작합니다.
- **캐릭터 & 드로잉 엔진**: 감자머리·송충이 눈썹 등 짱구 원작 스타일의 캐릭터(소미, 하나, 유리)를 Canvas 2D로 직접 그리며, 장면 전환 시 크로스페이드와 캐릭터 위치 보간으로 끊김 없는 영상을 만듭니다.
- **캘린더 뷰**: 날짜별로 작성한 일기를 감정 색상 점으로 표시하고, 클릭하면 원문과 애니메이션을 다시 볼 수 있습니다.
- **공유하기**: 일기 애니메이션을 공유용 캔버스 페이지(`share.html`) 링크로 만들어 복사할 수 있습니다.
- **로컬 우선 저장**: 일기 원문은 서버로 전송되지 않고 브라우저 `localStorage`에만 저장됩니다. Gemini API 키도 브라우저에만 저장됩니다.

## 기술 스택

- **Frontend**: Vanilla HTML / CSS / JavaScript (프레임워크 없이 직접 구현)
- **애니메이션**: Canvas 2D API 기반 자체 드로잉 엔진(`animation-engine.js`, `draw-character.js`), GSAP
- **AI**: Google Gemini 1.5 Flash API (사용자 API 키 기반, 브라우저에서 직접 호출)
- **저장소**: 브라우저 `localStorage` (서버/DB 없음)
- **기타 연동**: Google Analytics(GA4), Microsoft Clarity, Google AdSense, Disqus(댓글), Formspree(제휴 문의 폼)

## 파일 구조

| 파일 | 설명 |
|---|---|
| `index.html` | 메인 앱 — 캘린더, 일기 작성, 애니메이션 플레이어, 소개/문의/개인정보처리방침 뷰 포함 |
| `animation-engine.js` | Gemini 분석 호출, 키워드 폴백 로직, 장면 시퀀스 및 노트북 배경/바인딩 렌더링 |
| `draw-character.js` | 캐릭터별 드로잉(표정, 동작, 소품) 로직 |
| `diary.html`, `share.html` | 일기 작성 및 공유 전용 페이지 |
| `custom.css` | 공통 스타일 |
| `blueprint.md` | 프로젝트 기획/디자인/기능 명세 문서 |

## 실행 방법

정적 파일이므로 별도 빌드 없이 `index.html`을 브라우저로 열면 바로 실행됩니다. AI 분석 기능을 사용하려면 앱 내 설정(⚙)에서 [Google AI Studio](https://aistudio.google.com/)에서 발급받은 Gemini API 키를 입력하세요. 키를 입력하지 않으면 키워드 기반 분석으로 동작합니다.
