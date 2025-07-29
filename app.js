// --- KPI Cards Update ---
function updateKPICards() {
    // Conversion Rate: hot leads / total leads
    const totalLeads = leadsData.length;
    const hotLeadsCount = leadsData.filter(l => l.intentScore >= 85).length;
    const conversionRate = totalLeads > 0 ? Math.round((hotLeadsCount / totalLeads) * 100) : 0;
    const kpiConversion = document.getElementById('kpiConversionRate');
    if (kpiConversion) kpiConversion.textContent = totalLeads ? conversionRate + '%' : '--%';

    // Pipeline Velocity: average intent score (or leads per week if you have date info)
    const avgScore = totalLeads > 0 ? Math.round(leadsData.reduce((sum, l) => sum + (l.intentScore || 0), 0) / totalLeads) : 0;
    const kpiVelocity = document.getElementById('kpiPipelineVelocity');
    if (kpiVelocity) kpiVelocity.textContent = totalLeads ? avgScore : '--';

    // SDR Performance: count of hot leads
    const kpiSDR = document.getElementById('kpiSDRPerformance');
    if (kpiSDR) kpiSDR.textContent = hotLeadsCount ? hotLeadsCount : '--';
}
// --- Analytics Rendering with Chart.js ---
function renderAnalytics() {
    updateKPICards();
    const totalLeads = leadsData.length;
    const hotLeadsCount = leadsData.filter(l => l.intentScore >= 85).length;
    const analyticsView = document.getElementById('analyticsView');
    if (!analyticsView) return;
    const cards = analyticsView.querySelectorAll('.card');
    // Conversion Rate Trend (Line Chart)
    if (cards.length > 0) {
        const cardBody = cards[0].querySelector('.card__body');
        if (cardBody) {
            cardBody.innerHTML = `<h3 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-medium); margin-bottom: var(--space-8);">Conversion Rate Trend</h3>
                <p style="color: var(--color-text-secondary); margin-bottom: var(--space-16);">Total Leads: <b>${totalLeads}</b> | Hot Leads: <b>${hotLeadsCount}</b></p>
                <canvas id="conversionTrendChart" height="120"></canvas>`;
            setTimeout(() => {
                const ctx = document.getElementById('conversionTrendChart').getContext('2d');
                // Fake trend data for demo; replace with real time series if available
                const days = Array.from({length: 7}, (_, i) => `Day ${i+1}`);
                const allLeads = days.map(() => Math.floor(Math.random()*20)+30);
                const hotLeads = days.map(() => Math.floor(Math.random()*10)+10);
                new window.Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: days,
                        datasets: [
                            { label: 'All Leads', data: allLeads, borderColor: '#1fb8cd', backgroundColor: 'rgba(31,184,205,0.1)', fill: true },
                            { label: 'Hot Leads', data: hotLeads, borderColor: '#ffc185', backgroundColor: 'rgba(255,193,133,0.1)', fill: true }
                        ]
                    },
                    options: { responsive: true, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } }
                });
            }, 100);
        }
    }
    // SDR Performance Overview (Bar Chart)
    if (cards.length > 1) {
        const cardBody = cards[1].querySelector('.card__body');
        if (cardBody) {
            const topLeads = leadsData.slice().sort((a, b) => b.intentScore - a.intentScore).slice(0, 5);
            cardBody.innerHTML = `<h3 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-medium); margin-bottom: var(--space-8);">SDR Performance Overview</h3>
                <p style="color: var(--color-text-secondary); margin-bottom: var(--space-16);">Top 5 Leads by Intent Score</p>
                <canvas id="topLeadsChart" height="120"></canvas>`;
            setTimeout(() => {
                const ctx = document.getElementById('topLeadsChart').getContext('2d');
                new window.Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: topLeads.map(l => l.company),
                        datasets: [{
                            label: 'Intent Score',
                            data: topLeads.map(l => l.intentScore),
                            backgroundColor: topLeads.map((l,i) => avatarColors[i%avatarColors.length])
                        }]
                    },
                    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
                });
            }, 100);
        }
    }
    // Lead Source Breakdown (Doughnut Chart)
    if (cards.length > 2) {
        const cardBody = cards[2].querySelector('.card__body');
        if (cardBody) {
            const industryCounts = {};
            leadsData.forEach(l => { industryCounts[l.industry] = (industryCounts[l.industry] || 0) + 1; });
            cardBody.innerHTML = `<h3 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-medium); margin-bottom: var(--space-8);">Lead Source Breakdown</h3>
                <p style="color: var(--color-text-secondary); margin-bottom: var(--space-16);">Industry Breakdown</p>
                <canvas id="industryBreakdownChart" height="120"></canvas>`;
            setTimeout(() => {
                const ctx = document.getElementById('industryBreakdownChart').getContext('2d');
                new window.Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(industryCounts),
                        datasets: [{
                            data: Object.values(industryCounts),
                            backgroundColor: Object.keys(industryCounts).map((_,i) => avatarColors[i%avatarColors.length])
                        }]
                    },
                    options: { responsive: true, plugins: { legend: { display: true } } }
                });
            }, 100);
        }
    }
}
window.renderAnalytics = renderAnalytics;
// Lead data from the provided JSON
// Load leadsData from localStorage if available, otherwise use default
let defaultLeadsData = [
    {"id":1,"company":"TechFlow Solutions","contact":"Sarah Chen","title":"VP of Engineering","intentScore":92,"industry":"Technology","companySize":"Mid-Market","insights":["Visited pricing page 4 times","Downloaded ROI calculator","Attended webinar on AI integration"],"recommendedAction":"Schedule executive demo - Focus on ROI and integration capabilities","reasoning":"High engagement across multiple touchpoints. Downloaded ROI calculator indicates budget consideration phase. Multiple pricing page visits suggest near-term decision timeline."},
    {"id":2,"company":"MedCore Healthcare","contact":"Dr. Michael Rodriguez","title":"Chief Technology Officer","intentScore":88,"industry":"Healthcare","companySize":"Enterprise","insights":["Researched HIPAA compliance features","Downloaded security whitepaper","Engaged with compliance-focused email campaign"],"recommendedAction":"Send healthcare compliance case study and schedule security review","reasoning":"Strong focus on compliance and security indicates serious evaluation. Healthcare industry expertise and enterprise size suggest high-value opportunity."},
    {"id":3,"company":"GreenEnergy Dynamics","contact":"Lisa Park","title":"Operations Director","intentScore":76,"industry":"Energy","companySize":"Mid-Market","insights":["Viewed competitor comparison page","Downloaded sustainability report","Recent company expansion announcement"],"recommendedAction":"Follow up with sustainability-focused value proposition","reasoning":"Competitor research indicates active evaluation phase. Sustainability focus aligns with company values and recent expansion suggests growth capital availability."},
    {"id":4,"company":"FinTech Innovations","contact":"James Wilson","title":"Head of Digital Transformation","intentScore":85,"industry":"Finance","companySize":"Enterprise","insights":["Multiple team members viewed product pages","Downloaded integration guide","Requested custom demo"],"recommendedAction":"Prepare comprehensive demo focusing on financial services integration","reasoning":"Multi-stakeholder engagement and custom demo request indicate high intent. Financial services background requires specialized approach and compliance focus."},
    {"id":5,"company":"LogiCorp Manufacturing","contact":"Robert Thompson","title":"IT Director","intentScore":67,"industry":"Manufacturing","companySize":"Enterprise","insights":["Attended industry webinar","Downloaded manufacturing case study","Recently posted job openings for data analysts"],"recommendedAction":"Send manufacturing-specific ROI analysis and schedule discovery call","reasoning":"Industry-specific content engagement and new data analyst hires suggest data modernization initiative. Manufacturing focus requires operational efficiency messaging."},
    {"id":6,"company":"EduTech Academy","contact":"Amanda Foster","title":"Technology Integration Specialist","intentScore":58,"industry":"Education","companySize":"Small Business","insights":["Viewed education pricing tier","Downloaded getting started guide","Shared content on LinkedIn"],"recommendedAction":"Follow up via LinkedIn with education sector success stories","reasoning":"Education-focused engagement and social sharing indicate interest but budget constraints likely. Small business segment requires value-focused approach."},
    {"id":7,"company":"RetailMax Solutions","contact":"Kevin Chang","title":"Chief Information Officer","intentScore":91,"industry":"Retail","companySize":"Enterprise","insights":["Requested technical architecture review","Downloaded API documentation","Multiple C-level executives engaged"],"recommendedAction":"Schedule technical deep-dive with architecture team","reasoning":"Technical architecture focus and C-level engagement indicate advanced evaluation stage. Enterprise retail requires scalability and performance emphasis."}
];
let leadsData = [];
try {
    const stored = localStorage.getItem('leadsData');
    if (stored) {
        leadsData = JSON.parse(stored);
    } else {
        leadsData = defaultLeadsData;
    }
} catch (e) {
    leadsData = defaultLeadsData;
}

// Company avatar colors
const avatarColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C'];

// Global variables
let filteredLeads = [...leadsData];
let hotLeads = [];
let filteredHotLeads = [];
let currentView = 'allLeadsView';
// Virtualization state
let virtualization = {
    enabled: true,
    pageSize: 50,
    currentPage: 0
};

// DOM elements
let leadsContainer, hotLeadsContainer, leadCountElement, hotLeadCountElement;
let searchInput, intentFilter, industryFilter, sizeFilter;
let hotSearchInput, hotIndustryFilter, hotSizeFilter;
let reasoningModal, closeModalBtn;

// Utility functions
function getScoreBadge(score) {
    if (score >= 85) return { class: 'hot', text: 'Hot' };
    if (score >= 60) return { class: 'warm', text: 'Warm' };
    return { class: 'cold', text: 'Cold' };
}


// Try to fetch company logo using Clearbit Logo API, fallback to initials
function getCompanyLogo(company, website) {
    if (website && website.startsWith('http')) {
        return `<img src="https://logo.clearbit.com/${website.replace(/^https?:\/\//, '').replace(/\/$/, '')}" alt="${company} logo" class="company-logo" onerror="this.style.display='none'">`;
    }
    return null;
}
function getCompanyInitials(companyName) {
    return companyName.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
}

function getAvatarColor(id) {
    return avatarColors[(id - 1) % avatarColors.length];
}

function createLeadCard(lead) {
    const scoreBadge = getScoreBadge(lead.intentScore);
    const avatarColor = getAvatarColor(lead.id);
    const companyInitials = getCompanyInitials(lead.company);
    // Only show company initials, not logo
    return `
        <div class="lead-card responsive-card" data-lead-id="${lead.id}" tabindex="0" role="region" aria-label="Lead card for ${lead.contact} at ${lead.company}">
            <div class="lead-header responsive-header">
                <div class="company-avatar" style="background-color: ${avatarColor}" aria-hidden="true">
                    ${companyInitials}
                </div>
                <div class="lead-info responsive-lead-info">
                    <h3 class="lead-name">${lead.contact}</h3>
                    <p class="company-name">${lead.company}</p>
                    <p class="job-title">${lead.title}</p>
                </div>
                <div class="intent-score responsive-intent-score" aria-label="Intent score: ${lead.intentScore} percent, ${scoreBadge.text}">
                    <div class="score-value">${lead.intentScore}%</div>
                    <div class="score-badge ${scoreBadge.class}">${scoreBadge.text}</div>
                    <button type="button" class="reasoning-btn" data-lead-id="${lead.id}" title="Why this score?" aria-label="Show reasoning for ${lead.contact} at ${lead.company}" tabindex="0">
                        ℹ️
                    </button>
                </div>
            </div>
            <div class="lead-insights responsive-lead-insights">
                <h4 id="insights-heading-${lead.id}">Key Insights</h4>
                <ul class="insights-list" aria-labelledby="insights-heading-${lead.id}">
                    ${lead.insights.map(insight => `<li>${insight}</li>`).join('')}
                </ul>
            </div>
            <div class="recommended-action responsive-recommended-action">
                <h4 id="action-heading-${lead.id}">Recommended Next Action</h4>
                <p aria-labelledby="action-heading-${lead.id}">${lead.recommendedAction}</p>
            </div>
        </div>
    `;
}

function renderLeads(container, leads, countElement) {
    if (!container) return;

    // Determine view mode
    const cardBtn = document.querySelector('.view-btn[data-view="card"]');
    const listBtn = document.querySelector('.view-btn[data-view="list"]');
    const isListView = listBtn && listBtn.classList.contains('active');

    // Skeleton loader for async loading
    if (container.dataset.loading === 'true') {
        container.innerHTML = `<div class="skeleton-loader" style="height:200px;display:flex;align-items:center;justify-content:center;"><span>Loading leads...</span></div>`;
        return;
    }

    // Virtualization logic
    let pagedLeads = leads;
    let totalPages = 1;
    if (virtualization.enabled && leads.length > virtualization.pageSize) {
        totalPages = Math.ceil(leads.length / virtualization.pageSize);
        const start = virtualization.currentPage * virtualization.pageSize;
        const end = start + virtualization.pageSize;
        pagedLeads = leads.slice(start, end);
    }

    if (leads.length === 0) {
        container.innerHTML = `
            <div class="responsive-empty" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--color-text-secondary);" role="status" aria-live="polite">
                <img src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/emoji.svg" alt="No data" style="width:48px;height:48px;opacity:0.7;margin-bottom:12px;"/>
                <h3>No leads found</h3>
                <p>Try adjusting your filters or search terms.</p>
            </div>
        `;
    } else if (isListView) {
        // Render as table/list view (with responsive/professional design)
        container.innerHTML = `
            <div class="responsive-table-wrapper">
            <table class="lead-list-table responsive-table" role="table" aria-label="Leads list">
                <thead>
                    <tr>
                        <th scope="col">Contact</th>
                        <th scope="col">Company</th>
                        <th scope="col">Title</th>
                        <th scope="col">Industry</th>
                        <th scope="col">Company Size</th>
                        <th scope="col">Intent Score</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${pagedLeads.map(lead => `
                        <tr tabindex="0" aria-label="Lead for ${lead.contact} at ${lead.company}">
                            <td data-label="Contact">${lead.contact}</td>
                            <td data-label="Company">${lead.company}</td>
                            <td data-label="Title">${lead.title}</td>
                            <td data-label="Industry">${lead.industry}</td>
                            <td data-label="Company Size">${lead.companySize}</td>
                            <td data-label="Intent Score"><span style="font-weight:600;color:${lead.intentScore>=85?'#1fb8cd':lead.intentScore>=60?'#e6a23c':'#db4545'}">${lead.intentScore}%</span></td>
                            <td data-label="Actions"><button type="button" class="reasoning-btn" data-lead-id="${lead.id}" title="Why this score?" aria-label="Show reasoning for ${lead.contact} at ${lead.company}" tabindex="0">ℹ️</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            </div>
            ${totalPages > 1 ? `<div class="pagination-controls" style="margin:16px 0;text-align:center;">
                <button class="page-btn" ${virtualization.currentPage === 0 ? 'disabled' : ''} data-page="prev">Prev</button>
                <span style="margin:0 8px;">Page ${virtualization.currentPage + 1} of ${totalPages}</span>
                <button class="page-btn" ${virtualization.currentPage === totalPages - 1 ? 'disabled' : ''} data-page="next">Next</button>
            </div>` : ''}
        `;
        // Add event listeners to reasoning buttons after rendering
        setTimeout(() => {
            const reasoningButtons = container.querySelectorAll('.reasoning-btn');
            reasoningButtons.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const leadId = parseInt(this.dataset.leadId);
                    showReasoning(leadId);
                });
            });
            // Pagination controls
            const prevBtn = container.querySelector('.page-btn[data-page="prev"]');
            const nextBtn = container.querySelector('.page-btn[data-page="next"]');
            if (prevBtn) prevBtn.addEventListener('click', () => { virtualization.currentPage--; renderLeads(container, leads, countElement); });
            if (nextBtn) nextBtn.addEventListener('click', () => { virtualization.currentPage++; renderLeads(container, leads, countElement); });
        }, 100);
    } else {
        // Card view (default, now grid)
        container.innerHTML = `
            <div class="responsive-card-grid">
                ${pagedLeads.map(lead => createLeadCard(lead)).join('')}
            </div>
            ${totalPages > 1 ? `<div class="pagination-controls" style="margin:16px 0;text-align:center;">
                <button class="page-btn" ${virtualization.currentPage === 0 ? 'disabled' : ''} data-page="prev">Prev</button>
                <span style="margin:0 8px;">Page ${virtualization.currentPage + 1} of ${totalPages}</span>
                <button class="page-btn" ${virtualization.currentPage === totalPages - 1 ? 'disabled' : ''} data-page="next">Next</button>
            </div>` : ''}
        `;
        // Add event listeners to reasoning buttons after rendering
        setTimeout(() => {
            const reasoningButtons = container.querySelectorAll('.reasoning-btn');
            reasoningButtons.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const leadId = parseInt(this.dataset.leadId);
                    showReasoning(leadId);
                });
            });
            // Pagination controls
            const prevBtn = container.querySelector('.page-btn[data-page="prev"]');
            const nextBtn = container.querySelector('.page-btn[data-page="next"]');
            if (prevBtn) prevBtn.addEventListener('click', () => { virtualization.currentPage--; renderLeads(container, leads, countElement); });
            if (nextBtn) nextBtn.addEventListener('click', () => { virtualization.currentPage++; renderLeads(container, leads, countElement); });
        }, 100);
    }

    if (countElement) {
        countElement.textContent = leads.length;
    }
    // Error state: visually friendly error message (if present)
    const importStatus = document.getElementById('importStatus');
    if (importStatus && importStatus.textContent && importStatus.textContent.toLowerCase().includes('error')) {
        container.innerHTML = `
            <div class="responsive-empty" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #db4545;" role="alert" aria-live="assertive">
                <img src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/warning.svg" alt="Error" style="width:48px;height:48px;opacity:0.7;margin-bottom:12px;"/>
                <h3>Something went wrong</h3>
                <p>${importStatus.textContent}</p>
            </div>
        `;
    }
}

function filterLeads(searchTerm = '', intentLevel = '', industry = '', companySize = '', isHotLeads = false) {
    const sourceData = isHotLeads ? hotLeads : leadsData;
    
    const filtered = sourceData.filter(lead => {
        // Search filter
        const matchesSearch = !searchTerm || 
            (lead.contact && lead.contact.toLowerCase().includes(searchTerm)) ||
            (lead.company && lead.company.toLowerCase().includes(searchTerm)) ||
            (lead.title && lead.title.toLowerCase().includes(searchTerm));

        // Intent score filter (only applies to All Leads view)
        let matchesIntent = true;
        if (!isHotLeads && intentLevel) {
            if (intentLevel === 'high' && lead.intentScore < 85) matchesIntent = false;
            if (intentLevel === 'warm' && (lead.intentScore < 60 || lead.intentScore >= 85)) matchesIntent = false;
            if (intentLevel === 'cold' && lead.intentScore >= 60) matchesIntent = false;
        }

        // Industry filter (case-insensitive, robust)
        const matchesIndustry = !industry || (
            lead.industry && lead.industry.trim().toLowerCase() === industry.trim().toLowerCase()
        );

        // Company size filter
        const matchesSize = !companySize || lead.companySize === companySize;

        return matchesSearch && matchesIntent && matchesIndustry && matchesSize;
    });
    
    // Sort by intent score (highest first)
    filtered.sort((a, b) => b.intentScore - a.intentScore);
    
    return filtered;
}

function updateAllLeadsView() {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const intentLevel = intentFilter ? intentFilter.value : '';
    const industry = industryFilter ? industryFilter.value : '';
    const companySize = sizeFilter ? sizeFilter.value : '';
    
    filteredLeads = filterLeads(searchTerm, intentLevel, industry, companySize, false);
    renderLeads(leadsContainer, filteredLeads, leadCountElement);
}

function updateHotLeadsView() {
    const searchTerm = hotSearchInput ? hotSearchInput.value.toLowerCase().trim() : '';
    const industry = hotIndustryFilter ? hotIndustryFilter.value : '';
    const companySize = hotSizeFilter ? hotSizeFilter.value : '';
    
    filteredHotLeads = filterLeads(searchTerm, '', industry, companySize, true);
    renderLeads(hotLeadsContainer, filteredHotLeads, hotLeadCountElement);
}

function showReasoning(leadId) {
    const lead = leadsData.find(l => l.id === leadId);
    if (!lead || !reasoningModal) return;
    
    const avatarColor = getAvatarColor(lead.id);
    const companyInitials = getCompanyInitials(lead.company);
    
    // Populate modal content
    const reasoningAvatar = document.getElementById('reasoningAvatar');
    const reasoningLeadName = document.getElementById('reasoningLeadName');
    const reasoningCompany = document.getElementById('reasoningCompany');
    const reasoningScore = document.getElementById('reasoningScore');
    const reasoningText = document.getElementById('reasoningText');
    const reasoningInsights = document.getElementById('reasoningInsights');
    
    if (reasoningAvatar) {
        reasoningAvatar.style.backgroundColor = avatarColor;
        reasoningAvatar.textContent = companyInitials;
    }
    
    if (reasoningLeadName) {
        reasoningLeadName.textContent = lead.contact;
    }
    
    if (reasoningCompany) {
        reasoningCompany.textContent = `${lead.title} at ${lead.company}`;
    }
    
    if (reasoningScore) {
        reasoningScore.textContent = `${lead.intentScore}%`;
    }
    
    if (reasoningText) {
        reasoningText.textContent = lead.reasoning;
    }
    
    if (reasoningInsights) {
        reasoningInsights.innerHTML = lead.insights.map(insight => `<li>${insight}</li>`).join('');
    }
    
    // Show modal
    reasoningModal.classList.remove('hidden');
    reasoningModal.setAttribute('aria-modal', 'true');
    reasoningModal.setAttribute('role', 'dialog');
    reasoningModal.setAttribute('tabindex', '-1');
    // Focus modal for accessibility
    setTimeout(() => {
        reasoningModal.focus();
        // Trap focus inside modal
        const focusable = reasoningModal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
        if (focusable.length) focusable[0].focus();
    }, 50);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
}

function hideReasoning() {
    if (!reasoningModal) return;
    reasoningModal.classList.add('hidden');
    reasoningModal.removeAttribute('aria-modal');
    reasoningModal.removeAttribute('role');
    reasoningModal.removeAttribute('tabindex');
    // Restore body scrolling
    document.body.style.overflow = '';
}

function switchView(targetViewId) {
    // Hide all content views
    const allViews = document.querySelectorAll('.content-view');
    allViews.forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    
    // Show target view
    const targetView = document.getElementById(targetViewId);
    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('active');
    }
    
    // Update navigation active state
    const allNavItems = document.querySelectorAll('.nav-item');
    allNavItems.forEach(item => item.classList.remove('active'));
    
    const activeNavLink = document.querySelector(`[data-target="${targetViewId}"]`);
    if (activeNavLink) {
        activeNavLink.closest('.nav-item').classList.add('active');
    }
    
    currentView = targetViewId;
    
    // Update view content based on the selected view
    if (targetViewId === 'allLeadsView') {
        updateAllLeadsView();
    } else if (targetViewId === 'hotLeadsView') {
        updateHotLeadsView();
    } else if (targetViewId === 'analyticsView') {
        renderAnalytics();
    }
}

// Utility function for debouncing search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the application
function initializeApp() {
    // Update KPIs on load
    updateKPICards();
    // Get DOM elements
    leadsContainer = document.getElementById('leadsContainer');
    hotLeadsContainer = document.getElementById('hotLeadsContainer');
    leadCountElement = document.getElementById('leadCount');
    hotLeadCountElement = document.getElementById('hotLeadCount');
    
    searchInput = document.getElementById('searchInput');
    intentFilter = document.getElementById('intentFilter');
    industryFilter = document.getElementById('industryFilter');
    sizeFilter = document.getElementById('sizeFilter');
    
    hotSearchInput = document.getElementById('hotSearchInput');
    hotIndustryFilter = document.getElementById('hotIndustryFilter');
    hotSizeFilter = document.getElementById('hotSizeFilter');
    
    reasoningModal = document.getElementById('reasoningModal');
    closeModalBtn = document.getElementById('closeModal');
    
    // Initialize hot leads data (intent score >= 85)
    hotLeads = leadsData.filter(lead => lead.intentScore >= 85);
    filteredHotLeads = [...hotLeads];
    
    // Initial render for All Leads view
    updateAllLeadsView();
    
    // Initialize Hot Leads view data
    updateHotLeadsView();
    
    // Navigation event listeners - using event delegation on the sidebar
    const sidebar = document.querySelector('.sidebar-nav');
    if (sidebar) {
        sidebar.addEventListener('click', function(e) {
            const navLink = e.target.closest('.nav-link[data-target]');
            if (navLink) {
                e.preventDefault();
                e.stopPropagation();
                const targetView = navLink.dataset.target;
                switchView(targetView);
            }
        });
    }
    
    // All Leads view event listeners
    if (searchInput) {
        searchInput.addEventListener('input', debounce(updateAllLeadsView, 300));
    }
    
    if (intentFilter) {
        intentFilter.addEventListener('change', updateAllLeadsView);
    }
    
    if (industryFilter) {
        industryFilter.addEventListener('change', updateAllLeadsView);
    }
    
    if (sizeFilter) {
        sizeFilter.addEventListener('change', updateAllLeadsView);
    }
    
    // Hot Leads view event listeners
    if (hotSearchInput) {
        hotSearchInput.addEventListener('input', debounce(updateHotLeadsView, 300));
    }
    
    if (hotIndustryFilter) {
        hotIndustryFilter.addEventListener('change', updateHotLeadsView);
    }
    
    if (hotSizeFilter) {
        hotSizeFilter.addEventListener('change', updateHotLeadsView);
    }
    
    // Modal functionality
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideReasoning);
    }
    // Trap focus in modal and close with Escape
    if (reasoningModal) {
        reasoningModal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                // Focus trap
                const focusableEls = reasoningModal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
                const firstEl = focusableEls[0];
                const lastEl = focusableEls[focusableEls.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === firstEl) {
                        e.preventDefault();
                        lastEl.focus();
                    }
                } else {
                    if (document.activeElement === lastEl) {
                        e.preventDefault();
                        firstEl.focus();
                    }
                }
            }
            if (e.key === 'Escape') {
                hideReasoning();
            }
        });
        // Close modal when clicking outside
        reasoningModal.addEventListener('click', function(e) {
            if (e.target === reasoningModal || e.target.classList.contains('modal-overlay')) {
                hideReasoning();
            }
        });
    }
    
    // View controls (Card/List view toggle)
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-pressed', btn.classList.contains('active'));
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update aria-pressed
            viewButtons.forEach(b => b.setAttribute('aria-pressed', b.classList.contains('active')));
            // Re-render leads in the new view mode
            if (currentView === 'allLeadsView') {
                updateAllLeadsView();
            } else if (currentView === 'hotLeadsView') {
                updateHotLeadsView();
            }
        });
        // Keyboard support for Enter/Space
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
    
    // Settings form functionality
    const saveProfileBtn = document.querySelector('#settingsView .btn--primary');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function() {
            alert('Profile settings saved successfully!');
        });
    }
    
    // Global reasoning button event listener using event delegation
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('reasoning-btn')) {
            e.preventDefault();
            e.stopPropagation();
            const leadId = parseInt(e.target.dataset.leadId);
            if (leadId) {
                showReasoning(leadId);
            }
        }
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Make functions available globally if needed
window.showReasoning = showReasoning;
window.leadsData = leadsData;
window.hotLeads = hotLeads;
window.filteredLeads = filteredLeads;
window.filteredHotLeads = filteredHotLeads;

// --- Import Leads Logic ---

// --- ML API Integration ---
window.getLeadScoreFromAPI = async function(lead) {
    // Map JS lead fields to backend expected fields
    const payload = {
        'Title': lead.title,
        'Industry': lead.industry,
        'Company Size': lead.companySize,
        'Page Views': lead.pageViews,
        'Downloads': lead.downloads,
        'Webinar Attended': lead.webinarAttended ? 1 : 0
    };
    try {
        const res = await fetch('http://localhost:5000/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('ML API error');
        return await res.json();
    } catch (e) {
        return { score: 0.5, explanation: [{ feature: 'API Error', impact: 0 }] };
    }
};

const leadsFileInput = document.getElementById('leadsFile');
const mappingSection = document.getElementById('mappingSection');
const mappingFields = document.getElementById('mappingFields');
const submitImportBtn = document.getElementById('submitImportBtn');
const importStatus = document.getElementById('importStatus');
let importedCSVData = [];
let csvHeaders = [];

const REQUIRED_FIELDS = [
    { key: 'contact', label: 'Contact Name' },
    { key: 'company', label: 'Company' },
    { key: 'title', label: 'Job Title' },
    { key: 'industry', label: 'Industry' },
    { key: 'companySize', label: 'Company Size' },
    { key: 'email', label: 'Email' },
    { key: 'website', label: 'Website' },
    { key: 'pageViews', label: 'Page Views' },
    { key: 'downloads', label: 'Downloads' },
    { key: 'webinarAttended', label: 'Webinar Attended (yes/no)' }
];

function parseCSV(text) {
    // Robust CSV parser: handles quoted fields with commas
    function parseLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result.map(v => v.trim());
    }
    const lines = text.trim().split(/\r?\n/);
    const headers = parseLine(lines[0]);
    const data = lines.slice(1).map(line => {
        const values = parseLine(line);
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i]);
        return obj;
    });
    return { headers, data };
}

if (leadsFileInput) {
    leadsFileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        // Show loader
        if (mappingSection) mappingSection.classList.add('hidden');
        if (submitImportBtn) submitImportBtn.classList.add('hidden');
        if (importStatus) importStatus.textContent = '';
        if (leadsContainer) {
            leadsContainer.dataset.loading = 'true';
            renderLeads(leadsContainer, [], leadCountElement);
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const { headers, data } = parseCSV(e.target.result);
                csvHeaders = headers;
                importedCSVData = data;
                showMappingFields(headers);
                if (leadsContainer) {
                    delete leadsContainer.dataset.loading;
                    renderLeads(leadsContainer, filteredLeads, leadCountElement);
                }
            } catch (err) {
                if (leadsContainer) {
                    delete leadsContainer.dataset.loading;
                    renderLeads(leadsContainer, filteredLeads, leadCountElement);
                }
                if (importStatus) importStatus.textContent = 'Error parsing CSV: ' + (err.message || err);
            }
        };
        reader.onerror = function(e) {
            if (leadsContainer) {
                delete leadsContainer.dataset.loading;
                renderLeads(leadsContainer, filteredLeads, leadCountElement);
            }
            if (importStatus) importStatus.textContent = 'Error reading file.';
        };
        reader.readAsText(file);
    });
}

function showMappingFields(headers) {
    mappingFields.innerHTML = '';
    REQUIRED_FIELDS.forEach(field => {
        const group = document.createElement('div');
        group.className = 'form-group';
        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = field.label;
        const select = document.createElement('select');
        select.className = 'form-control';
        select.required = true;
        select.innerHTML = `<option value="">Select column for "${field.label}"</option>` +
            headers.map(h => `<option value="${h}">${h}</option>`).join('');
        select.dataset.fieldKey = field.key;
        group.appendChild(label);
        group.appendChild(select);
        mappingFields.appendChild(group);
    });
    mappingSection.classList.remove('hidden');
    submitImportBtn.classList.remove('hidden');
}

if (document.getElementById('importForm')) {
    document.getElementById('importForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const selects = mappingFields.querySelectorAll('select');
        const mapping = {};
        selects.forEach(sel => {
            mapping[sel.dataset.fieldKey] = sel.value;
        });
        if (Object.values(mapping).some(v => !v)) {
            importStatus.textContent = 'Please map all required fields.';
            return;
        }
        // Show loader and progress bar
        if (typeof window.showImportProgress === 'function') window.showImportProgress(0);
        // Scroll to progress bar
        var progressBar = document.getElementById('importProgressBar');
        if (progressBar) {
            progressBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        if (leadsContainer) {
            leadsContainer.dataset.loading = 'true';
            renderLeads(leadsContainer, [], leadCountElement);
        }
        // Dynamic AI explanation generator
        function scoreAndExplain(lead) {
            return window.getLeadScoreFromAPI(lead);
        }
        // Async ML scoring for all leads with error logging
        (async () => {
            const leads = [];
            let errorOccurred = false;
            const total = importedCSVData.length;
            for (let idx = 0; idx < total; idx++) {
                try {
                    const row = importedCSVData[idx];
                    const pageViews = parseInt(row[mapping.pageViews] || '0', 10);
                    const downloads = parseInt(row[mapping.downloads] || '0', 10);
                    const webinar = (row[mapping.webinarAttended] || '').toLowerCase() === 'yes';
                    // Robust normalization for industry and companySize
                    const INDUSTRY_OPTIONS = [
                        'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Education', 'Retail', 'Energy'
                    ];
                    const SIZE_OPTIONS = [
                        'Enterprise', 'Mid-Market', 'Small Business'
                    ];
                    let rawIndustry = row[mapping.industry] || '';
                    let normIndustry = INDUSTRY_OPTIONS.find(opt => opt.toLowerCase() === rawIndustry.trim().toLowerCase()) || rawIndustry.trim();
                    let rawSize = row[mapping.companySize] || '';
                    let normSize = SIZE_OPTIONS.find(opt => opt.toLowerCase() === rawSize.trim().toLowerCase()) || rawSize.trim();
                    const lead = {
                        id: leadsData.length + idx + 1,
                        contact: row[mapping.contact],
                        company: row[mapping.company],
                        title: row[mapping.title],
                        industry: normIndustry,
                        companySize: normSize,
                        email: row[mapping.email],
                        website: row[mapping.website],
                        pageViews,
                        downloads,
                        webinarAttended: webinar
                    };
                    let ai;
                    try {
                        ai = await scoreAndExplain(lead);
                    } catch (apiErr) {
                        ai = null;
                    }
                    if (!ai || typeof ai.score === 'undefined' || ai.error) {
                        // API error or no score returned
                        leads.push({
                            ...lead,
                            intentScore: 0,
                            insights: ['Unable to score this lead due to a technical issue.'],
                            recommendedAction: 'Please try importing this lead again later or contact support.',
                            reasoning: 'Lead could not be scored due to an API error.'
                        });
                        // Update progress bar
                        if (typeof window.showImportProgress === 'function') window.showImportProgress(Math.round(((idx + 1) / total) * 100));
                        continue;
                    }
                    // Enhanced insights and reasoning
                    const insights = [];
                    if (pageViews > 0) insights.push(`Visited the website ${pageViews} times`);
                    if (downloads > 0) insights.push(`Downloaded ${downloads} resources`);
                    if (webinar) insights.push('Attended a recent webinar');
                    if (ai.explanation && Array.isArray(ai.explanation) && ai.explanation.length > 0) {
                        ai.explanation.forEach(e => {
                            if (e.impact > 0) insights.push(`Strong positive: ${e.feature}`);
                            else if (e.impact < 0) insights.push(`Negative: ${e.feature}`);
                        });
                    }
                    // Compose a more natural and dynamic reasoning
                    let reasoning = '';
                    if (ai.explanation && Array.isArray(ai.explanation) && ai.explanation.length > 0) {
                        // Filter out API error explanations
                        const validExplanations = ai.explanation.filter(e => e.feature && e.feature !== 'API Error');
                        if (validExplanations.length > 0) {
                            reasoning = `This lead's score is driven by: ` +
                                validExplanations.map(e => `${e.feature} (${e.impact > 0 ? 'positive' : 'negative'} impact)`).join(', ') + '.';
                        } else {
                            reasoning = null;
                        }
                    }
                    // If no valid explanation, generate a dynamic fallback
                    if (!reasoning) {
                        const reasons = [];
                        if (pageViews > 0) reasons.push(`high website engagement (${pageViews} page views)`);
                        if (downloads > 0) reasons.push(`interest in resources (${downloads} downloads)`);
                        if (webinar) reasons.push('participation in a recent webinar');
                        if (lead.companySize) reasons.push(`company size: ${lead.companySize}`);
                        if (lead.industry) reasons.push(`industry: ${lead.industry}`);
                        if (reasons.length > 0) {
                            reasoning = `Score is based on ${reasons.join(', ')}.`;
                        } else {
                            reasoning = 'Score is based on available engagement and company attributes.';
                        }
                    }
                    // Compose a more tailored recommended action
                    let recommendedAction = '';
                    if (ai.score >= 0.85) {
                        recommendedAction = 'Assign to a senior SDR for immediate follow-up. Consider a personalized demo or proposal.';
                        if (webinar) recommendedAction += ' Leverage their recent webinar attendance.';
                        if (downloads > 2) recommendedAction += ' Highlight downloaded resources in outreach.';
                    } else if (ai.score >= 0.6) {
                        recommendedAction = 'Nurture with targeted content and schedule a discovery call.';
                        if (pageViews > 5) recommendedAction += ' Reference their high website engagement.';
                    } else {
                        recommendedAction = 'Add to a long-term nurture campaign and monitor for future engagement.';
                        if (pageViews === 0 && downloads === 0) recommendedAction += ' Encourage initial engagement.';
                    }
                    leads.push({
                        ...lead,
                        intentScore: Math.round(ai.score * 100),
                        insights,
                        recommendedAction,
                        reasoning
                    });
                    // Update progress bar
                    if (typeof window.showImportProgress === 'function') window.showImportProgress(Math.round(((idx + 1) / total) * 100));
                } catch (err) {
                    errorOccurred = true;
                    console.error('Error importing lead:', err);
                    if (importStatus) importStatus.textContent = 'Error importing leads: ' + (err.message || err);
                    // Update progress bar on error
                    if (typeof window.showImportProgress === 'function') window.showImportProgress(Math.round(((idx + 1) / total) * 100));
                }
            }
            if (!errorOccurred && leads.length > 0) {
                leadsData.push(...leads);
                // Persist to localStorage
                try {
                    localStorage.setItem('leadsData', JSON.stringify(leadsData));
                } catch (e) {}
                if (typeof window.hideImportProgress === 'function') window.hideImportProgress();
                if (typeof window.showImportSuccess === 'function') window.showImportSuccess(`Successfully imported ${leads.length} leads!`);
                setTimeout(() => {
                    updateAllLeadsView();
                    hotLeads = leadsData.filter(lead => lead.intentScore >= 85);
                    updateHotLeadsView();
                    if (typeof renderAnalytics === 'function') renderAnalytics();
                    updateKPICards();
                }, 50);
                this.reset();
                mappingSection.classList.add('hidden');
                submitImportBtn.classList.add('hidden');
            } else if (errorOccurred) {
                if (typeof window.hideImportProgress === 'function') window.hideImportProgress();
                if (importStatus) importStatus.textContent = 'Some leads could not be imported. Please check the data and try again.';
            }
            if (leadsContainer) {
                delete leadsContainer.dataset.loading;
                renderLeads(leadsContainer, filteredLeads, leadCountElement);
            }
        })();
// --- ML API Integration ---
window.getLeadScoreFromAPI = async function(lead) {
    // Map JS lead fields to backend expected fields
    const payload = {
        'Title': lead.title,
        'Industry': lead.industry,
        'Company Size': lead.companySize,
        'Page Views': lead.pageViews,
        'Downloads': lead.downloads,
        'Webinar Attended': lead.webinarAttended ? 1 : 0
    };
    try {
        const res = await fetch('http://localhost:5000/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('ML API error');
        return await res.json();
    } catch (e) {
        return { score: 0.5, explanation: [{ feature: 'API Error', impact: 0 }] };
    }
};

// --- Feedback UI in Reasoning Modal ---
(function() {
    const modal = document.getElementById('reasoningModal');
    if (!modal) return;
    const feedbackDiv = document.createElement('div');
    feedbackDiv.id = 'reasoningFeedback';
    feedbackDiv.style = 'margin-top:16px;text-align:center;';
    feedbackDiv.innerHTML = `
        <span>Was this score accurate? </span>
        <button id="feedbackYes" style="margin:0 8px;">👍</button>
        <button id="feedbackNo">👎</button>
        <span id="feedbackMsg" style="margin-left:12px;color:green;"></span>
    `;
    modal.querySelector('.modal-body').appendChild(feedbackDiv);
    modal.addEventListener('click', function(e) {
        if (e.target.id === 'feedbackYes' || e.target.id === 'feedbackNo') {
            const isCorrect = e.target.id === 'feedbackYes';
            const leadName = document.getElementById('reasoningLeadName').textContent;
            const lead = leadsData.find(l => l.contact === leadName);
            if (lead) {
                fetch('http://localhost:5000/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...lead, correct: isCorrect })
                });
                document.getElementById('feedbackMsg').textContent = 'Thank you for your feedback!';
            }
        }
    });
})();
    });
}