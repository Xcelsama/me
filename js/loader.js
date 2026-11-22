// loader.js
// Shows the X loading screen, then fades it away.
//
// First page of a visit: the X draws itself (about 2 seconds).
// Other pages in the same visit: the loader is skipped, so moving
// between pages feels instant instead of waiting 2 seconds each time.

const loader = document.getElementById("loader");

const MIN_TIME = 2000;          // ms: long enough for the X to finish drawing
const MAX_TIME = 6000;          // ms: safety net, never trap visitors behind it
const SHOW_EVERY_PAGE = false;  // change to true to see the loader on every page
const startTime = performance.now();

// sessionStorage is a small notebook the browser keeps until the tab is closed.
// We write "yes" in it after the first loader, then check it on later pages.
// try/catch means the site still works if the browser blocks storage.
function alreadySeen() {
  try {
    return sessionStorage.getItem("loaderSeen") === "yes";
  } catch (error) {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem("loaderSeen", "yes");
  } catch (error) {
    // nothing to do: the loader will just show again next time
  }
}

function hideLoader() {
  document.documentElement.classList.add("is-ready");   // lets the hero cards animate in
  if (!loader || loader.classList.contains("is-hidden")) return;
  loader.classList.add("is-hidden");           // CSS fades it out
  setTimeout(() => loader.remove(), 600);      // then remove it from the page
}

function onPageLoaded() {
  // wait for whatever is left of MIN_TIME, or hide straight away if it has passed
  const elapsed = performance.now() - startTime;
  setTimeout(hideLoader, Math.max(0, MIN_TIME - elapsed));
}

if (loader) {
  if (!SHOW_EVERY_PAGE && alreadySeen()) {
    // seen it already this visit: remove it before the page is even drawn
    loader.remove();
    document.documentElement.classList.add("is-ready");
  } else {
    markSeen();

    if (document.readyState === "complete") {
      onPageLoaded();
    } else {
      window.addEventListener("load", onPageLoaded);
    }

    setTimeout(hideLoader, MAX_TIME);
  }
}
