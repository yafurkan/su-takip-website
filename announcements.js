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
        
        // Filter for currently active announcements
        this.announcements = allAnnouncements.filter(announcement => {
            if (!announcement.isActive) return false;
            
            const now = new Date();
            const start = new Date(announcement.startDate);
            const end = announcement.endDate ? new Date(announcement.endDate) : null;
            
            return now >= start && (!end || now <= end);
        });
    }

    displayAnnouncements() {
        if (!this.bannerContainer) return;
        
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
        }
    }

    hideBanner() {
        if (this.bannerContainer) {
            this.bannerContainer.style.display = 'none';
            document.body.style.paddingTop = '0';
        }
        
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
        }
        
        // Hide for 1 hour
        localStorage.setItem('suu_banner_hidden_until', Date.now() + (60 * 60 * 1000));
    }

    shouldShowBanner() {
        const hiddenUntil = localStorage.getItem('suu_banner_hidden_until');
        if (hiddenUntil && Date.now() < parseInt(hiddenUntil)) {
            return false;
        }
        return true;
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not in admin page
    if (!window.location.pathname.includes('admin.html')) {
        window.suuAnnouncements = new AnnouncementBanner();
    }
});