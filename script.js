const CAMPAIGN_DURATION = 7 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = "lmhBuddyOfferDeadline";

function getDeadline() {
  const saved = Number(localStorage.getItem(STORAGE_KEY));
  if (Number.isFinite(saved) && saved > Date.now()) return saved;

  const deadline = Date.now() + CAMPAIGN_DURATION;
  localStorage.setItem(STORAGE_KEY, String(deadline));
  return deadline;
}

const deadline = getDeadline();
const timer = {
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};

function renderCountdown() {
  const remaining = Math.max(0, deadline - Date.now());
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  timer.days.textContent = String(days).padStart(2, "0");
  timer.hours.textContent = String(hours).padStart(2, "0");
  timer.minutes.textContent = String(minutes).padStart(2, "0");
  timer.seconds.textContent = String(seconds).padStart(2, "0");
}

renderCountdown();
setInterval(renderCountdown, 1000);

document.querySelector("[data-year]").textContent = new Date().getFullYear();

const dialog = document.querySelector("#placeholder-dialog");
document.querySelectorAll(".js-payment-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    dialog.showModal();
  });
});
dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
