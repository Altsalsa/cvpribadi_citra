// static/js/slider.js

let currentIndex = 0;
let autoSlideInterval;
const AUTO_SLIDE_DELAY = 2000; // 2 Detik

function showSlide(index) {
    const trackEl = document.getElementById("sliderTrack");
    const dotsEl = document.querySelectorAll(".dot");
    const total = document.querySelectorAll(".slide").length;

    if (!trackEl || total === 0) return;

    if (index >= total) currentIndex = 0;
    else if (index < 0) currentIndex = total - 1;
    else currentIndex = index;

    const gap = 20; 
    trackEl.style.transform = `translateX(calc(-${currentIndex * 85}% - ${currentIndex * gap}px))`;

    dotsEl.forEach(dot => dot.classList.remove("active"));
    if (dotsEl[currentIndex]) dotsEl[currentIndex].classList.add("active");
}

// Fungsi global ketika dot navigasi diklik
window.currentSlide = function(index) {
    resetAutoSlide(); 
    showSlide(index);
}

function startAutoSlide() {
    clearInterval(autoSlideInterval); 
    autoSlideInterval = setInterval(function() {
        showSlide(currentIndex + 1);
    }, AUTO_SLIDE_DELAY);
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide(); 
}

// --- LOGIKA GESER MANUAL (DRAG & SWIPE KANAN-KIRI) ---
let startX = 0;
let currentX = 0;
let isDragging = false;

function handleDragStart(e) {
    isDragging = true;
    clearInterval(autoSlideInterval); // Hentikan auto slide saat disentuh/klik
    startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    currentX = startX;
}

function handleDragMove(e) {
    if (!isDragging) return;
    currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    
    // Mencegah scroll vertikal di HP saat geser horizontal
    if (e.type.includes('touch')) {
        if (Math.abs(startX - currentX) > 10) {
            if (e.cancelable) e.preventDefault();
        }
    }
}

function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const diffX = startX - currentX; 

    // BISA GESER KANAN & KIRI
    if (diffX > 50) {
        // Geser ke kiri (Next Slide)
        showSlide(currentIndex + 1);
    } else if (diffX < -50) {
        // Geser ke kanan (Previous Slide)
        showSlide(currentIndex - 1);
    } else {
        // Kembali ke posisi semula jika geseran terlalu pendek
        showSlide(currentIndex); 
    }

    resetAutoSlide(); 
}

// Inisialisasi Event Listener
document.addEventListener("DOMContentLoaded", function() {
    const trackEl = document.getElementById("sliderTrack");
    
    if (trackEl) {
        // Event HP (Touch) - Mendukung geser kanan/kiri
        trackEl.addEventListener('touchstart', handleDragStart, { passive: true });
        trackEl.addEventListener('touchmove', handleDragMove, { passive: false });
        trackEl.addEventListener('touchend', handleDragEnd, { passive: true });
        
        // Event Laptop/Desktop (Mouse) - Dioptimalkan agar tidak macet
        trackEl.addEventListener('mousedown', handleDragStart);
        trackEl.addEventListener('mousemove', handleDragMove); 
        trackEl.addEventListener('mouseup', handleDragEnd);
        
        // Jika mouse keluar dari area slider, selesaikan geseran dengan aman
        trackEl.addEventListener('mouseleave', () => { 
            if (isDragging) {
                handleDragEnd(); // Menggunakan fungsi handleDragEnd agar kalkulasi kanan/kiri tetap jalan
            }
        });
        
        // Mencegah kendala bawaan browser saat gambar di-drag
        trackEl.querySelectorAll('img').forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }
    
    startAutoSlide();
});