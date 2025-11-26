// === 설정 (지혜님 API) ===
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyvbLW5WgbxUCbNVw4EpETNotU25LD8YjikIDVSUCJySiBFICBjKbxFgDz6M5hen83u4g/exec"; 

// === 상태 변수 ===
let formData = {
    name: '',
    affiliation: '',
    interests: [],
    theme: '',
    title: '',
    content: ''
};
let postDataCache = [];
let bgmAudio = null;
let isBgmPlaying = false;

// === 초기화 ===
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    } catch (e) {}

    createSnow();
    setupEventListeners();
    setupBGM(); 
    setupMenu(); 
    setupCustomCursor();
    
    document.getElementById('menu-toggle').classList.remove('hidden');
});

function setupCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const glow = document.getElementById('cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        if(glow) {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        }
    });
    
    document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%, -50%) scale(0.9)');
    document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
}

function setupMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('menu-close');
    const overlay = document.getElementById('menu-overlay');

    toggleBtn.addEventListener('click', () => {
        overlay.classList.remove('hidden');
        setTimeout(() => {
            overlay.classList.remove('opacity-0');
        }, 10);
    });

    closeBtn.addEventListener('click', () => {
        closeMenu();
    });
}

function closeMenu() {
    const overlay = document.getElementById('menu-overlay');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
        overlay.classList.add('hidden');
    }, 300);
}

window.handleMenuClick = function(page) {
    if (page === 'my_page' || page === 'tree_board') {
        alert('준비 중인 페이지입니다.');
    } else {
        goToPage(page);
        closeMenu();
    }
};

function setupBGM() {
    bgmAudio = document.getElementById('bgm');
    bgmAudio.volume = 0; 

    const toggleBtn = document.getElementById('bgm-toggle');
    document.body.addEventListener('click', startBgm, { once: true });

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        toggleBgm();
    });
}

function startBgm() {
    if (isBgmPlaying) return;
    bgmAudio.play().then(() => {
        isBgmPlaying = true;
        fadeInBgm();
        updateBgmIcon();
    }).catch(err => console.log("BGM 자동 재생 차단됨:", err));
}

function fadeInBgm() {
    let vol = 0;
    const interval = setInterval(() => {
        if (vol < 0.5) { 
            vol += 0.05;
            bgmAudio.volume = vol;
        } else {
            clearInterval(interval);
        }
    }, 200);
}

function toggleBgm() {
    if (bgmAudio.paused) {
        bgmAudio.play();
        isBgmPlaying = true;
    } else {
        bgmAudio.pause();
        isBgmPlaying = false;
    }
    updateBgmIcon();
}

function updateBgmIcon() {
    const btn = document.getElementById('bgm-toggle');
    if (isBgmPlaying) {
        btn.classList.add('bg-white/40');
        btn.classList.remove('bg-white/20');
        btn.innerHTML = '<i data-lucide="music" class="w-5 h-5"></i>';
    } else {
        btn.classList.add('bg-white/20');
        btn.classList.remove('bg-white/40');
        btn.innerHTML = '<i data-lucide="mic-off" class="w-5 h-5"></i>'; 
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function setupEventListeners() {
    const affButtons = document.querySelectorAll('.aff-btn');
    affButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            affButtons.forEach(b => {
                b.classList.remove('bg-[#6E1A1A]', 'text-white', 'border-[#6E1A1A]');
                b.classList.add('bg-white', 'text-[#6E1A1A]/80', 'border-[#6E1A1A]/30');
            });
            btn.classList.remove('bg-white', 'text-[#6E1A1A]/80', 'border-[#6E1A1A]/30');
            btn.classList.add('bg-[#6E1A1A]', 'text-white', 'border-[#6E1A1A]');
            
            formData.affiliation = btn.getAttribute('data-value');
            formData.theme = ''; 
            
            renderThemeOptions(formData.affiliation);
            document.querySelector('#theme-dropdown-btn span').textContent = "주제를 선택해주세요";
            document.querySelector('#theme-dropdown-btn span').classList.add('text-[#6E1A1A]/60');
        });
    });

    const interestCheckboxes = document.querySelectorAll('input[name="interests"]');
    interestCheckboxes.forEach(box => {
        box.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('input[name="interests"]:checked').length;
            if (checkedCount > 3) {
                this.checked = false;
                alert('관심 분야는 최대 3개까지만 선택 가능합니다.');
            }
        });
    });

    document.getElementById('close-modal-btn').onclick = () => {
        document.getElementById('post-detail-modal').classList.add('hidden');
    };
    
    document.getElementById('submit-comment-btn').onclick = handleSubmitComment;

    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('theme-dropdown-list');
        const btn = document.getElementById('theme-dropdown-btn');
        if (dropdown && !dropdown.contains(e.target) && !btn.contains(e.target)) {
            dropdown.classList.add('hidden');
            const arrow = document.getElementById('dropdown-arrow');
            if(arrow) arrow.classList.remove('rotate-180');
        }
    });
}

function toggleThemeDropdown() {
    const dropdown = document.getElementById('theme-dropdown-list');
    const arrow = document.getElementById('dropdown-arrow');
    
    if (dropdown.classList.contains('hidden')) {
        if (!formData.affiliation) {
            alert('소속을 먼저 선택해주세요.');
            return;
        }
        dropdown.classList.remove('hidden');
        arrow.classList.add('rotate-180');
    } else {
        dropdown.classList.add('hidden');
        arrow.classList.remove('rotate-180');
    }
}

function selectTheme(themeValue) {
    formData.theme = themeValue;
    const btnSpan = document.querySelector('#theme-dropdown-btn span');
    btnSpan.textContent = themeValue;
    btnSpan.classList.remove('text-[#6E1A1A]/60'); 
    btnSpan.classList.add('text-[#6E1A1A]', 'font-bold'); 
    toggleThemeDropdown();
}

function renderThemeOptions(affiliation) {
    const container = document.getElementById('theme-dropdown-list');
    container.innerHTML = ''; 
    let themes = (affiliation === '교수님') ? ['응원', '조언'] : ['올해의 추억', '현재의 고민', '미래의 다짐'];
    themes.forEach(theme => {
        const div = document.createElement('div');
        div.className = 'px-4 py-2 hover:bg-[#6E1A1A]/10 cursor-pointer text-sm text-[#6E1A1A] border-b border-[#6E1A1A]/10 last:border-0';
        div.textContent = theme;
        div.onclick = () => selectTheme(theme);
        container.appendChild(div);
    });
}

async function gasCall(action, data = {}, method = 'POST') {
    document.getElementById('loading-overlay').classList.remove('hidden');
    try {
        let response;
        const payload = { action: action, ...data };
        if (method === 'POST') {
             response = await fetch(GAS_WEB_APP_URL, { method: 'POST', body: JSON.stringify(payload) });
        } else {
            const params = new URLSearchParams({ action: action, data: JSON.stringify(data) });
            response = await fetch(`${GAS_WEB_APP_URL}?${params.toString()}`, { method: 'GET' });
        }
        return JSON.parse(await response.text());
    } catch (error) {
        alert(`오류 발생: ${error.message}`);
        return { success: false };
    } finally {
        document.getElementById('loading-overlay').classList.add('hidden');
    }
}

function goToPage(pageId) {
    document.querySelectorAll('.page-section').forEach(el => {
        el.classList.remove('active');
        setTimeout(() => { if(!el.classList.contains('active')) el.style.display = 'none'; }, 500);
    });
    const target = document.getElementById('page-' + pageId);
    target.style.display = 'flex';
    setTimeout(() => target.classList.add('active'), 10);

    const menuBtn = document.getElementById('menu-toggle');
    if (pageId === 'main') {
        menuBtn.classList.remove('hidden');
    } else {
        menuBtn.classList.add('hidden');
    }

    if (pageId === 'share_list') fetchPostList();
    if (pageId === 'ranking') fetchRanking('');
    
    if (pageId !== 'animation') {
        const openEnv = document.getElementById('envelope-open');
        const closedEnv = document.getElementById('envelope-closed');
        const paper = document.getElementById('animating-paper');
        
        if(openEnv) openEnv.classList.remove('opacity-0');
        if(closedEnv) closedEnv.classList.add('opacity-0');
        if(paper) paper.classList.remove('slide-into-envelope');
    }
}

function validateAndGoToGrade() {
    formData.name = document.getElementById('input-name').value || "익명";
    const checkedInterests = document.querySelectorAll('input[name="interests"]:checked');
    formData.interests = Array.from(checkedInterests).map(cb => cb.value);

    if (!formData.affiliation || !formData.theme) {
        alert('소속과 테마를 선택해주세요!');
        return;
    }
    if (formData.interests.length === 0) {
        alert('관심분야를 최소 1개 선택해주세요.');
        return;
    }

    document.getElementById('grade-header-subtitle').textContent = `(${formData.theme})`;
    document.getElementById('display-name').textContent = formData.name;
    document.getElementById('display-affiliation').textContent = formData.affiliation;
    document.getElementById('display-theme').textContent = formData.theme;
    
    goToPage('grade');
}

async function submitSurvey() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    if (!title || !content) {
        alert('제목과 내용을 모두 작성해주세요.');
        return;
    }

    const finalData = {
        name: formData.name,
        affiliation: formData.affiliation,
        interests: formData.interests.join(', '),
        postType: formData.theme,
        title: title,
        content: content
    };

    const result = await gasCall('savePost', finalData, 'POST');

    if (result.success) {
        document.getElementById('final-message-preview').textContent = content;
        goToPage('animation');
        setTimeout(() => {
            document.getElementById('loading-text').textContent = "트리에 메시지가 걸렸어요!";
            document.getElementById('animating-paper').classList.add('slide-into-envelope');
        }, 800);
        setTimeout(() => {
            document.getElementById('envelope-open').classList.add('opacity-0'); 
            document.getElementById('envelope-closed').classList.remove('opacity-0'); 
        }, 1600);
        setTimeout(() => {
            goToPage('share_list');
        }, 3000);
    } else {
        alert('저장에 실패했습니다: ' + result.message);
    }
}

async function fetchPostList() {
    const listArea = document.getElementById('post-list-area');
    listArea.innerHTML = '<p class="text-center text-white">로딩 중...</p>';
    const result = await gasCall('getPostList', {}, 'GET');
    if (result.success && Array.isArray(result.data)) {
        postDataCache = result.data;
        if (postDataCache.length === 0) {
            listArea.innerHTML = '<p class="text-center text-white">작성된 글이 없습니다.</p>';
        } else {
            listArea.innerHTML = postDataCache.map(post => `
                <div class="list-item" onclick="showPostDetail('${post.ID}')">
                    <p class="text-xs text-gray-400">${post.Name} | ${post.Affiliation}</p>
                    <p class="text-lg font-bold text-white">${post.Title}</p>
                </div>
            `).join('');
        }
    }
}

function showPostDetail(postId) {
    const post = postDataCache.find(p => String(p.ID) === String(postId));
    if (!post) return;
    document.getElementById('detail-title').textContent = post.Title;
    document.getElementById('detail-id').textContent = `From. ${post.Name} (${post.Affiliation})`;
    document.getElementById('detail-content').textContent = post.Content;
    document.getElementById('submit-comment-btn').dataset.postId = postId;
    document.getElementById('comments-list').innerHTML = '';
    fetchComments(postId);
    document.getElementById('post-detail-modal').classList.remove('hidden');
}

async function fetchComments(postId) {
    const result = await gasCall('getComments', { postId: postId }, 'GET');
    const list = document.getElementById('comments-list');
    if (result.success && result.data.length) {
        list.innerHTML = result.data.map(c => `
            <div class="bg-gray-100 p-2 rounded text-sm mt-2">
                <span class="font-bold text-[#9d5050]">${c.CommenterName}:</span> ${c.CommentContent}
            </div>`).join('');
    } else {
        list.innerHTML = '<p class="text-xs text-gray-500">아직 댓글이 없습니다.</p>';
    }
}

async function handleSubmitComment() {
    const postId = document.getElementById('submit-comment-btn').dataset.postId;
    const content = document.getElementById('comment-input').value.trim();
    if(!content) return;
    await gasCall('saveComment', { postId, commenterName: '익명', affiliation: '방문자', commentContent: content }, 'POST');
    document.getElementById('comment-input').value = '';
    fetchComments(postId);
}

async function fetchRanking(filter) {
    const result = await gasCall('getInterestRanking', { affiliation: filter }, 'GET');
    if(result.success) {
        const list = document.getElementById('full-ranking-list');
        list.innerHTML = result.data.map((item, idx) => `
            <div class="flex justify-between text-white border-b border-gray-500 py-2">
                <span class="font-bold w-8">${idx+1}위</span>
                <span class="flex-1 text-left px-4">${item.Interest}</span>
                <span class="text-yellow-400">${item.Count}표</span>
            </div>`).join('');
    }
}

window.filterRanking = fetchRanking;

function createSnow() {
    const container = document.getElementById('snow-container');
    for (let i = 0; i < 50; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        flake.style.left = Math.random() * 100 + '%';
        flake.style.width = (Math.random() * 4 + 3) + 'px';
        flake.style.height = flake.style.width;
        flake.style.animationDuration = (Math.random() * 10 + 10) + 's'; 
        flake.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(flake);
    }
}