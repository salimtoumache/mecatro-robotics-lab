(function () {
  'use strict';

  const ROBOTS = [
    { id: 'arm', href: 'arm.html', code: 'R-R-R', dof: '3', kind: 'serial', level: 1, min: 30, name: '3-DOF robot arm',
      tag: 'The simplest arm that reaches a point in space. The best first stop for frames, DH tables and the Jacobian.',
      used: 'Teaching, light pick and place, small lab automation.', kw: 'arm serial rrr jacobian' },
    { id: 'gantry', href: 'gantry.html', code: 'P-P-P', dof: '3', kind: 'serial', level: 1, min: 15, name: 'Cartesian gantry robot',
      tag: 'Three sliding axes at right angles, like a 3D printer or a CNC machine.',
      used: 'CNC machines, 3D printers, warehouse picking, lab handling.', kw: 'gantry cartesian ppp cnc 3d printer prismatic' },
    { id: 'scara', href: 'scara.html', code: 'R-R-P-R', dof: '4', kind: 'serial', level: 2, min: 30, name: 'SCARA robot',
      tag: 'Stiff vertically, flexible in the horizontal plane: fast, precise assembly from above.',
      used: 'Electronics assembly, screwing, dispensing, packaging.', kw: 'scara assembly pick place' },
    { id: 'articulated', href: 'articulated.html', code: '6 × R', dof: '6', kind: 'serial', level: 2, min: 45, name: '6-axis industrial robot',
      tag: 'The classic car-factory robot: any position, any orientation, thanks to its spherical wrist.',
      used: 'Welding, painting, machine tending, palletizing, assembly.', kw: 'industrial 6 axis wrist singularity fanuc kuka abb' },
    { id: 'cobot', href: 'cobot.html', code: '6 × R', dof: '6', kind: 'serial', level: 2, min: 30, name: 'Collaborative robot (cobot)',
      tag: 'Real UR5 numbers, an offset wrist and force limiting: a robot that works without a fence.',
      used: 'Small batches, screwdriving, packing, inspection, laboratories.', kw: 'cobot collaborative ur5 safety universal robots' },
    { id: 'delta', href: 'delta.html', code: '3 × R ∥', dof: '3 + 1', kind: 'parallel', level: 3, min: 45, name: 'Delta robot',
      tag: 'Three light arms and parallelograms hold a small platform: extremely fast, small workspace.',
      used: 'Food, pharma and electronics packing on conveyors.', kw: 'delta parallel grubler packing conveyor' },
    { id: 'mobile', href: 'mobile.html', code: '2 wheels', dof: '3', kind: 'mobile', level: 2, min: 30, name: 'Mobile robot (differential drive)',
      tag: 'A robot that moves around instead of reaching: wheel speeds, turning circle, odometry and ready-made programs.',
      used: 'Warehouses, hospitals, factories, cleaning, delivery.', kw: 'mobile differential drive odometry wheels icc line follower' },
    { id: 'wheels', href: 'wheels.html', code: '5 wheels', dof: 'n/a', kind: 'mobile', level: 2, min: 40, name: 'Wheels and drive types',
      tag: 'Fixed, castor, omni, Mecanum and ball wheels; eight drive types; sensors and navigation.',
      used: 'Choosing the right base for an AGV or an AMR.', kw: 'wheels mecanum omni ackermann holonomic agv amr sensors navigation' }
  ];
  const COURSES = [
    { id: 'learn', href: 'learn.html', min: 45, level: 1, total: 12, prefix: 'lesson-', name: 'Foundations', tag: '12 short lessons: the ideas behind every robot.', kw: 'basics beginner lessons joints dof frames dh' },
    { id: 'maths', href: 'learn-maths.html', min: 90, level: 1, total: 8, prefix: 'maths-', name: 'Maths and motion, step by step', tag: 'From zero: angles, a 2-axis arm, frames, DH and motion laws.', kw: 'maths angles trigonometry frames' },
    { id: 'model', href: 'learn-model.html', min: 200, level: 3, total: 11, prefix: 'model-', name: 'Robot modelling, full course', tag: 'Master level: rotations, DHm, forward and inverse models, Jacobian, dynamics.', kw: 'modelling rotation quaternion jacobian dynamics master' },
    { id: 'sing', href: 'learn-singularities.html', min: 100, level: 3, total: 8, prefix: 'sing-', name: 'Singularities and the Jacobian', tag: 'Speeds, forces, lost directions, gimbal lock, redundancy.', kw: 'singularity gimbal lock redundancy' },
    { id: 'ctrl', href: 'learn-control.html', min: 110, level: 3, total: 9, prefix: 'ctrl-', name: 'Dynamics, actuators and control', tag: 'Motors, sensors, PID, computed torque, force control, trajectories.', kw: 'control pid motors sensors torque trajectories' },
    { id: 'ai', href: 'learn-intelligence.html', min: 115, level: 3, total: 9, prefix: 'ai-', name: 'Perception, planning and AI', tag: 'Vision, Kalman, SLAM, A*, RRT, learning, multi-robot.', kw: 'ai vision kalman slam astar rrt learning' },
    { id: 'world', href: 'learn-world.html', min: 115, level: 2, total: 9, prefix: 'world-', name: 'Robots in the real world', tag: 'Every robot family, grippers, electronics, ROS, safety, careers.', kw: 'ros safety grippers electronics careers' }
  ];
  const TOOLS = [
    { id: 'arm2', cat: 'kin', name: 'Forward and inverse kinematics', tag: 'Two-joint arm: move the joints to see the tool, or drop the tool to get the angles.', kw: 'fk ik forward inverse kinematics calculator 2r' },
    { id: 'dh', cat: 'kin', name: 'DH table calculator', tag: 'Type a DH table (up to 6 joints) and get every transformation matrix and the final tool pose.', kw: 'dh denavit hartenberg generator table matrix' },
    { id: 'jac2r', cat: 'kin', name: 'Jacobian of a 2-joint arm', tag: 'See how joint speeds become tool speed, and what happens at a singularity.', kw: 'jacobian singularity velocity' },
    { id: 'jac2r-ellipse', cat: 'kin', name: 'Manipulability ellipse', tag: 'Where the arm moves easily in every direction, and where it is stiff.', kw: 'manipulability ellipse jacobian' },
    { id: 'gimbal', cat: 'kin', name: 'Gimbal lock', tag: 'Line up two axes and lose one direction of rotation.', kw: 'gimbal lock euler angles rotation' },
    { id: 'dls', cat: 'kin', name: 'Damped inverse (near singularities)', tag: 'Keep joint speeds reasonable when the arm is almost stretched.', kw: 'damped least squares dls singularity' },
    { id: 'trap', cat: 'motion', name: 'Trapezoid motion law', tag: 'Distance, top speed and acceleration give a trapezoid or a triangle of speed.', kw: 'trajectory trapezoid velocity profile acceleration' },
    { id: 'diff', cat: 'motion', name: 'Differential-drive calculator', tag: 'Wheel speeds to robot speed and turn rate, and back. Gives the turning radius.', kw: 'differential drive mobile robot wheel speed v omega radius' },
    { id: 'gravity', cat: 'control', name: 'Torque to hold an arm', tag: 'How much torque a joint needs just to stay still, and to move.', kw: 'gravity compensation torque motor' },
    { id: 'pid', cat: 'control', name: 'PID tuner', tag: 'Tune P, I and D and watch the response of a joint.', kw: 'pid control tuning anti windup' },
    { id: 'astar', cat: 'plan', name: 'A* and Dijkstra path finder', tag: 'Draw walls and watch the search find a path.', kw: 'astar a* dijkstra path planning grid' },
    { id: 'rrt', cat: 'plan', name: 'RRT planner', tag: 'A random tree grows around obstacles until it reaches the goal.', kw: 'rrt rapidly exploring random tree planning' },
    { id: 'kalman', cat: 'perc', name: 'Kalman filter', tag: 'Fuse a noisy sensor with a motion model and see the better estimate.', kw: 'kalman filter sensor fusion noise' }
  ];
  const TOOL_CATS = { kin: 'Kinematics', motion: 'Motion', control: 'Control', plan: 'Planning', perc: 'Perception' };

  const LINKS = {
    join: 'https://docs.google.com/forms/d/e/1FAIpQLSeOB3BBPLgxm9DrejRvyybx3fxoz1bSOGuJxaaW5sTpuh2oYg/viewform',
    hub: 'https://beacons.ai/mecatro',
    social: [
      ['Instagram', 'https://www.instagram.com/mecatro.sc', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/></svg>'],
      ['Facebook', 'https://www.facebook.com/mecatrosc', '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.6 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.8V13h2.7v8z"/></svg>'],
      ['YouTube', 'https://youtube.com/@mecatroclub', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="2.8" y="5.5" width="18.4" height="13" rx="4"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/></svg>'],
      ['Telegram', 'https://t.me/mecatrosc', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M21 4 3.2 11l5.4 2.1L10.6 19l3-3.9 4.4 3.3z"/><path d="m8.6 13.1 9-6.6"/></svg>'],
      ['Email', 'mailto:ftmecatroclub@gmail.com', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7.5 8 6 8-6"/></svg>']
    ]
  };
  const FACULTY = "M'hamed Bougara University of Boumerdes · Faculty of Technology";

  const UI = { home: 'Home', robots: 'Robots', learn: 'Learn', courses: 'Courses', tools: 'Tools', join: 'Join the club', joinShort: 'Join us', search: 'Search robots, courses, tools…', searchPh: 'Type a robot, a topic or a tool', noResults: 'Nothing found. Try another word.',
      menu: 'Menu', close: 'Close', theme: 'Switch between dark and light', top: 'Back to top', done: 'Mark this page as done', doneOn: 'Done, well played!', road: 'Back to the learning paths', prev: 'Previous', next: 'Next',
      dof: 'Degrees of freedom', type: 'Type', level: 'Level', time: 'Time', min: 'min', serial: 'Serial arm', parallel: 'Parallel robot', mobile: 'Mobile robot', lv: ['Beginner', 'Intermediate', 'Advanced'],
      tagline: 'An interactive learning platform for robotics', by: 'by Mecatro Club', explore: 'Explore', contact: 'Contact the club', built: '3D powered by',
      onPage: 'Sections of this page', typeResults: { robot: 'Robot', course: 'Course', tool: 'Tool' }, err3d: 'The 3D engine could not be loaded (slow or interrupted connection).', reload: 'Reload',
      tabs: { model: '3D model', diagram: 'Diagram', dh: 'DH table', math: 'Formulas', use: 'Applications', wheels: 'Wheel types', drives: 'Drive types', sim: 'Simulator', vocab: 'Vocabulary', more: 'Everything else' }, skip: 'Skip to content' };

  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } }
  };
  const root = document.documentElement;
  const q = new URLSearchParams(location.search);
  let theme = q.get('theme') || store.get('mb-theme');
  const explicitTheme = theme === 'light' || theme === 'dark';
  const sysLight = matchMedia('(prefers-color-scheme: light)');
  if (!explicitTheme) theme = sysLight.matches ? 'light' : 'dark';
  root.lang = 'en'; root.dir = 'ltr'; root.dataset.theme = theme;
  const ui = UI;
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const pageName = here.replace(/\.html$/, '') || 'index';
  const robotMeta = ROBOTS.find((r) => r.id === pageName) || null;
  const bodyCls = document.body.classList;
  const isCourse = bodyCls.contains('learn');

  const MB = window.MB = {
    catalog: { robots: ROBOTS, courses: COURSES, tools: TOOLS, toolCats: TOOL_CATS, links: LINKS, faculty: FACULTY }
  };
  const PROG = 'mb-progress';
  MB.progress = {
    all() { try { return JSON.parse(store.get(PROG) || '{}') || {}; } catch (e) { return {}; } },
    get(id) { return !!this.all()[id]; },
    set(id, v) { const o = this.all(); if (v) o[id] = 1; else delete o[id]; store.set(PROG, JSON.stringify(o)); window.dispatchEvent(new CustomEvent('mb-progress', { detail: { id, v: !!v } })); },
    clear(ids) { const o = this.all(); ids.forEach((i) => delete o[i]); store.set(PROG, JSON.stringify(o)); window.dispatchEvent(new CustomEvent('mb-progress', { detail: { id: null } })); }
  };
  window.addEventListener('storage', (e) => { if (e.key === PROG) window.dispatchEvent(new CustomEvent('mb-progress', { detail: { id: null } })); });

  const head = document.head;
  if (!head.querySelector('link[rel~=icon]')) {
    const ic = document.createElement('link'); ic.rel = 'icon'; ic.href = 'favicon.ico'; head.appendChild(ic);
  }

  const I = {
    home: '<path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
    robot: '<circle cx="6" cy="18" r="2"/><circle cx="12" cy="10" r="2"/><circle cx="19" cy="5" r="2"/><path d="m7.4 16.6 3.2-5M13.5 8.7l4-2.4M4 21h4"/>',
    book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/><path d="M9 7.5h6"/>',
    tool: '<path d="M14.7 6.3a4 4 0 0 0-5.1 5.1L4 17l3 3 5.6-5.6a4 4 0 0 0 5.1-5.1l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    join: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c.4-3.4 2.6-5.2 5.5-5.2s5.1 1.8 5.5 5.2M17 8.5v5M14.5 11h5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    diagram: '<circle cx="5.5" cy="17.5" r="2"/><circle cx="12" cy="8" r="2"/><circle cx="19" cy="14" r="2"/><path d="m6.8 16 4-6M13.8 9l3.6 3.7"/>',
    table: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 10h17M3.5 14.5h17M9.5 4.5v15"/>',
    sigma: '<path d="M18 5H6.5l6 7-6 7H18"/>',
    use: '<path d="M4 20V10l6-3v13M10 20V4l10 4v12M3 20h18"/>',
    wheel: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3.5v6M12 14.5v6M3.5 12h6M14.5 12h6"/>',
    play: '<path d="M7 5v14l12-7z"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.8 3.9 5.8 3.9 9s-1.3 6.2-3.9 9c-2.6-2.8-3.9-5.8-3.9-9S9.4 5.8 12 3z"/>'
  };
  const ico = (n, cls) => `<svg class="ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;
  MB.icon = ico;
  const GLYPHS = {
    arm: '<path d="M10 52h20M20 52V44"/><path d="M20 44 34 24 52 30"/><circle cx="20" cy="44" r="3.4"/><circle cx="34" cy="24" r="3.4"/><circle class="o" cx="52" cy="30" r="3"/>',
    gantry: '<path d="M8 16h48M8 16v34h48V16M16 16v34"/><path d="M16 30h28"/><rect x="40" y="26" width="8" height="8" rx="1.5"/><path class="o" d="M44 34v10"/>',
    scara: '<path d="M10 52h14M17 52V40"/><path d="M17 40h22l10-10"/><circle cx="17" cy="40" r="3.4"/><circle cx="39" cy="40" r="3.4"/><path class="o" d="M49 30v16"/><circle class="o" cx="49" cy="30" r="2.6"/>',
    articulated: '<path d="M8 54h22M19 54V44"/><path d="M19 44V26l16-10 16 8"/><circle cx="19" cy="44" r="3.2"/><circle cx="19" cy="26" r="3.2"/><circle cx="35" cy="16" r="3.2"/><path class="o" d="M51 24l5 6"/><circle class="o" cx="51" cy="24" r="2.8"/>',
    cobot: '<path d="M8 54h22M19 54V46"/><path d="M19 46V30l18-8 8 14"/><circle cx="19" cy="46" r="3.6"/><circle cx="19" cy="30" r="3.6"/><circle cx="37" cy="22" r="3.6"/><path class="o" d="M45 36l8 4"/><circle class="o" cx="45" cy="36" r="2.8"/><path d="M5 10 12 6M5 18l7-2" opacity=".5"/>',
    delta: '<path d="M12 14h40"/><path d="M20 14l8 16M32 14v16M44 14l-8 16"/><path d="M26 30l-2 16M32 30v16M38 30l2 16"/><path class="o" d="M22 46h20"/>',
    mobile: '<rect x="18" y="14" width="28" height="36" rx="5"/><rect x="12" y="20" width="6" height="12" rx="1.5"/><rect x="46" y="20" width="6" height="12" rx="1.5"/><path class="o" d="M32 42V26M27 31l5-5 5 5"/>',
    wheels: '<circle cx="32" cy="32" r="20"/><circle cx="32" cy="32" r="5"/><path d="M32 12v15M32 37v15M12 32h15M37 32h15" opacity=".6"/>'
  };
  MB.glyph = (id) => `<svg class="glyph" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${GLYPHS[id] || ''}</svg>`;
  const TAB_ICON = { model: 'cube', diagram: 'diagram', dh: 'table', math: 'sigma', use: 'use', wheels: 'wheel', drives: 'list', sim: 'play', vocab: 'book', more: 'list' };
  const lvDots = (n) => `<i class="lv l${n}" aria-hidden="true"><b></b><b></b><b></b></i>`;
  MB.lvDots = lvDots;
  MB.ui = ui;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function brandImgs() {
    return `<img class="logo-on-dark" src="assets/brand/logo-horizontal-white.png" alt="" width="173" height="56"><img class="logo-on-light" src="assets/brand/logo-horizontal-indigo.png" alt="" width="173" height="56">`;
  }
  function build() {
    const link = (href, text, extra) => `<a href="${href}"${here === href.split('#')[0] ? ' aria-current="page"' : ''}${extra || ''}>${text}</a>`;
    const side = document.createElement('aside');
    side.className = 'side'; side.id = 'side'; side.setAttribute('data-mb', 'chrome'); side.setAttribute('aria-label', 'Main navigation');
    const robotsHtml = ROBOTS.map((r) => link(r.href, `<span class="n">${esc(r.name)}</span><small>${esc(r.code)}</small>`)).join('');
    const coursesHtml = COURSES.map((c) => link(c.href, `<span class="n">${esc(c.name)}</span>${lvDots(c.level)}`)).join('');
    const socials = LINKS.social.map(([n, u, svg]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${n}" title="${n}">${svg}</a>`).join('');
    side.innerHTML =
      `<div class="side-head"><a class="brand" href="index.html" aria-label="Mecatro Club, mecatrobot">${brandImgs()}</a><button class="icon-btn side-close" type="button" aria-label="${ui.close}">${ico('x')}</button></div>` +
      `<button class="side-search" type="button" data-open-search>${ico('search')}<span>${ui.search}</span><kbd>/</kbd></button>` +
      '<nav class="side-nav">' +
      link('index.html', `${ico('home')}<span class="n">${ui.home}</span>`, ' class="top"') +
      `<details class="grp" ${ROBOTS.some((r) => r.href === here) || here === 'index.html' ? 'open' : ''}><summary>${ico('robot')}<span class="n">${ui.robots}</span>${ico('chev', 'chev')}</summary><div class="grp-body">${robotsHtml}</div></details>` +
      `<details class="grp" ${COURSES.some((c) => c.href === here) ? 'open' : ''}><summary>${ico('book')}<span class="n">${ui.courses}</span>${ico('chev', 'chev')}</summary><div class="grp-body">${coursesHtml}</div></details>` +
      link('tools.html', `${ico('tool')}<span class="n">${ui.tools}</span>`, ' class="top"') +
      '</nav>' +
      `<div class="side-foot"><a class="btn join" href="${LINKS.join}" target="_blank" rel="noopener">${ico('join')}${ui.join}</a>` +
      `<div class="socials">${socials}</div>` +
      `<div class="tools-row"><span class="tools-lbl">Appearance</span>` +
      `<button class="icon-btn theme-btn" type="button" aria-label="${ui.theme}" title="${ui.theme}"></button></div></div>`;

    const mast = document.createElement('header');
    mast.className = 'mast'; mast.setAttribute('data-mb', 'chrome');
    const panelLink = (r) => `<a href="${r.href}"${here === r.href ? ' aria-current="page"' : ''}>${MB.glyph(r.id)}<span class="n">${esc(r.name)}</span><small>${esc(r.code)}</small></a>`;
    const onRobot = ROBOTS.some((r) => r.href === here), onCourse = COURSES.some((c) => c.href === here);
    mast.innerHTML = `<div class="mast-in"><a class="brand" href="index.html" aria-label="Mecatro Club, mecatrobot">${brandImgs()}</a>` +
      '<nav class="mast-nav" aria-label="Main navigation">' +
        `<div class="mn-item"><button type="button" class="mn-btn${onRobot ? ' here' : ''}" aria-expanded="false" aria-controls="mn-robots">${ui.robots}${ico('chev', 'chev')}</button>` +
          `<div class="mn-panel" id="mn-robots" hidden>${ROBOTS.map(panelLink).join('')}<a class="mn-all" href="index.html#robots">All robots ${ico('arrow')}</a></div></div>` +
        `<div class="mn-item"><button type="button" class="mn-btn${onCourse ? ' here' : ''}" aria-expanded="false" aria-controls="mn-courses">${ui.courses}${ico('chev', 'chev')}</button>` +
          `<div class="mn-panel narrow" id="mn-courses" hidden>${COURSES.map((c) => `<a href="${c.href}"${here === c.href ? ' aria-current="page"' : ''}><span class="n">${esc(c.name)}</span>${lvDots(c.level)}</a>`).join('')}</div></div>` +
        link('tools.html', ui.tools, ' class="mn-link"') +
        `<a class="mn-link" href="index.html#paths">Paths</a>` +
      '</nav>' +
      `<div class="mast-r"><button class="mast-search" type="button" data-open-search>${ico('search')}<span>Search</span><kbd>/</kbd></button>` +
      `<button class="icon-btn theme-btn" type="button" aria-label="${ui.theme}" title="${ui.theme}"></button>` +
      `<a class="btn join" href="${LINKS.join}" target="_blank" rel="noopener">${ui.join}</a></div></div>`;
    const bar = document.createElement('header');
    bar.className = 'topbar'; bar.setAttribute('data-mb', 'chrome');
    bar.innerHTML = `<button class="icon-btn menu-btn" type="button" aria-label="${ui.menu}" aria-controls="side" aria-expanded="false">${ico('menu')}</button>` +
      `<a class="brand" href="index.html" aria-label="Mecatro Club, mecatrobot"><img src="assets/brand/emblem-indigo.png" class="on-light" alt="" width="34" height="34"><img src="assets/brand/emblem-white.png" class="on-dark" alt="" width="34" height="34"><b>mecatrobot</b></a>` +
      `<button class="icon-btn" type="button" data-open-search aria-label="${ui.search}">${ico('search')}</button>`;
    const scrim = document.createElement('div'); scrim.className = 'scrim'; scrim.setAttribute('data-mb', 'chrome');
    const skip = document.createElement('a'); skip.className = 'skip'; skip.href = '#main'; skip.textContent = ui.skip; skip.setAttribute('data-mb', 'chrome');
    document.body.prepend(skip, mast, side, bar, scrim);

    // theme
    const themeBtns = document.querySelectorAll('.theme-btn');
    const paintTheme = () => themeBtns.forEach((b) => { b.innerHTML = root.dataset.theme === 'dark' ? ico('sun') : ico('moon'); });
    paintTheme();
    themeBtns.forEach((b) => b.addEventListener('click', () => { const next = root.dataset.theme === 'dark' ? 'light' : 'dark'; root.dataset.theme = next; store.set('mb-theme', next); paintTheme(); window.dispatchEvent(new CustomEvent('mb-theme', { detail: next })); }));
    if (!explicitTheme) sysLight.addEventListener && sysLight.addEventListener('change', (e) => { if (!store.get('mb-theme')) { root.dataset.theme = e.matches ? 'light' : 'dark'; paintTheme(); } });
    // dropdown menus
    const items = mast.querySelectorAll('.mn-item');
    const closeMenus = () => items.forEach((it) => { const b = it.querySelector('.mn-btn'); if (b) { b.setAttribute('aria-expanded', 'false'); it.querySelector('.mn-panel').hidden = true; } });
    items.forEach((it) => {
      const b = it.querySelector('.mn-btn'); if (!b) return;
      const p = it.querySelector('.mn-panel'); let timer;
      const open = () => { closeMenus(); b.setAttribute('aria-expanded', 'true'); p.hidden = false; };
      b.addEventListener('click', () => (p.hidden ? open() : closeMenus()));
      it.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) { clearTimeout(timer); open(); } });
      it.addEventListener('mouseleave', () => { timer = setTimeout(closeMenus, 140); });
      it.addEventListener('focusout', (e) => { if (!it.contains(e.relatedTarget)) closeMenus(); });
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('.mn-item')) closeMenus(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenus(); });
    // drawer
    const menuBtn = bar.querySelector('.menu-btn');
    const setDrawer = (o) => { document.body.classList.toggle('drawer-open', o); menuBtn.setAttribute('aria-expanded', String(o)); };
    menuBtn.addEventListener('click', () => setDrawer(!document.body.classList.contains('drawer-open')));
    scrim.addEventListener('click', () => setDrawer(false));
    side.querySelector('.side-close').addEventListener('click', () => setDrawer(false));
    side.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setDrawer(false)));
    // keep the current group visible
    const cur = side.querySelector('a[aria-current="page"]'); if (cur && cur.closest('.grp')) cur.closest('.grp').open = true;
    setTimeout(() => { const c = side.querySelector('.grp-body a[aria-current="page"]'); if (c && c.scrollIntoView) { const sn = side.querySelector('.side-nav'); if (sn) sn.scrollTop = Math.max(0, c.offsetTop - 140); } }, 0);

    buildSearch();
  }

  const nz = (s) => String(s || '').toLowerCase();
  const INDEX = [];
  ROBOTS.forEach((r) => INDEX.push({ type: 'robot', href: r.href, icon: 'robot', title: r.name, desc: r.tag, badge: r.code, hay: nz([r.name, r.tag, r.code, r.kw].join(' ')) }));
  COURSES.forEach((c) => INDEX.push({ type: 'course', href: c.href, icon: 'book', title: c.name, desc: c.tag, badge: null, hay: nz([c.name, c.tag, c.kw].join(' ')) }));
  TOOLS.forEach((t) => INDEX.push({ type: 'tool', href: 'tools.html#' + t.id, icon: 'tool', title: t.name, desc: t.tag, badge: null, hay: nz([t.name, t.tag, t.kw].join(' ')) }));
  MB.search = function (query, limit) {
    const toks = nz(query).split(/\s+/).filter(Boolean);
    if (!toks.length) return INDEX.slice();
    return INDEX.map((e) => { let s = 0; for (const t of toks) { const i = e.hay.indexOf(t); if (i < 0) return null; s += i === 0 ? 3 : 1; if (nz(e.title).indexOf(t) >= 0) s += 4; } return { e, s }; })
      .filter(Boolean).sort((a, b) => b.s - a.s).map((x) => x.e).slice(0, limit || 50);
  };
  function buildSearch() {
    const box = document.createElement('div');
    box.className = 'palette'; box.setAttribute('data-mb', 'chrome'); box.hidden = true;
    box.innerHTML = `<div class="pal-back"></div><div class="pal-box" role="dialog" aria-modal="true" aria-label="${ui.search}"><div class="pal-in">${ico('search')}<input type="search" autocomplete="off" spellcheck="false" placeholder="${ui.searchPh}" aria-label="${ui.search}"><button type="button" class="icon-btn pal-x" aria-label="${ui.close}">${ico('x')}</button></div><div class="pal-list" role="listbox"></div></div>`;
    document.body.appendChild(box);
    const input = box.querySelector('input'), list = box.querySelector('.pal-list');
    let items = [], at = 0;
    const render = () => {
      items = MB.search(input.value, 12); at = Math.min(at, Math.max(0, items.length - 1));
      list.innerHTML = items.length ? items.map((e, i) => `<a role="option" href="${e.href}" class="pal-item${i === at ? ' on' : ''}" data-i="${i}">${ico(e.icon)}<span class="pal-t"><b>${esc(e.title)}</b><small>${esc(e.desc)}</small></span><em>${e.badge ? esc(e.badge) : ui.typeResults[e.type]}</em></a>`).join('') : `<p class="pal-empty">${ui.noResults}</p>`;
    };
    const open = () => { box.hidden = false; document.body.classList.add('pal-open'); input.value = ''; at = 0; render(); setTimeout(() => input.focus(), 10); };
    const close = () => { box.hidden = true; document.body.classList.remove('pal-open'); };
    document.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('[data-open-search]'); if (b) { e.preventDefault(); open(); } });
    box.querySelector('.pal-back').addEventListener('click', close); box.querySelector('.pal-x').addEventListener('click', close);
    input.addEventListener('input', () => { at = 0; render(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); at = Math.min(items.length - 1, at + 1); render(); } else if (e.key === 'ArrowUp') { e.preventDefault(); at = Math.max(0, at - 1); render(); }
      else if (e.key === 'Enter' && items[at]) { location.href = items[at].href; close(); }
      const on = list.querySelector('.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
    });
    document.addEventListener('keydown', (e) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
      if (e.key === 'Escape') { close(); document.body.classList.remove('drawer-open'); }
      else if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); open(); }
    });
    MB.openSearch = open;
  }

  function wrapMain() {
    const main = document.createElement('main');
    main.className = 'page'; main.id = 'main';
    [...document.body.childNodes].forEach((n) => { if (n.nodeType === 1 && (/^(SCRIPT|STYLE|LINK)$/.test(n.tagName) || n.hasAttribute('data-mb'))) return; main.appendChild(n); });
    document.body.appendChild(main);
    document.body.classList.add('app');
    return main;
  }
  function breadcrumb(parts) {
    const nav = document.createElement('nav');
    nav.className = 'crumbs'; nav.setAttribute('aria-label', 'Breadcrumb'); nav.setAttribute('data-mb', 'chrome');
    nav.innerHTML = parts.map((p, i) => (p[1] && i < parts.length - 1 ? `<a href="${p[1]}">${esc(p[0])}</a>` : `<span aria-current="page">${esc(p[0])}</span>`)).join(ico('chev', 'sep'));
    return nav;
  }
  function footer(main) {
    const foot = document.createElement('footer');
    foot.className = 'site-foot'; foot.setAttribute('data-mb', 'chrome');
    const i = ROBOTS.findIndex((r) => r.href === here);
    let pager = '';
    if (i >= 0) {
      const p = ROBOTS[(i + ROBOTS.length - 1) % ROBOTS.length], n = ROBOTS[(i + 1) % ROBOTS.length];
      pager = `<div class="pager"><a class="prev" href="${p.href}"><small>${ui.prev}</small><b>${esc(p.name)}</b></a><a class="next" href="${n.href}"><small>${ui.next}</small><b>${esc(n.name)}</b></a></div>`;
    }
    const doneBar = i >= 0 ? `<div class="done-bar"><label class="done-toggle"><input type="checkbox" id="pageDone"><span class="box" aria-hidden="true"></span><span class="lbl">${ui.done}</span></label><a href="index.html#paths">${ui.road} ${ico('arrow')}</a></div>` : '';
    const socials = LINKS.social.map(([n, u, svg]) => `<a href="${u}" target="_blank" rel="noopener">${svg}<span>${n}</span></a>`).join('');
    foot.innerHTML = doneBar + pager +
      `<div class="foot-grid"><div class="foot-brand"><img class="logo-on-dark" src="assets/brand/logo-horizontal-white.png" alt="Mecatro Club" width="173" height="56"><img class="logo-on-light" src="assets/brand/logo-horizontal-indigo.png" alt="Mecatro Club" width="173" height="56"><p><b>mecatrobot</b>, ${ui.tagline.toLowerCase()}.</p><p class="fac">${esc(FACULTY)}</p></div>` +
      `<div class="foot-col"><h4>${ui.explore}</h4><a href="index.html">${ui.home}</a><a href="index.html#paths">${ui.learn}</a><a href="index.html#courses">${ui.courses}</a><a href="tools.html">${ui.tools}</a></div>` +
      `<div class="foot-col"><h4>${ui.robots}</h4>${ROBOTS.map((r) => `<a href="${r.href}">${esc(r.name)}</a>`).join('')}</div>` +
      `<div class="foot-col"><h4>${ui.contact}</h4><div class="foot-soc">${socials}</div><a class="btn join" href="${LINKS.join}" target="_blank" rel="noopener">${ico('join')}${ui.join}</a></div></div>` +
      `<p class="foot-note">© ${new Date().getFullYear()} Mecatro Club · ${ui.built} <a href="https://threejs.org" target="_blank" rel="noopener">three.js</a></p>`;
    main.appendChild(foot);
    const dn = foot.querySelector('#pageDone');
    if (dn) {
      const paint = () => { dn.checked = MB.progress.get(pageName); dn.closest('.done-toggle').classList.toggle('on', dn.checked); dn.parentNode.querySelector('.lbl').textContent = dn.checked ? ui.doneOn : ui.done; };
      dn.addEventListener('change', () => MB.progress.set(pageName, dn.checked)); window.addEventListener('mb-progress', paint); paint();
    }
    const top = document.createElement('button');
    top.className = 'to-top'; top.type = 'button'; top.setAttribute('aria-label', ui.top); top.setAttribute('data-mb', 'chrome'); top.innerHTML = ico('arrow');
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(top);
    const onScroll = () => top.classList.toggle('show', window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  const TAB_ORDER = ['model', 'wheels', 'diagram', 'drives', 'dh', 'sim', 'math', 'vocab', 'use', 'more'];
  function robotPage(main) {
    const h1 = main.querySelector(':scope > h1');
    if (!h1) return;
    const groups = {};
    let cur = 'model';
    [...main.children].forEach((el) => {
      if (el === h1 || /^(SCRIPT|STYLE)$/.test(el.tagName)) return;
      const t = el.getAttribute('data-tab'); if (t) { cur = t; el.removeAttribute('data-tab'); }
      (groups[cur] = groups[cur] || []).push(el);
    });
    const meta = robotMeta;
    const head = document.createElement('header');
    head.className = 'titleblock';
    const kindLbl = meta ? ui[meta.kind] : '';
    head.appendChild(breadcrumb([[ui.home, 'index.html'], [ui.robots, 'index.html#robots'], [meta ? meta.name : h1.textContent, null]]));
    const tb = document.createElement('div'); tb.className = 'tb';
    const main1 = document.createElement('div'); main1.className = 'tb-main';
    if (meta) { const code = document.createElement('span'); code.className = 'tb-code'; code.setAttribute('data-mb', 'chrome'); code.textContent = meta.code; main1.appendChild(code); }
    main1.appendChild(h1);
    if (meta) { const p = document.createElement('p'); p.className = 'tb-tag'; p.setAttribute('data-mb', 'chrome'); p.textContent = meta.tag; main1.appendChild(p); }
    tb.appendChild(main1);
    if (meta) {
      const dl = document.createElement('dl'); dl.className = 'tb-meta'; dl.setAttribute('data-mb', 'chrome');
      dl.innerHTML = [[ui.dof, `<span class="mono">${esc(meta.dof)}</span>`], [ui.type, kindLbl], [ui.level, `${lvDots(meta.level)} ${ui.lv[meta.level - 1]}`], [ui.time, `<span class="mono">~${meta.min}</span> ${ui.min}`]]
        .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
      tb.appendChild(dl);
    }
    head.appendChild(tb);
    const ids = TAB_ORDER.filter((t) => groups[t] && groups[t].length);
    const lab = document.createElement('div'); lab.className = 'lab' + (groups.side ? ' has-side' : '');
    const labMain = document.createElement('div'); labMain.className = 'lab-main';
    const tabs = document.createElement('div'); tabs.className = 'tabs'; tabs.setAttribute('role', 'tablist'); tabs.setAttribute('data-mb', 'chrome'); tabs.setAttribute('aria-label', ui.onPage);
    const panels = document.createElement('div'); panels.className = 'panels';
    ids.forEach((id) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.id = 'tab-' + id; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'panel-' + id); b.dataset.tab = id;
      b.innerHTML = `${ico(TAB_ICON[id])}<span>${esc(ui.tabs[id])}</span>`; tabs.appendChild(b);
      const p = document.createElement('section'); p.className = 'panel-tab'; p.id = 'panel-' + id; p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', 'tab-' + id); p.hidden = true;
      groups[id].forEach((el) => p.appendChild(el)); panels.appendChild(p);
    });
    labMain.append(tabs, panels); lab.appendChild(labMain);
    if (groups.side) { const side = document.createElement('aside'); side.className = 'lab-side'; const card = document.createElement('div'); card.className = 'side-card'; groups.side.forEach((el) => card.appendChild(el)); side.appendChild(card); lab.appendChild(side); }
    main.prepend(head, lab);
    let fit = () => {};
    const svg = document.getElementById('schema');
    if (svg && svg.viewBox && svg.viewBox.baseVal) {
      let box = null, pending = false;
      const apply = () => {
        pending = false;
        try {
          const b = svg.getBBox(); if (!b.width || !b.height) return;
          box = box ? { x0: Math.min(box.x0, b.x), y0: Math.min(box.y0, b.y), x1: Math.max(box.x1, b.x + b.width), y1: Math.max(box.y1, b.y + b.height) } : { x0: b.x, y0: b.y, x1: b.x + b.width, y1: b.y + b.height };
          const pad = 44, R = 700 / 420; let w = box.x1 - box.x0 + 2 * pad, h = box.y1 - box.y0 + 2 * pad;
          if (w / h < R) w = h * R; else h = w / R;
          w = Math.min(Math.max(w, 330), 900); h = w / R;
          const cx = (box.x0 + box.x1) / 2, cy = (box.y0 + box.y1) / 2;
          svg.setAttribute('viewBox', [cx - w / 2, cy - h / 2, w, h].map((v) => v.toFixed(1)).join(' '));
        } catch (e) { }
      };
      fit = () => { if (!pending) { pending = true; requestAnimationFrame(apply); } };
      new MutationObserver((ms) => { if (ms.every((m) => m.target === svg && m.attributeName === 'viewBox')) return; fit(); }).observe(svg, { childList: true, subtree: true, attributes: true, characterData: true });
      document.addEventListener('change', () => { box = null; });
    }
    let active = null;
    const show = (id, push) => {
      if (!ids.includes(id)) id = ids[0];
      active = id;
      tabs.querySelectorAll('.tab').forEach((b) => { const on = b.dataset.tab === id; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
      panels.querySelectorAll('.panel-tab').forEach((p) => { p.hidden = p.id !== 'panel-' + id; });
      if (push) history.replaceState(null, '', '#' + id);
      requestAnimationFrame(() => { fit(); window.dispatchEvent(new Event('resize')); });
    };
    tabs.addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (b) show(b.dataset.tab, true); });
    tabs.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!dir) return;
      const rtl = root.dir === 'rtl', k = ids.indexOf(active) + (rtl ? -dir : dir), id = ids[(k + ids.length) % ids.length];
      show(id, true); document.getElementById('tab-' + id).focus(); e.preventDefault();
    });
    show(ids[0], false);
    const fromHash = () => { const id = location.hash.slice(1); if (ids.includes(id)) show(id, false); };
    window.addEventListener('load', () => { fromHash(); setTimeout(fit, 60); });
    window.addEventListener('hashchange', fromHash);
    MB.showTab = show;
  }

  function coursePage(main) {
    const h1 = main.querySelector(':scope > h1');
    if (!h1) return;
    const old = h1.nextElementSibling;
    if (old && old.tagName === 'P' && old.querySelector('a[href="index.html"]')) old.remove();
    const bc = breadcrumb([[ui.home, 'index.html'], [ui.courses, 'learn.html'], [h1.textContent, null]]);
    main.prepend(bc);
  }

  function watch3d() {
    const needs = document.querySelector('script[type="importmap"]'); if (!needs) return;
    const fail = () => {
      if (document.getElementById('err3d')) return;
      const b = document.createElement('div'); b.id = 'err3d'; b.className = 'err3d'; b.setAttribute('role', 'alert'); b.setAttribute('data-mb', 'chrome');
      b.innerHTML = `<span>${ui.err3d}</span><button type="button">${ui.reload}</button>`;
      b.querySelector('button').addEventListener('click', () => location.reload()); document.body.appendChild(b);
    };
    window.addEventListener('unhandledrejection', (e) => { if (/dynamically imported|Failed to fetch|module script|import/i.test(String(e.reason && (e.reason.message || e.reason)))) fail(); });
    window.addEventListener('error', (e) => { if (e.target && e.target.tagName === 'SCRIPT' && e.target.type === 'module') fail(); }, true);
    setTimeout(() => { import('./vendor/three.module.min.js').catch(fail); }, 4000);
  }

  function init() {
    build();
    const main = wrapMain();
    if (robotMeta || document.querySelector('[data-tab]')) robotPage(main);
    else if (isCourse) coursePage(main);
    footer(main);
    watch3d();
    MB.ready = true;
    window.dispatchEvent(new CustomEvent('mb-ready'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
