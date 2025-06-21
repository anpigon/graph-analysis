/** @type {import('tailwindcss').Config} */
module.exports = {
  // Graph Analysis 플러그인 전용 prefix 설정
  prefix: 'ga-',
  
  content: [
    "./src/**/*.{ts,tsx}",
    "./src/**/*.js",
  ],
  
  theme: {
    extend: {
      // Obsidian 테마 변수와 연동
      colors: {
        'obsidian-primary': 'var(--color-primary)',
        'obsidian-secondary': 'var(--color-secondary)',
        'text-normal': 'var(--text-normal)',
        'text-muted': 'var(--text-muted)',
        'text-accent': 'var(--text-accent)',
        'text-accent-hover': 'var(--text-accent-hover)',
        'background-primary': 'var(--background-primary)',
        'background-secondary': 'var(--background-secondary)',
        'interactive-normal': 'var(--interactive-normal)',
        'interactive-hover': 'var(--interactive-hover)',
        'interactive-accent': 'var(--interactive-accent)',
        'border-color': 'var(--background-modifier-border)',
        'scrollbar-bg': 'var(--scrollbar-bg)',
        'scrollbar-thumb': 'var(--scrollbar-thumb-bg)',
        'highlight-bg': 'var(--text-highlight-bg)',
      },
      
      // 플러그인에 특화된 스타일
      spacing: {
        'ga-xs': '0.2em',
        'ga-sm': '0.4em',
      },
      
      animation: {
        'highlight-sentence': 'highlightSentence 1.5s 1',
      },
      
      keyframes: {
        highlightSentence: {
          '0%': { backgroundColor: 'transparent' },
          '10%': { backgroundColor: 'var(--text-highlight-bg)' },
          '80%': { backgroundColor: 'var(--text-highlight-bg)' },
          '100%': { backgroundColor: 'transparent' },
        }
      }
    },
  },
  
  plugins: [],
  
  // 다크 모드 지원
  darkMode: 'class',
  
  // 중요도 설정 (다른 플러그인과의 충돌 방지)
  important: '.graph-analysis-plugin',
}
