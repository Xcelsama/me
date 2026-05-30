const btn = document.getElementById("theme-toggle");

function setThemeToggleState() {
  const isLight = document.body.classList.contains("light");
  btn.textContent = isLight ? "☀️" : "🌙";
  btn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
}

btn.onclick = function () {
  document.body.classList.toggle("light");
  setThemeToggleState();
};


setThemeToggleState();

