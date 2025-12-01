# s01-p02: Seoul Travel Data Project

## 목적
멀티모달 AI를 활용한 서울 여행 데이터 생성 및 관리 실습

## 프로젝트 개요

서울의 10대 명소를 분석하고, 구조화된 여행 데이터를 생성하는 프로젝트입니다.

## 주요 작업

### 1. 이미지 분석 (멀티모달 AI)
- 10개 서울 명소 이미지 분석
- 장소명, 카테고리, 태그, 요약 추출
- Claude의 비전 기능 활용

### 2. 데이터 병합 (Data Engineering)
- 기본 데이터 (`seoul_spots_base.json`)
- 추가 정보 (`travel_info.txt`)
- 병합 후 `seoul_spots_merged.json` 생성

### 3. 여행 코스 기획 (Creative Planning)
- 1~5번 장소: 전통적 감성 코스
- 6~10번 장소: MZ세대 힙한 코스
- 각 코스별 3단계 plan 포함

### 4. 자연어 쿼리 변환
- 사용자 자연어 → JSON 쿼리 변환
- 패턴 학습 및 적용

## 최종 결과물

### seoul_spots_final.json
10개 서울 명소의 완전한 데이터:
- 기본 정보 (place_name, category, tags, summary)
- 운영 정보 (operating_hours, admission_fee, pro_tip)
- 추천 코스 (recommended_course)

### seoul_hansik_restaurant_query.json
자연어 → JSON 변환 예시

## 데이터 규칙

**중요**: 모든 데이터 작업 시 `RULES.md`의 규칙을 준수해야 합니다.

특히 `admission_fee` 필드는 반드시 KRW 단위를 포함한 문자열이어야 합니다.

## 파일 구조

```
s01-p02-seoul-travel/
├── README.md                              # 이 파일
├── RULES.md                               # 데이터 규칙 (필수 참조)
├── seoul-images/                          # 10개 명소 이미지
├── seoul_spots_final.json                 # 최종 데이터
├── seoul_hansik_restaurant_query.json     # 쿼리 변환 예시
├── seoul_spots_base.json                  # 기본 데이터
├── seoul_spots_merged.json                # 병합 데이터
├── seoul-attractions.json                 # 초기 생성 데이터
└── travel_info.txt                        # 추가 정보 소스
```

## 학습 포인트

1. **멀티모달 AI**: 이미지를 분석하여 구조화된 데이터 생성
2. **데이터 엔지니어링**: 여러 소스의 데이터를 병합하고 일관성 유지
3. **컨텍스트 관리**: 대화 중간에 규칙을 추가하고 적용
4. **자연어 처리**: 사용자 의도를 구조화된 쿼리로 변환
