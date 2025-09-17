// Announcement Banner System for Suu Website
class AnnouncementBanner {
    constructor() {
        this.bannerContainer = null;
        this.currentIndex = 0;
        this.announcements = [];
        this.scrollInterval = null;
        this.init();
    }

    init() {
        this.createBannerContainer();
        this.loadAnnouncements();
        this.displayAnnouncements();
        
        // Auto-refresh announcements every 30 seconds
        setInterval(() => {
            this.loadAnnouncements();
            this.displayAnnouncements();
        }, 30000);
    }

    createBannerContainer() {
        // Check if banner already exists
        if (document.getElementById('suu-announcement-banner')) return;

        const banner = document.createElement('div');
        banner.id = 'suu-announcement-banner';
        banner.className = 'suu-announcement-banner';
        
        const bannerContent = document.createElement('div');
        bannerContent.className = 'suu-announcement-content';
        
        const bannerText = document.createElement('div');
        bannerText.className = 'suu-announcement-text';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'suu-announcement-close';
        closeButton.innerHTML = '×';
        closeButton.onclick = () => this.hideBanner();

        bannerContent.appendChild(bannerText);
        bannerContent.appendChild(closeButton);
        banner.appendChild(bannerContent);

        // Insert at the top of body
        document.body.insertBefore(banner, document.body.firstChild);
        this.bannerContainer = banner;
    }

    loadAnnouncements() {
        const stored = localStorage.getItem('suu_active_announcements') || '[]';
        const allAnnouncements = JSON.parse(stored);
        
        console.log('Loading announcements:', allAnnouncements); // Debug log
        
        // Filter for currently active announcements
        this.announcements = allAnnouncements.filter(announcement => {
            if (!announcement.isActive) return false;
            
            const now = new Date();
            const start = new Date(announcement.startDate);
            const end = announcement.endDate ? new Date(announcement.endDate) : null;
            
            const isTimeActive = now >= start && (!end || now <= end);
            console.log(`Announcement "${announcement.title}" - Active: ${announcement.isActive}, Time Active: ${isTimeActive}`); // Debug log
            
            return isTimeActive;
        });
        
        console.log('Filtered active announcements:', this.announcements); // Debug log
    }

    displayAnnouncements() {
        if (!this.bannerContainer) return;
        
        // Check if banner was manually hidden
        if (!this.shouldShowBanner()) {
            this.hideBanner();
            return;
        }
        
        if (this.announcements.length === 0) {
            this.hideBanner();
            return;
        }

        this.showBanner();
        
        // Clear existing interval
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
        }

        // If only one announcement, display it statically
        if (this.announcements.length === 1) {
            this.displaySingleAnnouncement(this.announcements[0]);
            return;
        }

        // Multiple announcements - start scrolling
        this.currentIndex = 0;
        this.displayCurrentAnnouncement();
        
        // Auto-scroll every 5 seconds
        this.scrollInterval = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.announcements.length;
            this.displayCurrentAnnouncement();
        }, 5000);
    }

    displayCurrentAnnouncement() {
        const announcement = this.announcements[this.currentIndex];
        if (announcement) {
            this.displaySingleAnnouncement(announcement);
        }
    }

    displaySingleAnnouncement(announcement) {
        const textElement = this.bannerContainer.querySelector('.suu-announcement-text');
        const typeInfo = this.getAnnouncementTypeInfo(announcement.type);
        
        // Update banner class for styling
        this.bannerContainer.className = `suu-announcement-banner suu-announcement-${announcement.type}`;
        
        if (announcement.isScrolling) {
            textElement.innerHTML = `
                <div class="suu-announcement-marquee">
                    <span class="suu-announcement-emoji">${typeInfo.emoji}</span>
                    <strong>${announcement.title}:</strong> ${announcement.text}
                </div>
            `;
            textElement.classList.add('scrolling');
        } else {
            textElement.innerHTML = `
                <span class="suu-announcement-emoji">${typeInfo.emoji}</span>
                <strong>${announcement.title}:</strong> ${announcement.text}
            `;
            textElement.classList.remove('scrolling');
        }
    }

    getAnnouncementTypeInfo(type) {
        const types = {
            maintenance: { emoji: '🔧', color: '#ffc107' },
            update: { emoji: '✨', color: '#28a745' },
            celebration: { emoji: '🎉', color: '#e83e8c' },
            warning: { emoji: '⚠️', color: '#fd7e14' },
            info: { emoji: 'ℹ️', color: '#17a2b8' }
        };
        return types[type] || types.info;
    }

    showBanner() {
        if (this.bannerContainer) {
            this.bannerContainer.style.display = 'block';
            // Adjust body padding to account for banner
            document.body.style.paddingTop = '60px';
            document.body.classList.add('suu-banner-active');
            console.log('Banner shown with', this.announcements.length, 'announcements'); // Debug log
        }
    }

    hideBanner() {
        if (this.bannerContainer) {
            this.bannerContainer.style.display = 'none';
            document.body.style.paddingTop = '0';
            document.body.classList.remove('suu-banner-active');
        }
        
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
        }
        
        // Sadece mevcut oturum için gizle (sayfa yenilenince tekrar görünsün)
        sessionStorage.setItem('suu_banner_hidden_session', 'true');
    }

    shouldShowBanner() {
        // Sadece mevcut oturumda gizlendi mi kontrol et
        const hiddenInSession = sessionStorage.getItem('suu_banner_hidden_session');
        if (hiddenInSession === 'true') {
            return false;
        }
        return true;
    }
    
    // Manual refresh function for testing
    refresh() {
        console.log('Manually refreshing announcements...');
        this.loadAnnouncements();
        this.displayAnnouncements();
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not in admin page
    if (!window.location.pathname.includes('admin.html')) {
        // Sadece bir kez hoş geldiniz duyurusu ekle
        initWelcomeAnnouncement();
        
        window.suuAnnouncements = new AnnouncementBanner();
        
        // Global function for testing
        window.refreshAnnouncements = function() {
            if (window.suuAnnouncements) {
                window.suuAnnouncements.refresh();
            }
        };
        
        // Clear the hidden flag for testing
        window.clearAnnouncementHidden = function() {
            sessionStorage.removeItem('suu_banner_hidden_session');
            if (window.suuAnnouncements) {
                window.suuAnnouncements.refresh();
            }
        };
    }
});

// Hoş geldiniz duyurusu sadece bir kez ekle
function initWelcomeAnnouncement() {
    // Eğer daha önce hoş geldiniz duyurusu eklendiyse, tekrar ekleme
    const announcements = JSON.parse(localStorage.getItem('suu_announcements') || '[]');
    const hasWelcome = announcements.some(a => a.title === 'Suu Uygulamasına Hoş Geldiniz');
    
    if (!hasWelcome) {
        const welcomeAnnouncement = {
            id: Date.now(),
            title: 'Suu Uygulamasına Hoş Geldiniz',
            type: 'celebration',
            text: 'Günlük su ihtiyacınızı takip edin, sağlıklı kalın! 💧 Sağlıklı yaşam yolculuğunuza hoş geldiniz! 🌟',
            startDate: new Date().toISOString(),
            endDate: null, // Süresiz
            isActive: true,
            isScrolling: true,
            created: new Date().toISOString()
        };
        
        announcements.unshift(welcomeAnnouncement);
        localStorage.setItem('suu_announcements', JSON.stringify(announcements));
        
        // Aktif duyuruları güncelle
        updateActiveAnnouncements();
        
        console.log('Hoş geldiniz duyurusu eklendi');
    }
}

// Aktif duyuruları güncelle
function updateActiveAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('suu_announcements') || '[]');
    const activeAnnouncements = announcements.filter(a => {
        if (!a.isActive) return false;
        const now = new Date();
        const start = new Date(a.startDate);
        const end = a.endDate ? new Date(a.endDate) : null;
        return now >= start && (!end || now <= end);
    });
    
    localStorage.setItem('suu_active_announcements', JSON.stringify(activeAnnouncements));
}