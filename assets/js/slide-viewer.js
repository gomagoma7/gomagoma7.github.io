/**
 * Slide Viewer - Interactive slide presentation component
 * Supports keyboard navigation, fullscreen, and thumbnails
 */

class SlideViewer {
  constructor(slideId) {
    this.slideId = slideId;
    this.currentSlide = 0;
    this.totalSlides = 0;
    this.slides = [];
    this.thumbnails = [];

    this.container = document.getElementById(`slide-viewer-${slideId}`);
    this.slideImage = document.getElementById(`current-slide-${slideId}`);
    this.counter = document.getElementById(`slide-counter-${slideId}`);
    this.progressBar = document.getElementById(`progress-bar-${slideId}`);
    this.prevBtn = document.getElementById(`prev-btn-${slideId}`);
    this.nextBtn = document.getElementById(`next-btn-${slideId}`);
    this.fullscreenBtn = document.getElementById(`fullscreen-btn-${slideId}`);
    this.thumbnailsContainer = document.getElementById(`thumbnails-${slideId}`);

    this.init();
  }

  async init() {
    try {
      await this.loadMetadata();
      this.setupEventListeners();
      this.showSlide(0);
    } catch (error) {
      console.error('Failed to initialize slide viewer:', error);
      this.showError('Failed to load slides. Please try again later.');
    }
  }

  async loadMetadata() {
    const metadataPath = `/assets/slides/${this.slideId}/metadata.json`;

    try {
      const response = await fetch(metadataPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const metadata = await response.json();

      this.totalSlides = metadata.totalSlides;
      this.slides = metadata.slides;

      this.updateCounter();
      this.renderThumbnails();
    } catch (error) {
      console.error('Error loading metadata:', error);
      throw error;
    }
  }

  setupEventListeners() {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.previousSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());

    // Fullscreen button
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));

    // Swipe gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    this.slideImage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    this.slideImage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  handleKeyPress(e) {
    // Only handle if this slide viewer is visible
    if (!this.isVisible()) return;

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.previousSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.nextSlide();
        break;
      case 'Home':
        e.preventDefault();
        this.showSlide(0);
        break;
      case 'End':
        e.preventDefault();
        this.showSlide(this.totalSlides - 1);
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        this.toggleFullscreen();
        break;
      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        break;
    }
  }

  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }

  showSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;

    this.currentSlide = index;
    const slide = this.slides[index];

    // Update slide image
    const imagePath = `/assets/slides/${this.slideId}/${slide.image}`;
    this.slideImage.src = imagePath;
    this.slideImage.alt = slide.title || `Slide ${index + 1}`;
    this.slideImage.classList.add('loaded');

    // Hide loading indicator
    const loading = this.container.querySelector('.slide-loading');
    if (loading) {
      loading.style.display = 'none';
    }

    // Update UI
    this.updateCounter();
    this.updateProgress();
    this.updateButtons();
    this.updateThumbnails();

    // Preload next slide for smooth transitions
    if (index < this.totalSlides - 1) {
      const nextSlide = this.slides[index + 1];
      const nextImage = new Image();
      nextImage.src = `/assets/slides/${this.slideId}/${nextSlide.image}`;
    }
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.showSlide(this.currentSlide + 1);
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.showSlide(this.currentSlide - 1);
    }
  }

  updateCounter() {
    const currentNum = this.counter.querySelector('.current-slide-num');
    const totalNum = this.counter.querySelector('.total-slides-num');

    if (currentNum) currentNum.textContent = this.currentSlide + 1;
    if (totalNum) totalNum.textContent = this.totalSlides;
  }

  updateProgress() {
    const progress = ((this.currentSlide + 1) / this.totalSlides) * 100;
    this.progressBar.style.width = `${progress}%`;
  }

  updateButtons() {
    this.prevBtn.disabled = this.currentSlide === 0;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
  }

  renderThumbnails() {
    this.thumbnailsContainer.innerHTML = '';

    this.slides.forEach((slide, index) => {
      const thumbnailItem = document.createElement('div');
      thumbnailItem.className = 'thumbnail-item';
      thumbnailItem.dataset.slideIndex = index;

      const img = document.createElement('img');
      img.src = `/assets/slides/${this.slideId}/${slide.thumbnail}`;
      img.alt = `Slide ${index + 1}`;
      img.loading = 'lazy';

      const number = document.createElement('div');
      number.className = 'thumbnail-number';
      number.textContent = index + 1;

      thumbnailItem.appendChild(img);
      thumbnailItem.appendChild(number);

      thumbnailItem.addEventListener('click', () => {
        this.showSlide(index);
      });

      this.thumbnailsContainer.appendChild(thumbnailItem);
      this.thumbnails.push(thumbnailItem);
    });
  }

  updateThumbnails() {
    this.thumbnails.forEach((thumbnail, index) => {
      if (index === this.currentSlide) {
        thumbnail.classList.add('active');
        // Scroll thumbnail into view
        thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        thumbnail.classList.remove('active');
      }
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
      this.container.classList.add('fullscreen');
      this.fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
    } else {
      document.exitFullscreen();
      this.container.classList.remove('fullscreen');
      this.fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
    }
  }

  isVisible() {
    const rect = this.container.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  showError(message) {
    const loading = this.container.querySelector('.slide-loading');
    if (loading) {
      loading.innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> ${message}`;
    }
  }
}

// Global initialization function
function initSlideViewer(slideId) {
  new SlideViewer(slideId);
}

// Auto-initialize all slide viewers on page load
document.addEventListener('DOMContentLoaded', function() {
  const viewers = document.querySelectorAll('[data-slide-id]');
  viewers.forEach(viewer => {
    const slideId = viewer.dataset.slideId;
    if (!viewer.classList.contains('initialized')) {
      new SlideViewer(slideId);
      viewer.classList.add('initialized');
    }
  });
});
