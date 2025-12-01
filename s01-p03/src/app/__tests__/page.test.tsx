import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('컴포넌트가 에러 없이 렌더링된다', () => {
    render(<Home />);

    // 컴포넌트가 정상적으로 렌더링되었는지 확인
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('Next.js 로고가 렌더링된다', () => {
    render(<Home />);

    const logo = screen.getByAltText('Next.js logo');
    expect(logo).toBeInTheDocument();
  });

  it('주요 제목 텍스트가 표시된다', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /To get started, edit the page\.tsx file/i
    });
    expect(heading).toBeInTheDocument();
  });

  it('Templates 링크가 올바른 URL로 렌더링된다', () => {
    render(<Home />);

    const templatesLink = screen.getByRole('link', { name: /Templates/i });
    expect(templatesLink).toBeInTheDocument();
    expect(templatesLink).toHaveAttribute('href', expect.stringContaining('vercel.com/templates'));
  });

  it('Learning 링크가 올바른 URL로 렌더링된다', () => {
    render(<Home />);

    const learningLink = screen.getByRole('link', { name: /Learning/i });
    expect(learningLink).toBeInTheDocument();
    expect(learningLink).toHaveAttribute('href', expect.stringContaining('nextjs.org/learn'));
  });

  it('Deploy now 버튼이 렌더링된다', () => {
    render(<Home />);

    const deployLink = screen.getByRole('link', { name: /Deploy now/i });
    expect(deployLink).toBeInTheDocument();
  });

  it('Documentation 링크가 렌더링된다', () => {
    render(<Home />);

    const docsLink = screen.getByRole('link', { name: /Documentation/i });
    expect(docsLink).toBeInTheDocument();
  });
});
