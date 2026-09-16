/*
 * Lightbox for admin photo thumbnails.
 *
 * Any <img data-lightbox="group"> becomes part of that group's gallery: click
 * one and it opens full size with prev/next across the whole group. Written
 * against the DOM directly so the admin needs no extra dependency, and bound
 * on the document so thumbnails added by "add another" inlines work too.
 */
(function () {
  "use strict";

  // Jazzmin's `custom_js` and the ModelAdmin `Media` class can both pull this
  // file in, so bail out if a previous copy already wired everything up.
  if (window.__gkGalleryReady) {
    return;
  }
  window.__gkGalleryReady = true;

  var overlay = null;
  var figure = null;
  var caption = null;
  var counter = null;
  var items = [];
  var index = 0;

  function build() {
    if (overlay) {
      return;
    }

    overlay = document.createElement("div");
    overlay.className = "gk-lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.hidden = true;
    overlay.innerHTML =
      '<button type="button" class="gk-lightbox__close" aria-label="Закрыть">&times;</button>' +
      '<button type="button" class="gk-lightbox__nav gk-lightbox__nav--prev" aria-label="Назад">&#8249;</button>' +
      '<figure class="gk-lightbox__figure"><img alt=""><figcaption></figcaption></figure>' +
      '<button type="button" class="gk-lightbox__nav gk-lightbox__nav--next" aria-label="Вперёд">&#8250;</button>' +
      '<div class="gk-lightbox__counter"></div>';

    figure = overlay.querySelector("img");
    caption = overlay.querySelector("figcaption");
    counter = overlay.querySelector(".gk-lightbox__counter");

    overlay.querySelector(".gk-lightbox__close").addEventListener("click", close);
    overlay.querySelector(".gk-lightbox__nav--prev").addEventListener("click", function (event) {
      event.stopPropagation();
      step(-1);
    });
    overlay.querySelector(".gk-lightbox__nav--next").addEventListener("click", function (event) {
      event.stopPropagation();
      step(1);
    });
    // A click on the backdrop closes; a click on the photo itself does not.
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay || event.target.tagName === "FIGURE") {
        close();
      }
    });

    document.body.appendChild(overlay);
  }

  function show() {
    var item = items[index];
    if (!item) {
      return;
    }

    figure.src = item.getAttribute("data-full") || item.src;
    figure.alt = item.getAttribute("data-caption") || "";
    caption.textContent = item.getAttribute("data-caption") || "";
    counter.textContent = items.length > 1 ? index + 1 + " / " + items.length : "";
    overlay.querySelector(".gk-lightbox__nav--prev").hidden = items.length < 2;
    overlay.querySelector(".gk-lightbox__nav--next").hidden = items.length < 2;
  }

  function step(delta) {
    if (!items.length) {
      return;
    }
    index = (index + delta + items.length) % items.length;
    show();
  }

  function open(target) {
    var group = target.getAttribute("data-lightbox");
    items = Array.prototype.slice.call(
      document.querySelectorAll('img[data-lightbox="' + group + '"]')
    );
    index = Math.max(0, items.indexOf(target));

    build();
    overlay.hidden = false;
    document.body.classList.add("gk-lightbox-open");
    show();
  }

  function close() {
    if (!overlay) {
      return;
    }
    overlay.hidden = true;
    document.body.classList.remove("gk-lightbox-open");
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (target && target.tagName === "IMG" && target.hasAttribute("data-lightbox")) {
      event.preventDefault();
      open(target);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (!overlay || overlay.hidden) {
      return;
    }
    if (event.key === "Escape") {
      close();
    } else if (event.key === "ArrowLeft") {
      step(-1);
    } else if (event.key === "ArrowRight") {
      step(1);
    }
  });
})();
