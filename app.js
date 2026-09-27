(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* меню */
  const hdr = $('.hdr');
  $('.burger').addEventListener('click', () => { const o = hdr.classList.toggle('open'); $('.burger').setAttribute('aria-expanded', o); });
  $$('.nav a').forEach(a => a.addEventListener('click', () => hdr.classList.remove('open')));

  /* подсказки для демо-ссылок */
  let tt;
  function toast(m) {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(() => t.hidden = true, 3000);
  }
  $$('[data-demo]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); toast(a.dataset.demo || 'Демо-сайт: на сайте заказчика здесь будет настоящая страница.'); }));

  /* появление блоков и графики */
  const bars = $('#bars');
  const fillBars = () => $$('.bar', bars).forEach(b => $('.fill', b).style.width = b.dataset.v + '%');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); if (e.target.contains(bars)) fillBars(); io.unobserve(e.target);
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(el => io.observe(el));
  } else { $$('.rv').forEach(el => el.classList.add('in')); fillBars(); }

  /* путь транзакции */
  const steps = $$('#steps li'), lines = $$('#trace > span');
  function setStep(l) {
    steps.forEach(s => s.classList.toggle('on', s.dataset.l === l));
    lines.forEach(s => s.classList.toggle('hl', s.dataset.l === l));
  }
  steps.forEach(s => s.addEventListener('click', () => { setStep(s.dataset.l); auto = false; }));
  let auto = !reduced, cur = 1;
  setStep('1');
  setInterval(() => { if (!auto) return; cur = cur % 6 + 1; setStep(String(cur)); }, 2600);

  /* примеры SDK */
  const K = (s, c) => `<span class="${c}">${s}</span>`;
  const code = {
    go: `${K('// создаём два счёта и переводим 150,00 ₽', 'c')}
client, _ := tallyn.NewClient(${K('"3000,3001,3002"', 'g')})

err := client.CreateAccounts([]tallyn.Account{
  {ID: ${K('1', 'y')}, Ledger: ${K('643', 'y')}, Code: ${K('10', 'y')}, Flags: tallyn.NoOverdraft},
  {ID: ${K('2', 'y')}, Ledger: ${K('643', 'y')}, Code: ${K('10', 'y')}},
})

res, _ := client.CreateTransfers([]tallyn.Transfer{{
  ID:        tallyn.NewID(),
  DebitID:   ${K('2', 'y')},
  CreditID:  ${K('1', 'y')},
  Amount:    ${K('15000', 'y')}, ${K('// в копейках', 'c')}
  Ledger:    ${K('643', 'y')},
}})
${K('// res пустой – перевод проведён', 'c')}`,
    py: `${K('# создаём два счёта и переводим 150,00 ₽', 'c')}
import tallyn

client = tallyn.Client(${K('"3000,3001,3002"', 'g')})

client.create_accounts([
    tallyn.Account(id=${K('1', 'y')}, ledger=${K('643', 'y')}, code=${K('10', 'y')}, flags=tallyn.NO_OVERDRAFT),
    tallyn.Account(id=${K('2', 'y')}, ledger=${K('643', 'y')}, code=${K('10', 'y')}),
])

errors = client.create_transfers([
    tallyn.Transfer(id=tallyn.id(), debit_id=${K('2', 'y')}, credit_id=${K('1', 'y')},
                    amount=${K('15000', 'y')}, ledger=${K('643', 'y')}),
])
${K('# errors == [] – перевод проведён', 'c')}`,
    node: `${K('// создаём два счёта и переводим 150,00 ₽', 'c')}
import { createClient, id, AccountFlags } from ${K("'@tallyn/client'", 'g')}

const client = createClient({ replicas: [${K("'3000'", 'g')}, ${K("'3001'", 'g')}, ${K("'3002'", 'g')}] })

await client.createAccounts([
  { id: ${K('1n', 'y')}, ledger: ${K('643', 'y')}, code: ${K('10', 'y')}, flags: AccountFlags.noOverdraft },
  { id: ${K('2n', 'y')}, ledger: ${K('643', 'y')}, code: ${K('10', 'y')} },
])

const errors = await client.createTransfers([
  { id: id(), debitId: ${K('2n', 'y')}, creditId: ${K('1n', 'y')}, amount: ${K('15000n', 'y')}, ledger: ${K('643', 'y')} },
])
${K('// errors.length === 0 – перевод проведён', 'c')}`,
    java: `${K('// создаём два счёта и переводим 150,00 ₽', 'c')}
var client = new Client(${K('"3000,3001,3002"', 'g')});

var accounts = new AccountBatch(${K('2', 'y')});
accounts.add(${K('1', 'y')}, ${K('643', 'y')}, ${K('10', 'y')}, AccountFlags.NO_OVERDRAFT);
accounts.add(${K('2', 'y')}, ${K('643', 'y')}, ${K('10', 'y')}, AccountFlags.NONE);
client.createAccounts(accounts);

var transfers = new TransferBatch(${K('1', 'y')});
transfers.add(UInt128.id(), ${K('2', 'y')}, ${K('1', 'y')}, ${K('15000', 'y')}, ${K('643', 'y')});
var errors = client.createTransfers(transfers);
${K('// errors.getLength() == 0 – перевод проведён', 'c')}`,
    net: `${K('// создаём два счёта и переводим 150,00 ₽', 'c')}
using var client = new Client(${K('"3000,3001,3002"', 'g')});

client.CreateAccounts(new[] {
  new Account { Id = ${K('1', 'y')}, Ledger = ${K('643', 'y')}, Code = ${K('10', 'y')}, Flags = AccountFlags.NoOverdraft },
  new Account { Id = ${K('2', 'y')}, Ledger = ${K('643', 'y')}, Code = ${K('10', 'y')} },
});

var errors = client.CreateTransfers(new[] {
  new Transfer { Id = ID.Create(), DebitId = ${K('2', 'y')}, CreditId = ${K('1', 'y')}, Amount = ${K('15000', 'y')}, Ledger = ${K('643', 'y')} },
});
${K('// errors.Length == 0 – перевод проведён', 'c')}`
  };
  const pre = $('#code');
  function tab(k) { $$('#tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.k === k)); pre.innerHTML = code[k]; }
  $$('#tabs button').forEach(b => b.addEventListener('click', () => tab(b.dataset.k)));
  tab('go');

  /* 3D: кластер из шести реплик на кольце, лидер в центре, пакеты-транзакции */
  const cv = $('#cube'), ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  function size() { dpr = Math.min(2, devicePixelRatio || 1); const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  size(); addEventListener('resize', size);
  const css = getComputedStyle(document.documentElement);
  const ACC = css.getPropertyValue('--acc').trim() || '#7CF0B0', ACC2 = css.getPropertyValue('--acc2').trim() || '#6EA8FF';
  // узлы: 6 реплик-кубов на кольце + лидер
  const nodes = [];
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; nodes.push({ x: Math.cos(a) * 1.35, y: (i % 2 ? .28 : -.28), z: Math.sin(a) * 1.35 }); }
  const leader = { x: 0, y: 0, z: 0 };
  const cubeV = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  const cubeE = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const packets = [];
  let t0 = performance.now(), rot = .6;
  function proj(p, ry, rx) {
    let x = p.x * Math.cos(ry) - p.z * Math.sin(ry), z = p.x * Math.sin(ry) + p.z * Math.cos(ry), y = p.y;
    const y2 = y * Math.cos(rx) - z * Math.sin(rx); z = y * Math.sin(rx) + z * Math.cos(rx); y = y2;
    const s = Math.min(W, H) * .42, d = 4.2, k = d / (d + z);
    return { x: W / 2 + x * s * k, y: H / 2 + y * s * k, k, z };
  }
  function cube(c, r, ry, rx, col, alpha) {
    const P = cubeV.map(v => proj({ x: c.x + v[0] * r, y: c.y + v[1] * r, z: c.z + v[2] * r }, ry, rx));
    ctx.strokeStyle = col; ctx.globalAlpha = alpha; ctx.lineWidth = 1.2; ctx.beginPath();
    cubeE.forEach(([a, b]) => { ctx.moveTo(P[a].x, P[a].y); ctx.lineTo(P[b].x, P[b].y); }); ctx.stroke(); ctx.globalAlpha = 1;
    return P;
  }
  function frame(now) {
    const dt = Math.min(50, now - t0); t0 = now;
    if (!reduced) rot += dt * .00018;
    const ry = rot, rx = -.42;
    ctx.clearRect(0, 0, W, H);
    // кольцо
    ctx.strokeStyle = '#232A33'; ctx.lineWidth = 1; ctx.beginPath();
    for (let i = 0; i <= 72; i++) { const a = i / 72 * Math.PI * 2, p = proj({ x: Math.cos(a) * 1.35, y: 0, z: Math.sin(a) * 1.35 }, ry, rx); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }
    ctx.stroke();
    // спицы
    const L = proj(leader, ry, rx);
    nodes.forEach(n => { const p = proj(n, ry, rx); ctx.strokeStyle = '#2E3743'; ctx.beginPath(); ctx.moveTo(L.x, L.y); ctx.lineTo(p.x, p.y); ctx.stroke(); });
    // пакеты
    if (!reduced && Math.random() < dt / 90) packets.push({ to: Math.floor(Math.random() * 6), t: 0, back: false });
    for (let i = packets.length - 1; i >= 0; i--) {
      const pk = packets[i]; pk.t += dt / 700;
      if (pk.t >= 1) { if (!pk.back) { pk.back = true; pk.t = 0; } else { packets.splice(i, 1); continue; } }
      const n = nodes[pk.to], f = pk.back ? 1 - pk.t : pk.t;
      const p = proj({ x: n.x * f, y: n.y * f, z: n.z * f }, ry, rx);
      ctx.fillStyle = pk.back ? ACC2 : ACC; ctx.globalAlpha = .9; ctx.beginPath(); ctx.arc(p.x, p.y, 2.4 * p.k, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    }
    // кубы по глубине
    const order = nodes.map((n, i) => ({ n, i, z: proj(n, ry, rx).z })).sort((a, b) => b.z - a.z);
    order.forEach(o => cube(o.n, .2, ry, rx, '#8D96A3', .35 + .4 * (1 - (o.z + 1.4) / 2.8)));
    cube(leader, .34, ry * 1.6, rx, ACC, .95);
    cube(leader, .2, -ry * 2.2, rx, ACC, .5);
    if (!reduced) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
