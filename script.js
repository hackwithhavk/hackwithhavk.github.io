const fallbackContent = {
  site: {
    name: "HAVK",
    school: "UNC Charlotte",
    eyebrow: "Student-led technology community",
    tagline: "Learn by doing. Leave with a next step.",
    description: "HAVK is a student organization in UNC Charlotte’s College of Computing and Informatics. We focus on helping students build real confidence, professional skills, leadership, and community through opportunities that feel practical, engaging, and actually useful.",
    discordUrl: "https://discord.gg/rPMw3u7mkj"
  },
  stats: [],
  events: [],
  team: [],
  gallery: []
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#039;",
    '"': "&quot;"
  })[character]);
}

function renderStats(stats = []) {
  const container = $("#stats");
  if (!container) return;
  container.innerHTML = stats.map((stat) => `
    <div class="stat">
      <strong>${escapeHTML(stat.value)}</strong>
      <span>${escapeHTML(stat.label)}</span>
    </div>
  `).join("");
}

function renderEvents(events = []) {
  const container = $("#event-list");
  if (!container) return;
  container.innerHTML = events.slice(0, 3).map((event) => `
    <article class="event-card reveal">
      <div class="event-card__image">
        <img src="${escapeHTML(event.image)}" alt="${escapeHTML(event.title)} event poster" loading="lazy" />
      </div>
      <div class="event-card__body">
        <h3>${escapeHTML(event.title)}</h3>
      </div>
    </article>
  `).join("");
}

function renderTeam(team = []) {
  const container = $("#team-grid");
  if (!container) return;
  const cards = team.map((person) => `
    <article class="team-card reveal">
      <div class="team-card__initials" aria-hidden="true">${escapeHTML(person.initials || person.name.slice(0, 1))}</div>
      <div>
        <p class="team-card__role">${escapeHTML(person.role)}</p>
        <h3>${escapeHTML(person.name)}</h3>
      </div>
    </article>
  `).join("");
  container.innerHTML = cards;
}

function wireNavigation() {
  const toggle = $(".menu-toggle");
  const nav = $("#site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
  });
  $$("a", nav).forEach((link) => link.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  }));
}

function wireReveal() {
  $$(".reveal").forEach((element) => element.classList.add("is-visible"));
}

function wireOfficerPeek() {
  const peeks = $$("[data-officer-peek]");
  if (!peeks.length) return;

  const setSpeaking = (peek, isSpeaking) => {
    const button = $(".officer-peek__button", peek);
    const bubble = $(".officer-peek__bubble", peek);
    peek.classList.toggle("is-speaking", isSpeaking);
    button?.setAttribute("aria-expanded", String(isSpeaking));
    bubble?.setAttribute("aria-hidden", String(!isSpeaking));
  };
  const closeAll = (except = null) => {
    peeks.forEach((peek) => {
      if (peek !== except) setSpeaking(peek, false);
    });
  };

  peeks.forEach((peek) => {
    const button = $(".officer-peek__button", peek);
    if (!button) return;
    button.addEventListener("click", () => {
      const willSpeak = !peek.classList.contains("is-speaking");
      closeAll(peek);
      setSpeaking(peek, willSpeak);
    });
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-officer-peek]")) closeAll();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAll();
  });
}

function setDiscordUrl(url = "") {
  if (!url || !/^https?:\/\//i.test(url)) return;
  $$(".discord-link").forEach((link) => {
    link.href = url;
    link.target = "_blank";
    link.rel = "noreferrer";
  });
}

async function loadContent() {
  try {
    const response = await fetch("data/content.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Content request failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("HAVK content JSON could not be loaded; using fallback content.", error);
    return fallbackContent;
  }
}

async function init() {
  wireNavigation();
  wireOfficerPeek();
  $("#current-year").textContent = new Date().getFullYear();
  const content = await loadContent();
  const site = content.site || fallbackContent.site;
  document.title = `${site.name || "HAVK"} — ${site.tagline || "Learn by doing"}`;
  $("#about-description").textContent = site.description || fallbackContent.site.description;
  renderStats(content.stats);
  renderEvents(content.events);
  renderTeam(content.team);
  setDiscordUrl(site.discordUrl);
  wireReveal();
}

document.addEventListener("DOMContentLoaded", init);
