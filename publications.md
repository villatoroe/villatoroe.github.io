---
layout: page
title: Publications
subtitle: Journal articles, conference papers and other publications
css:
  - "/assets/css/index.css"
  - "/assets/css/publications.css"
js:
  - "/assets/js/publications.js"
---

{%- comment -%}
  The list is generated from _data/publications.yml.
  To add a publication, add an entry to that file; counts, chart and filters update automatically.
{%- endcomment -%}

{%- assign pubs = site.data.publications -%}
{%- assign n_total = pubs | size -%}
{%- assign n_jcr = pubs | where: "type", "journal" | size -%}
{%- assign n_regional = pubs | where: "type", "regional" | size -%}
{%- assign n_journals = n_jcr | plus: n_regional -%}
{%- assign n_conferences = pubs | where: "type", "conference" | size -%}
{%- assign n_other = n_total | minus: n_journals | minus: n_conferences -%}
{%- assign n_selected = pubs | where: "selected", true | size -%}
{%- assign years = pubs | group_by: "year" | sort: "name" | reverse -%}
{%- assign first_year = years | last -%}

<div class="pubs-page" id="pubs-page">

<p class="pubs-intro">My complete list of publications since {{ first_year.name }}. You can also find them on <a href="https://scholar.google.com/citations?hl=en&amp;user=GzaiunYAAAAJ">Google Scholar</a> and <a href="https://dblp.org/pid/21/2544.html">DBLP</a>.</p>

<div class="pubs-stats">
  <div class="pubs-stat pubs-stat--total">
    <span class="pubs-stat-value">{{ n_total }}</span>
    <span class="pubs-stat-label">Publications</span>
  </div>
  <div class="pubs-stat">
    <span class="pubs-stat-value">{{ n_journals }}</span>
    <span class="pubs-stat-label"><span class="swatch swatch--journals"></span>Journal articles</span>
  </div>
  <div class="pubs-stat">
    <span class="pubs-stat-value">{{ n_conferences }}</span>
    <span class="pubs-stat-label"><span class="swatch swatch--conferences"></span>Conference papers</span>
  </div>
  <div class="pubs-stat">
    <span class="pubs-stat-value">{{ n_other }}</span>
    <span class="pubs-stat-label"><span class="swatch swatch--other"></span>Workshops, books &amp; other</span>
  </div>
</div>

<figure class="pubs-chart needs-js" aria-labelledby="pubs-chart-title">
  <div class="pubs-chart-head">
    <figcaption id="pubs-chart-title" class="pubs-chart-title">Publications per year</figcaption>
    <ul class="pubs-legend" aria-label="Legend">
      <li><span class="swatch swatch--journals"></span>Journal articles</li>
      <li><span class="swatch swatch--conferences"></span>Conference papers</li>
      <li><span class="swatch swatch--other"></span>Workshops, books &amp; other</li>
    </ul>
  </div>
  <div class="pubs-chart-plot" id="pubs-chart-plot"></div>
  <p class="pubs-chart-hint">Select a year to list its publications.</p>
  <div class="pubs-tooltip" id="pubs-tooltip" role="status" hidden></div>
  <details class="pubs-chart-table">
    <summary>View as table</summary>
    <table id="pubs-year-table">
      <thead>
        <tr><th scope="col">Year</th><th scope="col">Journal articles</th><th scope="col">Conference papers</th><th scope="col">Workshops, books &amp; other</th><th scope="col">Total</th></tr>
      </thead>
      <tbody>
        {%- for y in years %}
        {%- assign cj = 0 -%}{%- assign cc = 0 -%}{%- assign co = 0 -%}
        {%- for p in y.items -%}
          {%- case p.type -%}
            {%- when "journal", "regional" -%}{%- assign cj = cj | plus: 1 -%}
            {%- when "conference" -%}{%- assign cc = cc | plus: 1 -%}
            {%- else -%}{%- assign co = co | plus: 1 -%}
          {%- endcase -%}
        {%- endfor %}
        <tr data-year="{{ y.name }}"><th scope="row">{{ y.name }}</th><td>{{ cj }}</td><td>{{ cc }}</td><td>{{ co }}</td><td>{{ y.items.size }}</td></tr>
        {%- endfor %}
      </tbody>
    </table>
  </details>
</figure>

<div class="pubs-filters needs-js">
  <div class="pubs-chips" role="group" aria-label="Filter by type">
    <button type="button" class="pubs-chip is-active" data-filter="all" aria-pressed="true">All <span class="pubs-chip-count">{{ n_total }}</span></button>
    <button type="button" class="pubs-chip" data-filter="journals" aria-pressed="false"><span class="swatch swatch--journals"></span>Journals <span class="pubs-chip-count">{{ n_journals }}</span></button>
    <button type="button" class="pubs-chip" data-filter="conferences" aria-pressed="false"><span class="swatch swatch--conferences"></span>Conferences <span class="pubs-chip-count">{{ n_conferences }}</span></button>
    <button type="button" class="pubs-chip" data-filter="other" aria-pressed="false"><span class="swatch swatch--other"></span>Workshops, books &amp; other <span class="pubs-chip-count">{{ n_other }}</span></button>
    <button type="button" class="pubs-chip" data-filter="selected" aria-pressed="false"><span class="pubs-star" aria-hidden="true">★</span>Selected <span class="pubs-chip-count">{{ n_selected }}</span></button>
  </div>
  <div class="pubs-search">
    <label for="pubs-search-input" class="visually-hidden">Search publications</label>
    <input type="search" id="pubs-search-input" placeholder="Search by title, author or venue" autocomplete="off">
  </div>
</div>

<div class="pubs-toolbar needs-js">
  <p class="pubs-status" id="pubs-status" aria-live="polite">Showing all {{ n_total }} publications</p>
  <button type="button" class="pubs-year-filter" id="pubs-year-filter" hidden></button>
  <button type="button" class="pubs-toggle-all" id="pubs-toggle-all">Expand all years</button>
</div>

<div class="pubs-list" id="pubs-list">
{%- for y in years %}
  <details class="pub-year" data-year="{{ y.name }}"{% if forloop.first %} open data-default-open{% endif %}>
    <summary>
      <span class="pub-year-label">{{ y.name }}</span>
      <span class="pub-year-count" data-total="{{ y.items.size }}">{{ y.items.size }} {% if y.items.size == 1 %}publication{% else %}publications{% endif %}</span>
    </summary>
    <ol class="pub-items">
    {%- for p in y.items %}
      {%- case p.type -%}
        {%- when "journal", "regional" -%}{%- assign group = "journals" -%}
        {%- when "conference" -%}{%- assign group = "conferences" -%}
        {%- else -%}{%- assign group = "other" -%}
      {%- endcase -%}
      {%- case p.type -%}
        {%- when "journal" -%}{%- assign label = "Journal · JCR" -%}
        {%- when "regional" -%}{%- assign label = "Journal" -%}
        {%- when "conference" -%}{%- assign label = "Conference" -%}
        {%- when "workshop" -%}{%- assign label = "Workshop / shared task" -%}
        {%- when "abstract" -%}{%- assign label = "Abstract" -%}
        {%- when "chapter" -%}{%- assign label = "Book chapter" -%}
        {%- when "outreach" -%}{%- assign label = "Outreach" -%}
        {%- when "book" -%}{%- assign label = "Edited book" -%}
        {%- else -%}{%- assign label = p.type -%}
      {%- endcase -%}
      {%- assign authors = p.authors | escape
          | replace: "Esaú Villatoro-Tello", "@@ME@@"
          | replace: "Esaú Villatoro", "<strong>Esaú Villatoro</strong>"
          | replace: "@@ME@@", "<strong>Esaú Villatoro-Tello</strong>" %}
      <li class="pub" data-group="{{ group }}"{% if p.selected %} data-selected{% endif %}>
        <div class="pub-tags">
          <span class="pub-type"><span class="swatch swatch--{{ group }}"></span>{{ label }}</span>
          {%- if p.selected %}<span class="pub-tag pub-tag--selected"><span class="pubs-star" aria-hidden="true">★</span>Selected</span>{% endif %}
          {%- if p.note %}<span class="pub-tag pub-tag--award">{{ p.note }}</span>{% endif %}
        </div>
        <p class="pub-title">{{ p.title }}</p>
        <p class="pub-authors">{{ authors }}</p>
        <p class="pub-venue">{{ p.venue }}</p>
        {%- if p.web or p.doi or p.arxiv or p.pdf or p.code %}
        <p class="pub-links">
          {%- if p.web %}<a href="{{ p.web }}">Web</a>{% endif %}
          {%- if p.doi %}<a href="https://doi.org/{{ p.doi }}">DOI</a>{% endif %}
          {%- if p.arxiv %}<a href="{{ p.arxiv }}">arXiv</a>{% endif %}
          {%- if p.pdf %}<a href="{{ p.pdf }}">PDF</a>{% endif %}
          {%- if p.code %}<a href="{{ p.code }}">Code</a>{% endif %}
        </p>
        {%- endif %}
      </li>
    {%- endfor %}
    </ol>
  </details>
{%- endfor %}
  <p class="pubs-empty" id="pubs-empty" hidden>No publications match your search.</p>
</div>

</div>
