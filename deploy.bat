# ===== REACT / NEXT.JS GITHUB PAGES LAST-MINUTE FIX =====
cd path_to_your_web_project   # <-- replace with your project folder path

# Step 1: Set homepage for React / Vite projects
# (Skip if Next.js, handled by static export)
# npm pkg set homepage=https://yourusername.github.io/your-repo-name

# Step 2: Install dependencies and build
npm install
# React / Vite
npm run build
# Next.js static export
# npm run export

# Step 3: Install gh-pages if not installed
npm install --save-dev gh-pages

# Step 4: Deploy build / out folder to gh-pages branch
# React / Vite
npx gh-pages -d build
# Next.js
# npx gh-pages -d out

echo "🎯 Deployment complete! Visit: https://rahulktiwari3009-creator
