// compare.html 전용: URL 쿼리(ids)를 읽어 CARDS_DATA에서 골라 비교표를 렌더링
(function(){
  function getParam(name){
    var m = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  }
  var idsParam = getParam('ids');
  var wrap = document.getElementById('compare-output');
  var empty = document.getElementById('compare-empty');
  if(!wrap) return;

  if(!idsParam){
    empty.style.display = 'block';
    return;
  }
  var ids = idsParam.split(',').filter(Boolean);
  var cards = (window.CARDS_DATA || []).filter(function(c){ return ids.indexOf(c.id) !== -1; });

  if(cards.length < 2){
    empty.style.display = 'block';
    empty.querySelector('p').textContent = '비교하려면 카드를 2개 이상 골라주세요. 홈으로 돌아가 카드 타일 오른쪽 위 체크박스로 선택할 수 있어요.';
    return;
  }

  function feeText(card){
    return card.annual_fee.map(function(f){ return f.brand + ' ' + f.fee.toLocaleString('ko-KR') + '원'; }).join(' / ');
  }
  function minSpendText(card){
    return card.min_spend_krw === 0 ? '없음 (무실적)' : card.min_spend_krw.toLocaleString('ko-KR') + '원 이상';
  }

  var rows = [
    { label: '카드사 / 이름', render: function(c){ return c.issuer + ' ' + c.name; } },
    { label: '카테고리', render: function(c){
        var labels = window.CATEGORY_LABELS || {};
        return (c.categories || []).map(function(id){ return labels[id] || id; }).join(', ');
      } },
    { label: '연회비', render: feeText },
    { label: '국제 브랜드', render: function(c){ return c.intl_brand || '확인 필요'; } },
    { label: '전월 실적 조건', render: minSpendText },
    { label: '핵심 혜택', render: function(c){ return c.headline; } },
    { label: '적립·할인율', render: function(c){ return c.headline_rate; }, mono:true },
    { label: '추천 대상', render: function(c){ return c.good_for; } },
    { label: '유의사항', render: function(c){ return c.caution; } },
    { label: '실적 제외 항목(요약)', render: function(c){ return c.exclude_note || '확인 필요'; } }
  ];

  var detailPrefix = window.CARD_DETAIL_PREFIX || 'card/';
  var thead = '<tr><th>구분</th>' + cards.map(function(c){
    return '<th><a href="' + detailPrefix + c.id + '/index.html" style="color:inherit;text-decoration:underline;">' + c.issuer + ' ' + c.name + '</a></th>';
  }).join('') + '</tr>';

  var tbody = rows.map(function(row){
    return '<tr><td class="label-cell">' + row.label + '</td>' + cards.map(function(c){
      var v = row.render(c);
      return '<td>' + (row.mono ? '<span class="mono-val">' + v + '</span>' : v) + '</td>';
    }).join('') + '</tr>';
  }).join('');

  wrap.innerHTML = '<div class="compare-table-wrap"><table class="compare-table"><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table></div>';
})();
