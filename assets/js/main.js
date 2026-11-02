/* ==========================================================================
   MOHAN PRASAD N — Portfolio JavaScript
   • Red Circle Dot Mouse Pointer
   • Scroll-Cinematic 3D Color Rotate (Starts straight & small, grows & rotates)
   • 2-Column Skills with Interactive Bouncing Logos Playground
   • Scroll-Scrub Word-by-Word Color Fill
   • Fixed Dropdown Navigation
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Utility Helpers
     ------------------------------------------------------------------ */
  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* ==================================================================
     1. RED CIRCLE DOT MOUSE POINTER
     ================================================================== */
  function initRedDotCursor() {
    var dot = document.getElementById('cursorDot');
    if (!dot) return;

    var curX = window.innerWidth / 2;
    var curY = window.innerHeight / 2;
    var targetX = curX;
    var targetY = curY;
    var isHover = false;
    var isVisible = false;

    window.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
      }
    });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      isVisible = false;
    });

    document.addEventListener('mouseenter', function () {
      dot.style.opacity = '1';
      isVisible = true;
    });

    // Hover scale effect on interactive items
    var interactives = 'a, button, input, textarea, .dropdown-bar, .bounce-badge, .copy-btn, .project-card, .footer-symbol-btn, .skill-card-item, .about-cv-btn';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactives)) {
        isHover = true;
        dot.classList.add('is-hovering');
      }
    });

    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactives)) {
        isHover = false;
        dot.classList.remove('is-hovering');
      }
    });

    // Smooth physics loop for the red dot
    function renderCursor() {
      curX = lerp(curX, targetX, 0.45);
      curY = lerp(curY, targetY, 0.45);
      dot.style.left = curX + 'px';
      dot.style.top = curY + 'px';
      requestAnimationFrame(renderCursor);
    }
    renderCursor();
  }

  /* ==================================================================
     2. DROPDOWN NAVIGATION (Always fixed and visible at the top)
     ================================================================== */
  function initDropdown() {
    var wrap = document.getElementById('navDropdown');
    var bar = document.getElementById('dropdownBar');
    if (!wrap || !bar) return;

    bar.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
      }
    });

    wrap.querySelectorAll('.dd-link').forEach(function (link) {
      link.addEventListener('click', function () {
        wrap.classList.remove('open');
      });
    });
  }

  /* ==================================================================
     3. CINEMATIC HERO SCROLL
     • SOFTWARE ENGINEER is solid, bold black in the background
     • Avatar is FIRST straight (rotateY = 0) and small size, slightly up
       overlapping the bottom of ENGINEER (matching reference screenshot)
     • When scrolling: smoothly rotates in 3D (360 flip), gets bigger & gains full color
     • Docks in the CENTER of the About page, flanked by left text and right text
     ================================================================== */
  function initCinematicScroll() {
    var wrapper = document.querySelector('.cinematic-wrapper');
    var avatar = document.getElementById('cinemaAvatar');
    var avatarImg = avatar ? avatar.querySelector('img') : null;
    var aboutOverlay = document.getElementById('aboutOverlay');
    var heroTitle = document.querySelector('.hero-center-title');
    var heroBottomBar = document.getElementById('heroBarBottom');

    if (!wrapper || !avatar) return;

    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    function update() {
      var isDesktop = window.innerWidth > 980;

      // On mobile devices (<= 980px), layout switches to native flow without sticky entrapment
      if (!isDesktop) {
        avatar.style.transform = '';
        if (avatarImg) avatarImg.style.filter = '';
        if (heroTitle) heroTitle.style.opacity = '1';
        if (heroBottomBar) heroBottomBar.style.opacity = '1';
        if (aboutOverlay) {
          aboutOverlay.style.opacity = '1';
          aboutOverlay.classList.add('is-visible');
        }
        return;
      }

      var rect = wrapper.getBoundingClientRect();
      var wrapperHeight = wrapper.offsetHeight;
      var viewportH = window.innerHeight;

      var scrolled = -rect.top;
      var totalScroll = wrapperHeight - viewportH;
      var progress = clamp(scrolled / totalScroll, 0, 1);

      /* Transition progression:
         • At Home: Avatar is slightly up, comfortably overlapping the bottom
           letters of ENGINEER, straight (0deg), small size (170x225),
           black-faded monochrome, exactly matching the Framer reference.
         • As user scrolls: Flips smoothly once in 3D (0 -> 360deg), gains full color,
           expands smoothly, and docks right in the CENTER of the About page.
         • About page: Centered avatar flanked by left wording and right wording. */
      var transProgress = clamp(progress / 0.65, 0, 1);

      // Start position (Home): slightly up so top overlaps ENGINEER
      var startY = isDesktop
        ? Math.max(90, viewportH * 0.5 - 180)
        : Math.max(70, viewportH * 0.5 - 130);

      // Target scale: desktop image is enlarged and docked (2.36); mobile scales to fit top slot (0.82)
      var targetScale = isDesktop ? 2.36 : 0.82;
      var scale = lerp(1.0, targetScale, transProgress);

      // Target Y position (About):
      // On desktop: elevated a bit above the bottom (84px clearance), exactly aligned with left & right columns
      // On mobile: smoothly docks into the top spacer slot (center ~145px from top) so text flows below without overlap
      var targetY = isDesktop
        ? ((viewportH * 0.5) - 84 - (targetScale * 225 * 0.5))
        : (145 - (viewportH * 0.5));

      var translateY = lerp(startY, targetY, transProgress);

      // Avatar remains centered horizontally in both Home and About
      var translateX = 0;

      // Flips smoothly once in 3D through scrolling
      var rotY = transProgress * 360;
      var rotX = Math.sin(transProgress * Math.PI) * 8;

      // Gains full vibrant color
      var grayscaleVal = lerp(100, 0, transProgress);
      var contrastVal = lerp(1.18, 1.0, transProgress);
      var brightnessVal = lerp(0.92, 1.0, transProgress);

      // Apply transform with 3D perspective centered
      avatar.style.transform =
        'translate(-50%, -50%) translate3d(' + translateX + 'px, ' + translateY.toFixed(1) + 'px, 0) rotateX(' + rotX.toFixed(1) + 'deg) rotateY(' + rotY.toFixed(1) + 'deg) scale(' + scale.toFixed(2) + ')';

      // Apply dynamic color filtering
      if (avatarImg) {
        avatarImg.style.filter =
          'grayscale(' + grayscaleVal + '%) contrast(' + contrastVal + ') brightness(' + brightnessVal + ')';
      }

      // Hero background title fadeout as we scroll to about
      if (heroTitle) {
        var titleOpacity = progress <= 0.28 ? 1 : progress <= 0.55 ? lerp(1, 0, (progress - 0.28) / 0.27) : 0;
        heroTitle.style.opacity = titleOpacity;
      }

      // Hero bottom copyright bar fade
      if (heroBottomBar) {
        var barOpacity = progress <= 0.2 ? 1 : progress <= 0.38 ? lerp(1, 0, (progress - 0.2) / 0.18) : 0;
        heroBottomBar.style.opacity = barOpacity;
      }

      // About overlay fade in (docking story around the avatar)
      if (aboutOverlay) {
        if (progress >= 0.45) {
          var aboutT = (progress - 0.45) / 0.25;
          var op = clamp(aboutT, 0, 1);
          aboutOverlay.style.opacity = op;
          if (op >= 0.2) {
            aboutOverlay.classList.add('is-visible');
          }
        } else {
          aboutOverlay.style.opacity = 0;
          aboutOverlay.classList.remove('is-visible');
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ==================================================================
     4. INTERACTIVE BOUNCING SKILL LOGOS PLAYGROUND
     Badges float and dynamically jump / bounce away from mouse pointer
     with elastic spring collisions inside the right container!
     ================================================================== */
  function initBouncingBadges() {
    var arena = document.getElementById('bouncingArena');
    if (!arena) return;

    var badgeEls = arena.querySelectorAll('.bounce-badge');
    if (!badgeEls.length) return;

    var badges = [];
    var arenaRect = arena.getBoundingClientRect();
    var arenaW = arena.clientWidth || 360;
    var arenaH = arena.clientHeight || 500;

    var mouseX = -1000;
    var mouseY = -1000;

    // Initialize badges with staggered positions
    badgeEls.forEach(function (el, i) {
      var cols = 2;
      var row = Math.floor(i / cols);
      var col = i % cols;

      var startX = 20 + col * 155 + (Math.random() * 20 - 10);
      var startY = 20 + row * 65 + (Math.random() * 20 - 10);

      var badgeData = {
        el: el,
        x: clamp(startX, 10, arenaW - 140),
        y: clamp(startY, 10, arenaH - 50),
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        w: 125,
        h: 40,
        angle: 0,
        vAngle: 0,
        seed: i * 1.3
      };
      badges.push(badgeData);
    });

    // Update measured dimensions
    function measureArena() {
      arenaW = arena.clientWidth;
      arenaH = arena.clientHeight;
      badges.forEach(function (b) {
        b.w = b.el.offsetWidth || 120;
        b.h = b.el.offsetHeight || 38;
      });
    }
    setTimeout(measureArena, 150);
    window.addEventListener('resize', measureArena);

    // Track mouse relative to arena
    arena.addEventListener('mousemove', function (e) {
      var rect = arena.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    arena.addEventListener('mouseleave', function () {
      mouseX = -1000;
      mouseY = -1000;
    });

    // Touch support on mobile (passive so page scroll is smooth)
    arena.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches[0]) {
        var rect = arena.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    arena.addEventListener('touchend', function () {
      setTimeout(function () {
        mouseX = -1000;
        mouseY = -1000;
      }, 350);
    }, { passive: true });

    // Click on badge triggers a playful bounce jump!
    badges.forEach(function (b) {
      b.el.addEventListener('click', function () {
        b.vy = -7.5 - Math.random() * 4;
        b.vx = (Math.random() - 0.5) * 8;
        b.vAngle = (Math.random() - 0.5) * 20;
      });
    });

    // Hovering on Box 1 skill items triggers a jump on corresponding badge in Box 2
    document.querySelectorAll('.skill-row-item').forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        var badgeName = row.getAttribute('data-badge');
        badges.forEach(function (b) {
          if (b.el.getAttribute('data-name') === badgeName) {
            b.el.classList.add('highlighted');
            b.vy = -6.5;
            b.vx = (Math.random() - 0.5) * 6;
            b.vAngle = (Math.random() - 0.5) * 16;
          }
        });
      });
      row.addEventListener('mouseleave', function () {
        var badgeName = row.getAttribute('data-badge');
        badges.forEach(function (b) {
          if (b.el.getAttribute('data-name') === badgeName) {
            b.el.classList.remove('highlighted');
          }
        });
      });
    });

    // Physics Animation Loop
    var lastTime = performance.now();

    function physicsLoop(now) {
      var dt = clamp((now - lastTime) / 1000, 0, 0.05);
      lastTime = now;

      badges.forEach(function (b, idx) {
        // 1. Natural gentle floating buoyancy
        b.vy += Math.sin(now * 0.002 + b.seed) * 0.06;
        b.vx += Math.cos(now * 0.0018 + b.seed) * 0.04;

        // 2. Mouse pointer repulsion & jump reaction
        var centerX = b.x + b.w / 2;
        var centerY = b.y + b.h / 2;
        var dx = centerX - mouseX;
        var dy = centerY - mouseY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var repelRadius = 90;

        if (dist < repelRadius && dist > 1) {
          var force = ((repelRadius - dist) / repelRadius) * 7.5;
          b.vx += (dx / dist) * force;
          b.vy += (dy / dist) * force - 1.2; // Extra upward jump lift!
          b.vAngle += (dx > 0 ? 1 : -1) * force * 1.5;
        }

        // 3. Apply velocities
        b.x += b.vx;
        b.y += b.vy;
        b.angle += b.vAngle;

        // 4. Elastic boundary collisions with arena walls
        var bounceDamping = 0.72;
        if (b.x <= 4) {
          b.x = 4;
          b.vx = -b.vx * bounceDamping;
        } else if (b.x + b.w >= arenaW - 4) {
          b.x = arenaW - b.w - 4;
          b.vx = -b.vx * bounceDamping;
        }

        if (b.y <= 4) {
          b.y = 4;
          b.vy = -b.vy * bounceDamping;
        } else if (b.y + b.h >= arenaH - 4) {
          b.y = arenaH - b.h - 4;
          b.vy = -b.vy * bounceDamping;
        }

        // 5. Friction / damping
        b.vx *= 0.94;
        b.vy *= 0.94;
        b.vAngle *= 0.88;
        b.angle = clamp(b.angle, -25, 25);

        // 6. Render
        b.el.style.transform =
          'translate3d(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px, 0) rotate(' + b.angle.toFixed(1) + 'deg)';
      });

      requestAnimationFrame(physicsLoop);
    }

    requestAnimationFrame(physicsLoop);
  }

  /* ==================================================================
     5. SKILLS SCROLL LIGHT — Items start faded light, turn solid black
        as the skills card scrolls into the viewport, one by one.
     ================================================================== */
  function initSkillsScrollLight() {
    var wrap = document.getElementById('skillsListWrap');
    if (!wrap) return;

    var rows = Array.from(wrap.querySelectorAll('.skill-row-item'));
    if (!rows.length) return;

    var ticking = false;

    function update() {
      var wrapRect = wrap.getBoundingClientRect();
      var winH = window.innerHeight;

      // Start lighting when the top of the list enters at 85% of viewport
      var enterY = winH * 0.85;
      // Fully lit when the bottom of the list reaches 40% of viewport
      var exitY = winH * 0.40;

      var totalH = wrapRect.height;
      var travelled = enterY - wrapRect.top;
      var progress = clamp(travelled / (totalH + (enterY - exitY)), 0, 1);

      var litCount = Math.round(progress * rows.length);

      rows.forEach(function (row, i) {
        if (i < litCount) {
          row.classList.add('is-lit');
        } else {
          row.classList.remove('is-lit');
        }
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ==================================================================
     6. SCROLL-SCRUB COLOR EFFECT FOR SKILLS STATEMENTS
     ================================================================== */
  function initScrollScrubSkills() {
    var targets = document.querySelectorAll('[data-scroll-color]');
    if (!targets.length) return;

    targets.forEach(function (el) {
      var raw = el.textContent.trim();
      var words = raw.split(/\s+/);
      el.innerHTML = '';
      words.forEach(function (w, idx) {
        var span = document.createElement('span');
        span.className = 'scrub-word';
        span.textContent = w + (idx < words.length - 1 ? ' ' : '');
        el.appendChild(span);
      });
    });

    var ticking = false;

    function checkColorScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        updateWordColors();
        ticking = false;
      });
    }

    function updateWordColors() {
      var winH = window.innerHeight;

      targets.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var spans = el.querySelectorAll('.scrub-word');
        if (!spans.length) return;

        var enterY = winH * 0.9;
        var fullY = winH * 0.35;
        var progress = clamp((enterY - rect.top) / (enterY - fullY), 0, 1);

        var totalWords = spans.length;
        var coloredCount = Math.floor(progress * totalWords);

        spans.forEach(function (span, i) {
          if (i <= coloredCount && progress > 0.02) {
            span.classList.add('is-colored');
          } else {
            span.classList.remove('is-colored');
          }
        });
      });
    }

    window.addEventListener('scroll', checkColorScroll, { passive: true });
    window.addEventListener('resize', checkColorScroll, { passive: true });
    updateWordColors();
  }

  /* ==================================================================
     6. SCROLL REVEAL (Projects, Timeline, Contact)
     ================================================================== */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll(
      '.project-card, .contact-black-box, .footer-manifesto, .skills-single-card'
    );
    if (!revealEls.length) return;

    revealEls.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function (el, index) {
      el.style.transitionDelay = (index % 4) * 0.08 + 's';
      observer.observe(el);
    });
  }

  /* ==================================================================
     8. MILESTONES TIMELINE — reveal items + scroll-driven spine fill
     ================================================================== */
  function initTimeline() {
    var track = document.getElementById('tlTrack');
    var fill = document.getElementById('tlFill');
    if (!track || !fill) return;
    var items = Array.from(track.querySelectorAll('.tl-item'));

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      items.forEach(function (it) { io.observe(it); });
    } else {
      items.forEach(function (it) { it.classList.add('is-visible'); });
    }

    var ticking = false;
    function update() {
      ticking = false;
      var rect = track.getBoundingClientRect();
      var probe = window.innerHeight * 0.55;           // reading line
      var spineTop = rect.top + 12;
      var h = Math.max(0, Math.min(rect.height - 24, probe - spineTop));
      fill.style.height = h + 'px';
      var best = null, bestDist = Infinity;
      items.forEach(function (it) {
        var node = it.querySelector('.tl-node');
        var r = node.getBoundingClientRect();
        it.classList.toggle('is-reached', r.top + r.height / 2 <= probe);
        var cr = it.querySelector('.tl-card').getBoundingClientRect();
        var d = Math.abs((cr.top + cr.height / 2) - window.innerHeight * 0.5);
        if (d < bestDist) { bestDist = d; best = it; }
      });
      items.forEach(function (it) {
        it.querySelector('.tl-card').classList.toggle('is-active', it === best);
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ==================================================================
     7. COPY BUTTONS
     ================================================================== */
  function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var text = btn.getAttribute('data-copy');
        if (!text) return;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            showToast('Copied to clipboard: ' + text);
            btn.textContent = 'Copied!';
            setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
          });
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast('Copied to clipboard: ' + text);
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Copy'; }, 2000);
        }
      });
    });
  }

  /* ==================================================================
     8. CONTACT FORM
     ================================================================== */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll('.input-field, .input-field-dark');
      var name = fields[0] ? fields[0].value.trim() : '';
      var email = fields[1] ? fields[1].value.trim() : '';
      var message = fields[2] ? fields[2].value.trim() : '';

      var subject = encodeURIComponent('Portfolio Contact from ' + name);
      var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);

      window.location.href = 'mailto:mohanprasad05sarala@gmail.com?subject=' + subject + '&body=' + body;
      showToast('Opening your email client...');
    });
  }

  /* ==================================================================
     9. SMOOTH SCROLL & BACK TO TOP
     Special handling for #about — it's inside the cinematic-wrapper
     sticky stage, so scrollIntoView doesn't work. We must scroll to
     the right offset within the 280vh wrapper to trigger the about overlay.
     ================================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        e.preventDefault();

        // Special case: About is inside the sticky cinematic wrapper
        if (targetId === '#about') {
          if (window.innerWidth <= 980) {
            var aboutEl = document.querySelector('#about');
            if (aboutEl) {
              aboutEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
          }
          var wrapper = document.querySelector('.cinematic-wrapper');
          if (wrapper) {
            var wrapperTop = wrapper.getBoundingClientRect().top + window.pageYOffset;
            var wrapperHeight = wrapper.offsetHeight;
            var viewportH = window.innerHeight;
            var totalScroll = wrapperHeight - viewportH;
            // Scroll to ~70% through the cinematic wrapper so the about overlay is fully visible
            var aboutScrollTarget = wrapperTop + totalScroll * 0.72;
            window.scrollTo({ top: aboutScrollTarget, behavior: 'smooth' });
          }
          return;
        }

        // Special case: Home — scroll to top
        if (targetId === '#home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        var target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    var btt = document.getElementById('backToTopBtn');
    if (btt) {
      btt.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ==================================================================
     10. TOAST NOTIFICATIONS
     ================================================================== */
  function showToast(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 2800);
  }

  /* ==================================================================
     11. RESUME PREVIEW MODAL
     ================================================================== */
  function initResumeModal() {
    var modal = document.getElementById('resumeModal');
    var closeBtn = document.getElementById('resumeCloseBtn');
    if (!modal) return;

    function openModal() {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    // Attach to all resume buttons across About section, footer, etc.
    document.querySelectorAll('.js-open-resume, #aboutResumeBtn, #footerResumeBtn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Close on overlay click (outside the modal box)
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  /* ==================================================================
     INITIALIZATION
     ================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    // Real-time year in hero copyright
    var yearEl = document.getElementById('heroCopyright');
    if (yearEl) {
      yearEl.textContent = '\u00a9' + new Date().getFullYear();
    }

    // Real-time year in footer
    var footerYearEl = document.getElementById('footerYear');
    if (footerYearEl) {
      footerYearEl.textContent = new Date().getFullYear();
    }
    var footerCopyYearEl = document.getElementById('footerCopyYear');
    if (footerCopyYearEl) {
      footerCopyYearEl.textContent = new Date().getFullYear();
    }

    initRedDotCursor();
    initDropdown();
    initCinematicScroll();
    initBouncingBadges();
    initSkillsScrollLight();
    initScrollScrubSkills();
    initTimeline();
    initScrollReveal();
    initCopyButtons();
    initContactForm();
    initSmoothScroll();
    initResumeModal();
  });

})();
