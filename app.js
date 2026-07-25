const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress span");
const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

function updateScrollState() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(ratio * 100, 100)}%`;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

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
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const modal = document.querySelector("[data-video-modal]");
const modalVideo = modal.querySelector("video");
const modalTitle = modal.querySelector("[data-video-title]");

function closeVideo() {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
  modal.close();
  document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-video]").forEach((button) => {
  button.addEventListener("click", () => {
    modalTitle.textContent = button.dataset.title || "作品样片";
    modalVideo.src = button.dataset.video;
    modal.showModal();
    document.body.classList.add("modal-open");
    modalVideo.play().catch(() => {});
  });
});

modal.querySelector("[data-video-close]").addEventListener("click", closeVideo);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeVideo();
});
modal.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeVideo();
});

const carousel = document.querySelector("[data-carousel]");
const slides = [...carousel.querySelectorAll(".gallery-slide")];
const carouselIndex = carousel.querySelector("[data-carousel-index]");
let activeSlide = 0;

function showSlide(nextIndex) {
  activeSlide = (nextIndex + slides.length) % slides.length;
  slides.forEach((slide, index) => slide.classList.toggle("is-active", index === activeSlide));
  carouselIndex.textContent = String(activeSlide + 1).padStart(2, "0");
}

carousel.querySelector("[data-carousel-prev]").addEventListener("click", () => showSlide(activeSlide - 1));
carousel.querySelector("[data-carousel-next]").addEventListener("click", () => showSlide(activeSlide + 1));

const contactForm = document.querySelector("[data-contact-form]");
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = contactForm.querySelector(".form-status");
  status.textContent = "演示页面已完成表单校验；正式上线时接入企业邮箱或 CRM。";
});
