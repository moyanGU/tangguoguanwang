const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress span");
const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  if (progress) progress.style.width = `${Math.min(ratio * 100, 100)}%`;
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    mobileNav.hidden = false;
    mobileNav.classList.toggle("is-open", !open);
    if (open) mobileNav.hidden = true;
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("is-open");
      mobileNav.hidden = true;
    });
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const heroVideo = document.querySelector("[data-hero-video]");
const heroVideoToggle = document.querySelector("[data-video-toggle]");
if (heroVideo && reducedMotion.matches) heroVideo.pause();

if (heroVideo && heroVideoToggle) {
  const syncVideoToggle = () => {
    const playing = !heroVideo.paused;
    heroVideoToggle.dataset.playing = String(playing);
    heroVideoToggle.setAttribute("aria-label", playing ? "Pause showreel" : "Play showreel");
  };

  heroVideo.addEventListener("play", syncVideoToggle);
  heroVideo.addEventListener("pause", syncVideoToggle);
  heroVideoToggle.addEventListener("click", () => {
    if (heroVideo.paused) void heroVideo.play();
    else heroVideo.pause();
  });
  syncVideoToggle();
}

const featureVideo = document.querySelector("[data-feature-video]");
const featurePlayButton = document.querySelector("[data-feature-play]");
const featureSoundButton = document.querySelector("[data-feature-sound]");

if (featureVideo && featurePlayButton && featureSoundButton) {
  const playLabel = featurePlayButton.querySelector("[data-feature-play-label]");
  const soundLabel = featureSoundButton.querySelector("[data-feature-sound-label]");

  const syncFeatureControls = () => {
    const playing = !featureVideo.paused;
    const muted = featureVideo.muted;
    featurePlayButton.dataset.playing = String(playing);
    featurePlayButton.setAttribute("aria-label", playing ? "Pause featured video" : "Play featured video");
    featurePlayButton.title = playing ? "Pause featured video" : "Play featured video";
    featureSoundButton.dataset.muted = String(muted);
    featureSoundButton.setAttribute("aria-label", muted ? "Turn featured video sound on" : "Turn featured video sound off");
    featureSoundButton.title = muted ? "Turn featured video sound on" : "Turn featured video sound off";
    if (playLabel) playLabel.textContent = playing ? "Pause" : "Play";
    if (soundLabel) soundLabel.textContent = muted ? "Sound on" : "Sound off";
  };

  featurePlayButton.addEventListener("click", () => {
    if (featureVideo.paused) void featureVideo.play();
    else featureVideo.pause();
  });

  featureSoundButton.addEventListener("click", () => {
    featureVideo.muted = !featureVideo.muted;
    if (featureVideo.paused) void featureVideo.play();
    syncFeatureControls();
  });

  featureVideo.addEventListener("play", syncFeatureControls);
  featureVideo.addEventListener("pause", syncFeatureControls);
  featureVideo.addEventListener("volumechange", syncFeatureControls);
  syncFeatureControls();
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".gallery-slide")];
  const indexLabel = carousel.querySelector("[data-carousel-index]");
  let activeSlide = 0;

  const showSlide = (nextIndex) => {
    activeSlide = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === activeSlide));
    if (indexLabel) indexLabel.textContent = String(activeSlide + 1).padStart(2, "0");
  };

  carousel.querySelector("[data-carousel-prev]")?.addEventListener("click", () => showSlide(activeSlide - 1));
  carousel.querySelector("[data-carousel-next]")?.addEventListener("click", () => showSlide(activeSlide + 1));
});
