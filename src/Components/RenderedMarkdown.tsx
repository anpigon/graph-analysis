import * as React from 'react';
import { MarkdownRenderer, type App, Component } from 'obsidian';

interface RenderedMarkdownProps {
  sentence: string;
  sourcePath: string;
  app: App;
  line: number;
}

const RenderedMarkdown: React.FC<RenderedMarkdownProps> = ({
  sentence,
  sourcePath,
  app,
  line,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      MarkdownRenderer.render(
        app,
        sentence,
        containerRef.current,
        sourcePath,
        new Component()
      );
    }
  }, [sentence, sourcePath, app, line]);

  return <div ref={containerRef} />;
};

export default RenderedMarkdown;
