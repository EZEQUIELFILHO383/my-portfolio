document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS Animation
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: window.innerWidth < 768
        });
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            sidebar.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            
            // Update aria-expanded attribute
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Close sidebar when clicking on a nav link (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth < 992) {
                mobileMenuBtn.classList.remove('active');
                sidebar.classList.remove('active');
                document.body.classList.remove('no-scroll');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Typed.js Initialization
    if (document.querySelector('.header-typed')) {
        try {
            const typed = new Typed('.header-typed', {
                strings: ['Desenvolvedor Full Stack', 'Especialista em React', 'Criador de Soluções'],
                typeSpeed: 80,
                backSpeed: 40,
                loop: true,
                showCursor: false
            });
        } catch (e) {
            console.error('Typed.js initialization error:', e);
            document.querySelector('.header-typed').textContent = 'Desenvolvedor Full Stack';
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate scroll position considering fixed header
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link in sidebar
                if (this.classList.contains('nav-link')) {
                    document.querySelectorAll('.nav-link').forEach(navLink => {
                        navLink.classList.remove('active');
                        navLink.setAttribute('aria-current', 'false');
                    });
                    this.classList.add('active');
                    this.setAttribute('aria-current', 'page');
                }
                
                // Update URL without page reload
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });

    // Portfolio filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length && portfolioItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter items with animation
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        item.setAttribute('aria-hidden', 'false');
                    } else {
                        item.style.display = 'none';
                        item.setAttribute('aria-hidden', 'true');
                    }
                });
            });
        });
    }

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
                backToTopButton.setAttribute('aria-hidden', 'false');
            } else {
                backToTopButton.classList.remove('active');
                backToTopButton.setAttribute('aria-hidden', 'true');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Move focus to header for accessibility
            document.querySelector('header')?.focus();
        });
    }

    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const nameInput = this.querySelector('input[name="name"]');
            const emailInput = this.querySelector('input[name="email"]');
            const messageInput = this.querySelector('textarea[name="message"]');
            let isValid = true;
            
            // Reset error states
            this.querySelectorAll('.error').forEach(el => el.remove());
            
            // Validate name
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Por favor, insira seu nome');
                isValid = false;
            }
            
            // Validate email
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Por favor, insira seu email');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Por favor, insira um email válido');
                isValid = false;
            }
            
            // Validate message
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Por favor, insira sua mensagem');
                isValid = false;
            }
            
            if (isValid) {
                // Get form values
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());
                
                // Here you would typically send the data to a server
                console.log('Form submitted:', data);
                
                // Show success message
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Enviando...';
                submitButton.disabled = true;
                
                // Simulate network request
                setTimeout(() => {
                    submitButton.textContent = 'Mensagem Enviada!';
                    
                    // Reset form
                    setTimeout(() => {
                        this.reset();
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                        
                        // Show success notification
                        showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
                    }, 1500);
                }, 1000);
            }
        });
    }

    // Helper function to show error messages
    function showError(input, message) {
        const errorElement = document.createElement('p');
        errorElement.className = 'error';
        errorElement.style.color = 'var(--accent-color)';
        errorElement.style.marginTop = '0.5rem';
        errorElement.style.fontSize = '0.875rem';
        errorElement.textContent = message;
        
        input.parentNode.appendChild(errorElement);
        input.focus();
    }

    // Helper function to validate email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Helper function to show notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.setAttribute('role', 'alert');
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Hide after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-100%)';
            
            // Remove after animation
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Update active nav link on scroll
    function updateActiveLink() {
        const scrollPosition = window.scrollY + 100;
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                if (correspondingLink && !correspondingLink.classList.contains('active')) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        link.setAttribute('aria-current', 'false');
                    });
                    
                    correspondingLink.classList.add('active');
                    correspondingLink.setAttribute('aria-current', 'page');
                }
            }
        });
    }
    
    // Initial update
    updateActiveLink();
    
    // Update on scroll
    window.addEventListener('scroll', throttle(updateActiveLink, 100));

    // Expand sidebar on hover (desktop)
    function handleSidebarHover() {
        if (window.innerWidth >= 992) {
            const navLinks = document.querySelectorAll('.nav-link span');
            
            sidebar.addEventListener('mouseenter', function() {
                this.style.width = '17.5rem';
                navLinks.forEach(span => {
                    span.style.opacity = '1';
                });
            });
            
            sidebar.addEventListener('mouseleave', function() {
                this.style.width = '5rem';
                navLinks.forEach(span => {
                    span.style.opacity = '0';
                });
            });
        }
    }
    
    // Initialize sidebar hover effect
    handleSidebarHover();
    
    // Throttle function for scroll events
    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // Update on window resize
    window.addEventListener('resize', throttle(function() {
        // Re-initialize AOS on resize
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        handleSidebarHover();
        
        // Close sidebar if window is resized to desktop
        if (window.innerWidth >= 992) {
            sidebar.classList.remove('active');
            mobileMenuBtn?.classList.remove('active');
            document.body.classList.remove('no-scroll');
            mobileMenuBtn?.setAttribute('aria-expanded', 'false');
        }
    }, 100));

    // Add skip link functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Ir para o conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            // Add focus styles for keyboard navigation
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', function() {
        // Remove focus styles for mouse navigation
        document.body.classList.remove('keyboard-nav');
    });
});