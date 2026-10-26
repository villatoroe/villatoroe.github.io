---
layout: page
title: Teaching Activities
subtitle: Teaching and supervision
css:
  - "/assets/css/index.css"
  - "/assets/css/supervision.css"
js:
  - "/assets/js/supervision.js"
---

<hr>
### Teaching

The next table shows the details of the courses I had under my responsibility at [UAM-C](https://www.cua.uam.mx/). The first column indicates the corresponding academic program ([LTSI](https://www.cua.uam.mx/oferta-educativa/licenciaturas/tecnologias-y-sistemas-de-informacion), [MADIC](https://www.cua.uam.mx/oferta-educativa/posgrados/maestria-en-diseno-informacion-y-comunicacion), [PCNI](https://www.cua.uam.mx/oferta-educativa/posgrados/posgrado-en-ciencias-naturales-e-ingenieria), the second column depicts the course name, the third column provides a link to the syllabus (when available) and the fourth column indicates the academic period in which I taught the corresponding course.


<style>
  table {
    margin-left: auto;
    margin-right: auto;
    border: 1px solid black;
    border-collapse: collapse;
    padding: 10px;
  }
  th, td {
    border: 1px solid black;
    padding: 10px;
    text-align: center;
  }
</style>

<table border="1" cellpadding="10" cellspacing="0">
  <thead>
    <tr>
      <th>Program</th>
      <th>Course Name</th>
      <th>Syllabus</th>
      <th>Academic Period</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="6">LTSI</td>
      <td>Artificial Intelligence I</td>
      <td><a href="http://dccd.cua.uam.mx/archivos/PDFprogramas/tecnologias/450208.pdf">link</a></td>
      <td>Autumn 2012, Autumn 2016, Autumn 2018</td>
    </tr>
    <tr>
      <td>Artificial Intelligence II (Machine Learning)</td>
      <td>-</td>
      <td>Winter 2013, Autumn 2014, Autumn 2015, Winter 2015, Summer 2016</td>
    </tr>
    <tr>
      <td>Software Engineering Lab. (I-IV)</td>
      <td><a href="http://dccd.cua.uam.mx/archivos/PDFprogramas/tecnologias/450207.pdf">link</a></td>
      <td>Summer 2013, Summer 2014, Summer 2015, Winter 2016, Autumn 2016, Winter 2017, Autumn 2017, Winter 2018</td>
    </tr>
    <tr>
      <td>Fundamentals of Programming</td>
      <td><a href="http://dccd.cua.uam.mx/archivos/PDFprogramas/tecnologias/460005.pdf">link</a></td>
      <td>Autumn 2013, Winter 2014, Winter 2019, Winter 2020</td>
    </tr>
    <tr>
      <td>Data Structures</td>
      <td><a href="http://dccd.cua.uam.mx/archivos/PDFprogramas/tecnologias/460009.pdf">link</a></td>
      <td>Summer 2017, Summer 2018</td>
    </tr>
    <tr>
      <td>Introduction to Logical Thinking</td>
      <td><a href="http://dccd.cua.uam.mx/archivos/PDFprogramas/tecnologias/450203.pdf">link</a></td>
      <td>Autumn 2012</td>
    </tr>
    <tr>
      <td rowspan="2">MADIC</td>
      <td>Social Networks Analysis</td>
      <td><a href="http://escritura.cua.uam.mx/archivos_Madic/analisis_redes_sociales.pdf">link</a></td>
      <td>Winter 2019</td>
    </tr>
    <tr>
      <td>Natural Language Processing</td>
      <td>-</td>
      <td>Winter 2014, Winter 2015, Winter 2016, Winter 2017, Winter 2018</td>
    </tr>    
    <tr>
      <td rowspan="3">PCNI</td>
      <td>Research Seminar (I-VII)</td>
      <td>-</td>
      <td>Winter 2016, Summer 2016, Autumn 2016, Winter 2017, Summer 2017, Autumn 2017</td>
    </tr>
    <tr>
      <td>Doctoral Research Project (I-XII)</td>
      <td>-</td>
      <td>Winter 2018, Summer 2018, Autumn 2018, Winter 2019, Summer 2019, Autumn 2019, Winter 2020, Summer 2020, Autumn 2020</td>
    </tr>
    <tr>
      <td>Selected topics (Speech and Signal Processing)</td>
      <td>-</td>
      <td>Summer 2017</td>
    </tr>
  </tbody>
</table>

<hr>

### Supervision

{%- comment -%}
  Generated from _data/supervision.yml. To add a thesis, add an entry to that file.
{%- endcomment -%}
{%- assign sup = site.data.supervision -%}
{%- assign sup_phd = sup | where: "level", "phd" -%}
{%- assign sup_master = sup | where: "level", "master" -%}
{%- assign sup_bachelor = sup | where: "level", "bachelor" -%}
{%- assign sup_ongoing = sup | where: "status", "ongoing" -%}
{%- assign phd_ongoing = sup_phd | where: "status", "ongoing" | size -%}
{%- assign n_students = 0 -%}{%- for t in sup -%}{%- assign n_students = n_students | plus: t.students.size -%}{%- endfor -%}
{%- assign n_master_students = 0 -%}{%- for t in sup_master -%}{%- assign n_master_students = n_master_students | plus: t.students.size -%}{%- endfor %}

<div class="sup-page" id="sup-page">

<p class="sup-intro">Theses I have supervised or co-supervised at the bachelor's, master's and PhD levels, together with the publications derived from them.</p>

<div class="sup-stats">
  <div class="sup-stat sup-stat--total">
    <span class="sup-stat-value">{{ n_students }}</span>
    <span class="sup-stat-label">Students supervised</span>
  </div>
  <div class="sup-stat">
    <span class="sup-stat-value">{{ sup_phd.size }}</span>
    <span class="sup-stat-label"><span class="sup-dot sup-dot--phd"></span>PhD students{% if phd_ongoing > 0 %} · {{ phd_ongoing }} ongoing{% endif %}</span>
  </div>
  <div class="sup-stat">
    <span class="sup-stat-value">{{ n_master_students }}</span>
    <span class="sup-stat-label"><span class="sup-dot sup-dot--master"></span>Master's students · {{ sup_master.size }} theses</span>
  </div>
  <div class="sup-stat">
    <span class="sup-stat-value">{{ sup_bachelor.size }}</span>
    <span class="sup-stat-label"><span class="sup-dot sup-dot--bachelor"></span>Bachelor's students</span>
  </div>
</div>

<figure class="sup-chart sup-needs-js" aria-labelledby="sup-chart-title">
  <div class="sup-chart-head">
    <figcaption id="sup-chart-title" class="sup-chart-title">Theses over time</figcaption>
    <ul class="sup-legend" aria-label="Legend">
      <li><span class="sup-key sup-key--done"></span>Completed</li>
      <li><span class="sup-key sup-key--ongoing"></span>Ongoing (expected graduation)</li>
    </ul>
  </div>
  <div class="sup-chart-plot" id="sup-chart-plot"></div>
  <p class="sup-chart-hint">Each dot is one thesis, placed at its graduation date. Select a dot to see it below.</p>
  <div class="sup-tooltip" id="sup-tooltip" role="status" hidden></div>
</figure>

<div class="sup-filters sup-needs-js" role="group" aria-label="Filter theses">
  <button type="button" class="sup-chip is-active" data-filter="all" aria-pressed="true">All <span class="sup-chip-count">{{ sup.size }}</span></button>
  <button type="button" class="sup-chip" data-filter="phd" aria-pressed="false"><span class="sup-dot sup-dot--phd"></span>PhD <span class="sup-chip-count">{{ sup_phd.size }}</span></button>
  <button type="button" class="sup-chip" data-filter="master" aria-pressed="false"><span class="sup-dot sup-dot--master"></span>Master's <span class="sup-chip-count">{{ sup_master.size }}</span></button>
  <button type="button" class="sup-chip" data-filter="bachelor" aria-pressed="false"><span class="sup-dot sup-dot--bachelor"></span>Bachelor's <span class="sup-chip-count">{{ sup_bachelor.size }}</span></button>
  <button type="button" class="sup-chip" data-filter="ongoing" aria-pressed="false"><span class="sup-key sup-key--ongoing"></span>Ongoing <span class="sup-chip-count">{{ sup_ongoing.size }}</span></button>
</div>

{%- assign levels = "phd|PhD students,master|Master's students,bachelor|Bachelor's students" | split: "," %}
{%- for lv in levels %}
{%- assign lv_key = lv | split: "|" | first -%}
{%- assign lv_label = lv | split: "|" | last -%}
{%- assign theses = sup | where: "level", lv_key %}
<section class="sup-level" data-level="{{ lv_key }}">
  <h4 class="sup-level-title"><span class="sup-dot sup-dot--{{ lv_key }}"></span>{{ lv_label }} <span class="sup-level-count">{{ theses.size }} {% if theses.size == 1 %}thesis{% else %}theses{% endif %}</span></h4>
  <div class="sup-grid">
  {%- for t in theses %}
    <article class="sup-card" id="sup-{{ lv_key }}-{{ forloop.index }}" data-level="{{ lv_key }}" data-status="{{ t.status }}" data-year="{{ t.year }}" data-month="{{ t.month }}" data-date="{{ t.date }}" data-names="{{ t.students | join: ', ' | escape }}" data-thesis="{{ t.thesis | default: t.description | escape }}">
      <div class="sup-card-top">
        {%- if t.status == "ongoing" %}
        <span class="sup-badge sup-badge--ongoing"><span class="sup-key sup-key--ongoing"></span>Ongoing · expected {{ t.date }}</span>
        {%- else %}
        <span class="sup-badge"><span class="sup-key sup-key--done sup-key--{{ lv_key }}"></span>{{ t.date }}</span>
        {%- endif %}
        <span class="sup-inst">{{ t.institution }}</span>
      </div>
      <p class="sup-names">{{ t.students | join: ", " }}</p>
      {%- if t.thesis %}
      <p class="sup-thesis">{{ t.thesis }}</p>
      {%- endif %}
      {%- if t.thesis_es %}
      <p class="sup-thesis-es" lang="es">{{ t.thesis_es }}</p>
      {%- endif %}
      {%- if t.description %}
      <p class="sup-desc">{{ t.description }}</p>
      {%- endif %}
      {%- if t.publications %}
      <ul class="sup-pubs" aria-label="Related publications">
        {%- for p in t.publications %}
        <li>{% if p.url %}<a href="{{ p.url }}">{{ p.title }}</a>{% else %}{{ p.title }}{% endif %} <span class="sup-pub-venue">{{ p.venue }}</span></li>
        {%- endfor %}
      </ul>
      {%- endif %}
    </article>
  {%- endfor %}
  </div>
</section>
{%- endfor %}

</div>
