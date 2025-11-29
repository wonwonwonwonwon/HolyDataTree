// ▼▼▼ [중요] 배포 후 생성된 새 웹 앱 URL을 아래에 넣으세요 ▼▼▼
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxS1I08N5LvnErn3dbpY2mYgFKEPyx64YsrLEQ3b6rda7lqWOo1ioBuudeYpLprWes/exec";

const OFFICIAL_CATEGORIES = [
  "브랜드 디자인", "편집/출판 디자인", "UI/UX 디자인", "그래픽/일러스트레이션",
  "모션/영상 디자인", "3D/제품 디자인", "레터링/활자 디자인", "기타",
];
const RANK_IMAGES = {
  "브랜드 디자인": "https://i.imgur.com/vANoYXL.png",
  "편집/출판 디자인": "https://i.imgur.com/paP8tuF.png",
  "UI/UX 디자인": "https://i.imgur.com/XuB5tfQ.png",
  "그래픽/일러스트레이션": "https://i.imgur.com/nIMBg6v.png",
  "모션/영상 디자인": "https://i.imgur.com/0Rx7qHP.png",
  "3D/제품 디자인": "https://i.imgur.com/QJfhdY9.png",
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
    label: "추억", accent: "#f5b400",
    patterns: [
      { cap: "https://i.imgur.com/bQ7Rfza.png", shape: "https://i.imgur.com/zKtjAX7.png" },
      { cap: "https://i.imgur.com/BCSPZE1.png", shape: "https://i.imgur.com/hD4oE1b.png" },
      { cap: "https://i.imgur.com/TdV7sJm.png", shape: "https://i.imgur.com/bHbSqx3.png" },
      { cap: "https://i.imgur.com/pWkO6qb.png", shape: "https://i.imgur.com/SjnAzAJ.png" },
      { cap: "https://i.imgur.com/AdlhJN0.png", shape: "https://i.imgur.com/6uiU5YA.png" },
      { cap: "https://i.imgur.com/LwpNDIR.png", shape: "https://i.imgur.com/ujYQOfU.png" },
    ],
  },
  red: {
    label: "고민", accent: "#c63926",
    patterns: [
      { cap: "https://i.imgur.com/hkHu9Eb.png", shape: "https://i.imgur.com/VPnVPam.png" },
      { cap: "https://i.imgur.com/HnPoieL.png", shape: "https://i.imgur.com/Un0xHIP.png" },
      { cap: "https://i.imgur.com/3meCnRR.png", shape: "https://i.imgur.com/qQkixfI.png" },
      { cap: "https://i.imgur.com/xfCzHIu.png", shape: "https://i.imgur.com/JWSjR9n.png" },
      { cap: "https://i.imgur.com/6G4J6xV.png", shape: "https://i.imgur.com/TZx9lSj.png" },
      { cap: "https://i.imgur.com/8OJgTRS.png", shape: "https://i.imgur.com/9AT23K3.png" },
    ],
  },
  green: {
    label: "다짐", accent: "#01c6cd",
    patterns: [
      { cap: "https://i.imgur.com/q6d9qMg.png", shape: "https://i.imgur.com/57dM8PS.png" },
      { cap: "https://i.imgur.com/0m62Uic.png", shape: "https://i.imgur.com/BQOqZMO.png" },
      { cap: "https://i.imgur.com/LBTty3f.png", shape: "https://i.imgur.com/b8aUxEk.png" },
      { cap: "https://i.imgur.com/VAqncS6.png", shape: "https://i.imgur.com/vgtcsuV.png" },
      { cap: "https://i.imgur.com/H0MDosO.png", shape: "https://i.imgur.com/di8bXGL.png" },
      { cap: "https://i.imgur.com/wJOtZWG.png", shape: "https://i.imgur.com/DIU5tmp.png" },
    ],
  },
};

let formData = { name: "", affiliation: "", interests: [], theme: "", title: "", content: "", phoneNumber: "", consent: false };
let postDataCache = [];
let bgmAudio = null, isBgmPlaying = false;
let currentThemeColor = "yellow", selectedOrnamentSrc = "", treeAngle = 20, currentTreeFilter = "";
let currentShareFilter = "전체"; 

document.addEventListener("DOMContentLoaded", () => {
  try {
    if (typeof lucide !== "undefined" && lucide.createIcons) lucide.createIcons();
  } catch (e) {}

  createSnow();
  setupCustomCursor();
  setupBGM();
  setupEventListeners();
  setupMenu();

  const treeScene = document.getElementById("scene");
  let touchStartX = 0;
  let initialTreeAngle = 0;

  if (treeScene) {
    treeScene.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        initialTreeAngle = treeAngle;
      }, { passive: true });
    treeScene.addEventListener("touchmove", (e) => {
        const touchCurrentX = e.touches[0].clientX;
        const diffX = touchCurrentX - touchStartX;
        treeAngle = initialTreeAngle + diffX * 0.5;
        updateTreeRotation();
      }, { passive: true });
  }

  const goTreeBtn = document.getElementById("goTreeButton");
  if(goTreeBtn) {
      goTreeBtn.addEventListener("click", () => {
        if (!selectedOrnamentSrc) return alert("오너먼트를 선택해주세요.");
        goToPage("tree");
      });
  }

  const leftBtn = document.getElementById("arrow-left");
  if(leftBtn) leftBtn.addEventListener("click", () => { treeAngle -= 30; updateTreeRotation(); });
  
  const rightBtn = document.getElementById("arrow-right");
  if(rightBtn) rightBtn.addEventListener("click", () => { treeAngle += 30; updateTreeRotation(); });

  const limitClose = document.getElementById("limitCloseBtn");
  if(limitClose) {
      limitClose.addEventListener("click", () => {
        document.getElementById("limitModal").classList.add("hidden");
        document.getElementById("limitModal").classList.remove("flex");
      });
  }

  goToPage("main");
  startMainPageStats(); 
});

// ▼▼▼ [수정됨] 이벤트 토글 함수 (전역 위치로 이동) ▼▼▼
function toggleEventInputs() {
  const isJoined = document.getElementById("event-join-check").checked;
  const inputArea = document.getElementById("event-inputs");
  if(isJoined) {
    inputArea.classList.remove("hidden");
  } else {
    inputArea.classList.add("hidden");
    // 닫을 때 값 초기화
    document.getElementById("input-phone").value = "";
    document.getElementById("consent-check").checked = false;
  }
}
// ▲▲▲ [수정 완료] ▲▲▲

function startNewSurvey() {
  formData = { name: "", affiliation: "", interests: [], theme: "", title: "", content: "", phoneNumber: "", consent: false };
  const inputName = document.getElementById("input-name");
  if(inputName) inputName.value = "";
  
  document.querySelectorAll(".aff-btn").forEach((b) => {
    b.classList.remove("active", "bg-[#6E1A1A]", "text-white");
    b.classList.add("bg-white", "text-[#6E1A1A]/80");
  });
  document.querySelectorAll("input[type=checkbox]").forEach((c) => (c.checked = false));
  
  const themeList = document.getElementById("theme-dropdown-list");
  if(themeList) themeList.classList.add("hidden");
  
  const themeBtnSpan = document.querySelector("#theme-dropdown-btn span");
  if(themeBtnSpan) themeBtnSpan.textContent = "눌러서 주제 선택!";
  
  const pTitle = document.getElementById("post-title");
  if(pTitle) pTitle.value = "";
  
  const pContent = document.getElementById("post-content");
  if(pContent) pContent.value = "";
  
  const gradeContainer = document.getElementById("grade-selector-container");
  if(gradeContainer) gradeContainer.classList.add("hidden");
  
  const treeHint = document.getElementById("treeHint");
  if(treeHint) treeHint.classList.add("hidden");
  
  // 이벤트 섹션 초기화
  const joinCheck = document.getElementById("event-join-check");
  if(joinCheck) {
      joinCheck.checked = false;
      toggleEventInputs(); 
  }

  goToPage("common");
}

function createSnow() {
  const container = document.getElementById("snow-container");
  if (!container) return;
  container.innerHTML = "";
  const snowflakeCount = 80;
  for (let i = 0; i < snowflakeCount; i++) {
    const flake = document.createElement("div");
    flake.className = "snowflake";
    flake.style.left = Math.random() * 100 + "%";
    const size = Math.random() * 3 + 2;
    flake.style.width = size + "px";
    flake.style.height = size + "px";
    flake.style.opacity = Math.random() * 0.5 + 0.4;
    const duration = Math.random() * 10 + 10;
    flake.style.animationDuration = `${duration}s, ${Math.random() * 3 + 2}s`;
    flake.style.animationDelay = `-${Math.random() * 20}s, -${Math.random() * 5}s`;
    container.appendChild(flake);
  }
}

function setupCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  const glow = document.getElementById("cursor-glow");
  if(!cursor) return;
  
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    if (glow) {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }
  });
  document.querySelectorAll(".dark-cursor-area").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("cursor-dark"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-dark"));
  });
}

function setupBGM() {
  bgmAudio = document.getElementById("bgm");
  if(!bgmAudio) return;
  bgmAudio.volume = 0.5;
  document.body.addEventListener("click", () => {
      if (!isBgmPlaying) {
        bgmAudio.play();
        isBgmPlaying = true;
      }
    }, { once: true });
  
  const toggleBtn = document.getElementById("bgm-toggle");
  if(toggleBtn) {
      toggleBtn.addEventListener("click", (e) => {
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
}

function setupMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  if(menuToggle) {
      menuToggle.addEventListener("click", () => {
        const overlay = document.getElementById("menu-overlay");
        overlay.classList.remove("hidden");
        setTimeout(() => overlay.classList.remove("opacity-0"), 10);
      });
  }
  const menuClose = document.getElementById("menu-close");
  if(menuClose) menuClose.addEventListener("click", closeMenu);
}

function closeMenu() {
  const overlay = document.getElementById("menu-overlay");
  if(overlay) {
      overlay.classList.add("opacity-0");
      setTimeout(() => overlay.classList.add("hidden"), 300);
  }
}

window.handleMenuClick = function (pageId) {
  closeMenu();
  if (pageId === "main") startNewSurvey();
  else goToPage(pageId);
};

function goToPage(pageId) {
  if (pageId === "main") {
    // Main 초기화 로직
    formData = { name: "", affiliation: "", interests: [], theme: "", title: "", content: "" };
    
    const iName = document.getElementById("input-name");
    if(iName) iName.value = "";
    const pTitle = document.getElementById("post-title");
    if(pTitle) pTitle.value = "";
    const pContent = document.getElementById("post-content");
    if(pContent) pContent.value = "";

    document.querySelectorAll(".aff-btn").forEach((b) => {
      b.classList.remove("active", "bg-[#6E1A1A]", "text-white", "border-[#6E1A1A]");
      b.classList.add("bg-white", "text-[#6E1A1A]/80", "border-[#6E1A1A]/30");
    });
    document.querySelectorAll("input[type=checkbox]").forEach((c) => (c.checked = false));

    const dropSpan = document.querySelector("#theme-dropdown-btn span");
    if (dropSpan) dropSpan.textContent = "주제를 선택해주세요";
    const dropList = document.getElementById("theme-dropdown-list");
    if(dropList) dropList.classList.add("hidden");

    const searchInput = document.getElementById("tree-search-input");
    if (searchInput) searchInput.value = "";

    treeAngle = 40;
    updateTreeRotation();
    currentTreeFilter = "";

    const paper = document.getElementById("animating-paper");
    if (paper) paper.classList.remove("slide-into-envelope");

    const envOpen = document.getElementById("envelope-open");
    const envClosed = document.getElementById("envelope-closed");
    if (envOpen) envOpen.classList.remove("opacity-0");
    if (envClosed) envClosed.classList.add("opacity-0");

    const waitModal = document.getElementById("waitModal");
    if (waitModal) {
      waitModal.classList.add("hidden");
      waitModal.classList.remove("flex", "opacity-100");
    }
  }

  // 눈 내리는 효과 제어
  const snow = document.getElementById("snow-container");
  if(snow) {
      if (pageId === "main" || pageId === "tree") snow.style.display = "block";
      else snow.style.display = "none";
  }

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

  const mToggle = document.getElementById("menu-toggle");
  if(mToggle) {
      if (pageId === "main") mToggle.classList.remove("hidden");
      else mToggle.classList.add("hidden");
  }

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
      btn.classList.remove("bg-white", "text-[#6E1A1A]/80", "border-[#6E1A1A]/30");
      btn.classList.add("bg-[#6E1A1A]", "text-white", "border-[#6E1A1A]");
      
      formData.affiliation = btn.getAttribute("data-value");
      renderThemeOptions(formData.affiliation);

      // 소속에 따른 문구 변경
      const q4Desc = document.getElementById("q4-description");
      if (q4Desc) {
        if (formData.affiliation === "교수님") {
          q4Desc.textContent = "학생들에게 따뜻한 응원과 조언을 나눠주시고 더 훈훈한 연말 보내세요!";
        } else {
          q4Desc.textContent = "마음 한 조각 트리에 걸어두고, 조금 더 홀가분한 연말 보내세요.";
        }
      }
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
  let themes = affiliation === "교수님"
      ? ["응원", "조언"]
      : ["올해의 추억", "현재의 고민", "미래의 다짐"];
  
  themes.forEach((theme) => {
    const div = document.createElement("div");
    div.className = "px-4 py-2 hover:bg-[#6E1A1A]/10 cursor-pointer text-sm text-[#6E1A1A] border-b border-[#6E1A1A]/10";
    div.textContent = theme;
    div.onclick = () => {
      formData.theme = theme;
      document.querySelector("#theme-dropdown-btn span").textContent = theme;
      toggleThemeDropdown();
    };
    container.appendChild(div);
  });
}

// ▼▼▼ [수정됨] 유효성 검사 로직 (전화번호/동의 추가) ▼▼▼
function validateAndGoToGrade() {
  const iName = document.getElementById("input-name");
  formData.name = (iName && iName.value) ? iName.value : "익명";
  
  formData.interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map((cb) => cb.value);
  
  if (!formData.affiliation || !formData.theme) {
    alert("소속과 테마를 선택해주세요!");
    return;
  }
  if (formData.interests.length === 0) {
    alert("관심분야를 최소 1개 선택해주세요.");
    return;
  }
  
  const isJoined = document.getElementById("event-join-check").checked;
  if (isJoined) {
      const phoneInput = document.getElementById("input-phone").value.trim();
      const consentCheck = document.getElementById("consent-check").checked;

      // 간단한 전화번호 포맷 체크 (선택사항)
      if (!phoneInput) {
          alert("이벤트 참가를 위해 전화번호를 입력해주세요.");
          return;
      }
      if (!consentCheck) {
          alert("개인정보 수집 및 이용에 동의해주세요.");
          return;
      }
      formData.phoneNumber = phoneInput;
      formData.consent = true;
  } else {
      formData.phoneNumber = "";
      formData.consent = false;
  }

  document.getElementById("grade-header-subtitle").textContent = `(${formData.theme})`;
  document.getElementById("display-name").textContent = formData.name;
  document.getElementById("display-affiliation").textContent = formData.affiliation;
  document.getElementById("display-theme").textContent = formData.theme;
  
  goToPage("grade");
}
// ▲▲▲ [수정 완료] ▲▲▲

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
    document.getElementById("animating-paper").classList.add("slide-into-envelope");
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
  if (formData.theme.includes("추억") || formData.theme.includes("응원")) currentThemeColor = "yellow";
  else if (formData.theme.includes("고민") || formData.theme.includes("조언")) currentThemeColor = "red";
  else currentThemeColor = "green";
  
  const config = ORNAMENT_DATA[currentThemeColor];
  const catPill = document.getElementById("categoryPill");
  catPill.textContent = config.label;
  catPill.style.backgroundColor = config.accent;
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
      document.querySelectorAll(".thumb").forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
    };
    shapeRow.appendChild(btn);
  });
}

async function initTreePage() {
  createStars();
  const treeContainer = document.getElementById("tree3d");
  const slotContainer = document.getElementById("slot-container");
  const hintEl = document.getElementById("treeHint");

  treeContainer.innerHTML = "";
  slotContainer.innerHTML = "";
  hintEl.classList.add("hidden");

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
    // 글 쓰고 온 경우
    renderSlotMarkers();
    hintEl.innerHTML = "트리의 빨간 점을 눌러<br>오너먼트 위치를 고르세요";
    hintEl.classList.remove("hidden");
    document.getElementById("grade-selector-container").classList.add("hidden");
  } else {
    // 그냥 구경 온 경우
    document.getElementById("grade-selector-container").classList.remove("hidden");
  }
}

function updateTreeRotation() {
  document.getElementById("tree3d").style.transform = `rotateY(${treeAngle}deg)`;
}

function changeTreeGrade(grade) {
  currentTreeFilter = grade;
  document.querySelectorAll(".grade-select-btn").forEach((btn) => {
    btn.classList.remove("active-grade");
    const btnText = btn.textContent.trim();
    if (grade === "merged") {
      if (btnText.includes("전공심화")) btn.classList.add("active-grade");
    } else {
      if (btnText.includes(grade)) btn.classList.add("active-grade");
    }
  });

  document.querySelectorAll(".tree-ornament").forEach((el) => el.remove());
  let gradeCount = 0;
  const panels = document.querySelectorAll(".tree-panel");

  postDataCache.forEach((post) => {
    let show = false;
    if (currentTreeFilter === "merged") {
      if (post.Affiliation === "전공심화" || post.Affiliation === "교수님") show = true;
    } else {
      if (post.Affiliation && post.Affiliation.includes(currentTreeFilter)) show = true;
    }

    if (show) {
      gradeCount++;
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

  const starEl = document.querySelector(".tree-top-star");
  if (starEl) {
    if (gradeCount >= 30) starEl.classList.add("show-star");
    else starEl.classList.remove("show-star");
  }
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

// ▼▼▼ [수정됨] 데이터 전송 (전화번호/동의 포함) ▼▼▼
async function handlePlaceOrnament(orbPoint) {
  // 1. 빈 자리 찾기
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

  // 3. 서버 저장 요청 (수정됨: phoneNumber, consent 추가)
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
      phoneNumber: formData.phoneNumber, 
      consent: formData.consent
    },
    "POST"
  );

  // 4. 로딩 종료 및 입력 폼 초기화
  document.getElementById("loading-overlay").classList.add("hidden");
  document.getElementById("loading-msg").textContent = "데이터 처리 중...";
  
  formData.title = "";
  document.getElementById("slot-container").innerHTML = "";
  document.getElementById("treeHint").classList.add("hidden");
  document
    .getElementById("grade-selector-container")
    .classList.remove("hidden");

  // 배너 로직
  const bannerEl = document.getElementById("star-promo-banner");
  if (bannerEl) {
    bannerEl.classList.add("hidden");
    bannerEl.classList.remove("opacity-100");

    setTimeout(() => {
        bannerEl.classList.remove("hidden");
        setTimeout(() => bannerEl.classList.add("opacity-100"), 50);
    }, 1000);

    setTimeout(() => {
        bannerEl.classList.remove("opacity-100");
        setTimeout(() => bannerEl.classList.add("hidden"), 1000);
    }, 6000);
  }

  // 5. 데이터 갱신
  const refresh = await gasCall("getPostList", {}, "GET");

  if (refresh.success) {
    postDataCache = refresh.data;
    changeTreeGrade(formData.affiliation); // 트리 갱신

    let myGradeCount = 0;
    const myAff = formData.affiliation;

    postDataCache.forEach((p) => {
      if (myAff === "전공심화" || myAff === "교수님") {
        if (p.Affiliation === "전공심화" || p.Affiliation === "교수님")
          myGradeCount++;
      } else {
        if (p.Affiliation === myAff) myGradeCount++;
      }
    });

    if (myGradeCount === 30) {
      const celebratePopup = document.getElementById("star-celebrate-overlay");
      const msgTitle = document.getElementById("star-msg-title");

      if (celebratePopup && msgTitle) {
        msgTitle.textContent = `${myGradeCount}번째 기록 도착!`;
        celebratePopup.classList.remove("hidden");
        celebratePopup.classList.add("flex");

        setTimeout(() => {
          celebratePopup.classList.remove("flex");
          celebratePopup.classList.add("hidden");
        }, 3000);
      }
    }
  }
}

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
  if (document.getElementById("loading-msg").textContent === "데이터 처리 중...")
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

const commonBtnClass = "bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 flex items-center justify-center transition-all cursor-none border-none shadow-lg";
const redBtnClass = "bg-[#C9302C] hover:bg-[#a92522] text-white px-6 py-2 rounded-full flex items-center justify-center transition-all cursor-none border-none shadow-lg font-bold";

async function renderShareListPage() {
  const container = document.getElementById("share-list-container");

  container.innerHTML = `
      <div class="text-center mb-6 pt-10">
          <h2 class="text-7xl font-bunga font-normal mb-4 text-[#C5A059]">Share</h2>
          <p class="text-base text-[#C5A059]">"모두의 카드에 당신의 따듯한 한마디를 남겨주세요."</p>
      </div>

      <div class="rank-filter-container flex justify-center gap-6 mb-4 overflow-x-auto px-4 w-full" style="min-height:40px;">
          <button class="rank-filter-btn ${currentShareFilter === '전체' ? 'active-filter' : ''}" onclick="filterShareList('전체')">전체</button>
          <button class="rank-filter-btn ${currentShareFilter === '추억' ? 'active-filter' : ''}" onclick="filterShareList('추억')">추억</button>
          <button class="rank-filter-btn ${currentShareFilter === '고민' ? 'active-filter' : ''}" onclick="filterShareList('고민')">고민</button>
          <button class="rank-filter-btn ${currentShareFilter === '다짐' ? 'active-filter' : ''}" onclick="filterShareList('다짐')">다짐</button>
          <button class="rank-filter-btn ${currentShareFilter === '응원' ? 'active-filter' : ''}" onclick="filterShareList('응원')">응원</button>
          <button class="rank-filter-btn ${currentShareFilter === '조언' ? 'active-filter' : ''}" onclick="filterShareList('조언')">조언</button>
      </div>

      <div id="post-list-area" class="h-[450px] overflow-y-auto p-4 shadow-xl mb-10 custom-scrollbar w-[85%] max-w-[800px] mx-auto bg-[#0b0f20d9] rounded-2xl border border-white/10 backdrop-blur-sm">
          <p class="text-center text-white mt-10">글 목록을 불러오는 중...</p>
      </div>

      <div class="flex justify-center items-center gap-4 w-full max-w-[800px] mx-auto pb-10 mt-4 relative z-50">
          <button onclick="goToPage('main')" class="${commonBtnClass} font-['Noto_Sans_KR'] text-base">Main</button>
          <button onclick="goToPage('tree')" class="${commonBtnClass} font-['Noto_Sans_KR'] text-base">Data Tree</button>
          <button onclick="goToPage('ranking')" class="${redBtnClass} font-['Noto_Sans_KR']">Favorites</button>
      </div>`;

  if (postDataCache.length === 0) {
    const res = await gasCall("getPostList", {}, "GET");
    if (res.success) {
      postDataCache = res.data;
    }
  }
  
  renderShareListItems();
}

window.filterShareList = function(filterType) {
  currentShareFilter = filterType;
  
  const buttons = document.querySelectorAll('#share-list-container .rank-filter-btn');
  buttons.forEach(btn => {
    if(btn.textContent.trim() === filterType) btn.classList.add('active-filter');
    else btn.classList.remove('active-filter');
  });

  renderShareListItems();
};

function renderShareListItems() {
  const listArea = document.getElementById("post-list-area");
  if (!postDataCache || postDataCache.length === 0) {
    listArea.innerHTML = '<p class="text-center text-white mt-10">불러올 글이 없습니다.</p>';
    return;
  }

  const filtered = postDataCache.filter(p => {
    if (currentShareFilter === "전체") return true;
    
    const type = p.PostType || ""; 
    
    if (currentShareFilter === "추억") return type.includes("추억");
    if (currentShareFilter === "고민") return type.includes("고민");
    if (currentShareFilter === "다짐") return type.includes("다짐");
    if (currentShareFilter === "응원") return type.includes("응원");
    if (currentShareFilter === "조언") return type.includes("조언");
    
    return false;
  });

  if (filtered.length === 0) {
    listArea.innerHTML = `<p class="text-center text-gray-400 mt-10 text-sm font-['Noto_Sans_KR']">'${currentShareFilter}' 주제의 글이 없습니다.</p>`;
    return;
  }

  listArea.innerHTML = filtered.map(p => `
    <div class="share-list-item block w-full text-left mb-2 p-4 rounded-lg hover:bg-white/10 transition-colors border-b border-white/10 cursor-none" onclick="showPostDetail('${p.ID}')">
      <div class="flex justify-between items-end mb-1">
        <span class="text-xs text-[#C5A059] border border-[#C5A059] px-2 py-0.5 rounded-full font-['Noto_Sans_KR']">${p.PostType || '기타'}</span>
        <span class="text-xs text-gray-400 font-['Noto_Sans_KR']">닉네임 : ${p.Name}</span>
      </div>
      <p class="text-lg font-bold text-white truncate font-['Noto_Sans_KR'] mt-1">제목 : ${p.Title}</p>
    </div>
  `).join("");
}

function renderRankingPage() {
  const container = document.getElementById("ranking-container");
  container.innerHTML = `
        <div class="text-center mb-6 pt-10">
            <h2 class="text-7xl font-bunga font-normal mb-2 text-[#C5A059]">Favorites</h2>
            <p class="text-sm text-[#C5A059] leading-relaxed font-['Noto_Sans_KR']">
              "다른 사람들은 어떤 과목에 관심이 있는지<br class="mobile-br"> 한번 알아보세요"
            </p>
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
        
        <div class="text-center mt-8 mb-10 relative flex justify-center gap-4" style="z-index: 50;">
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

  const result = await gasCall("getInterestRanking", { affiliation: filter }, "GET");
  if (result.success && Array.isArray(result.data)) {
    const rankingData = processRankingData(result.data);

    if (rankingData.length === 0) {
      topRankArea.innerHTML = '<p class="text-gray-400">데이터가 없습니다.</p>';
      return;
    }

    let top3Html = "";
    if (rankingData[1]) top3Html += createRankCircleHtml(rankingData[1], 2);
    if (rankingData[0]) top3Html += createRankCircleHtml(rankingData[0], 1);
    if (rankingData[2]) top3Html += createRankCircleHtml(rankingData[2], 3);
    topRankArea.innerHTML = top3Html;

    const remaining = rankingData.slice(3);
    if (remaining.length > 0) {
      fullRankList.innerHTML = remaining
        .map((item, idx) => {
          const isOthers = item.Interest === "기타";
          const tooltipHtml = (isOthers && item.Details) ? `<div class="rank-tooltip">${item.Details}</div>` : "";
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
      fullRankList.innerHTML = '<p class="text-center text-gray-500 text-sm p-4">순위권 밖 데이터 없음</p>';
    }
  } else topRankArea.innerHTML = '<p class="text-red-400">오류 발생</p>';
}

function processRankingData(rawData) {
  const counts = {};
  OFFICIAL_CATEGORIES.forEach((cat) => (counts[cat] = 0));
  const details = { 기타: new Set() };

  rawData.forEach((item) => {
    let name = item.Interest;
    if (!name || name.includes("||ORNAMENT") || name.trim() === "") return;
    let cleanName = name.replace(/[\s\/]/g, "").toLowerCase();
    let targetCategory = "기타";

    if (cleanName.includes("브랜드")) targetCategory = "브랜드 디자인";
    else if (cleanName.includes("편집") || cleanName.includes("출판")) targetCategory = "편집/출판 디자인";
    else if (cleanName.includes("ui") || cleanName.includes("ux")) targetCategory = "UI/UX 디자인";
    else if (cleanName.includes("그래픽") || cleanName.includes("일러스트") || cleanName.includes("캐릭터")) targetCategory = "그래픽/일러스트레이션";
    else if (cleanName.includes("모션") || cleanName.includes("영상")) targetCategory = "모션/영상 디자인";
    else if (cleanName.includes("3d") || cleanName.includes("제품") || cleanName.includes("비주얼")) targetCategory = "3D/제품 디자인";
    else if (cleanName.includes("레터링") || cleanName.includes("활자")) targetCategory = "레터링/활자 디자인";
    else targetCategory = "기타";

    if (counts[targetCategory] !== undefined) counts[targetCategory] += item.Count;
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
  const imgUrl = RANK_IMAGES[item.Interest] || "https://i.imgur.com/uMsWosV.png";
  const isOthers = item.Interest === "기타";
  const tooltipHtml = (isOthers && item.Details) ? `<div class="rank-tooltip">${item.Details}</div>` : "";
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

window.filterRanking = function (btn, filter) {
  document.querySelectorAll(".rank-filter-btn").forEach((b) => {
    b.classList.remove("active-filter");
  });
  btn.classList.add("active-filter");
  fetchRanking(filter);
};

async function renderMyRecordPage() {
  const container = document.getElementById("my-record-container");
  container.innerHTML = `
    <div class="text-center mb-10 pt-10">
        <h2 class="text-7xl font-bunga font-normal mb-4 text-[#C5A059]">Our Record</h2>
        <p class="text-base text-[#C5A059]">"모두가 남긴 발자취를 확인해보세요."</p>
    </div>
    <div class="max-w-md mx-auto mb-8 flex gap-2 justify-center items-end w-full px-4">
        <input type="text" id="my-id-input" placeholder="작성했던 닉네임을 입력하세요" class="flex-1 bg-white/5 border-b border-white/20 text-[#C5A059] text-sm py-3 px-2 focus:outline-none focus:border-[#C5A059] placeholder-white/30 transition-colors font-['Noto_Sans_KR'] cursor-none" style="color: #C5A059 !important;">
        <button onclick="searchMyPosts()" class="${commonBtnClass} whitespace-nowrap w-auto" style="padding: 8px 30px;">조회</button>
    </div>
    <div id="my-post-list-area" class="h-[400px] overflow-y-auto custom-scrollbar">
        <p class="text-center text-white mt-10">데이터를 불러오는 중입니다...</p>
    </div>
    <div class="text-center mt-12 mb-10 flex justify-center gap-4">
        <button onclick="goToPage('main')" class="${commonBtnClass} font-['Noto_Sans_KR'] text-base">Main</button>
        <button onclick="goToPage('tree')" class="${commonBtnClass} font-['Noto_Sans_KR']">Data Tree</button>
    </div>`;

  if (postDataCache.length === 0) {
    const result = await gasCall("getPostList", {}, "GET");
    if (result.success) {
      postDataCache = result.data;
      document.getElementById("my-post-list-area").innerHTML = `<p class="text-center text-white mt-10">닉네임 입력하고 조회 버튼을 눌러주세요.</p>`;
    } else {
      document.getElementById("my-post-list-area").innerHTML = `<p class="text-center text-red-400 mt-10">데이터를 불러오지 못했습니다.</p>`;
    }
  } else {
    document.getElementById("my-post-list-area").innerHTML = `<p class="text-center text-white mt-10">아이디를 입력하고 조회 버튼을 눌러주세요.</p>`;
  }
}

function searchMyPosts() {
  const name = document.getElementById("my-id-input").value.trim();
  const my = postDataCache.filter((p) => p.Name === name);
  document.getElementById("my-post-list-area").innerHTML = my.length
    ? my
        .map(
          (p) =>
            `<div class="share-list-item" onclick="showPostDetail('${p.ID}')"><p class="text-sm text-gray-300">Date : ${new Date(p.Timestamp).toLocaleDateString()}</p><p class="text-xl font-bold text-white">Title : ${p.Title}</p></div>`
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
      await gasCall("saveComment", { postId: id, commenterName: n, affiliation: "Visitor", commentContent: c }, "POST");
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
      .map((c) => `<div class="bg-white/10 p-2 rounded text-sm text-white"><span class="text-[#C5A059] font-bold">${c.CommenterName}:</span> ${c.CommentContent}</div>`)
      .join("");
}

function createStars() {
  const container = document.getElementById("star-container");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 70 + "%";
    const size = Math.random() * 2 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.animationDelay = Math.random() * 5 + "s";
    container.appendChild(star);
  }
}

let statInterval = null;

async function startMainPageStats() {
  const statText = document.getElementById("participation-stat-text");
  if (!statText) return;

  if (postDataCache.length === 0) {
    const res = await gasCall("getPostList", {}, "GET");
    if (res.success) postDataCache = res.data;
  }

  let count1 = 0, count2 = 0, count3 = 0, countProf = 0, countTotal = 0;
  postDataCache.forEach(p => {
    if (p.Affiliation) {
      if (p.Affiliation.includes("1학년")) count1++;
      else if (p.Affiliation.includes("2학년")) count2++;
      else if (p.Affiliation.includes("3학년")) count3++;
      else if (p.Affiliation === "교수님") countProf++;
      
      if (p.Affiliation !== "교수님") countTotal++;
    }
  });

  const messages = [
    `~ 지금까지 1학년 ${count1}명이 함께했어요! ~`,
    `~ 지금까지 2학년 ${count2}명이 함께했어요! ~`,
    `~ 지금까지 3학년 ${count3}명이 함께했어요! ~`,
    `~ 지금까지 교수님 ${countProf}분이 응원과 조언을 남겨주셨어요! ~`,
    `~ 지금까지 시각디자인 학과 학생들 중 ${countTotal}명이 함께했어요! ~`
  ];

  let msgIdx = 0;

  statText.textContent = messages[0];

  if (statInterval) clearInterval(statInterval);

  statInterval = setInterval(() => {
    statText.classList.remove("opacity-90");
    statText.classList.add("opacity-0");

    setTimeout(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      statText.textContent = messages[msgIdx];

      statText.classList.remove("opacity-0");
      statText.classList.add("opacity-90");
    }, 1000); 

  }, 5000); 
}