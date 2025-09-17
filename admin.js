// Admin System for Suu News Management
const ADMIN_PASSWORD = '123987*qa';

// Initialize admin system
document.addEventListener('DOMContentLoaded', function() {
    // Set default date
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString().slice(0, 16);
    
    if (document.getElementById('newsDate')) {
        document.getElementById('newsDate').value = today;
    }
    
    // Set default announcement times
    if (document.getElementById('announcementStart')) {
        document.getElementById('announcementStart').value = now;
    }
    
    // Check if already logged in
    if (localStorage.getItem('suu_admin_logged_in') === 'true') {
        showAdminPanel();
    }
    
    // Setup form handlers
    if (document.getElementById('newsForm')) {
        document.getElementById('newsForm').addEventListener('submit', handleFormSubmit);
    }
    if (document.getElementById('announcementForm')) {
        document.getElementById('announcementForm').addEventListener('submit', handleAnnouncementSubmit);
    }
});

function login() {
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('suu_admin_logged_in', 'true');
        showAdminPanel();
        errorDiv.innerHTML = '';
    } else {
        errorDiv.innerHTML = '<div class="error">Hatalı şifre!</div>';
    }
}

function logout() {
    localStorage.removeItem('suu_admin_logged_in');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('adminPanel').classList.remove('show');
    document.getElementById('password').value = '';
}

function showAdminPanel() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('adminPanel').classList.add('show');
    loadNewsList();
    // Mevcut duyuruları da güncelleyelim
    updateMainSiteAnnouncements();
}

function showTab(tabName, event) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    if (tabName === 'list') {
        loadNewsList();
    } else if (tabName === 'listAnnouncements') {
        loadAnnouncementsList();
    }
}

function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('newsTitle').value;
    const date = document.getElementById('newsDate').value;
    const description = document.getElementById('newsDescription').value;
    const imageFile = document.getElementById('newsImage').files[0];
    
    if (!title || !date || !description) {
        showMessage('Lütfen tüm alanları doldurun!', 'error');
        return;
    }
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveNews({
                id: Date.now(),
                title: title,
                date: date,
                description: description,
                image: e.target.result,
                created: new Date().toISOString()
            });
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveNews({
            id: Date.now(),
            title: title,
            date: date,
            description: description,
            image: null,
            created: new Date().toISOString()
        });
    }
}

function saveNews(newsItem) {
    let newsList = JSON.parse(localStorage.getItem('suu_news') || '[]');
    newsList.unshift(newsItem);
    localStorage.setItem('suu_news', JSON.stringify(newsList));
    
    // Reset form
    document.getElementById('newsForm').reset();
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('newsDate').value = new Date().toISOString().split('T')[0];
    
    showMessage('Haber başarıyla eklendi!', 'success');
    updateMainSiteNews();
}

function loadNewsList() {
    const newsList = JSON.parse(localStorage.getItem('suu_news') || '[]');
    const listContainer = document.getElementById('newsList');
    
    if (newsList.length === 0) {
        listContainer.innerHTML = '<p>Henüz haber eklenmemiş.</p>';
        return;
    }
    
    listContainer.innerHTML = newsList.map(news => `
        <div class="news-item">
            ${news.image ? 
                `<img src="${news.image}" alt="${news.title}">` : 
                '<div style="width: 80px; height: 80px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📰</div>'
            }
            <div class="news-content">
                <h4>${news.title}</h4>
                <p style="color: #666; font-size: 14px; margin: 5px 0;">${formatDate(news.date)}</p>
                <p style="font-size: 14px; line-height: 1.4;">${news.description.substring(0, 150)}${news.description.length > 150 ? '...' : ''}</p>
            </div>
            <div class="news-actions">
                <button class="edit-btn" onclick="editNews(${news.id})">Düzenle</button>
                <button class="delete-btn" onclick="deleteNews(${news.id})">Sil</button>
            </div>
        </div>
    `).join('');
}

function deleteNews(id) {
    if (confirm('Bu haberi silmek istediğinizden emin misiniz?')) {
        let newsList = JSON.parse(localStorage.getItem('suu_news') || '[]');
        newsList = newsList.filter(news => news.id !== id);
        localStorage.setItem('suu_news', JSON.stringify(newsList));
        loadNewsList();
        updateMainSiteNews();
        showMessage('Haber silindi!', 'success');
    }
}

function editNews(id) {
    const newsList = JSON.parse(localStorage.getItem('suu_news') || '[]');
    const news = newsList.find(n => n.id === id);
    
    if (news) {
        document.getElementById('newsTitle').value = news.title;
        document.getElementById('newsDate').value = news.date;
        document.getElementById('newsDescription').value = news.description;
        
        if (news.image) {
            document.getElementById('imagePreview').src = news.image;
            document.getElementById('imagePreview').style.display = 'block';
        }
        
        // Switch to add tab
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelector('.nav-btn').classList.add('active');
        document.getElementById('addTab').classList.add('active');
        
        // Delete old news
        deleteNews(id);
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.innerHTML = `<div class="${type}">${message}</div>`;
    setTimeout(() => messageDiv.innerHTML = '', 5000);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR');
}

function updateMainSiteNews() {
    // This will be called when news are updated
    console.log('News updated - ready for main site integration');
}

// ============ ANNOUNCEMENT SYSTEM ============

function handleAnnouncementSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('announcementTitle').value;
    const type = document.getElementById('announcementType').value;
    const text = document.getElementById('announcementText').value;
    const startDate = document.getElementById('announcementStart').value;
    const endDate = document.getElementById('announcementEnd').value;
    const isActive = document.getElementById('announcementActive').checked;
    const isScrolling = document.getElementById('announcementScrolling').checked;
    
    if (!title || !type || !text || !startDate) {
        showAnnouncementMessage('Lütfen tüm gerekli alanları doldurun!', 'error');
        return;
    }
    
    if (endDate && new Date(endDate) <= new Date(startDate)) {
        showAnnouncementMessage('Bitiş tarihi başlangıç tarihinden sonra olmalı!', 'error');
        return;
    }
    
    const announcement = {
        id: Date.now(),
        title: title,
        type: type,
        text: text,
        startDate: startDate,
        endDate: endDate || null,
        isActive: isActive,
        isScrolling: isScrolling,
        created: new Date().toISOString()
    };
    
    saveAnnouncement(announcement);
}

function saveAnnouncement(announcement) {
    let announcements = JSON.parse(localStorage.getItem('suu_announcements') || '[]');
    announcements.unshift(announcement);
    localStorage.setItem('suu_announcements', JSON.stringify(announcements));
    
    // Reset form
    document.getElementById('announcementForm').reset();
    const now = new Date().toISOString().slice(0, 16);
    document.getElementById('announcementStart').value = now;
    document.getElementById('announcementActive').checked = true;
    document.getElementById('announcementScrolling').checked = true;
    
    showAnnouncementMessage('Duyuru başarıyla eklendi!', 'success');
    updateMainSiteAnnouncements();
}

function loadAnnouncementsList() {
    const announcements = JSON.parse(localStorage.getItem('suu_announcements') || '[]');
    const listContainer = document.getElementById('announcementsList');
    
    if (announcements.length === 0) {
        listContainer.innerHTML = '<p>Henüz duyuru eklenmemiş.</p>';
        return;
    }
    
    listContainer.innerHTML = announcements.map(announcement => {
        const isCurrentlyActive = isAnnouncementCurrentlyActive(announcement);
        const typeInfo = getAnnouncementTypeInfo(announcement.type);
        
        return `
            <div class="news-item announcement-item ${announcement.type}">
                <div style="width: 80px; height: 80px; background: ${typeInfo.bg}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                    ${typeInfo.emoji}
                </div>
                <div class="news-content">
                    <div class="announcement-type ${announcement.type}">${typeInfo.label}</div>
                    <h4>${announcement.title}</h4>
                    <p style="color: #666; font-size: 14px; margin: 5px 0;">
                        ${formatDateTime(announcement.startDate)} - ${announcement.endDate ? formatDateTime(announcement.endDate) : 'Süresiz'}
                    </p>
                    <p style="font-size: 14px; line-height: 1.4; margin-bottom: 8px;">${announcement.text}</p>
                    <div style="display: flex; gap: 10px; align-items: center; font-size: 12px;">
                        <span class="announcement-status ${isCurrentlyActive ? 'status-active' : 'status-inactive'}">
                            ${isCurrentlyActive ? '✓ Aktif' : '✗ Pasif'}
                        </span>
                        ${announcement.isScrolling ? '<span style="color: #007bff;">🎡 Kayan Yazı</span>' : ''}
                    </div>
                </div>
                <div class="news-actions">
                    <button class="edit-btn" onclick="toggleAnnouncementStatus(${announcement.id})">
                        ${announcement.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                    </button>
                    <button class="delete-btn" onclick="deleteAnnouncement(${announcement.id})">Sil</button>
                </div>
            </div>
        `;
    }).join('');
}

function getAnnouncementTypeInfo(type) {
    const types = {
        maintenance: { label: '🔧 Bakım', emoji: '🔧', bg: '#fff3cd' },
        update: { label: '✨ Yenilik', emoji: '✨', bg: '#d4edda' },
        celebration: { label: '🎉 Kutlama', emoji: '🎉', bg: '#f8d7da' },
        warning: { label: '⚠️ Uyarı', emoji: '⚠️', bg: '#ffeaa7' },
        info: { label: 'ℹ️ Bilgi', emoji: 'ℹ️', bg: '#d1ecf1' }
    };
    return types[type] || types.info;
}

function isAnnouncementCurrentlyActive(announcement) {
    if (!announcement.isActive) return false;
    
    const now = new Date();
    const start = new Date(announcement.startDate);
    const end = announcement.endDate ? new Date(announcement.endDate) : null;
    
    return now >= start && (!end || now <= end);
}

function toggleAnnouncementStatus(id) {
    let announcements = JSON.parse(localStorage.getItem('suu_announcements') || '[]');
    const index = announcements.findIndex(a => a.id === id);
    
    if (index !== -1) {
        announcements[index].isActive = !announcements[index].isActive;
        localStorage.setItem('suu_announcements', JSON.stringify(announcements));
        loadAnnouncementsList();
        updateMainSiteAnnouncements();
        showAnnouncementMessage(`Duyuru ${announcements[index].isActive ? 'aktifleştirildi' : 'pasifleştirildi'}!`, 'success');
    }
}

function deleteAnnouncement(id) {
    if (confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
        let announcements = JSON.parse(localStorage.getItem('suu_announcements') || '[]');
        announcements = announcements.filter(a => a.id !== id);
        localStorage.setItem('suu_announcements', JSON.stringify(announcements));
        loadAnnouncementsList();
        updateMainSiteAnnouncements();
        showAnnouncementMessage('Duyuru silindi!', 'success');
    }
}

function showAnnouncementMessage(message, type) {
    const messageDiv = document.getElementById('announcementFormMessage');
    messageDiv.innerHTML = `<div class="${type}">${message}</div>`;
    setTimeout(() => messageDiv.innerHTML = '', 5000);
}

function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'});
}

function updateMainSiteAnnouncements() {
    // This will update announcements on main site
    console.log('Announcements updated - ready for main site integration');
    
    // Get active announcements
    const announcements = JSON.parse(localStorage.getItem('suu_announcements') || '[]');
    const activeAnnouncements = announcements.filter(a => isAnnouncementCurrentlyActive(a));
    
    // Save active announcements for main site
    localStorage.setItem('suu_active_announcements', JSON.stringify(activeAnnouncements));
}