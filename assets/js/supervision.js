// Supervision section: thesis timeline, filters and links from the timeline to the cards.
(function () {
  "use strict";

  var page = document.getElementById("sup-page");
  if (!page) return;
  page.classList.add("js-ready");

  var LEVELS = [
    { key: "phd", label: "PhD" },
    { key: "master", label: "Master's" },
    { key: "bachelor", label: "Bachelor's" }
  ];
  var LEVEL_NAME = { phd: "PhD", master: "Master's", bachelor: "Bachelor's" };
  var SVG_NS = "http://www.w3.org/2000/svg";
  var R = 5;            // dot radius (10px mark)
  var STEP = 2 * R + 4; // spacing between stacked dots

  var plot = document.getElementById("sup-chart-plot");
  var tooltip = document.getElementById("sup-tooltip");
  var figure = plot.closest(".sup-chart");
  var chips = Array.prototype.slice.call(page.querySelectorAll(".sup-chip"));
  var sections = Array.prototype.slice.call(page.querySelectorAll(".sup-level"));
  var cards = Array.prototype.slice.call(page.querySelectorAll(".sup-card"));
  var filter = "all";

  var points = cards.map(function (card) {
    var year = +card.getAttribute("data-year");
    var month = +card.getAttribute("data-month") || 6;
    return {
      card: card,
      level: card.getAttribute("data-level"),
      ongoing: card.getAttribute("data-status") === "ongoing",
      t: year + (month - 0.5) / 12,
      year: year,
      date: card.getAttribute("data-date"),
      names: card.getAttribute("data-names"),
      thesis: card.getAttribute("data-thesis")
    };
  });

  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function visibleFor(p) {
    if (filter === "all") return true;
    if (filter === "ongoing") return p.ongoing;
    return p.level === filter;
  }

  // Stack dots that would overlap: alternate above and below the row's center line.
  function placeRow(rowPoints, xOf) {
    var slots = [0, -1, 1, -2, 2, -3, 3, -4, 4];
    var placed = [];
    rowPoints.slice().sort(function (a, b) { return a.t - b.t; }).forEach(function (p) {
      var x = xOf(p.t);
      for (var i = 0; i < slots.length; i++) {
        var clash = placed.some(function (q) { return q.slot === slots[i] && Math.abs(q.x - x) < STEP; });
        if (!clash) { placed.push({ p: p, x: x, slot: slots[i] }); return; }
      }
      placed.push({ p: p, x: x, slot: 0 });
    });
    return placed;
  }

  function render() {
    var width = Math.max(plot.clientWidth, 260);
    var narrow = width < 520;
    var margin = { top: 18, right: 10, bottom: 26, left: narrow ? 90 : 96 };
    var innerW = width - margin.left - margin.right;

    var now = new Date();
    var nowT = now.getFullYear() + now.getMonth() / 12;
    var minYear = Math.min.apply(null, points.map(function (p) { return p.year; }));
    var maxYear = Math.max.apply(null, points.map(function (p) { return p.year; }).concat([now.getFullYear()]));
    var span = maxYear + 1 - minYear;
    function xOf(t) { return margin.left + (t - minYear) / span * innerW; }

    // Lay out each row first so its height fits the tallest stack.
    var rows = LEVELS.map(function (lv) {
      var placed = placeRow(points.filter(function (p) { return p.level === lv.key; }), xOf);
      var maxSlot = placed.reduce(function (m, q) { return Math.max(m, Math.abs(q.slot)); }, 0);
      return { level: lv, placed: placed, height: Math.max(40, (2 * maxSlot + 1) * STEP + 16) };
    });
    var plotH = rows.reduce(function (s, r) { return s + r.height; }, 0);
    var height = margin.top + plotH + margin.bottom;

    var svg = el("svg", {
      width: width, height: height, viewBox: "0 0 " + width + " " + height,
      role: "img", "aria-label": "Timeline of supervised theses by level and graduation date"
    });

    // Year ticks
    var pxPerYear = innerW / span;
    var every = pxPerYear >= 34 ? 1 : pxPerYear >= 17 ? 2 : 4;
    for (var y = minYear; y <= maxYear; y++) {
      var tx = Math.round(xOf(y)) + 0.5;
      svg.appendChild(el("line", { class: "tick-line", x1: tx, x2: tx, y1: margin.top, y2: margin.top + plotH }));
      if ((maxYear - y) % every === 0) {
        var lab = el("text", { x: xOf(y + 0.5), y: margin.top + plotH + 17, "text-anchor": "middle" });
        lab.textContent = every > 1 ? "’" + String(y).slice(2) : y;
        svg.appendChild(lab);
      }
    }

    // Today marker separates completed theses from expected graduations.
    var todayX = Math.round(xOf(nowT)) + 0.5;
    svg.appendChild(el("line", { class: "today-line", x1: todayX, x2: todayX, y1: margin.top - 6, y2: margin.top + plotH }));
    var todayLab = el("text", { class: "today-label", x: todayX, y: margin.top - 9, "text-anchor": "middle" });
    todayLab.textContent = "Today";
    svg.appendChild(todayLab);

    // Rows
    var rowTop = margin.top;
    rows.forEach(function (row, i) {
      var cy = rowTop + row.height / 2;
      if (i > 0) svg.appendChild(el("line", { class: "row-line", x1: 0, x2: width - margin.right, y1: Math.round(rowTop) + 0.5, y2: Math.round(rowTop) + 0.5 }));
      svg.appendChild(el("circle", { class: "row-key row-key--" + row.level.key, cx: 4.5, cy: cy, r: 4.5 }));
      var label = el("text", { class: "row-label", x: 14, y: cy + 4 });
      label.textContent = row.level.label;
      svg.appendChild(label);

      row.placed.forEach(function (q) {
        var p = q.p;
        var py = cy + q.slot * STEP;
        var g = el("g", {
          class: "pt pt--" + p.level + (p.ongoing ? " pt--ongoing" : "") + (visibleFor(p) ? "" : " is-dimmed"),
          tabindex: 0, role: "button",
          "aria-label": p.names + ", " + LEVEL_NAME[p.level] + ", " + (p.ongoing ? "expected " : "") + p.date + ". Show details."
        });
        g.appendChild(el("circle", { class: "hit", cx: q.x, cy: py, r: 12 }));
        g.appendChild(el("circle", { class: "mark", cx: q.x, cy: py, r: p.ongoing ? R - 0.75 : R + 1 }));
        g.addEventListener("pointerenter", function () { hover(g, p); });
        g.addEventListener("pointerleave", unhover);
        g.addEventListener("focus", function () { hover(g, p); });
        g.addEventListener("blur", unhover);
        g.addEventListener("click", function () { reveal(p); });
        g.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(p); }
        });
        svg.appendChild(g);
      });
      rowTop += row.height;
    });

    plot.textContent = "";
    plot.appendChild(svg);
  }

  function hover(g, p) {
    plot.classList.add("is-hovering");
    g.classList.add("is-hover");
    tooltip.textContent = "";
    var names = document.createElement("div");
    names.className = "tt-names";
    names.textContent = p.names;
    var meta = document.createElement("div");
    meta.className = "tt-meta";
    meta.textContent = LEVEL_NAME[p.level] + " · " + (p.ongoing ? "expected " : "") + p.date;
    tooltip.appendChild(names);
    tooltip.appendChild(meta);
    if (p.thesis) {
      var th = document.createElement("div");
      th.className = "tt-thesis";
      th.textContent = p.thesis;
      tooltip.appendChild(th);
    }
    tooltip.hidden = false;

    var figRect = figure.getBoundingClientRect();
    var r = g.querySelector(".hit").getBoundingClientRect();
    var tipW = tooltip.offsetWidth;
    var left = r.left - figRect.left + r.width / 2 - tipW / 2;
    left = Math.max(8, Math.min(left, figRect.width - tipW - 8));
    var top = r.top - figRect.top - tooltip.offsetHeight - 4;
    if (top < 4) top = r.bottom - figRect.top + 4;
    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
  }

  function unhover() {
    plot.classList.remove("is-hovering");
    plot.querySelectorAll(".pt.is-hover").forEach(function (n) { n.classList.remove("is-hover"); });
    tooltip.hidden = true;
  }

  function reveal(p) {
    if (!visibleFor(p)) setFilter("all");
    p.card.scrollIntoView({ behavior: "smooth", block: "center" });
    p.card.classList.add("is-flash");
    setTimeout(function () { p.card.classList.remove("is-flash"); }, 1600);
  }

  function setFilter(value) {
    filter = value;
    chips.forEach(function (chip) {
      var on = chip.getAttribute("data-filter") === filter;
      chip.classList.toggle("is-active", on);
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    });
    cards.forEach(function (card, i) { card.hidden = !visibleFor(points[i]); });
    sections.forEach(function (section) {
      var total = section.querySelectorAll(".sup-card").length;
      var shown = section.querySelectorAll(".sup-card:not([hidden])").length;
      var noun = total === 1 ? " thesis" : " theses";
      section.hidden = shown === 0;
      section.querySelector(".sup-level-count").textContent =
        (filter === "all" || shown === total ? "" : shown + " of ") + total + noun;
    });
    render();
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () { setFilter(chip.getAttribute("data-filter")); });
  });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 150);
  });

  render();
})();
