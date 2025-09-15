let originalGreeting = null;
const typingIntervals = new Map();

function typeText(element, text, speed = 10, callback = null) {
  // Stop any existing typing for this element
  if (typingIntervals.has(element)) clearInterval(typingIntervals.get(element));

  element.textContent = "";
  let i = 0;

  const interval = setInterval(() => {
    if (i >= text.length) {
      clearInterval(interval);
      typingIntervals.delete(element);
      if (callback) callback();
      return;
    }
    element.textContent += text.charAt(i++);
  }, speed);

  typingIntervals.set(element, interval);
}

function setLanguage(lang) {
  fetch(`/static/locales/${lang}.json`)
    .then(res => res.json())
    .then(translations => {
      document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        const newText = translations[key] || "";
        typeText(el, newText);
        if (key === "greeting") originalGreeting = newText;
      });

      document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if (translations[key] !== undefined) el.placeholder = translations[key];
      });
    })
    .catch(err => console.error("Translation error:", err));
}

// Auto-detect language on load
document.addEventListener("DOMContentLoaded", () => {
  const greetingEl = document.querySelector("[data-i18n='greeting']");
  if (greetingEl) originalGreeting = greetingEl.textContent;

  const lang = navigator.language.startsWith("it") ? "it" :
               navigator.language.startsWith("es") ? "es" :
               navigator.language.startsWith("de") ? "de" :
               navigator.language.startsWith("en") ? "en" : "it";
  setLanguage(lang);
});
