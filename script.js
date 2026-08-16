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

document.querySelector("#year").textContent = new Date().getFullYear();

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
  if (!live2dTip || window.innerWidth < 1150) return;

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
  if (!canvas || window.innerWidth < 1150 || typeof Live2DHelper === "undefined") return;

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
      { text: "Bạn vừa chạm vào mình phải không?", expression: "F_SURPRISE" },
      { text: "Xin chào, mình là Asuna.", expression: "F_FUN_WARM" },
      { text: "Đừng chọc nữa, mình ngại đấy.", expression: "F_FUN_HANIKAMI" },
      { text: "KyotaFill đang bận xây một dự án mới.", expression: "F_FUN_SMILE" },
      { text: "Tải lại trang để xem mình đổi trang phục nhé.", expression: "F_FUN" }
    ];

    canvas.addEventListener("click", () => {
      let dialogueIndex;
      do {
        dialogueIndex = Math.floor(Math.random() * clickDialogues.length);
      } while (dialogueIndex === lastAsunaDialogue && clickDialogues.length > 1);

      lastAsunaDialogue = dialogueIndex;
      const dialogue = clickDialogues[dialogueIndex];
      showLive2DMessage(dialogue.text, dialogue.expression);
    });

    window.setTimeout(() => {
      showLive2DMessage("Chào mừng bạn đến với portfolio của KyotaFill.", "F_FUN_SMILE");
    }, 900);
  });
}

function bindLive2DReactions() {
  const reactions = [
    [".home-button", "Quay lại đầu trang nhé."],
    [".menu-item[href='#profile']", "Đây là phần giới thiệu về Kiên."],
    [".menu-item[href='#projects']", "Cùng xem những dự án nổi bật nào."],
    [".menu-item[href='#stack']", "Đây là bộ công cụ Kiên thường sử dụng."],
    [".menu-item[href='#contact']", "Có ý tưởng hay à? Hãy cùng xây dựng nhé."],
    ["#search-button", "Bạn đang muốn tìm dự án nào vậy?"],
    ["#to-top", "Quay lại nơi bắt đầu nào."],
    ["#copy-handle", "Bạn có thể tìm KyotaFill trên GitHub."],
    [".post-pagination a", "Đi nhanh đến phần tiếp theo nhé."]
  ];

  reactions.forEach(([selector, message]) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.addEventListener("mouseenter", () => showLive2DMessage(message, "F_NOMAL"));
    });
  });

  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const title = card.querySelector("h2")?.textContent || "dự án này";
      showLive2DMessage("Bạn muốn xem {name} sao?", "F_FUN_SMILE", title);
    });
  });

  document.querySelectorAll(".card-footer a").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const projectCard = link.closest(".project-card");
      if (projectCard) {
        const title = projectCard.querySelector("h2")?.textContent || "dự án này";
        showLive2DMessage("Mở repository {name} trên GitHub nhé.", "F_FUN", title);
      } else {
        showLive2DMessage("Nhấn vào đây để xem thêm nhé.", "F_FUN");
      }
    });
  });

  document.addEventListener("copy", () => {
    showLive2DMessage("Bạn vừa sao chép một đoạn nội dung. Nhớ giữ nguồn nhé.", "F_SURPRISE");
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 1800);
}

function setSearchOpen(open) {
  searchPanel.hidden = !open;
  if (open) {
    searchInput.focus();
  } else {
    searchInput.value = "";
    projects.forEach((project) => { project.hidden = false; });
    noResults.hidden = true;
  }
}

searchButton.addEventListener("click", () => setSearchOpen(searchPanel.hidden));
closeSearchButton.addEventListener("click", () => setSearchOpen(false));

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

copyHandleButton.addEventListener("click", async () => {
  const handle = copyHandleButton.dataset.handle;
  try {
    await navigator.clipboard.writeText(handle);
    showToast(`Đã sao chép ${handle}`);
    showLive2DMessage("Đã sao chép @KyotaFill cho bạn rồi.", "F_FUN_SMILE");
  } catch {
    showToast(handle);
    showLive2DMessage("Tên GitHub là @KyotaFill nhé.", "F_NOMAL");
  }
});

toTopButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

let pendingG = false;
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setSearchOpen(false);
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

randomizeBanners();
bindLive2DReactions();
initLive2DCharacter();
