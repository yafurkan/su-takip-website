// Admin System for Suu News Management
const ADMIN_PASSWORD = 'suu2025admin';

// Initialize admin system
document.addEventListener('DOMContentLoaded', function() {
    // Set default date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('newsDate').value = today;
    
    // Check if already logged in
    if (localStorage.getItem('suu_admin_logged_in') === 'true') {
        showAdminPanel();
    }
    
    // Setup form handler
    document.getElementById('newsForm').addEventListener('submit', handleFormSubmit);
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
}

function showTab(tabName, event) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    if (tabName === 'list') {
        loadNewsList();
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