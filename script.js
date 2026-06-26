/* ============================
   분양톡 - 메인 스크립트 (Supabase 연동)
   ============================ */

// ===== Supabase 설정 =====
const SUPABASE_URL = 'https://prjmiekiehvveklbqxjt.supabase.co';
const SUPABASE_KEY = 'sb_publishable__4jfHSNP9Cifbtyvt-dI6Q_uiHjjZEo';
var _supabase = null;

function getSupabase() {
  if (_supabase) return _supabase;
  if (window.supabase && window.supabase.createClient) {
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return _supabase;
}

// ===== 폴백 데이터 (Supabase 연결 실패 시) =====
var LISTINGS_FALLBACK = [
  {
    id: 1, region: "서울", type: "아파트", badges: ["HOT", "AD"],
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=70",
    title: "노원역 효성해링턴 센트럴 (신규)",
    description: "팀 수수료 1,800만원, 광고비지원 50%, 일반분양아파트 신규현장 콜 무수히 뜹니다.",
    role: ["팀장", "팀원"], pay: "계약수수료", welfare: ["일비", "광고비지원"],
    career: "6개월이상", company: "지승", fee: "1,800만원"
  },
  {
    id: 2, region: "인천", type: "아파트", badges: ["HOT"],
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=70",
    title: "힐스테이트 구월 아트파크",
    description: "1호선 예술공원역 직통연결, 랜드마크 498세대 4개동, 롯데백화점 자리 최고의 입지",
    role: ["팀장", "팀원", "사이드"], pay: "계약수수료", welfare: ["경력무관"],
    career: "12개월이상", company: "지우알엔씨", fee: "1,200만원"
  },
  {
    id: 3, region: "부산", type: "아파트", badges: ["NEW", "AD"],
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=70",
    title: "알티에로 광안 팀장/팀원/사이드 모집",
    description: "부산 민락동 광안대교 파노라마 뷰, MBC자리, 부산최초 하이퍼엔드 아파트 분양",
    role: ["팀장", "팀원", "사이드"], pay: "계약수수료", welfare: ["일비", "경력무관"],
    career: "경력무관", company: "(주)루트플래닝", fee: "협의"
  },
  {
    id: 4, region: "경기남부", type: "아파트", badges: ["HOT", "대박"],
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=70",
    title: "수지자이 에디시온 (대행사 직영)",
    description: "일비 7만원 (방문시 상담), 대행사 직영으로 빠른 계약 진행",
    role: ["팀장", "팀원"], pay: "계약수수료", welfare: ["일비"],
    career: "3개월이상", company: "주식회사 유성", fee: "800만원"
  },
  {
    id: 5, region: "충청도", type: "아파트", badges: ["HOT"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70",
    title: "천안 성성호수공원 파격 조건 변경",
    description: "경쟁 상대 없는 독점 현장, 이보다 계약 쓰기 편한 곳은 없습니다.",
    role: ["팀장", "팀원"], pay: "계약수수료", welfare: ["일비", "광고비지원"],
    career: "경력무관", company: "씨아이앤드플러스", fee: "970만원"
  },
  {
    id: 6, region: "경기남부", type: "아파트", badges: ["NEW"],
    img: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=600&q=70",
    title: "경기광주역 롯데캐슬 시그니처 2,326세대",
    description: "매주 총괄 광고 집행, 압도적 혜택! 대형 단지 안정적 현장",
    role: ["본부장", "팀장"], pay: "계약수수료", welfare: ["광고비지원"],
    career: "경력무관", company: "도우씨앤디", fee: "협의"
  }
];
var LISTINGS = LISTINGS_FALLBACK; // 구버전 detail.html 호환

// ===== 현재 필터 상태 =====
var currentRegion = '전체';
var currentKeyword = '';

// ===== Supabase에서 현장 불러오기 =====
async function loadListings(region, keyword) {
  var db = getSupabase();
  if (!db) {
    var data = LISTINGS_FALLBACK.slice();
    if (region && region !== '전체') data = data.filter(function(l) { return l.region === region; });
    if (keyword) {
      var kw = keyword.toLowerCase();
      data = data.filter(function(l) {
        return l.title.toLowerCase().includes(kw) || (l.description || '').toLowerCase().includes(kw) || l.company.toLowerCase().includes(kw);
      });
    }
    renderListings(data);
    return;
  }

  try {
    var allResult = await db.from('listings').select('*').eq('is_active', true).order('created_at', { ascending: false });
    if (allResult.error) throw allResult.error;
    window._cachedData = allResult.data || [];
    var fcEl = document.getElementById('filterCount');
    if (fcEl) fcEl.textContent = '전체 ' + window._cachedData.length + '개 현장';
    if (typeof applyFilters === 'function') {
      applyFilters();
    } else {
      renderListings(window._cachedData);
    }
  } catch (err) {
    console.error('Supabase 오류:', err);
    window._cachedData = LISTINGS_FALLBACK;
    renderListings(LISTINGS_FALLBACK);
  }
}

// ===== 카드 이미지 슬라이더 =====
function buildCardImage(item) {
  var imgs = (item.images && item.images.length > 0) ? item.images : (item.img ? [item.img] : []);
  if (imgs.length === 0) return '';
  if (imgs.length === 1) {
    return '<img class="card-img" src="' + imgs[0] + '" alt="' + item.title + '" loading="lazy" onerror="this.style.display=\'none\'">';
  }
  // 2장 이상: 슬라이더
  var uid = 'sl_' + item.id;
  var dots = imgs.map(function(_, i) {
    return '<span class="sl-dot' + (i === 0 ? ' active' : '') + '" onclick="event.stopPropagation();slGo(\'' + uid + '\',' + i + ')"></span>';
  }).join('');
  var imgTags = imgs.map(function(url, i) {
    return '<img class="sl-img" src="' + url + '" alt="사진' + (i+1) + '" loading="lazy" style="display:' + (i === 0 ? 'block' : 'none') + ';" onerror="this.style.display=\'none\'">';
  }).join('');
  return '<div class="card-slider" id="' + uid + '" data-idx="0" data-total="' + imgs.length + '">' +
    imgTags +
    '<button class="sl-btn sl-prev" onclick="event.stopPropagation();slMove(\'' + uid + '\',-1)">&#10094;</button>' +
    '<button class="sl-btn sl-next" onclick="event.stopPropagation();slMove(\'' + uid + '\',1)">&#10095;</button>' +
    '<div class="sl-dots">' + dots + '</div>' +
    '<div class="sl-counter">1 / ' + imgs.length + '</div>' +
  '</div>';
}
function slGo(uid, idx) {
  var slider = document.getElementById(uid);
  if (!slider) return;
  var imgs = slider.querySelectorAll('.sl-img');
  var dots = slider.querySelectorAll('.sl-dot');
  var counter = slider.querySelector('.sl-counter');
  var cur = parseInt(slider.dataset.idx) || 0;
  imgs[cur].style.display = 'none'; dots[cur].classList.remove('active');
  imgs[idx].style.display = 'block'; dots[idx].classList.add('active');
  slider.dataset.idx = idx;
  if (counter) counter.textContent = (idx + 1) + ' / ' + imgs.length;
}
function slMove(uid, dir) {
  var slider = document.getElementById(uid);
  if (!slider) return;
  var total = parseInt(slider.dataset.total) || 1;
  var cur = parseInt(slider.dataset.idx) || 0;
  slGo(uid, (cur + dir + total) % total);
}

// ===== 현장 카드 렌더링 =====
function renderListings(data) {
  var grid = document.getElementById('listingsGrid');
  if (!grid) return;
  if (!data || data.length === 0) {
    grid.innerHTML = '<div style="text-align:center;padding:60px;color:#999;">해당 지역 현장이 없습니다.</div>';
    return;
  }
  grid.innerHTML = data.map(function(item) {
    var badges = item.badges || [];
    var role = item.role || [];
    var welfare = item.welfare || [];
    var desc = item.description || item.desc || '';
    return '<div class="listing-card fade-up ' +
      (badges.includes('HOT') ? 'hot-card' : '') + ' ' +
      (badges.includes('AD') ? 'ad-card' : '') +
      '" onclick="location.href=\'detail.html?id=' + item.id + '\'">' +
      buildCardImage(item) +
      '<div class="card-body">' +
      '<div class="card-badges">' +
        badges.map(function(b) {
          var cls = b.toLowerCase() === 'hot' ? 'hot' : b === 'NEW' ? 'new' : b === 'AD' ? 'ad' : b === '대박' ? 'best' : 'type';
          return '<span class="badge badge-' + cls + '">' + b + '</span>';
        }).join('') +
        '<span class="badge badge-type">' + (item.type || '아파트') + '</span>' +
      '</div>' +
      '<div class="card-chat-name">' + item.title + '</div>' +
      '<div class="card-title">' + item.title + '</div>' +
      '<div class="card-chat-preview">' +
        '<span class="card-chat-region">' + (item.region || '') + '</span>' +
        '<span class="card-chat-fee">' + (item.fee || '협의') + '</span>' +
      '</div>' +
      '<div class="card-desc">' + desc + '</div>' +
      '<div class="card-info">' +
        '<span class="info-tag">📍 ' + item.region + '</span>' +
        '<span class="info-tag highlight">💰 팀수수료 ' + (item.fee || '협의') + '</span>' +
        '<span class="info-tag">' + role.join('/') + '</span>' +
        welfare.map(function(w) { return '<span class="info-tag">' + w + '</span>'; }).join('') +
        '<span class="info-tag">경력: ' + (item.career || '경력무관') + '</span>' +
      '</div>' +
      '<div class="card-footer">' +
        '<span class="card-btn">상세보기</span>' +
      '</div>' +
      '</div>' +
      '<div class="card-chat-right">' +
        '<span class="card-chat-region">' + (item.region || '') + '</span>' +
        '<span class="card-chat-fee">' + (item.fee || '협의') + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
  initScrollAnimations();
}

// ===== 베스트 현장 렌더링 =====
async function renderBest() {
  var grid = document.getElementById('bestGrid');
  if (!grid) return;
  var rankClass = ['gold', 'silver', 'bronze'];

  var db = getSupabase();
  if (db) {
    try {
      var result = await db.from('listings').select('id,title,region,type,views').eq('is_active', true).order('views', { ascending: false }).limit(6);
      if (!result.error && result.data && result.data.length > 0) {
        grid.innerHTML = result.data.map(function(item, i) {
          return '<div class="best-card" onclick="location.href=\'detail.html?id=' + item.id + '\'">' +
            '<div class="best-rank ' + (rankClass[i] || '') + '">' + (i + 1) + '</div>' +
            '<div class="best-info">' +
              '<div class="best-title">' + item.title + '</div>' +
              '<div class="best-meta">📍 ' + item.region + ' · ' + (item.type || '아파트') + ' · 조회 ' + (item.views || 0).toLocaleString() + '</div>' +
            '</div>' +
          '</div>';
        }).join('');
        return;
      }
    } catch(e) {}
  }
}

// ===== 지역 필터 =====
function filterRegion(el, region) {
  document.querySelectorAll('.region-tab').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
  currentRegion = region;
  loadListings(region, currentKeyword);
}

// ===== 필터 초기화 =====
function resetFilters() {
  document.querySelectorAll('.region-tab').forEach(function(t) { t.classList.remove('active'); });
  var first = document.querySelector('.region-tab');
  if (first) first.classList.add('active');
  document.querySelectorAll('.filter-select').forEach(function(s) { s.selectedIndex = 0; });
  currentRegion = '전체';
  currentKeyword = '';
  loadListings('전체', '');
}

// ===== 검색 =====
function doSearch() {
  var keyword = (document.getElementById('searchInput') ? document.getElementById('searchInput').value.trim() : '');
  var region = (document.getElementById('regionSelect') ? document.getElementById('regionSelect').value : '');
  if (!keyword && !region) {
    window.location.href = 'listings.html';
    return;
  }
  var params = new URLSearchParams();
  if (keyword) params.set('q', keyword);
  if (region) params.set('region', region);
  window.location.href = 'listings.html?' + params.toString();
}

function bindSearchEnter() {
  var si = document.getElementById('searchInput');
  if (si && !si._enterBound) {
    si._enterBound = true;
    si.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
    });
  }
}
// DOM 준비 후 검색창에 엔터키 리스너 연결 (head에서 로드돼도 동작하도록)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindSearchEnter);
} else {
  bindSearchEnter();
}

// ===== 모바일 메뉴 =====
function toggleMobileMenu() {
  var menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}

// ===== 티커 =====
function initTicker() {
  var content = document.getElementById('tickerContent');
  if (!content) return;
  content.innerHTML += content.innerHTML;
}

// ===== 스크롤 애니메이션 =====
function initScrollAnimations() {
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      var targets = document.querySelectorAll('.fade-up, .section-reveal');
      if (!targets.length) return;
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px' });
      targets.forEach(function(el) { observer.observe(el); });
    });
  });
}

// ===== URL 파라미터 =====
function getUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name) || '';
}

// ===== 현장 등록 =====
async function submitListing(e) {
  e.preventDefault();
  var db = getSupabase();
  var btn = document.getElementById('submitBtn');
  if (btn) { btn.textContent = '등록 중...'; btn.disabled = true; }

  var formData = {
    region: document.getElementById('region') ? document.getElementById('region').value : '',
    type: document.getElementById('type') ? document.getElementById('type').value : '아파트',
    title: document.getElementById('title') ? document.getElementById('title').value : '',
    description: document.getElementById('description') ? document.getElementById('description').value : '',
    company: document.getElementById('company') ? document.getElementById('company').value : '',
    fee: document.getElementById('fee') ? document.getElementById('fee').value : '',
    pay: document.getElementById('pay') ? document.getElementById('pay').value : '',
    career: document.getElementById('career') ? document.getElementById('career').value : '경력무관',
    role: Array.from(document.querySelectorAll('input[name="role"]:checked')).map(function(el) { return el.value; }),
    welfare: Array.from(document.querySelectorAll('input[name="welfare"]:checked')).map(function(el) { return el.value; }),
    badges: [],
    is_active: true
  };

  if (!db) {
    alert('잠시 후 다시 시도해주세요.');
    if (btn) { btn.textContent = '현장 등록하기'; btn.disabled = false; }
    return;
  }

  try {
    var sess = await db.auth.getSession();
    var user = sess && sess.data && sess.data.session ? sess.data.session.user : null;
    if (user) formData.user_id = user.id;

    var result = await db.from('listings').insert([formData]);
    if (result.error) throw result.error;
    alert('현장이 성공적으로 등록되었습니다!');
    window.location.href = 'listings.html';
  } catch (err) {
    alert('등록 오류: ' + (err.message || err));
    if (btn) { btn.textContent = '현장 등록하기'; btn.disabled = false; }
  }
}

// ===== 로그아웃 =====
async function logout() {
  var db = getSupabase();
  if (db) await db.auth.signOut();
  window.location.href = 'index.html';
}

// ===== 현장등록 (로그인 필요) =====
function goRegister() {
  var db = getSupabase();
  if (!db) { window.location.href = 'login.html?next=register.html'; return; }
  db.auth.getSession().then(function(sess) {
    var user = sess && sess.data && sess.data.session ? sess.data.session.user : null;
    if (!user) {
      alert('현장 등록은 로그인 후 이용 가능합니다.');
      window.location.href = 'login.html?next=register.html';
    } else {
      window.location.href = 'register.html';
    }
  });
}

// ===== 헤더 로그인 상태 UI 업데이트 =====
function updateAuthUI(user) {
  var topbarLinks = document.querySelector('.topbar-links');
  if (!topbarLinks) return;
  if (user) {
    var nickname = (user.user_metadata && user.user_metadata.nickname)
      ? user.user_metadata.nickname
      : (user.email || '').split('@')[0];
    topbarLinks.innerHTML =
      '<a href="profile.html" style="color:rgba(255,255,255,0.85);font-size:12px;font-weight:600;text-decoration:none;margin-right:4px;">👤 ' + nickname + '</a>' +
      '<a href="my-listings.html" style="color:rgba(255,255,255,0.7);font-size:12px;text-decoration:none;margin-right:4px;">내 현장</a>' +
      '<a href="#" onclick="logout();return false;" class="btn-join" style="background:#555;border-color:#555;">로그아웃</a>';
  }
}

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', async function() {
  var db = getSupabase();
  var currentUser = null;
  if (db) {
    try {
      var sess = await db.auth.getSession();
      currentUser = sess && sess.data && sess.data.session ? sess.data.session.user : null;
    } catch(e) {}
  }

  if (window.location.pathname.includes('register.html') && db && !currentUser) {
    window.location.href = 'login.html?next=register.html';
    return;
  }

  updateAuthUI(currentUser);

  var urlRegion = getUrlParam('region');
  var urlKeyword = getUrlParam('q');
  if (urlRegion) currentRegion = urlRegion;
  if (urlKeyword) currentKeyword = urlKeyword;

  await loadListings(currentRegion, currentKeyword);
  await renderBest();

  initTicker();

  if (db) {
    var today = new Date().toISOString().split('T')[0];
    db.from('listings').select('id', {count: 'exact', head: true}).then(function(r) {
      var cnt = r.count || 0;
      var el1 = document.getElementById('totalListings');
      var el2 = document.getElementById('topbarTotal');
      if (el1) el1.innerHTML = cnt + '<span>건</span>';
      if (el2) el2.textContent = cnt;
    });
    db.from('listings').select('id', {count: 'exact', head: true}).gte('created_at', today).then(function(r) {
      var cnt = r.count || 0;
      var el1 = document.getElementById('todaySite');
      var el2 = document.getElementById('topbarNewSite');
      if (el1) el1.innerHTML = cnt + '<span>건</span>';
      if (el2) el2.textContent = cnt;
    });
  }

  document.querySelectorAll('.section-header, .best-card, .news-item, .stat-card, .banner-content, .cta-box').forEach(function(el) {
    el.classList.add('section-reveal');
  });
  initScrollAnimations();
  initFontToggle();
});

/* ===== 모바일 폰트 크기 토글 버튼 ===== */
function initFontToggle() {
  if (window.innerWidth > 600) return;
  var sizes = ['sm', 'md', 'lg'];
  var labels = { sm: '소', md: '중', lg: '대' };

  var saved = localStorage.getItem('btFontSize') || 'md';
  document.body.classList.add('fs-' + saved);

  var btn = document.createElement('button');
  btn.className = 'font-toggle-btn';
  btn.setAttribute('aria-label', '폰트 크기 조절');

  function updateBtn(size) {
    btn.innerHTML =
      '<span class="ft-icon">' + (size === 'sm' ? '가↓' : size === 'lg' ? '가↑' : '가') + '</span>' +
      '<span class="ft-label">' + labels[size] + '</span>';
  }
  updateBtn(saved);

  btn.addEventListener('click', function() {
    var cur = sizes.find(function(s) { return document.body.classList.contains('fs-' + s); }) || 'md';
    var next = sizes[(sizes.indexOf(cur) + 1) % sizes.length];
    sizes.forEach(function(s) { document.body.classList.remove('fs-' + s); });
    document.body.classList.add('fs-' + next);
    localStorage.setItem('btFontSize', next);
    updateBtn(next);
  });

  document.body.appendChild(btn);
}

/* ===== 모바일 글자 크기 조절 버튼 (좌측 하단) ===== */
(function () {
  var LEVELS = ['', 'fs-lg', 'fs-xl'];   // 0:보통 1:크게 2:더크게
  var NAMES  = ['보통', '크게', '더크게'];
  var idx = 0;
  try { idx = parseInt(localStorage.getItem('fontScale') || '0', 10) || 0; } catch (e) {}
  if (idx < 0 || idx > 2) idx = 0;

  function apply() {
    document.body.classList.remove('fs-lg', 'fs-xl');
    if (LEVELS[idx]) document.body.classList.add(LEVELS[idx]);
    var lbl = document.querySelector('#fontSizeBtn .fsb-label');
    if (lbl) lbl.textContent = NAMES[idx];
    try { localStorage.setItem('fontScale', String(idx)); } catch (e) {}
  }

  function build() {
    if (document.getElementById('fontSizeBtn')) return;
    // 모바일 메인(홈) 화면에서만 표시 — 회원가입/로그인 등 다른 페이지엔 생성 안 함
    var _p = location.pathname;
    if (!(_p === '/' || _p === '' || /\/index\.html$/.test(_p))) return;
    var b = document.createElement('button');
    b.id = 'fontSizeBtn';
    b.className = 'font-size-btn';
    b.type = 'button';
    b.setAttribute('aria-label', '글자 크기 조절');
    b.innerHTML = '<span class="fsb-icon">가</span><span class="fsb-label">보통</span>';
    b.addEventListener('click', function () {
      idx = (idx + 1) % LEVELS.length;
      apply();
    });
    document.body.appendChild(b);
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
