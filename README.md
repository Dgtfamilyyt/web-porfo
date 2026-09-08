# Modern Personal Portfolio Website

A clean, modern, and production-ready developer portfolio website built specifically for student developers, freelance software engineers, and aspiring technologists. Designed with modern minimalist aesthetics, comfortable whitespace, high accessibility, and full responsiveness across all screen sizes.

---

## 🌟 Key Features

- **Semantic HTML5 & Pure CSS3**: Zero heavy dependencies, zero frameworks, lightweight footprint, and lightning-fast page loads.
- **Modern Responsive Design**: Fluid layouts powered by CSS Grid, Flexbox, and `clamp()` typography across mobile (320px+), tablet, laptop, and ultra-wide screens.
- **Theme Toggle (Dark & Light Mode)**: Seamless theme switching with automatic system preference detection (`prefers-color-scheme`) and persistent `localStorage` support.
- **Sticky Navigation Bar**: Glassmorphism blur effect with an accessible mobile hamburger drawer, active section scroll indicators, and auto-closing drawer on item selection.
- **Interactive Project Filtering**: Filter featured projects dynamically by category (All, Python & Data, Frontend, Tools).
- **Interactive Contact Form with Validation**: Client-side validation with real-time error feedback, accessible ARIA attributes, direct `mailto:` fallback, and clear Formspree integration support.
- **Accessibility & Motion First**: Proper heading hierarchies, color contrast meeting WCAG AA standards, focus-visible indicators, and `prefers-reduced-motion` compliance.
- **SEO & Social Share Ready**: Standardized Open Graph and Twitter Card metadata included.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3**: CSS Custom Properties (variables), CSS Grid, Flexbox, transitions, media queries.
- **Vanilla JavaScript (ES6+)**: DOM manipulation, IntersectionObserver, event delegation, client-side validation.
- **SVG Graphics**: Scalable vector icons and project previews located in `assets/`.

---

## 📁 Project Structure

```text
/
├── index.html                  # Main semantic HTML structure & metadata
├── style.css                   # Complete design system, themes, and responsive CSS
├── script.js                   # Navigation, theme toggle, filters, form validation
├── README.md                   # Documentation and customization guide
└── assets/
    ├── icons/
    │   ├── favicon.svg         # Browser favicon
    │   ├── github.svg          # GitHub social icon
    │   ├── linkedin.svg        # LinkedIn social icon
    │   ├── mail.svg            # Mail icon
    │   ├── code.svg            # Terminal code icon
    │   ├── sun.svg             # Light mode sun icon
    │   ├── moon.svg            # Dark mode moon icon
    │   ├── external-link.svg   # Outbound link icon
    │   └── arrow-up.svg        # Back-to-top arrow icon
    └── images/
        ├── avatar-placeholder.svg  # Default developer avatar illustration
        ├── project-1.svg       # Preview thumbnail for Project 1
        ├── project-2.svg       # Preview thumbnail for Project 2
        ├── project-3.svg       # Preview thumbnail for Project 3
        └── project-4.svg       # Preview thumbnail for Project 4
```

---

## 🚀 How to Run Locally

You do not need Node.js, npm, or any build tool to run or test this website.

### Method 1: Double Click
Simply double-click `index.html` in your file explorer to open it in any web browser.

### Method 2: VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension.
3. Right-click `index.html` and click **"Open with Live Server"**.

### Method 3: Python Built-in Server
If you have Python installed, open your terminal in the project directory and run:
```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## ✏️ How to Customize Personal Information

All personal details use distinct bracketed placeholders `[LIKE THIS]` in `index.html`. You can easily search and replace them in your code editor:

| Placeholder | Description | Where to Update |
|---|---|---|
| `[NAME]` | Your full name or handle | `<title>`, navbar, hero heading, footer, metadata |
| `[ROLE / TITLE]` | Your headline | Hero section subtitle |
| `[EMAIL-ADDRESS]` | Your contact email | Hero socials, Contact section, form `mailto:` link, footer |
| `[GITHUB-USERNAME]` | Your GitHub handle | Social links in hero, contact cards, and footer |
| `[LINKEDIN-USERNAME]`| Your LinkedIn profile | Social links in hero, contact cards, and footer |
| `[COLLEGE / UNIVERSITY NAME]` | Your institution name | Education section |
| `[START YEAR]` / `[EXPECTED GRADUATION]` | Your degree timeframe | Education timeline card |
| `[PROJECT NAME: ...]` | Your project titles | Featured Projects cards in `index.html` |
| `[PROJECT-X-REPO]` | Links to your GitHub repos | Featured Projects action buttons |
| `[DEMO-URL-X]` | Links to live demo deployments | Featured Projects "Live Demo" buttons |

---

## 🖼️ How to Replace Project Images & Avatar

1. Place your actual project screenshots or photographs into `assets/images/` (e.g. `assets/images/my-project-1.png`).
2. Open `index.html`.
3. Locate the corresponding `<img src="./assets/images/..." />` tag:
   - For your profile picture: update `<img src="./assets/images/avatar-placeholder.svg" ... />`
   - For project cards: update `<img src="./assets/images/project-1.svg" ... />`
4. Update the `alt` attribute description to describe your image for accessibility.

---

## 📬 Connecting the Contact Form to Formspree

Currently, submitting the form validates the inputs and provides an instant 1-click `mailto:` action. To have messages sent straight to your email inbox via [Formspree](https://formspree.io):

1. Register for a free account at [Formspree](https://formspree.io) and create a new form endpoint.
2. Copy your Formspree endpoint URL (e.g., `https://formspree.io/f/xvobpqzy`).
3. Open `index.html` and update `<form id="contact-form" ...>`:
   ```html
   <form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form">
   ```
4. In `script.js`, under the form submit handler, Formspree handles the POST request seamlessly via `fetch()` or standard submission.

---

## 🌐 Deployment Instructions

This website is completely static, making it 100% free and easy to host on modern hosting platforms.

### 1. Deploying to GitHub Pages
1. Push your repository to GitHub.
2. Navigate to your repository's **Settings** tab.
3. Click **Pages** in the left sidebar.
4. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
5. Click **Save**. Your site will be live at `https://<username>.github.io/<repo-name>/` in 1–2 minutes!

### 2. Deploying to Netlify
1. Log in to [Netlify](https://www.netlify.com).
2. Click **Add new site** > **Deploy manually**.
3. Drag and drop the portfolio folder directly into the browser upload box.
4. Your site is deployed instantly with a free SSL certificate.

### 3. Deploying to Vercel
1. Install Vercel CLI via `npm i -g vercel` or link your GitHub repository on [Vercel.com](https://vercel.com).
2. Run `vercel` in your project root, or click **Import Project** on the Vercel dashboard.
3. Framework Preset: select **Other** (Static HTML).
4. Click **Deploy**.

---

## 📄 License

This portfolio template is open-source and free to use for personal portfolios, internship applications, and freelance showcases.
