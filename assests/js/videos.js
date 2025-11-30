//document.addEventListener("DOMContentLoaded", () => {
//  const videos = [
//    "assests/videos/Banking&lending.mp4",
//    "assests/videos/Audit&Compliance.mp4",
//    "assests/videos/Insurance_claims.mp4"
//  ];
//
//  let index = 0;
//  const player = document.getElementById("videoPlayer");
//  if (!player) return console.error("Video element not found!");
//
//  // initialize
//  player.src = videos[index];
//  player.load();
//  player.play().catch(e => console.warn("Autoplay blocked or play error:", e));
//  index = (index + 1) % videos.length;
//
//  // When video ends, trigger fade-out and wait for transition to finish
//  player.addEventListener("ended", () => {
//    // add class to start fade-out
//    player.classList.add("fade-out");
//    // wait for CSS transition to complete on opacity
//    const onTransitionEnd = (ev) => {
//      if (ev.propertyName !== "opacity") return;
//      player.removeEventListener("transitionend", onTransitionEnd);
//
//      // swap source AFTER fade-out
//      player.src = videos[index];
//      player.load();
//
//      // try to play, then remove fade-out (fade-in)
//      player.play()
//        .then(() => {
//          // Force a reflow before removing fade-out to ensure transition runs:
//          // read a property to force layout
//          void player.offsetWidth;
//          player.classList.remove("fade-out"); // fades in
//          index = (index + 1) % videos.length;
//        })
//        .catch(err => {
//          console.error("Play error after source swap:", err);
//          // still remove fade to avoid permanent hidden state
//          player.classList.remove("fade-out");
//          index = (index + 1) % videos.length;
//        });
//    };
//
//    player.addEventListener("transitionend", onTransitionEnd);
//  });
//});
