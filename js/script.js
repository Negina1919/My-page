// Brightpath interactive features: navigation, themes, courses, and form checks.

// Mobile navigation menu
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");

menuButton.addEventListener("click", () => {
  const menuIsOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!menuIsOpen));
  menuButton.setAttribute("aria-label", menuIsOpen ? "Open navigation menu" : "Close navigation menu");
  navigation.classList.toggle("open", !menuIsOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("open");
  });
});

// Dark and light theme toggle. The preference is remembered in this browser.
const themeButton = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("brightpath-theme");

if (savedTheme === "dark") document.body.classList.add("dark");
updateThemeButton();

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("brightpath-theme", theme);
  updateThemeButton();
});

function updateThemeButton() {
  const darkModeIsOn = document.body.classList.contains("dark");
  themeButton.setAttribute("aria-pressed", String(darkModeIsOn));
  themeButton.innerHTML = darkModeIsOn
    ? '<span aria-hidden="true">☀</span> Switch to light mode'
    : '<span aria-hidden="true">◐</span> Switch to dark mode';
}

// Course category filters
const filterButtons = document.querySelectorAll(".filter-button");
const courseCards = document.querySelectorAll(".course-card");
const emptyCoursesMessage = document.querySelector("#course-empty");
const courseCount = document.querySelector("#course-count");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;
    let visibleCourseCount = 0;

    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("active", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });

    courseCards.forEach((card) => {
      const shouldShow = selectedCategory === "all" || card.dataset.category === selectedCategory;
      card.hidden = !shouldShow;
      if (shouldShow) visibleCourseCount += 1;
    });

    emptyCoursesMessage.hidden = visibleCourseCount > 0;
    courseCount.textContent = `Showing ${visibleCourseCount} ${visibleCourseCount === 1 ? "course" : "courses"}`;
  });
});

// Show or hide the short learning guide.
const guideButton = document.querySelector(".guide-toggle");
const learningGuide = document.querySelector("#learning-guide");
const guideButtonIcon = guideButton.querySelector("span");

guideButton.addEventListener("click", () => {
  const guideIsOpen = guideButton.getAttribute("aria-expanded") === "true";
  guideButton.setAttribute("aria-expanded", String(!guideIsOpen));
  learningGuide.hidden = guideIsOpen;
  guideButton.childNodes[0].textContent = guideIsOpen ? "See how a course works " : "Hide learning guide ";
  guideButtonIcon.textContent = guideIsOpen ? "＋" : "−";
});

// Course preview dialog
const courseModal = document.querySelector("#course-modal");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalCloseButton = document.querySelector(".modal-close");

document.querySelectorAll(".course-visual").forEach((courseButton) => {
  courseButton.addEventListener("click", () => {
    modalTitle.textContent = courseButton.dataset.course;
    modalDescription.textContent = courseButton.dataset.description;
    courseModal.showModal();
  });
});

modalCloseButton.addEventListener("click", () => courseModal.close());
courseModal.addEventListener("click", (event) => {
  if (event.target === courseModal) courseModal.close();
});
courseModal.querySelector(".modal-cta").addEventListener("click", () => courseModal.close());

// Contact form validation
const contactForm = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = contactForm.elements.name.value.trim();
  const email = contactForm.elements.email.value.trim();
  const message = contactForm.elements.message.value.trim();
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  feedback.classList.remove("error");
  if (!name || !email || !message) {
    showFeedback("Please complete all three fields.", true);
    return;
  }
  if (!emailLooksValid) {
    showFeedback("Please enter a valid email address, such as alex@example.com.", true);
    contactForm.elements.email.focus();
    return;
  }

  showFeedback(`Thanks, ${name}! Your question passed the form checks. This demo does not send email yet.`);
  contactForm.reset();
});

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.classList.toggle("error", isError);
}

// Keep the copyright year current automatically.
document.querySelector("#year").textContent = new Date().getFullYear();
