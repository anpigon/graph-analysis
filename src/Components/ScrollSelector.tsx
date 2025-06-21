import * as React from 'react';
import type { Subtype } from '../Interfaces';
import type AnalysisView from '../AnalysisView';

interface ScrollSelectorProps {
  currSubtype: Subtype;
  onSubtypeChange: (subtype: Subtype) => void;
  view: AnalysisView;
}

const SUBTYPE_OPTIONS: Subtype[] = [
  'Co-Citations',
  'HITS',
  'Jaccard',
  'Adamic Adar',
  'Label Propagation',
  'Louvain',
  'Overlap',
  'Clustering Coefficient',
  'BoW',
  'Otsuka-Chiai',
  'Sentiment'
];

const ScrollSelector: React.FC<ScrollSelectorProps> = ({
  currSubtype,
  onSubtypeChange,
  view
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubtype = event.target.value as Subtype;
    onSubtypeChange(selectedSubtype);
  };

  return (
    <div className="scroll-selector">
      <select 
        value={currSubtype} 
        onChange={handleChange}
        className="dropdown"
      >
        {SUBTYPE_OPTIONS.map((subtype) => (
          <option key={subtype} value={subtype}>
            {subtype}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ScrollSelector;
