# React + TypeScript + Vite

Template ini menyediakan pengaturan minimal untuk menjalankan React di Vite dengan HMR (Hot Module Replacement) serta beberapa aturan dasar ESLint.

Saat ini, terdapat dua plugin resmi yang tersedia:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md), yang menggunakan [Babel](https://babeljs.io/) untuk Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc), yang menggunakan [SWC](https://swc.rs/) untuk Fast Refresh.

## Memperluas Konfigurasi ESLint

Jika Anda sedang mengembangkan aplikasi untuk produksi, disarankan untuk memperbarui konfigurasi agar mendukung aturan linting yang lebih cerdas dengan TypeScript:

- Konfigurasikan properti `parserOptions` di tingkat atas seperti berikut:

```js
export default tseslint.config({
  languageOptions: {
    // opsi lainnya...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Ganti `tseslint.configs.recommended` dengan `tseslint.configs.recommendedTypeChecked` atau `tseslint.configs.strictTypeChecked`.
- Opsional: tambahkan `...tseslint.configs.stylisticTypeChecked`.
- Instal [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) dan perbarui konfigurasi ESLint:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Atur versi React yang digunakan
  settings: { react: { version: '18.3' } },
  plugins: {
    // Tambahkan plugin React
    react,
  },
  rules: {
    // aturan lainnya...
    // Aktifkan aturan yang direkomendasikan oleh plugin React
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
