/* 배경 효과: 민트·블루 오로라, 떠다니는 빛 입자, 마우스 조명, 켜기/끄기 버튼
   - 선택은 브라우저에 기억됩니다(가능할 때만).
   - '동작 줄이기' 설정을 켠 사용자는 기본으로 꺼진 상태로 시작합니다.
   - 탭이 숨겨지거나 효과를 끄면 애니메이션을 멈춰 배터리를 아낍니다. */
(() => {
  const root = document.documentElement;
  const KEY = 'portfolio-fx';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const readPref = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const savePref = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* 저장 불가 환경 무시 */ } };

  /* ── 레이어 만들기 ── */
  const aurora = document.createElement('div');
  aurora.className = 'fx-aurora';
  aurora.setAttribute('aria-hidden', 'true');
  aurora.innerHTML = '<i></i><i></i><i></i>';

  const canvas = document.createElement('canvas');
  canvas.className = 'fx-particles';
  canvas.setAttribute('aria-hidden', 'true');

  const spotlight = document.createElement('div');
  spotlight.className = 'fx-spotlight';
  spotlight.setAttribute('aria-hidden', 'true');

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'fx-toggle';
  button.innerHTML = '<span class="fx-dot" aria-hidden="true"></span><span class="fx-label"></span>';
  const label = button.querySelector('.fx-label');

  document.body.prepend(aurora, canvas);
  document.body.append(spotlight, button);

  /* ── 빛 입자 ── */
  const ctx = canvas.getContext('2d');
  const COLORS = ['62,214,184', '35,91,236', '86,170,255', '120,230,210'];
  let W = 0, H = 0, dpr = 1, particles = [], raf = 0, running = false;

  const makeParticle = (anywhere) => ({
    x: Math.random() * W,
    y: anywhere ? Math.random() * H : H + 20,
    r: 1.2 + Math.random() * 2.6,              // 크기
    vy: -(0.12 + Math.random() * 0.35),        // 위로 천천히
    vx: (Math.random() - 0.5) * 0.15,
    swing: Math.random() * Math.PI * 2,        // 좌우 흔들림 위상
    swingSpeed: 0.004 + Math.random() * 0.008,
    twinkle: Math.random() * Math.PI * 2,      // 반짝임 위상
    color: COLORS[(Math.random() * COLORS.length) | 0],
  });

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.round(Math.min(70, Math.max(22, (W * H) / 24000)));
    while (particles.length < target) particles.push(makeParticle(true));
    particles.length = target;
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.swing += p.swingSpeed;
      p.twinkle += 0.02;
      p.x += p.vx + Math.sin(p.swing) * 0.25;
      p.y += p.vy;
      if (p.y < -20 || p.x < -20 || p.x > W + 20) Object.assign(p, makeParticle(false));

      const a = 0.35 + Math.sin(p.twinkle) * 0.25;   // 0.10 ~ 0.60
      const glow = p.r * 4;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
      g.addColorStop(0, `rgba(${p.color},${a})`);
      g.addColorStop(0.35, `rgba(${p.color},${a * 0.35})`);
      g.addColorStop(1, `rgba(${p.color},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, glow, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };

  const start = () => { if (running) return; running = true; raf = requestAnimationFrame(draw); };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  /* ── 마우스 조명 ── */
  let mx = 0, my = 0, sx = 0, sy = 0, lightRaf = 0;
  const follow = () => {
    sx += (mx - sx) * 0.12; sy += (my - sy) * 0.12;   // 부드럽게 따라옴
    spotlight.style.setProperty('--fx-x', sx + 'px');
    spotlight.style.setProperty('--fx-y', sy + 'px');
    lightRaf = Math.abs(mx - sx) + Math.abs(my - sy) > 0.5 ? requestAnimationFrame(follow) : 0;
  };
  if (finePointer) {
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      if (!root.classList.contains('fx-pointer')) { sx = mx; sy = my; root.classList.add('fx-pointer'); }
      if (!lightRaf && root.classList.contains('fx-on')) lightRaf = requestAnimationFrame(follow);
    }, { passive: true });
    document.addEventListener('pointerleave', () => root.classList.remove('fx-pointer'));
  }

  /* ── 켜기/끄기 ── */
  let enabled;
  const apply = (on) => {
    enabled = on;
    root.classList.toggle('fx-on', on);
    label.textContent = on ? '배경 효과 끄기' : '배경 효과 켜기';
    button.setAttribute('aria-pressed', String(on));
    button.setAttribute('aria-label', on ? '배경 효과 끄기' : '배경 효과 켜기');
    if (on && !document.hidden) start(); else { stop(); ctx.clearRect(0, 0, W, H); }
  };

  button.addEventListener('click', () => { apply(!enabled); savePref(enabled ? 'on' : 'off'); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else if (enabled) start();
  });
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });

  resize();
  const pref = readPref();
  apply(pref ? pref === 'on' : !reduceMotion);
})();
