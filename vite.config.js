import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // HashRouter + relative base so the built app works when deployed
  // statically (GitHub Pages) and refreshing any page keeps working.
  base: './',
  plugins: [react()],
})
