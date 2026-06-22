/* ============================
   ë¶ìí¡ - ë©ì¸ ì¤í¬ë¦½í¸ (Supabase ì°ë)
   ============================ */

// ===== Supabase ì¤ì  =====
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

// ===== í´ë°± ë°ì´í° (Supabase ì°ê²° ì¤í¨ ì) =====
var LISTINGS_FALLBACK = [
  {
    id: 1, region: "ìì¸", type: "ìíí¸", badges: ["HOT", "AD"],
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=70",
    title: "ë¸ìì­ í¨ì±í´ë§í´ ì¼í¸ë´ (ì ê·)",
    description: "í ììë£ 1,800ë§ì, ê´ê³ ë¹ì§ì 50%, ì¼ë°ë¶ììíí¸ ì ê·íì¥ ì½ ë¬´ìí ë¹ëë¤.",
    role: ["íì¥", "íì"], pay: "ê³ì½ììë£", welfare: ["ì¼ë¹", "ê´ê³ ë¹ì§ì"],
    career: "6ê°ìì´ì", company: "ì§ì¹", fee: "1,800ë§ì"
  },
  {
    id: 2, region: "ì¸ì²", type: "ìíí¸", badges: ["HOT"],
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=70",
    title: "íì¤íì´í¸ êµ¬ì ìí¸íí¬",
    description: "1í¸ì  ìì ê³µìì­ ì§íµì°ê²°, ëëë§í¬ 498ì¸ë 4ê°ë, ë¡¯ë°ë°±íì  ìë¦¬ ìµê³ ì ìì§",
    role: ["íì¥", "íì", "ì¬ì´ë"], pay: "ê³ì½ììë£", welfare: ["ê²½ë ¥ë¬´ê´"],
    career: "12ê°ìì´ì", company: "ì§ì°ììì¨", fee: "1,200ë§ì"
  },
  {
    id: 3, region: "ë¶ì°", type: "ìíí¸", badges: ["NEW", "AD"],
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=70",
    title: "ìí°ìë¡ ê´ì íì¥/íì/ì¬ì´ë ëª¨ì§",
    description: "ë¶ì° ë¯¼ë½ë ê´ìëêµ íë¸ë¼ë§ ë·°, MBCìë¦¬, ë¶ì°ìµì´ íì´í¼ìë ìíí¸ ë¶ì",
    role: ["íì¥", "íì", "ì¬ì´ë"], pay: "ê³ì½ììë£", welfare: ["ì¼ë¹", "ê²½ë ¥ë¬´ê´"],
    career: "ê²½ë ¥ë¬´ê´", company: "(ì£¼)ë£¨í¸íëë", fee: "íì"
  },
  {
    id: 4, region: "ê²½ê¸°ë¨ë¶", type: "ìíí¸", badges: ["HOT", "ëë°"],
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=70",
    title: "ìì§ìì´ ìëìì¨ (ëíì¬ ì§ì)",
    description: "ì¼ë¹ 7ë§ì (ë°©ë¬¸ì ìë´), ëíì¬ ì§ìì¼ë¡ ë¹ ë¥¸ ê³ì½ ì§í",
    role: ["íì¥", "íì"], pay: "ê³ì½ììë£", welfare: ["ì¼ë¹"],
    career: "3ê°ìì´ì", company: "ì£¼ìíì¬ ì ì±", fee: "800ë§ì"
  },
  {
    id: 5, region: "ì¶©ì²­ë", type: "ìíí¸", badges: ["HOT"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70",
    title: "ì²ì ì±ì±í¸ìê³µì íê²© ì¡°ê±´ ë³ê²½",
    description: "ê²½ì ìë ìë ëì  íì¥, ì´ë³´ë¤ ê³ì½ ì°ê¸° í¸í ê³³ì ììµëë¤.",
    role: ["íì¥", "íì"], pay: "ê³ì½ììë£", welfare: ["ì¼ë¹", "ê´ê³ ë¹ì§ì"],
    career: "ê²½ë ¥ë¬´ê´", company: "ì¨ìì´ì¤ëíë¬ì¤", fee: "970ë§ì"
  },
  {
    id: 6, region: "ê²½ê¸°ë¨ë¶", type: "ìíí¸", badges: ["NEW"],
    img: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=600&q=70",
    title: "ê²½ê¸°ê´ì£¼ì­ ë¡¯ë°ìºì¬ ìê·¸ëì² 2,326ì¸ë",
    description: "ë§¤ì£¼ ì´ê´ ê´ê³  ì§í, ìëì  íí! ëí ë¨ì§ ìì ì  íì¥",
    role: ["ë³¸ë¶ì¥", "íì¥"], pay: "ê³ì½ììë£", welfare: ["ê´ê³ ë¹ì§ì"],
    career: "ê²½ë ¥ë¬´ê´", company: "ëì°ì¨ì¤ë", fee: "íì"
  }
];

// ===== íì¬ íí° ìí =====
var currentRegion = 'ì ì²´';
var currentKeyword = '';

// ===== Supabaseìì íì¥ ë¶ë¬ì¤ê¸° =====
async function loadListings(region, keyword) {
  var db = getSupabase();
  if (!db) {
    var data = LISTINGS_FALLBACK.slice();
    if (region && region !== 'ì ì²´') data = data.filter(function(l) { return l.region === region; });
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
    var data = window._cachedData.slice();
    if (region && region !== '전체') data = data.filter(function(l) { return l.region === region; });
    if (keyword) {
      var kw = keyword.toLowerCase();
      data = data.filter(function(l) {
        return (l.title||'').toLowerCase().includes(kw)||(l.description||'').toLowerCase().includes(kw)||(l.company||'').toLowerCase().includes(kw);
      });
    }
    var fc = document.getElementById('filterCount');
    if (fc) fc.textContent = '전체 ' + data.length + '개 현장';
    renderListings(data);
  } catch (err) {
    console.error('Supabase 오류:', err);
    window._cachedData = LISTINGS_FALLBACK;
    renderListings(LISTINGS_FALLBACK);
  }
}

// ===== íì¥ ì¹´ë ë ëë§ =====
function renderListings(data) {
  var grid = document.getElementById('listingsGrid');
  if (!grid) return;
  if (!data || data.length === 0) {
    grid.innerHTML = '<div style="text-align:center;padding:60px;color:#999;">í´ë¹ ì§ì­ íì¥ì´ ììµëë¤.</div>';
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
      (item.img ? '<img class="card-img" src="' + item.img + '" alt="' + item.title + '" loading="lazy" onerror="this.style.display=\'none\'">' : '') +
      '<div class="card-body">' +
      '<div class="card-badges">' +
        badges.map(function(b) {
          var cls = b.toLowerCase() === 'hot' ? 'hot' : b === 'NEW' ? 'new' : b === 'AD' ? 'ad' : b === 'ëë°' ? 'best' : 'type';
          return '<span class="badge badge-' + cls + '">' + b + '</span>';
        }).join('') +
        '<span class="badge badge-type">' + (item.type || 'ìíí¸') + '</span>' +
      '</div>' +
      '<div class="card-title">' + item.title + '</div>' +
      '<div class="card-desc">' + desc + '</div>' +
      '<div class="card-info">' +
        '<span class="info-tag">ð ' + item.region + '</span>' +
        '<span class="info-tag highlight">ð° íììë£ ' + (item.fee || 'íì') + '</span>' +
        '<span class="info-tag">' + role.join('/') + '</span>' +
        welfare.map(function(w) { return '<span class="info-tag">' + w + '</span>'; }).join('') +
        '<span class="info-tag">ê²½ë ¥: ' + (item.career || 'ê²½ë ¥ë¬´ê´') + '</span>' +
      '</div>' +
      '<div class="card-footer">' +
        '<span class="card-company">ð ' + item.company + '</span>' +
        '<span class="card-btn">ìì¸ë³´ê¸°</span>' +
      '</div>' +
      '</div>' +
    '</div>';
  }).join('');
  initScrollAnimations();
}

// ===== ë² ì¤í¸ íì¥ ë ëë§ =====
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
              '<div class="best-meta">ð ' + item.region + ' Â· ' + (item.type || 'ìíí¸') + ' Â· ì¡°í ' + (item.views || 0).toLocaleString() + '</div>' +
            '</div>' +
          '</div>';
        }).join('');
        return;
      }
    } catch(e) {}
  }

  // í´ë°±
  var BEST = [
    { rank: 1, title: "ê±°ì  íì´ìë ì¼ë°ë¶ì ìíí¸", region: "ê²½ìë", type: "ìíí¸", views: "4,821" },
    { rank: 2, title: "íì¤íì´í¸ ê°ì¼ ì¡°ê±´ë³ê²½", region: "ê²½ê¸°ë¨ë¶", type: "ìíí¸", views: "3,962" },
    { rank: 3, title: "íì¤íì´í¸ êµ¬ì ìí¸íí¬", region: "ì¸ì²", type: "ìíí¸", views: "3,541" },
    { rank: 4, title: "ë¸ìì­ í¨ì±í´ë§í´ ì¼í¸ë´", region: "ìì¸", type: "ìíí¸", views: "3,204" },
    { rank: 5, title: "ê²½ê¸°ê´ì£¼ì­ ë¡¯ë°ìºì¬ ìê·¸ëì²", region: "ê²½ê¸°ë¨ë¶", type: "ìíí¸", views: "2,987" },
    { rank: 6, title: "ìì§ìì´ ìëìì¨", region: "ê²½ê¸°ë¨ë¶", type: "ìíí¸", views: "2,744" },
  ];
  grid.innerHTML = BEST.map(function(item, i) {
    return '<div class="best-card" onclick="location.href=\'listings.html\'">' +
      '<div class="best-rank ' + (rankClass[i] || '') + '">' + item.rank + '</div>' +
      '<div class="best-info">' +
        '<div class="best-title">' + item.title + '</div>' +
        '<div class="best-meta">ð ' + item.region + ' Â· ' + item.type + ' Â· ì¡°í ' + item.views + '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ===== ì§ì­ íí° =====
function filterRegion(el, region) {
  document.querySelectorAll('.region-tab').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
  currentRegion = region;
  loadListings(region, currentKeyword);
}

// ===== íí° ì´ê¸°í =====
function resetFilters() {
  document.querySelectorAll('.region-tab').forEach(function(t) { t.classList.remove('active'); });
  var first = document.querySelector('.region-tab');
  if (first) first.classList.add('active');
  document.querySelectorAll('.filter-select').forEach(function(s) { s.selectedIndex = 0; });
  currentRegion = 'ì ì²´';
  currentKeyword = '';
  loadListings('ì ì²´', '');
}

// ===== ê²ì =====
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

if (document.getElementById('searchInput')) {
  document.getElementById('searchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') doSearch();
  });
}

// ===== ëª¨ë°ì¼ ë©ë´ =====
function toggleMobileMenu() {
  var menu = document.getElementById('mobileMenu');
  if (menu) menu.classList.toggle('open');
}

// ===== í°ì»¤ =====
function initTicker() {
  var content = document.getElementById('tickerContent');
  if (!content) return;
  content.innerHTML += content.innerHTML;
}

// ===== ì«ì ì ëë©ì´ì =====
function animateNumber(el, target) {
  if (!el) return;
  var current = 0;
  var step = Math.ceil(target / 60);
  var timer = setInterval(function() {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString();
    if (current >= target) clearInterval(timer);
  }, 30);
}

// ===== ì¤í¬ë¡¤ ì ëë©ì´ì =====
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
      }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });
      targets.forEach(function(el) { observer.observe(el); });
    });
  });
}

// ===== URL íë¼ë¯¸í° =====
function getUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name) || '';
}

// ===== íì¥ ë±ë¡ =====
async function submitListing(e) {
  e.preventDefault();
  var db = getSupabase();
  var btn = document.getElementById('submitBtn');
  if (btn) { btn.textContent = 'ë±ë¡ ì¤...'; btn.disabled = true; }

  var formData = {
    region: document.getElementById('region') ? document.getElementById('region').value : '',
    type: document.getElementById('type') ? document.getElementById('type').value : 'ìíí¸',
    title: document.getElementById('title') ? document.getElementById('title').value : '',
    description: document.getElementById('description') ? document.getElementById('description').value : '',
    company: document.getElementById('company') ? document.getElementById('company').value : '',
    fee: document.getElementById('fee') ? document.getElementById('fee').value : '',
    pay: document.getElementById('pay') ? document.getElementById('pay').value : '',
    career: document.getElementById('career') ? document.getElementById('career').value : 'ê²½ë ¥ë¬´ê´',
    role: Array.from(document.querySelectorAll('input[name="role"]:checked')).map(function(el) { return el.value; }),
    welfare: Array.from(document.querySelectorAll('input[name="welfare"]:checked')).map(function(el) { return el.value; }),
    badges: [],
    is_active: true
  };

  if (!db) {
    alert('ì ì í ë¤ì ìëí´ì£¼ì¸ì.');
    if (btn) { btn.textContent = 'íì¥ ë±ë¡íê¸°'; btn.disabled = false; }
    return;
  }

  try {
    var sess = await db.auth.getSession();
    var user = sess && sess.data && sess.data.session ? sess.data.session.user : null;
    if (user) formData.user_id = user.id;

    var result = await db.from('listings').insert([formData]);
    if (result.error) throw result.error;
    alert('íì¥ì´ ì±ê³µì ì¼ë¡ ë±ë¡ëììµëë¤!');
    window.location.href = 'listings.html';
  } catch (err) {
    alert('ë±ë¡ ì¤ë¥: ' + (err.message || err));
    if (btn) { btn.textContent = 'íì¥ ë±ë¡íê¸°'; btn.disabled = false; }
  }
}

// ===== íìê°ì =====
async function submitSignup(e) {
  e.preventDefault();
  var db = getSupabase();
  if (!db) { alert('ì°ê²° ì¤ë¥'); return; }
  var email = document.getElementById('email') ? document.getElementById('email').value : '';
  var password = document.getElementById('password') ? document.getElementById('password').value : '';
  var name = document.getElementById('name') ? document.getElementById('name').value : '';
  var btn = document.getElementById('submitBtn');
  if (btn) { btn.textContent = 'ì²ë¦¬ ì¤...'; btn.disabled = true; }
  try {
    var result = await db.auth.signUp({ email: email, password: password, options: { data: { name: name } } });
    if (result.error) throw result.error;
    alert('íìê°ì ìë£! ì´ë©ì¼ì íì¸í´ì£¼ì¸ì.');
    window.location.href = 'login.html';
  } catch (err) {
    alert('ì¤ë¥: ' + (err.message || err));
    if (btn) { btn.textContent = 'íìê°ì'; btn.disabled = false; }
  }
}

// ===== ë¡ê·¸ì¸ =====
async function submitLogin(e) {
  e.preventDefault();
  var db = getSupabase();
  if (!db) { alert('ì°ê²° ì¤ë¥'); return; }
  // userId íë(ìì´ë ë°©ì) ëë email íë ë ë¤ ì§ì
  var userId = document.getElementById('userId') ? document.getElementById('userId').value.trim() : '';
  var emailRaw = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
  var email = userId ? (userId + '@bunyangtok.com') : emailRaw;
  var password = document.getElementById('password') ? document.getElementById('password').value : '';
  var btn = document.getElementById('submitBtn');
  if (!email) { alert('ìì´ëë¥¼ ìë ¥í´ì£¼ì¸ì.'); return; }
  if (btn) { btn.textContent = 'ë¡ê·¸ì¸ ì¤...'; btn.disabled = true; }
  try {
    var result = await db.auth.signInWithPassword({ email: email, password: password });
    if (result.error) throw result.error;
    window.location.href = 'index.html';
  } catch (err) {
    alert('ìì´ë ëë ë¹ë°ë²í¸ê° ì¬ë°ë¥´ì§ ììµëë¤.');
    if (btn) { btn.textContent = 'ë¡ê·¸ì¸'; btn.disabled = false; }
  }
}

// ===== ë¡ê·¸ìì =====
async function logout() {
  var db = getSupabase();
  if (db) await db.auth.signOut();
  window.location.href = 'index.html';
}

// ===== íì¥ë±ë¡ (ë¡ê·¸ì¸ íì) =====
function goRegister() {
  var db = getSupabase();
  if (!db) { window.location.href = 'login.html?next=register.html'; return; }
  db.auth.getSession().then(function(sess) {
    var user = sess && sess.data && sess.data.session ? sess.data.session.user : null;
    if (!user) {
      alert('íì¥ ë±ë¡ì ë¡ê·¸ì¸ í ì´ì© ê°ë¥í©ëë¤.');
      window.location.href = 'login.html?next=register.html';
    } else {
      window.location.href = 'register.html';
    }
  });
}

// ===== í¤ë ë¡ê·¸ì¸ ìí UI ìë°ì´í¸ =====
function updateAuthUI(user) {
  var topbarLinks = document.querySelector('.topbar-links');
  if (!topbarLinks) return;
  if (user) {
    var email = user.email || '';
    var shortEmail = email.length > 14 ? email.substring(0, 14) + '...' : email;
    topbarLinks.innerHTML =
      '<span style="color:rgba(255,255,255,0.6);font-size:12px;margin-right:4px;">ð¤ ' + shortEmail + '</span>' +
      '<a href="#" onclick="logout();return false;" class="btn-join" style="background:#555;border-color:#555;">ë¡ê·¸ìì</a>';
  }
}

// ===== ì´ê¸°í =====
document.addEventListener('DOMContentLoaded', async function() {
  // ë¡ê·¸ì¸ ìí íì¸
  var db = getSupabase();
  var currentUser = null;
  if (db) {
    try {
      var sess = await db.auth.getSession();
      currentUser = sess && sess.data && sess.data.session ? sess.data.session.user : null;
    } catch(e) {}
  }

  // register.htmlì ë¡ê·¸ì¸ íì
  if (window.location.pathname.includes('register.html') && !currentUser) {
    alert('íì¥ ë±ë¡ì ë¡ê·¸ì¸ í ì´ì© ê°ë¥í©ëë¤.');
    window.location.href = 'login.html?next=register.html';
    return;
  }

  // í¤ë UI ìë°ì´í¸
  updateAuthUI(currentUser);

  var urlRegion = getUrlParam('region');
  var urlKeyword = getUrlParam('q');
  if (urlRegion) currentRegion = urlRegion;
  if (urlKeyword) currentKeyword = urlKeyword;

  await loadListings(currentRegion, currentKeyword);
  await renderBest();

  initTicker();
  animateNumber(document.getElementById('todayVisit'), 2847);
  animateNumber(document.getElementById('todaySite'), 93);

  document.querySelectorAll('.section-header, .best-card, .news-item, .stat-card, .banner-content, .cta-box').forEach(function(el) {
    el.classList.add('section-reveal');
  });
  initScrollAnimations();

  var registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.addEventListener('submit', submitListing);

  // signup.html / login.htmlì ê° íì¼ì ì¸ë¼ì¸ ì¤í¬ë¦½í¸ê° ì§ì  ì²ë¦¬
  // (ì¤ë³µ ì´ë²¤í¸ ë°©ì§ â script.jsììë ë³ë ì°ê²° ì í¨)
});
