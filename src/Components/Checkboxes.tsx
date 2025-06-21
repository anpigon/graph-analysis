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
  const [toNone, setToNone] = React.useState(selected.length === 0);

  React.useEffect(() => {
    setToNone(selected.length === 0);
  }, [selected]);

  const handleChange = (option: Subtype) => {
    const newSelected = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    
    setSelected(newSelected);
    plugin.settings[settingName] = newSelected;
    plugin.saveSettings();
  };

  const handleToggleAll = () => {
    const newSelected = toNone ? [] : options;
    setSelected(newSelected);
    plugin.settings[settingName] = newSelected;
    plugin.saveSettings();
  };

  return (
    <div>
      <button onClick={handleToggleAll}>
        Select {toNone ? 'None' : 'All'}
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
