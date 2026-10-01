const guideEntries = [
  { title: 'الأحياء والمناطق', kind: 'المدينة', description: 'ابدأ بهدفك وافهم اختلاف مراحل نمو المدينة.', href: '#districts', terms: 'حي احياء مناطق العبور الجديدة العبور' },
  { title: 'السكن والأسعار', kind: 'العقارات', description: 'مقارنة الأسعار والعروض مع الانتباه للتاريخ والشروط.', href: '#property', terms: 'اسعار سعر عقارات عقار شراء ايجار استثمار كمبوند مشروع' },
  { title: 'دليل الخدمات', kind: 'الخدمات', description: 'فئات الصحة والتعليم والتسوق والخدمات اليومية.', href: '#services', terms: 'خدمات صيدليات مستشفيات عيادات صحة مدارس تعليم مطاعم تسوق اسواق' },
  { title: 'دليل المطورين', kind: 'مقارنة', description: 'خمسة معايير لمراجعة التسليم والإدارة والتعاقد.', href: '#developers', terms: 'مطورين مطور شركة شركات تطوير تسليم ادارة ملاءة تعاقد كثافة' },
  { title: 'المواصلات والوصول', kind: 'التنقل', description: 'المحاور والنقل ووقت الوصول، مع التحقق من التشغيل.', href: '#transport', terms: 'مواصلات نقل قطار كهربائي محاور طريق وصول مسار حركة' },
  { title: 'دليل الشراء', kind: 'قرار السكن', description: 'خمسة أسئلة عملية قبل توقيع أي عقد.', href: '#buying', terms: 'شراء عقد مشروع سكن زيارة تنفيذ ادارة تمويل مواصفات' },
  { title: 'الأسئلة الشائعة', kind: 'معلومات', description: 'إجابات عن اختيار المنطقة والأسعار والخرائط.', href: '#faq', terms: 'اسئلة الفرق العبور الجديدة الخرائط خريطة السعر السعر' },
  { title: 'المصادر والتصحيح', kind: 'عن الدليل', description: 'معلومات مرجعية وطريقة إرسال تصحيح موثّق.', href: '#sources', terms: 'مصادر تصحيح تحديث تواصل معلومة مصدر' }
];

const developerEntries = [...document.querySelectorAll('.developer-card')].map((card) => {
  const title = card.querySelector('h4')?.textContent?.trim() ?? '';
  const description = card.querySelector('.developer-projects')?.textContent?.trim() ?? '';
  return {
    title,
    kind: 'مطور عقاري',
    description,
    href: '#developer-directory',
    terms: card.dataset.search ?? ''
  };
});
const searchableEntries = [...guideEntries, ...developerEntries];

const normalizeArabic = (value) => value
  .toLocaleLowerCase('ar')
  .normalize('NFD')
  .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
  .replace(/[أإآ]/g, 'ا')
  .replace(/ى/g, 'ي')
  .replace(/ة/g, 'ه')
  .trim();

function showSearchResults(rawQuery, sourceForm) {
  const query = rawQuery.trim();
  const panel = document.querySelector('#search-results');
  const heroInput = document.querySelector('#hero-query');
  if (!panel) return;
  if (heroInput && sourceForm?.elements.q !== heroInput) heroInput.value = query;
  panel.replaceChildren();
  if (!query) {
    panel.hidden = true;
    return;
  }
  const normalized = normalizeArabic(query);
  const terms = normalized.split(/\s+/).filter(Boolean);
  const matches = searchableEntries.filter((entry) => {
    const haystack = normalizeArabic(`${entry.title} ${entry.kind} ${entry.description} ${entry.terms}`);
    return terms.every((term) => haystack.includes(term));
  });
  const heading = document.createElement('p');
  heading.className = 'result-heading';
  heading.textContent = matches.length ? `نتائج الدليل عن «${query}»` : `لا توجد نتيجة مباشرة عن «${query}»`;
  panel.append(heading);
  if (!matches.length) {
    const empty = document.createElement('p');
    empty.className = 'result-empty';
    empty.textContent = 'جرّب كلمات مثل: الأحياء، الأسعار، المدارس، المطورون، أو المواصلات.';
    panel.append(empty);
  } else {
    for (const entry of matches) {
      const link = document.createElement('a');
      link.className = 'result-item';
      link.href = entry.href;
      const copy = document.createElement('span');
      const title = document.createElement('strong');
      title.textContent = entry.title;
      const description = document.createElement('small');
      description.textContent = entry.description;
      copy.append(title, description);
      const kind = document.createElement('span');
      kind.className = 'result-kind';
      kind.textContent = entry.kind;
      link.append(copy, kind);
      link.addEventListener('click', () => { panel.hidden = true; });
      panel.append(link);
    }
  }
  panel.hidden = false;
  const url = new URL(window.location.href);
  url.searchParams.set('q', query);
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

document.querySelectorAll('[data-search-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = new FormData(form).get('q')?.toString() ?? '';
    showSearchResults(query, form);
    document.querySelector('#search-results')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

document.querySelectorAll('[data-prefill]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const query = link.dataset.prefill ?? '';
    const input = document.querySelector('#hero-query');
    if (input) input.value = query;
    showSearchResults(query, null);
    document.querySelector('#search-results')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

document.querySelector('[data-focus-search]')?.addEventListener('click', (event) => {
  event.preventDefault();
  const input = document.querySelector('#hero-query');
  input?.focus();
  input?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.querySelectorAll('#mobile-menu nav a').forEach((link) => {
  link.addEventListener('click', () => {
    const menu = document.querySelector('#mobile-menu');
    if (menu) menu.open = false;
  });
});

document.addEventListener('click', (event) => {
  const panel = document.querySelector('#search-results');
  if (panel && !panel.hidden && !event.target.closest('.hero-search') && !panel.contains(event.target)) {
    panel.hidden = true;
  }
});

const initialQuery = new URLSearchParams(window.location.search).get('q');
if (initialQuery) {
  const heroInput = document.querySelector('#hero-query');
  if (heroInput) heroInput.value = initialQuery;
  showSearchResults(initialQuery, null);
}
