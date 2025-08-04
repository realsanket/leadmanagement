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
// Load leads from localStorage if available
let leadsData = [];
const LOCAL_STORAGE_KEY = 'leadconnect_leads';
try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
        leadsData = JSON.parse(stored);
    } else {
        leadsData = [
            // ...existing code for default sample leads...
            {
                "id": 1,
                "company": "TechFlow Solutions",
                "contact": "Sarah Chen",
                "title": "VP of Engineering",
                "intentScore": 92,
                "industry": "Technology",
                "companySize": "Mid-Market",
                "insights": ["Visited pricing page 4 times", "Downloaded ROI calculator", "Attended webinar on AI integration"],
                "recommendedAction": "Schedule executive demo - Focus on ROI and integration capabilities",
                "reasoning": "High engagement across multiple touchpoints. Downloaded ROI calculator indicates budget consideration phase. Multiple pricing page visits suggest near-term decision timeline."
            },
            {
                "id": 2,
                "company": "MedCore Healthcare",
                "contact": "Dr. Michael Rodriguez",
                "title": "Chief Technology Officer",
                "intentScore": 88,
                "industry": "Healthcare",
                "companySize": "Enterprise",
                "insights": ["Researched HIPAA compliance features", "Downloaded security whitepaper", "Engaged with compliance-focused email campaign"],
                "recommendedAction": "Send healthcare compliance case study and schedule security review",
                "reasoning": "Strong focus on compliance and security indicates serious evaluation. Healthcare industry expertise and enterprise size suggest high-value opportunity."
            },
            {
                "id": 3,
                "company": "GreenEnergy Dynamics",
                "contact": "Lisa Park",
                "title": "Operations Director",
                "intentScore": 76,
                "industry": "Energy",
                "companySize": "Mid-Market",
                "insights": ["Viewed competitor comparison page", "Downloaded sustainability report", "Recent company expansion announcement"],
                "recommendedAction": "Follow up with sustainability-focused value proposition",
                "reasoning": "Competitor research indicates active evaluation phase. Sustainability focus aligns with company values and recent expansion suggests growth capital availability."
            },
            {
                "id": 4,
                "company": "FinTech Innovations",
                "contact": "James Wilson",
                "title": "Head of Digital Transformation",
                "intentScore": 85,
                "industry": "Finance",
                "companySize": "Enterprise",
                "insights": ["Multiple team members viewed product pages", "Downloaded integration guide", "Requested custom demo"],
                "recommendedAction": "Prepare comprehensive demo focusing on financial services integration",
                "reasoning": "Multi-stakeholder engagement and custom demo request indicate high intent. Financial services background requires specialized approach and compliance focus."
            },
            {
                "id": 5,
                "company": "LogiCorp Manufacturing",
                "contact": "Robert Thompson",
                "title": "IT Director",
                "intentScore": 67,
                "industry": "Manufacturing",
                "companySize": "Enterprise",
                "insights": ["Attended industry webinar", "Downloaded manufacturing case study", "Recently posted job openings for data analysts"],
                "recommendedAction": "Send manufacturing-specific ROI analysis and schedule discovery call",
                "reasoning": "Industry-specific content engagement and new data analyst hires suggest data modernization initiative. Manufacturing focus requires operational efficiency messaging."
            },
            {
                "id": 6,
                "company": "EduTech Academy",
                "contact": "Amanda Foster",
                "title": "Technology Integration Specialist",
                "intentScore": 58,
                "industry": "Education",
                "companySize": "Small Business",
                "insights": ["Viewed education pricing tier", "Downloaded getting started guide", "Shared content on LinkedIn"],
                "recommendedAction": "Follow up via LinkedIn with education sector success stories",
                "reasoning": "Education-focused engagement and social sharing indicate interest but budget constraints likely. Small business segment requires value-focused approach."
            },
            {
                "id": 7,
                "company": "RetailMax Solutions",
                "contact": "Kevin Chang",
                "title": "Chief Information Officer",
                "intentScore": 91,
                "industry": "Retail",
                "companySize": "Enterprise",
                "insights": ["Requested technical architecture review", "Downloaded API documentation", "Multiple C-level executives engaged"],
                "recommendedAction": "Schedule technical deep-dive with architecture team",
                "reasoning": "Technical architecture focus and C-level engagement indicate advanced evaluation stage. Enterprise retail requires scalability and performance emphasis."
            }
        ];
    }
} catch (e) {
    leadsData = [];
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
    if (!companyName || typeof companyName !== 'string' || !companyName.trim()) {
        return '--'; // fallback initials
    }
    return companyName.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
}

function getAvatarColor(id) {
    return avatarColors[(id - 1) % avatarColors.length];
}

function createLeadCard(lead) {
    const scoreBadge = getScoreBadge(lead.intentScore);
    const avatarColor = getAvatarColor(lead.id);
    const companyInitials = getCompanyInitials(lead.company);
    // Always show initials/abbreviation for all leads, never logo
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
        // Render as table/list view (with improved UI for delete button)
        container.innerHTML = `
            <style>
            .lead-list-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                background: #fff;
                box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                border-radius: 10px;
                overflow: hidden;
                font-size: 1em;
            }
            .lead-list-table thead th {
                background: #f7f7fa;
                color: #333;
                font-weight: 600;
                padding: 14px 10px;
                border-bottom: 2px solid #e0e0e0;
                text-align: left;
                letter-spacing: 0.02em;
            }
            .lead-list-table tbody tr {
                transition: background 0.2s;
            }
            .lead-list-table tbody tr:nth-child(even) {
                background: #fafbfc;
            }
            .lead-list-table tbody tr:hover {
                background: #eaf6fa;
            }
            .lead-list-table td {
                padding: 12px 10px;
                border-bottom: 1px solid #f0f0f0;
                vertical-align: middle;
            }
            .lead-list-table td[data-label="Actions"] {
                white-space: nowrap;
            }
            .delete-lead-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                background: #fff;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                color: #db4545;
                padding: 4px 8px;
                margin-left: 10px;
                font-size: 1.1em;
                transition: background 0.2s, box-shadow 0.2s;
                box-shadow: 0 1px 2px rgba(0,0,0,0.04);
                cursor: pointer;
            }
            .delete-lead-btn:hover, .delete-lead-btn:focus {
                background: #ffeaea;
                box-shadow: 0 2px 8px rgba(219,69,69,0.08);
                outline: none;
            }
            .delete-lead-btn .icon {
                margin-right: 4px;
                font-size: 1.2em;
            }
            .reasoning-btn {
                margin-right: 8px;
                background: #f7f7fa;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                color: #1fb8cd;
                padding: 4px 8px;
                font-size: 1.1em;
                transition: background 0.2s, box-shadow 0.2s;
                box-shadow: 0 1px 2px rgba(0,0,0,0.04);
                cursor: pointer;
            }
            .reasoning-btn:hover, .reasoning-btn:focus {
                background: #eaf6fa;
                box-shadow: 0 2px 8px rgba(31,184,205,0.08);
                outline: none;
            }
            .responsive-table-wrapper {
                width: 100%;
                overflow-x: auto;
                padding: 0;
            }
            </style>
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
                            <td data-label="Actions">
                                <span style="display:inline-flex;align-items:center;gap:8px;">
                                    <button type="button" class="reasoning-btn" data-lead-id="${lead.id}" title="Why this score?" aria-label="Show reasoning for ${lead.contact} at ${lead.company}" tabindex="0">ℹ️</button>
                                    <button type="button" class="delete-lead-btn" data-lead-id="${lead.id}" title="Delete lead" aria-label="Delete ${lead.contact} at ${lead.company}" tabindex="0">
                                        <span class="icon">🗑️</span> <span class="label" style="font-size:0.95em;">Delete</span>
                                    </button>
                                </span>
                            </td>
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
        // Add event listeners to reasoning and delete buttons after rendering
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
            // Delete button event listeners
            const deleteButtons = container.querySelectorAll('.delete-lead-btn');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const leadId = parseInt(this.dataset.leadId);
                    if (confirm('Are you sure you want to delete this lead?')) {
                        // Remove lead from leadsData
                        leadsData = leadsData.filter(l => l.id !== leadId);
                        hotLeads = leadsData.filter(l => l.intentScore >= 85);
                        filteredLeads = filterLeads(searchInput ? searchInput.value.toLowerCase().trim() : '', intentFilter ? intentFilter.value : '', industryFilter ? industryFilter.value : '', sizeFilter ? sizeFilter.value : '', false);
                        filteredHotLeads = filterLeads(hotSearchInput ? hotSearchInput.value.toLowerCase().trim() : '', '', hotIndustryFilter ? hotIndustryFilter.value : '', hotSizeFilter ? hotSizeFilter.value : '', true);
                        try {
                            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leadsData));
                        } catch (e) {}
                        renderLeads(container, filteredLeads, countElement);
                        updateHotLeadsView();
                        if (typeof renderAnalytics === 'function') renderAnalytics();
                        updateKPICards();
                    }
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
    // Persist current view in localStorage
    try {
        localStorage.setItem('leadconnect_currentView', currentView);
    } catch (e) {}
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
    
    // Restore last view and tab from localStorage
    let lastView = 'allLeadsView';
    let lastTab = 'card';
    try {
        lastView = localStorage.getItem('leadconnect_currentView') || 'allLeadsView';
        lastTab = localStorage.getItem('leadconnect_currentTab') || 'card';
    } catch (e) {}
    // Set active view
    switchView(lastView);
    // Set active tab (Card/List)
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(b => b.classList.remove('active'));
    const tabBtn = document.querySelector(`.view-btn[data-view="${lastTab}"]`);
    if (tabBtn) tabBtn.classList.add('active');
    viewButtons.forEach(b => b.setAttribute('aria-pressed', b.classList.contains('active')));
    // Initial render for views
    if (lastView === 'allLeadsView') {
        updateAllLeadsView();
    } else if (lastView === 'hotLeadsView') {
        updateHotLeadsView();
    } else if (lastView === 'analyticsView') {
        renderAnalytics();
    }
    
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
            // Persist current tab in localStorage
            try {
                localStorage.setItem('leadconnect_currentTab', this.dataset.view);
            } catch (e) {}
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
    // Add Clear button next to List view toggle
    const listBtn = document.querySelector('.view-btn[data-view="list"]');
    if (listBtn && !document.getElementById('clearLeadsBtn')) {
        const clearBtn = document.createElement('button');
        clearBtn.id = 'clearLeadsBtn';
        clearBtn.className = 'view-btn';
        clearBtn.setAttribute('data-view', 'clear');
        clearBtn.innerHTML = `<span class="icon">🗑️</span> <span class="label">Clear</span>`;
        clearBtn.title = 'Clear all leads';
        clearBtn.style.marginLeft = '8px';
        clearBtn.setAttribute('tabindex', '0');
        clearBtn.setAttribute('aria-label', 'Clear all leads');
        listBtn.parentNode.insertBefore(clearBtn, listBtn.nextSibling);
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all leads? This action cannot be undone.')) {
                leadsData = [];
                hotLeads = [];
                filteredLeads = [];
                filteredHotLeads = [];
                try {
                    localStorage.removeItem(LOCAL_STORAGE_KEY);
                } catch (e) {}
                updateAllLeadsView();
                updateHotLeadsView();
                if (typeof renderAnalytics === 'function') renderAnalytics();
                updateKPICards();
            }
        });
        clearBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                clearBtn.click();
            }
        });
    }
    
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
    
    // Initialize import form handler
    const importForm = document.getElementById('importForm');
    if (importForm && !importForm.hasAttribute('data-initialized')) {
        importForm.setAttribute('data-initialized', 'true');
        initializeImportForm();
    }
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
    // Try to use the JavaScript ML model first
    try {
        // Check if the ML model is available
        if (typeof predictLeadScore === 'function') {
            console.log('Using JavaScript ML model for scoring');
            
            // Map JS lead fields to ML model expected format
            const payload = {
                'title': lead.title,
                'industry': lead.industry,
                'companySize': lead.companySize,
                'pageViews': lead.pageViews,
                'downloads': lead.downloads,
                'webinarAttended': lead.webinarAttended ? 1 : 0
            };
            
            const result = predictLeadScore(payload);
            console.log('ML prediction result:', result);
            return result;
        }
    } catch (e) {
        console.warn('JavaScript ML model failed, trying API fallback:', e.message);
    }
    
    // Fallback to API if ML model is not available
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
        if (!res.ok) throw new Error(`ML API error: ${res.status}`);
        console.log('Using Python API for scoring');
        return await res.json();
    } catch (e) {
        console.warn('Both ML model and API unavailable, using rule-based fallback:', e.message);
        // Fallback scoring when both ML model and API are unavailable
        return generateFallbackScore(lead);
    }
};

// Fallback scoring function when ML API is unavailable
function generateFallbackScore(lead) {
    let score = 0.3; // Base score
    
    // Score based on engagement
    if (lead.pageViews > 10) score += 0.2;
    else if (lead.pageViews > 5) score += 0.1;
    
    if (lead.downloads > 2) score += 0.2;
    else if (lead.downloads > 0) score += 0.1;
    
    if (lead.webinarAttended) score += 0.15;
    
    // Score based on company attributes
    if (lead.companySize === 'Enterprise') score += 0.1;
    else if (lead.companySize === 'Mid-Market') score += 0.05;
    
    // Industry scoring
    const highValueIndustries = ['Technology', 'Finance', 'Healthcare'];
    if (highValueIndustries.includes(lead.industry)) score += 0.1;
    
    // Title scoring
    const seniorTitles = ['CEO', 'CTO', 'VP', 'Director', 'Manager'];
    if (seniorTitles.some(title => lead.title.includes(title))) score += 0.1;
    
    // Cap at 1.0
    score = Math.min(score, 1.0);
    
    return {
        score: score,
        explanation: [
            { feature: 'Page Views', impact: lead.pageViews > 5 ? 0.1 : 0 },
            { feature: 'Downloads', impact: lead.downloads > 0 ? 0.1 : 0 },
            { feature: 'Webinar Attendance', impact: lead.webinarAttended ? 0.15 : 0 },
            { feature: 'Company Size', impact: lead.companySize === 'Enterprise' ? 0.1 : 0.05 },
            { feature: 'Industry', impact: highValueIndustries.includes(lead.industry) ? 0.1 : 0 }
        ]
    };
}

// Import functionality - all handled in initializeImportForm()
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

// File input handling moved to initializeImportForm()

function showMappingFields(headers) {
    const mappingSection = document.getElementById('mappingSection');
    const mappingFields = document.getElementById('mappingFields');
    const submitImportBtn = document.getElementById('submitImportBtn');
    
    if (!mappingFields) return;
    
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
        select.dataset.fieldKey = field.key;
        select.name = field.key; // Add name attribute for accessibility
        select.disabled = false; // Ensure dropdown is enabled
        // Improved auto-mapping logic for 'Contact Name'
        let normalizedFieldKey = field.key.trim().toLowerCase().replace(/[_\- ]+/g, '');
        let normalizedFieldLabel = field.label.trim().toLowerCase().replace(/[_\- ]+/g, '');
        let autoMatchIdx = -1;
        headers.forEach((h, idx) => {
            let normalizedHeader = h.trim().toLowerCase().replace(/[_\- ]+/g, '');
            // For 'contact', match 'contact', 'contactname', 'contact name'
            if (normalizedFieldKey === 'contact') {
                if (normalizedHeader === 'contact' || normalizedHeader === 'contactname' || normalizedHeader === 'contactname') autoMatchIdx = idx;
            } else if (normalizedHeader === normalizedFieldKey || normalizedHeader === normalizedFieldLabel) {
                autoMatchIdx = idx;
            }
        });
        // Fallback: if no match, select first header
        if (autoMatchIdx === -1) autoMatchIdx = 0;
        select.innerHTML = `<option value="">Select column for "${field.label}"</option>` +
            headers.map((h, idx) => `<option value="${h}"${autoMatchIdx === idx ? ' selected' : ''}>${h}</option>`).join('');
        // Add change event to update mapping immediately
        select.addEventListener('change', function() {
            console.log(`[Copilot Import Debug] Mapping dropdown changed: fieldKey=${field.key}, value=${this.value}`);
        });
        group.appendChild(label);
        group.appendChild(select);
        mappingFields.appendChild(group);
    });
    // Log dropdown interactivity for debugging
    const allSelects = mappingFields.querySelectorAll('select');
    allSelects.forEach((sel, idx) => {
        console.log(`[Copilot Import Debug] Mapping dropdown ${idx + 1}: enabled=${!sel.disabled}, name=${sel.name}, value=${sel.value}`);
    });
    if (mappingSection) mappingSection.classList.remove('hidden');
    if (submitImportBtn) submitImportBtn.classList.remove('hidden');
}

// Initialize import form functionality
function initializeImportForm() {
    const importForm = document.getElementById('importForm');
    const mappingSection = document.getElementById('mappingSection');
    const mappingFields = document.getElementById('mappingFields');
    const submitImportBtn = document.getElementById('submitImportBtn');
    const importStatus = document.getElementById('importStatus');
    const leadsContainer = document.getElementById('leadsContainer');
    const leadCountElement = document.getElementById('leadCount');
    const leadsFileInput = document.getElementById('leadsFile');
    
    if (!importForm) return;
    
    // File input handler
    if (leadsFileInput) {
        leadsFileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            // Show loader
            if (mappingSection) mappingSection.classList.add('hidden');
            if (submitImportBtn) submitImportBtn.classList.add('hidden');
            if (importStatus) importStatus.textContent = 'Reading file...';
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
                    if (importStatus) importStatus.textContent = `File loaded successfully. Found ${data.length} rows.`;
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
    
    // Form submit handler
    importForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!mappingFields) {
            if (importStatus) importStatus.textContent = 'Mapping fields not found.';
            return;
        }
        
        const selects = mappingFields.querySelectorAll('select');
        console.log(`[Copilot Import Debug] Found ${selects.length} mapping dropdowns in import form.`);
        selects.forEach((sel, idx) => {
            console.log(`[Copilot Import Debug] Import mapping dropdown ${idx + 1}: fieldKey=${sel.dataset.fieldKey}, value=${sel.value}`);
        });
        const mapping = {};
        selects.forEach(sel => {
            mapping[sel.dataset.fieldKey] = sel.value;
        });
        console.log('[Copilot Import Debug] Mapping built from dropdowns:', mapping);
        if (selects.length === 0) {
            if (importStatus) importStatus.textContent = 'No mapping dropdowns found. Please reload the page and try again.';
            console.warn('[Copilot Import Debug] Import prevented: no mapping dropdowns found.');
            return;
        }

        if (Object.values(mapping).some(v => !v)) {
            if (importStatus) importStatus.textContent = 'Please map all required fields.';
            console.warn('[Copilot Import Debug] Import prevented: not all required fields mapped.', mapping);
            return;
        }
        if (Object.keys(mapping).length === 0) {
            if (importStatus) importStatus.textContent = 'No mapping found. Please select columns for all fields.';
            console.warn('[Copilot Import Debug] Import prevented: mapping object is empty.', mapping);
            return;
        }

        // Clear any previous status
        if (importStatus) importStatus.textContent = 'Processing leads...';

        // Show loader
        if (leadsContainer) {
            leadsContainer.dataset.loading = 'true';
            renderLeads(leadsContainer, [], leadCountElement);
        }
        // Dynamic AI explanation generator
        function scoreAndExplain(lead) {
            return window.getLeadScoreFromAPI(lead);
        }
        // Fast parallel ML scoring for all leads with concurrency limit
        (async () => {
            const CONCURRENCY_LIMIT = 20; // Number of parallel requests
            const leads = [];
            let errorOccurred = false;

            console.log('Starting fast import for', importedCSVData.length, 'leads');

            // Prepare all lead objects first
            const allLeadObjs = importedCSVData.map((row, idx) => {
                // Improved value extraction: normalize mapping and fallback to original header
                if (idx === 0) {
                    console.log('[Copilot Import Debug] Mapping used for import:', mapping);
                }
                const getVal = key => {
                    let mapped = mapping[key];
                    let value = '';
                    if (!mapped) {
                        console.log(`[Copilot Import Debug] Row ${idx + 1}: No mapping for key '${key}'`);
                        return '';
                    }
                    // Try exact match
                    if (row[mapped] !== undefined && row[mapped] !== '') {
                        value = row[mapped];
                        console.log(`[Copilot Import Debug] Row ${idx + 1}: key='${key}', mapped='${mapped}', value='${value}' (exact match)`);
                        return value;
                    }
                    // Try normalized match (ignore case and spaces)
                    const normalizedMapped = mapped.trim().toLowerCase().replace(/[_\- ]+/g, '');
                    for (const h of Object.keys(row)) {
                        if (h.trim().toLowerCase().replace(/[_\- ]+/g, '') === normalizedMapped && row[h] !== '') {
                            value = row[h];
                            console.log(`[Copilot Import Debug] Row ${idx + 1}: key='${key}', mapped='${mapped}', value='${value}' (normalized match with header '${h}')`);
                            return value;
                        }
                    }
                    // Fallback: try first non-empty value in row
                    for (const h of Object.keys(row)) {
                        if (row[h] !== '') {
                            value = row[h];
                            console.log(`[Copilot Import Debug] Row ${idx + 1}: key='${key}', mapped='${mapped}', value='${value}' (fallback to first non-empty header '${h}')`);
                            return value;
                        }
                    }
                    console.log(`[Copilot Import Debug] Row ${idx + 1}: key='${key}', mapped='${mapped}', value='' (no value found)`);
                    return '';
                };
                const pageViews = parseInt(getVal('pageViews') || '0', 10);
                const downloads = parseInt(getVal('downloads') || '0', 10);
                const webinar = (getVal('webinarAttended') || '').toLowerCase() === 'yes';
                const INDUSTRY_OPTIONS = [
                    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Education', 'Retail', 'Energy'
                ];
                const SIZE_OPTIONS = [
                    'Enterprise', 'Mid-Market', 'Small Business'
                ];
                let rawIndustry = getVal('industry') || '';
                let normIndustry = INDUSTRY_OPTIONS.find(opt => opt.toLowerCase() === rawIndustry.trim().toLowerCase()) || rawIndustry.trim();
                let rawSize = getVal('companySize') || '';
                let normSize = SIZE_OPTIONS.find(opt => opt.toLowerCase() === rawSize.trim().toLowerCase()) || rawSize.trim();
                // Log all extracted values for this row
                console.log(`[Copilot Import Debug] Row ${idx + 1} extracted:`, {
                    contact: getVal('contact'),
                    company: getVal('company'),
                    title: getVal('title'),
                    industry: normIndustry,
                    companySize: normSize,
                    email: getVal('email'),
                    website: getVal('website'),
                    pageViews,
                    downloads,
                    webinarAttended: webinar
                });
                return {
                    id: leadsData.length + idx + 1,
                    contact: getVal('contact'),
                    company: getVal('company'),
                    title: getVal('title'),
                    industry: normIndustry,
                    companySize: normSize,
                    email: getVal('email'),
                    website: getVal('website'),
                    pageViews,
                    downloads,
                    webinarAttended: webinar
                };
            });

            // Helper for concurrency
            async function processBatch(batch) {
                return await Promise.allSettled(batch.map(async (lead) => {
                    let ai;
                    try {
                        ai = await scoreAndExplain(lead);
                    } catch (apiErr) {
                        ai = null;
                    }
                    if (!ai || typeof ai.score === 'undefined' || ai.error) {
                        return {
                            ...lead,
                            intentScore: 0,
                            insights: ['Unable to score this lead due to a technical issue.'],
                            recommendedAction: 'Please try importing this lead again later or contact support.',
                            reasoning: 'Lead could not be scored due to an API error.'
                        };
                    }
                    // Enhanced insights and reasoning
                    const insights = [];
                    if (lead.pageViews > 0) insights.push(`Visited the website ${lead.pageViews} times.`);
                    if (lead.downloads > 0) insights.push(`Downloaded ${lead.downloads} resources.`);
                    if (lead.webinarAttended) insights.push('Attended a recent webinar.');
                    if (ai.explanation && Array.isArray(ai.explanation) && ai.explanation.length > 0) {
                        ai.explanation.forEach(e => {
                            if (e.impact > 0) insights.push(`Strong positive: ${e.feature}.`);
                            else if (e.impact < 0) insights.push(`Negative: ${e.feature}.`);
                        });
                    }
                    // Compose a more natural and dynamic reasoning
                    let reasoning = '';
                    if (ai.explanation && Array.isArray(ai.explanation) && ai.explanation.length > 0) {
                        const validExplanations = ai.explanation.filter(e => e.feature && e.feature !== 'API Error');
                        if (validExplanations.length > 0) {
                            // Template-based, human-readable reasoning
                            const reasonTemplates = [];
                            validExplanations.forEach(e => {
                                if (e.feature === 'Page Views' && lead.pageViews > 0) {
                                    reasonTemplates.push(`High website engagement (${lead.pageViews} page views)`);
                                } else if (e.feature === 'Downloads' && lead.downloads > 0) {
                                    reasonTemplates.push(`Interest in resources (${lead.downloads} downloads)`);
                                } else if (e.feature === 'Webinar Attendance' && lead.webinarAttended) {
                                    reasonTemplates.push('Participation in a recent webinar');
                                } else if (e.feature === 'Company Size' && lead.companySize) {
                                    reasonTemplates.push(`Company size: ${lead.companySize}`);
                                } else if (e.feature === 'Industry' && lead.industry) {
                                    reasonTemplates.push(`Industry: ${lead.industry}`);
                                }
                            });
                            if (reasonTemplates.length > 0) {
                                reasoning = `This score reflects ${reasonTemplates.join(', ')}.`;
                            } else {
                                reasoning = `Score is based on available engagement and company attributes.`;
                            }
                        } else {
                            reasoning = null;
                        }
                    }
                    if (!reasoning) {
                        const reasons = [];
                        if (lead.pageViews > 0) reasons.push(`high website engagement (${lead.pageViews} page views)`);
                        if (lead.downloads > 0) reasons.push(`interest in resources (${lead.downloads} downloads)`);
                        if (lead.webinarAttended) reasons.push('participation in a recent webinar');
                        if (lead.companySize) reasons.push(`company size: ${lead.companySize}`);
                        if (lead.industry) reasons.push(`industry: ${lead.industry}`);
                        if (reasons.length > 0) {
                            reasoning = `Score is based on ${reasons.join(', ')}.`;
                        } else {
                            reasoning = 'Score is based on available engagement and company attributes.';
                        }
                    }
                    let recommendedAction = '';
                    if (ai.score >= 0.85) {
                        recommendedAction = 'Assign to a senior SDR for immediate follow-up. Consider a personalized demo or proposal.';
                        if (lead.webinarAttended) recommendedAction += ' Leverage their recent webinar attendance.';
                        if (lead.downloads > 2) recommendedAction += ' Highlight downloaded resources in outreach.';
                    } else if (ai.score >= 0.6) {
                        recommendedAction = 'Nurture with targeted content and schedule a discovery call.';
                        if (lead.pageViews > 5) recommendedAction += ' Reference their high website engagement.';
                    } else {
                        recommendedAction = 'Add to a long-term nurture campaign and monitor for future engagement.';
                        if (lead.pageViews === 0 && lead.downloads === 0) recommendedAction += ' Encourage initial engagement.';
                    }
                    return {
                        ...lead,
                        intentScore: Math.round(ai.score * 100),
                        insights,
                        recommendedAction,
                        reasoning
                    };
                }));
            }

            // Main batching loop
            let idx = 0;
            while (idx < allLeadObjs.length) {
                const batch = allLeadObjs.slice(idx, idx + CONCURRENCY_LIMIT);
                const results = await processBatch(batch);
                results.forEach(res => {
                    if (res.status === 'fulfilled') {
                        leads.push(res.value);
                    } else if (res.status === 'rejected') {
                        errorOccurred = true;
                    } else {
                        leads.push(res);
                    }
                });
                idx += CONCURRENCY_LIMIT;
                if (importStatus) importStatus.textContent = `Imported ${leads.length} of ${allLeadObjs.length} leads...`;
            }

            console.log('Fast import complete. Leads processed:', leads.length, 'Errors:', errorOccurred);

            if (!errorOccurred && leads.length > 0) {
                leadsData.push(...leads);
                // Persist to localStorage
                try {
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leadsData));
                } catch (e) {
                    console.warn('Failed to save leads to localStorage:', e);
                }
                if (importStatus) importStatus.textContent = `Successfully imported ${leads.length} leads!`;
                setTimeout(() => {
                    updateAllLeadsView();
                    hotLeads = leadsData.filter(lead => lead.intentScore >= 85);
                    updateHotLeadsView();
                    if (typeof renderAnalytics === 'function') renderAnalytics();
                    updateKPICards();
                }, 50);
                importForm.reset();
                if (mappingSection) mappingSection.classList.add('hidden');
                if (submitImportBtn) submitImportBtn.classList.add('hidden');
            } else if (errorOccurred) {
                if (importStatus) importStatus.textContent = 'Some leads could not be imported. Please check the data and try again.';
            } else {
                if (importStatus) importStatus.textContent = 'No leads were imported. Please check your CSV file and mapping.';
            }
            if (leadsContainer) {
                delete leadsContainer.dataset.loading;
                renderLeads(leadsContainer, filteredLeads, leadCountElement);
            }
        })();
    });
}

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
