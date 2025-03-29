document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const container = carousel.querySelector('.carousel-container');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevButton = carousel.querySelector('.carousel-button.prev');
    const nextButton = carousel.querySelector('.carousel-button.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const lightbox = document.querySelector('.lightbox');
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    let currentIndex = 0;
    const totalSlides = slides.length;

    // 创建轮播图指示点
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // 更新轮播图位置
    function updateCarousel() {
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
        // 更新指示点
        dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        // 更新说明文字
        const caption = slides[currentIndex].dataset.title;
        carousel.querySelector('.carousel-caption').textContent = caption;
    }

    // 切换到指定幻灯片
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    // 下一张幻灯片
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    // 上一张幻灯片
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // 自动播放
    let autoplayInterval;
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    // 绑定按钮事件
    prevButton.addEventListener('click', () => {
        prevSlide();
        stopAutoplay();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
    });

    // 触摸滑动支持
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoplay();
    });

    container.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;
        container.style.transform = `translateX(calc(-${currentIndex * 100}% - ${diff}px))`;
    });

    container.addEventListener('touchend', () => {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        updateCarousel();
        startAutoplay();
    });

    // 灯箱功能
    slides.forEach(slide => {
        const img = slide.querySelector('img');
        img.addEventListener('click', () => {
            lightboxContent.src = img.src;
            lightboxCaption.textContent = slide.dataset.title;
            lightbox.classList.add('active');
            stopAutoplay();
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        startAutoplay();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            startAutoplay();
        }
    });

    // 键盘支持
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
                startAutoplay();
            }
        } else {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                stopAutoplay();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                stopAutoplay();
            }
        }
    });

    // 启动自动播放
    startAutoplay();

    // 当页面不可见时停止自动播放
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    // 安装说明模态框功能
    const installHelpBtn = document.getElementById('installHelpBtn');
    const installHelpModal = document.getElementById('installHelpModal');
    const closeInstallHelp = document.getElementById('closeInstallHelp');

    if (installHelpBtn && installHelpModal) {
        installHelpBtn.addEventListener('click', () => {
            installHelpModal.style.display = 'flex';
        });

        closeInstallHelp.addEventListener('click', () => {
            installHelpModal.style.display = 'none';
        });

        installHelpModal.addEventListener('click', (e) => {
            if (e.target === installHelpModal) {
                installHelpModal.style.display = 'none';
            }
        });
    }
}); 