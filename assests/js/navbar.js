document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-item");

  const navSectionIds = ["proof", "solutions", "demo", "platform", "contact"];
  const sections = navSectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const ACTIVE_CLASS = "active-nav";

  let disableScrollHighlight = false;
  let scrollTimeout = null;

  function setActive(id) {
    navLinks.forEach(a => a.classList.remove(ACTIVE_CLASS));
    const el = document.querySelector(`#nav-${id}`);
    if (el) el.classList.add(ACTIVE_CLASS);
  }

  function updateActiveSection() {
    if (disableScrollHighlight) return;

    const midpoint = window.innerHeight / 2;

    let currentSection = sections.find(sec => {
      const rect = sec.getBoundingClientRect();
      return rect.top <= midpoint && rect.bottom >= midpoint;
    });

    if (currentSection) {
      setActive(currentSection.id);
    } else {
      navLinks.forEach(a => a.classList.remove(ACTIVE_CLASS));
    }
  }

  // When a user clicks a nav item — disable scroll-based highlighting
  navLinks.forEach(a => {
    a.addEventListener("click", () => {
      const hash = a.getAttribute("href").split("#")[1];
      if (!hash) return;

      disableScrollHighlight = true;
      setActive(hash);

      // Re-enable after scrolling stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        disableScrollHighlight = false;
        updateActiveSection();
      }, 600); // wait for scroll to complete
    });
  });

  // Scroll listener
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      disableScrollHighlight = false;
      updateActiveSection();
    }, 150);

    if (!disableScrollHighlight) {
      updateActiveSection();
    }
  });

  window.addEventListener("resize", updateActiveSection);

  updateActiveSection();
});
