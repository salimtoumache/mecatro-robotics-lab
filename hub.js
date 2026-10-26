(function () {
  'use strict';
  function start() {
    const MB = window.MB, cat = MB.catalog, ui = MB.ui, ico = MB.icon;
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const root = document.getElementById('hub');
    if (!root) return;
    const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]));
    const robotById = byId(cat.robots), courseById = byId(cat.courses), toolById = byId(cat.tools);
    const pad = (n) => String(n).padStart(2, '0');

    const PATHS = [
      { id: 'beginner', name: 'I am new to robots', tag: 'No maths needed. See what a robot is made of, then play with the simplest ones.',
        steps: [['course', 'learn'], ['robot', 'arm'], ['robot', 'gantry'], ['robot', 'mobile'], ['tool', 'arm2']] },
      { id: 'builder', name: 'I want to build one', tag: 'Wheels, drive types, motors and control: what you need before you pick up a screwdriver.',
        steps: [['robot', 'mobile'], ['robot', 'wheels'], ['tool', 'diff'], ['tool', 'pid'], ['course', 'ctrl'], ['robot', 'scara']] },
      { id: 'curious', name: 'I want to understand it deeply', tag: 'The maths of motion: frames, DH tables, Jacobians, singularities and dynamics.',
        steps: [['course', 'maths'], ['tool', 'dh'], ['robot', 'articulated'], ['robot', 'cobot'], ['course', 'sing'], ['course', 'model']] }
    ];
    const stepInfo = ([kind, id]) => {
      if (kind === 'robot') { const r = robotById[id]; return { href: r.href, name: r.name, type: ui.typeResults.robot, id, track: true }; }
      if (kind === 'course') { const c = courseById[id]; return { href: c.href, name: c.name, type: ui.typeResults.course, id, track: true }; }
      return { href: 'tools.html#' + id, name: toolById[id].name, type: ui.typeResults.tool, id, track: false };
    };

    const kinds = [['all', 'All'], ['serial', ui.serial], ['parallel', ui.parallel], ['mobile', ui.mobile]];
    const countKind = (k) => (k === 'all' ? cat.robots.length : cat.robots.filter((r) => r.kind === k).length);
    const social = cat.links.social.map(([name, url, svg]) => `<a href="${url}" target="_blank" rel="noopener">${svg}<span>${name}</span></a>`).join('');
    const featured = ['arm2', 'dh', 'diff', 'pid', 'astar', 'kalman'];
    const heroJoints = [1, 2, 3, 4, 5, 6].map((i) => `<span class="q"><i>q${i}</i><b>+0.0°</b></span>`).join('');
    const head = (n, label, title, text) =>
      `<header class="block-h rv"><div><p class="eyebrow"><b>${n}</b> / ${label}</p><h2>${title}</h2></div><p>${text}</p></header>`;

    root.innerHTML =
      '<section class="hero" id="top">' +
        '<div class="hero-copy">' +
          '<p class="eyebrow"><span class="dot"></span>Mecatro Club · interactive learning platform</p>' +
          '<h1>Learn robots<br>by <em>moving</em> them.</h1>' +
          '<p class="lead">Eight robots, each with a 3D model you can move, its kinematic diagram, the DH table and the maths behind it. Short lessons, small tools, nothing to install.</p>' +
          `<form class="hero-search" role="search" id="heroSearch">${ico('search')}<input type="search" autocomplete="off" placeholder="${esc(ui.searchPh)}" aria-label="${esc(ui.search)}"><button type="submit">Search</button></form>` +
          `<div class="cta"><a class="btn" href="#paths">Choose your path${ico('arrow')}</a><a class="btn ghost" href="#robots">Browse the robots</a></div>` +
          `<dl class="spec"><div><dt>Robots</dt><dd>${pad(cat.robots.length)}</dd></div><div><dt>Courses</dt><dd>${pad(cat.courses.length)}</dd></div><div><dt>Tools</dt><dd>${pad(cat.tools.length)}</dd></div></dl>` +
        '</div>' +
        '<figure class="hero-view" aria-hidden="true">' +
          '<span class="tag tl">FIG. 01 · 6-AXIS ARM</span><span class="tag tr">LIVE</span>' +
          `<div id="heroView"></div><figcaption>${heroJoints}</figcaption>` +
        '</figure>' +
      '</section>' +

      '<section class="block" id="paths">' + head('01', 'Start here', 'Three ways in', 'Pick the one that sounds like you. Each path is a short route through robots, lessons and tools. Your progress stays in this browser.') +
        '<div class="paths rv">' + PATHS.map((p, k) => {
          const steps = p.steps.map(stepInfo);
          return `<details class="path" data-path="${p.id}" name="paths"${k === 0 ? ' open' : ''}>` +
            `<summary><span class="pn">${pad(k + 1)}</span><h3>${p.name}</h3><span class="pm"><span class="cnt mono"></span><span class="rm-bar"><i></i></span></span><span class="pc" aria-hidden="true"></span></summary>` +
            `<div class="path-body"><p>${p.tag}</p><ol class="route" style="--n:${steps.length}">` +
            steps.map((f, i) => `<li data-id="${f.id}" data-track="${f.track ? 1 : 0}"><a href="${f.href}"><span class="n">${i + 1}</span><span class="t">${esc(f.name)}</span><em>${f.type}</em></a></li>`).join('') +
            '</ol></div></details>';
        }).join('') + '</div></section>' +

      '<section class="block" id="robots">' + head('02', 'Robots', 'Eight robots, one way to read them', 'Every robot page has the same tabs: a 3D model, the diagram, the DH table, the formulas and where the robot is used.') +
        '<div class="chips rv" role="group" aria-label="' + esc(ui.type) + '">' + kinds.map(([k, label], i) => `<button type="button" class="chip" data-kind="${k}" aria-pressed="${i === 0}">${label}<sup>${countKind(k)}</sup></button>`).join('') + '</div>' +
        `<div class="rtable rv"><div class="rhead" aria-hidden="true"><span></span><span>Robot</span><span>Chain</span><span>DOF</span><span>${ui.level}</span><span>${ui.time}</span><span></span></div>` +
        cat.robots.map((r) =>
          `<a class="rrow" href="${r.href}" data-kind="${r.kind}" data-id="${r.id}"><span class="rr-g">${MB.glyph(r.id)}</span>` +
          `<span class="rr-main"><b>${esc(r.name)}</b><span class="rr-tag">${esc(r.tag)}</span><span class="rr-use">Used in: ${esc(r.used.replace(/\.$/, ''))}</span>` +
          `<span class="rr-meta mono">${esc(r.code)} · ${esc(r.dof)} DOF · ${ui.lv[r.level - 1]} · ~${r.min} ${ui.min}</span></span>` +
          `<span class="rr-code mono">${esc(r.code)}</span><span class="rr-dof mono">${esc(r.dof)}</span>` +
          `<span class="rr-lv">${MB.lvDots(r.level)}${ui.lv[r.level - 1]}</span><span class="rr-min mono">~${r.min} ${ui.min}</span>` +
          `<span class="rr-go" aria-hidden="true"><i class="rr-done" title="${esc(ui.doneOn)}">✓</i>${ico('arrow')}</span></a>`).join('') +
        '</div></section>' +

      '<section class="block" id="courses">' + head('03', 'Courses', 'From first lesson to master level', 'Lessons are short and each one ends with a question to check yourself.') +
        '<div class="clist rv">' + cat.courses.map((c, i) =>
          `<a class="crow" href="${c.href}" data-id="${c.id}" data-prefix="${c.prefix}" data-total="${c.total}"><span class="cn">${pad(i + 1)}</span>` +
          `<span class="cb"><h3>${esc(c.name)}</h3><p>${esc(c.tag)}</p></span>` +
          `<span class="cm"><span class="lvl">${MB.lvDots(c.level)}${ui.lv[c.level - 1]}</span><span class="mono cnt"></span><span class="mono mins">~${c.min} ${ui.min}</span></span>` +
          '<span class="rm-bar"><i></i></span></a>').join('') +
        '</div></section>' +

      '<section class="block" id="tools">' + head('04', 'Tools', 'Small tools, ready to use', 'Calculators and simulators taken out of the lessons, so you can use them on their own.') +
        '<div class="tgrid rv">' + featured.map((id, i) => { const t = toolById[id];
          return `<a class="tcard" href="tools.html#${t.id}"><span class="tn mono">T/${pad(i + 1)}</span><h3>${esc(t.name)}</h3><p>${esc(t.tag)}</p>${ico('arrow')}</a>`; }).join('') + '</div>' +
        `<p class="more rv"><a class="btn ghost" href="tools.html">All ${cat.tools.length} tools${ico('arrow')}</a></p></section>` +

      '<section class="block" id="club"><div class="club-box rv">' +
        '<img class="club-mark" src="assets/brand/emblem-white.png" alt="" width="320" height="320">' +
        '<p class="eyebrow">Mecatro Club</p><h2>Built by a club, for anyone who likes robots</h2>' +
        '<p>mecatrobot is the learning platform of Mecatro Club. Come to a workshop, ask questions, build something with us. Every level is welcome.</p>' +
        `<p class="fac">${esc(cat.faculty)}</p>` +
        `<div class="cta"><a class="btn" href="${cat.links.join}" target="_blank" rel="noopener">${ico('join')}${ui.join}</a><a class="btn ghost" href="${cat.links.hub}" target="_blank" rel="noopener">All our links</a></div>` +
        `<div class="club-soc" aria-label="${esc(ui.contact)}">${social}</div>` +
      '</div></section>';

    const form = document.getElementById('heroSearch'), input = form.querySelector('input');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = MB.search(input.value, 5);
      if (res.length === 1) { location.href = res[0].href; return; }
      MB.openSearch();
      const pi = document.querySelector('.pal-in input');
      if (pi) { pi.value = input.value; pi.dispatchEvent(new Event('input')); }
    });

    const chips = root.querySelectorAll('.chip'), rows = root.querySelectorAll('.rrow');
    chips.forEach((chip) => chip.addEventListener('click', () => {
      chips.forEach((o) => o.setAttribute('aria-pressed', String(o === chip)));
      rows.forEach((row) => { row.hidden = !(chip.dataset.kind === 'all' || row.dataset.kind === chip.dataset.kind); });
    }));

    const P = MB.progress;
    const courseCount = (c) => { let n = 0; for (let i = 1; i <= c.total; i++) if (P.get(c.prefix + i)) n++; return n; };
    function paint() {
      rows.forEach((row) => row.classList.toggle('done', P.get(row.dataset.id)));
      root.querySelectorAll('.crow').forEach((a) => {
        const c = courseById[a.dataset.id], n = courseCount(c);
        a.querySelector('.cnt').textContent = n + ' / ' + c.total;
        a.querySelector('.rm-bar i').style.width = Math.round(n / c.total * 100) + '%';
        a.classList.toggle('complete', n === c.total);
      });
      root.querySelectorAll('.path').forEach((p) => {
        let done = 0, total = 0, next = null;
        p.querySelectorAll('li').forEach((li) => {
          if (li.dataset.track !== '1') return;
          total++;
          const id = li.dataset.id, ok = courseById[id] ? courseCount(courseById[id]) === courseById[id].total : P.get(id);
          li.classList.toggle('done', ok);
          if (ok) done++; else if (!next) next = li;
        });
        p.querySelectorAll('li').forEach((li) => li.classList.toggle('next', li === next));
        p.querySelector('.cnt').textContent = done + ' / ' + total;
        p.querySelector('.rm-bar i').style.width = Math.round(done / total * 100) + '%';
      });
    }
    window.addEventListener('mb-progress', paint);
    paint();

    const reveal = root.querySelectorAll('.rv');
    if ('IntersectionObserver' in window) {
      document.documentElement.classList.add('js-rv');
      const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
      reveal.forEach((el) => io.observe(el));
    }

    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (target) setTimeout(() => target.scrollIntoView(), 50);
  }
  if (window.MB && window.MB.ready) start(); else window.addEventListener('mb-ready', start);
})();
