const GAS_WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyvbLW5WgbxUCbNVw4EpETNotU25LD8YjikIDVSUCJySiBFICBjKbxFgDz6M5hen83u4g/exec";

const OFFICIAL_CATEGORIES = [
  "브랜드 디자인",
  "편집/출판 디자인",
  "UI/UX 디자인",
  "그래픽/일러스트레이션",
  "모션/영상 디자인",
  "3D/제품 비주얼라이제이션 디자인",
  "레터링/활자 디자인",
  "기타",
];
const RANK_IMAGES = {
  "브랜드 디자인": "https://i.imgur.com/vANoYXL.png",
  "편집/출판 디자인": "https://i.imgur.com/paP8tuF.png",
  "UI/UX 디자인": "https://i.imgur.com/XuB5tfQ.png",
  "그래픽/일러스트레이션": "https://i.imgur.com/nIMBg6v.png",
  "모션/영상 디자인": "https://i.imgur.com/0Rx7qHP.png",
  "3D/제품 비주얼라이제이션 디자인": "https://i.imgur.com/QJfhdY9.png",
  "레터링/활자 디자인": "https://i.imgur.com/8WwNUgs.png",
  기타: "https://i.imgur.com/zJiBViP.png",
};

const SLOT_DATA = [
  { dot: { x: 88, y: 29 }, orb: { x: 75, y: 22 } },
  { dot: { x: 88, y: 36 }, orb: { x: 60, y: 33 } },
  { dot: { x: 88, y: 43 }, orb: { x: 56, y: 40 } },
  { dot: { x: 88, y: 50 }, orb: { x: 46, y: 48 } },
  { dot: { x: 88, y: 62 }, orb: { x: 28, y: 63 } },
  { dot: { x: 88, y: 71 }, orb: { x: 16, y: 75 } },
  { dot: { x: 88, y: 80 }, orb: { x: 12, y: 83 } },
];
const ORNAMENT_DATA = {
  yellow: {
    label: "추억",
    accent: "#f5b400",
    patterns: [
      {
        cap: "https://i.imgur.com/bQ7Rfza.png",
        shape: "https://i.imgur.com/zKtjAX7.png",
      },
      {
        cap: "https://i.imgur.com/BCSPZE1.png",
        shape: "https://i.imgur.com/hD4oE1b.png",
      },
      {
        cap: "https://i.imgur.com/TdV7sJm.png",
        shape: "https://i.imgur.com/bHbSqx3.png",
      },
      {
        cap: "https://i.imgur.com/pWkO6qb.png",
        shape: "https://i.imgur.com/SjnAzAJ.png",
      },
      {
        cap: "https://i.imgur.com/AdlhJN0.png",
        shape: "https://i.imgur.com/6uiU5YA.png",
      },
      {
        cap: "https://i.imgur.com/LwpNDIR.png",
        shape: "https://i.imgur.com/ujYQOfU.png",
      },
    ],
  },
  red: {
    label: "고민",
    accent: "#c63926",
    patterns: [
      {
        cap: "https://i.imgur.com/hkHu9Eb.png",
        shape: "https://i.imgur.com/VPnVPam.png",
      },
      {
        cap: "https://i.imgur.com/HnPoieL.png",
        shape: "https://i.imgur.com/Un0xHIP.png",
      },
      {
        cap: "https://i.imgur.com/3meCnRR.png",
        shape: "https://i.imgur.com/qQkixfI.png",
      },
      {
        cap: "https://i.imgur.com/xfCzHIu.png",
        shape: "https://i.imgur.com/JWSjR9n.png",
      },
      {
        cap: "https://i.imgur.com/6G4J6xV.png",
        shape: "https://i.imgur.com/TZx9lSj.png",
      },
      {
        cap: "https://i.imgur.com/8OJgTRS.png",
        shape: "https://i.imgur.com/9AT23K3.png",
      },
    ],
  },
  green: {
    label: "다짐",
    accent: "#01c6cd",
    patterns: [
      {
        cap: "https://i.imgur.com/q6d9qMg.png",
        shape: "https://i.imgur.com/57dM8PS.png",
      },
      {
        cap: "https://i.imgur.com/0m62Uic.png",
        shape: "https://i.imgur.com/BQOqZMO.png",
      },
      {
        cap: "https://i.imgur.com/LBTty3f.png",
        shape: "https://i.imgur.com/b8aUxEk.png",
      },
      {
        cap: "https://i.imgur.com/VAqncS6.png",
        shape: "https://i.imgur.com/vgtcsuV.png",
      },
      {
        cap: "https://i.imgur.com/H0MDosO.png",
        shape: "https://i.imgur.com/di8bXGL.png",
      },
      {
        cap: "https://i.imgur.com/wJOtZWG.png",
        shape: "https://i.imgur.com/DIU5tmp.png",
      },
    ],
  },
};

let formData = {
  name: "",
  affiliation: "",
  interests: [],
  theme: "",
  title: "",
  content: "",
};
let postDataCache = [];
let bgmAudio = null,
  isBgmPlaying = false;
let currentThemeColor = "yellow",
  selectedOrnamentSrc = "",
  treeAngle = 20,
  currentTreeFilter = "";

document.addEventListener("DOMContentLoaded", () => {
  try {
    if (typeof lucide !== "undefined" && lucide.createIcons)
      lucide.createIcons();
  } catch (e) {}
  createSnow();
  setupCustomCursor();
  setupBGM();
  setupEventListeners();
  setupMenu();
  document.getElementById("goTreeButton").addEventListener("click", () => {
    if (!selectedOrnamentSrc) return alert("오너먼트를 선택해주세요.");
    goToPage("tree");
  });
  document.getElementById("arrow-left").addEventListener("click", () => {
    treeAngle -= 30;
    updateTreeRotation();
  });
  document.getElementById("arrow-right").addEventListener("click", () => {
    treeAngle += 30;
    updateTreeRotation();
  });
  document.getElementById("limitCloseBtn").addEventListener("click", () => {
    document.getElementById("limitModal").classList.add("hidden");
    document.getElementById("limitModal").classList.remove("flex");
  });
  goToPage("main");
});

function startNewSurvey() {
  formData = {
    name: "",
    affiliation: "",
    interests: [],
    theme: "",
    title: "",
    content: "",
  };
  document.getElementById("input-name").value = "";
  document.querySelectorAll(".aff-btn").forEach((b) => {
    b.classList.remove("active", "bg-[#6E1A1A]", "text-white");
    b.classList.add("bg-white", "text-[#6E1A1A]/80");
  });
  document
    .querySelectorAll("input[type=checkbox]")
    .forEach((c) => (c.checked = false));
  document.getElementById("theme-dropdown-list").classList.add("hidden");
  document.querySelector("#theme-dropdown-btn span").textContent =
    "주제를 선택해주세요";
  document.getElementById("post-title").value = "";
  document.getElementById("post-content").value = "";
  document.getElementById("grade-selector-container").classList.add("hidden");
  document.getElementById("treeHint").classList.add("hidden");
  goToPage("common");
}
function createSnow() {
  const container = document.getElementById("snow-container");
  if (!container) return;
  container.innerHTML = "";

  // 눈송이 개수: 50개 -> 80개로 살짝 늘림 (자연스러운 밀도)
  const snowflakeCount = 80;

  for (let i = 0; i < snowflakeCount; i++) {
    const flake = document.createElement("div");
    flake.className = "snowflake";

    // 1. 랜덤 위치 (0% ~ 100%)
    flake.style.left = Math.random() * 100 + "%";

    // 2. 랜덤 크기 (2px ~ 5px) 및 원근감 처리
    const size = Math.random() * 3 + 2;
    flake.style.width = size + "px";
    flake.style.height = size + "px";

    // 3. 원근감: 작을수록 더 투명하고 흐릿하게
    // 크기가 2에 가까우면 투명도 0.4, 5에 가까우면 0.9
    flake.style.opacity = Math.random() * 0.5 + 0.4;

    // 4. 떨어지는 속도 (작은 눈은 천천히, 큰 눈은 빠르게)
    // 10초 ~ 20초 사이 랜덤
    const duration = Math.random() * 10 + 10;
    flake.style.animationDuration = `${duration}s, ${Math.random() * 3 + 2}s`; // fall시간, sway시간(따로 줌)

    // 5. 시작 시간 랜덤 (한꺼번에 쏟아지지 않게)
    flake.style.animationDelay = `-${Math.random() * 20}s, -${
      Math.random() * 5
    }s`;

    container.appendChild(flake);
  }
}
function setupCustomCursor() {
  const cursor = document.getElementById("custom-cursor"),
    glow = document.getElementById("cursor-glow");

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    if (glow) {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }
  });

  // [추가] 어두운 영역(편지지 등)에 마우스가 올라가면 커서 어둡게 변경
  document.querySelectorAll(".dark-cursor-area").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      cursor.classList.add("cursor-dark")
    );
    el.addEventListener("mouseleave", () =>
      cursor.classList.remove("cursor-dark")
    );
  });
}
function setupBGM() {
  bgmAudio = document.getElementById("bgm");
  bgmAudio.volume = 0.5;
  document.body.addEventListener(
    "click",
    () => {
      if (!isBgmPlaying) {
        bgmAudio.play();
        isBgmPlaying = true;
      }
    },
    { once: true }
  );
  document.getElementById("bgm-toggle").addEventListener("click", (e) => {
    e.stopPropagation();
    if (bgmAudio.paused) {
      bgmAudio.play();
      isBgmPlaying = true;
    } else {
      bgmAudio.pause();
      isBgmPlaying = false;
    }
  });
}
function setupMenu() {
  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("menu-overlay").classList.remove("hidden");
    setTimeout(
      () =>
        document.getElementById("menu-overlay").classList.remove("opacity-0"),
      10
    );
  });
  document.getElementById("menu-close").addEventListener("click", closeMenu);
}
function closeMenu() {
  const overlay = document.getElementById("menu-overlay");
  overlay.classList.add("opacity-0");
  setTimeout(() => overlay.classList.add("hidden"), 300);
}
window.handleMenuClick = function (pageId) {
  closeMenu();
  if (pageId === "main") startNewSurvey();
  else goToPage(pageId);
};
function goToPage(pageId) {
  // === [수정됨] Main으로 돌아올 때 '새로고침' 처럼 모든 상태 초기화 ===
  if (pageId === "main") {
    // 1. 작성 중이던 데이터 변수 초기화
    formData = {
      name: "",
      affiliation: "",
      interests: [],
      theme: "",
      title: "",
      content: "",
    };

    // 2. 설문 페이지 입력칸 비우기
    if (document.getElementById("input-name"))
      document.getElementById("input-name").value = "";
    if (document.getElementById("post-title"))
      document.getElementById("post-title").value = "";
    if (document.getElementById("post-content"))
      document.getElementById("post-content").value = "";

    // 3. 버튼 및 체크박스 초기화
    document.querySelectorAll(".aff-btn").forEach((b) => {
      b.classList.remove(
        "active",
        "bg-[#6E1A1A]",
        "text-white",
        "border-[#6E1A1A]"
      );
      b.classList.add("bg-white", "text-[#6E1A1A]/80", "border-[#6E1A1A]/30");
    });
    document
      .querySelectorAll("input[type=checkbox]")
      .forEach((c) => (c.checked = false));

    // 4. 드롭다운 초기화
    const dropSpan = document.querySelector("#theme-dropdown-btn span");
    if (dropSpan) dropSpan.textContent = "주제를 선택해주세요";
    document.getElementById("theme-dropdown-list").classList.add("hidden");

    // 5. 검색창 비우기
    if (document.getElementById("tree-search-input"))
      document.getElementById("tree-search-input").value = "";

    // 6. 트리 각도 초기화 (40도)
    treeAngle = 40;
    updateTreeRotation();
    currentTreeFilter = "";

    // === [중요 추가] 8. 편지 애니메이션 상태 리셋 ===
    // 종이가 다시 봉투 밖으로 나와있게 함
    const paper = document.getElementById("animating-paper");
    if (paper) paper.classList.remove("slide-into-envelope");

    // 열린 봉투는 보이고, 닫힌 봉투는 숨김
    const envOpen = document.getElementById("envelope-open");
    const envClosed = document.getElementById("envelope-closed");
    if (envOpen) envOpen.classList.remove("opacity-0");
    if (envClosed) envClosed.classList.add("opacity-0");

    // 혹시 모달이 떠있다면 숨김
    const waitModal = document.getElementById("waitModal");
    if (waitModal) {
      waitModal.classList.add("hidden");
      waitModal.classList.remove("flex", "opacity-100");
    }
  }
  // ===============================================================

  // 기존 페이지 이동 로직
  const snow = document.getElementById("snow-container");
  if (pageId === "ornament") snow.style.display = "none";
  else snow.style.display = "block";

  document.querySelectorAll(".page-section").forEach((el) => {
    el.classList.remove("active");
    setTimeout(() => {
      if (!el.classList.contains("active")) el.style.display = "none";
    }, 500);
  });

  const target = document.getElementById("page-" + pageId);
  if (!target) return;

  target.style.display = "flex";
  setTimeout(() => target.classList.add("active"), 10);

  if (pageId === "main")
    document.getElementById("menu-toggle").classList.remove("hidden");
  else document.getElementById("menu-toggle").classList.add("hidden");

  if (pageId === "ornament") initOrnamentPage();
  if (pageId === "tree") initTreePage();
  if (pageId === "share_list") renderShareListPage();
  if (pageId === "ranking") renderRankingPage();
  if (pageId === "my_record") renderMyRecordPage();
}

function setupEventListeners() {
  document.querySelectorAll(".aff-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".aff-btn").forEach((b) => {
        b.classList.remove("bg-[#6E1A1A]", "text-white", "border-[#6E1A1A]");
        b.classList.add("bg-white", "text-[#6E1A1A]/80", "border-[#6E1A1A]/30");
      });
      btn.classList.remove(
        "bg-white",
        "text-[#6E1A1A]/80",
        "border-[#6E1A1A]/30"
      );
      btn.classList.add("bg-[#6E1A1A]", "text-white", "border-[#6E1A1A]");
      formData.affiliation = btn.getAttribute("data-value");
      renderThemeOptions(formData.affiliation);
    });
  });
}
function toggleThemeDropdown() {
  document.getElementById("theme-dropdown-list").classList.toggle("hidden");
  document.getElementById("dropdown-arrow").classList.toggle("rotate-180");
}
function renderThemeOptions(affiliation) {
  const container = document.getElementById("theme-dropdown-list");
  container.innerHTML = "";
  let themes =
    affiliation === "교수님"
      ? ["응원", "조언"]
      : ["올해의 추억", "현재의 고민", "미래의 다짐"];
  themes.forEach((theme) => {
    const div = document.createElement("div");
    div.className =
      "px-4 py-2 hover:bg-[#6E1A1A]/10 cursor-pointer text-sm text-[#6E1A1A] border-b border-[#6E1A1A]/10";
    div.textContent = theme;
    div.onclick = () => {
      formData.theme = theme;
      document.querySelector("#theme-dropdown-btn span").textContent = theme;
      toggleThemeDropdown();
    };
    container.appendChild(div);
  });
}
function validateAndGoToGrade() {
  formData.name = document.getElementById("input-name").value || "익명";
  formData.interests = Array.from(
    document.querySelectorAll('input[name="interests"]:checked')
  ).map((cb) => cb.value);
  if (!formData.affiliation || !formData.theme) {
    alert("소속과 테마를 선택해주세요!");
    return;
  }
  if (formData.interests.length === 0) {
    alert("관심분야를 최소 1개 선택해주세요.");
    return;
  }
  document.getElementById(
    "grade-header-subtitle"
  ).textContent = `(${formData.theme})`;
  document.getElementById("display-name").textContent = formData.name;
  document.getElementById("display-affiliation").textContent =
    formData.affiliation;
  document.getElementById("display-theme").textContent = formData.theme;
  goToPage("grade");
}
function goToOrnamentStep() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  if (!title || !content) {
    alert("제목과 내용을 모두 작성해주세요.");
    return;
  }
  formData.title = title;
  formData.content = content;
  document.getElementById("final-message-preview").textContent = content;
  goToPage("animation");
  setTimeout(() => {
    document
      .getElementById("animating-paper")
      .classList.add("slide-into-envelope");
  }, 800);
  setTimeout(() => {
    document.getElementById("envelope-open").classList.add("opacity-0");
    document.getElementById("envelope-closed").classList.remove("opacity-0");
  }, 1600);
  setTimeout(() => {
    const waitModal = document.getElementById("waitModal");
    waitModal.classList.remove("hidden");
    waitModal.classList.add("flex");
    setTimeout(() => {
      waitModal.classList.add("opacity-100");
    }, 50);
    setTimeout(() => {
      waitModal.classList.remove("opacity-100");
      setTimeout(() => {
        waitModal.classList.add("hidden");
        waitModal.classList.remove("flex");
        goToPage("ornament");
      }, 500);
    }, 3000);
  }, 3000);
}

function initOrnamentPage() {
  if (formData.theme.includes("추억") || formData.theme.includes("응원"))
    currentThemeColor = "yellow";
  else if (formData.theme.includes("고민") || formData.theme.includes("조언"))
    currentThemeColor = "red";
  else currentThemeColor = "green";
  const config = ORNAMENT_DATA[currentThemeColor];
  document.getElementById("categoryPill").textContent = config.label;
  document.getElementById("categoryPill").style.backgroundColor = config.accent;
  document.documentElement.style.setProperty("--accent-color", config.accent);
  const shapeRow = document.getElementById("shapeRow");
  shapeRow.innerHTML = "";
  selectedOrnamentSrc = config.patterns[0].cap;
  document.getElementById("mainOrnament").src = selectedOrnamentSrc;
  config.patterns.forEach((p, idx) => {
    const btn = document.createElement("button");
    btn.className = `thumb ${idx === 0 ? "active" : ""}`;
    btn.innerHTML = `<img src="${p.shape}">`;
    btn.onclick = () => {
      selectedOrnamentSrc = p.cap;
      document.getElementById("mainOrnament").src = p.cap;
      document
        .querySelectorAll(".thumb")
        .forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
    };
    shapeRow.appendChild(btn);
  });
}

async function initTreePage() {
  createStars();
  const treeContainer = document.getElementById("tree3d");
  const slotContainer = document.getElementById("slot-container");
  treeContainer.innerHTML = "";
  slotContainer.innerHTML = "";
  for (let i = 0; i < 18; i++) {
    const div = document.createElement("div");
    div.className = "tree-panel";
    div.setAttribute("data-angle", i * 20);
    div.style.transform = `translateX(-100%) rotateY(${i * 20}deg)`;
    div.innerHTML = `<img src="${
      i % 2 === 0
        ? "https://i.imgur.com/mdj2xgd.png"
        : "https://i.imgur.com/n3jhXgf.png"
    }">`;
    treeContainer.appendChild(div);
  }
  updateTreeRotation();
  const result = await gasCall("getPostList", {}, "GET");
  if (result.success) {
    postDataCache = result.data;
    let initialFilter = formData.affiliation || "1학년";
    changeTreeGrade(initialFilter);
  }
  if (formData.title) {
    renderSlotMarkers();
    document.getElementById("treeHint").classList.remove("hidden");
    document.getElementById("grade-selector-container").classList.add("hidden");
  } else {
    document.getElementById("treeHint").classList.add("hidden");
    document
      .getElementById("grade-selector-container")
      .classList.remove("hidden");
  }
}
function updateTreeRotation() {
  document.getElementById(
    "tree3d"
  ).style.transform = `rotateY(${treeAngle}deg)`;
}

function changeTreeGrade(grade) {
  currentTreeFilter = grade;

  // 1. 버튼 스타일 활성화
  document.querySelectorAll(".grade-select-btn").forEach((btn) => {
    if (grade === "merged" && btn.textContent === "전공심화, 교수님")
      btn.classList.add("active-grade");
    else if (btn.textContent.includes(grade) && grade !== "merged")
      btn.classList.add("active-grade");
    else btn.classList.remove("active-grade");
  });

  // 2. 오너먼트 초기화
  document.querySelectorAll(".tree-ornament").forEach((el) => el.remove());

  // 3. 필터링 및 카운트
  let gradeCount = 0;
  const panels = document.querySelectorAll(".tree-panel");

  postDataCache.forEach((post) => {
    let show = false;
    // 필터 조건 확인
    if (currentTreeFilter === "merged") {
      if (post.Affiliation === "전공심화" || post.Affiliation === "교수님")
        show = true;
    } else {
      if (post.Affiliation && post.Affiliation.includes(currentTreeFilter))
        show = true;
    }

    if (show) {
      gradeCount++; // 개수 세기

      // 오너먼트 달기
      if (post.Interests && post.Interests.includes("||ORNAMENT|")) {
        const parts = post.Interests.split("|");
        const src = parts[parts.length - 1];
        const y = parts[parts.length - 2];
        const x = parts[parts.length - 3];
        const panelIdx = parseInt(parts[parts.length - 4]);
        if (panels[panelIdx]) {
          const wrapper = document.createElement("div");
          wrapper.className = "tree-ornament";
          wrapper.style.left = x + "%";
          wrapper.style.top = y + "%";
          wrapper.innerHTML = `<img src="${src}"><div class="ornament-name">${post.Name}</div>`;
          wrapper.style.pointerEvents = "auto";
          wrapper.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            showPostDetail(post.ID);
          };
          panels[panelIdx].appendChild(wrapper);
        }
      }
    }
  });

  // 4. [수정됨] 별 표시 여부만 결정 (메시지는 띄우지 않음)
  const starEl = document.querySelector(".tree-top-star");

  if (starEl) {
    if (gradeCount >= 30) {
      starEl.classList.add("show-star"); // 5명 이상이면 별 보임
    } else {
      starEl.classList.remove("show-star"); // 아니면 숨김
    }
  }
}

function renderExistingOrnaments(posts) {
  const panels = document.querySelectorAll(".tree-panel");
  posts.forEach((post) => {
    let show = false;
    if (currentTreeFilter === "merged") {
      if (post.Affiliation === "전공심화" || post.Affiliation === "교수님")
        show = true;
    } else {
      if (post.Affiliation && post.Affiliation.includes(currentTreeFilter))
        show = true;
    }

    if (show) {
      if (post.Interests && post.Interests.includes("||ORNAMENT|")) {
        const parts = post.Interests.split("|");
        const src = parts[parts.length - 1];
        const y = parts[parts.length - 2];
        const x = parts[parts.length - 3];
        const panelIdx = parseInt(parts[parts.length - 4]);
        if (panels[panelIdx]) {
          const wrapper = document.createElement("div");
          wrapper.className = "tree-ornament";
          wrapper.style.left = x + "%";
          wrapper.style.top = y + "%";
          wrapper.innerHTML = `<img src="${src}"><div class="ornament-name">${post.Name}</div>`;
          wrapper.style.pointerEvents = "auto";
          wrapper.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault(); // 추가 안전장치
            showPostDetail(post.ID);
          };
          panels[panelIdx].appendChild(wrapper);
        }
      }
    }
  });
}

function renderSlotMarkers() {
  const container = document.getElementById("slot-container");
  SLOT_DATA.forEach((data) => {
    const btn = document.createElement("button");
    btn.className = "slot-marker";
    btn.style.left = data.dot.x + "%";
    btn.style.top = data.dot.y + "%";
    btn.textContent = "←";
    btn.onclick = () => handlePlaceOrnament(data.orb);
    container.appendChild(btn);
  });
}

async function handlePlaceOrnament(orbPoint) {
  // 1. 빈 자리 찾기 (기존 로직 유지)
  const occupiedPanelIndices = [];
  postDataCache.forEach((post) => {
    if (post.Affiliation && post.Affiliation.includes(formData.affiliation)) {
      if (post.Interests && post.Interests.includes("||ORNAMENT|")) {
        const parts = post.Interests.split("|");
        const exY = parseFloat(parts[parts.length - 2]);
        const exX = parseFloat(parts[parts.length - 3]);
        const pIdx = parseInt(parts[parts.length - 4]);
        if (Math.abs(exX - orbPoint.x) < 1 && Math.abs(exY - orbPoint.y) < 1)
          occupiedPanelIndices.push(pIdx);
      }
    }
  });

  const availablePanels = [];
  for (let i = 0; i < 18; i++) {
    if (!occupiedPanelIndices.includes(i)) availablePanels.push(i);
  }

  if (availablePanels.length === 0) {
    const limitModal = document.getElementById("limitModal");
    limitModal.classList.remove("hidden");
    limitModal.classList.add("flex");
    return;
  }

  // 2. 오너먼트 미리 달기 및 회전
  const randomPanelIdx =
    availablePanels[Math.floor(Math.random() * availablePanels.length)];
  const panelAngle = randomPanelIdx * 20;

  // [각도 수정] 오너먼트가 정면에서 약간(20도) 틀어져 보이게 설정
  treeAngle = -panelAngle + 20;
  updateTreeRotation();

  const panelEl = document.querySelectorAll(".tree-panel")[randomPanelIdx];
  const wrapper = document.createElement("div");
  wrapper.className = "tree-ornament";
  wrapper.style.left = orbPoint.x + "%";
  wrapper.style.top = orbPoint.y + "%";
  wrapper.innerHTML = `<img src="${selectedOrnamentSrc}"><div class="ornament-name">${formData.name}</div>`;
  panelEl.appendChild(wrapper);

  document.getElementById("loading-msg").textContent = "오너먼트 다는 중...";
  document.getElementById("loading-overlay").classList.remove("hidden");

  // 3. 서버 저장 요청
  const metaStr = `||ORNAMENT|${randomPanelIdx}|${orbPoint.x}|${orbPoint.y}|${selectedOrnamentSrc}`;
  const finalInterests = formData.interests.join(", ") + metaStr;

  await gasCall(
    "savePost",
    {
      name: formData.name,
      affiliation: formData.affiliation,
      interests: finalInterests,
      postType: formData.theme,
      title: formData.title,
      content: formData.content,
    },
    "POST"
  );

  document.getElementById("loading-overlay").classList.add("hidden");
  document.getElementById("loading-msg").textContent = "데이터 처리 중...";

  // 4. 입력 폼 초기화
  formData.title = "";
  document.getElementById("slot-container").innerHTML = "";
  document.getElementById("treeHint").classList.add("hidden");
  document
    .getElementById("grade-selector-container")
    .classList.remove("hidden");

  // 5. 데이터 갱신 및 축하 팝업 체크
  const refresh = await gasCall("getPostList", {}, "GET");

  if (refresh.success) {
    postDataCache = refresh.data;
    changeTreeGrade(formData.affiliation); // 트리 갱신 (별 표시 갱신 포함)

    // 내 학년 오너먼트 개수 세기
    let myGradeCount = 0;
    const myAff = formData.affiliation;

    postDataCache.forEach((p) => {
      if (myAff === "전공심화" || myAff === "교수님") {
        // 전공심화/교수님은 합산
        if (p.Affiliation === "전공심화" || p.Affiliation === "교수님")
          myGradeCount++;
      } else {
        // 그 외 학년은 개별 카운트
        if (p.Affiliation === myAff) myGradeCount++;
      }
    });

    // ▼▼▼ 목표 달성 확인 및 팝업 띄우기 (목표: 39개) ▼▼▼
    if (myGradeCount === 30) {
      const celebratePopup = document.getElementById("star-celebrate-overlay");
      const msgTitle = document.getElementById("star-msg-title");

      if (celebratePopup && msgTitle) {
        // 팝업 문구 설정
        msgTitle.textContent = `${myGradeCount}번째 기록 도착!`;

        // 팝업 보이기
        celebratePopup.classList.remove("hidden");
        celebratePopup.classList.add("flex");

        // 3초 뒤 팝업 숨기기
        setTimeout(() => {
          celebratePopup.classList.remove("flex");
          celebratePopup.classList.add("hidden");
        }, 3000);
      }
    }
  }
}

// [수정] 검색 시 정면 회전 (-(panelIdx * 20))
function searchTreeUser() {
  const name = document.getElementById("tree-search-input").value.trim();
  if (!name) return;
  const found = postDataCache.find((p) => p.Name === name);
  if (found) {
    if (found.Affiliation) changeTreeGrade(found.Affiliation);
    if (found.Interests && found.Interests.includes("||ORNAMENT|")) {
      const parts = found.Interests.split("|");
      const panelIdx = parseInt(parts[parts.length - 4]);
      const targetRotation = -(panelIdx * 20) + 20;
      treeAngle = targetRotation;
      updateTreeRotation();
    }
  } else {
    alert("존재하지 않는 이름입니다");
  }
}

async function gasCall(action, data = {}, method = "POST") {
  if (
    document.getElementById("loading-msg").textContent === "데이터 처리 중..."
  )
    document.getElementById("loading-overlay").classList.remove("hidden");
  try {
    let res;
    if (method === "POST")
      res = await fetch(GAS_WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify({ action, ...data }),
      });
    else
      res = await fetch(
        `${GAS_WEB_APP_URL}?${new URLSearchParams({
          action,
          data: JSON.stringify(data),
        })}`
      );
    return JSON.parse(await res.text());
  } catch (e) {
    console.log(e);
    return { success: false };
  } finally {
    document.getElementById("loading-overlay").classList.add("hidden");
  }
}

// [공통 버튼 스타일] - 기본(투명 유리), 빨강(강조)
const commonBtnClass =
  "bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 flex items-center justify-center transition-all cursor-none border-none shadow-lg";
const redBtnClass =
  "bg-[#C9302C] hover:bg-[#a92522] text-white px-6 py-2 rounded-full flex items-center justify-center transition-all cursor-none border-none shadow-lg font-bold";

async function renderShareListPage() {
  const container = document.getElementById("share-list-container");

  // [수정됨] 새 카드 작성 제거 / 버튼 폰트 고딕체 / 텍스트 Main, Data Tree, Rank로 변경
  container.innerHTML = `
          <div class="text-center mb-10 pt-10">
              <h2 class="text-7xl font-bunga font-normal mb-4 text-[#C5A059]">Share</h2>
              <p class="text-base text-[#C5A059]">"고민이 담긴 카드에 당신의 응원을 선물해주세요."</p>
          </div>
          <div id="post-list-area" class="h-[500px] overflow-y-auto p-4 shadow-xl mb-10 custom-scrollbar">
              <p class="text-center text-white">글 목록을 불러오는 중...</p>
          </div>
          <div class="flex justify-center items-center gap-4 w-full max-w-[800px] mx-auto pb-10 mt-4">
              <button onclick="goToPage('main')" class="${commonBtnClass} font-['Noto_Sans_KR'] text-base">Main</button>
              <button onclick="goToPage('tree')" class="${commonBtnClass} font-['Noto_Sans_KR'] text-base">Data Tree</button>
              <button onclick="goToPage('ranking')" class="${redBtnClass} font-['Noto_Sans_KR']">Rank</button>
          </div>`;

  const res = await gasCall("getPostList", {}, "GET");
  if (res.success) {
    postDataCache = res.data;
    document.getElementById("post-list-area").innerHTML = res.data
      .map(
        (p) =>
          `<div class="share-list-item" onclick="showPostDetail('${p.ID}')"><p class="text-sm text-gray-300 mb-1.5">ID : ${p.Name}</p><p class="text-xl font-bold text-white">Title : ${p.Title}</p></div>`
      )
      .join("");
  }
}

function renderRankingPage() {
  const container = document.getElementById("ranking-container");

  // [수정됨] Share 버튼 추가 (빨간색) / 버튼 폰트 고딕체 / 텍스트 변경
  container.innerHTML = `
        <div class="text-center mb-10 pt-10">
            <h2 class="text-7xl font-bunga font-normal mb-4 text-[#C5A059]">Rank</h2>
            <p class="text-base text-[#C5A059]">"다른 사람들은 어떤 과목에 관심이 있는지 한번 알아보세요"</p>
        </div>
        
        <div class="rank-filter-container">
            <button class="rank-filter-btn active-filter" onclick="filterRanking(this, '')">전체 순위</button>
            <button class="rank-filter-btn" onclick="filterRanking(this, '1학년')">1학년</button>
            <button class="rank-filter-btn" onclick="filterRanking(this, '2학년')">2학년</button>
            <button class="rank-filter-btn" onclick="filterRanking(this, '3학년')">3학년</button>
            <button class="rank-filter-btn" onclick="filterRanking(this, '전공심화')">전공심화</button>
        </div>

        <div id="top-ranking"></div>
        <div id="full-ranking-list" class="custom-scrollbar"></div>
        
        <div class="text-center mt-12 mb-10 relative flex justify-center gap-4" style="z-index: 50;">
            <button onclick="goToPage('main')" class="${commonBtnClass} font-['Noto_Sans_KR'] text-base">Main</button>
            <button onclick="goToPage('tree')" class="${commonBtnClass} font-['Noto_Sans_KR']">Data Tree</button>
            <button onclick="goToPage('share_list')" class="${redBtnClass} font-['Noto_Sans_KR']">Share</button>
        </div>
    `;
  fetchRanking("");
}

async function fetchRanking(filter) {
  const topRankArea = document.getElementById("top-ranking");
  const fullRankList = document.getElementById("full-ranking-list");
  topRankArea.innerHTML = '<p class="text-gray-400">집계 중...</p>';
  fullRankList.innerHTML = "";

  const result = await gasCall(
    "getInterestRanking",
    { affiliation: filter },
    "GET"
  );
  if (result.success && Array.isArray(result.data)) {
    const rankingData = processRankingData(result.data);

    if (rankingData.length === 0) {
      topRankArea.innerHTML = '<p class="text-gray-400">데이터가 없습니다.</p>';
      return;
    }

    // 1~3위 단상
    let top3Html = "";
    if (rankingData[1]) top3Html += createRankCircleHtml(rankingData[1], 2);
    if (rankingData[0]) top3Html += createRankCircleHtml(rankingData[0], 1);
    if (rankingData[2]) top3Html += createRankCircleHtml(rankingData[2], 3);
    topRankArea.innerHTML = top3Html;

    // 4위 이하 리스트
    const remaining = rankingData.slice(3);
    if (remaining.length > 0) {
      fullRankList.innerHTML = remaining
        .map((item, idx) => {
          const isOthers = item.Interest === "기타";
          const tooltipHtml =
            isOthers && item.Details
              ? `<div class="rank-tooltip">${item.Details}</div>`
              : "";

          return `
                <div class="rank-list-item relative">
                    <span class="rank-num">${idx + 4}</span>
                    <span class="rank-name">${item.Interest}</span>
                    <span class="rank-votes">${item.Count}표</span>
                    ${tooltipHtml}
                </div>
            `;
        })
        .join("");
    } else {
      fullRankList.innerHTML =
        '<p class="text-center text-gray-500 text-sm p-4">순위권 밖 데이터 없음</p>';
    }
  } else topRankArea.innerHTML = '<p class="text-red-400">오류 발생</p>';
}

function processRankingData(rawData) {
  const counts = {};
  OFFICIAL_CATEGORIES.forEach((cat) => (counts[cat] = 0));
  const details = { 기타: new Set() };

  rawData.forEach((item) => {
    let name = item.Interest;

    // [중요 수정] 오너먼트 메타데이터 문자열 필터링 (이상한 영어 텍스트 제거)
    if (!name || name.includes("||ORNAMENT") || name.trim() === "") return;

    let cleanName = name.replace(/[\s\/]/g, "").toLowerCase();
    let targetCategory = "기타";

    if (cleanName.includes("브랜드")) targetCategory = "브랜드 디자인";
    else if (cleanName.includes("편집") || cleanName.includes("출판"))
      targetCategory = "편집/출판 디자인";
    else if (cleanName.includes("ui") || cleanName.includes("ux"))
      targetCategory = "UI/UX 디자인";
    else if (
      cleanName.includes("그래픽") ||
      cleanName.includes("일러스트") ||
      cleanName.includes("캐릭터")
    )
      targetCategory = "그래픽/일러스트레이션";
    else if (cleanName.includes("모션") || cleanName.includes("영상"))
      targetCategory = "모션/영상 디자인";
    else if (
      cleanName.includes("3d") ||
      cleanName.includes("제품") ||
      cleanName.includes("비주얼")
    )
      targetCategory = "3D/제품 비주얼라이제이션 디자인";
    else if (cleanName.includes("레터링") || cleanName.includes("활자"))
      targetCategory = "레터링/활자 디자인";
    else targetCategory = "기타";

    if (counts[targetCategory] !== undefined)
      counts[targetCategory] += item.Count;
    if (targetCategory === "기타") details["기타"].add(name);
  });

  return Object.keys(counts)
    .map((key) => ({
      Interest: key,
      Count: counts[key],
      Details: key === "기타" ? Array.from(details["기타"]).join(", ") : "",
    }))
    .filter((item) => item.Count > 0)
    .sort((a, b) => b.Count - a.Count);
}

function createRankCircleHtml(item, rank) {
  const imgUrl =
    RANK_IMAGES[item.Interest] || "https://i.imgur.com/uMsWosV.png";

  const isOthers = item.Interest === "기타";
  // [수정] 툴팁 위치 CSS 클래스로 제어하도록 인라인 스타일 최소화
  const tooltipHtml =
    isOthers && item.Details
      ? `<div class="rank-tooltip">${item.Details}</div>`
      : "";

  return `
        <div class="rank-item-container rank-${rank} rank-list-item">
            <div class="rank-circle-img" style="background-image: url('${imgUrl}') !important;">
                <div class="rank-badge">${rank}</div>
            </div>
            <div class="rank-label">${item.Interest}</div>
            <div class="rank-vote-count">${item.Count}표</div>
            ${tooltipHtml}
        </div>
    `;
}

// [수정-복구] 필터 버튼 활성화 로직 원래대로 (active-filter 클래스만 토글)
window.filterRanking = function (btn, filter) {
  document.querySelectorAll(".rank-filter-btn").forEach((b) => {
    b.classList.remove("active-filter");
  });
  btn.classList.add("active-filter");
  fetchRanking(filter);
};

// [수정] My Record 페이지: 조회 버튼이 깨지지 않도록 whitespace-nowrap 및 w-auto 추가
function renderMyRecordPage() {
  const container = document.getElementById("my-record-container");

  // [수정됨] 버튼 폰트 고딕체 / 텍스트 Main, Data Tree로 변경
  container.innerHTML = `
    <div class="text-center mb-10 pt-10">
        <h2 class="text-7xl font-bunga font-normal mb-4 text-[#C5A059]">My Record</h2>
        <p class="text-base text-[#C5A059]">"내가 남긴 발자취를 확인해보세요."</p>
    </div>
    <div class="max-w-md mx-auto mb-8 flex gap-2 justify-center items-end w-full px-4">
        <input type="text" id="my-id-input" placeholder="작성했던 이름(ID)을 입력하세요" class="flex-1 bg-white/5 border-b border-white/20 text-[#C5A059] text-sm py-3 px-2 focus:outline-none focus:border-[#C5A059] placeholder-white/30 transition-colors font-['Noto_Sans_KR'] cursor-none" style="color: #C5A059 !important;">
        <button onclick="searchMyPosts()" class="${commonBtnClass} whitespace-nowrap w-auto" style="padding: 8px 30px;">조회</button>
    </div>
    <div id="my-post-list-area" class="h-[400px] overflow-y-auto custom-scrollbar">
        <p class="text-center text-white mt-10">아이디를 입력하고 조회 버튼을 눌러주세요.</p>
    </div>
    <div class="text-center mt-12 mb-10 flex justify-center gap-4">
        <button onclick="goToPage('main')" class="${commonBtnClass} font-['Noto_Sans_KR'] text-base">Main</button>
        <button onclick="goToPage('tree')" class="${commonBtnClass} font-['Noto_Sans_KR']">Data Tree</button>
    </div>`;
}
function searchMyPosts() {
  const name = document.getElementById("my-id-input").value.trim();
  const my = postDataCache.filter((p) => p.Name === name);
  document.getElementById("my-post-list-area").innerHTML = my.length
    ? my
        .map(
          (p) =>
            `<div class="share-list-item" onclick="showPostDetail('${
              p.ID
            }')"><p class="text-sm text-gray-300">Date : ${new Date(
              p.Timestamp
            ).toLocaleDateString()}</p><p class="text-xl font-bold text-white">Title : ${
              p.Title
            }</p></div>`
        )
        .join("")
    : `<p class="text-center text-white mt-10">'${name}' 님으로 작성된 글이 없습니다.</p>`;
}

function showPostDetail(id) {
  const post = postDataCache.find((p) => String(p.ID) === String(id));
  if (!post) return;
  document.getElementById("detail-title").textContent = post.Title;
  document.getElementById("detail-id").textContent = `From. ${post.Name}`;
  document.getElementById("detail-content").textContent = post.Content;
  document.getElementById("post-detail-modal").classList.remove("hidden");
  document.getElementById("post-detail-modal").style.display = "flex";
  fetchComments(id);
  document.getElementById("submit-comment-btn").onclick = async () => {
    const n = document.getElementById("comment-name").value,
      c = document.getElementById("comment-input").value;
    if (n && c) {
      await gasCall(
        "saveComment",
        {
          postId: id,
          commenterName: n,
          affiliation: "Visitor",
          commentContent: c,
        },
        "POST"
      );
      document.getElementById("comment-input").value = "";
      fetchComments(id);
    }
  };
}
function closePostModal() {
  document.getElementById("post-detail-modal").classList.add("hidden");
  document.getElementById("post-detail-modal").style.display = "none";
}
async function fetchComments(postId) {
  const list = document.getElementById("comments-list");
  list.innerHTML = "Loading...";
  const res = await gasCall("getComments", { postId }, "GET");
  if (res.success)
    list.innerHTML = res.data
      .map(
        (c) =>
          `<div class="bg-white/10 p-2 rounded text-sm text-white"><span class="text-[#C5A059] font-bold">${c.CommenterName}:</span> ${c.CommentContent}</div>`
      )
      .join("");
}
function createStars() {
  const container = document.getElementById("star-container");
  if (!container) return;
  container.innerHTML = ""; // 초기화

  // 별 100개 생성
  for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.className = "star";

    // 위치 랜덤 (하늘 위쪽에만 뜨도록 top은 0~70% 제한)
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 70 + "%";

    // 크기 랜덤 (1px ~ 3px)
    const size = Math.random() * 2 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";

    // 반짝이는 타이밍을 서로 다르게 설정
    star.style.animationDelay = Math.random() * 5 + "s";

    container.appendChild(star);
  }
}
