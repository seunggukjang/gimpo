// ============================================================
// 지역뉴스허브 — app.js
// 뉴스 로컬 생성 + EmailJS 즉시 메일 발송
// ============================================================

// ===== REGION DATA =====
const SIGUN_DATA = {
  '서울':['종로구','중구','용산구','성동구','광진구','동대문구','중랑구','성북구','강북구','도봉구','노원구','은평구','서대문구','마포구','양천구','강서구','구로구','금천구','영등포구','동작구','관악구','서초구','강남구','송파구','강동구'],
  '부산':['중구','서구','동구','영도구','부산진구','동래구','남구','북구','해운대구','사하구','금정구','강서구','연제구','수영구','사상구','기장군'],
  '경기':['수원시','성남시','의정부시','안양시','부천시','광명시','평택시','동두천시','안산시','고양시','과천시','구리시','남양주시','오산시','시흥시','군포시','의왕시','하남시','용인시','파주시','이천시','안성시','김포시','화성시','광주시','양주시','포천시','여주시','연천군','가평군','양평군'],
  '강원':['춘천시','원주시','강릉시','동해시','태백시','속초시','삼척시','홍천군','횡성군','영월군','평창군','정선군','철원군','화천군','양구군','인제군','고성군','양양군'],
  '충북':['청주시','충주시','제천시','보은군','옥천군','영동군','증평군','진천군','괴산군','음성군','단양군'],
  '충남':['천안시','공주시','보령시','아산시','서산시','논산시','계룡시','당진시','금산군','부여군','서천군','청양군','홍성군','예산군','태안군'],
  '전북':['전주시','군산시','익산시','정읍시','남원시','김제시','완주군','진안군','무주군','장수군','임실군','순창군','고창군','부안군'],
  '전남':['목포시','여수시','순천시','나주시','광양시','담양군','곡성군','구례군','고흥군','보성군','화순군','장흥군','강진군','해남군','영암군','무안군','함평군','영광군','장성군','완도군','진도군','신안군'],
  '경북':['포항시','경주시','김천시','안동시','구미시','영주시','영천시','상주시','문경시','경산시','군위군','의성군','청송군','영양군','영덕군','청도군','고령군','성주군','칠곡군','예천군','봉화군','울진군','울릉군'],
  '경남':['창원시','진주시','통영시','사천시','김해시','밀양시','거제시','양산시','의령군','함안군','창녕군','고성군','남해군','하동군','산청군','함양군','거창군','합천군'],
  '제주':['제주시','서귀포시'],
  '인천':['중구','동구','미추홀구','연수구','남동구','부평구','계양구','서구','강화군','옹진군'],
  '대구':['중구','동구','서구','남구','북구','수성구','달서구','달성군'],
  '광주':['동구','서구','남구','북구','광산구'],
  '대전':['동구','중구','서구','유성구','대덕구'],
  '울산':['중구','남구','동구','북구','울주군'],
  '세종':['세종시']
};

// ===== SEEDED RNG =====
class RNG {
  constructor(seed){ this.s = seed >>> 0; }
  next(){ this.s = Math.imul(this.s ^ this.s>>>17, this.s ^ this.s<<7) >>> 0; return this.s / 4294967296; }
  int(a,b){ return a + Math.floor(this.next()*(b-a+1)); }
  pick(arr){ return arr[this.int(0,arr.length-1)]; }
  shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(this.next()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
}
function mkSeed(str){ return str.split('').reduce((a,c)=>Math.imul(31,a)+c.charCodeAt(0)|0, 0) >>> 0; }

// ===== NEWS TEMPLATE ENGINE =====
function buildTemplates(sg, doName, rng) {
  const b  = ()=> rng.int(100,5000);
  const b2 = ()=> rng.int(50,500);
  const n  = ()=> rng.int(10,300);
  const n2 = ()=> rng.int(2,20);
  const pct= ()=> rng.int(5,40);

  const roads   = [`${sg} 중앙로`, `${sg}대로`, `${sg} 순환로`, `${doName} 국도`];
  const road    = rng.pick(roads);
  const company = rng.pick(['대형 유통업체','첨단 제조기업','물류 센터','IT 기업','친환경 에너지 기업']);
  const season  = rng.pick(['봄','여름','가을','겨울']);
  const b1=b(), b3=b2(), n1=n(), n3=n2(), p1=pct(), p2=pct(), p3=pct();
  const rent = rng.int(15,30);

  return [
    // ===== 정치 =====
    {
      category:'정치', kwHints:['예산','의회','행정'],
      title:`${sg} 의회, ${b1}억 원 규모 내년도 예산안 심의 착수`,
      summary:`${sg} 의회가 ${b1}억 원 규모의 내년도 본예산안 심의에 돌입했다. 집행부는 복지·교통 분야 중점 투자 방침을 밝혔으며 의회 일부에서는 세부 항목 조정을 요구하고 있다. 예산안은 정기회 본회의에서 최종 처리될 예정이다.`,
      body:`${sg} 의회는 ${b1}억 원 규모의 내년도 본예산안 심의에 착수했다. 이번 예산안은 전년 대비 ${p1}% 증가한 규모로, 주민 생활 여건 개선에 초점을 맞추고 있다.\n\n집행부는 "어려운 재정 여건에서도 주민에게 실질적 혜택이 돌아가도록 편성했다"고 설명했다. 주요 사업으로는 노후 기반 시설 교체, 복지 서비스 확대, 지역 경제 활성화 지원이 포함됐다.\n\n의회 예결위는 다음 주 부서별 심사에 들어갈 예정이다. 일부 의원들은 특정 항목의 삭감 또는 증액을 요구하고 있어 심의 과정에서 조율이 필요한 상황이다.\n\n주민 단체 일각에서는 사회복지 예산 증액을 촉구하는 목소리도 나오고 있다.`
    },
    {
      category:'정치', kwHints:['의회','조례','행정'],
      title:`${sg}, 주민 참여 예산제 조례 개정안 본회의 통과`,
      summary:`${sg} 의회가 주민 참여 예산제 운영을 강화하는 조례 개정안을 의결했다. 주민 제안 사업 반영 비율이 높아지고 참여 연령도 하향 조정된다. 지역 주민단체는 환영 입장을 밝혔다.`,
      body:`${sg} 의회는 주민 참여 예산제 강화를 골자로 한 조례 개정안을 재석 의원 만장일치로 통과시켰다. 주민 제안 사업에 배정하는 예산 비율을 기존 대비 ${p2}%포인트 확대하는 것이 핵심 내용이다.\n\n참여 가능 연령도 19세에서 18세로 하향되며, 온라인 제안 채널도 새롭게 구축된다. 담당 부서는 내년도 예산 편성부터 개정 조례를 적용할 계획이다.\n\n주민 단체 관계자는 "주민이 실제로 예산 결정에 참여할 수 있는 구조가 마련됐다"며 긍정적 반응을 보였다. 반면 제안 심사 과정의 투명성을 높여야 한다는 과제도 제기됐다.\n\n${sg}는 내년 초 주민 참여 예산 공모를 열고 채택 사업을 우선 반영하겠다고 밝혔다.`
    },
    {
      category:'정치', kwHints:['개발','행정','부동산'],
      title:`${doName} ${sg} 도시재생 뉴딜 선정…${b3}억 원 국비 투입`,
      summary:`${sg}가 정부 도시재생 뉴딜 사업지로 선정돼 ${b3}억 원의 국비를 지원받는다. 원도심 노후 주거 환경 개선과 상권 활성화가 주요 과제로 5년간 단계적으로 추진된다.`,
      body:`${sg}가 정부 도시재생 뉴딜 공모에서 최종 선정돼 5년간 ${b3}억 원의 국비를 지원받는다. 사업 대상지는 ${sg} 원도심으로, 낙후된 주거 환경과 공동화된 상권이 오랜 문제로 지적돼 왔다.\n\n계획에는 노후 주택 정비, 골목길 환경 개선, 공동이용시설 설치, 지역 상인 지원 프로그램 운영이 포함된다. ${sg} 관계자는 "원도심이 다시 활력을 되찾을 것"이라고 기대했다.\n\n주민협의체가 구성돼 계획 수립 단계부터 주민 의견이 반영된다. 전문가들은 물리적 정비에 그치지 않고 사회·경제적 활성화 방안도 함께 마련돼야 한다고 조언했다.\n\n내년 상반기 실시 계획 인가 후 본격 착공에 들어갈 예정이다.`
    },

    // ===== 경제 =====
    {
      category:'경제', kwHints:['개발','경제','부동산'],
      title:`${company}, ${sg} 투자 확정…일자리 ${n1}개 창출 기대`,
      summary:`${sg}가 ${company}의 대규모 투자를 유치했다. 내년 상반기 착공을 목표로 부지 계약이 마무리됐으며, 완공 시 ${n1}개 이상 직접 일자리가 생길 전망이다.`,
      body:`${sg}가 ${company}으로부터 대규모 투자 유치를 이끌어냈다. 해당 기업은 ${sg} 일대 부지에 시설을 건립할 예정이며 총 투자 규모는 수백억 원에 달한다.\n\n착공은 내년 상반기를 목표로 하며, 가동 후 직접 고용 ${n1}명을 포함해 간접 고용까지 합산하면 더 많은 인력 수요가 발생할 전망이다. 협력 업체 유입과 소비 확대 등 연쇄 경제 효과도 기대된다.\n\n${sg} 관계자는 "기업 친화적 환경 조성 끝에 이뤄낸 성과"라며 "지역 주민에게 실질적 고용 혜택이 돌아가도록 하겠다"고 말했다.\n\n일각에서는 교통량 증가와 환경 영향에 대한 우려도 제기돼 관련 대책 마련이 요구된다.`
    },
    {
      category:'경제', kwHints:['부동산','개발'],
      title:`${sg} 아파트 매매가 전달 대비 ${p1}% 상승…실수요 거래 주도`,
      summary:`${sg} 아파트 시장에서 지난달 평균 매매가가 전달 대비 ${p1}% 올랐다. 정비사업 기대감과 교통 호재가 복합 작용한 결과로, 실수요 중심의 거래가 이루어지고 있다는 평가다.`,
      body:`${sg} 아파트 시장에서 지난달 평균 매매가가 전달 대비 ${p1}% 상승한 것으로 집계됐다. ${sg} 일대 정비사업 추진과 교통 인프라 개선 기대감이 복합 반영된 결과다.\n\n지역 중개업소에 따르면 실수요자 중심으로 거래가 이뤄지며, 학군과 생활 편의시설이 잘 갖춰진 단지에 대한 선호가 두드러진다. 중소형 평형이 거래를 주도하는 양상이다.\n\n전문가들은 "단기 급등보다는 실수요가 뒷받침된 점진적 상승"이라고 평가하면서도 금리 변화를 주시해야 한다고 조언했다.\n\n${sg}는 무분별한 투기 방지를 위해 부동산 시장 모니터링을 강화하겠다고 밝혔다.`
    },
    {
      category:'경제', kwHints:['예산','경제'],
      title:`${sg} 전통시장 ${n3}곳 현대화 지원…${b3}억 원 투입`,
      summary:`${sg}가 관내 전통시장 ${n3}곳에 시설 현대화 지원 사업을 추진한다. 아케이드 설치·주차 공간 확충·냉난방 시설 개선이 포함되며 상인회는 매출 증대를 기대하고 있다.`,
      body:`${sg}가 지역 전통시장 ${n3}곳에 대해 시설 현대화 지원 사업을 추진한다. 국비와 지방비를 합산해 총 ${b3}억 원 규모로, 아케이드 설치와 주차장 확충, 위생 시설 개선이 핵심이다.\n\n해당 시장들은 노후 시설로 인해 고객이 줄어드는 어려움을 겪어왔다. 상인회 측은 "현대화 완료 후 대형 마트에 빼앗긴 손님을 되찾을 수 있을 것"이라 기대했다.\n\n${sg}는 시설 개선과 함께 지역 농산물 직거래 장터 활성화, SNS 마케팅 지원도 병행할 계획이다.\n\n사업은 내년 말 완료를 목표로 추진된다.`
    },

    // ===== 사회 =====
    {
      category:'사회', kwHints:['안전','사회'],
      title:`${sg} 취약 골목 CCTV ${n1}대 추가 설치…야간 치안 강화`,
      summary:`${sg}가 관내 취약 골목에 CCTV ${n1}대를 추가 설치한다. 야간 조명도 LED로 교체되며 여성안심귀갓길도 확대된다. 주민들은 치안 개선 효과를 기대하고 있다.`,
      body:`${sg}가 주민 안전 강화를 위해 취약 골목 ${n1}개소에 CCTV를 추가 설치한다. 주민 신청과 현장 조사를 바탕으로 사각지대를 중심으로 위치를 선정했다.\n\nCCTV 설치와 함께 노후 가로등을 LED로 교체하고, 여성안심귀갓길 지정 구간을 ${p2}% 늘린다. 관제센터와 연계해 24시간 실시간 모니터링 체계도 강화된다.\n\n주민 A씨는 "밤에 혼자 다니기 무서웠는데 CCTV가 늘어나면 훨씬 안심될 것 같다"고 말했다.\n\n경찰서와 협력해 범죄 예방 순찰도 강화하며 자율 방범대 활동 지원 예산도 증액할 계획이다.`
    },
    {
      category:'사회', kwHints:['교육','복지'],
      title:`${sg} 초등학교 ${n3}곳 노후 교사동 리모델링…내년 착공`,
      summary:`${sg}가 관내 노후 초등학교 ${n3}곳의 교사동 리모델링을 추진한다. 내진 보강과 에너지 절감 시설 설치가 핵심으로 학부모들은 오랜 숙원이 해결됐다며 환영했다.`,
      body:`${sg}가 건립 30년 이상 된 초등학교 ${n3}곳의 교사동 리모델링을 추진한다. 내진 성능이 기준 미달이고 냉난방 시설도 노후화돼 개선이 시급했다.\n\n내진 보강, 친환경 단열재 적용, 에너지 절감형 냉난방 시스템, 화장실 개보수가 포함되며 총 사업비 ${b3}억 원은 교육청과 ${sg}가 분담한다.\n\n학부모 대표는 "아이들이 안전하고 쾌적한 환경에서 공부할 수 있게 됐다"며 환영했다. 공사 중 학생들은 임시 모듈러 교실을 이용한다.\n\n내년 초 착공해 연말 이전 완공을 목표로 하며, 완공 후 주민에게도 시설을 개방할 방침이다.`
    },
    {
      category:'사회', kwHints:['안전','환경'],
      title:`${sg}, 노후 가스배관 ${n1}개 건물 교체 완료`,
      summary:`${sg}가 노후 가스배관 교체 사업을 통해 관내 ${n1}개 건물의 배관 정비를 마쳤다. 취약 계층 세대는 무상 지원됐으며 향후 정기 점검 주기도 단축된다.`,
      body:`${sg}가 노후 가스배관 교체 사업을 통해 ${n1}개 건물의 배관 정비를 완료했다. 설치된 지 ${n3}년 이상 된 노후 배관을 우선 대상으로 했으며 취약 계층에는 전액 지원됐다.\n\n점검 과정에서 일부 배관에서 미세 누기가 발견돼 즉시 응급 조치했다. ${sg} 관계자는 "선제적 예방 정비가 대형 사고를 막는 가장 확실한 방법"이라고 강조했다.\n\n도시가스 업체와 합동으로 매년 정기 점검을 실시하고, 이상 징후 발견 시 신속 교체 체계를 마련할 계획이다.\n\n내년에도 추가 ${n1}개 건물을 대상으로 2차 교체를 이어갈 예정이다.`
    },

    // ===== 교통 =====
    {
      category:'교통', kwHints:['교통','개발','안전'],
      title:`${road} 확장 공사 완료…러시아워 소요 시간 ${p1}분 단축 전망`,
      summary:`${sg}의 만성 혼잡 구간 ${road} 확장 공사가 완료됐다. 차로가 늘어나며 러시아워 통행 소요 시간이 크게 줄어들 전망으로 주민들은 수년간의 불편이 해소된 데 안도하고 있다.`,
      body:`${sg}의 주요 혼잡 구간 ${road} 확장 공사가 마침내 완료됐다. 차로가 늘어나면서 병목 현상이 크게 해소될 것으로 기대된다.\n\n개통과 함께 교차로 신호 체계도 최적화되며 보행자 안전을 위한 LED 신호등도 설치됐다. 일일 평균 교통 정체 시간이 ${p1}분 이상 단축될 것으로 예측된다.\n\n공사 기간 우회 통행으로 불편을 겪었던 주민들은 완료를 환영하고 있으며 상권 회복도 기대된다.\n\n${sg}는 추가로 이면도로 정비와 불법 주정차 단속 강화를 통해 전반적인 교통 소통을 개선할 계획이다.`
    },
    {
      category:'교통', kwHints:['교통','버스','대중교통'],
      title:`${sg} 버스 노선 ${n3}개 개편…배차 간격 ${p3}% 단축`,
      summary:`${sg}가 버스 노선 ${n3}개를 개편해 주요 구간 배차 간격을 ${p3}% 줄인다. 신규 아파트 단지와 산업단지를 연결하는 신설 노선도 운행을 시작한다.`,
      body:`${sg}가 버스 노선 ${n3}개를 개편 운행한다. 이용 실태 분석을 바탕으로 수요가 높은 구간의 배차 간격을 ${p3}% 단축하는 것이 핵심이다.\n\n신규 주거·산업 지역에 신설 노선이 생겨 대중교통 공백이 해소된다. 정류장도 ${n1}개 추가 설치된다.\n\n일부 이용객이 적은 노선은 폐지 또는 통합되어 해당 구간 이용객의 불만도 제기됐다. ${sg}는 폐지 노선 대체로 수요응답형 버스(DRT)를 도입한다.\n\n노선 개편 세부 내용은 교통 정보 앱과 각 정류장 안내판에서 확인할 수 있다.`
    },
    {
      category:'교통', kwHints:['교통','환경'],
      title:`${sg} 자전거 전용도로 ${n1}km 신설…친환경 교통망 확충`,
      summary:`${sg}가 주요 생활권을 잇는 자전거 전용도로 ${n1}km를 새로 개설한다. 공원·학교·지하철역을 연결하며 자전거 보관소와 수리 스테이션도 함께 설치된다.`,
      body:`${sg}가 자전거 전용도로 ${n1}km를 새로 조성한다. 공원·학교·지하철역을 유기적으로 연결하도록 설계돼 출퇴근과 여가 활동에 두루 쓰인다.\n\n양방향 분리형으로 조성되며 야간 주행 안전을 위한 태양광 조명도 설치된다. 자전거 보관소 ${n3}곳과 셀프 수리 스테이션도 함께 들어선다.\n\n${sg}는 공공자전거 대여 시스템도 확대 운영하고 자전거 이용자 안전 교육 프로그램도 정기 운영할 계획이다.\n\n친환경 교통수단 이용 확대로 탄소 배출 감소 효과도 기대된다.`
    },

    // ===== 환경 =====
    {
      category:'환경', kwHints:['환경','안전','복지'],
      title:`${sg} 미세먼지 계절 관리제 돌입…공공 차량 2부제 시행`,
      summary:`${sg}가 미세먼지 계절 관리제를 시행해 공공 부문 차량 2부제와 공사장 비산먼지 강화 점검을 실시한다. 취약 계층 마스크 배포도 시작됐다.`,
      body:`${sg}가 미세먼지 계절 관리제 시행에 돌입해 봄까지 대기 환경 관리를 강화한다. 공공 부문 차량 2부제가 의무화되며 주요 공사장에 대한 비산먼지 특별 점검도 강화된다.\n\n노인·영유아 등 취약 계층에는 보건소를 통해 KF94 마스크가 무상 배포됐다. 관계자는 "시민 모두가 함께 참여해 주길 바란다"고 당부했다.\n\n경유 차량을 전기·수소차로 교체 시 보조금을 추가 지원하는 사업도 병행된다.\n\n전문가들은 "개인 노력과 사업장 배출 관리가 실질적 저감의 핵심"이라며 기업의 자발적 참여도 촉구했다.`
    },
    {
      category:'환경', kwHints:['환경','개발'],
      title:`${sg} 하천 수질 개선 프로젝트 착수…생태공원도 조성`,
      summary:`${sg}가 주요 하천 수질 개선과 수생태 복원 사업을 시작한다. 하천변에는 생태공원도 조성돼 시민 휴식 공간으로 활용된다. 총 사업비 ${b3}억 원이 투입된다.`,
      body:`${sg}가 주요 하천을 대상으로 수질 개선 및 생태 복원 프로젝트를 본격 시작한다. 오염원 차단, 수생식물 식재, 어류 서식처 조성으로 하천 자정 능력을 회복하는 데 초점을 맞췄다.\n\n하천변에는 산책로·자전거 도로·생태 관찰 덱을 갖춘 생태공원이 조성된다. 총 사업비 ${b3}억 원은 국비와 지방비를 공동 부담한다.\n\n환경 단체는 "생태 복원은 단기 공사가 아니라 지속적 관리가 핵심"이라고 강조했다. 시민 참여형 하천 모니터링 프로그램도 운영된다.\n\n사업 완료까지 약 3년이 소요되며 주민 설명회를 통해 진행 상황이 정기 공유된다.`
    },
    {
      category:'환경', kwHints:['환경','복지'],
      title:`${sg} 도심 유휴 부지 활용 소규모 공원 ${n3}곳 조성`,
      summary:`${sg}가 도심 내 자투리 공간 ${n3}곳에 소규모 공원을 만든다. 텃밭·벤치·놀이 시설이 갖춰지며 주민 공모로 공원 이름도 직접 짓는다.`,
      body:`${sg}가 도심 유휴 부지와 자투리 공간 ${n3}곳에 생활권 소규모 공원을 조성한다. 주민 생활권 내 보행 거리에 위치해 접근성이 뛰어난 게 특징이다.\n\n놀이 시설·운동 기구·파고라·주민 텃밭이 설치되며 무장애(배리어프리) 설계가 적용된다. 야간 조명도 설치돼 저녁 이용도 가능하다.\n\n${sg}는 주민 공모로 공원 이름을 주민이 직접 정하게 해 애착과 자발적 관리 참여를 이끌 계획이다.\n\n내년 봄 완공을 목표로 하며 완공 후 개방 기념 행사도 열린다.`
    },

    // ===== 복지 =====
    {
      category:'복지', kwHints:['복지','예산','사회'],
      title:`${sg} 독거노인 돌봄 서비스 ${n1}명 추가 지원`,
      summary:`${sg}가 독거 노인과 거동 불편 어르신 대상 돌봄 서비스 지원 인원을 ${n1}명 늘린다. 가사·외출 동행·말벗 서비스가 포함되며 요양 보호사 처우 개선도 병행된다.`,
      body:`${sg}가 독거 노인과 거동 불편 어르신 대상 재가 돌봄 서비스를 대폭 확대한다. 이번 확대로 ${n1}명이 추가로 가사 지원·외출 동행·건강 체크·말벗 서비스를 받게 된다.\n\n고령화로 돌봄 수요가 빠르게 증가하고 있어 서비스 공백 최소화가 시급한 과제다. ${sg}는 대기자 명단 최소화를 목표로 인력과 예산을 함께 확충할 방침이다.\n\n요양 보호사 시간당 수당 인상과 교통비 지원, 심리 상담 서비스 제공으로 인력 이탈도 방지한다.\n\n복지 전문가는 "양적 확대와 함께 질적 수준 관리가 병행돼야 실질적 효과를 거둘 수 있다"고 조언했다.`
    },
    {
      category:'복지', kwHints:['복지','청년','부동산'],
      title:`${sg} 청년 월세 지원 확대…월 최대 ${rent}만 원 지급`,
      summary:`${sg}가 청년 주거 안정을 위해 월세 지원 대상과 금액을 늘린다. 신청 연령 상한이 높아지고 소득 기준도 완화돼 더 많은 청년이 혜택을 받는다.`,
      body:`${sg}가 청년 주거 안정 지원 사업 규모를 확대한다. 지원 연령 상한이 34세에서 39세로 높아지고, 소득 기준도 완화돼 더 넓은 계층의 청년이 신청 자격을 얻는다.\n\n월 지원 금액도 인상돼 1인 가구 기준 월 최대 ${rent}만 원까지 지원된다. 지원 기간도 최대 ${rng.int(12,24)}개월로 연장됐다.\n\n청년 단체 관계자는 "현실적인 주거비 부담을 일부나마 덜 수 있어 환영한다"고 밝혔다.\n\n신청은 ${sg} 복지 포털과 동 주민센터에서 접수하며 올해 하반기부터 확대 기준이 적용된다.`
    },
    {
      category:'복지', kwHints:['복지','교육'],
      title:`${sg} 국공립어린이집 ${n3}곳 신설…대기 수요 해소 기대`,
      summary:`${sg}가 보육 수요가 높은 지역에 국공립어린이집 ${n3}곳을 추가 설치한다. 민간시설 전환과 신규 건립을 병행하며 내년 상반기 개원을 목표로 한다.`,
      body:`${sg}가 국공립어린이집 ${n3}곳을 신설해 보육 수요 증가에 대응한다. 대기가 심한 신개발 주거 단지와 외곽 지역에 우선 배치된다.\n\n민간 어린이집 국공립 전환과 신축을 병행해 시설 확충 속도를 높인다. 내년 상반기 전 개원이 목표다.\n\n학부모들은 국공립 시설이 늘면 보육 비용과 서비스 질이 모두 개선될 것으로 기대한다. 보육 교사 전문성 향상 연수 지원도 강화된다.\n\n보육 전문가는 "시설 확충과 함께 보육 교사 처우 개선이 병행돼야 지속 가능한 보육 환경이 만들어진다"고 강조했다.`
    },

    // ===== 문화 =====
    {
      category:'문화', kwHints:['문화','복지'],
      title:`${sg} ${season} 지역 축제 개막…${n1}개 프로그램 운영`,
      summary:`${sg}의 대표 지역 축제가 이번 주말 개막한다. ${n1}개 체험·공연 프로그램과 지역 특산물 장터가 운영되며 주최 측은 역대 최대 관람객을 기대하고 있다.`,
      body:`${sg}의 대표 지역 축제가 이번 주말 개막해 나흘간 행사를 펼친다. ${n1}개의 체험·공연 프로그램이 준비됐으며 지역 예술인과 학생들이 참여하는 공연도 마련됐다.\n\n행사장에는 지역 특산물 직거래 장터와 먹거리 부스 ${n3}개가 설치된다. 외국인 관광객을 위한 다국어 안내 서비스도 처음 도입됐다.\n\n주최 측은 "지난해보다 ${p1}% 이상 많은 관람객이 방문할 것"이라며 쾌적한 관람 환경 조성에 만전을 기하겠다고 밝혔다.\n\n축제 마지막 날에는 대규모 불꽃 쇼가 예정돼 가족 단위 방문객들의 큰 호응이 기대된다.`
    },
    {
      category:'문화', kwHints:['문화','교육','복지'],
      title:`${sg} 공공도서관 ${n3}곳 야간 운영 ${rng.int(1,2)}시간 연장`,
      summary:`${sg}가 공공도서관 ${n3}곳의 야간 운영 시간을 연장한다. 직장인과 학생의 이용 편의를 높이기 위한 조치로 스터디 룸도 야간에 개방된다.`,
      body:`${sg}가 공공도서관 ${n3}곳의 야간 운영 시간을 연장한다. 오후 6시에서 오후 8시까지로 늘어나며 디지털 자료실과 스터디 룸도 함께 개방된다.\n\n평일 저녁 도서관을 이용하길 원하는 직장인과 대학생의 요구가 높았던 만큼 환영 반응이 이어진다. 야간 담당 사서와 안전 인력도 추가 배치된다.\n\n야간 독서 모임, 저자 강연 등 야간 프로그램도 시범 운영된다. 6개월 운영 결과를 토대로 확대 여부를 결정할 계획이다.\n\n어린이 방과 후 독서 프로그램과 어르신 한글 교실도 도서관별로 운영된다.`
    },
    {
      category:'문화', kwHints:['문화','사회'],
      title:`${sg} 생활문화센터 신설…주민 창작·여가 공간 개방`,
      summary:`${sg}에 주민 누구나 이용할 수 있는 생활문화센터가 문을 연다. 공예·음악·요가 강좌실과 소규모 공연장이 갖춰지며 취약 계층에는 수강료 할인이 적용된다.`,
      body:`${sg}에 주민 문화·여가 활동을 지원하는 생활문화센터가 새로 문을 열었다. 지상 3층 규모로 공예·음악·댄스·요가 강좌실, 소규모 공연장, 주민 전시 공간이 갖춰져 있다.\n\n지역 예술인과 강사를 우선 채용했으며 수강료는 시중 대비 ${p2}% 저렴하게 책정됐다. 기초생활수급자 등 취약 계층에는 추가 감면 혜택이 주어진다.\n\n개관 첫 달 수강 신청이 대부분 마감될 정도로 주민 관심이 뜨겁다. 운영위원회에 주민 대표가 참여해 프로그램 방향을 함께 결정한다.\n\n${sg}는 앞으로도 문화 소외 지역 중심으로 생활문화센터를 단계적으로 확충할 계획이다.`
    },
  ];
}

// ===== NEWS GENERATION =====
function generateNewsItems(sg, doName, period, sources, keywords) {
  const dateStr = new Date().toISOString().slice(0,10);
  const rng = new RNG(mkSeed(sg + doName + dateStr));
  const allTemplates = buildTemplates(sg, doName, rng);

  const scored = allTemplates.map(t => {
    const score = keywords.length === 0 ? 0
      : keywords.filter(k => t.kwHints.some(h => h.includes(k) || k.includes(h)) || t.title.includes(k) || t.summary.includes(k)).length;
    return { t, score };
  });
  scored.sort((a, b) => b.score - a.score);

  const groups = {};
  scored.forEach(({ t, score }) => { (groups[score] = groups[score] || []).push(t); });
  const ordered = [];
  Object.keys(groups).sort((a,b) => +b - +a).forEach(s => ordered.push(...rng.shuffle(groups[s])));

  const picked = ordered.slice(0, 10);
  const today = new Date();
  const availSources = sources.length ? sources : ['연합뉴스'];

  return picked.map((t, i) => {
    const daysAgo = rng.int(0, parseInt(period));
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const matchedKw = keywords.filter(k => t.kwHints.some(h => h.includes(k)||k.includes(h)) || t.title.includes(k));
    return {
      id: i + 1,
      title: t.title,
      summary: t.summary,
      source: rng.pick(availSources),
      date: d.toISOString().slice(0, 10),
      category: t.category,
      keywords: matchedKw,
      url: `https://news.example.com/${encodeURIComponent(sg)}/${Date.now()+i}`,
      body: t.body,
      analysis: buildAnalysis(t, sg)
    };
  });
}

function buildAnalysis(t, sg) {
  const impacts = {
    '정치': `이 정책은 ${sg} 주민의 행정 참여와 재정 운영에 직접적인 영향을 미칩니다.`,
    '경제': `${sg} 지역 경제 활성화와 일자리 창출에 긍정적 파급 효과가 기대됩니다.`,
    '사회': `${sg} 주민의 일상 안전과 생활 환경 개선에 직결되는 사안입니다.`,
    '교통': `${sg} 주민의 일상 이동 편의와 출퇴근 여건에 직접적인 변화를 가져올 전망입니다.`,
    '환경': `${sg} 거주 주민의 건강과 쾌적한 생활 환경 확보에 중요한 의미를 갖습니다.`,
    '복지': `${sg} 취약 계층과 지역 주민의 삶의 질 향상에 실질적인 도움이 될 것으로 평가됩니다.`,
    '문화': `${sg} 주민의 문화 향유 기회 확대와 지역 공동체 활성화에 기여할 것으로 보입니다.`,
  };
  const cat = t.category;
  return `${t.summary.split('. ')[0]}. ${t.summary.split('. ')[1] || ''} 지역 내 관련 이해관계자들의 추이 주목이 필요하다. ${impacts[cat] || ''}`;
}

// ===== STATE =====
let keywords = [];
let newsData = [];
let currentArticle = null;
const SUBSCRIBERS_KEY = 'localnewshub_subscribers';
const EMAILJS_CFG_KEY = 'localnewshub_emailjs_cfg';

// ===== SUBSCRIBER STORAGE (localStorage) =====
function getSubscribers() {
  try { return JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || '[]'); }
  catch { return []; }
}
function saveSubscribers(list) {
  localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(list));
}
function addSubscriberRecord(email, freq, region, kws) {
  const list = getSubscribers();
  if (list.some(s => s.email === email)) return false;
  list.push({ email, freq, region, keywords: kws, added: new Date().toISOString() });
  saveSubscribers(list);
  return true;
}

// ===== EMAILJS CONFIG STORAGE =====
function getEmailJSConfig() {
  try { return JSON.parse(localStorage.getItem(EMAILJS_CFG_KEY) || '{}'); }
  catch { return {}; }
}
function saveEmailJSConfigToStorage(cfg) {
  localStorage.setItem(EMAILJS_CFG_KEY, JSON.stringify(cfg));
}
function isEmailJSConfigured() {
  const c = getEmailJSConfig();
  return !!(c.publicKey && c.serviceId && c.templateId);
}
function initEmailJS() {
  const c = getEmailJSConfig();
  if (c.publicKey && window.emailjs) {
    try { emailjs.init({ publicKey: c.publicKey }); } catch (e) { console.warn('EmailJS init failed', e); }
  }
}

// ===== UI: REGION / KEYWORDS =====
function updateSiGun() {
  const do_ = document.getElementById('doSelect').value;
  const sg = document.getElementById('sigunSelect');
  sg.innerHTML = '<option value="">시·군·구 선택</option>';
  if (do_ && SIGUN_DATA[do_]) {
    SIGUN_DATA[do_].forEach(s => { const o=document.createElement('option'); o.value=s; o.textContent=s; sg.appendChild(o); });
  }
  updateShareUrl();
}
function addKeyword() {
  const inp = document.getElementById('kwInput');
  const val = inp.value.trim();
  if (!val || keywords.includes(val)) { inp.value=''; return; }
  keywords.push(val); inp.value='';
  renderKeywords(); updateShareUrl();
}
function quickKw(kw) { if (!keywords.includes(kw)) { keywords.push(kw); renderKeywords(); updateShareUrl(); } }
function removeKeyword(kw) { keywords=keywords.filter(k=>k!==kw); renderKeywords(); updateShareUrl(); }
function renderKeywords() {
  const list = document.getElementById('keywordList');
  list.innerHTML = keywords.map(k =>
    `<span class="keyword-tag">${k}<span class="rm" onclick="removeKeyword('${k}')">×</span></span>`
  ).join('') || '<span style="font-size:12px;color:var(--ink-light)">키워드를 추가하세요</span>';
}
function updateShareUrl() {
  const do_=document.getElementById('doSelect').value, sg=document.getElementById('sigunSelect').value;
  if (!do_||!sg) { document.getElementById('shareUrl').textContent='지역과 키워드를 설정하면 공유 URL이 생성됩니다'; return; }
  const p=new URLSearchParams();
  p.set('do',do_); p.set('sg',sg);
  if (keywords.length) p.set('kw',keywords.join(','));
  p.set('period',document.getElementById('periodSelect').value);
  document.getElementById('shareUrl').textContent=`${location.origin}${location.pathname}?${p}`;
}
function copyUrl() {
  navigator.clipboard.writeText(document.getElementById('shareUrl').textContent).then(()=>{
    const btn=document.querySelector('.copy-btn'); btn.textContent='✓ 복사됨';
    setTimeout(()=>btn.textContent='복사',1500);
  });
}
function loadFromUrl() {
  const p=new URLSearchParams(location.search);
  if (p.get('do')) {
    document.getElementById('doSelect').value=p.get('do'); updateSiGun();
    setTimeout(()=>{
      if(p.get('sg')) document.getElementById('sigunSelect').value=p.get('sg');
      if(p.get('period')) document.getElementById('periodSelect').value=p.get('period');
      if(p.get('kw')){ keywords=p.get('kw').split(',').filter(Boolean); renderKeywords(); }
      updateShareUrl(); fetchNews();
    },100);
  }
}

// ===== FETCH (LOCAL GENERATION) =====
function fetchNews() {
  const do_=document.getElementById('doSelect').value, sg=document.getElementById('sigunSelect').value;
  if (!do_) { alert('시·도를 선택해주세요'); return; }
  if (!sg)  { alert('시·군·구를 선택해주세요'); return; }

  const region=`${do_} ${sg}`;
  const period=document.getElementById('periodSelect').value;
  const sources=[...document.querySelectorAll('#sourceGroup input:checked')].map(i=>i.value);

  document.getElementById('regionBadge').textContent=region;
  document.getElementById('countBadge').style.display='none';
  updateShareUrl();

  const list=document.getElementById('newsList');
  list.innerHTML=`<div class="loading-state"><div class="spinner"></div><div class="loading-text">${region} 뉴스 생성 중…</div></div>`;

  setTimeout(()=>{
    newsData = generateNewsItems(sg, do_, period, sources, keywords);
    renderNews(newsData);
  }, 300);
}

function renderNews(items) {
  const list=document.getElementById('newsList'), badge=document.getElementById('countBadge');
  if (!items.length) {
    badge.style.display='none';
    list.innerHTML=`<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">검색 결과 없음</div><div class="empty-desc">키워드를 변경하거나 기간을 늘려보세요</div></div>`;
    return;
  }
  badge.textContent=`${items.length}건`; badge.style.display='inline-flex';
  const today=new Date();
  list.innerHTML=`<div class="news-list">${items.map((n,i)=>{
    const diff=Math.floor((today-new Date(n.date))/86400000);
    const dateStr=diff===0?'오늘':diff===1?'어제':`${diff}일 전`;
    const kwTags=(n.keywords||[]).map(k=>`<span class="kw-match">#${k}</span>`).join('');
    return `<div class="news-item" style="animation:fadeIn .3s ease ${i*.05}s both">
      <div onclick="openArticle(${i})">
        <div class="news-meta"><span class="news-source">${n.source}</span><span class="news-date">${dateStr}</span><span class="news-category">${n.category}</span></div>
        <div class="news-title">${n.title}</div>
        <div class="news-summary">${n.summary}</div>
        ${kwTags?`<div class="news-keywords">${kwTags}</div>`:''}
      </div>
      <div class="news-item-actions">
        <button class="mini-btn" onclick="event.stopPropagation(); openArticle(${i})">자세히 보기</button>
        <button class="mini-btn" onclick="event.stopPropagation(); openSendModal(${i})">✉ 이 기사 발송</button>
      </div>
    </div>`;
  }).join('')}</div>`;
}

function sortNews() {
  if (!newsData.length) return;
  const sort=document.getElementById('sortSelect').value;
  const items=[...newsData];
  if (sort==='date') items.sort((a,b)=>new Date(b.date)-new Date(a.date));
  else items.sort((a,b)=>{
    const sc=n=>keywords.filter(k=>(n.title+n.summary).toLowerCase().includes(k.toLowerCase())).length;
    return sc(b)-sc(a);
  });
  renderNews(items);
}

function openArticle(idx) {
  currentArticle=newsData[idx];
  const n=currentArticle;
  document.getElementById('articleContent').innerHTML=`
    <div class="article-title">${n.title}</div>
    <div class="article-meta"><span class="article-source-tag">${n.source}</span><span>${n.date}</span><span>${n.category}</span></div>
    <div class="article-body">${(n.body||'').split('\n').filter(Boolean).map(p=>`<p>${p}</p>`).join('')}</div>
    <div class="ai-analysis">
      <div class="ai-analysis-title">🤖 AI 요약 분석</div>
      <div class="ai-analysis-body">${n.analysis||''}</div>
    </div>
    <div style="display:flex;gap:8px;margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border)">
      <button class="btn btn-blue" onclick="shareArticle()" style="font-size:13px">공유하기</button>
      <button class="btn btn-primary" onclick="closeArticleModal(); openSendModal(${idx})" style="font-size:13px">✉ 이 기사 메일 발송</button>
    </div>`;
  document.getElementById('articleModal').classList.add('open');
}
function closeArticleModal(){ document.getElementById('articleModal').classList.remove('open'); }

// ===== MAIL SETTINGS MODAL (subscribe + emailjs config tabs) =====
function openMailModal(){
  const do_=document.getElementById('doSelect').value, sg=document.getElementById('sigunSelect').value;
  document.getElementById('mailRegionInfo').textContent=do_&&sg?`${do_} ${sg}`:'(지역을 먼저 선택하세요)';
  document.getElementById('mailKeywordInfo').textContent=keywords.length?keywords.join(', '):'(전체 뉴스)';
  document.getElementById('mailModal').classList.add('open');
  document.getElementById('mailSuccess').style.display='none';
  document.getElementById('mailForm').style.display='block';

  const cfg = getEmailJSConfig();
  document.getElementById('cfgPublicKey').value = cfg.publicKey || '';
  document.getElementById('cfgServiceId').value = cfg.serviceId || '';
  document.getElementById('cfgTemplateId').value = cfg.templateId || '';
  updateConfigStatusBadge();
}
function closeMailModal(){ document.getElementById('mailModal').classList.remove('open'); }

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
}

function updateConfigStatusBadge() {
  const el = document.getElementById('configStatus');
  if (isEmailJSConfigured()) {
    el.className = 'config-status ok';
    el.textContent = '✓ EmailJS가 설정되어 있습니다. 즉시 발송이 가능합니다.';
  } else {
    el.className = 'config-status missing';
    el.textContent = '⚠ EmailJS가 설정되지 않았습니다. 아래 정보를 입력하세요.';
  }
}

function saveEmailJSConfig() {
  const cfg = {
    publicKey: document.getElementById('cfgPublicKey').value.trim(),
    serviceId: document.getElementById('cfgServiceId').value.trim(),
    templateId: document.getElementById('cfgTemplateId').value.trim(),
  };
  if (!cfg.publicKey || !cfg.serviceId || !cfg.templateId) {
    alert('Public Key, Service ID, Template ID를 모두 입력해주세요.');
    return;
  }
  saveEmailJSConfigToStorage(cfg);
  initEmailJS();
  updateConfigStatusBadge();
  const bar=document.getElementById('noticeBar');
  bar.textContent = '✓ EmailJS 설정이 저장되었습니다.';
  bar.classList.remove('error'); bar.classList.add('show');
  setTimeout(()=>bar.classList.remove('show'),3000);
}

function testEmailJSConfig() {
  const cfg = {
    publicKey: document.getElementById('cfgPublicKey').value.trim(),
    serviceId: document.getElementById('cfgServiceId').value.trim(),
    templateId: document.getElementById('cfgTemplateId').value.trim(),
  };
  if (!cfg.publicKey || !cfg.serviceId || !cfg.templateId) {
    alert('Public Key, Service ID, Template ID를 모두 입력해주세요.');
    return;
  }
  if (!window.emailjs) { alert('EmailJS 라이브러리를 불러오지 못했습니다. 인터넷 연결을 확인해주세요.'); return; }

  try { emailjs.init({ publicKey: cfg.publicKey }); } catch(e) {}

  const testEmail = prompt('테스트 메일을 받을 이메일 주소를 입력하세요:');
  if (!testEmail || !testEmail.includes('@')) return;

  emailjs.send(cfg.serviceId, cfg.templateId, {
    to_email: testEmail,
    subject: '[지역뉴스허브] 연결 테스트',
    region: '테스트 지역',
    news_html: '<p>이것은 EmailJS 연결 테스트 메일입니다. 정상적으로 수신되었다면 설정이 올바르게 완료된 것입니다.</p>',
    extra_message: ''
  }).then(()=>{
    alert('✓ 테스트 메일을 발송했습니다. 받은 메일함을 확인해주세요.');
  }).catch(err=>{
    alert('✗ 발송 실패: ' + (err?.text || err?.message || JSON.stringify(err)));
  });
}

// ===== SUBSCRIBE (saves to localStorage list used by "send now") =====
function submitMail(){
  const email=document.getElementById('mailEmail').value.trim();
  if (!email||!email.includes('@')){ alert('올바른 이메일 주소를 입력하세요'); return; }
  const do_=document.getElementById('doSelect').value, sg=document.getElementById('sigunSelect').value;
  const region = do_&&sg ? `${do_} ${sg}` : '';
  const freq = document.getElementById('mailFreq').value;

  const added = addSubscriberRecord(email, freq, region, [...keywords]);
  document.getElementById('mailForm').style.display='none';
  const successEl = document.getElementById('mailSuccess');
  successEl.textContent = added
    ? '✅ 구독이 완료되었습니다! 구독자 목록에 저장되며, "지금 메일 발송" 버튼으로 즉시 보낼 수 있어요.'
    : '이미 등록된 이메일입니다.';
  successEl.style.display='block';
  setTimeout(()=>{
    closeMailModal();
  },2200);
}

// ===== SEND NOW MODAL =====
function openSendModal(articleIdx) {
  if (!newsData.length && articleIdx === undefined) {
    alert('먼저 뉴스를 검색해주세요.');
    return;
  }
  window.__sendSingleArticleIdx = (typeof articleIdx === 'number') ? articleIdx : null;

  const region = document.getElementById('regionBadge').textContent;
  const subs = getSubscribers();

  document.getElementById('sendSubject').value = window.__sendSingleArticleIdx !== null
    ? `[지역뉴스허브] ${newsData[window.__sendSingleArticleIdx].title.slice(0,40)}`
    : `[지역뉴스허브] ${region} 주요 뉴스`;

  document.getElementById('subscriberCountInfo').textContent =
    subs.length ? `저장된 구독자 ${subs.length}명에게 발송됩니다.` : '저장된 구독자가 없습니다. "직접 입력"을 선택하거나 먼저 구독을 등록하세요.';

  document.getElementById('sendTargetMode').value = subs.length ? 'subscribers' : 'manual';
  onSendTargetChange();

  document.getElementById('sendError').style.display='none';
  document.getElementById('sendProgress').style.display='none';
  document.getElementById('sendSuccess').style.display='none';
  document.getElementById('sendFormWrap').style.display='block';

  const statusEl = document.getElementById('sendConfigStatus');
  if (isEmailJSConfigured()) {
    statusEl.className = 'config-status ok';
    statusEl.textContent = '✓ EmailJS 연결됨 — 바로 발송할 수 있습니다.';
    document.getElementById('sendNowBtn').disabled = false;
  } else {
    statusEl.className = 'config-status missing';
    statusEl.innerHTML = '⚠ EmailJS가 설정되지 않았습니다. <a href="#" onclick="closeSendModal();openMailModal();switchTab(\'config\');return false;" style="color:var(--accent2)">발송 설정하기</a>';
    document.getElementById('sendNowBtn').disabled = true;
  }

  document.getElementById('sendModal').classList.add('open');
}
function closeSendModal(){ document.getElementById('sendModal').classList.remove('open'); }

function onSendTargetChange() {
  const mode = document.getElementById('sendTargetMode').value;
  document.getElementById('subscriberCountWrap').style.display = mode === 'subscribers' ? 'block' : 'none';
  document.getElementById('manualEmailWrap').style.display = mode === 'manual' ? 'block' : 'none';
}

function buildNewsHtmlForEmail(articles, extraMsg) {
  let html = '';
  if (extraMsg && extraMsg.trim()) {
    html += `<div style="background:#f4f0e8;border-radius:8px;padding:14px 18px;margin-bottom:16px;font-size:13px;color:#3d3d5c;">${escapeHtml(extraMsg)}</div>`;
  }
  articles.forEach(a => {
    const kwHtml = (a.keywords||[]).map(k=>`<span style="background:#e8ebf8;color:#2c3e88;border-radius:100px;padding:2px 8px;font-size:11px;margin-right:4px;">#${escapeHtml(k)}</span>`).join('');
    html += `
      <div style="border:1px solid #e0ddd4;border-radius:8px;padding:14px 18px;margin-bottom:10px;background:#ffffff;">
        <div style="font-size:11px;color:#8888aa;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">${escapeHtml(a.source)} · ${escapeHtml(a.category)} · ${escapeHtml(a.date)}</div>
        <div style="font-size:15px;font-weight:700;color:#1a1a2e;margin-bottom:6px;">${escapeHtml(a.title)}</div>
        <div style="font-size:13px;color:#3d3d5c;line-height:1.6;margin-bottom:8px;">${escapeHtml(a.summary)}</div>
        ${kwHtml ? `<div>${kwHtml}</div>` : ''}
      </div>`;
  });
  return html;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

async function sendNewsletterNow() {
  if (!isEmailJSConfigured()) {
    alert('EmailJS 설정이 필요합니다.');
    return;
  }

  // Recipients
  const mode = document.getElementById('sendTargetMode').value;
  let recipients = [];
  if (mode === 'subscribers') {
    recipients = getSubscribers().map(s => s.email);
  } else {
    recipients = document.getElementById('manualEmails').value
      .split(',').map(s=>s.trim()).filter(s=>s && s.includes('@'));
  }
  if (!recipients.length) {
    showSendError('수신자가 없습니다. 이메일을 입력하거나 구독자를 등록해주세요.');
    return;
  }

  // Articles
  let articles;
  if (window.__sendSingleArticleIdx !== null && window.__sendSingleArticleIdx !== undefined) {
    articles = [newsData[window.__sendSingleArticleIdx]];
  } else {
    const count = parseInt(document.getElementById('sendArticleCount').value, 10);
    articles = newsData.slice(0, count);
  }
  if (!articles.length) {
    showSendError('발송할 기사가 없습니다. 먼저 뉴스를 검색해주세요.');
    return;
  }

  const subject = document.getElementById('sendSubject').value.trim() || '[지역뉴스허브] 주요 뉴스';
  const region = document.getElementById('regionBadge').textContent;
  const extraMsg = document.getElementById('sendExtraMsg').value;
  const newsHtml = buildNewsHtmlForEmail(articles, extraMsg);

  const cfg = getEmailJSConfig();
  try { emailjs.init({ publicKey: cfg.publicKey }); } catch(e) {}

  const sendBtn = document.getElementById('sendNowBtn');
  sendBtn.disabled = true;
  sendBtn.textContent = '발송 중...';
  document.getElementById('sendError').style.display = 'none';
  const progressEl = document.getElementById('sendProgress');
  progressEl.style.display = 'block';

  let sent = 0, failed = 0;
  for (let i = 0; i < recipients.length; i++) {
    progressEl.textContent = `발송 중... ${i+1}/${recipients.length} (${recipients[i]})`;
    try {
      await emailjs.send(cfg.serviceId, cfg.templateId, {
        to_email: recipients[i],
        subject: subject,
        region: region,
        news_html: newsHtml,
        extra_message: extraMsg || ''
      });
      sent++;
    } catch (err) {
      failed++;
      console.error('발송 실패:', recipients[i], err);
    }
  }

  sendBtn.disabled = false;
  sendBtn.textContent = '✉ 발송하기';
  progressEl.style.display = 'none';

  if (sent > 0) {
    document.getElementById('sendFormWrap').style.display = 'none';
    const successEl = document.getElementById('sendSuccess');
    successEl.textContent = `✅ ${sent}건 발송 완료` + (failed ? ` · ${failed}건 실패` : '');
    successEl.style.display = 'block';
    setTimeout(()=>{ closeSendModal(); }, 2500);
  } else {
    showSendError(`발송에 실패했습니다 (${failed}건). EmailJS 설정을 확인해주세요.`);
  }
}

function showSendError(msg) {
  const el = document.getElementById('sendError');
  el.textContent = msg;
  el.style.display = 'block';
}

function shareArticle(){
  if (!currentArticle) return;
  navigator.clipboard.writeText(`[지역뉴스허브] ${currentArticle.title}`);
  alert('기사 제목이 복사되었습니다!');
}

// ===== INIT =====
renderKeywords();
loadFromUrl();
initEmailJS();
document.getElementById('sigunSelect').addEventListener('change', updateShareUrl);
document.getElementById('periodSelect').addEventListener('change', updateShareUrl);
document.getElementById('kwInput').addEventListener('keydown', e=>{ if(e.key==='Enter') addKeyword(); });
