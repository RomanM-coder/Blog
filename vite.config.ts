import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // ← здесь указана папка с переводами
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 🔥 Основные библиотеки React
          vendor: ['react', 'react-dom', 'react-router-dom'],

          // 🎨 Анимации
          animations: ['framer-motion', 'flubber'],

          // 🔌 Сокеты (если не на всех страницах)
          socket: ['socket.io-client'],

          // 📅 Работа с датами
          dates: ['luxon', 'dayjs'],

          // ✅ Формы и валидация
          forms: [
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
            'zod-i18n-map',
          ],

          // 🌐 i18n
          i18n: [
            'i18next',
            'react-i18next',
            'i18next-browser-languagedetector',
            'i18next-http-backend',
          ],

          // 🔐 Авторизация
          auth: ['jsonwebtoken', 'react-google-recaptcha'],

          // 🎨 UI библиотеки
          ui: ['@emotion/react', '@emotion/styled'],
          fonts: [],
          // Общие страницы
          common: [
            './src/pages/AboutPage.tsx',
            //'./src/pages/AuthPage/AuthPage.tsx',
            './src/pages/ScreenSaver/ScreenSaver.tsx',
            './src/pages/RulesPage.tsx',
            './src/pages/AuthPage/InvalidLinkPage/InvalidLinkPage.tsx',
          ],

          // Только для пользователей
          user: [
            './src/pages/CategoryListPage/CategoryListPage.tsx',
            './src/pages/PostPublished/PostPublication.tsx',
            './src/pages/ProfilePage/ProfilePage.tsx',
          ],

          // Только для админов
          admin: [
            './src/pages/Admin/AdminCategory/AdminCategory.tsx',
            './src/pages/Admin/AdminPost/AdminPost.tsx',
            './src/pages/Admin/AdminSinglePost/AdminSinglePost.tsx',
            './src/pages/Admin/AdminUser/AdminUser.tsx',
            './src/pages/Admin/AdminUser/AdminProfileUser.tsx',
            './src/pages/Admin/AdminLog/AdminLog.tsx',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Увеличиваем лимит предупреждений
  },
})
