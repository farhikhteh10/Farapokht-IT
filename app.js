const toPersianDigits = (str) => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(str).replace(/\d/g, d => persianDigits[d]);
};

const formatNumber = (num) => {
    if (num === 0) return '۰';
    const formatted = new Intl.NumberFormat('en-US').format(num);
    return toPersianDigits(formatted);
};

const createCostList = (details) => {
    if (!details || details === '-') return '<li>-</li>';
    return details.split('\n').map(item => `<li>${item.replace('• ', '')}</li>`).join('');
};

const generateReport = () => {
    const appRoot = document.getElementById('app-root');

    const totalTasks = projectData.length;

    const groupedTasks = projectData.reduce((acc, task) => {
        (acc[task.phase] = acc[task.phase] || []).push(task);
        return acc;
    }, {});

    // Main Navigation
    let navHtml = '<nav class="main-nav">';
    navHtml += `<button class="hamburger-btn" id="hamburger-btn" aria-label="فهرست فازها">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </button>`;
    navHtml += '</nav>';

    // Main Content
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

    let phaseCounter = 1;
    for (const phase in groupedTasks) {
        mainHtml += `
            <div id="phase-${phaseCounter}" class="phase-section">
                <h2 class="phase-title">${phase}</h2>`;

        groupedTasks[phase].forEach(task => {
            mainHtml += `
                <div class="task-card" id="task-${task.id.replace(/\./g, '-')}">
                    <div class="task-header" style="cursor: pointer;">
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
                        </div>
                    </div>
                    <div class="task-details">
                        <div class="task-objective">
                            <h4>هدف از این فعالیت:</h4>
                            <p>${task.objective}</p>
                        </div>
                        <div class="costs-grid">
                            <div class="cost-card">
                                <h5>جزئیات هزینه تجهیزات/نرم‌افزار</h5>
                                <ul>${createCostList(task.equipmentDetails)}</ul>
                                <p class="total-cost">${formatNumber(task.costs.equipment)} تومان</p>
                            </div>
                            <div class="cost-card">
                                <h5>جزئیات هزینه پیمانکار/اجرا</h5>
                                <ul>${createCostList(task.contractorDetails)}</ul>
                                <p class="total-cost">${formatNumber(task.costs.contractor)} تومان</p>
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        mainHtml += `</div>`;
        phaseCounter++;
    }

    mainHtml += `
        </main>
        <footer>
            <p>طرح جامع پروژه و ساختار شکست کار (WBS) - اصلاح و توسعه زیرساخت IT فراپخت</p>
            <p>تهیه کننده: هادی علایی، مدیر فناوری اطلاعات</p>
        </footer>
        </div>`;

    appRoot.innerHTML = navHtml + mainHtml;

    // --- Event Listeners ---

    // Hamburger Menu
    const hamburgerBtn = document.getElementById('hamburger-btn');
    let menuDiv = document.getElementById('hamburger-menu');
    if (menuDiv) menuDiv.remove();

    menuDiv = document.createElement('div');
    menuDiv.id = 'hamburger-menu';
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
    let phaseIndex = 1;
    for (const phase in groupedTasks) {
        menuHtml += `<li style="margin-bottom:0.5rem;"><a href="#phase-${phaseIndex}" style="text-decoration:none;color:#1f2937;font-weight:600;display:block;padding:0.75rem 1rem;border-radius:0.5rem;transition: all 0.2s ease-in-out;" onmouseover="this.style.background='#f3f4f6'; this.style.color='#1d4ed8';" onmouseout="this.style.background='none'; this.style.color='#1f2937';">${phase}</a></li>`;
        if(phaseIndex < Object.keys(groupedTasks).length) {
            menuHtml += '<hr style="border:none; border-top: 1px solid #f3f4f6; margin: 0.5rem 0;" />';
        }
        phaseIndex++;
    }
    menuHtml += '</ul>';
    menuDiv.innerHTML = menuHtml;
    document.body.appendChild(menuDiv);

    hamburgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        menuDiv.style.display = menuDiv.style.display === 'block' ? 'none' : 'block';
    });

    // Close menu on outside click or link click
    document.addEventListener('click', function(e) {
        const isLink = e.target.tagName === 'A' && menuDiv.contains(e.target);
        if (menuDiv.style.display === 'block' && (!menuDiv.contains(e.target) && e.target !== hamburgerBtn || isLink)) {
            menuDiv.style.display = 'none';
        }
    });

    // Collapsible Task Cards
     appRoot.addEventListener('click', function(event) {
        const header = event.target.closest('.task-header');
        if (header) {
            const details = header.nextElementSibling;
            if (details && details.classList.contains('task-details')) {
                 details.style.display = details.style.display === 'block' ? 'none' : 'block';
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', generateReport);
