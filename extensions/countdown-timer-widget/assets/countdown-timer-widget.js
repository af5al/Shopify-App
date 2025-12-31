(function () {
  console.log("[CountdownTimerWidget] script loaded");

  function initCountdownWidgets() {
    var els = document.querySelectorAll(".countdown-timer-app");
    if (!els.length) return;

    els.forEach(function (el) {
      if (el.dataset.initialized === "true") return;
      el.dataset.initialized = "true";

      var productId = el.getAttribute("data-product-id");
      var showLabel = el.dataset.showLabel === "true";
      var labelText = "ends in:";

      fetch("/apps/countdown-timer?product_id=" + productId)
        .then(function (res) {
          return res.json();
        })
        .then(function (response) {
          console.log("[CountdownTimerWidget] response", response);

          var timer = response;
          if (!timer) {
            el.innerHTML = "";
            return;
          }

          if (timer.active === false) {
            el.innerHTML = "No active promotions";
          } else {
            renderTimer(el, timer, showLabel, labelText);
          }
        })
        .catch(function (err) {
          console.error("[CountdownTimerWidget] fetch error", err);
          el.innerHTML = "";
        });
    });
  }

  function renderTimer(container, timer, showLabel, labelText) {
    // ✅ Normalize ID (VERY IMPORTANT)
    var timerId = timer.id || timer._id;

    var bg =
      (timer.appearance && timer.appearance.backgroundColor) || "#f4f6f8";

    const label = timer.name ? `${timer.name} ${labelText}` : labelText;

    container.innerHTML = `
      <div class="countdown-timer-box" style="background:${bg}; padding:10px; text-align:center;">
        ${showLabel ? `<div class="countdown-label">${label}</div>` : ""}
        <div class="countdown-time" id="countdown-${timerId}">--:--:--</div>
        <p style="font-size:12px; color:#666; margin-top:10px;">${timer.description}</p>
      </div>
    `;

    startCountdown(timer, timerId, container.querySelector(".countdown-time"));
  }

  function startCountdown(timer, timerId, el) {
    var now = Date.now();

    // ✅ Handle startAt properly
    if (timer.startAt) {
      var startTime = new Date(timer.startAt).getTime();
      if (now < startTime) {
        el.innerText = "Offer starts soon";
        return;
      }
    }

    var endTime;

    if (timer.type === "fixed") {
      endTime = new Date(timer.endAt).getTime();
    } else {
      // ✅ Evergreen timer (per visitor)
      var key = "timer_" + timerId;
      var saved = localStorage.getItem(key);

      if (!saved) {
        saved = Date.now() + timer.durationSeconds * 1000;
        localStorage.setItem(key, saved);
      }

      endTime = Number(saved);
    }

    var interval = setInterval(function () {
      var diff = endTime - Date.now();

      if (diff <= 0) {
        el.innerText = "Expired";
        clearInterval(interval);
        return;
      }

      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);

      el.innerText =
        String(h).padStart(2, "0") +
        ":" +
        String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0");
    }, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCountdownWidgets);
  } else {
    initCountdownWidgets();
  }
})();