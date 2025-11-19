// === 1. 데이터 정의 ===
const QUESTIONS = {
    '1학년': {
        '올해의 추억': '올해 새로운 대학생활 속에서 가장 기억에 남았던 순간은 무엇인가요?',
        '현재의 고민': '올해 대학 생활을 적응하는 과정에서 가장 고민 되었던 점은 무엇이었나요?',
        '미래를 위한 다짐': '앞으로 대학생활에서 꼭 이루고 싶은 목표가 있다면 무엇인가요?',
    },
    '2학년': {
        '올해의 추억': '올해 스스로의 전공 분야를 더 깊이 탐색하며 가장 의미 있었던 순간은 무엇이었나요?',
        '현재의 고민': '전공 활동이나 경험을 넓혀가는 과정에서 가장 고민 되었던 점은 무엇이었나요?',
        '미래를 위한 다짐': '2학년을 마무리하며 앞으로 전공 분야에서 꼭 이루고 싶은 목표는 무엇인가요?',
    },
    '3학년': {
        '올해의 추억': '올해 졸업과 진로를 준비하며 가장 기억에 남았던 경험이나 성취는 무엇인가요?',
        '현재의 고민': '포트폴리오·실무 경험·취업 준비 과정에서 가장 크게 느꼈던 고민은 무엇이었나요?',
        '미래를 위한 다짐': '졸업 이후의 진로를 향해 앞으로 꼭 이루고 싶은 목표는 무엇인가요?',
    },
    '전공심화': {
        '올해의 추억': '이번 해, 가장 기억에 남는 순간은 언제였나요?',
        '현재의 고민': '현재 가장 마음을 쓰고 있는 고민은 무엇인가요?',
        '미래를 위한 다짐': '앞으로의 목표나 다짐을 적어주세요.',
    },
    '교수님': {
        '응원': '학생들에게 전해주고 싶은 따뜻한 응원의 한마디를 부탁드립니다.',
        '조언': '학생들에게 도움이 될 만한 진심 어린 조언을 부탁드립니다.',
    }
};

// === 2. 상태 변수 ===
let formData = {
    name: '',
    affiliation: '',
    interests: [],
    theme: '',
    message: ''
};

// === 3. 초기화 및 이벤트 리스너 ===
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons(); // 아이콘 렌더링
    createSnow(); // 눈 내리는 효과 시작
    
    // 소속 버튼 클릭 이벤트 처리
    const affButtons = document.querySelectorAll('.aff-btn');
    affButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 기존 선택 해제 및 스타일 초기화
            affButtons.forEach(b => {
                b.classList.remove('bg-red-800', 'text-white', 'border-red-800');
                b.classList.add('bg-white', 'text-slate-600', 'border-slate-300');
            });
            
            // 선택된 버튼 스타일 적용
            btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-300');
            btn.classList.add('bg-red-800', 'text-white', 'border-red-800');
            
            // 데이터 저장
            formData.affiliation = btn.getAttribute('data-value');
            formData.theme = ''; // 소속 바뀌면 테마 초기화
            
            // 테마 옵션 다시 그리기
            renderThemeOptions(formData.affiliation);
        });
    });

    // [추가됨] 관심 분야 체크박스 선택 제한 (최대 3개)
    const interestCheckboxes = document.querySelectorAll('input[name="interests"]');
    interestCheckboxes.forEach(box => {
        box.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('input[name="interests"]:checked').length;
            if (checkedCount > 3) {
                this.checked = false; // 현재 체크 취소
                alert('관심 분야는 최대 3개까지만 선택 가능합니다.');
            }
        });
    });
});

// === 4. 주요 함수 ===

// 페이지 이동 함수
function goToPage(pageId) {
    // 모든 페이지 숨기기
    document.querySelectorAll('.page-section').forEach(el => {
        el.classList.remove('active');
        setTimeout(() => {
            if(!el.classList.contains('active')) el.style.display = 'none';
        }, 500); // 페이드 아웃 시간 고려
    });

    // 선택한 페이지 보이기
    const target = document.getElementById('page-' + pageId);
    target.style.display = 'flex';
    // display:flex 적용 후 약간의 딜레이 뒤 opacity 변경해야 트랜지션 적용됨
    setTimeout(() => {
        target.classList.add('active');
    }, 10);
}

// 테마 옵션 렌더링
function renderThemeOptions(affiliation) {
    const container = document.getElementById('theme-options');
    container.innerHTML = ''; // 초기화

    let themes = [];
    if (affiliation === '교수님') {
        themes = ['응원', '조언'];
    } else {
        themes = ['올해의 추억', '현재의 고민', '미래를 위한 다짐'];
    }

    themes.forEach(theme => {
        const label = document.createElement('label');
        label.className = 'flex items-center space-x-3 p-2 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors';
        label.innerHTML = `
            <input type="radio" name="theme" value="${theme}" class="accent-red-800 w-4 h-4" onclick="formData.theme = '${theme}'">
            <span class="text-slate-800 text-sm font-medium">${theme}</span>
        `;
        container.appendChild(label);
    });
}

// 공통 질문 페이지 유효성 검사 및 이동
function validateAndGoToGrade() {
    // 이름 저장
    formData.name = document.getElementById('input-name').value;
    
    // 관심분야 저장
    const checkedInterests = document.querySelectorAll('input[name="interests"]:checked');
    formData.interests = Array.from(checkedInterests).map(cb => cb.value);

    // 검사
    if (!formData.name || !formData.affiliation || !formData.theme) {
        alert('이름, 소속, 그리고 테마를 모두 선택해주세요!');
        return;
    }

    // 학년 질문 페이지 데이터 세팅
    document.getElementById('grade-header-subtitle').textContent = `(${formData.theme})`;
    document.getElementById('selected-info-badge').textContent = `${formData.affiliation} - ${formData.theme}`;
    
    // 질문 텍스트 가져오기
    const qText = QUESTIONS[formData.affiliation]?.[formData.theme] || "메시지를 남겨주세요.";
    document.getElementById('question-text').textContent = qText;
    
    // 메시지 초기화
    document.getElementById('message-input').value = formData.message || '';

    goToPage('grade');
}

// 학년 질문 페이지 유효성 검사 및 애니메이션 이동
function validateAndGoToAnimation() {
    const msg = document.getElementById('message-input').value;
    if (!msg) {
        alert('메시지를 작성해주세요!');
        return;
    }
    formData.message = msg;
    document.getElementById('final-message-preview').textContent = msg;

    goToPage('animation');

    // 애니메이션 실행
    setTimeout(() => {
        document.getElementById('loading-text').textContent = "트리에 메시지를 걸고 있어요...";
        const paper = document.getElementById('animating-paper');
        paper.classList.add('slide-into-envelope');
    }, 500);

    // (시뮬레이션) 완료 후 처리 - 여기서는 3.5초 뒤 알림
    // setTimeout(() => {
    //     alert('기록이 완료되었습니다! (데모 종료)');
    // }, 3500);
}

// 눈 내리는 효과 생성 함수
function createSnow() {
    const container = document.getElementById('snow-container');
    const snowflakeCount = 50;

    for (let i = 0; i < snowflakeCount; i++) {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        
        // 랜덤 속성 부여
        const left = Math.random() * 100;
        const duration = Math.random() * 3 + 2; // 2~5초
        const delay = Math.random() * 2;
        const size = Math.random() * 4 + 3; // 3~7px

        flake.style.left = `${left}%`;
        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;
        flake.style.animationDuration = `${duration}s`;
        flake.style.animationDelay = `${delay}s`;

        container.appendChild(flake);
    }
}