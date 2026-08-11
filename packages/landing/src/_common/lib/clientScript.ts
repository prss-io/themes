import "@/lib/vendor";
import * as PRSS from "@prss/ui";

// This script handles the dark mode toggle functionality
// and saves the user's preference in local storage.

// Check if dark mode is enabled in local storage
if (localStorage.getItem("dark-mode") === "true") {
  document.body.classList.add("dark");
}

// Toggle dark mode when the button is clicked
document.querySelector(".toggle-dark-mode")?.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  localStorage.setItem("dark-mode", document.body.classList.contains("dark") ? "true" : "false");
});

/* ---- Search (command palette over PRSS.search) ---- */
const initSearch = () => {
  const dialog = document.querySelector<HTMLElement>("[data-search-dialog]");
  const input = document.querySelector<HTMLInputElement>("[data-search-input]");
  const list = document.querySelector<HTMLElement>("[data-search-results]");
  if (!dialog || !input || !list) return;

  const search = (PRSS as any)?.search || (window as any).PRSS?.search;
  // An older @prss/ui has no search; leaving the trigger would promise
  // something the page cannot deliver.
  if (typeof search !== "function") {
    document.querySelectorAll("[data-search-open]").forEach((el) => el.remove());
    return;
  }

  let activeIndex = 0;
  let queryToken = 0;

  const options = () =>
    Array.from(list.querySelectorAll<HTMLElement>(".site-search-result"));

  const highlight = () => {
    options().forEach((el, i) => {
      const on = i === activeIndex;
      el.classList.toggle("is-active", on);
      if (on) el.scrollIntoView({ block: "nearest" });
    });
  };

  const open = () => {
    dialog.hidden = false;
    document.body.classList.add("site-search-open");
    input.focus();
    input.select();
  };

  const close = () => {
    dialog.hidden = true;
    document.body.classList.remove("site-search-open");
  };

  const escapeHtml = (value: string) =>
    value.replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[c] as string)
    );

  const render = (results: any[], query: string) => {
    if (!query.trim()) {
      list.innerHTML = "";
      return;
    }
    if (!results.length) {
      list.innerHTML = `<p class="site-search-empty">No results for “${escapeHtml(
        query
      )}”</p>`;
      return;
    }

    list.innerHTML = results
      .map(
        (r) => `<a class="site-search-result" href="${escapeHtml(r.url)}">
          <span class="site-search-result-title">${escapeHtml(r.title)}</span>
          ${
            r.heading
              ? `<span class="site-search-result-section">${escapeHtml(
                  r.heading
                )}</span>`
              : ""
          }
          <span class="site-search-result-excerpt">${escapeHtml(
            r.excerpt || ""
          )}</span>
        </a>`
      )
      .join("");

    activeIndex = 0;
    highlight();
  };

  let debounce: any;
  input.addEventListener("input", () => {
    clearTimeout(debounce);
    const query = input.value;
    // Results can arrive out of order; only the newest query may paint.
    const token = ++queryToken;
    debounce = setTimeout(async () => {
      const results = await search(query, 8);
      if (token === queryToken) render(results, query);
    }, 120);
  });

  document
    .querySelectorAll("[data-search-open]")
    .forEach((el) => el.addEventListener("click", open));
  document
    .querySelectorAll("[data-search-close]")
    .forEach((el) => el.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    const target = e.target as HTMLElement;
    const typingElsewhere =
      /^(input|textarea|select)$/i.test(target?.tagName || "") ||
      target?.isContentEditable;

    if (
      ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") ||
      (e.key === "/" && !typingElsewhere)
    ) {
      e.preventDefault();
      open();
      return;
    }

    if (dialog.hidden) return;

    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const items = options();
      if (!items.length) return;
      e.preventDefault();
      activeIndex =
        (activeIndex + (e.key === "ArrowDown" ? 1 : -1) + items.length) %
        items.length;
      highlight();
    } else if (e.key === "Enter") {
      const current = options()[activeIndex];
      if (current) {
        e.preventDefault();
        window.location.href = current.getAttribute("href") || "";
      }
    }
  });
};

initSearch();

