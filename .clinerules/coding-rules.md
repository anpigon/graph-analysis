# Obsidian 플러그인 개발 코딩 규칙 (2025.06.22 업데이트)

## 1. 기본 구조
- 모든 플러그인은 `Plugin` 클래스를 상속해야 함
- 비동기 초기화는 `async onload()` 사용
- 리소스 정리는 `onunload()`에서 수행

```typescript
export default class ExamplePlugin extends Plugin {
  async onload() {
    // 플러그인 초기화
  }
  async onunload() {
    // 리소스 정리
  }
}
```

## 2. TypeScript 사용
- 엄격한 타입 체크 활성화 (`strict: true`)
- 인터페이스를 사용한 설정 관리
- 커스텀 타입 정의 활용

```typescript
interface PluginSettings {
  dateFormat: string;
  enableFeature: boolean;
}
```

## 3. UI 컴포넌트
- React 또는 Svelte 컴포넌트 사용 권장
- 안전한 DOM 조작 방법 적용
- 반응형 디자인 고려

```typescript
// 안전한 요소 생성
this.containerEl.createEl('div', { text: 'Safe content' });

// 위험한 방법 (X)
element.innerHTML = userContent;
```

## 4. 비동기 처리
- `async/await` 패턴 사용
- 에러 처리 필수
- Promise 체이닝보다 async/await 선호

```typescript
async loadData() {
  try {
    const data = await this.app.vault.read(file);
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load data', error);
    return null;
  }
}
```

## 5. 설정 관리
- `loadSettings()`와 `saveSettings()` 메서드 구현
- 기본값과 사용자 설정 병합
- 설정 변경 시 즉시 저장

```typescript
async loadSettings() {
  this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
}

async saveSettings() {
  await this.saveData(this.settings);
}
```

## 6. 성능 최적화
- 대용량 데이터 처리 시 웹 워커 사용
- 불필요한 그래프 재생성 피하기
- 이벤트 리스너 적절히 등록/해제

```typescript
// 이벤트 등록 예시
this.registerEvent(this.app.vault.on('modify', this.handleFileModify));
```

## 7. 보안 가이드라인
- 사용자 입력 검증 필수
- innerHTML 사용 금지
- 외부 리소스 요청 시 HTTPS 사용

## 8. 테스트 및 디버깅
- 개발 모드에서 콘솔 로깅 활용
- `try/catch`로 에러 처리
- 사용자 피드백을 위한 Notice 사용

```typescript
new Notice('작업이 완료되었습니다');
```

## 9. 문서화
- 주요 기능에 대한 주석 작성
- 공식 Obsidian 개발자 문서 참조
- 커스텀 컴포넌트 문서화

## 10. 배포 준비
- GitHub Actions를 통한 자동 배포
- 버전 태그 명시적 관리
- manifest.json 필수 필드 확인

```json
{
  "id": "your-plugin-id",
  "name": "Your Plugin Name",
  "version": "1.0.0",
  "minAppVersion": "1.2.0"
}
```

*본 문서는 context7의 get-library-docs 도구를 통해 Obsidian 개발자 문서(/obsidianmd/obsidian-developer-docs)의 최신 정보를 반영하였습니다.
