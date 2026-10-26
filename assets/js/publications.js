// Publications page: per-year chart, filters, search and collapsible years.
(function () {
  "use strict";

  var page = document.getElementById("pubs-page");
  if (!page) return;
  page.classList.add("js-ready");

  var SERIES = [
    { key: "journals", label: "Journal articles", color: "var(--pb-journals)" },
    { key: "conferences", label: "Conference papers", color: "var(--pb-conferences)" },
    { key: "other", label: "Workshops, books & other", color: "var(--pb-other)" }
  ];
  var SVG_NS = "http://www.w3.org/2000/svg";

  var plot = document.getElementById("pubs-chart-plot");
  var tooltip = document.getElementById("pubs-tooltip");
  var figure = plot.closest(".pubs-chart");
  var statusEl = document.getElementById("pubs-status");
  var yearFilterBtn = document.getElementById("pubs-year-filter");
  var toggleAllBtn = document.getElementById("pubs-toggle-all");
  var searchInput = document.getElementById("pubs-search-input");
  var emptyEl = document.getElementById("pubs-empty");
  var chips = Array.prototype.slice.call(page.querySelectorAll(".pubs-chip"));
  var yearGroups = Array.prototype.slice.call(page.querySelectorAll(".pub-year"));

  var state = { type: "all", query: "", year: null };

  // ---------------------------------------------------------------- data

  function normalize(s) {
    return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  var items = [];
  yearGroups.forEach(function (group) {
    var year = group.getAttribute("data-year");
    group.querySelectorAll(".pub").forEach(function (li) {
      items.push({
        el: li,
        year: year,
        group: li.getAttribute("data-group"),
        selected: li.hasAttribute("data-selected"),
        text: normalize(li.querySelector(".pub-title").textContent + " " +
          li.querySelector(".pub-authors").textContent + " " +
          li.querySelector(".pub-venue").textContent)
      });
    });
  });

  // Per-year counts come from the table view, so chart and table always agree.
  var rows = Array.prototype.slice.call(document.querySelectorAll("#pubs-year-table tbody tr"));
  var byYear = {};
  rows.forEach(function (tr) {
    var cells = tr.querySelectorAll("td");
    byYear[tr.getAttribute("data-year")] = {
      journals: +cells[0].textContent,
      conferences: +cells[1].textContent,
      other: +cells[2].textContent,
      total: +cells[3].textContent
    };
  });
  var yearsSorted = Object.keys(byYear).map(Number).sort(function (a, b) { return a - b; });
  var data = [];
  for (var y = yearsSorted[0]; y <= yearsSorted[yearsSorted.length - 1]; y++) {
    var d = byYear[y] || { journals: 0, conferences: 0, other: 0, total: 0 };
    data.push({ year: y, journals: d.journals, conferences: d.conferences, other: d.other, total: d.total });
  }

  // ---------------------------------------------------------------- chart

  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function topRoundedRect(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    return "M" + x + "," + (y + h) +
      "V" + (y + r) +
      "Q" + x + "," + y + " " + (x + r) + "," + y +
      "H" + (x + w - r) +
      "Q" + (x + w) + "," + y + " " + (x + w) + "," + (y + r) +
      "V" + (y + h) + "Z";
  }

  function niceStep(max) {
    var steps = [1, 2, 4, 5, 10, 20, 25, 50];
    for (var i = 0; i < steps.length; i++) {
      if (Math.ceil(max / steps[i]) <= 4) return steps[i];
    }
    return steps[steps.length - 1];
  }

  function describe(d) {
    return d.year + ": " + d.total + (d.total === 1 ? " publication" : " publications") +
      " (" + d.journals + " journal, " + d.conferences + " conference, " + d.other + " other)";
  }

  function renderChart() {
    var width = Math.max(plot.clientWidth, 260);
    var margin = { top: 20, right: 6, bottom: 24, left: 26 };
    var plotH = width < 480 ? 150 : 190;
    var height = margin.top + plotH + margin.bottom;
    var innerW = width - margin.left - margin.right;

    var maxTotal = Math.max.apply(null, data.map(function (d) { return d.total; }));
    var step = niceStep(maxTotal);
    var yMax = Math.ceil(maxTotal / step) * step;
    var scale = plotH / yMax;
    var slot = innerW / data.length;
    var barW = Math.min(24, Math.max(4, slot * 0.66));
    var labelEvery = slot >= 34 ? 1 : slot >= 17 ? 2 : 4;
    var lastYear = data[data.length - 1].year;
    var baseY = margin.top + plotH;

    var svg = el("svg", {
      width: width, height: height, viewBox: "0 0 " + width + " " + height,
      role: "img", "aria-label": "Stacked column chart of publications per year by type"
    });

    var grid = el("g", { class: "grid" });
    for (var t = 0; t <= yMax; t += step) {
      var gy = Math.round(baseY - t * scale) + 0.5;
      if (t > 0) grid.appendChild(el("line", { x1: margin.left, x2: width - margin.right, y1: gy, y2: gy }));
      var tl = el("text", { x: margin.left - 8, y: gy + 4, "text-anchor": "end" });
      tl.textContent = t;
      grid.appendChild(tl);
    }
    svg.appendChild(grid);

    // Label the busiest year (latest one on ties).
    var peak = data.reduce(function (a, b) { return b.total >= a.total ? b : a; });

    data.forEach(function (d, i) {
      var cx = margin.left + slot * i + slot / 2;
      var x = cx - barW / 2;
      var g = el("g", {
        class: "col" + (state.year === String(d.year) ? " is-picked" : ""),
        "data-year": d.year, tabindex: d.total ? 0 : -1, role: "button",
        "aria-label": describe(d) + ". Show these publications."
      });
      g.appendChild(el("rect", { class: "hit", x: margin.left + slot * i, y: margin.top - 4, width: slot, height: plotH + 4 + margin.bottom, rx: 4 }));

      var yCursor = baseY;
      var visible = SERIES.filter(function (s) { return d[s.key] > 0; });
      visible.forEach(function (s, idx) {
        var h = d[s.key] * scale;
        var isTop = idx === visible.length - 1;
        var drawH = isTop ? h : h - 2; // 2px surface gap between stacked segments
        var top = yCursor - h;
        var seg = isTop
          ? el("path", { d: topRoundedRect(x, top, barW, drawH, 4) })
          : el("rect", { x: x, y: top + 2, width: barW, height: drawH });
        seg.setAttribute("class", "seg seg--" + s.key);
        g.appendChild(seg);
        yCursor = top;
      });

      if ((lastYear - d.year) % labelEvery === 0) {
        var xl = el("text", { x: cx, y: baseY + 16, "text-anchor": "middle" });
        xl.textContent = labelEvery > 1 ? "’" + String(d.year).slice(2) : d.year;
        g.appendChild(xl);
      }
      if (d === peak) {
        var vl = el("text", { class: "direct-label", x: cx, y: baseY - d.total * scale - 6, "text-anchor": "middle" });
        vl.textContent = d.total;
        g.appendChild(vl);
      }

      g.addEventListener("pointerenter", function () { hover(g, d); });
      g.addEventListener("pointerleave", unhover);
      g.addEventListener("focus", function () { hover(g, d); });
      g.addEventListener("blur", unhover);
      g.addEventListener("click", function () { pickYear(String(d.year)); });
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickYear(String(d.year)); }
      });
      svg.appendChild(g);
    });

    svg.appendChild(el("line", { class: "baseline", x1: margin.left, x2: width - margin.right, y1: baseY + 0.5, y2: baseY + 0.5 }));

    plot.textContent = "";
    plot.appendChild(svg);
    plot.setAttribute("data-type", state.type);
    plot.classList.toggle("has-pick", !!state.year);
  }

  function hover(g, d) {
    plot.classList.add("is-hovering");
    g.classList.add("is-hover");

    tooltip.textContent = "";
    var head = document.createElement("div");
    head.className = "tt-head";
    var yr = document.createElement("span");
    yr.className = "tt-year";
    yr.textContent = d.year;
    var tot = document.createElement("span");
    tot.className = "tt-total";
    tot.textContent = d.total + (d.total === 1 ? " publication" : " publications");
    head.appendChild(yr);
    head.appendChild(tot);
    tooltip.appendChild(head);
    SERIES.slice().reverse().forEach(function (s) {
      var row = document.createElement("div");
      row.className = "tt-row";
      var key = document.createElement("span");
      key.className = "tt-key";
      key.style.background = s.color;
      var val = document.createElement("span");
      val.className = "tt-value";
      val.textContent = d[s.key];
      var lab = document.createElement("span");
      lab.className = "tt-label";
      lab.textContent = s.label;
      row.appendChild(key);
      row.appendChild(val);
      row.appendChild(lab);
      tooltip.appendChild(row);
    });
    tooltip.hidden = false;

    var figRect = figure.getBoundingClientRect();
    var colRect = g.querySelector(".hit").getBoundingClientRect();
    var tipW = tooltip.offsetWidth;
    var left = colRect.left - figRect.left + colRect.width / 2 - tipW / 2;
    left = Math.max(8, Math.min(left, figRect.width - tipW - 8));
    var top = colRect.top - figRect.top - tooltip.offsetHeight + 8;
    tooltip.style.left = left + "px";
    tooltip.style.top = Math.max(4, top) + "px";
  }

  function unhover() {
    plot.classList.remove("is-hovering");
    plot.querySelectorAll(".col.is-hover").forEach(function (c) { c.classList.remove("is-hover"); });
    tooltip.hidden = true;
  }

  // ---------------------------------------------------------------- filters

  function filtersActive() {
    return state.type !== "all" || state.query !== "" || state.year !== null;
  }

  function matches(item) {
    if (state.year && item.year !== state.year) return false;
    if (state.type === "selected" && !item.selected) return false;
    if (state.type !== "all" && state.type !== "selected" && item.group !== state.type) return false;
    if (state.query) {
      var terms = state.query.split(/\s+/);
      for (var i = 0; i < terms.length; i++) if (item.text.indexOf(terms[i]) === -1) return false;
    }
    return true;
  }

  function plural(n) { return n === 1 ? " publication" : " publications"; }

  function apply() {
    var active = filtersActive();
    var shown = 0;
    var countByYear = {};
    items.forEach(function (item) {
      var ok = matches(item);
      item.el.hidden = !ok;
      if (ok) { shown++; countByYear[item.year] = (countByYear[item.year] || 0) + 1; }
    });

    yearGroups.forEach(function (group) {
      var year = group.getAttribute("data-year");
      var n = countByYear[year] || 0;
      var countEl = group.querySelector(".pub-year-count");
      var total = +countEl.getAttribute("data-total");
      group.hidden = n === 0;
      countEl.textContent = active ? n + " of " + total + plural(total) : total + plural(total);
      if (active) group.open = n > 0;
      else group.open = group.hasAttribute("data-default-open");
    });

    statusEl.textContent = active
      ? "Showing " + shown + " of " + items.length + " publications"
      : "Showing all " + items.length + " publications";
    emptyEl.hidden = shown !== 0;

    chips.forEach(function (chip) {
      var on = chip.getAttribute("data-filter") === state.type;
      chip.classList.toggle("is-active", on);
      chip.setAttribute("aria-pressed", on ? "true" : "false");
    });

    if (state.year) {
      yearFilterBtn.hidden = false;
      yearFilterBtn.textContent = "Year " + state.year + " ×";
      yearFilterBtn.setAttribute("aria-label", "Remove year filter " + state.year);
    } else {
      yearFilterBtn.hidden = true;
    }

    plot.setAttribute("data-type", state.type);
    plot.classList.toggle("has-pick", !!state.year);
    plot.querySelectorAll(".col").forEach(function (c) {
      c.classList.toggle("is-picked", c.getAttribute("data-year") === state.year);
    });
    updateToggleLabel();
  }

  function pickYear(year) {
    state.year = state.year === year ? null : year;
    apply();
    if (state.year) {
      var target = page.querySelector('.pub-year[data-year="' + year + '"]');
      if (target && target.getBoundingClientRect().top > window.innerHeight - 80) {
        statusEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  function visibleGroups() {
    return yearGroups.filter(function (g) { return !g.hidden; });
  }

  function updateToggleLabel() {
    var allOpen = visibleGroups().every(function (g) { return g.open; });
    toggleAllBtn.textContent = allOpen ? "Collapse all years" : "Expand all years";
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      state.type = chip.getAttribute("data-filter");
      apply();
    });
  });

  var searchTimer;
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.query = normalize(searchInput.value.trim());
      apply();
    }, 120);
  });

  yearFilterBtn.addEventListener("click", function () { pickYear(state.year); });

  toggleAllBtn.addEventListener("click", function () {
    var groups = visibleGroups();
    var open = !groups.every(function (g) { return g.open; });
    groups.forEach(function (g) { g.open = open; });
    updateToggleLabel();
  });

  yearGroups.forEach(function (g) { g.addEventListener("toggle", updateToggleLabel); });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderChart, 150);
  });

  renderChart();
  apply();
})();
