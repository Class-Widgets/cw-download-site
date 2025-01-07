AOS.init({
    once: true,
    disable: 'phone',
    duration: 1000,
    easing: 'ease-out-cubic',
});

const clientsEl = document.querySelectorAll('.clients-carousel');
if (clientsEl.length > 0) {
    const clients = new Swiper('.clients-carousel', {
        slidesPerView: 'auto',
        spaceBetween: 64,
        centeredSlides: true,
        loop: true,
        speed: 5000,
        noSwiping: true,
        noSwipingClass: 'swiper-slide',
        autoplay: {
            delay: 0,
            disableOnInteraction: true,
        },
    });
}

const carouselEl = document.querySelectorAll('.testimonials-carousel');
if (carouselEl.length > 0) {
    const carousel = new Swiper('.testimonials-carousel', {
        breakpoints: {
            320: {
                slidesPerView: 1
            },
            640: {
                slidesPerView: 2
            },
            1024: {
                slidesPerView: 3
            }
        },
        grabCursor: true,
        loop: false,
        centeredSlides: false,
        initialSlide: 0,
        spaceBetween: 24,
        navigation: {
            nextEl: '.carousel-next',
            prevEl: '.carousel-prev',
        },
    });
}

class ParticleAnimation {
    constructor(el, {
        quantity = 30,
        staticity = 50,
        ease = 50
    } = {}) {
        this.canvas = el;
        if (!this.canvas) return;
        this.canvasContainer = this.canvas.parentElement;
        this.context = this.canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
        this.settings = {
            quantity: quantity,
            staticity: staticity,
            ease: ease,
        };
        this.circles = [];
        this.mouse = {
            x: 0,
            y: 0,
        };
        this.canvasSize = {
            w: 0,
            h: 0,
        };
        this.onMouseMove = this.onMouseMove.bind(this);
        this.initCanvas = this.initCanvas.bind(this);
        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.drawCircle = this.drawCircle.bind(this);
        this.drawParticles = this.drawParticles.bind(this);
        this.remapValue = this.remapValue.bind(this);
        this.animate = this.animate.bind(this);
        this.init();
    }

    init() {
        this.initCanvas();
        this.animate();
        window.addEventListener('resize', this.initCanvas);
        window.addEventListener('mousemove', this.onMouseMove);
    }

    initCanvas() {
        this.resizeCanvas();
        this.drawParticles();
    }

    onMouseMove(event) {
        const {
            clientX,
            clientY
        } = event;
        const rect = this.canvas.getBoundingClientRect();
        const {
            w,
            h
        } = this.canvasSize;
        const x = clientX - rect.left - (w / 2);
        const y = clientY - rect.top - (h / 2);
        const inside = x < (w / 2) && x > -(w / 2) && y < (h / 2) && y > -(h / 2);
        if (inside) {
            this.mouse.x = x;
            this.mouse.y = y;
        }
    }

    resizeCanvas() {
        this.circles.length = 0;
        this.canvasSize.w = this.canvasContainer.offsetWidth;
        this.canvasSize.h = this.canvasContainer.offsetHeight;
        this.canvas.width = this.canvasSize.w * this.dpr;
        this.canvas.height = this.canvasSize.h * this.dpr;
        this.canvas.style.width = this.canvasSize.w + 'px';
        this.canvas.style.height = this.canvasSize.h + 'px';
        this.context.scale(this.dpr, this.dpr);
    }

    circleParams() {
        const x = Math.floor(Math.random() * this.canvasSize.w);
        const y = Math.floor(Math.random() * this.canvasSize.h);
        const translateX = 0;
        const translateY = 0;
        const size = Math.floor(Math.random() * 2) + 1;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.2;
        const dy = (Math.random() - 0.5) * 0.2;
        const magnetism = 0.1 + Math.random() * 4;
        return {
            x,
            y,
            translateX,
            translateY,
            size,
            alpha,
            targetAlpha,
            dx,
            dy,
            magnetism
        };
    }

    drawCircle(circle, update = false) {
        const {
            x,
            y,
            translateX,
            translateY,
            size,
            alpha
        } = circle;
        this.context.translate(translateX, translateY);
        this.context.beginPath();
        this.context.arc(x, y, size, 0, 2 * Math.PI);
        this.context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.context.fill();
        this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        if (!update) {
            this.circles.push(circle);
        }
    }

    clearContext() {
        this.context.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
    }

    drawParticles() {
        this.clearContext();
        const particleCount = this.settings.quantity;
        for (let i = 0; i < particleCount; i++) {
            const circle = this.circleParams();
            this.drawCircle(circle);
        }
    }

    remapValue(value, start1, end1, start2, end2) {
        const remapped = (value - start1) * (end2 - start2) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
    }

    animate() {
        this.clearContext();
        this.circles.forEach((circle, i) => {
            const edge = [
                circle.x + circle.translateX - circle.size,
                this.canvasSize.w - circle.x - circle.translateX - circle.size,
                circle.y + circle.translateY - circle.size,
                this.canvasSize.h - circle.y - circle.translateY - circle.size,
            ];
            const closestEdge = edge.reduce((a, b) => Math.min(a, b));
            const remapClosestEdge = this.remapValue(closestEdge, 0, 20, 0, 1).toFixed(2);
            if (remapClosestEdge > 1) {
                circle.alpha += 0.02;
                if (circle.alpha > circle.targetAlpha) circle.alpha = circle.targetAlpha;
            } else {
                circle.alpha = circle.targetAlpha * remapClosestEdge;
            }
            circle.x += circle.dx;
            circle.y += circle.dy;
            circle.translateX += ((this.mouse.x / (this.settings.staticity / circle.magnetism)) - circle.translateX) / this.settings.ease;
            circle.translateY += ((this.mouse.y / (this.settings.staticity / circle.magnetism)) - circle.translateY) / this.settings.ease;
            if (circle.x < -circle.size || circle.x > this.canvasSize.w + circle.size || circle.y < -circle.size || circle.y > this.canvasSize.h + circle.size) {
                this.circles.splice(i, 1);
                const circle = this.circleParams();
                this.drawCircle(circle);
            } else {
                this.drawCircle({
                    ...circle,
                    x: circle.x,
                    y: circle.y,
                    translateX: circle.translateX,
                    translateY: circle.translateY,
                    alpha: circle.alpha
                }, true);
            }
        });
        window.requestAnimationFrame(this.animate);
    }
}

const canvasElements = document.querySelectorAll('[data-particle-animation]');
canvasElements.forEach(canvas => {
    const options = {
        quantity: canvas.dataset.particleQuantity,
        staticity: canvas.dataset.particleStaticity,
        ease: canvas.dataset.particleEase,
    };
    new ParticleAnimation(canvas, options);
});


class Highlighter {
    constructor(containerElement) {
        this.container = containerElement;
        this.boxes = Array.from(this.container.children);
        this.mouse = {
            x: 0,
            y: 0,
        };
        this.containerSize = {
            w: 0,
            h: 0,
        };
        this.initContainer = this.initContainer.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.init();
    }

    initContainer() {
        this.containerSize.w = this.container.offsetWidth;
        this.containerSize.h = this.container.offsetHeight;
    }

    onMouseMove(event) {
        const {
            clientX,
            clientY
        } = event;
        const rect = this.container.getBoundingClientRect();
        const {
            w,
            h
        } = this.containerSize;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const inside = x < w && x > 0 && y < h && y > 0;
        if (inside) {
            this.mouse.x = x;
            this.mouse.y = y;
            this.boxes.forEach((box) => {
                const boxX = -(box.getBoundingClientRect().left - rect.left) + this.mouse.x;
                const boxY = -(box.getBoundingClientRect().top - rect.top) + this.mouse.y;
                box.style.setProperty('--mouse-x', `${boxX}px`);
                box.style.setProperty('--mouse-y', `${boxY}px`);
            });
        }
    }

    init() {
        this.initContainer();
        window.addEventListener('resize', this.initContainer);
        window.addEventListener('mousemove', this.onMouseMove);
    }
}

const highlighters = document.querySelectorAll('[data-highlighter]');
highlighters.forEach((highlighter) => {
    new Highlighter(highlighter);
});

document.addEventListener('DOMContentLoaded', () => {
    /****************************************
     * 1) REFERENCES TO DOM ELEMENTS
     ****************************************/
    const accessibilityBtn = document.getElementById('page-settings-btn');
    const accessibilityMenu = document.getElementById('page-settings-menu');

    // Toggles for Beta/Release sections
    const toggleBetaBtn = document.getElementById('toggle-beta-section');
    const toggleReleasesBtn = document.getElementById('toggle-releases-section');

    // Toggles for "Adjust Section Width" and "Adjust Alignment"
    const toggleWidthBtn = document.getElementById('toggle-width');
    const toggleAlignmentBtn = document.getElementById('toggle-alignment');
    const widthSection = document.getElementById('width-section');
    const alignmentSection = document.getElementById('alignment-section');

    // Inputs for width and alignment
    const sectionWidthInput = document.getElementById('section-width');
    const alignmentSelect = document.getElementById('alignment');

    // Inputs for Beta and Releases header alignment
    const betaAlignmentSelect = document.getElementById('beta-alignment');
    const releasesAlignmentSelect = document.getElementById('releases-alignment');

    // Headers
    const betaHeader = document.getElementById('beta-header');
    const releasesHeader = document.getElementById('releases-header');

    // Sections
    const betaSection = document.getElementById('artifacts-section');
    const releasesSection = document.getElementById('releases-section');
    const allSections = document.querySelectorAll('.section');
    const mainElement = document.querySelector('main');

    // Reset Button
    const resetBtn = document.getElementById('reset-defaults');

    // IMPORTANT: Ensure these arrays are declared globally somewhere, or right here:
    let verJson = [];
    let releaseJson = [];

    /****************************************
     * 2) EVENT LISTENERS
     ****************************************/

    // 2.1) Toggle Accessibility Menu
    accessibilityBtn.addEventListener('click', () => {
        toggleDisplay(accessibilityMenu);
    });

    // 2.2) Toggle Beta Section
    toggleBetaBtn.addEventListener('click', () => {
        toggleDisplay(betaSection);
    });

    // 2.3) Toggle Releases Section
    toggleReleasesBtn.addEventListener('click', () => {
        toggleDisplay(releasesSection);
    });

    // 2.4) Toggle "Adjust Section Width"
    toggleWidthBtn.addEventListener('click', () => {
        toggleDisplay(widthSection);
    });

    // 2.5) Toggle "Adjust Alignment"
    toggleAlignmentBtn.addEventListener('click', () => {
        toggleDisplay(alignmentSection);
    });

    // 2.6) Adjust Section Width
    sectionWidthInput.addEventListener('change', () => {
        allSections.forEach(section => {
            section.style.width = sectionWidthInput.value;
        });
    });

    // 2.7) Adjust Main Alignment
    alignmentSelect.addEventListener('change', () => {
        mainElement.style.justifyContent = alignmentSelect.value;
    });

    // 2.8) Change Beta Header Alignment
    betaAlignmentSelect.addEventListener('change', () => {
        changeHeaderAlignment(betaHeader, betaAlignmentSelect.value);
    });

    // 2.9) Change Releases Header Alignment
    releasesAlignmentSelect.addEventListener('change', () => {
        changeHeaderAlignment(releasesHeader, releasesAlignmentSelect.value);
    });

    // 2.10) Reset to Defaults
    resetBtn.addEventListener('click', () => {
        resetToDefaults();
    });

    /****************************************
     * 3) INITIAL FETCH CALLS
     ****************************************/
    fetchDownloadCount();
    fetchWorkflowRuns();
    fetchReleases();

    /****************************************
     * 4) HELPER FUNCTIONS
     ****************************************/

    /**
     * Toggles an element between 'none' and 'block'.
     */
    function toggleDisplay(element) {
        element.style.display =
            (element.style.display === 'none' || !element.style.display) ?
            'block' :
            'none';
    }

    /**
     * Changes the text alignment of a given header element.
     */
    function changeHeaderAlignment(header, alignment) {
        header.style.textAlign = alignment;
    }

    /**
     * Resets all settings to their default values.
     */
    function resetToDefaults() {
        // 1) Reset Section Width (~50%)
        allSections.forEach(section => {
            section.style.width = '48%';
        });
        sectionWidthInput.value = '50%';

        // 2) Reset Main Alignment
        mainElement.style.justifyContent = 'space-between';
        alignmentSelect.value = 'center';

        // 3) Reset Beta & Releases headers alignment
        betaAlignmentSelect.value = 'left';
        betaHeader.style.textAlign = 'left';

        releasesAlignmentSelect.value = 'center';
        releasesHeader.style.textAlign = 'center';

        // 4) Make Beta & Releases sections visible again
        betaSection.style.display = 'block';
        releasesSection.style.display = 'block';

        // 5) (Optional) Hide sub-sections if desired:
        // widthSection.style.display = 'none';
        // alignmentSection.style.display = 'none';
    }

    /************************************************
     * 5) FETCHING + DATA HANDLING
     ************************************************/

    // Fetch total download count from GitHub releases.
    async function fetchDownloadCount() {
        const response = await fetch('https://api.github.com/repos/Class-Widgets/Class-Widgets/releases');
        const data = await response.json();

        const totalDownloads = data.reduce((total, release) => {
            return total + release.assets.reduce((acc, asset) => acc + asset.download_count, 0);
        }, 0);

        document.getElementById('download-count').innerText =
            `GitHub Downloads: ${totalDownloads}`;
    }

    // Add a Beta version to the global verJson array and refresh the Beta table.
    function addBetaVer(sha, time, msg, artifact_id) {
        verJson.push({
            link: `https://github.com/Class-Widgets/Class-Widgets/commit/${sha}`,
            sha,
            time: new Date(time),
            msg,
            download_links: {
                win_x64: `https://nightly.link/Class-Widgets/Class-Widgets/actions/runs/${artifact_id}/windows-latest-x64.zip`,
                win_x86: `https://nightly.link/Class-Widgets/Class-Widgets/actions/runs/${artifact_id}/windows-latest-x86.zip`,
                ubuntu: `https://nightly.link/Class-Widgets/Class-Widgets/actions/runs/${artifact_id}/ubuntu-20.04-x64.zip`
            }
        });
        refreshBeta();
    }

    // Add a Release to the global releaseJson array and refresh the Releases section.
    function addRelease(tag_name, time, changelog_url, download_count) {
        releaseJson.push({
            tag_name,
            time: new Date(time),
            changelog_link: changelog_url,
            download_count
        });
        refreshReleases();
    }

    // Refresh the Beta table (show the latest 30 versions).
    function refreshBeta() {
        $('#loading-badge').empty();
        $('#tbody').empty();

        verJson
            .sort((a, b) => b.time - a.time)
            .slice(0, 30)
            .forEach(({
                link,
                sha,
                time,
                msg,
                download_links
            }) => {
                $('#tbody').append(`
                <tr>
                    <td><a href="${link}" style="color:#FFFFFF">${sha.substring(0, 7)}</a></td>
                    <td>${time.toLocaleString()}</td>
                    <td>
                        <a href="${download_links.win_x64}" style="color:#7289da">Windows-x64 Download</a><br>
                        <a href="${download_links.win_x86}" style="color:#7289da">Windows-x86 Download</a><br>
                        <a href="${download_links.ubuntu}" style="color:#7289da">Ubuntu-20.04-x64 Download</a>
                    </td>
                    <td>${msg}</td>
                </tr>
            `);
            });
    }

    // Refresh the Releases section.
    function refreshReleases() {
        $('#releases-tbody').empty();

        releaseJson
            .sort((a, b) => b.time - a.time)
            .forEach(({
                tag_name,
                time,
                changelog_link,
                download_count
            }) => {
                $('#releases-tbody').append(`
                <div class="release-info">
                    <strong>${tag_name}</strong> (${time.toLocaleDateString()})<br>
                    <a href="${changelog_link}" target="_blank">View Release</a><br>
                    <span>Download Count: ${download_count}</span>
                </div>
            `);
            });
    }

    // Fetch GitHub workflow runs (Beta builds) and add them to the Beta table.
    async function fetchWorkflowRuns() {
        let page = 1;
        let hasMorePages = true;

        while (hasMorePages) {
            const response = await fetch(`https://api.github.com/repos/Class-Widgets/Class-Widgets/actions/runs?per_page=100&page=${page}`);
            const data = await response.json();

            if (data.workflow_runs.length > 0) {
                data.workflow_runs.forEach(run => {
                    const {
                        id,
                        head_commit: {
                            id: sha,
                            timestamp,
                            message
                        }
                    } = run;
                    addBetaVer(sha, timestamp, message, id);
                });
                page++;
            } else {
                hasMorePages = false;
            }
        }
    }

    // Fetch all Releases from GitHub and add them to the releaseJson array.
    async function fetchReleases() {
        const response = await fetch('https://api.github.com/repos/Class-Widgets/Class-Widgets/releases');
        const data = await response.json();

        data.forEach(release => {
            const downloadCount = release.assets.reduce((total, asset) => total + asset.download_count, 0);
            addRelease(release.tag_name, release.published_at, release.html_url, downloadCount);
        });
    }

});