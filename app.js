// ---------------------- NAVIGATION --------------------
const pages = {
    contests: document.getElementById('contestsPage'),
    calendar: document.getElementById('calendarPage'),
    settings: document.getElementById('settingsPage')
};
const tabs = {
    contests: document.getElementById('contestsTab'),
    calendar: document.getElementById('calendarTab'),
    settings: document.getElementById('settingsTab')
};

function showPage(page) {
    Object.values(pages).forEach(p => p.classList.add('hidden'));
    Object.values(tabs).forEach(t => t.classList.remove('active'));
    pages[page].classList.remove('hidden');
    tabs[page].classList.add('active');
}
tabs.contests.onclick = () => showPage('contests');
tabs.calendar.onclick = () => showPage('calendar');
tabs.settings.onclick = () => showPage('settings');
document.getElementById('setupBtn').onclick = () => showPage('settings');
document.getElementById('calendarBtn').onclick = () => showPage('calendar');

// ---------------------- REAL-TIME API CONFIGURATION --------------------
const API_CONFIG = {
    UPDATE_INTERVAL: 30000, // 30 seconds
    RETRY_DELAY: 5000 // 5 seconds
};

// ---------------------- MOCK WEBSOCKET SIMULATION --------------------
let mockWebSocket = null;
let isConnected = true; // Start as connected since we're using mock data
let updateInterval = null;

function initializeMockWebSocket() {
    console.log('Initializing mock WebSocket for real-time simulation');
    isConnected = true;
    updateConnectionStatus(true);
    
    // Simulate real-time updates every 30 seconds
    updateInterval = setInterval(() => {
        simulateContestUpdates();
    }, API_CONFIG.UPDATE_INTERVAL);
    
    // Simulate initial connection
    setTimeout(() => {
        showRealtimeNotification('🟢 Connected to contest feed', 'success');
    }, 1000);
}

function simulateContestUpdates() {
    // Simulate random contest updates
    const updateTypes = ['participant_count', 'status_change', 'new_contest'];
    const randomUpdate = updateTypes[Math.floor(Math.random() * updateTypes.length)];
    
    switch (randomUpdate) {
        case 'participant_count':
            updateRandomParticipantCount();
            break;
        case 'status_change':
            simulateStatusChange();
            break;
        case 'new_contest':
            simulateNewContest();
            break;
    }
}

function updateRandomParticipantCount() {
    const randomContest = contests[Math.floor(Math.random() * contests.length)];
    if (randomContest && randomContest.status === 'Upcoming') {
        const change = Math.floor(Math.random() * 100) + 1;
        randomContest.participants += change;
        showRealtimeNotification(`📊 ${randomContest.name} now has ${randomContest.participants} participants`, 'info');
        renderContests();
    }
}

function simulateStatusChange() {
    const now = new Date();
    contests.forEach(contest => {
        if (contest.status === 'Upcoming' && contest.startTime <= now) {
            contest.status = 'Live';
            showRealtimeNotification(`🚀 ${contest.name} has started!`, 'info');
            renderContests();
        } else if (contest.status === 'Live' && contest.endTime <= now) {
            contest.status = 'Ended';
            showRealtimeNotification(`🏁 ${contest.name} has ended!`, 'success');
            renderContests();
        }
    });
}

function simulateNewContest() {
    // Only add new contests occasionally to avoid spam
    if (Math.random() < 0.3) {
        const newContest = generateMockContest();
        contests.unshift(newContest);
        showRealtimeNotification(`🆕 New contest: ${newContest.name}`, 'info');
        renderContests();
        updateCalendarEvents();
    }
}

function generateMockContest() {
    const platforms = ['Codeforces', 'AtCoder', 'LeetCode', 'CodeChef', 'HackerRank'];
    const contestTypes = ['Round', 'Contest', 'Challenge', 'Competition'];
    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
    
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const type = contestTypes[Math.floor(Math.random() * contestTypes.length)];
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    
    // Generate future date (1-30 days from now)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) + 1);
    startDate.setHours(Math.floor(Math.random() * 24));
    startDate.setMinutes(Math.floor(Math.random() * 60));
    
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + Math.floor(Math.random() * 3) + 1);
    
    return {
        id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${platform} ${type} #${Math.floor(Math.random() * 1000)}`,
        platform: platform,
        time: startDate.toLocaleDateString() + ' ' + startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        duration: `${Math.floor(Math.random() * 3) + 1}h ${Math.floor(Math.random() * 60)}m`,
        status: 'Upcoming',
        participants: Math.floor(Math.random() * 20000) + 1000,
        rated: Math.random() > 0.3,
        startTime: startDate,
        endTime: endDate,
        registrationUrl: `https://${platform.toLowerCase()}.com/contests`,
        tags: [difficulty.toLowerCase(), 'competitive', 'algorithm']
    };
}

// ---------------------- CONNECTION STATUS --------------------
function updateConnectionStatus(connected) {
    const statusIndicator = document.getElementById('connectionStatus');
    if (statusIndicator) {
        statusIndicator.textContent = connected ? '🟢 Live' : '🔴 Offline';
        statusIndicator.className = connected ? 'connection-status status-live' : 'connection-status status-offline';
    }
}

// ---------------------- REAL-TIME CONTEST UPDATES --------------------
function handleRealtimeUpdate(data) {
    // This function is now used for mock updates
    console.log('Mock real-time update:', data);
}

function processContestUpdates(updates) {
    // This function is now used for mock updates
    console.log('Processing mock updates:', updates);
}

function handleContestStart(contest) {
    showRealtimeNotification(`🚀 ${contest.name} has started!`, 'info');
    updateContestStatus(contest.id, 'Live');
}

function handleContestEnd(contest) {
    showRealtimeNotification(`🏁 ${contest.name} has ended!`, 'success');
    updateContestStatus(contest.id, 'Ended');
}

function updateContestStatus(contestId, newStatus) {
    const contest = contests.find(c => c.id === contestId);
    if (contest) {
        contest.status = newStatus;
        renderContests();
    }
}

// ---------------------- REAL-TIME NOTIFICATIONS --------------------
function showRealtimeNotification(message, level = 'info') {
    const notification = document.createElement('div');
    notification.className = `realtime-notification notification-${level}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to notification container
    const container = document.getElementById('notificationContainer') || createNotificationContainer();
    container.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notificationContainer';
    container.className = 'notification-container';
    document.body.appendChild(container);
    return container;
}

// ---------------------- MOCK API ENDPOINTS --------------------
async function fetchContestsFromAPI() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    console.log('Mock API: Fetching contests');
    return contests;
}

async function submitNotificationSettings(formData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate success
    console.log('Mock API: Saving notification settings', formData);
    showRealtimeNotification('Settings saved successfully!', 'success');
    return { success: true, message: 'Settings saved' };
}

// ---------------------- ENHANCED CONTEST DATA --------------------
const contests = [
    {
        id: "cf_900_div2",
        name: "Codeforces Round #900 (Div. 2)",
        platform: "Codeforces",
        time: "Dec 10, 2024 14:35",
        duration: "2h",
        status: "Upcoming",
        participants: 25420,
        rated: true,
        startTime: new Date('2024-12-10T14:35:00Z'),
        endTime: new Date('2024-12-10T16:35:00Z'),
        registrationUrl: "https://codeforces.com/contests",
        tags: ["competitive", "algorithm", "data-structures"]
    },
    {
        id: "atcoder_abc332",
        name: "AtCoder Beginner Contest 332",
        platform: "AtCoder",
        time: "Dec 10, 2024 21:00",
        duration: "1h 40m",
        status: "Upcoming",
        participants: 12850,
        rated: true,
        startTime: new Date('2024-12-10T21:00:00Z'),
        endTime: new Date('2024-12-10T22:40:00Z'),
        registrationUrl: "https://atcoder.jp/contests",
        tags: ["beginner", "competitive", "algorithm"]
    },
    {
        id: "leetcode_wc375",
        name: "LeetCode Weekly Contest 375",
        platform: "LeetCode",
        time: "Dec 11, 2024 02:30",
        duration: "1h 30m",
        status: "Live",
        participants: 15630,
        rated: true,
        startTime: new Date('2024-12-11T02:30:00Z'),
        endTime: new Date('2024-12-11T04:00:00Z'),
        registrationUrl: "https://leetcode.com/contest",
        tags: ["weekly", "competitive", "algorithm"]
    },
    {
        id: "codechef_starters112",
        name: "CodeChef Starters 112",
        platform: "CodeChef",
        time: "Dec 11, 2024 20:00",
        duration: "3h",
        status: "Upcoming",
        participants: 8420,
        rated: true,
        startTime: new Date('2024-12-11T20:00:00Z'),
        endTime: new Date('2024-12-11T23:00:00Z'),
        registrationUrl: "https://www.codechef.com/START",
        tags: ["starters", "competitive", "algorithm"]
    }
];

function renderContests() {
    const container = document.getElementById('contestsList');
    container.innerHTML = "";
    contests.forEach(c => {
        const timeUntilStart = getTimeUntilStart(c.startTime);
        const statusClass = c.status === "Live" ? "live" : c.status === "Ended" ? "ended" : "";
        
        container.innerHTML += `
        <div class="contest-card" data-contest-id="${c.id}">
            <h3>${c.name}</h3>
            <div><b>${c.platform}</b></div>
            <div> <span>${c.time}</span> &bull; <span>${c.duration}</span> </div>
            <div class="time-until">${timeUntilStart}</div>
            <div> Participants: ${c.participants} </div>
            <div>Status: <span class="status ${statusClass}">${c.status}</span></div>
            <div class="tags">
                ${c.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div>
                <button onclick="handleContestAction('${c.id}', '${c.status}')">
                    ${c.status === "Live" ? "Join Contest" : c.status === "Ended" ? "View Results" : "Set Reminder"}
                </button>
                <button onclick="openContestDetails('${c.id}')" style="background:#23233c;border:1px solid #a259ff;color:#a259ff;">
                    Details
                </button>
            </div>
        </div>
        `;
    });
}

function getTimeUntilStart(startTime) {
    const now = new Date();
    const timeDiff = startTime - now;
    
    if (timeDiff <= 0) return "Started";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h until start`;
    if (hours > 0) return `${hours}h ${minutes}m until start`;
    return `${minutes}m until start`;
}

function handleContestAction(contestId, status) {
    const contest = contests.find(c => c.id === contestId);
    if (!contest) return;
    
    switch (status) {
        case 'Live':
            window.open(contest.registrationUrl, '_blank');
            break;
        case 'Upcoming':
            setContestReminder(contest);
            break;
        case 'Ended':
            showContestResults(contest);
            break;
    }
}

function setContestReminder(contest) {
    showRealtimeNotification(`⏰ Reminder set for ${contest.name}`, 'info');
    // Here you would integrate with actual reminder system
}

function openContestDetails(contestId) {
    const contest = contests.find(c => c.id === contestId);
    if (!contest) return;
    
    // Show detailed modal or navigate to details page
    showContestModal(contest);
}

function showContestModal(contest) {
    const modal = document.createElement('div');
    modal.className = 'contest-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${contest.name}</h2>
            <div class="contest-details">
                <p><strong>Platform:</strong> ${contest.platform}</p>
                <p><strong>Start Time:</strong> ${contest.startTime.toLocaleString()}</p>
                <p><strong>Duration:</strong> ${contest.duration}</p>
                <p><strong>Participants:</strong> ${contest.participants}</p>
                <p><strong>Status:</strong> <span class="status ${contest.status === 'Live' ? 'live' : ''}">${contest.status}</span></p>
                <p><strong>Tags:</strong> ${contest.tags.join(', ')}</p>
            </div>
            <div class="modal-actions">
                <button onclick="window.open('${contest.registrationUrl}', '_blank')">Register</button>
                <button onclick="setContestReminder('${contest.id}')">Set Reminder</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close').onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function showContestResults(contest) {
    showRealtimeNotification(`🏆 Results for ${contest.name} are now available!`, 'success');
    // Here you would show contest results or redirect to results page
}

// ---------------------- SEARCH CONTESTS --------------------
document.getElementById('search').addEventListener('input', function() {
    let query = this.value.toLowerCase();
    const container = document.getElementById('contestsList');
    container.innerHTML = "";
    contests.filter(c => c.name.toLowerCase().includes(query)).forEach(c => {
        const timeUntilStart = getTimeUntilStart(c.startTime);
        const statusClass = c.status === "Live" ? "live" : c.status === "Ended" ? "ended" : "";
        
        container.innerHTML += `
        <div class="contest-card" data-contest-id="${c.id}">
            <h3>${c.name}</h3>
            <div><b>${c.platform}</b></div>
            <div> <span>${c.time}</span> &bull; <span>${c.duration}</span> </div>
            <div class="time-until">${timeUntilStart}</div>
            <div> Participants: ${c.participants} </div>
            <div>Status: <span class="status ${statusClass}">${c.status}</span></div>
            <div class="tags">
                ${c.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div>
                <button onclick="handleContestAction('${c.id}', '${c.status}')">
                    ${c.status === "Live" ? "Join Contest" : c.status === "Ended" ? "View Results" : "Set Reminder"}
                </button>
                <button onclick="openContestDetails('${c.id}')" style="background:#23233c;border:1px solid #a259ff;color:#a259ff;">
                    Details
                </button>
            </div>
        </div>
        `;
    });
});

// ---------------------- ENHANCED CALENDAR --------------------
function updateCalendarEvents() {
    // Update calendar with new contest data
    renderCalendar();
}

function renderCalendar() {
    const container = document.getElementById('calendar');
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let calendar = `<table><tr>
        <th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th>
    </tr><tr>`;
    
    let start = new Date(year, month, 1).getDay();
    for(let i=0; i<start; i++) calendar += "<td></td>";
    
    for(let day=1; day<=daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const contestsOnDay = getContestsOnDate(currentDate);
        let highlight = "";
        
        if (day === now.getDate() && month === now.getMonth()) {
            highlight = "today";
        } else if (contestsOnDay.length > 0) {
            highlight = "active-day";
        }
        
        calendar += `<td class="${highlight}" onclick="showDayEvents(${day})">${day}</td>`;
        if((start+day)%7 === 0) calendar += "</tr><tr>";
    }
    calendar += "</tr></table>";
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    container.innerHTML = `<h3>${monthNames[month]} ${year}</h3>` + calendar;
    
    // Show today's events by default
    renderEventList(now.getDate());
}

function getContestsOnDate(date) {
    return contests.filter(contest => {
        const contestDate = new Date(contest.startTime);
        return contestDate.getDate() === date.getDate() && 
               contestDate.getMonth() === date.getMonth() && 
               contestDate.getFullYear() === date.getFullYear();
    });
}

function showDayEvents(day) {
    const currentDate = new Date();
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayContests = getContestsOnDate(selectedDate);
    
    renderEventList(day, dayContests);
}

function renderEventList(day, dayContests = null) {
    const eventList = document.getElementById('eventList');
    const contestsToShow = dayContests || getContestsOnDate(new Date(new Date().getFullYear(), new Date().getMonth(), day));
    
    if (contestsToShow.length === 0) {
        eventList.innerHTML = `<h3>No contests on ${new Date().getMonth() + 1}/${day}/${new Date().getFullYear()}</h3>`;
        return;
    }
    
    eventList.innerHTML = `<h3>Contests on ${new Date().getMonth() + 1}/${day}/${new Date().getFullYear()}</h3>
        <div class="event-list">
            ${contestsToShow.map(contest => `
                <div class="event-item">
                    <div class="event-time">${contest.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    <div class="event-details">
                        <div class="event-name">${contest.name}</div>
                        <div class="event-platform">${contest.platform}</div>
                        <div class="event-status status ${contest.status === 'Live' ? 'live' : ''}">${contest.status}</div>
                    </div>
                </div>
            `).join('')}
        </div>`;
}

// ---------------------- NOTIFICATION SETTINGS --------------------
const emailNotif = document.getElementById('emailNotif');
const waNotif = document.getElementById('waNotif');
const waNumber = document.getElementById('waNumber');
emailNotif.onchange = function() {
    document.getElementById('email').disabled = !this.checked;
}
waNotif.onchange = function() {
    waNumber.disabled = !this.checked;
}

// ---------------------- ENHANCED NOTIFICATION SETTINGS --------------------
document.getElementById('notifForm').onsubmit = async function(e) {
    e.preventDefault();
    
    const formData = {
        emailNotifications: emailNotif.checked,
        email: document.getElementById('email').value,
        whatsappNotifications: waNotif.checked,
        whatsappNumber: waNumber.value,
        reminderTime: document.getElementById('reminderTime').value
    };
    
    try {
        await submitNotificationSettings(formData);
    } catch (error) {
        // Fallback to local storage if API fails
        localStorage.setItem('notificationSettings', JSON.stringify(formData));
        showRealtimeNotification('Settings saved locally!', 'info');
    }
};

// ---------------------- INITIALIZATION --------------------
function initializeApp() {
    // Initialize mock real-time connection
    initializeMockWebSocket();
    
    // Use mock data since we don't have external API
    console.log('Using mock data for contests');
    renderContests();
    
    // Render initial calendar
    renderCalendar();
    
    // Load saved settings
    loadSavedSettings();
    
    // Start real-time updates
    startRealTimeUpdates();
    
    // Show welcome notification
    setTimeout(() => {
        showRealtimeNotification('🎉 Welcome to CodeNotify! Real-time updates are active', 'success');
    }, 2000);
}

function loadSavedSettings() {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        emailNotif.checked = settings.emailNotifications;
        waNotif.checked = settings.whatsappNotifications;
        document.getElementById('email').value = settings.email;
        waNumber.value = settings.whatsappNumber;
        document.getElementById('reminderTime').value = settings.reminderTime;
        
        // Trigger change events to update UI state
        emailNotif.dispatchEvent(new Event('change'));
        waNotif.dispatchEvent(new Event('change'));
    }
}

function startRealTimeUpdates() {
    // Update contest times every minute
    setInterval(() => {
        renderContests();
    }, 60000);
    
    // Check for contest status changes every 30 seconds
    setInterval(() => {
        contests.forEach(contest => {
            const now = new Date();
            if (contest.status === 'Upcoming' && contest.startTime <= now) {
                updateContestStatus(contest.id, 'Live');
                handleContestStart(contest);
            } else if (contest.status === 'Live' && contest.endTime <= now) {
                updateContestStatus(contest.id, 'Ended');
                handleContestEnd(contest);
            }
        });
    }, 30000);
    
    // Simulate occasional participant count updates
    setInterval(() => {
        const randomContest = contests[Math.floor(Math.random() * contests.length)];
        if (randomContest && randomContest.status === 'Upcoming') {
            const change = Math.floor(Math.random() * 50) + 1;
            randomContest.participants += change;
            renderContests();
        }
    }, 45000); // Every 45 seconds
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
