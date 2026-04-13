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

    // ---------- Hero logo: remove white bg, tint green ----------
    var heroCanvas = document.getElementById('hero-heading');
    if (heroCanvas && heroCanvas.tagName === 'CANVAS') {
        var img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function () {
            heroCanvas.width = img.naturalWidth;
            heroCanvas.height = img.naturalHeight;
            var ctx = heroCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var imageData = ctx.getImageData(0, 0, heroCanvas.width, heroCanvas.height);
            var d = imageData.data;
            // Target color: white (#ffffff)
            for (var i = 0; i < d.length; i += 4) {
                var r = d[i], g = d[i + 1], b = d[i + 2];
                var brightness = (r + g + b) / 3;
                if (brightness > 200) {
                    d[i + 3] = 0;
                } else {
                    var darkness = 1 - (brightness / 200);
                    d[i] = 255;
                    d[i + 1] = 255;
                    d[i + 2] = 255;
                    d[i + 3] = Math.round(darkness * 255);
                }
            }
            ctx.putImageData(imageData, 0, 0);

            // Draw a second pass with slight offset for outline/glow effect
            var outlineCanvas = document.createElement('canvas');
            outlineCanvas.width = heroCanvas.width;
            outlineCanvas.height = heroCanvas.height;
            var oCtx = outlineCanvas.getContext('2d');

            // Draw dark shadow copies in all directions for outline
            oCtx.shadowColor = 'rgba(0,0,0,0.7)';
            oCtx.shadowBlur = 6;
            for (var ox = -2; ox <= 2; ox += 2) {
                for (var oy = -2; oy <= 2; oy += 2) {
                    oCtx.shadowOffsetX = ox;
                    oCtx.shadowOffsetY = oy;
                    oCtx.drawImage(heroCanvas, 0, 0);
                }
            }
            // Draw the white logo on top
            oCtx.shadowColor = 'transparent';
            oCtx.shadowBlur = 0;
            oCtx.shadowOffsetX = 0;
            oCtx.shadowOffsetY = 0;
            oCtx.drawImage(heroCanvas, 0, 0);

            // Copy result back
            ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
            ctx.drawImage(outlineCanvas, 0, 0);
        };
        img.src = 'logo1.jpg';
    }

    // ---------- Footer logo: remove white bg, tint white ----------
    var footerCanvas = document.getElementById('footer-logo-canvas');
    if (footerCanvas) {
        var fImg = new Image();
        fImg.crossOrigin = 'anonymous';
        fImg.onload = function () {
            footerCanvas.width = fImg.naturalWidth;
            footerCanvas.height = fImg.naturalHeight;
            var fCtx = footerCanvas.getContext('2d');
            fCtx.drawImage(fImg, 0, 0);
            var fData = fCtx.getImageData(0, 0, footerCanvas.width, footerCanvas.height);
            var fd = fData.data;
            for (var i = 0; i < fd.length; i += 4) {
                var brightness = (fd[i] + fd[i + 1] + fd[i + 2]) / 3;
                if (brightness > 200) {
                    fd[i + 3] = 0; // transparent
                } else {
                    var darkness = 1 - (brightness / 200);
                    fd[i] = 255;     // R
                    fd[i + 1] = 255; // G
                    fd[i + 2] = 255; // B
                    fd[i + 3] = Math.round(darkness * 220);
                }
            }
            fCtx.putImageData(fData, 0, 0);
        };
        fImg.src = 'logo1.jpg';
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

    // ---------- Mobile gallery carousel dots ----------
    function setupCarouselDots() {
        if (window.innerWidth > 600) return;
        document.querySelectorAll('.gallery').forEach(function (gallery) {
            // Skip if dots already added
            if (gallery.nextElementSibling && gallery.nextElementSibling.classList.contains('gallery-dots')) return;

            var items = gallery.querySelectorAll('.gallery-item');
            if (items.length < 2) return;

            var dotsWrap = document.createElement('div');
            dotsWrap.className = 'gallery-dots';

            items.forEach(function (_, i) {
                var dot = document.createElement('button');
                dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
                dot.addEventListener('click', function () {
                    items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                });
                dotsWrap.appendChild(dot);
            });

            gallery.parentNode.insertBefore(dotsWrap, gallery.nextSibling);

            // Update active dot on scroll
            var scrollTimeout;
            gallery.addEventListener('scroll', function () {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(function () {
                    var scrollLeft = gallery.scrollLeft;
                    var itemWidth = gallery.offsetWidth;
                    var activeIndex = Math.round(scrollLeft / itemWidth);
                    dotsWrap.querySelectorAll('.gallery-dot').forEach(function (d, j) {
                        d.classList.toggle('active', j === activeIndex);
                    });
                }, 50);
            }, { passive: true });
        });
    }
    setupCarouselDots();

    // Re-setup dots when tabs change
    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setTimeout(setupCarouselDots, 50);
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
