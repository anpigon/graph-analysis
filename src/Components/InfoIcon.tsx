import React from 'react';
import type { SubtypeInfo } from '../Interfaces';
import { FaQuestionCircle } from 'react-icons/fa';

interface InfoIconProps {
  currSubtypeInfo: SubtypeInfo;
}

const InfoIcon: React.FC<InfoIconProps> = ({ currSubtypeInfo }) => {
  const { anl, desc } = currSubtypeInfo;
  
  return (
    <div 
      className="info-icon" 
      aria-label={`Type: ${anl}\n\n${desc}`}
      title={`Type: ${anl}\n\n${desc}`}
    >
      {React.createElement(FaQuestionCircle as React.FC)}
    </div>
  );
};

export default InfoIcon;
