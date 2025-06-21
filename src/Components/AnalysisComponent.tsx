import * as React from 'react';
import { useState } from 'react';
import type { App } from 'obsidian';
import type AnalysisView from '../AnalysisView';
import type { GraphAnalysisSettings, Subtype } from '../Interfaces';
import type GraphAnalysisPlugin from '../main';
import CoCitations from './CoCitations';
import HITS from './HITS';
import LabelPropagation from './LabelPropagation';
import Louvain from './Louvain';
import TableComponent from './TableComponent';
import ScrollSelector from './ScrollSelector';

interface AnalysisComponentProps {
  app: App;
  plugin: GraphAnalysisPlugin;
  settings: GraphAnalysisSettings;
  view: AnalysisView;
  currSubtype: Subtype;
}

const AnalysisComponent: React.FC<AnalysisComponentProps> = (props) => {
  const [currentSubtype, setCurrentSubtype] = useState<Subtype>(props.currSubtype);

  const handleSubtypeChange = (subtype: Subtype) => {
    setCurrentSubtype(subtype);
  };

  const updatedProps = {
    ...props,
    currSubtype: currentSubtype
  };

  const renderAnalysisComponent = () => {
    switch (currentSubtype) {
      case 'Co-Citations':
        return <CoCitations {...updatedProps} />;
      case 'HITS':
        return <HITS {...updatedProps} />;
      case 'Label Propagation':
        return <LabelPropagation {...updatedProps} />;
      case 'Louvain':
        return <Louvain {...updatedProps} />;
      case 'Jaccard':
      case 'Overlap':
      case 'Adamic Adar':
      case 'Clustering Coefficient':
      case 'BoW':
      case 'Otsuka-Chiai':
      case 'Sentiment':
        return <TableComponent {...updatedProps} />;
      default:
        return <div>Unsupported analysis type: {currentSubtype}</div>;
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
