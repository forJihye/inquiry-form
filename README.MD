# 아르떼뮤지엄 / 아르떼키즈파크 Inquiry Form (문의 폼)

## Overview
아르떼뮤지엄과 아르떼키즈파크 웹사이트에서 사용되는 문의 제출 전용 Form UI로,
사용자의 선택에 따라 동적으로 필드가 변경되고, 언어/브랜드/지점 등 URL 파라미터 기반으로 초기값을 자동 구성합니다.


## 📁 Files Overview
### 📂 Root Files
#### `index.html`
국문(KO) 버전 문의 폼 페이지 

#### `index_en.html`
영문(EN) 버전 문의 폼 페이지 (글로벌 사용자 대상)

### 📂 assets/css
#### **`style.css`**
문의 폼 UI 스타일

### 📂 assets/js
#### **`config.js`**  
폼의 동작을 제어하는 모든 '설정값'을 모아둔 파일.   
비즈니스 로직, 동적 필드 구성, 언어별 문구는 모두 이곳에서 관리함

**[주요 항목]**
- `FORM_REQUIRED_FIELD_ID`: 폼 제출 시 기본적으로 필수 입력해야 하는 필드 ID 목록
- `FORM_VISIBILITY_CONFIG`: 문의 유형에 따라 어떤 하위 항목을 보여줄지, 숨길지, required 처리 할지 결정하는 설정값
- `OPTIONS_CONFIG`: 모든 select 드롭다운 옵션 속성을(label, value, visibility) 언러별로 정의해서 브랜드/지점 조건에 따라 특정 옵션이 표시되도록 필터링
- `FIELD_TEXT_CONFIG`: 문의 유형별 placeholder, helpText 등 필드 안내 문구
- `SUBMIT_STATE`: 문의 폼 데이터 전송 성공/에러 메시지를 언어별로 정리한 설정값

#### **`main.js`**  
문의 폼의 모든 동작을 제어하는 핵심 JavaScript 파일.   
초기 렌더링 → 유효성 검사 → 동적 필드 변환 → 제출 상태 관리까지 모든 로직이 포함되어 있음.  


## 📌 주요 기능
#### 1. URL 파라미터 기반 초기 설정
`?lang=`, `?brand=`, `?location=` 세 개의 파라미터로 각 항목(언어, 브랜드, 지점)을 구분 및 반영

1. **`lang`**: 문의 폼에 사용되는 드롭다운 옵션, placeholder 등의 언어 구분값으로 입력된 언어로 렌더링
    * `ko`: 한국어
    * `en`: 영어
    * 파라미터가 없는 경우 사용자 브라우저 대표 언어 기반으로 노출

2. **`brand`**: 브랜드에 따라 비즈니스 문의 목적 드롭다운 노출 옵션을 구분하기 위함
    * `ak`: 아르떼뮤지엄
    * `am`: 아르떼 키즈파크
    * 파라미터가 없는 경우 기본 `ak`로 아르떼뮤지엄 입력 항목 노출

3. **`location`**: 문의 폼을 삽입하는 페이지의 위치가 지점이 명확할 경우 '지점 선택' 항목을 제거하기 위함 
   * `amlv`: 아르떼뮤지엄 라스베가스
   * `amdb`: 아르떼뮤지엄 두바이
   * `amny`: 아르떼뮤지엄 뉴욕
   * `akjj`: 아르떼키즈파크 제주
   * 파라미터가 없는 경우 기본 '지점 선택' 입력 항목 노출


#### 2. 문의 유형에 따른 동적 필드 노출
- `category` 값에 따라 필요한 하위 필드만 보여주고, 불필요한 필드는 자동으로 숨김
- 각 문의 유형별로 **required** 필드와 **placeholder**, **help text** 자동 적용

#### 3. 국제 전화번호 입력 (intl-tel-input)
- 사용자의 언어(`lang`)에 따라 기본 국가 코드 자동 설정 
    * kr (한국어) +87
    * us (영어) +1

#### 4. 폼 유효성 검사 (Validation)
- **required** 필드의 입력 상태 확인
- `SUBMIT` 버튼 클릭 시 유효성 검사 진행
- 그 이후 입력 시 실시간 유효성 검사 진행하여 UX 적용

#### 5. 파일 업로드 제한
- 업로드 파일 최대 용량 50MB
- 업로드 파일 확장타입 전체

#### 6. 폼 전송 상태 처리 (Submit State)
버튼 UI 상태 처리
- `loading`: 스피너 표시 + 버튼 비활성화
- `success`: 성공 문구 표시 후 8초 후 자동 hidden
- `error`: 에러 문구 표시

문구는 언어(`lang`)에 따라 자동 번역(`SUBMIT_STATE`로 관리)


## 📌 주요 스크립트 (main.js)

`utils`
* 국제전화번호 init (setIntlTel)
* datepicker init
* sleep (지연 함수)

`form`
* select 옵션 렌더링 `setSelectOptions`
* placeholder 스타일 `selectPlaceholder`
* 문의 유형별 필드 변경 `renderInquiryType`
* 각 필드 유효성 검사 `validateField`
* 전체 폼 유효성 검사 `validateForm`
* 각 필드 이벤트 발생 시 유효성 검사 `attachValidation`
* 파일 사이즈 검사 `validateFileSize`
* 제출 상태 처리 `setSubmitState`

`modal`
* 약관 모달 open/close

`main`
* URL 파라미터 분석
* 필드 초기 렌더링
* 이벤트 바인딩
* 제출 버튼 클릭 로직

## 🚀 제출 로직 (Submit Flow)
1. Submit 클릭
2. 첫 유효성 검사 실행
3. 모든 필드가 valid면 다음 단계 진행
4. 버튼 → Loading 상태
5. 실제 전송 로직 수행(fetch 또는 sleep)
6. 결과에 따라
    * Success: 성공 메시지 + 8초 후 자동 제거
    * Error: 에러 메시지 출력

> **폼 데이터 전송 로직은 304번 줄에 추가**