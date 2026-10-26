import * as THREE from 'three';

const start = () => {
  const host = document.getElementById('heroView');
  if (!host || !window.DHArm) return;
  const STD = [
    { th: ['q1', (q) => q[0]], d: ['d1', 0.40], a: ['0', 0], al: ['90', 90] },
    { th: ['q2 + 90', (q) => q[1] + 90], d: ['0', 0], a: ['a2', 0.45], al: ['0', 0] },
    { th: ['q3 + 90', (q) => q[2] + 90], d: ['0', 0], a: ['0', 0], al: ['90', 90] },
    { th: ['q4', (q) => q[3]], d: ['d4', 0.45], a: ['0', 0], al: ['-90', -90] },
    { th: ['q5', (q) => q[4]], d: ['0', 0], a: ['0', 0], al: ['90', 90] },
    { th: ['q6', (q) => q[5]], d: ['d6', 0.15], a: ['0', 0], al: ['0', 0] }
  ];
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { host.classList.add('no-gl'); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x1a1f55, 1.5));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(2, 3.5, 2.5); scene.add(sun);

  const grid = new THREE.GridHelper(3, 12, 0x6670ff, 0x2f3790); grid.material.transparent = true; grid.material.opacity = 0.55; scene.add(grid);
  const arm = DHArm.build(THREE, STD, { link: '#d8d8d8', joint: '#ff9f43', cap: '#222222', lr: 0.058, baseR: 0.2,
    sizes: [{ r: 0.125, l: 0.17 }, { r: 0.105, l: 0.15 }, { r: 0.09, l: 0.135 }, { r: 0.075, l: 0.12 }, { r: 0.068, l: 0.105 }, { r: 0.055, l: 0.06 }] });
  scene.add(arm.root);

  const resize = () => {
    const w = host.clientWidth || 400, h = host.clientHeight || 320;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  const pose = (t) => [30 * Math.sin(t * 0.45), -55 + 18 * Math.sin(t * 0.7), -55 + 22 * Math.sin(t * 0.6 + 1), 50 * Math.sin(t * 0.8), -45 + 25 * Math.sin(t * 0.9), 90 * Math.sin(t * 1.1)];
  const readout = [...host.parentElement.querySelectorAll('.q b')];
  let lastRead = 0;
  const draw = (t) => {
    const q = pose(t);
    arm.setPose(q);
    if (t - lastRead > 0.08) {
      lastRead = t;
      readout.forEach((el, i) => { el.textContent = (q[i] >= 0 ? '+' : '') + q[i].toFixed(1) + '°'; });
    }
    const a = 0.55 + t * 0.12;
    camera.position.set(Math.sin(a) * 2.9, 1.55, Math.cos(a) * 2.9); camera.lookAt(0, 0.55, 0);
    renderer.render(scene, camera);
  };
  resize(); new ResizeObserver(resize).observe(host);

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still) { draw(1.2); new ResizeObserver(() => draw(1.2)).observe(host); return; }
  let visible = true, raf = 0, t0 = performance.now();
  const loop = (now) => { raf = 0; if (!visible || document.hidden) return; draw((now - t0) / 1000); raf = requestAnimationFrame(loop); };
  const wake = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; wake(); }).observe(host);
  document.addEventListener('visibilitychange', wake);
  wake();
};
if (window.MB && window.MB.ready) start(); else window.addEventListener('mb-ready', start);
