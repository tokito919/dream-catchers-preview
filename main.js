// Мобилно меню, хедър при скрол и появяване на елементите при скрол. Без библиотеки.
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const header = document.querySelector('.site-header');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  // Hero: клишето се изписва буква по буква, задрасква се и излиза истинското послание.
  const heroText = document.querySelector('.hero-text');
  const del = heroText && heroText.querySelector('h1 del');
  if (heroText && del) {
    const reduceHero = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finish = () => {
      heroText.classList.add('typed', 'strike');
      setTimeout(() => heroText.classList.add('go'), 650);
    };
    if (reduceHero) {
      heroText.classList.add('typed', 'strike', 'go');
    } else {
      const text = del.textContent;
      del.textContent = '';
      let i = 0;
      const type = () => {
        del.textContent = text.slice(0, ++i);
        if (i < text.length) setTimeout(type, 38 + Math.random() * 40);
        else setTimeout(finish, 350);
      };
      setTimeout(type, 400);
    }
  }

  // Хедърът се скрива при скрол надолу и се връща при скрол нагоре.
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', y > 8);
      const menuOpen = nav && nav.classList.contains('open');
      header.classList.toggle('hide', !menuOpen && y > 160 && y > lastY);
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Появяване при скрол: групите получават малко закъснение едно след друго.
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const groups = [
    '.section-head', '.page-head .wrap > *', '.split > div',
    '.grid > *', '.rows > li', '.steps > li', '.faq details', '.chips', '.prose > *',
    '.results', '.toc', '.pillar-box', '.post-services', '.cta .wrap > *', '.contact-grid > *'
  ];
  const els = [];
  for (const sel of groups) {
    document.querySelectorAll(sel).forEach((el) => {
      if (el.closest('.hero') || el.classList.contains('reveal')) return;
      const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.matches(sel)) : [el];
      const i = Math.min(siblings.indexOf(el), 6);
      el.style.setProperty('--d', `${i * 0.07}s`);
      el.classList.add('reveal');
      els.push(el);
    });
  }
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((el) => io.observe(el));
})();
