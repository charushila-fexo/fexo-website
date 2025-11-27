document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            btn.classList.remove("opacity-0", "pointer-events-none");
            btn.classList.add("opacity-100");
        } else {
            btn.classList.add("opacity-0", "pointer-events-none");
            btn.classList.remove("opacity-100");
        }
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
