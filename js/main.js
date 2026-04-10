/* ============================================
   Cave and Creek in Hocking Hills — Main JS
   Vanilla JS: mobile nav, tabs, scroll effects.
   ============================================ */
(function () {
    'use strict';

    // ---------- Mobile nav toggle ----------
    var navToggle = document.querySelector('.nav-toggle');
    var primaryNav = document.getElementById('primary-nav');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', function () {
            var open = primaryNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(open));
        });

        // Close nav when a link is tapped (mobile)
        primaryNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (primaryNav.classList.contains('open')) {
                    primaryNav.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // ---------- Footer year ----------
    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    // ---------- Tabbed cabin section ----------
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var target = btn.getAttribute('data-tab');

            // Deactivate all tabs
            tabBtns.forEach(function (b) {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(function (p) {
                p.classList.remove('active');
            });

            // Activate clicked tab
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            var panel = document.getElementById('panel-' + target);
            if (panel) panel.classList.add('active');
        });
    });

    // ---------- Smooth scroll with header offset ----------
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var header = document.querySelector('.site-header');
                var offset = header ? header.offsetHeight : 0;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ---------- Scroll-triggered fade-in ----------
    if ('IntersectionObserver' in window) {
        var fadeEls = document.querySelectorAll('.section, .parallax-divider');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });

        fadeEls.forEach(function (el) {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // ---------- Sticky header shadow on scroll ----------
    var siteHeader = document.querySelector('.site-header');
    if (siteHeader) {
        var onScroll = function () {
            siteHeader.classList.toggle('scrolled', window.scrollY > 30);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
})();
