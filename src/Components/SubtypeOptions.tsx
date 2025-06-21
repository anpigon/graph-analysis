import * as React from 'react';
import type { App } from 'obsidian';
import type AnalysisView from '../AnalysisView';
import type { GraphAnalysisSettings, Subtype, SubtypeInfo } from '../Interfaces';
import type GraphAnalysisPlugin from '../main';
import InfoIcon from './InfoIcon';

interface SubtypeOptionsProps {
  currSubtypeInfo: SubtypeInfo | undefined;
  ascOrder: boolean;
  setAscOrder: React.Dispatch<React.SetStateAction<boolean>>;
  frozen?: boolean;
  setFrozen?: React.Dispatch<React.SetStateAction<boolean>>;
  sortBy?: boolean;
  setSortBy?: React.Dispatch<React.SetStateAction<boolean>>;
  currFile: string;
  app: App;
  plugin: GraphAnalysisPlugin;
  view: AnalysisView;
  blockSwitch?: boolean;
  setBlockSwitch?: React.Dispatch<React.SetStateAction<boolean>>;
  newBatch?: any[];
  setNewBatch?: React.Dispatch<React.SetStateAction<any[]>>;
  visibleData?: any[];
  setVisibleData?: React.Dispatch<React.SetStateAction<any[]>>;
  sortedResults?: any[] | null;
  setSortedResults?: React.Dispatch<React.SetStateAction<any[] | null>>;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
}

const SubtypeOptions: React.FC<SubtypeOptionsProps> = ({
  ascOrder,
  setAscOrder,
  frozen,
  setFrozen,
  currFile,
  currSubtypeInfo,
  app,
  plugin,
  view,
  blockSwitch,
  setBlockSwitch,
  newBatch,
  setNewBatch,
  visibleData,
  setVisibleData,
  sortedResults,
  setSortedResults,
  page,
  setPage,
}) => {
  return (
    <div className="GA-options">
      <div className="GA-option">
        <label>
          <input
            type="checkbox"
            checked={frozen}
            onChange={(e) => setFrozen?.(e.target.checked)}
          />
          Freeze
        </label>
      </div>
      
      <div className="GA-option">
        <label>
          <input
            type="checkbox"
            checked={ascOrder}
            onChange={(e) => setAscOrder(e.target.checked)}
          />
          Ascending
        </label>
      </div>
      
      {currSubtypeInfo && (
        <div className="GA-info">
          <InfoIcon currSubtypeInfo={currSubtypeInfo} />
        </div>
      )}
    </div>
  );
};

export default SubtypeOptions;
