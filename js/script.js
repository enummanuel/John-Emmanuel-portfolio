
/* =========================================
   JOHN EMMANUEL — PORTFOLIO INTERACTIONS
   01. Setup
   02. Scroll Reveal
   03. Mobile Navigation
   04. Sticky Header
   05. Active Navigation Link
   06. Current Year
========================================= */

/* 01. SETUP */

document.body.classList.add("js-enabled");



/* 02. REPEATING SCROLL REVEAL */

const revealSelectors = [
  ".hero-content",
  ".hero-visual",
  ".hero-bottom",
  ".section-kicker",
  ".section-heading",
  ".about-note",
  ".about-details",
  ".resume-card",
  ".project-card",
  ".contact-inner > *"
];

const revealElements = [
  ...new Set(
    revealSelectors.flatMap((selector) =>
      Array.from(document.querySelectorAll(selector))
    )
  )
].filter((element) => element instanceof HTMLElement);

revealElements.forEach((element) => {
  element.classList.add("reveal");
});

/* Stagger sibling elements */

const staggerGroups = [
  ".resume-grid",
  ".projects-grid",
  ".capability-list",
  ".skill-list"
];

staggerGroups.forEach((selector) => {
  document.querySelectorAll(selector).forEach((group) => {
    Array.from(group.children).forEach((child, index) => {
      if (child instanceof HTMLElement) {
        child.style.setProperty(
          "--reveal-delay",
          `${Math.min(index * 120, 360)}ms`
        );
      }
    });
  });
});

/* Repeat animations when elements enter and leave view */

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const element = entry.target;

        if (!(element instanceof HTMLElement)) return;

        if (entry.isIntersecting) {
          element.classList.add("is-visible");
        } else {
          element.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -20px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}



/* 03. MOBILE NAVIGATION */

const navToggle = document.querySelector("#nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

function closeMenu() {
  navMenu?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
}

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");

  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* Close the mobile menu when clicking outside it */

document.addEventListener("click", (event) => {
  if (
    navMenu?.classList.contains("open") &&
    !navMenu.contains(event.target) &&
    !navToggle?.contains(event.target)
  ) {
    closeMenu();
  }
});

/* Close the menu if the screen becomes desktop-sized */

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});


/* 04. STICKY HEADER */

const header = document.querySelector("#header");

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 20);
}

window.addEventListener("scroll", updateHeader, {
  passive: true
});

updateHeader();


/* 05. ACTIVE NAVIGATION LINK */

const pageSections = document.querySelectorAll(
  "main section[id]"
);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const currentId = entry.target.id;

        navLinks.forEach((link) => {
          const isActive =
            link.getAttribute("href") === `#${currentId}`;

          link.classList.toggle("active", isActive);

          if (isActive) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    {
      rootMargin: "-25% 0px -60% 0px",
      threshold: 0
    }
  );

  pageSections.forEach((section) => {
    sectionObserver.observe(section);
  });
}


/* 06. CURRENT YEAR */

const yearElement = document.querySelector("#current-year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}



/* 07. CONTACT FORM — WEB3FORMS */

const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-form-status");
const contactSubmitText = document.querySelector(".contact-submit-text");
const contactSubmitButton = contactForm?.querySelector(
  'button[type="submit"]'
);

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const originalButtonText = "Send Message";

  contactSubmitButton.disabled = true;

  if (contactSubmitText) {
    contactSubmitText.textContent = "Sending...";
  }

  if (contactStatus) {
    contactStatus.textContent = "Sending your message...";
  }

  try {
    const formData = new FormData(contactForm);

    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Message submission failed.");
    }

    contactForm.reset();

    if (contactStatus) {
      contactStatus.textContent =
        "Message sent successfully! Thank you for reaching out.";
    }
  } catch (error) {
    console.error("Contact form error:", error);

    if (contactStatus) {
      contactStatus.textContent =
        "Your message couldn't be sent. Please try again or email me directly at johndanielemmanuel@gmail.com.";
    }
  } finally {
    contactSubmitButton.disabled = false;

    if (contactSubmitText) {
      contactSubmitText.textContent = originalButtonText;
    }
  }
});
