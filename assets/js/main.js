/**
 * 华晟同款 · 动效脚本 v1.0
 * 包含：数字滚动、滚动淡入、导航滚动、悬浮卡
 */

// ═══════════════════════════════════════
// 1. 数字滚动计数器
// ═══════════════════════════════════════
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        if (!target && target !== 0) return;

        // 已在动画中则不重复触发
        if (el.dataset.animated) return;
        el.dataset.animated = 'true';

        const duration = 1800;
        const start = performance.now();
        const isDecimal = target % 1 !== 0;

        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutExpo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = Math.round(eased * target);

          el.textContent = current.toLocaleString('zh-CN');

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target.toLocaleString('zh-CN');
          }
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

// ═══════════════════════════════════════
// 2. 滚动淡入动画（fade-up）
// ═══════════════════════════════════════
function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════
// 3. 导航栏滚动效果
// ═══════════════════════════════════════
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (y > 80) {
      nav.style.boxShadow = '0 1px 20px rgba(15,23,42,0.08)';
    } else {
      nav.style.boxShadow = 'none';
    }

    lastY = y;
  }, { passive: true });

  // 高亮当前页链接
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ═══════════════════════════════════════
// 4. 平滑滚动到锚点
// ═══════════════════════════════════════
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ═══════════════════════════════════════
// 5. 产品卡片展开（可折叠说明）
// ═══════════════════════════════════════
function initProductToggle() {
  document.querySelectorAll('.product-card__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      if (!panel) return;
      const isOpen = panel.style.maxHeight && panel.style.maxHeight !== '0px';
      panel.style.maxHeight = isOpen ? '0px' : panel.scrollHeight + 'px';
      panel.style.overflow = 'hidden';
      panel.style.transition = 'max-height 0.3s ease';
      btn.querySelector('span').textContent = isOpen ? '展开能力说明' : '收起';
    });
  });
}

// ═══════════════════════════════════════
// 6. 表单提交（模拟）
// ═══════════════════════════════════════
function initForm() {
  const form = document.querySelector('.contact-form form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const original = btn.textContent;
    btn.textContent = '提交中…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ 提交成功';
      btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 2500);
    }, 1200);
  });
}

// ═══════════════════════════════════════
// 7. 产品筛选（产品页）
// ═══════════════════════════════════════
function initProductFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.product-full-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s, transform 0.3s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initFadeUp();
  initNavScroll();
  initSmoothScroll();
  initProductToggle();
  initForm();
  initProductFilter();
});
