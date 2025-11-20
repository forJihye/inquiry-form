import { 
  OPTIONS_CONFIG, 
  FORM_REQUIRED_FIELD_ID, 
  FORM_VISIBILITY_CONFIG, 
  FIELD_TEXT_CONFIG,
  SUBMIT_STATE
 } from './config.js';


const utils = {
  setIntlTel: (lang) => { // 국가 코드 연동
    const input = document.querySelector("#phone");
    window.intlTelInput(input, {
      initialCountry: lang === 'ko' ? "kr" : "us",
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
  privacyToggle: () => { // (사용 X) Privacy 약관 내용 토글 UI
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
  },
  sleep: (ms) => {
    return new Promise(res => setTimeout(res, ms));
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
let emailValidationActive = false;

const form = {
  setSelectOptions: (urlParams) => { // 셀렉트박스 옵션 렌더링 
    const {lang, brand} = urlParams;
    Object.keys(OPTIONS_CONFIG).forEach(key => {
      const elem = document.getElementById(key);
      const options = OPTIONS_CONFIG[key][lang];
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
  renderInquiryType: (type, urlParams) => { // 문의 유형에 따른 하위항목 렌더링
    const {lang, location} = urlParams;

    if (location) { // location 지점이 명확할때 '지점선택' 항목 숨김 처리
      const locationRow = document.querySelector(`[data-field-id="location"]`);
      const input = locationRow.querySelector('select');
      input.required = false;
      locationRow.style.display = 'none';
    }

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
        input.placeholder = typeConfig.placeholder[lang];
      }
      const help = row.querySelector('.help-text');
      if (help && typeConfig.helpText) {
        help.textContent = typeConfig.helpText[lang];
      }
    });
  },
  validateField: (fieldId) => { // 입력 필드 유효성 개별 검사
    const elem = document.getElementById(fieldId);
    if (!elem) return;
    // console.log(fieldId, input, input.value);

    let isValid = true;
    const value = elem.value.trim();

    if (!value) isValid = false;

    if (fieldId === 'email' && value) { // 이메일 형식 체크
      const emailValid = /\S+@\S+\.\S+/.test(value);
      if (!emailValid) {
        isValid = false;
        emailValidationActive = true;
      }
    }
    if (fieldId === 'phone') {
      document.querySelector('.iti').classList.toggle('is-invalid', !isValid);
    }
    if (fieldId === 'privacyAgree') {
      isValid = elem.checked; 
    }
      
    elem.classList.toggle('is-invalid', !isValid);
  
    return isValid;
  },
  validateForm: (type, urlParams) => { // 폼 필수 입력 필드 유효성 검사
    let requiredFields = !type.length ? FORM_REQUIRED_FIELD_ID : [...FORM_REQUIRED_FIELD_ID, ...FORM_VISIBILITY_CONFIG[type].required];
    if (urlParams.location) { // 지점선택이 불필요한 경우 location 필수입력 삭제
      requiredFields = requiredFields.filter(v => v !== 'location');
    }

    const temp = [];
    // 필수 입력 필드 검사
    requiredFields.forEach(fieldId => {
      const isValid = form.validateField(fieldId);
      temp.push(isValid);
    });
    
    if (temp.filter(v => !v).length === 0) {
      isFormValid = true;
    } else {
      isFormValid = false;
    }

    return isFormValid;
  },
  attachValidation: (type, urlParams) => { // 입력 필드 이벤트 유효성 검사
    let fieldIds = !type.length ? FORM_REQUIRED_FIELD_ID : [...FORM_REQUIRED_FIELD_ID, ...FORM_VISIBILITY_CONFIG[type].required];
    if (urlParams.location) { // 지점선택이 불필요한 경우 location 필수입력 삭제
      fieldIds = fieldIds.filter(v => v !== 'location');
    }

    fieldIds.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      
      if (field.type === 'select-one' || field.type === 'checkbox') {
        field.addEventListener('change', () => form.validateField(fieldId))
      }      
      
      if (field.classList.contains('datepicker-input')) {
        field.addEventListener('changeDate', () => form.validateField(fieldId));  
      }
      
      field.addEventListener('input', () => {
        if (!emailValidationActive) return;
        form.validateField(fieldId);
      });
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
  },
  setSubmitState: (state, elem, urlParams) => { // 폼 전송 시 제출 버튼 및 결과 상태
    const {btn, result} = elem;
    const {lang} = urlParams;
    
    if (state === 'loading') {
      const html = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span><span class="px-2" role="status">Submitting...</span>`;
      btn.innerHTML = html;
      btn.disabled = true;
    } else {
      const message = SUBMIT_STATE[state][lang];
      const stateText = result.querySelector('p');

      btn.innerHTML = 'SUBMIT';
      btn.disabled = false;
      stateText.innerText = message;

      if (state === 'success') {
        stateText.classList.add('text-success');
        setTimeout(() => stateText.innerText = '', 8000);
      }
      if (state === 'error') {
        stateText.classList.add('text-danger');
      }
    }
  }
}

const main  = async () => { try {
  const params = new URL(document.location).searchParams;
  const brand = params.get('brand') ?? 'am';
  const lang = params.get('lang') ?? navigator.languages[0];
  const location = params.get('location');
  const urlParams = {brand, lang, location};
  
  utils.setIntlTel(lang);
  utils.setDatepicker();
  modal.apply();
  
  const categorySelect = document.getElementById('category');
  const submitBtn = document.getElementById('submitBtn');
  const submitState = document.getElementById('submitState')
  const stateProps = {btn: submitBtn, result: submitState}

  form.setSelectOptions(urlParams); 
  form.selectPlaceholder();
  form.renderInquiryType(categorySelect.value || '', urlParams);
  form.attachValidation(categorySelect.value || '', urlParams);
  form.validateFileSize();

  // 문의유형 항목 이벤트
  categorySelect.addEventListener('change', (ev) => {
    form.renderInquiryType(ev.target.value, urlParams);
    form.attachValidation(ev.target.value, urlParams);
  });

  // 제출 버튼 클릭 이벤트
  submitBtn.addEventListener('click', async (ev) => {try {
    ev.preventDefault();
    form.validateForm(categorySelect.value || '', urlParams);

    if (isFormValid) { 
      form.setSubmitState('loading', stateProps, urlParams);
      
      // 폼 데이터 전송 로직 추가
      await utils.sleep(5000); // 테스트용 (개발 후 삭제)
      
      form.setSubmitState('success', stateProps, urlParams);
    }
  } catch(err){
    console.error(err);
    form.setSubmitState('error', stateProps, urlParams);
  }});
  
} catch(err){
  console.error(err);
}}
main();