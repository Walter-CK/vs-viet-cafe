(function () {
    const menu = window.VS_VIET_MENU;
    const root = document.documentElement;
    const page = document.body.dataset.page;
    const savedLanguage = localStorage.getItem("vsVietLanguage");
    let language = savedLanguage === "vi" ? "vi" : "en";

    function asset(path) {
        const depth = document.body.dataset.depth || "";
        return `${depth}${path}`;
    }

    function t(key) {
        return menu.translations[language][key] || menu.translations.en[key] || key;
    }

    function setLanguage(nextLanguage) {
        language = nextLanguage === "vi" ? "vi" : "en";
        localStorage.setItem("vsVietLanguage", language);
        root.lang = language;
        document.querySelectorAll("[data-lang-current]").forEach((node) => {
            node.textContent = language.toUpperCase();
        });
        document.querySelectorAll("[data-i18n]").forEach((node) => {
            node.textContent = t(node.dataset.i18n);
        });
        document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
            node.setAttribute("aria-label", t(node.dataset.i18nAria));
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
            node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
        });
        renderDynamic();
    }

    function renderDynamic() {
        if (page === "home") {
            renderCategoryCards();
        }
        if (page === "category") {
            renderCategoryPage();
        }
    }

    function renderCategoryCards() {
        const grid = document.getElementById("categoryGrid");
        if (!grid) return;
        grid.innerHTML = menu.categories.map((category) => `
            <a class="category-card" href="${category.slug}/" style="--card-image: url('${category.image}')">
                <span class="category-card-shade"></span>
                <span class="category-card-content">
                    <span class="category-card-icon"><i class="fa-solid ${category.icon}"></i></span>
                    <span class="category-card-title">${category.name[language]}</span>
                    <span class="category-card-copy">${category.intro[language]}</span>
                    <span class="category-card-meta">${category.items.length} ${t("menu.items")} <i class="fa-solid fa-arrow-right"></i></span>
                </span>
            </a>
        `).join("");
    }

    function renderCategoryPage() {
        const slug = document.body.dataset.category;
        const category = menu.categories.find((item) => item.slug === slug);
        if (!category) return;

        document.title = `${category.name.en} | V's Viet Cafe`;
        const hero = document.querySelector(".category-hero");
        if (hero) hero.style.setProperty("--hero-image", `url('../${category.image}')`);

        const title = document.getElementById("categoryTitle");
        const intro = document.getElementById("categoryIntro");
        const count = document.getElementById("categoryCount");
        const list = document.getElementById("categoryItems");
        const order = document.getElementById("categoryOrder");

        if (title) title.textContent = category.name[language];
        if (intro) intro.textContent = category.intro[language];
        if (count) count.textContent = `${category.items.length} ${t("category.count")}`;
        if (order) order.href = `../order/?category=${encodeURIComponent(category.name.en)}`;
        if (list) {
            list.innerHTML = category.items.map((item) => {
                const name = language === "vi" && item[2] ? item[2] : item[0];
                const price = item[1];
                return `
                <article class="listing-item">
                    <div>
                        <h3>${name}</h3>
                    </div>
                    <strong>${price}</strong>
                </article>
            `;
            }).join("");
        }
    }

    function initLightbox() {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        if (!lightbox || !lightboxImg) return;

        document.querySelectorAll(".update-card-img img, .about-photo img").forEach((img) => {
            img.addEventListener("click", () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add("open");
            });
        });
        lightbox.addEventListener("click", () => lightbox.classList.remove("open"));
    }

    function initUpdatesScroll() {
        const updatesScroll = document.getElementById("updatesScroll");
        if (!updatesScroll) return;
        updatesScroll.addEventListener("wheel", function (event) {
            const primaryDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
            event.preventDefault();
            this.scrollBy({ left: primaryDelta, behavior: "auto" });
        }, { passive: false });
    }

    function initOrderForm() {
        const form = document.getElementById("orderForm");
        if (!form) return;
        const params = new URLSearchParams(window.location.search);
        const category = params.get("category");
        const itemInput = document.getElementById("orderItem");
        if (category && itemInput && !itemInput.value) {
            itemInput.value = `${category}: `;
            itemInput.focus();
        }
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const message = document.getElementById("orderMessage");
            if (message) {
                message.textContent = t("order.message");
                message.hidden = false;
            }
        });
    }

    document.querySelectorAll("[data-lang-toggle]").forEach((button) => {
        button.addEventListener("click", () => setLanguage(language === "en" ? "vi" : "en"));
    });

    setLanguage(language);
    initLightbox();
    initUpdatesScroll();
    initOrderForm();
})();
