window.addEventListener("DOMContentLoaded", () => {
    const demoButtons = document.querySelectorAll(".bookDemoBtn");

    if (demoButtons.length === 0) {
        console.log("❌ No .bookDemoBtn elements found");
        return;
    }

    demoButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            if (!window.Calendly || !Calendly.initPopupWidget) {
                console.log("Calendly script not loaded");
                return;
            }

            Calendly.initPopupWidget({
                url: "https://calendly.com/kaustubh-fexo/30min"
            });
        });
    });
});
