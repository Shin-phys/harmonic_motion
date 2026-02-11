import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages用: リポジトリ名に合わせてbaseを設定
// リポジトリ名が異なる場合は '/リポジトリ名/' に変更してください
export default defineConfig({
  plugins: [react()],
  base: '/shm-simulator/',
})
