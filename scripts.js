$(document).ready(function() {
    // تحسين أداء التمرير
    let isScrolling = false;

    // تبسيط التمرير السلس
    $('nav a, .project-link, #back-to-top').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            if (!isScrolling) {
                isScrolling = true;
                const hash = this.hash;
                
                $('html, body').animate({
                    scrollTop: $(hash).offset().top - 70
                }, {
                    duration: 400,
                    complete: function() {
                        isScrolling = false;
                        window.location.hash = hash;
                    }
                });
            }
        }
    });

    // تبسيط عملية التمرير بالماوس
    let wheelTimeout;
    $(window).on('wheel', function(e) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
    });

    // تحسين زر العودة للأعلى
    const $backToTop = $('<div id="back-to-top" class="btn btn-primary"><i class="fas fa-arrow-up"></i></div>')
        .appendTo('body')
        .hide();

    $(window).scroll($.throttle(200, function() {
        if ($(this).scrollTop() > 300) {
            $backToTop.fadeIn(300);
        } else {
            $backToTop.fadeOut(300);
        }
    }));

    $backToTop.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 400);
    });

    // تحسين الـ AOS
    AOS.init({
        once: true,
        duration: 600,
        offset: 100
    });
});

// دالة throttle لتحسين الأداء
$.throttle = function(delay, fn) {
    let last, deferTimer;
    return function(...args) {
        const now = Date.now();
        if (last && now < last + delay) {
            clearTimeout(deferTimer);
            deferTimer = setTimeout(() => {
                last = now;
                fn.apply(this, args);
            }, delay);
        } else {
            last = now;
            fn.apply(this, args);
        }
    };
};

// دالة فتح مشاهد الصور
function openImageViewer(imgSrc) {
    const viewer = document.getElementById('imageViewer');
    const expandedImg = document.getElementById('expandedImg');
    
    viewer.style.display = 'block';
    expandedImg.src = imgSrc;
    
    // منع التمرير في الخلفية
    document.body.style.overflow = 'hidden';
}

// دالة إغلاق مشاهد الصور
function closeImageViewer() {
    const viewer = document.getElementById('imageViewer');
    viewer.style.display = 'none';
    
    // إعادة تفعيل التمرير
    document.body.style.overflow = 'auto';
}

// إغلاق المشاهد عند الضغط على ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageViewer();
    }
});

// إضافة تأثير التمرير السلس
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: target.offsetTop - 100,
            behavior: 'smooth'
        });
    });
});

// إضافة تأثير ظهور العناصر عند التمرير
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((elem) => {
    observer.observe(elem);
});

// تحسين أداء الموقع
document.addEventListener('DOMContentLoaded', () => {
    // تحميل الصور بشكل متأخر
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

// إضافة معالجة النقر على روابط القائمة
document.addEventListener('DOMContentLoaded', function() {
    // معالجة روابط القائمة التي تحتوي على #
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // إذا كان الرابط يحتوي على #
            if (this.getAttribute('href').includes('#')) {
                // إذا كنا في نفس الصفحة
                if (window.location.pathname.includes('index.html') || this.getAttribute('href').startsWith('index.html')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').split('#')[1];
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        // إذا كنا في صفحة أخرى، نذهب إلى الصفحة الرئيسية مع القسم المطلوب
                        window.location.href = this.getAttribute('href');
                    }
                }
            }
        });
    });
});
