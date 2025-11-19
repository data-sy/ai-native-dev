# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this project.

## Project Overview

**s01-p03** - Section 01, Practice 03: Next.js 웹 애플리케이션 프로젝트

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS

## Design System & Code Style

### Button Component Rule

우리 프로젝트의 모든 주요 CTA(Call-to-Action) 버튼은 **반드시** 아래의 Tailwind CSS 클래스를 사용하여 시각적 일관성을 유지한다.

**Required Classes:**
```
bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md
```

### Component Definition

모든 React 컴포넌트는 화살표 함수(`=>`)로 정의한다.

**올바른 예시:**
```tsx
const Header = () => {
  return <header>...</header>;
};

export default Header;
```

**잘못된 예시:**
```tsx
export default function Header() {
  return <header>...</header>;
}
```

## Working Guidelines

작업 시 다음을 확인하세요:
1. 현재 프로젝트 폴더의 `README.md` 확인
2. 위의 Design System & Code Style 규칙 준수
3. TypeScript와 Tailwind CSS 베스트 프랙티스 적용
