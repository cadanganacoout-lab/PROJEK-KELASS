        // alert("Disarankan Membuka Web Ini Menggunkan Mode Desktop.");
        
        // Loading Screen
        window.addEventListener('load', () => {
            const loader = document.getElementById('loader');
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 1000);
        });

        // Navbar Mobile Toggle
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');

        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Navbar Scroll Effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(35, 50, 98, 0.98)';
            } else {
                navbar.style.background = 'rgba(55, 61, 91, 0.95)';
            }
        });

        // Smooth Scrolling & Active Nav
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Update active nav link
        window.addEventListener('scroll', () => {
            let current = '';
            document.querySelectorAll('section').forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });

        // Generate Student Cards
        const studentsGrid = document.getElementById('studentsGrid');
        for (let i = 1; i <= 34; i++) {
            const studentCard = `
                <div class="student-card fade-in">
                    <img src="asset/fotoawal/sementara.png" alt="Siswa ${i}">
                    <h3>${i}</h3>
                    <div class="student-info">
                        <p><strong>Nama:</strong> Siswa ${i}</p>
                        <p><strong>Hobi:</strong> Coding & Gaming</p>
                        <p><strong>Keahlian:</strong> HTML, CSS, JavaScript</p>
                    </div>
                </div>
            `;
            studentsGrid.innerHTML += studentCard;
        }

        // Fade In Animation on Scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Scroll to Top Button
        const scrollTopBtn = document.getElementById('scrollTop');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Contact Form
        const contactForm = document.getElementById('contactForm');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert('Terima kasih! Pesan Anda telah terkirim. Kami akan segera membalas.');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });

        // Timeline Animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
        });

        // Add some interactive effects
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const overlay = item.querySelector('.gallery-overlay span').textContent;
                alert(`Galeri: ${overlay}\nKlik untuk melihat foto lengkap!`);
            });
        });

        // Horizontal scroll with mouse wheel for video section
        const videoScrollContainer = document.getElementById('videoScrollContainer');
        if (videoScrollContainer) {
            videoScrollContainer.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();
                    videoScrollContainer.scrollLeft += e.deltaY;
                }
            }, { passive: false });
        }

        // YouTube IFrame Player API
        var ytPlayers = [];

        function onYouTubeIframeAPIReady() {
            // Initialize players for all video iframes
            const playerIds = ['yt-player-1', 'yt-player-2', 'yt-player-3', 'yt-player-4', 'yt-player-5', 'yt-player-6', 'yt-player-7', 'yt-player-8', 'yt-player-9', 'yt-player-10', 'yt-player-11', 'yt-player-12'];
            
            playerIds.forEach((id, index) => {
                const iframe = document.getElementById(id);
                if (iframe) {
                    ytPlayers.push(new YT.Player(id, {
                        events: {
                            'onReady': onPlayerReady,
                            'onStateChange': onPlayerStateChange
                        }
                    }));
                }
            });
        }

        function onPlayerReady(event) {
            // Player is ready - you can add auto-play logic here if needed
            console.log('YouTube Player ready:', event.target);
        }

        function onPlayerStateChange(event) {
            // Handle player state changes
            // For example: pause other players when one starts playing
            if (event.data === YT.PlayerState.PLAYING) {
                ytPlayers.forEach(player => {
                    if (player !== event.target && player.pauseVideo) {
                        player.pauseVideo();
                    }
                });
            }
        }

        // PWA Service Worker (Optional)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('SW registered'))
                    .catch(err => console.log('SW registration failed'));
            });
        }
