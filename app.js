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

const API_CONFIG = {
    UPDATE_INTERVAL: 30000,
    RETRY_DELAY: 5000
};

let mockWebSocket = null;
let isConnected = true;
let updateInterval = null;

function initializeMockWebSocket() {
    console.log('Initializing mock WebSocket for real-time simulation');
    isConnected = true;
    updateConnectionStatus(true);
    updateInterval = setInterval(() => {
        simulateContestUpdates();
    }, API_CONFIG.UPDATE_INTERVAL);
    setTimeout(() => {
        showRealtimeNotification('🟢 Connected to contest feed', 'success');
    }, 1000);
}

function simulateContestUpdates() {
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

function updateConnectionStatus(connected) {
    const statusIndicator = document.getElementById('connectionStatus');
    if (statusIndicator) {
        statusIndicator.textContent = connected ? '🟢 Live' : '🔴 Offline';
        statusIndicator.className = connected ? 'connection-status status-live' : 'connection-status status-offline';
    }
}

function handleRealtimeUpdate(data) {
    console.log('Mock real-time update:', data);
}

function processContestUpdates(updates) {
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

function showRealtimeNotification(message, level = 'info') {
    const notification = document.createElement('div');
    notification.className = `realtime-notification notification-${level}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    const container = document.getElementById('notificationContainer') || createNotificationContainer();
    container.appendChild(notification);
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

async function fetchContestsFromAPI() {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Mock API: Fetching contests');
    return contests;
}

async function submitNotificationSettings(formData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Mock API: Saving notification settings', formData);
    showRealtimeNotification('Settings saved successfully!', 'success');
    return { success: true, message: 'Settings saved' };
}

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
