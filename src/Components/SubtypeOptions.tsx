import * as React from 'react';
import type { App, TFile } from 'obsidian';
import type AnalysisView from '../AnalysisView';
import type { SubtypeInfo } from '../Interfaces';
import type GraphAnalysisPlugin from '../main';
import InfoIcon from './InfoIcon';
import { 
  FaCreativeCommonsZero, 
  FaFire, 
  FaRegSnowflake 
} from 'react-icons/fa';
import { 
  IoIosTrendingDown, 
  IoIosTrendingUp, 
  IoMdRefresh 
} from 'react-icons/io';
import { 
  MdExposureZero 
} from 'react-icons/md';
import { 
  GoSignIn, 
  GoSignOut 
} from 'react-icons/go';

interface SubtypeOptionsProps {
  currSubtypeInfo: SubtypeInfo;
  noZero?: boolean | undefined;
  setNoZero?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
  sortBy?: boolean;
  setSortBy?: React.Dispatch<React.SetStateAction<boolean>>;
  ascOrder: boolean;
  setAscOrder: React.Dispatch<React.SetStateAction<boolean>>;
  frozen?: boolean;
  setFrozen?: React.Dispatch<React.SetStateAction<boolean>>;
  currFile: string | null;
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
  currSubtypeInfo,
  noZero,
  setNoZero,
  sortBy,
  setSortBy,
  ascOrder,
  setAscOrder,
  frozen,
  setFrozen,
  currFile,
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
  const styles = {
    subtypeOptions: {
      marginLeft: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    optionSpan: {
      padding: '2px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center'
    },
    icon: {
      color: 'var(--text-normal)',
      paddingTop: '5px',
      width: '20px',
      height: '20px'
    }
  };

  const handleNoZeroToggle = () => {
    if (setNoZero) {
      setNoZero(!noZero);
      if (!frozen && setNewBatch && setVisibleData && setSortedResults && setPage) {
        if (setBlockSwitch) setBlockSwitch(true);
        setNewBatch([]);
        setVisibleData([]);
        setSortedResults(null);
        setPage(0);
      }
    }
  };

  const handleAscOrderToggle = () => {
    setAscOrder(!ascOrder);
    if (!frozen && setNewBatch && setVisibleData && setSortedResults && setPage) {
      if (setBlockSwitch) setBlockSwitch(true);
      setNewBatch([]);
      setVisibleData([]);
      setSortedResults(null);
      setPage(0);
    }
  };

  const handleFrozenToggle = () => {
    if (setFrozen) {
      setFrozen(!frozen);
      if (!frozen && !currSubtypeInfo.global && setNewBatch && setVisibleData && setSortedResults && setPage) {
        if (setBlockSwitch) setBlockSwitch(true);
        setNewBatch([]);
        setVisibleData([]);
        setSortedResults(null);
        setPage(0);
        setTimeout(() => {
          // currFile 업데이트 로직 (부모 컴포넌트에서 처리)
        }, 100);
      } else if (!frozen && currSubtypeInfo.global && setNewBatch) {
        if (setBlockSwitch) setBlockSwitch(true);
        setTimeout(() => {
          if (setBlockSwitch) setBlockSwitch(false);
          // currFile 업데이트 로직 (부모 컴포넌트에서 처리)
        }, 100);
        setNewBatch([]);
      }
    }
  };

  const handleSortByToggle = () => {
    if (setSortBy) {
      setSortBy(!sortBy);
      if (!frozen && setNewBatch && setVisibleData && setSortedResults && setPage) {
        if (setBlockSwitch) setBlockSwitch(true);
        setNewBatch([]);
        setVisibleData([]);
        setSortedResults(null);
        setPage(0);
      }
    }
  };

  const handleRefresh = async () => {
    await plugin.refreshGraph();
    await view.draw(currSubtypeInfo.subtype);
  };

  return (
    <div style={styles.subtypeOptions}>
      <InfoIcon currSubtypeInfo={currSubtypeInfo} />

      {noZero !== undefined && setNoZero && (
        <span
          style={styles.optionSpan}
          aria-label={noZero ? 'Show Zeros' : 'Hide Zeros'}
          onClick={handleNoZeroToggle}
        >
          <span style={styles.icon}>
            {noZero ? <MdExposureZero /> : <FaCreativeCommonsZero />}
          </span>
        </span>
      )}

      {ascOrder !== undefined && (
        <span
          style={styles.optionSpan}
          aria-label={ascOrder ? 'Ascending' : 'Descending'}
          onClick={handleAscOrderToggle}
        >
          <span style={styles.icon}>
            {ascOrder ? <IoIosTrendingUp /> : <IoIosTrendingDown />}
          </span>
        </span>
      )}

      {frozen !== undefined && setFrozen && (
        <span
          style={styles.optionSpan}
          aria-label={frozen ? `Frozen on: ${currFile ? currFile.split('/').pop() || 'No file' : 'No file'}` : 'Unfrozen'}
          onClick={handleFrozenToggle}
        >
          <span style={styles.icon}>
            {frozen ? <FaRegSnowflake /> : <FaFire />}
          </span>
        </span>
      )}

      {sortBy !== undefined && setSortBy && (
        <span
          style={styles.optionSpan}
          aria-label={`Sort By: ${sortBy ? 'Authority' : 'Hub'}`}
          onClick={handleSortByToggle}
        >
          <span style={styles.icon}>
            {sortBy ? <GoSignIn /> : <GoSignOut />}
          </span>
        </span>
      )}

      <span
        style={styles.optionSpan}
        aria-label="Refresh Index"
        onClick={handleRefresh}
      >
        <span style={styles.icon}>
          <IoMdRefresh />
        </span>
      </span>
    </div>
  );
};

export default SubtypeOptions;
