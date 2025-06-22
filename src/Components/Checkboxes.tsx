import * as React from 'react';
import type GraphAnalysisPlugin from '../main';
import type { Subtype } from '../Interfaces';

interface CheckboxesProps {
  options: Subtype[];
  plugin: GraphAnalysisPlugin;
  settingName: 'algsToShow';
}

const Checkboxes: React.FC<CheckboxesProps> = React.memo(({
  options,
  plugin,
  settingName,
}) => {
  const [selected, setSelected] = React.useState<Subtype[]>(
    plugin.settings[settingName]
  );
  
  // 상태 변수 대신 계산값 사용
  const hasSelection = selected.length > 0;

  // 설정 저장 로직 최적화
  React.useEffect(() => {
    plugin.settings[settingName] = selected;
    plugin.saveSettings();
  }, [selected, plugin, settingName]);

  // 메모이제이션된 핸들러
  const handleChange = React.useCallback((option: Subtype) => {
    setSelected(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option) 
        : [...prev, option]
    );
  }, []);

  const handleToggleAll = React.useCallback(() => {
    setSelected(hasSelection ? [] : options);
  }, [hasSelection, options]);

  return (
    <div className="ga-space-y-2 ga-mb-2">
      <button 
        onClick={handleToggleAll}
        className="ga-mb-2 ga-px-3 ga-py-1 ga-bg-blue-500 ga-text-white ga-rounded"
      >
        Select {hasSelection ? 'None' : 'All'}
      </button>
      
      {/* Tailwind 스타일 적용 */}
      <div className="ga-grid ga-grid-cols-3 ga-gap-2">
        {options.map((option) => (
          <div key={option} className="ga-flex ga-items-center">
            <input
              type="checkbox"
              className="ga-mr-2"
              checked={selected.includes(option)}
              onChange={() => handleChange(option)}
            />
            <span>{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Checkboxes;
