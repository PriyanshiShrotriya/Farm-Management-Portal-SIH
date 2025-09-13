
        let isHindi = false;
        let currentSlideIndex = 0;
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');
        const totalSlides = slides.length;

        // Language Toggle Function
        function toggleLanguage() {
            const langBtn = document.getElementById('langBtn');
            const elementsWithTranslation = document.querySelectorAll('[data-en][data-hi]');
            
            isHindi = !isHindi;
            
            elementsWithTranslation.forEach(element => {
                if (isHindi) {
                    element.textContent = element.getAttribute('data-hi');
                } else {
                    element.textContent = element.getAttribute('data-en');
                }
            });
            
            // Update language button
            langBtn.innerHTML = isHindi ? '🌐 English' : '🌐 हिंदी';
            
            // Update document language attribute
            document.documentElement.lang = isHindi ? 'hi' : 'en';

            // Update TTS language as well
            updateTTSLanguage(isHindi);
        }

        // Image Slider Functions
        function showSlide(index) {
            // Remove active class from all slides and dots
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Add active class to current slide and dot
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentSlideIndex = index;
        }

        function nextSlide() {
            const nextIndex = (currentSlideIndex + 1) % totalSlides;
            showSlide(nextIndex);
        }

        function previousSlide() {
            const prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
            showSlide(prevIndex);
            restartAutoSlide(); // Restart auto-slide after manual navigation
        }

        function currentSlide(index) {
            showSlide(index - 1);
            restartAutoSlide(); // Restart auto-slide after manual navigation
        }

        // Auto-slide functionality
        let autoSlideInterval;
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
        }

        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
            }
        }

        function restartAutoSlide() {
            stopAutoSlide();
            setTimeout(startAutoSlide, 1000); // Restart after 1 second pause
        }

        // Start auto-sliding when page loads
        document.addEventListener('DOMContentLoaded', function() {
            startAutoSlide();
        });

        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                previousSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                restartAutoSlide(); // Restart auto-slide after manual navigation
            }
        });

        // Pause auto-slide on hover, resume on mouse leave
        const heroImage = document.querySelector('.hero-image');
        heroImage.addEventListener('mouseenter', stopAutoSlide);
        heroImage.addEventListener('mouseleave', startAutoSlide);

        // Demo Functions
        function startDemo() {
            alert(isHindi ? 'डेमो शुरू हो रहा है...' : 'Starting demo...');
        }

        function watchDemo() {
            alert(isHindi ? 'डेमो वीडियो लोड हो रहा है...' : 'Loading demo video...');
        }

        function recordTreatment() {
            alert(isHindi ? 'उपचार रिकॉर्ड फॉर्म खुल रहा है...' : 'Opening treatment record form...');
        }

        function checkWithdrawal() {
            alert(isHindi ? 'निकासी अवधि की जांच की जा रही है...' : 'Checking withdrawal periods...');
        }

        function scanProduct() {
            alert(isHindi ? 'उत्पाद स्कैनर शुरू हो रहा है...' : 'Starting product scanner...');
        }

        function generateReport() {
            alert(isHindi ? 'रिपोर्ट तैयार की जा रही है...' : 'Generating report...');
        }

        // Text-to-Speech functionality
        class TTSManager {
            constructor() {
                this.isActive = false;
                this.isReading = false;
                this.currentUtterance = null;
                this.voices = [];
                this.settings = {
                    rate: 1,
                    pitch: 1,
                    volume: 0.8,
                    lang: 'en-US'
                };
                
                this.init();
            }
            
            init() {
                // Wait for voices to be loaded
                if (speechSynthesis.onvoiceschanged !== undefined) {
                    speechSynthesis.onvoiceschanged = () => {
                        this.voices = speechSynthesis.getVoices();
                        this.updateLanguageOptions();
                    };
                }
                
                // Initialize controls
                this.setupControls();
                this.setupEventListeners();
            }
            
            setupControls() {
                document.getElementById('speedSlider').value = this.settings.rate;
                document.getElementById('pitchSlider').value = this.settings.pitch;
                document.getElementById('volumeSlider').value = this.settings.volume;
                document.getElementById('ttsLanguage').value = this.settings.lang;
            }
            
            setupEventListeners() {
                // Speed control
                document.getElementById('speedSlider').addEventListener('input', (e) => {
                    this.settings.rate = parseFloat(e.target.value);
                });
                
                // Pitch control
                document.getElementById('pitchSlider').addEventListener('input', (e) => {
                    this.settings.pitch = parseFloat(e.target.value);
                });
                
                // Volume control
                document.getElementById('volumeSlider').addEventListener('input', (e) => {
                    this.settings.volume = parseFloat(e.target.value);
                });
                
                // Language control
                document.getElementById('ttsLanguage').addEventListener('change', (e) => {
                    this.settings.lang = e.target.value;
                });
                
                // Close controls when clicking outside
                document.addEventListener('click', (e) => {
                    const container = document.querySelector('.tts-container');
                    if (!container.contains(e.target)) {
                        this.hideControls();
                    }
                });
                
                // Keyboard shortcut (Ctrl + Shift + S)
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                        e.preventDefault();
                        this.toggleTTS();
                    }
                });
            }
            
            updateLanguageOptions() {
                const select = document.getElementById('ttsLanguage');
                const currentValue = select.value;
                
                // Clear current options except default ones
                select.innerHTML = `
                    <option value="en-US">English</option>
                    <option value="hi-IN">हिंदी</option>
                `;
                
                // Add available voices
                const uniqueLangs = [...new Set(this.voices.map(voice => voice.lang))];
                uniqueLangs.forEach(lang => {
                    if (lang !== 'en-US' && lang !== 'hi-IN') {
                        const option = document.createElement('option');
                        option.value = lang;
                        option.textContent = lang;
                        select.appendChild(option);
                    }
                });
                
                select.value = currentValue;
            }
            
            toggleTTS() {
                if (this.isActive) {
                    this.stopTTS();
                } else {
                    this.startTTS();
                }
            }
            
            startTTS() {
                this.isActive = true;
                this.updateButton(true);
                this.showControls();
                this.showStatus('TTS Active - Click on text to read');
                
                // Add click listeners to readable elements
                this.addClickListeners();
            }
            
            stopTTS() {
                this.isActive = false;
                this.isReading = false;
                this.updateButton(false);
                this.hideControls();
                this.hideStatus();
                
                // Stop current speech
                speechSynthesis.cancel();
                
                // Remove click listeners
                this.removeClickListeners();
            }
            
            addClickListeners() {
                // Add listeners to common readable elements
                const readableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, td, th, div[data-en], div[data-hi]');
                
                readableElements.forEach(element => {
                    element.addEventListener('click', this.handleElementClick);
                    element.style.cursor = 'pointer';
                    element.title = 'Click to read aloud';
                });
            }
            
            removeClickListeners() {
                const readableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, td, th, div[data-en], div[data-hi]');
                
                readableElements.forEach(element => {
                    element.removeEventListener('click', this.handleElementClick);
                    element.style.cursor = '';
                    element.title = '';
                });
            }
            
            handleElementClick = (e) => {
                if (!this.isActive) return;
                
                e.preventDefault();
                e.stopPropagation();
                
                let textToRead = '';
                const element = e.currentTarget;
                
                // Check if element has translation data
                if (this.settings.lang === 'hi-IN' && element.getAttribute('data-hi')) {
                    textToRead = element.getAttribute('data-hi');
                } else if (element.getAttribute('data-en')) {
                    textToRead = element.getAttribute('data-en');
                } else {
                    textToRead = element.textContent || element.innerText;
                }
                
                if (textToRead.trim()) {
                    this.speakText(textToRead.trim());
                }
            }
            
            speakText(text) {
                // Stop current speech
                speechSynthesis.cancel();
                
                // Create new utterance
                this.currentUtterance = new SpeechSynthesisUtterance(text);
                
                // Apply settings
                this.currentUtterance.rate = this.settings.rate;
                this.currentUtterance.pitch = this.settings.pitch;
                this.currentUtterance.volume = this.settings.volume;
                this.currentUtterance.lang = this.settings.lang;
                
                // Find appropriate voice
                const voice = this.voices.find(v => v.lang === this.settings.lang);
                if (voice) {
                    this.currentUtterance.voice = voice;
                }
                
                // Event handlers
                this.currentUtterance.onstart = () => {
                    this.isReading = true;
                    this.updateButton(true, true);
                    this.showStatus('Reading...');
                };
                
                this.currentUtterance.onend = () => {
                    this.isReading = false;
                    this.updateButton(true, false);
                    this.showStatus('TTS Active - Click on text to read');
                };
                
                this.currentUtterance.onerror = () => {
                    this.isReading = false;
                    this.updateButton(true, false);
                    this.showStatus('Error occurred');
                    setTimeout(() => {
                        this.showStatus('TTS Active - Click on text to read');
                    }, 2000);
                };
                
                // Speak the text
                speechSynthesis.speak(this.currentUtterance);
            }
            
            updateButton(active, reading = false) {
                const button = document.getElementById('ttsButton');
                const icon = document.getElementById('ttsIcon');
                
                button.classList.toggle('active', active);
                
                if (reading) {
                    // Show stop icon when reading
                    icon.innerHTML = '<path d="M6 6h12v12H6z"/>';
                    button.title = 'Stop Reading';
                } else if (active) {
                    // Show speaker icon when active
                    icon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
                    button.title = 'Stop TTS';
                } else {
                    // Show muted speaker icon when inactive
                    icon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
                    button.title = 'Start TTS';
                }
            }
            
            showControls() {
                document.getElementById('ttsControls').classList.add('show');
            }
            
            hideControls() {
                document.getElementById('ttsControls').classList.remove('show');
            }
            
            showStatus(message) {
                const status = document.getElementById('ttsStatus');
                status.textContent = message;
                status.classList.add('show');
            }
            
            hideStatus() {
                const status = document.getElementById('ttsStatus');
                status.classList.remove('show');
            }
        }

        // Initialize TTS Manager
        let ttsManager;

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                ttsManager = new TTSManager();
            });
        } else {
            ttsManager = new TTSManager();
        }

        // Global function for button onclick
        function toggleTTS() {
            if (ttsManager) {
                ttsManager.toggleTTS();
            }
        }

        // Update TTS controls when language changes
        function updateTTSLanguage(isHindi) {
            if (ttsManager) {
                ttsManager.settings.lang = isHindi ? 'hi-IN' : 'en-US';
                document.getElementById('ttsLanguage').value = ttsManager.settings.lang;
            }
        }
