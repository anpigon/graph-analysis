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
  const [checked, setChecked] = React.useState<Subtype[]>(
    plugin.settings[settingName]
  );

  const handleChange = (option: Subtype) => {
    const newChecked = checked.includes(option)
      ? checked.filter((item) => item !== option)
      : [...checked, option];
    
    setChecked(newChecked);
    plugin.settings[settingName] = newChecked;
    plugin.saveSettings();
  };

  return (
    <div className="GA-checkboxes">
      {options.map((option) => (
        <div key={option} className="GA-checkbox-container">
          <input
            type="checkbox"
            id={option}
            checked={checked.includes(option)}
            onChange={() => handleChange(option)}
          />
          <label htmlFor={option}>{option}</label>
        </div>
      ))}
    </div>
  );
};

export default Checkboxes;
