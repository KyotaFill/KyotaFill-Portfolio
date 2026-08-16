const toTopButton = document.querySelector("#to-top");
const copyHandleButton = document.querySelector("#copy-handle");
const searchButton = document.querySelector("#search-button");
const searchPanel = document.querySelector("#search-panel");
const searchInput = document.querySelector("#project-search");
const closeSearchButton = document.querySelector("#close-search");
const projects = [...document.querySelectorAll(".project-card")];
const noResults = document.querySelector("#no-results");
const toast = document.querySelector("#toast");
const bannerImages = [...document.querySelectorAll("img[data-banner]")];
const live2dTip = document.querySelector(".live2d-tip");

let live2dCharacter = null;
let live2dMessageTimer;
let lastAsunaDialogue = -1;
let currentLanguage = "vi";

const translations = {
  vi: {
    "common.skip": "Đi đến nội dung",
    "common.category": "Danh mục:",
    "common.builtBy": "Được xây dựng bởi KyotaFill",
    "common.search": "Tìm dự án",
    "nav.home": "Trang chủ",
    "nav.profile": "Hồ sơ",
    "nav.projects": "Dự án",
    "nav.stack": "Công nghệ",
    "nav.contact": "Liên hệ",
    "home.intro": "Mình là sinh viên học tập tại Đại học Kinh tế Thành phố Hồ Chí Minh, tập trung vào thị giác máy tính, sản phẩm ứng dụng AI, tự động hóa và hệ thống nhúng.",
    "home.role": "\"Sinh viên AI/ML & IoT\"",
    "home.location": "\"TP. Hồ Chí Minh, Việt Nam\"",
    "home.mission": "\"Học → Xây dựng → Đo lường → Cải tiến\"",
    "home.readProfile": "Đọc hồ sơ...",
    "profile.originalReadme": "Xem README gốc...",
    "projects.featured": "Dự án nổi bật",
    "projects.computerVision": "Thị giác máy tính",
    "projects.tools": "Công cụ",
    "projects.creativeAi": "AI sáng tạo",
    "projects.foodvision": "Sản phẩm nhận diện món ăn đầu cuối, kết hợp mô hình TensorFlow, dịch vụ FastAPI và giao diện Next.js hoàn chỉnh.",
    "projects.shapevision": "Đọc hình vẽ tay tự do và chuyển đổi chúng thành các hình học 2D được số hóa chính xác bằng pipeline thị giác máy tính.",
    "projects.smarthome": "Hệ thống nhà thông minh mô phỏng giúp giám sát môi trường và điều khiển thiết bị bằng ESP32, MQTT, Node-RED và Wokwi.",
    "projects.smartcampus": "Quy trình hỗ trợ trong trường học để gửi, phân công, trao đổi và theo dõi các yêu cầu kỹ thuật hoặc học vụ.",
    "projects.terminal": "Không gian làm việc Tauri giúp gom các phiên terminal và đơn giản hóa quy trình phát triển chạy nhiều tiến trình.",
    "projects.animeLecture": "Công cụ sáng tạo kết hợp tổng hợp giọng nói, theo dõi webcam và tự động hóa FFmpeg để tạo nội dung bài giảng bằng AI.",
    "projects.openRepo": "Mở repository...",
    "projects.noResults": "Không tìm thấy dự án phù hợp.",
    "stack.title": "Công nghệ sử dụng",
    "stack.toolkit": "Bộ công cụ",
    "stack.area": "Lĩnh vực",
    "stack.tools": "Công cụ",
    "stack.languages": "Ngôn ngữ cốt lõi",
    "stack.vision": "AI & thị giác",
    "stack.web": "Sản phẩm web",
    "stack.infrastructure": "Hạ tầng",
    "stack.connected": "Hệ thống kết nối",
    "stack.viewProjects": "Xem tất cả dự án...",
    "contact.title": "Liên hệ & hợp tác",
    "contact.city": "TP. Hồ Chí Minh",
    "contact.country": "Việt Nam",
    "contact.intro": "Mình sẵn sàng hợp tác trong các dự án sinh viên, thử nghiệm AI thực tế và những sản phẩm kết nối phần mềm với thế giới vật lý.",
    "contact.openGithub": "Mở GitHub",
    "contact.copy": "Sao chép @KyotaFill",
    "contact.available": "Sẵn sàng hợp tác",
    "contact.top": "Về đầu trang...",
    "live.welcome": "Chào mừng bạn đến với portfolio của KyotaFill.",
    "live.click1": "Bạn vừa chạm vào mình phải không?",
    "live.click2": "Xin chào, mình là Asuna.",
    "live.click3": "Đừng chọc nữa, mình ngại đấy.",
    "live.click4": "KyotaFill đang bận xây một dự án mới.",
    "live.click5": "Tải lại trang để xem mình đổi trang phục nhé.",
    "live.home": "Về trang chủ nhé.",
    "live.profile": "Đây là phần giới thiệu về Kiên.",
    "live.projects": "Cùng xem những dự án nổi bật nào.",
    "live.stack": "Đây là bộ công cụ Kiên thường sử dụng.",
    "live.contact": "Có ý tưởng hay à? Hãy cùng xây dựng nhé.",
    "live.search": "Bạn đang muốn tìm dự án nào vậy?",
    "live.top": "Quay lại nơi bắt đầu nào.",
    "live.handle": "Bạn có thể tìm KyotaFill trên GitHub.",
    "live.next": "Đi nhanh đến phần tiếp theo nhé.",
    "live.project": "Bạn muốn xem {name} sao?",
    "live.repo": "Mở repository {name} trên GitHub nhé.",
    "live.more": "Nhấn vào đây để xem thêm nhé.",
    "live.copyContent": "Bạn vừa sao chép một đoạn nội dung. Nhớ giữ nguồn nhé.",
    "live.copied": "Đã sao chép @KyotaFill cho bạn rồi.",
    "live.githubName": "Tên GitHub là @KyotaFill nhé.",
    "toast.copied": "Đã sao chép"
  },
  en: {
    "common.skip": "Skip to content",
    "common.category": "Category:",
    "common.builtBy": "Built by KyotaFill",
    "common.search": "Search projects",
    "nav.home": "Home",
    "nav.profile": "Profile",
    "nav.projects": "Projects",
    "nav.stack": "Technology",
    "nav.contact": "Contact",
    "home.intro": "I study at the University of Economics Ho Chi Minh City, focusing on computer vision, applied AI products, automation, and embedded systems.",
    "home.role": "\"AI/ML & IoT Student\"",
    "home.location": "\"Ho Chi Minh City, Vietnam\"",
    "home.mission": "\"Learn → Build → Measure → Improve\"",
    "home.readProfile": "Read profile...",
    "profile.originalReadme": "View original README...",
    "projects.featured": "Featured project",
    "projects.computerVision": "Computer vision",
    "projects.tools": "Developer tools",
    "projects.creativeAi": "Creative AI",
    "projects.foodvision": "An end-to-end food recognition product combining a TensorFlow model, FastAPI service, and a complete Next.js interface.",
    "projects.shapevision": "Reads freehand drawings and converts them into accurately digitized 2D geometry through a computer-vision pipeline.",
    "projects.smarthome": "A simulated smart-home system for monitoring the environment and controlling devices with ESP32, MQTT, Node-RED, and Wokwi.",
    "projects.smartcampus": "A campus support workflow for submitting, assigning, discussing, and tracking technical or academic service requests.",
    "projects.terminal": "A Tauri workspace that groups terminal sessions and simplifies multi-process development workflows.",
    "projects.animeLecture": "A creative tool combining voice synthesis, webcam tracking, and FFmpeg automation to produce AI-assisted lecture content.",
    "projects.openRepo": "Open repository...",
    "projects.noResults": "No matching projects found.",
    "stack.title": "Technology stack",
    "stack.toolkit": "Toolkit",
    "stack.area": "Area",
    "stack.tools": "Tools",
    "stack.languages": "Core languages",
    "stack.vision": "AI & vision",
    "stack.web": "Web products",
    "stack.infrastructure": "Infrastructure",
    "stack.connected": "Connected systems",
    "stack.viewProjects": "View all projects...",
    "contact.title": "Contact & collaboration",
    "contact.city": "Ho Chi Minh City",
    "contact.country": "Vietnam",
    "contact.intro": "I am open to student collaborations, practical AI experiments, and products that connect software with the physical world.",
    "contact.openGithub": "Open GitHub",
    "contact.copy": "Copy @KyotaFill",
    "contact.available": "Open to collaboration",
    "contact.top": "Back to top...",
    "live.welcome": "Welcome to KyotaFill's portfolio.",
    "live.click1": "Did you just tap me?",
    "live.click2": "Hello, I'm Asuna.",
    "live.click3": "Stop poking me, you're making me shy.",
    "live.click4": "KyotaFill is busy building a new project.",
    "live.click5": "Reload the page to see my outfit change.",
    "live.home": "Let's go back home.",
    "live.profile": "This is Kien's profile.",
    "live.projects": "Let's explore the featured projects.",
    "live.stack": "These are the tools Kien often uses.",
    "live.contact": "Have an idea? Let's build it together.",
    "live.search": "Which project are you looking for?",
    "live.top": "Let's return to the beginning.",
    "live.handle": "You can find KyotaFill on GitHub.",
    "live.next": "Let's jump to the next section.",
    "live.project": "Would you like to see {name}?",
    "live.repo": "Let's open {name} on GitHub.",
    "live.more": "Click here to see more.",
    "live.copyContent": "You copied some content. Please keep the source.",
    "live.copied": "I copied @KyotaFill for you.",
    "live.githubName": "The GitHub handle is @KyotaFill.",
    "toast.copied": "Copied"
  }
};

function t(key) {
  return translations[currentLanguage]?.[key] || translations.vi[key] || key;
}

function applyLanguage(language) {
  currentLanguage = language === "en" ? "en" : "vi";
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  const pageTitles = {
    home: currentLanguage === "vi" ? "KyotaFill — Portfolio AI/ML & IoT" : "KyotaFill — AI/ML & IoT Portfolio",
    profile: currentLanguage === "vi" ? "Hồ sơ — Trần Trung Kiên / KyotaFill" : "Profile — Trần Trung Kiên / KyotaFill",
    projects: currentLanguage === "vi" ? "Dự án — KyotaFill" : "Projects — KyotaFill",
    stack: currentLanguage === "vi" ? "Công nghệ — KyotaFill" : "Technology — KyotaFill",
    contact: currentLanguage === "vi" ? "Liên hệ — KyotaFill" : "Contact — KyotaFill"
  };
  document.title = pageTitles[document.body.dataset.page] || pageTitles.home;

  const searchText = t("common.search");
  document.querySelectorAll(".search-button").forEach((element) => {
    element.title = searchText;
    element.setAttribute("aria-label", searchText);
  });
  if (searchInput) searchInput.placeholder = currentLanguage === "vi" ? "Thử: vision, IoT, FastAPI..." : "Try: vision, IoT, FastAPI...";

  document.querySelectorAll(".language-switcher button").forEach((button) => {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (live2dTip && !live2dTip.classList.contains("visible")) live2dTip.textContent = t("live.welcome");

  try { window.localStorage.setItem("portfolio-language", currentLanguage); } catch {}
}

function initLanguageSwitcher() {
  const menu = document.querySelector(".menu");
  if (!menu) return;

  const switcher = document.createElement("div");
  switcher.className = "language-switcher";
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", "Language / Ngôn ngữ");
  switcher.innerHTML = '<button type="button" data-language="en">EN</button><button type="button" data-language="vi">VI</button>';
  menu.append(switcher);

  let savedLanguage = "vi";
  try { savedLanguage = window.localStorage.getItem("portfolio-language") || "vi"; } catch {}
  const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
  applyLanguage(requestedLanguage || savedLanguage);

  switcher.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-language]");
    if (button) applyLanguage(button.dataset.language);
  });
}

const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function randomizeBanners() {
  const availableBanners = shuffle(Array.from({ length: 22 }, (_, index) => index + 1));
  bannerImages.forEach((image, index) => {
    image.src = `assets/banners/${availableBanners[index % availableBanners.length]}.jpg`;
  });
}

function showLive2DMessage(message, expression, highlightedText) {
  if (!live2dTip) return;

  live2dTip.replaceChildren();

  if (highlightedText && message.includes("{name}")) {
    const [before, after] = message.split("{name}");
    const highlight = document.createElement("span");
    highlight.className = "live2d-highlight";
    highlight.textContent = highlightedText;
    live2dTip.append(before, highlight, after);
  } else {
    live2dTip.textContent = message;
  }

  live2dTip.classList.add("visible");

  if (expression && live2dCharacter) {
    live2dCharacter.setExpression(expression);
  }

  window.clearTimeout(live2dMessageTimer);
  live2dMessageTimer = window.setTimeout(() => live2dTip.classList.remove("visible"), 3400);
}

function initLive2DCharacter() {
  const canvas = document.querySelector("#glcanvas");
  if (!canvas || typeof Live2DHelper === "undefined") return;

  const character = new Live2DHelper({ canvas: "glcanvas" });
  const outfits = [
    "01", "02", "03", "04", "05", "06", "07", "08", "09", "12",
    "13", "14", "15", "16", "17", "18", "19", "20", "21", "22",
    "23", "24", "25", "26", "27", "28", "29", "30", "31", "33",
    "34", "35", "36", "37", "38", "39", "40", "41", "43", "44",
    "45", "46", "47", "48", "49", "50", "52", "53", "54"
  ];
  const outfit = outfits[Math.floor(Math.random() * outfits.length)];
  const modelPath = `assets/live2d/asuna/asuna_${outfit}/asuna_${outfit}.edit.model.json`;

  character.loadModel(modelPath, () => {
    live2dCharacter = character;
    character.startMotion("", "3");
    character.startTurnHead();
    canvas.addEventListener("pointermove", (event) => character.followPointer(event));
    canvas.addEventListener("pointerleave", () => character.viewPointer(0, 0));
    const clickDialogues = [
      { key: "live.click1", expression: "F_SURPRISE" },
      { key: "live.click2", expression: "F_FUN_WARM" },
      { key: "live.click3", expression: "F_FUN_HANIKAMI" },
      { key: "live.click4", expression: "F_FUN_SMILE" },
      { key: "live.click5", expression: "F_FUN" }
    ];

    canvas.addEventListener("click", () => {
      let dialogueIndex;
      do {
        dialogueIndex = Math.floor(Math.random() * clickDialogues.length);
      } while (dialogueIndex === lastAsunaDialogue && clickDialogues.length > 1);

      lastAsunaDialogue = dialogueIndex;
      const dialogue = clickDialogues[dialogueIndex];
      showLive2DMessage(t(dialogue.key), dialogue.expression);
    });

    window.setTimeout(() => {
      showLive2DMessage(t("live.welcome"), "F_FUN_SMILE");
    }, 900);
  });
}

function bindLive2DReactions() {
  const reactions = [
    [".home-button", "live.home"],
    [".menu-item[href='profile.html']", "live.profile"],
    [".menu-item[href='projects.html']", "live.projects"],
    [".menu-item[href='stack.html']", "live.stack"],
    [".menu-item[href='contact.html']", "live.contact"],
    ["#search-button", "live.search"],
    ["#to-top", "live.top"],
    ["#copy-handle", "live.handle"],
    [".post-pagination a", "live.next"]
  ];

  reactions.forEach(([selector, messageKey]) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.addEventListener("mouseenter", () => showLive2DMessage(t(messageKey), "F_NOMAL"));
    });
  });

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const title = card.querySelector("h2")?.textContent || "dự án này";
      showLive2DMessage(t("live.project"), "F_FUN_SMILE", title);
    });
  });

  document.querySelectorAll(".card-footer a").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const projectCard = link.closest(".project-card");
      if (projectCard) {
        const title = projectCard.querySelector("h2")?.textContent || "dự án này";
        showLive2DMessage(t("live.repo"), "F_FUN", title);
      } else {
        showLive2DMessage(t("live.more"), "F_FUN");
      }
    });
  });

  document.addEventListener("copy", () => {
    showLive2DMessage(t("live.copyContent"), "F_SURPRISE");
  });
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 1800);
}

function setSearchOpen(open) {
  if (!searchPanel || !searchInput || !noResults) return;
  searchPanel.hidden = !open;
  if (open) {
    searchInput.focus();
  } else {
    searchInput.value = "";
    projects.forEach((project) => { project.hidden = false; });
    noResults.hidden = true;
  }
}

if (searchButton && searchPanel) {
  searchButton.addEventListener("click", () => setSearchOpen(searchPanel.hidden));
}

if (closeSearchButton) {
  closeSearchButton.addEventListener("click", () => setSearchOpen(false));
}

if (searchPanel && window.location.hash === "#search") {
  setSearchOpen(true);
}

if (searchInput && noResults) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    projects.forEach((project) => {
      const matches = !query || project.dataset.search.includes(query) || project.textContent.toLowerCase().includes(query);
      project.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    noResults.hidden = visibleCount !== 0;
  });
}

if (copyHandleButton) {
  copyHandleButton.addEventListener("click", async () => {
    const handle = copyHandleButton.dataset.handle;
    try {
      await navigator.clipboard.writeText(handle);
      showToast(`${t("toast.copied")} ${handle}`);
      showLive2DMessage(t("live.copied"), "F_FUN_SMILE");
    } catch {
      showToast(handle);
      showLive2DMessage(t("live.githubName"), "F_NOMAL");
    }
  });
}

if (toTopButton) {
  toTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

let pendingG = false;
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && searchPanel) setSearchOpen(false);
  if (event.target instanceof HTMLInputElement) return;

  if (event.key === "G") window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  if (event.key.toLowerCase() === "g") {
    if (pendingG) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      pendingG = false;
    } else {
      pendingG = true;
      window.setTimeout(() => { pendingG = false; }, 700);
    }
  }
});

initLanguageSwitcher();
randomizeBanners();
bindLive2DReactions();
initLive2DCharacter();
