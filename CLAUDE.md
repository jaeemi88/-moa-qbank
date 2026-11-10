# 질문은행 자동확장 (moa-qbank)

## 앱 정보
- 면접 질문 세트를 입력하면 직무 조옮김·난이도 사다리·강사용 해설·세트 분석을 AI로 파생하는 강사 전용 도구
- Vercel 프로젝트: moa-qbank / GitHub: jaeemi88/moa-qbank
- 정적 단일 페이지(index.html) + Vercel Edge Function(api/chat.js)
- 앱 대표색: 연코랄 #FCE9E1 / 글자 #8A3517
- 폰트: Noto Sans KR / 흰 배경 / 상단 "MOA FORMULA" 로고

## 아키텍처
- index.html: 전체 UI + 로직 (약 700줄)
- api/chat.js: Vercel Edge Function — 프론트에서 받은 프롬프트를 Anthropic API로 전달
- vercel.json: 라우팅 + claude/** 브랜치 배포 금지 (한도 절약)
- 환경 변수: ANTHROPIC_API_KEY (Vercel 프로젝트 설정에서 추가)
  - 프론트엔드에서도 localStorage에 키를 저장해 x-api-key 헤더로 보냄
  - api/chat.js는 환경 변수 없으면 헤더의 키를 fallback으로 사용

## AI 모델
- claude-haiku-4-5 (빠르고 저렴, 질문 파생에 충분)
- max_tokens: 4096

## 보관함
- localStorage("moa_qbank_sets")에 JSON 직렬화해 저장 (최대 50개 세트)
- 클라우드 동기화 없음 (기기별 독립 보관)

## 배포 원칙
- claude/** 브랜치는 Vercel 배포 안 함 (vercel.json에 설정)
- main 병합 → 자동 배포
