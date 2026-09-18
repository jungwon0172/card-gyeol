// ===== 카드결 공통 스크립트 =====

// ---- 쿠키 동의 배너 ----
(function(){
  var KEY = 'cardgyeol_cookie_consent';
  var banner = document.getElementById('cookie-banner');
  if(!banner) return;
  try{
    if(localStorage.getItem(KEY)){ banner.classList.add('hidden'); }
  }catch(e){}
  var acceptBtn = document.getElementById('cookie-accept');
  if(acceptBtn){
    acceptBtn.addEventListener('click', function(){
      try{ localStorage.setItem(KEY, '1'); }catch(e){}
      banner.classList.add('hidden');
    });
  }
})();

// ---- 홈: 카테고리 필터 ----
(function(){
  var chips = document.querySelectorAll('.filter-chip');
  var cards = document.querySelectorAll('.ccard-tile');
  if(!chips.length || !cards.length) return;
  chips.forEach(function(chip){
    chip.addEventListener('click', function(){
      chips.forEach(function(c){ c.classList.remove('active'); });
      chip.classList.add('active');
      var cat = chip.getAttribute('data-cat');
      cards.forEach(function(tile){
        var cats = (tile.getAttribute('data-cats') || '').split(',');
        var show = (cat === 'all') || cats.indexOf(cat) !== -1;
        tile.style.display = show ? '' : 'none';
      });
    });
  });
})();

// ---- 카드 타일 클릭 -> 상세페이지 이동 (비교 선택 버튼 클릭은 제외) ----
(function(){
  var tiles = document.querySelectorAll('.ccard-tile[data-href]');
  tiles.forEach(function(tile){
    tile.addEventListener('click', function(e){
      if(e.target.closest('.ccard-select')) return; // 비교 선택 버튼 클릭이면 이동하지 않음
      var href = tile.getAttribute('data-href');
      if(href) window.location.href = href;
    });
  });
})();

// ---- 비교하기: 선택 상태 관리 ----
(function(){
  var selectBtns = document.querySelectorAll('.ccard-select');
  var bar = document.getElementById('compare-bar');
  if(!selectBtns.length || !bar) return;

  var countEl = document.getElementById('compare-count');
  var goBtn = document.getElementById('compare-go');
  var clearBtn = document.getElementById('compare-clear');
  var selected = [];

  function render(){
    if(selected.length > 0){ bar.classList.add('show'); } else { bar.classList.remove('show'); }
    countEl.textContent = selected.length + '개 선택';
    goBtn.disabled = selected.length < 2;
  }

  selectBtns.forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      var id = btn.getAttribute('data-id');
      var idx = selected.indexOf(id);
      if(idx === -1){
        if(selected.length >= 4){ return; } // 최대 4개 비교
        selected.push(id);
        btn.classList.add('checked');
      }else{
        selected.splice(idx,1);
        btn.classList.remove('checked');
      }
      render();
    });
  });

  if(clearBtn){
    clearBtn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      selected = [];
      selectBtns.forEach(function(b){ b.classList.remove('checked'); });
      render();
    });
  }

  if(goBtn){
    goBtn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      if(selected.length < 2) return;
      var comparePath = document.body.getAttribute('data-compare-path') || 'compare.html';
      window.location.href = comparePath + '?ids=' + selected.join(',');
    });
  }
})();
