import * as React from 'react';
import type GraphAnalysisPlugin from '../main';
import type { Subtype } from '../Interfaces';

interface CheckboxesProps {
  options: Subtype[];
  plugin: GraphAnalysisPlugin;
  settingName: 'algsToShow';
}

const Checkboxes: React.FC<CheckboxesProps> = ({
  options,
  plugin,
  settingName,
}) => {
  const [selected, setSelected] = React.useState<Subtype[]>(
    plugin.settings[settingName]
  );
  const [hasSelection, setHasSelection] = React.useState(selected.length > 0);

  React.useEffect(() => {
    setHasSelection(selected.length > 0);
    // 선택 상태 변경 시 설정 자동 저장
    plugin.settings[settingName] = selected;
    plugin.saveSettings();
  }, [selected]);

  const handleChange = (option: Subtype) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    setSelected(newSelected);
  };

  const handleToggleAll = () => {
    const newSelected = hasSelection ? [] : options; // hasSelection이 true면 전체 해제
    setSelected(newSelected);
  };

  return (
    <div className='space-y-2'>
      <button onClick={handleToggleAll}>
        Select {hasSelection ? 'None' : 'All'}
      </button>
      <div className="GA-grid">
        {options.map((option) => (
          <div key={option}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => handleChange(option)}
              />
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Checkboxes;
