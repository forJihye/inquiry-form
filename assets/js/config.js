// 필수 입력항목 ID
export const FORM_REQUIRED_FIELD_ID = [
  'location',
  'category',
  'company',
  'name',
  'phone',
  'email',
  'inquiryDetail',
  'privacyAgree'
];

// 문의유형별 하위 입력항목
export const FORM_VISIBILITY_CONFIG = { 
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

// 셀렉트박스 옵션 설정
export const OPTIONS_CONFIG = {
  location: {
    ko: [
      {label: "본사", value: "dskr"},
      {label: "제주", value: "amjj"},
      {label: "강릉", value: "amgn"},
      {label: "여수", value: "amys"},
      {label: "부산", value: "ambs"},
      {label: "라스베가스", value: "amlv"},
      {label: "두바이", value: "amdb"},
      {label: "뉴욕", value: "amny"},
    ],
    en: [
      {label: "Head Office", value: "dskr"},
      {label: "Las Vegas", value: "amlv"},
      {label: "Dubai", value: "amdb"},
      {label: "New York", value: "amny"},
      {label: "Jeju", value: "amjj"},
      {label: "Gangneung", value: "amgn"},
      {label: "Yeosu", value: "amys"},
      {label: "Busan", value: "ambs"},
    ]
  },
  category: {
    ko: [
      {label: "비즈니스/프로젝트", value: "business",},
      {label: "PRESS/미디어", value: "press",},
      {label: "대관", value: "buyout",},
    ],
    en: [
      {label: "BUSINESS/PROJECT", value: "business",},
      {label: "PRESS/MEDIA", value: "press",},
      {label: "VENUE BUYOUT", value: "buyout",},
    ]
  },
  businessPurpose: {
    ko: [
      {label: "라이선스", value: "license", visibility: ['AM']},
      {label: "라이선스/구축", value: "build", visibility: ['AK']},
      {label: "파트너십", value: "partnership", visibility: ['AM', 'AK']},
      {label: "전시/콘텐츠 협업", value: "collaboration", visibility: ['AM', 'AK']},
      {label: "기타", value: "other", visibility: ['AM', 'AK']},
    ],
    en: [
      {label: "Licensing & Installation", value: "build", visibility: ['AM', 'AK']},
      {label: "Partnership", value: "partnership", visibility: ['AM', 'AK']},
      {label: "Content Collaboration", value: "collaboration", visibility: ['AM', 'AK']},
      {label: "Investment & JV", value: "investment", visibility: ['AM', 'AK']},
      {label: "Other", value: "other", visibility: ['AM', 'AK']},
    ],
  },
  buyoutPurpose: {
    ko: [
      {label: "브랜드 런칭/쇼케이스", value: "launch",},
      {label: "프라이빗 이벤트", value: "private",},
      {label: "비즈니스 네크워킹", value: "networking",},
      {label: "기업 행사", value: "corporate",},
      {label: "기타", value: "other",},
    ],
    en: [
      {label: "Brand Launch & Showcase ", value: "launch",},
      {label: "Private Event", value: "private",},
      {label: "Networking", value: "networking",},
      {label: "Corporate Event ", value: "corporate",},
      {label: "Other", value: "other",},
    ]
  },
  country: {
    ko: [
      {label: "대한민국", value: "kr",},
      {label: "미국", value: "us",},
      {label: "일본", value: "jp",},
      {label: "중국", value: "cn",},
      {label: "기타", value: "other",},
    ],
    en: [
      {label: "United States", value: "us",},
      {label: "China", value: "cn",},
      {label: "Japan", value: "jp",},
      {label: "South Korea", value: "kr",},
      {label: "Other", value: "other",},
    ]
  }
}

// 문의유형별 필드 help 텍스트 설정
export const FIELD_TEXT_CONFIG = { 
  inquiryDetail: {
    business: {
      placeholder: {
        ko: '프로젝트 개요, 목적, 요청 사항 등 문의 내용을 구체적으로 작성해 주세요.',
        en: 'Please describe your inquiry in detail, including a brief project overview, timeline, and specific requests.'
      }
    },
    buyout: {
      placeholder:{
        ko: '행사 목적, 일정, 예상 인원 등 대관 관련 내용을 구체적으로 작성해 주세요.',
        en: 'Please provide details about your buyout request, including the purpose, preferred schedule, and expected number of attendees.',
      }
    },
    press: {
      placeholder: {
        ko: '보도나 촬영 목적, 매체 정보, 일정 등 문의 내용을 자세히 작성해 주세요.',
        en: 'Please provide details about your inquiry, including the media outlet name, purpose, preferred schedule, and any specific requests.'
      }
    },
  },
  fileHelp: {
    business: {
      helpText: {
        ko: '※ 프로젝트 개요, 목적, 요청 사항 등 문의 내용을 구체적으로 작성해 주세요.',
        en: '※ You may attach your proposal or any relevant reference materials.',
      }
    },
    buyout: {
      helpText: {
        ko: '※ 행사 목적, 일정, 예상 인원 등 대관 관련 내용을 구체적으로 작성해 주세요.',
        en: '※ You may attach your proposal or any relevant reference materials.'
      }
    },
    press: {
      helpText: {
        ko: '※ 보도나 촬영 목적, 매체 정보, 일정 등 문의 내용을 자세히 작성해 주세요.',
        en: '※ You may attach your proposal or any relevant reference materials.'
      }
    },
  }
}

// 문의 제출 결과값
export const SUBMIT_STATE = {
  success : {
    ko: '문의하신 내용이 정상적으로 접수 되었습니다. 담당자를 통해 빠른 시일 내에 회신드리겠습니다.',
    en: "Your message has been sent. We'll get back to you shortly.",
  },
  error: {
    ko: '요청을 처리하는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
    en: 'Something went wrong. Please try again later.'
  }
}

// privacy-company
export const PRIVACY_COMPANY_CONFIG = {
  dskr: {
    ko: '(주)디스크릭트코리아',
    en: "d'strict Korea, Inc.",
  },
  amjj: {
    ko: '(주) 아르떼뮤지엄코리아 제주',
    en: "Arte Museum Korea Jeju, Inc.",
  },
  amys: {
    ko: '(주)아르떼뮤지엄코리아 여수',
    en: "Arte Museum Korea Yeosu, Inc.",
  },
  amgn: {
    ko: '(주)아르떼뮤지엄코리아 강릉',
    en: "Arte Museum Korea Gangneung, Inc.",
  },
  ambs: {
    ko: '(주)아르떼뮤지엄코리아 부산',
    en: "Arte Museum Korea Busan, Inc.",
  },
  akjj: {
    ko: '(주) 아르떼뮤지엄코리아 키즈 제주',
    en: "Arte Museum Korea Kids Jeju, Inc.",
  },
  amdb: {
    ko: 'ARTE MUSEUM LASER & LIGHTS SHOWS L.L.C',
    en: 'ARTE MUSEUM LASER & LIGHTS SHOWS L.L.C',
  },
  amlv: {
    ko: 'ARTE MUSEUM LV, LLC.',
    en: 'ARTE MUSEUM LV, LLC.',
  },
  amny: {
    ko: 'ARTE MUSEUM NY, LLC.',
    en: 'ARTE MUSEUM NY, LLC.',
  }
}