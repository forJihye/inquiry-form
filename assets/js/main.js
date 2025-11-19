// 셀렉트박스 옵션 설정
const OPTIONS_CONFIG = {
  location: [
    {label: "본사", value: "head",},
    {label: "제주", value: "jeju",},
    {label: "강릉", value: "gangneung",},
    {label: "여수", value: "yeosu",},
    {label: "부산", value: "busan",},
    {label: "라스베가스", value: "lasvegas",},
    {label: "두바이", value: "dubai",},
    {label: "뉴욕", value: "newyork",},
  ],
  category: [
    {label: "비즈니스/프로젝트", value: "business",},
    {label: "PRESS/미디어", value: "press",},
    {label: "대관", value: "buyout",},
  ],
  businessPurpose: [
    {label: "라이선스", value: "license", visibility: ['AM']},
    {label: "라이선스/구축", value: "build", visibility: ['AK']},
    {label: "파트너십", value: "partnership", visibility: ['AM', 'AK']},
    {label: "전시/콘텐츠 협업", value: "collaboration", visibility: ['AM', 'AK']},
    {label: "기타", value: "other", visibility: ['AM', 'AK']},
    // {label: "투자/JV", value: "investment", visibility: []},
  ],
  buyoutPurpose: [
    {label: "브랜드 런칭/쇼케이스", value: "launch",},
    {label: "프라이빗 이벤트", value: "private",},
    {label: "비즈니스 네크워킹", value: "networking",},
    {label: "기업 행사", value: "corporate",},
    {label: "기타", value: "other",},
  ],
  country: [
    {label: "대한민국", value: "kr",},
    {label: "미국", value: "us",},
    {label: "일본", value: "jp",},
    {label: "중국", value: "cn",},
    {label: "기타", value: "other",},
  ]
}

// 필수 입력항목 ID
const FORM_REQUIRED_FIELD_ID = ['location', 'category','company', 'name', 'phone', 'email', 'inquiryDetail'];

// 문의유형별 하위 입력항목
const FORM_VISIBILITY_CONFIG = { 
  business: {
    show: ['businessPurpose', 'country', 'completionDate'],
    required: ['businessPurpose', 'completionDate'],
  },
  buyout: {
    show: ['buyoutPurpose', 'buyoutDate', 'customContent'],
    required: ['buyoutPurpose', 'buyoutDate'],
  },
  press: {
    show: [],
    required: [],
  },
}

// 문의유형별 필드 help 텍스트 설정
const FIELD_TEXT_CONFIG = { 
  inquiryDetail: {
    business: {
      placeholder: '프로젝트 개요, 목적, 요청 사항 등 문의 내용을 구체적으로 작성해 주세요.'
    },
    buyout: {
      placeholder: '행사 목적, 일정, 예상 인원 등 대관 관련 내용을 구체적으로 작성해 주세요.'
    },
    press: {
      placeholder: '보도나 촬영 목적, 매체 정보, 일정 등 문의 내용을 자세히 작성해 주세요.'
    },
  },
  fileHelp: {
    business: {
      helpText: '※ 프로젝트 개요, 목적, 요청 사항 등 문의 내용을 구체적으로 작성해 주세요.'
    },
    buyout: {
      helpText: '※ 행사 목적, 일정, 예상 인원 등 대관 관련 내용을 구체적으로 작성해 주세요.'
    },
    press: {
      helpText: '※ 보도나 촬영 목적, 매체 정보, 일정 등 문의 내용을 자세히 작성해 주세요.'
    },
  }
}

const utils = {
  setIntlTel: () => { // 국가 코드 연동
    const input = document.querySelector("#phone");
    window.intlTelInput(input, {
      initialCountry: "kr",
      strictMode: true,
      separateDialCode: false,
      useFullscreenPopup: false,
      loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.12.5/build/js/utils.js"),
    });
  },
  setDatepicker: () => { // input datepicker 연결
    const datepickerOptions = {
      autohide: true,
      format: 'yyyy-mm-dd'
    }
    new Datepicker(document.querySelector('input[name="completionDate"]'), datepickerOptions);
    new Datepicker(document.querySelector('input[name="buyoutDate"]'), datepickerOptions);
  },
  privacyToggle: () => { // Privacy 약관 내용 토글 UI
    const toggleBtn = document.querySelector('.privacy-toggle');
    const box = document.getElementById('privacy');

    if (!toggleBtn || !box) return;
    box.style.display = 'none';

    toggleBtn.addEventListener('click', function (ev) {
      ev.preventDefault();
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';

      // 상태 반전
      toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      box.style.display = !isExpanded ? 'block' : 'none';

      if (!isExpanded) {
        toggleBtn.textContent = '(내용 보기 ▲)';
      } else {
        toggleBtn.textContent = '(내용 보기 ▼)';
      }
    });
  }
}

const modal = {
  open: (elemId) => {
    const modalElem = document.getElementById(elemId);
    modalElem.style.display = 'block';
  },
  close: (elemId) => {
    const modalElem = document.getElementById(elemId);
    modalElem.style.display = 'none';
  },
  apply: () => {
    const openBtn = document.querySelector('.modal-open-btn');
    const closeBtn = document.querySelector('.modal .btn-close');
    openBtn.addEventListener('click', () => modal.open('privacyModal'));
    closeBtn.addEventListener('click', () => modal.close('privacyModal'));
  }
}

let isFormValid = true;
const form = {
  setSelectOptions: () => { // 셀렉트박스 옵션 렌더링 
    const params = new URL(document.location).searchParams;
    const brand = !params.size ? 'am' : params.get('brand');
    
    Object.keys(OPTIONS_CONFIG).forEach(key => {
      const elem = document.getElementById(key);
      const options = OPTIONS_CONFIG[key];
      options.forEach(option => {
        const el = document.createElement('option');
        el.innerText = option.label;
        el.value = option.value;
        if (option.visibility) {
          if (!option.visibility.includes(brand.toUpperCase())) return;
        }
        elem.appendChild(el);
      })
    })
  },
  selectPlaceholder: () => { // 셀렉트박스 필수가 아닌 경우 placeholder 스타일 처리
    const elem = document.querySelector('.form-select.select-placeholder');
    elem.addEventListener('change', () => {
      if (elem.value === '') {
        elem.classList.add('select-placeholder');
      } else {
        elem.classList.remove('select-placeholder');
      }
    });
  },
  applyInquiryType: (type) => { // 문의 유형에 따른 하위항목 렌더링
    // 하위 입력 항목 숨김 처리 + required 속성 제거
    document.querySelectorAll('.field-conditional').forEach(row => {
      row.style.display = 'none';
      const input = row.querySelector('input, select, tel, email, textarea');
      if (input) input.required = false;
    });
    
    if (!type.length) return;
    const config = FORM_VISIBILITY_CONFIG[type];
    
    // 문의 유형별 하위 항목 노출
    config.show.forEach((fieldId) =>{
      const row = document.querySelector(`[data-field-id="${fieldId}"]`);
      if (!row) return;
      row.style.display = 'block';
    });
    // 문의 유형별 하위 항목 필수 입력 처리
    config.required.forEach((fieldId) => {
      const row = document.querySelector(`[data-field-id="${fieldId}"]`);
      if (!row) return;
      const input = row.querySelector('input, select, tel, email, textarea');
      if (input) input.required = true;
    });
    // placeholder 적용
    Object.entries(FIELD_TEXT_CONFIG).forEach(([fieldId, perType]) => {
      const row = document.querySelector(`[data-field-id="${fieldId}"]`);
      if (!row) return;

      const typeConfig = perType[type];
      if (!typeConfig) return;

      const input = row.querySelector('textarea, input');
      if (input && typeConfig.placeholder) {
        input.placeholder = typeConfig.placeholder;
      }
      const help = row.querySelector('.help-text');
      if (help && typeConfig.helpText) {
        help.textContent = typeConfig.helpText;
      }
    });
  },
  validateField: (fieldId) => { // 입력 필드 유효성 개별 검사
    const input = document.getElementById(fieldId);
    if (!input) return;
    // console.log(fieldId, input, input.value);

    let isValid = true;
    const value = input.value.trim();

    if (!value) isValid = false;

    // 이메일 형식 체크
    if (fieldId === 'email' && value) {
      const emailValid = /\S+@\S+\.\S+/.test(value);
      if (!emailValid) isValid = false;
    }
    if (fieldId === 'phone') {
      document.querySelector('.iti').classList.toggle('is-invalid', !isValid);
    }
    input.classList.toggle('is-invalid', !isValid);
    
    return isValid;
  },
  validateForm: (type) => { // 폼 필수 입력 필드 유효성 검사
    const requiredFields = !type.length ? FORM_REQUIRED_FIELD_ID : [...FORM_REQUIRED_FIELD_ID, ...FORM_VISIBILITY_CONFIG[type].required];
    
    // 필수 입력 필드 검사
    requiredFields.forEach(fieldId => {
      const valid = form.validateField(fieldId);
      if (!valid) isFormValid = false;
    });

    return isFormValid;
  },
  attachValidation: (type) => { // 입력 필드 이벤트 유효성 검사
    const fieldIds = !type.length ? FORM_REQUIRED_FIELD_ID : [...FORM_REQUIRED_FIELD_ID, ...FORM_VISIBILITY_CONFIG[type].required];

    fieldIds.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      
      if (field.type === 'select-one') {
        field.addEventListener('change', () => form.validateField(fieldId))
      }      
      
      if (field.classList.contains('datepicker-input')) {
        field.addEventListener('changeDate', () => form.validateField(fieldId));  
      }

      field.addEventListener('input', () => form.validateField(fieldId));
    })
  },
  validateFileSize: () => { // 첨부파일 크기 확인
    const FILE_SIZE_LIMIT = (1024 * 1024) * 50;
    const fileInput = document.getElementById('fileUpload');
    fileInput.addEventListener('change', (ev) => {
      const file = ev.target.files[0];
      if (file.size > FILE_SIZE_LIMIT) {
        isFormValid = false;
      } else {
        isFormValid = true;
      }

      ev.target.classList.toggle('is-invalid', !isFormValid);
    })
  }
}

const main  = async () => { try {
  utils.setIntlTel();
  utils.setDatepicker();
  modal.apply();
  
  const categorySelect = document.getElementById('category');
  const submitBtn = document.getElementById('submitBtn');

  form.setSelectOptions(); 
  form.selectPlaceholder();
  form.applyInquiryType(categorySelect.value || '');
  form.attachValidation(categorySelect.value || '');
  form.validateFileSize();

  // 문의유형 항목 이벤트
  categorySelect.addEventListener('change', (ev) => {
    form.applyInquiryType(ev.target.value);
    form.attachValidation(ev.target.value);
  });

  // 제출 버튼 클릭 이벤트
  submitBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    form.validateForm(categorySelect.value || '');

    if (isFormValid) {
      window.alert('폼 유효성 검사 완료');
    } else {
      window.alert('폼 유효성 검사 실패');
    }
  });
} catch(err){
  console.error(err);
}}
main();