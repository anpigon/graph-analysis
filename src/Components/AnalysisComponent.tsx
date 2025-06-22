import * as React from 'react';
import { useState } from 'react';
import type { AnalysisComponentProps, Subtype } from '../Interfaces';
import CoCitations from './CoCitations';
import HITS from './HITS';
import LabelPropagation from './LabelPropagation';
import Louvain from './Louvain';
import TableComponent from './TableComponent';
import ScrollSelector from './ScrollSelector';

const AnalysisComponent: React.FC<AnalysisComponentProps> = (props) => {
  const [currentSubtype, setCurrentSubtype] = useState<Subtype>(props.currSubtype);

  const handleSubtypeChange = (subtype: Subtype) => {
    setCurrentSubtype(subtype);
  };

  const renderAnalysisComponent = () => {
    switch (currentSubtype) {
      case 'Co-Citations':
        return <CoCitations {...props} currSubtype={currentSubtype} />;
      case 'HITS':
        return <HITS {...props} currSubtype={currentSubtype} />;
      case 'Label Propagation':
        return <LabelPropagation {...props} currSubtype={currentSubtype} />;
      case 'Louvain':
        return <Louvain {...props} currSubtype={currentSubtype} />;
      case 'Jaccard':
      case 'Overlap':
      case 'Adamic Adar':
      case 'Clustering Coefficient':
      case 'BoW':
      case 'Otsuka-Chiai':
      case 'Sentiment':
        return <TableComponent {...props} currSubtype={currentSubtype} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <ScrollSelector 
        currSubtype={currentSubtype}
        onSubtypeChange={handleSubtypeChange}
        view={props.view}
      />
      {renderAnalysisComponent()}
    </div>
  );
};

export default AnalysisComponent;
