const toPersianDigits = (str) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(str).replace(/\d/g, d => persianDigits[d]);
};

const formatNumber = (num) => {
    if (num === 0) return '۰';
    const formatted = new Intl.NumberFormat('en-US').format(num);
    return toPersianDigits(formatted);
};

const generateReport = () => {
    const appRoot = document.getElementById('app-root');

    // --- RENDER STATIC HTML ---
    let navHtml = `<nav class="main-nav">
                    <button class="hamburger-btn" id="hamburger-btn" aria-label="فهرست فازها">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                    </button>
                   </nav>`;

    let mainHtml = `
        <div class="container">
        <header>
            <h1>داشبورد جامع پروژه اصلاح زیرساخت IT</h1>
            <p>نمای کلی از فازها، فعالیت‌ها، هزینه‌ها و ریسک‌های پروژه بر اساس "طرح جامع اصلاح و توسعه"</p>
        </header>
        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-card-header"><h3>هزینه کل فاز اول (نهایی)</h3></div>
                <p class="value">${formatNumber(finalCosts.phase1)} <span class="unit">تومان</span></p>
            </div>
            <div class="summary-card">
                <div class="summary-card-header"><h3>هزینه کل فاز دوم (نهایی)</h3></div>
                <p class="value">${formatNumber(finalCosts.phase2)} <span class="unit">تومان</span></p>
            </div>
            <div class="summary-card">
                <div class="summary-card-header"><h3>هزینه کل فاز سوم (نهایی)</h3></div>
                <p class="value">${formatNumber(finalCosts.phase3)} <span class="unit">تومان</span></p>
            </div>
            <div class="summary-card total">
                <div class="summary-card-header"><h3>جمع کل سرمایه‌گذاری</h3></div>
                <p class="value">${formatNumber(finalCosts.total)} <span class="unit">تومان</span></p>
            </div>
        </div>
        <main>`;

    // --- RENDER DYNAMIC CONTENT ---
    projectData.forEach((phase, index) => {
        const phaseCounter = index + 1;
        mainHtml += `
            <div id="phase-${phaseCounter}" class="phase-section">
                <h2 class="phase-title">${phase.phase_title}</h2>
                <p class="phase-introduction">${phase.phase_introduction}</p>`;

        phase.tasks.forEach(task => {
            mainHtml += `
                <div class="task-card" id="task-${task.id.replace(/\./g, '-')}">
                    <div class="task-header">
                        <div class="task-title-section">
                            <div class="task-title">
                                <p>WBS ${toPersianDigits(task.id)}</p>
                                <h3>${task.title}</h3>
                            </div>
                        </div>
                        <div class="task-meta">
                            <div class="task-meta-item">
                                <span class="label">هزینه کل: </span>
                                <span class="value">${task.costs.total > 0 ? formatNumber(task.costs.total) + ' تومان' : 'بدون هزینه مستقیم'}</span>
                            </div>
                            ${task.risk_analysis ? `<button class="details-btn" data-task-id="${task.id}">مشاهده ریسک‌ها</button>` : ''}
                        </div>
                    </div>
                </div>`;
        });
        mainHtml += `</div>`;
    });

    mainHtml += `</main>
        <footer>
            <p>طرح جامع پروژه و ساختار شکست کار (WBS) - اصلاح و توسعه زیرساخت IT فراپخت</p>
            <p>تهیه کننده: هادی علایی، مدیر فناوری اطلاعات</p>
        </footer>
        </div>`;

    appRoot.innerHTML = navHtml + mainHtml;

    // --- MODAL LOGIC ---
    const modal = document.getElementById('details-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('modal-close-btn');

    const openModal = (task) => {
        modalTitle.textContent = `تحلیل ریسک: ${task.title}`;
        modalBody.textContent = task.risk_analysis;
        modal.classList.add('visible');
    };

    const closeModal = () => {
        modal.classList.remove('visible');
    };

    appRoot.addEventListener('click', (event) => {
        if (event.target.classList.contains('details-btn')) {
            const taskId = event.target.dataset.taskId;
            // Find the task in the nested data structure
            let foundTask = null;
            for (const phase of projectData) {
                foundTask = phase.tasks.find(t => t.id === taskId);
                if (foundTask) break;
            }
            if (foundTask) {
                openModal(foundTask);
            }
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // --- HAMBURGER MENU LOGIC ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    let menuDiv = document.getElementById('hamburger-menu');
    if (menuDiv) menuDiv.remove();

    menuDiv = document.createElement('div');
    menuDiv.id = 'hamburger-menu';
    // ... (rest of the hamburger menu setup is the same, just updating the loop)
    menuDiv.style.position = 'fixed';
    menuDiv.style.top = '70px';
    menuDiv.style.right = '1rem';
    menuDiv.style.background = '#fff';
    menuDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    menuDiv.style.zIndex = '2001';
    menuDiv.style.minWidth = '250px';
    menuDiv.style.padding = '1rem';
    menuDiv.style.display = 'none';
    menuDiv.style.borderRadius = '0.75rem';
    menuDiv.style.border = '1px solid #e5e7eb';

    let menuHtml = '<ul style="list-style:none;margin:0;padding:0">';
    projectData.forEach((phase, index) => {
        const phaseIndex = index + 1;
        menuHtml += `<li style="margin-bottom:0.5rem;"><a href="#phase-${phaseIndex}" style="text-decoration:none;color:#1f2937;font-weight:600;display:block;padding:0.75rem 1rem;border-radius:0.5rem;transition: all 0.2s ease-in-out;" onmouseover="this.style.background='#f3f4f6'; this.style.color='#1d4ed8';" onmouseout="this.style.background='none'; this.style.color='#1f2937';">${phase.phase_title}</a></li>`;
        if (phaseIndex < projectData.length) {
            menuHtml += '<hr style="border:none; border-top: 1px solid #f3f4f6; margin: 0.5rem 0;" />';
        }
    });
    menuHtml += '</ul>';
    menuDiv.innerHTML = menuHtml;
    document.body.appendChild(menuDiv);

    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDiv.style.display = menuDiv.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (e) => {
        const isLinkClick = e.target.tagName === 'A' && menuDiv.contains(e.target);
        const isOutsideClick = menuDiv.style.display === 'block' && !menuDiv.contains(e.target) && e.target !== hamburgerBtn;
        if (isLinkClick || isOutsideClick) {
            menuDiv.style.display = 'none';
        }
    });
};

document.addEventListener('DOMContentLoaded', generateReport);
