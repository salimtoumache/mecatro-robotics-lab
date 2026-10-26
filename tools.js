(function () {
  'use strict';
  function start() {
    var MB = window.MB, cat = MB.catalog, ui = MB.ui, ico = MB.icon;
    var NS = 'http://www.w3.org/2000/svg', rad = Math.PI / 180, deg = 180 / Math.PI;
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    var el = function (tag, attrs, html) { var e = document.createElement(tag); for (var k in attrs || {}) e.setAttribute(k, attrs[k]); if (html !== undefined) e.innerHTML = html; return e; };
    var sv = function (tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs || {}) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
    var f = function (v, d) { return isFinite(v) ? v.toFixed(d === undefined ? 3 : d) : '∞'; };
    function slider(label, min, max, step, val, unit, on) {
      var id = 'w' + Math.random().toString(36).slice(2, 8), row = el('div', { 'class': 'wrow' });
      var lab = el('label', { 'for': id }, label), inp = el('input', { type: 'range', id: id, min: min, max: max, step: step, value: val }), out = el('output', {}, '');
      var show = function () { out.textContent = f(+inp.value, step < 1 ? 2 : 0) + unit; };
      inp.addEventListener('input', function () { show(); on(+inp.value); }); show();
      row.append(lab, inp, out); row.set = function (v) { inp.value = v; show(); }; return row;
    }

    var head = document.getElementById('toolsHead');
    var cats = Object.keys(cat.toolCats);
    head.innerHTML =
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">' + ui.home + '</a>' + ico('chev', 'sep') + '<span aria-current="page">' + ui.tools + '</span></nav>' +
      '<p class="eyebrow">Interactive tools</p>' +
      '<h1>Tools you can play with</h1>' +
      '<p class="lead">Calculators and simulators for robotics, in one place. Move a slider, change a number, and watch what happens. Nothing to install.</p>' +
      '<div class="chips" role="group" aria-label="' + esc('Category') + '"><button type="button" class="chip" data-cat="all" aria-pressed="true">All</button>' +
      cats.map(function (c) { return '<button type="button" class="chip" data-cat="' + c + '" aria-pressed="false">' + esc(cat.toolCats[c]) + '</button>'; }).join('') + '</div>' +
      '<div class="tool-index">' + cat.tools.map(function (t) { return '<a href="#' + t.id + '" data-cat="' + t.cat + '">' + esc(t.name) + '</a>'; }).join('') + '</div>';
    document.querySelectorAll('.tool-group').forEach(function (g) {
      var c = g.dataset.cat, h = el('h2', { 'class': 'grp-h' }, esc(cat.toolCats[c])); g.prepend(h);
    });
    document.querySelectorAll('.tool').forEach(function (s) {
      var t = cat.tools.filter(function (x) { return x.id === s.id; })[0];
      if (t) s.setAttribute('aria-label', t.name);
    });
    var chips = head.querySelectorAll('.chip');
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (o) { o.setAttribute('aria-pressed', String(o === c)); });
        document.querySelectorAll('.tool-group').forEach(function (g) { g.hidden = !(c.dataset.cat === 'all' || g.dataset.cat === c.dataset.cat); });
        head.querySelectorAll('.tool-index a').forEach(function (a) { a.hidden = !(c.dataset.cat === 'all' || a.dataset.cat === c.dataset.cat); });
      });
    });
    function focusHash() {
      var id = location.hash.slice(1), s = id && document.getElementById(id);
      if (!s || !s.classList.contains('tool')) return;
      chips[0].click();
      s.scrollIntoView({ block: 'start' });
      document.querySelectorAll('.tool.target').forEach(function (x) { x.classList.remove('target'); }); s.classList.add('target');
    }
    window.addEventListener('hashchange', focusHash);

    var PRESETS = {
      r2: { name: '2-joint planar arm', rows: [[30, 0, 0.5, 0], [60, 0, 0.3, 0]] },
      r3: { name: '3-DOF arm (the robot page)', rows: [[30, 0.5, 0, 90], [60, 0, 1.2, 0], [60, 0, 1.05, 0]] },
      ur: { name: '6-axis collaborative arm (UR5 numbers)', rows: [[30, 0.0892, 0, 90], [-60, 0, -0.425, 0], [60, 0, -0.3923, 0], [0, 0.1092, 0, 90], [45, 0.0947, 0, -90], [0, 0.0823, 0, 0]] },
      blank: { name: 'Empty table (3 joints)', rows: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]] }
    };
    function dhTool(root) {
      var S = { mode: 'std', rows: PRESETS.r3.rows.map(function (r) { return r.slice(); }) };
      root.append(el('h4', {}, 'Try it: the DH table calculator'));
      root.append(el('p', { 'class': 'wnote' }, 'Type a DH table (up to 6 joints, angles in degrees, lengths in metres) and get the matrix of every joint and the final pose of the tool. Choose the standard or the modified convention.'));
      var bar = el('div', { 'class': 'toolbar' });
      var seg = el('div', { 'class': 'wseg' }, '<button type="button" data-m="std" class="on">Standard DH</button><button type="button" data-m="mod">Modified DH (DHM)</button>');
      var sel = el('select', { 'aria-label': 'Examples' }, '<option value="">' + esc('Load an example…') + '</option>' + Object.keys(PRESETS).map(function (k) { return '<option value="' + k + '">' + esc(PRESETS[k].name) + '</option>'; }).join(''));
      var add = el('button', { type: 'button', 'class': 'ghost-b' }, '+ Joint'), del = el('button', { type: 'button', 'class': 'ghost-b' }, '− Joint');
      bar.append(seg, sel, add, del); root.append(bar);
      var tableHost = el('div', { 'class': 'dh-table-host', dir: 'ltr' }), out = el('div', { 'class': 'dh-out' });
      root.append(tableHost, out);
      var HEADS = { std: ['θ (°)', 'd (m)', 'a (m)', 'α (°)'], mod: ['α (°)', 'a (m)', 'θ (°)', 'd (m)'] };
      var order = { std: [0, 1, 2, 3], mod: [3, 2, 0, 1] };
      function buildTable() {
        var o = order[S.mode];
        var h = '<table class="dh"><thead><tr><th>i</th>' + HEADS[S.mode].map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr></thead><tbody>';
        S.rows.forEach(function (r, i) { h += '<tr><td>' + (i + 1) + '</td>' + o.map(function (c) { return '<td><input type="number" step="any" value="' + r[c] + '" data-r="' + i + '" data-c="' + c + '" aria-label="' + HEADS[S.mode][o.indexOf(c)] + ' ' + (i + 1) + '"></td>'; }).join('') + '</tr>'; });
        tableHost.innerHTML = h + '</tbody></table>';
        add.disabled = S.rows.length >= 6; del.disabled = S.rows.length <= 1;
      }
      var svgs = {}, matHost = el('div', { 'class': 'dh-mats' });
      var views = el('div', { 'class': 'dh-views' });
      ['xy', 'xz'].forEach(function (k) { svgs[k] = sv('svg', { viewBox: '0 0 300 220', 'class': 'wsvg dh-view', role: 'img', 'aria-label': k === 'xy' ? 'Top view (x, y)' : 'Side view (x, z)' }); views.append(svgs[k]); });
      var summary = el('div', { 'class': 'dh-sum' });
      out.append(summary, views, matHost);
      var clean = function (v) { return Math.abs(v) < 5e-5 ? 0 : v; };
      function pre(title, M) {
        var n = function (x) { return clean(x).toFixed(3).padStart(8); };
        return '<pre class="matrix" dir="ltr">' + esc(title) + '\n' + M.map(function (r) { return r.map(n).join(' '); }).join('\n') + '</pre>';
      }
      function drawView(svg, pts, ia, ib, la, lb) {
        svg.innerHTML = '';
        var xs = pts.map(function (p) { return p[ia]; }), ys = pts.map(function (p) { return p[ib]; });
        var x0 = Math.min.apply(0, xs.concat(0)), x1 = Math.max.apply(0, xs.concat(0)), y0 = Math.min.apply(0, ys.concat(0)), y1 = Math.max.apply(0, ys.concat(0));
        var span = Math.max(x1 - x0, y1 - y0, 0.2), k = 170 / span, cx = 150 - ((x0 + x1) / 2) * k, cy = 110 + ((y0 + y1) / 2) * k;
        var P = function (p) { return [cx + p[ia] * k, cy - p[ib] * k]; };
        sv('line', { x1: 10, y1: cy, x2: 290, y2: cy, 'class': 'ax' }, svg); sv('line', { x1: cx, y1: 10, x2: cx, y2: 210, 'class': 'ax' }, svg);
        var t1 = sv('text', { x: 292, y: cy - 4, 'text-anchor': 'end' }, svg); t1.textContent = la; var t2 = sv('text', { x: 14, y: 22 }, svg); t2.textContent = lb;
        sv('polyline', { points: pts.map(function (p) { return P(p).join(','); }).join(' '), 'class': 'link2', fill: 'none' }, svg);
        pts.forEach(function (p, i) { var q = P(p); sv('circle', { cx: q[0], cy: q[1], r: i === pts.length - 1 ? 5 : 4, 'class': i === pts.length - 1 ? 'pt' : 'jt' }, svg); var t = sv('text', { x: q[0] + 7, y: q[1] - 6 }, svg); t.textContent = String(i); });
      }
      function compute() {
        var rows = S.rows.map(function (r) { return { th: ['', r[0]], d: ['', r[1]], a: ['', r[2]], al: ['', r[3]] }; });
        var Ts = (S.mode === 'std' ? RB.stdChain : RB.modChain)(rows, []);
        var Tt = Ts[Ts.length - 1], pts = Ts.map(function (m) { return [m[0][3], m[1][3], m[2][3]]; });
        var yaw = Math.atan2(Tt[1][0], Tt[0][0]) * deg, pitch = Math.atan2(-Tt[2][0], Math.hypot(Tt[2][1], Tt[2][2])) * deg, roll = Math.atan2(Tt[2][1], Tt[2][2]) * deg;
        summary.innerHTML = '<div><b>Tool position (m)</b><span class="mono" dir="ltr">x = ' + f(clean(Tt[0][3])) + '&nbsp;&nbsp; y = ' + f(clean(Tt[1][3])) + '&nbsp;&nbsp; z = ' + f(clean(Tt[2][3])) + '</span></div>' +
          '<div><b>Orientation, Z-Y-X angles (°)</b><span class="mono" dir="ltr">yaw = ' + f(clean(yaw), 1) + '&nbsp;&nbsp; pitch = ' + f(clean(pitch), 1) + '&nbsp;&nbsp; roll = ' + f(clean(roll), 1) + '</span></div>' +
          '<div><b>Reach from the base (m)</b><span class="mono" dir="ltr">' + f(Math.hypot(Tt[0][3], Tt[1][3], Tt[2][3])) + '</span></div>';
        drawView(svgs.xy, pts, 0, 1, 'x', 'y'); drawView(svgs.xz, pts, 0, 2, 'x', 'z');
        var mats = '<details class="dh-det" open><summary>Final matrix T(0→tool)</summary>' + pre('T(0→' + S.rows.length + ') =', Tt) + '</details>';
        var each = '<details class="dh-det"><summary>Matrix of every joint and the product so far</summary>';
        for (var i = 0; i < S.rows.length; i++) {
          var Ai = (S.mode === 'std' ? RB.stdA(S.rows[i][0], S.rows[i][1], S.rows[i][2], S.rows[i][3]) : RB.modA(S.rows[i][3], S.rows[i][2], S.rows[i][0], S.rows[i][1]));
          each += '<div class="dh-pair">' + pre('A' + (i + 1) + ' = T(' + i + '→' + (i + 1) + ') =', Ai) + pre('T(0→' + (i + 1) + ') =', Ts[i + 1]) + '</div>';
        }
        matHost.innerHTML = mats + each + '</details>';
      }
      tableHost.addEventListener('input', function (e) {
        var t = e.target; if (!t.dataset || t.dataset.r === undefined) return;
        var v = parseFloat(t.value); S.rows[+t.dataset.r][+t.dataset.c] = isFinite(v) ? v : 0; compute();
      });
      seg.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return; S.mode = b.dataset.m;
        seg.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); buildTable(); compute();
      });
      sel.addEventListener('change', function () { if (!sel.value) return; S.rows = PRESETS[sel.value].rows.map(function (r) { return r.slice(); }); sel.value = ''; buildTable(); compute(); });
      add.addEventListener('click', function () { if (S.rows.length < 6) { S.rows.push([0, 0, 0, 0]); buildTable(); compute(); } });
      del.addEventListener('click', function () { if (S.rows.length > 1) { S.rows.pop(); buildTable(); compute(); } });
      buildTable(); compute();
    }

    function diffTool(root) {
      var S = { r: 0.05, b: 0.3, wl: 8, wr: 12, v: 0.4, w: 0.8, mode: 'wheels' };
      root.append(el('h4', {}, 'Try it: a differential-drive robot'));
      root.append(el('p', { 'class': 'wnote' }, 'Two wheels, each with its own motor. Set the wheel speeds to see how fast and how sharply the robot turns, or ask for a speed and a turn rate to get the wheel speeds you must command. r is the wheel radius, b the distance between the wheels.'));
      var box = el('div', { 'class': 'wbox' }), ctl = el('div', { 'class': 'wctl' }), outEl = el('div', { 'class': 'wout' });
      var seg = el('div', { 'class': 'wseg' }, '<button type="button" data-m="wheels" class="on">Wheels → robot</button><button type="button" data-m="robot">Robot → wheels</button>');
      var sR = slider('r', 0.02, 0.15, 0.005, S.r, ' m', function (v) { S.r = v; update(); });
      var sB = slider('b', 0.1, 0.8, 0.01, S.b, ' m', function (v) { S.b = v; update(); });
      var sL = slider('ωL', -20, 20, 0.5, S.wl, ' rad/s', function (v) { S.wl = v; update(); });
      var sRt = slider('ωR', -20, 20, 0.5, S.wr, ' rad/s', function (v) { S.wr = v; update(); });
      var sV = slider('v', -1.5, 1.5, 0.05, S.v, ' m/s', function (v) { S.v = v; update(); });
      var sW = slider('ω', -3, 3, 0.05, S.w, ' rad/s', function (v) { S.w = v; update(); });
      ctl.append(seg, sR, sB, sL, sRt, sV, sW, outEl);
      var svg = sv('svg', { viewBox: '0 0 480 300', 'class': 'wsvg', role: 'img', 'aria-label': 'Top view of the robot and its path' });
      box.append(svg, ctl); root.append(box);
      function update() {
        var wl = S.wl, wr = S.wr, v, w;
        if (S.mode === 'wheels') { v = S.r * (wr + wl) / 2; w = S.r * (wr - wl) / S.b; }
        else { v = S.v; w = S.w; wl = (v - w * S.b / 2) / S.r; wr = (v + w * S.b / 2) / S.r; }
        sL.style.display = sRt.style.display = S.mode === 'wheels' ? '' : 'none'; sV.style.display = sW.style.display = S.mode === 'robot' ? '' : 'none';
        var R = Math.abs(w) < 1e-9 ? Infinity : v / w;
        var rpm = function (x) { return f(x * 60 / (2 * Math.PI), 0); };
        var kind = Math.abs(w) < 1e-9 ? (Math.abs(v) < 1e-9 ? 'standing still' : 'straight line') : (Math.abs(v) < 1e-9 ? 'spinning on the spot' : 'curve');
        outEl.innerHTML = '<ul><li>v = r (ω<sub>R</sub> + ω<sub>L</sub>) / 2 = <b>' + f(v, 3) + '</b> m/s</li><li>ω = r (ω<sub>R</sub> − ω<sub>L</sub>) / b = <b>' + f(w, 3) + '</b> rad/s (' + f(w * deg, 1) + '°/s)</li>' +
          '<li>turning radius R = v / ω = <b>' + (isFinite(R) ? f(Math.abs(R), 3) + ' m' : '∞') + '</b></li>' +
          '<li>ω<sub>L</sub> = <b>' + f(wl, 2) + '</b> rad/s (' + rpm(wl) + ' rpm), ω<sub>R</sub> = <b>' + f(wr, 2) + '</b> rad/s (' + rpm(wr) + ' rpm)</li></ul><span>' + kind + '</span>';
        svg.innerHTML = '';
        var K = 220, ox = 240, oy = 215, th = 0;
        sv('line', { x1: 10, y1: oy, x2: 470, y2: oy, 'class': 'ax' }, svg);
        // path for 3 seconds
        var pts = [], x = 0, y = 0, a = Math.PI / 2, dt = 0.05, n = 70, i;
        var scaleK = K;
        for (i = 0; i <= n; i++) { pts.push([x, y, a]); x += v * Math.cos(a) * dt; y += v * Math.sin(a) * dt; a += w * dt; }
        var maxd = Math.max(0.3, Math.max.apply(0, pts.map(function (p) { return Math.hypot(p[0], p[1]); })));
        scaleK = Math.min(K, 150 / maxd);
        var P = function (p) { return [ox + p[0] * scaleK, oy - p[1] * scaleK]; };
        if (isFinite(R) && Math.abs(R) * scaleK < 900) { var ci = P([-R, 0]); sv('circle', { cx: ci[0], cy: ci[1], r: 4, 'class': 'pt' }, svg); var tt = sv('text', { x: ci[0] + 7, y: ci[1] - 6, 'class': 'c-pt' }, svg); tt.textContent = 'ICC'; sv('circle', { cx: ci[0], cy: ci[1], r: Math.abs(R) * scaleK, fill: 'none', stroke: '#6f7b8c', 'stroke-dasharray': '5 5' }, svg); }
        sv('polyline', { points: pts.map(function (p) { return P(p).join(','); }).join(' '), 'class': 'alt', style: 'stroke:#4ed17f;stroke-dasharray:none;stroke-width:3' }, svg);
        // the robot at the start: body, two wheels, heading arrow
        var s0 = Math.max(10, Math.min(46, S.b * scaleK * 0.5));
        var g = sv('g', { transform: 'translate(' + ox + ',' + oy + ')' }, svg);
        sv('rect', { x: -s0, y: -s0 * 1.1, width: 2 * s0, height: 2.2 * s0, rx: 8, fill: '#1c2470', stroke: '#7f8cff', 'stroke-width': 2 }, g);
        sv('rect', { x: -s0 - 7, y: -s0 * 0.6, width: 7, height: s0 * 1.2, rx: 2, fill: wl >= 0 ? '#ff9f43' : '#ff6b6b' }, g);
        sv('rect', { x: s0, y: -s0 * 0.6, width: 7, height: s0 * 1.2, rx: 2, fill: wr >= 0 ? '#ff9f43' : '#ff6b6b' }, g);
        sv('path', { d: 'M0 ' + (-s0 * 0.2) + ' V' + (-s0 * 0.9) + ' M-7 ' + (-s0 * 0.6) + ' L0 ' + (-s0 * 0.95) + ' L7 ' + (-s0 * 0.6), fill: 'none', stroke: '#e8eef5', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
        var lt = sv('text', { x: -s0 - 4, y: s0 * 1.1 + 16, 'text-anchor': 'middle' }, svg); lt.setAttribute('transform', 'translate(' + ox + ',' + oy + ')'); lt.textContent = 'L';
        var rt = sv('text', { x: s0 + 4, y: s0 * 1.1 + 16, 'text-anchor': 'middle' }, svg); rt.setAttribute('transform', 'translate(' + ox + ',' + oy + ')'); rt.textContent = 'R';
      }
      seg.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        if (b.dataset.m === 'robot' && S.mode === 'wheels') { S.v = S.r * (S.wr + S.wl) / 2; S.w = S.r * (S.wr - S.wl) / S.b; sV.set(Math.max(-1.5, Math.min(1.5, S.v))); sW.set(Math.max(-3, Math.min(3, S.w))); S.v = +sV.querySelector('input').value; S.w = +sW.querySelector('input').value; }
        if (b.dataset.m === 'wheels' && S.mode === 'robot') { S.wl = Math.max(-20, Math.min(20, (S.v - S.w * S.b / 2) / S.r)); S.wr = Math.max(-20, Math.min(20, (S.v + S.w * S.b / 2) / S.r)); sL.set(S.wl); sRt.set(S.wr); S.wl = +sL.querySelector('input').value; S.wr = +sRt.querySelector('input').value; }
        S.mode = b.dataset.m; seg.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); update();
      });
      update();
    }

    var MINE = { dh: dhTool, diff: diffTool };
    document.querySelectorAll('.widget[data-widget]').forEach(function (w) { var k = w.dataset.widget; if (MINE[k] && !w.firstChild) MINE[k](w); });
    var W = window.MB_WIDGETS || {};
    document.querySelectorAll('.widget[data-widget]').forEach(function (w) { var k = w.dataset.widget; if (!w.firstChild && W[k]) W[k](w); });
    if (location.hash) setTimeout(focusHash, 80);
  }
  if (window.MB && window.MB.ready) start(); else window.addEventListener('mb-ready', start);
})();
