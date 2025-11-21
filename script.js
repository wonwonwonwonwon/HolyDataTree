// === 설정 (지혜님 API) ===
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyvbLW5WgbxUCbNVw4EpETNotU25LD8YjikIDVSUCJySiBFICBjKbxFgDz6M5hen83u4g/exec"; 

// === 상태 변수 ===
let formData = {
    name: '',
    affiliation: '',
    interests: [],
    theme: '',
    title: '',   // 추가됨
    content: ''  // message -> content 로 변경
};
let postDataCache = [];

// === 초기화 ===
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    } catch (e) {}

    createSnow();
    setupEventListeners();
});

function setupEventListeners() {
    // 소속 버튼 클릭
    const affButtons = document.querySelectorAll('.aff-btn');
    affButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. 모든 버튼 초기화 (비활성 상태로)
            affButtons.forEach(b => {
                // [수정] hover:text-red-800 클래스도 함께 제거해야 함
                b.classList.remove('bg-red-800', 'text-white', 'border-red-800', 'hover:text-red-800');
                b.classList.add('bg-white', 'text-slate-600', 'border-slate-300');
            });

            // 2. 선택된 버튼 활성화
            btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-300');
            // [수정] hover:text-red-800 클래스 추가 (마우스 올리면 글자 빨간색)
            btn.classList.add('bg-red-800', 'text-white', 'border-red-800', 'hover:text-red-800');
            
            formData.affiliation = btn.getAttribute('data-value');
            formData.theme = ''; 
            
            // 소속이 변경되면 드롭다운 내용 갱신 및 초기화
            renderThemeOptions(formData.affiliation);
            document.querySelector('#theme-dropdown-btn span').textContent = "테마를 선택해주세요";
            document.querySelector('#theme-dropdown-btn span').classList.add('text-slate-500');
        });
    });

    // 관심분야 3개 제한
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

    // 모달 닫기
    document.getElementById('close-modal-btn').onclick = () => {
        document.getElementById('post-detail-modal').classList.add('hidden');
    };
    
    // 댓글 전송
    document.getElementById('submit-comment-btn').onclick = handleSubmitComment;

    // 드롭다운 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('theme-dropdown-list');
        const btn = document.getElementById('theme-dropdown-btn');
        if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
            dropdown.classList.add('hidden');
            document.getElementById('dropdown-arrow').classList.remove('rotate-180');
        }
    });
}

// === 토글 드롭다운 관련 함수 ===
function toggleThemeDropdown() {
    const dropdown = document.getElementById('theme-dropdown-list');
    const arrow = document.getElementById('dropdown-arrow');
    
    if (dropdown.classList.contains('hidden')) {
        // 소속을 먼저 선택했는지 확인
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
    
    // 버튼 텍스트 업데이트
    const btnSpan = document.querySelector('#theme-dropdown-btn span');
    btnSpan.textContent = themeValue;
    btnSpan.classList.remove('text-slate-500');
    btnSpan.classList.add('text-slate-800', 'font-bold');
    
    // 드롭다운 닫기
    toggleThemeDropdown();
}

// 테마 옵션 렌더링 (드롭다운 아이템 생성)
function renderThemeOptions(affiliation) {
    const container = document.getElementById('theme-dropdown-list');
    container.innerHTML = ''; 
    let themes = (affiliation === '교수님') ? ['응원', '조언'] : ['올해의 추억', '현재의 고민', '미래를 위한 다짐'];
    
    themes.forEach(theme => {
        const div = document.createElement('div');
        div.className = 'px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm text-slate-700 border-b border-slate-100 last:border-0';
        div.textContent = theme;
        div.onclick = () => selectTheme(theme);
        container.appendChild(div);
    });
}

// === API 호출 함수 ===
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

// === 페이지 이동 및 로직 ===
function goToPage(pageId) {
    document.querySelectorAll('.page-section').forEach(el => {
        el.classList.remove('active');
        setTimeout(() => { if(!el.classList.contains('active')) el.style.display = 'none'; }, 500);
    });
    const target = document.getElementById('page-' + pageId);
    target.style.display = 'flex';
    setTimeout(() => target.classList.add('active'), 10);

    if (pageId === 'share_list') fetchPostList();
    if (pageId === 'ranking') fetchRanking('');
    
    // 애니메이션 페이지 초기화 (다시 작성할 때를 대비)
    if (pageId !== 'animation') {
        const openEnv = document.getElementById('envelope-open');
        const closedEnv = document.getElementById('envelope-closed');
        const paper = document.getElementById('animating-paper');
        
        if(openEnv) openEnv.classList.remove('opacity-0');
        if(closedEnv) closedEnv.classList.add('opacity-0');
        if(paper) paper.classList.remove('slide-into-envelope');
    }
}

// 공통 질문 -> 학년 질문 이동
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

// 최종 제출 (애니메이션 적용)
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

        // 1. 편지 들어가기 (0.1초 후 시작)
        setTimeout(() => {
            document.getElementById('loading-text').textContent = "트리에 메시지가 걸렸어요!";
            document.getElementById('animating-paper').classList.add('slide-into-envelope');
        }, 100);

        // 2. 봉투 닫기 (1.6초 후 - 편지가 다 들어간 뒤)
        setTimeout(() => {
            document.getElementById('envelope-open').classList.add('opacity-0'); // 열린 봉투 숨기기
            document.getElementById('envelope-closed').classList.remove('opacity-0'); // 닫힌 봉투 보이기
        }, 1600);

        // 3. 목록으로 이동 (3.5초 후)
        setTimeout(() => {
            goToPage('share_list');
        }, 3500);
    } else {
        alert('저장에 실패했습니다: ' + result.message);
    }
}

// 목록 불러오기
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

// 상세 보기
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

// 랭킹 불러오기
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

// 눈 내리는 효과
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