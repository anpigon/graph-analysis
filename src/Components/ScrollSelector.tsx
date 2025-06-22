import * as React from 'react';
import type { Subtype } from '../Interfaces';
import type AnalysisView from '../AnalysisView';
import { ANALYSIS_TYPES } from '../Constants';
import { FaGlobeAfrica } from 'react-icons/fa';
import { IoIosChatbubbles } from 'react-icons/io';

interface ScrollSelectorProps {
  currSubtype: Subtype;
  onSubtypeChange: (subtype: Subtype) => void;
  view: AnalysisView;
}

const ScrollSelector: React.FC<ScrollSelectorProps> = ({
  currSubtype,
  onSubtypeChange,
  view
}) => {
  if (view.plugin.settings.algsToShow.length <= 1) {
    return null;
  }

  return (
    <div 
      className="scrollContainer"
      aria-label="Shift + Scroll to scroll sideways"
    >
      <div className="container">
        {ANALYSIS_TYPES.map((sub) => {
          if (!view.plugin.settings.algsToShow.includes(sub.subtype)) {
            return null;
          }

          return (
            <button
              key={sub.subtype}
              className={`item GA-Button ${
                currSubtype === sub.subtype ? 'currSubtype' : ''
              }`}
              onClick={() => {
                onSubtypeChange(sub.subtype);
              }}
            >
              {sub.global && (
                <span className="icon">
                  <FaGlobeAfrica />
                </span>
              )}
              {sub.nlp && (
                <span className="icon">
                  <IoIosChatbubbles />
                </span>
              )}
              {sub.subtype}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollSelector;
