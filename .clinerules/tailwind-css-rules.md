# Tailwind CSS 코딩 규칙

## 1. 기본 원칙
- UI 스타일은 TailwindCSS를 우선적으로 사용합니다.
- 가능한 한 유틸리티 클래스를 활용하여 스타일을 작성합니다.

## 2. Prefix 규칙
- 모든 Tailwind 클래스는 `ga-` prefix를 사용합니다.
  ```html
  <!-- 예시 -->
  <div class="ga-bg-blue-500 ga-p-4"></div>
  ```

## 3. CSS 작성 위치
- 추가적인 CSS는 `src/tailwind-entry.css` 파일에 작성합니다.
- Tailwind로 처리하기 어려운 복잡한 스타일만 직접 작성합니다.

## 4. 컴포넌트 스타일 작성 가이드
1. **Tailwind 레이어 사용**:
   ```css
   @layer components {
     .ga-custom-component {
       @apply ga-bg-white ga-p-4;
     }
   }
   ```

2. **커스텀 스타일**:
   - 반드시 `ga-` prefix를 포함한 클래스명 사용
   - 변수는 Obsidian 테마 변수를 활용
   ```css
   .ga-custom-card {
     background-color: var(--background-primary);
     border: 1px solid var(--background-modifier-border);
   }
   ```

3. **반응형 디자인**:
   ```html
   <div class="ga-block md:ga-flex"></div>
   ```

## 5. 주의사항
- !important 사용을 최소화합니다.
- 기존 스타일을 덮어쓰지 않도록 주의합니다.
- 모바일 대응을 고려하여 반응형 클래스를 활용합니다.
