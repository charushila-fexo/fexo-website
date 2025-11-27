document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-item");

  // Only track these sections for highlighting
  const navSectionIds = ["proof", "solutions", "demo", "platform", "contact"];
  const sections = navSectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const ACTIVE_CLASS = "active-nav";
  let suppressScroll = false;

  function setActive(id) {
    navLinks.forEach(a => a.classList.remove(ACTIVE_CLASS));
    const el = document.querySelector(`#nav-${id}`);
    if (el) el.classList.add(ACTIVE_CLASS);
  }

  function updateActiveSection() {
    if (suppressScroll) return;

    const midpoint = window.innerHeight / 2;

    let currentSection = sections.find(sec => {
      const rect = sec.getBoundingClientRect();
      return rect.top <= midpoint && rect.bottom >= midpoint;
    });

    if (currentSection) {
      setActive(currentSection.id);
    } else {
      // IF in HOME → remove highlight entirely
      navLinks.forEach(a => a.classList.remove(ACTIVE_CLASS));
    }
  }

  // Highlight on click (without glitches)
  navLinks.forEach(a => {
    a.addEventListener("click", () => {
      const hash = a.getAttribute("href").split("#")[1];
      if (!hash) return;

      setActive(hash);

      suppressScroll = true;
      setTimeout(() => {
        suppressScroll = false;
        updateActiveSection();
      }, 350);
    });
  });

  window.addEventListener("scroll", updateActiveSection);
  window.addEventListener("resize", updateActiveSection);

  updateActiveSection();
});