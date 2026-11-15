/* Spirit: Still on Mars. Plain JavaScript, no build step. Content is in data.js. */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Progress (badges + notebook) ---------- */
  const STORE_KEY = "spirit-progress-v1";
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { progress = {}; }

  function saveProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) { /* storage unavailable: progress lasts for this visit only */ }
  }

  const NOTEBOOK = [
    { key: "adirondack", text: "Adirondack: volcanic rock. Lava once flowed here." },
    { key: "halley", text: "Halley: a calcium sulfate mineral. Did water change these rocks?" },
    { key: "gertrude", text: "Gertrude Weise: 90% silica. Hot water or steam, found by a broken wheel." },
    { key: "found", text: "Found Spirit from orbit, still sitting at Troy." },
  ];

  function earn(key) {
    if (progress[key]) return;
    progress[key] = true;
    saveProgress();
    renderProgress();
  }

  function renderProgress() {
    document.querySelectorAll("[data-badge]").forEach((b) => b.classList.toggle("earned", !!progress[b.dataset.badge]));
    const list = $("#notebookList");
    list.innerHTML = "";
    NOTEBOOK.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = progress[item.key] ? item.text : "Not found yet";
      if (progress[item.key]) li.className = "got";
      list.appendChild(li);
    });
    $("#notebookDone").hidden = !NOTEBOOK.every((i) => progress[i.key]);
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("done", !!progress[t.dataset.id]));
  }

  /* ---------- Starfield ---------- */
  function starfield() {
    const canvas = $("#stars");
    const ctx = canvas.getContext("2d");
    let stars = [];
    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((canvas.offsetWidth * canvas.offsetHeight) / 5000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: Math.random() * 1.3 + 0.2,
        a: Math.random(),
        s: Math.random() * 0.015 + 0.004,
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const st of stars) {
        st.a += st.s;
        const alpha = 0.35 + Math.abs(Math.sin(st.a)) * 0.65;
        ctx.fillStyle = `rgba(238,243,248,${alpha})`;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    }
    size();
    draw();
    window.addEventListener("resize", size);
  }

  /* ---------- Hero ---------- */
  function hero() {
    const photo = $("#heroPhoto");
    const src = nasaImage("PIA11757", 1400);
    const img = new Image();
    img.onload = () => { photo.style.backgroundImage = `url("${src}")`; photo.classList.add("loaded"); };
    img.src = src;

    const line = "It was built to last three months. It explored for six years. Then a broken wheel made one of its biggest discoveries.";
    const el = $("#typeLine");
    if (reduceMotion) { el.textContent = line; return; }
    let i = 0;
    const cursor = '<span class="cursor"></span>';
    (function type() {
      el.innerHTML = line.slice(0, i) + cursor;
      if (i++ < line.length) setTimeout(type, line[i - 2] === "." ? 380 : 28);
    })();
  }

  /* ---------- Stats ---------- */
  function stats() {
    const grid = $("#stats");
    STATS.forEach((s) => {
      grid.insertAdjacentHTML("beforeend",
        `<div class="stat"><div class="stat-num" data-target="${s.value}" data-dec="${s.decimals || 0}" data-suffix="${s.suffix}">0${s.suffix}</div><div class="stat-label">${s.label}</div></div>`);
    });
    const fmt = (n, d) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        grid.querySelectorAll(".stat-num").forEach((el) => {
          const target = +el.dataset.target, dec = +el.dataset.dec, suf = el.dataset.suffix;
          if (reduceMotion) { el.textContent = fmt(target, dec) + suf; return; }
          const t0 = performance.now(), dur = 1400;
          (function tick(t) {
            const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(target * eased, dec) + suf;
            if (p < 1) requestAnimationFrame(tick);
          })(t0);
        });
      });
    }, { threshold: 0.4 });
    io.observe(grid);
  }

  /* ---------- Timeline ---------- */
  function timeline() {
    const track = $("#track"), marker = $("#roverMarker"), card = $("#moment");
    let current = 0;

    TIMELINE.forEach((m, i) => {
      const b = document.createElement("button");
      b.className = "stop" + (m.highlight ? " hl" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", "false");
      b.innerHTML = `<span class="dot"></span>${m.date.replace(/ \d{1,2},/, "").replace(/^(\w+) (\d{4})$/, "$1<br>$2")}`;
      b.addEventListener("click", () => select(i));
      track.appendChild(b);
    });

    function select(i) {
      current = Math.max(0, Math.min(TIMELINE.length - 1, i));
      const m = TIMELINE[current];
      [...track.children].forEach((b, j) => b.setAttribute("aria-selected", j === current ? "true" : "false"));
      const stop = track.children[current];
      marker.style.transform = `translateX(${stop.offsetLeft + stop.offsetWidth / 2 - 28}px)`;
      card.className = "moment" + (m.highlight ? " hl" : "");
      card.innerHTML = `<div class="moment-date">${m.date}</div><h3>${m.title}</h3><p>${m.text}</p>`;
      void card.offsetWidth; // restart the fade-in animation
      card.style.animation = "none"; card.offsetHeight; card.style.animation = "";
      $("#prevMoment").disabled = current === 0;
      $("#nextMoment").disabled = current === TIMELINE.length - 1;
      const tl = stop.closest(".timeline");
      const target = stop.offsetLeft - tl.clientWidth / 2 + stop.offsetWidth / 2;
      tl.scrollTo({ left: target, behavior: reduceMotion ? "auto" : "smooth" });
    }

    $("#prevMoment").addEventListener("click", () => select(current - 1));
    $("#nextMoment").addEventListener("click", () => select(current + 1));
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { select(current + 1); track.children[current].focus(); }
      if (e.key === "ArrowLeft") { select(current - 1); track.children[current].focus(); }
    });
    window.addEventListener("resize", () => select(current));
    select(0);
  }

  /* ---------- Scratch game ---------- */
  function game() {
    const url = `https://scratch.mit.edu/projects/${SCRATCH_PROJECT_ID}`;
    $("#scratchFrame").src = `${url}/embed`;
    $("#scratchLink").href = url;
  }

  /* ---------- Tool gallery ---------- */
  function toolkit() {
    const grid = $("#toolGrid");
    if (!grid) return;
    TOOLS.forEach((t) => {
      const card = document.createElement("button");
      card.className = "tool-card";
      card.setAttribute("aria-expanded", "false");
      card.innerHTML = `<img src="tools/${t.id}.jpg" alt="${t.name}" loading="lazy">
        <span class="tool-name">${t.name}</span><span class="tool-where">${t.where}</span>
        <span class="tool-what">${t.what}<em>Photo: ${t.credit}</em></span>`;
      card.addEventListener("click", () => {
        const open = card.getAttribute("aria-expanded") === "true";
        card.setAttribute("aria-expanded", open ? "false" : "true");
      });
      grid.appendChild(card);
    });
  }

  /* ---------- Evidence lab ---------- */
  function evidenceLab() {
    const tabs = $("#evidenceTabs");
    let active = 0;

    EVIDENCE.forEach((ev, i) => {
      const t = document.createElement("button");
      t.className = "tab";
      t.dataset.id = ev.id;
      t.setAttribute("role", "tab");
      t.innerHTML = `<span class="num">${i + 1}</span>${ev.name}`;
      t.addEventListener("click", () => show(i));
      tabs.appendChild(t);
    });

    function show(i) {
      active = i;
      const ev = EVIDENCE[i];
      [...tabs.children].forEach((t, j) => t.setAttribute("aria-selected", j === i ? "true" : "false"));
      const lab = $("#lab");
      lab.style.animation = "none"; lab.offsetHeight; lab.style.animation = "";

      const img = $("#labImg");
      img.src = nasaImage(ev.pia, 900);
      img.alt = `${ev.name}, photographed by Spirit (${ev.pia})`;
      $("#lens").style.backgroundImage = `url("${nasaImage(ev.pia)}")`;
      $("#labCaption").textContent = `${ev.imageCaption} ${ev.pia}, ${IMAGE_CREDITS[ev.pia]}.`;
      $("#labWhen").textContent = ev.when;
      $("#labTool").textContent = ev.instrument;
      $("#labTools").innerHTML = (ev.tools || []).map((id) => {
        const t = toolById(id);
        return `<figure class="lab-tool"><img src="tools/${t.id}.jpg" alt="${t.name}" loading="lazy"><figcaption>${t.name}</figcaption></figure>`;
      }).join("");
      $("#labName").textContent = ev.name;
      $("#labQ").textContent = ev.question;
      $("#labFeedback").innerHTML = "";

      const opts = $("#labOptions");
      opts.innerHTML = "";
      ev.options.forEach((o) => {
        const b = document.createElement("button");
        b.className = "option";
        b.textContent = o.text;
        b.addEventListener("click", () => answer(b, o, ev));
        opts.appendChild(b);
      });
      if (progress[ev.id]) {
        const right = [...opts.children].find((b, k) => ev.options[k].correct);
        answer(right, ev.options.find((o) => o.correct), ev, true);
      }
    }

    function answer(btn, opt, ev, silent) {
      const fb = $("#labFeedback");
      if (!opt.correct) {
        btn.classList.add("wrong");
        btn.disabled = true;
        fb.innerHTML = `<p class="try">Not quite. Look at the photo again and think about what each tool or clue can tell you.</p>`;
        return;
      }
      $("#labOptions").querySelectorAll(".option").forEach((b) => (b.disabled = true));
      btn.classList.add("right");
      const nextIdx = EVIDENCE.findIndex((e, k) => k > active && !progress[e.id]);
      const nextBtn = nextIdx > -1
        ? `<button class="btn btn-small next-target" data-next="${nextIdx}">Next target: ${EVIDENCE[nextIdx].name} &rarr;</button>`
        : `<a class="btn btn-small next-target" href="#find">Now find Spirit from space &rarr;</a>`;
      fb.innerHTML = `<p>${ev.explain}</p><div class="conclusion"><strong>Evidence added</strong>${ev.conclusion}</div>${nextBtn}`;
      const nb = fb.querySelector("[data-next]");
      if (nb) nb.addEventListener("click", () => show(+nb.dataset.next));
      if (!silent) earn(ev.id);
    }

    // Magnifier lens: shows the full-resolution photo at 2.5x under the pointer.
    const wrap = $("#lensWrap"), lens = $("#lens"), ZOOM = 2.5;
    function moveLens(clientX, clientY) {
      const img = $("#labImg");
      const r = wrap.getBoundingClientRect();
      // The photo is letterboxed inside a square frame, so find the drawn image box.
      const nw = img.naturalWidth || 1, nh = img.naturalHeight || 1;
      const scale = Math.min(r.width / nw, r.height / nh);
      const dw = nw * scale, dh = nh * scale, ox = (r.width - dw) / 2, oy = (r.height - dh) / 2;
      const x = clientX - r.left, y = clientY - r.top;
      const inside = x >= ox && x <= ox + dw && y >= oy && y <= oy + dh;
      wrap.classList.toggle("active", inside);
      if (!inside) return;
      lens.style.left = x + "px";
      lens.style.top = y + "px";
      lens.style.backgroundSize = `${dw * ZOOM}px ${dh * ZOOM}px`;
      const half = lens.offsetWidth / 2;
      lens.style.backgroundPosition = `${-((x - ox) * ZOOM - half)}px ${-((y - oy) * ZOOM - half)}px`;
    }
    wrap.addEventListener("mousemove", (e) => moveLens(e.clientX, e.clientY));
    wrap.addEventListener("mouseleave", () => wrap.classList.remove("active"));
    wrap.addEventListener("touchmove", (e) => { const t = e.touches[0]; moveLens(t.clientX, t.clientY); e.preventDefault(); }, { passive: false });
    wrap.addEventListener("touchend", () => wrap.classList.remove("active"));

    show(0);
  }

  /* ---------- Find Spirit ---------- */
  function findSpirit() {
    const wrap = $("#findWrap"), img = $("#findImg"), ring = $("#findRing"), ping = $("#findPing"), status = $("#findStatus");
    img.src = nasaImage(FIND_SPIRIT.pia);
    let tries = 0, done = false;

    function reveal(won) {
      done = true;
      ring.style.left = FIND_SPIRIT.x * 100 + "%";
      ring.style.top = FIND_SPIRIT.y * 100 + "%";
      ring.hidden = false;
      wrap.style.cursor = "default";
      status.classList.add("win");
      status.textContent = won
        ? "You found Spirit! That bright dot is a rover about the size of a golf cart, seen from orbit."
        : "There it is: the bright dot just left of Home Plate. That is Spirit, still sitting at Troy.";
      $("#findReveal").hidden = true;
      earn("found");
    }

    wrap.addEventListener("click", (e) => {
      if (done) return;
      const r = img.getBoundingClientRect();
      const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      ping.hidden = true; void ping.offsetWidth;
      ping.style.left = fx * 100 + "%"; ping.style.top = fy * 100 + "%"; ping.hidden = false;
      const aspect = r.height / r.width;
      const dist = Math.hypot(fx - FIND_SPIRIT.x, (fy - FIND_SPIRIT.y) * aspect);
      tries++;
      if (dist <= FIND_SPIRIT.radius) return reveal(true);
      status.classList.remove("win");
      if (dist < 0.15) status.textContent = "Very close! Look for a tiny bright speck.";
      else if (dist < 0.3) status.textContent = "Getting warmer. Spirit is right next to Home Plate.";
      else status.textContent = "Cold. Try near the edge of the big pale circle.";
      if (tries >= 5) status.textContent += " Stuck? Press \"Show me.\"";
    });
    wrap.addEventListener("keydown", (e) => { if (e.key === "Enter" && !done) reveal(false); });
    $("#findReveal").addEventListener("click", () => reveal(false));
    if (progress.found) reveal(true);
  }

  /* ---------- Nav highlight ---------- */
  function navSpy() {
    const links = [...document.querySelectorAll(".nav nav a")];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((a) => { const s = $(a.getAttribute("href")); if (s) io.observe(s); });
  }

  /* ---------- Sources ---------- */
  function sources() {
    const ul = $("#sources");
    SOURCES.forEach((s) => ul.insertAdjacentHTML("beforeend", `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`));
  }

  starfield();
  hero();
  stats();
  timeline();
  game();
  evidenceLab();
  toolkit();
  findSpirit();
  navSpy();
  sources();
  renderProgress();
})();
