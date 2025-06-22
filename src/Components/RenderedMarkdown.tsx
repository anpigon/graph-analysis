import * as React from 'react';
import { MarkdownRenderer, type App, Component } from 'obsidian';
import { jumpToSelection, openOrSwitch } from '../Utility';

interface RenderedMarkdownProps {
  sentence: string[];
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

  // Svelte 버전과 동일한 문장 조합 로직
  let renderedSentence = sentence[0] + '==' + sentence[1] + '==' + sentence[2];
  if (sentence.length === 5) {
    renderedSentence = renderedSentence + '==' + sentence[3] + '==' + sentence[4];
  }
  renderedSentence = renderedSentence.trim();

  const handleClick = async (e: React.MouseEvent) => {
    await openOrSwitch(app, sourcePath, e.nativeEvent);
    jumpToSelection(app, line, sentence.join(''));
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.innerHTML = '';
      MarkdownRenderer.render(
        app,
        renderedSentence,
        container,
        sourcePath,
        new Component()
      );

      // Svelte 버전과 동일한 DOM 조작
      container.querySelectorAll('mark').forEach(el => {
        el.classList.add('CC-mark');
      });
      container.querySelectorAll('ol').forEach(el => {
        el.classList.add('CC-edit');
      });
      container.querySelectorAll('hr').forEach(el => {
        el.classList.add('CC-hr');
      });
    }
  }, [renderedSentence, sourcePath, app, line]);

  return (
    <div
      ref={containerRef}
      className="CC-sentence"
      onClick={handleClick}
    />
  );
};

export default RenderedMarkdown;
