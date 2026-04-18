(function () {
  const FOLDER = 'mg/';
  const INTERVAL = 2000;

  const images = [
    'int_1.jpg','int_2.jpg','int_3.jpg','int_4.jpg','int_5.jpg',
    'int_6.jpg','int_7.jpg','int_8.jpg','int_9.jpg','int_10.jpg',
    'int_11.jpg','int_12.jpg','int_13.jpg','int_14.jpg','int_15.jpg',
    'int_16.jpg','int_17.jpg','int_18.jpg','int_19.jpg','int_20.jpg',
  ];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const shuffled = shuffle(images);
  const layer1 = document.getElementById('bg1');
  const layer2 = document.getElementById('bg2');
  const layers = [layer1, layer2];

  images.forEach(f => { (new Image()).src = FOLDER + f; });

  let active = 0;
  let cur = 0;
  let ready = false;
  let lastChange = 0;
  let raf = null;

  function switchTo(idx) {
    if (idx === cur) return;
    const next = 1 - active;
    layers[next].style.backgroundImage = `url('${FOLDER + shuffled[idx]}')`;
    layers[active].style.opacity = '0';
    layers[next].style.opacity = '1';
    active = next;
    cur = idx;
  }

  function setFirst(idx) {
    if (idx >= shuffled.length) return;
    const img = new Image();
    img.onload = () => {
      layers[active].style.backgroundImage = `url('${FOLDER + shuffled[idx]}')`;
      layers[active].style.opacity = '1';
      layers[1 - active].style.opacity = '0';
      cur = idx;
      ready = true;
      lastChange = performance.now();
      raf = requestAnimationFrame(tick);
    };
    img.onerror = () => setFirst(idx + 1);
    img.src = FOLDER + shuffled[idx];
  }

  function tick(now) {
    if (ready && now - lastChange >= INTERVAL) {
      const steps = Math.floor((now - lastChange) / INTERVAL);
      const next = (cur + steps) % shuffled.length;
      if (next !== cur) switchTo(next);
      lastChange = now;
    }
    raf = requestAnimationFrame(tick);
  }

  setFirst(0);

  const audio = document.getElementById('audio');
  audio.volume = 0.3;
  audio.play().catch(() => {
    const go = () => { audio.play().catch(() => {}); document.removeEventListener('click', go); };
    document.addEventListener('click', go);
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && audio.paused) audio.play().catch(() => {});
  });

  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());
})();
