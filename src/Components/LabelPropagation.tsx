import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import type { App } from 'obsidian';
import { hoverPreview, isLinked } from 'obsidian-community-lib';
import type AnalysisView from '../AnalysisView';
import { ANALYSIS_TYPES, ICON, MEASURE, NODE } from '../Constants';
import type {
  Communities,
  GraphAnalysisSettings,
  Subtype,
} from '../Interfaces';
import type GraphAnalysisPlugin from '../main';
import {
  classExt,
  classLinked,
  classResolved,
  getImgBufferPromise,
  isImg,
  openMenu,
  openOrSwitch,
  presentPath,
} from '../Utility';
import { FaLink } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import ExtensionIcon from './ExtensionIcon';
import ImgThumbnail from './ImgThumbnail';
import SubtypeOptions from './SubtypeOptions';

interface LabelPropagationProps {
  app: App;
  plugin: GraphAnalysisPlugin;
  settings: GraphAnalysisSettings;
  view: AnalysisView;
  currSubtype: Subtype;
}

interface ComponentResults {
  label: string;
  comm: string[];
}

const LabelPropagation: React.FC<LabelPropagationProps> = ({
  app,
  plugin,
  settings,
  view,
  currSubtype,
}) => {
  const [ascOrder, setAscOrder] = useState(false);
  const [its, setIts] = useState(20);
  const [currNode, setCurrNode] = useState(app.workspace.getActiveFile()?.path || '');
  const [sortedResults, setSortedResults] = useState<ComponentResults[]>([]);
  const [visibleData, setVisibleData] = useState<ComponentResults[]>([]);
  const [page, setPage] = useState(0);
  const size = 50;
  const currentComponentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleActiveLeafChange = () => {
      setCurrNode(app.workspace.getActiveFile()?.path || '');
    };
    app.workspace.on('active-leaf-change', handleActiveLeafChange);
    return () => {
      app.workspace.off('active-leaf-change', handleActiveLeafChange);
    };
  }, [app]);

  useEffect(() => {
    if (!plugin.g) return;

    plugin.g.algs[currSubtype]('', { iterations: its }).then(
      (comms: Communities) => {
        const greater = ascOrder ? 1 : -1;
        const lesser = ascOrder ? -1 : 1;

        const componentResults: ComponentResults[] = [];
        Object.keys(comms).forEach((label) => {
          let comm = comms[label];
          if (comm.length > 1) {
            componentResults.push({ label, comm });
          }
        });
        componentResults.sort((a, b) =>
          a.comm.length > b.comm.length ? greater : lesser
        );
        
        setSortedResults(componentResults);
        setVisibleData(componentResults.slice(0, size));
        setPage(1);
      }
    );
  }, [plugin.g, ascOrder, its, currSubtype]);

  const loadMoreData = () => {
    const nextPage = page + 1;
    const nextBatch = sortedResults.slice(page * size, nextPage * size);
    setVisibleData((prev) => [...prev, ...nextBatch]);
    setPage(nextPage);
  };

  const currSubtypeInfo = ANALYSIS_TYPES.find((sub) => sub.subtype === currSubtype);

  return (
    <div className="GA-CCs" ref={currentComponentRef}>
      <div>
        <span>
          <SubtypeOptions
            currSubtypeInfo={currSubtypeInfo}
            ascOrder={ascOrder}
            setAscOrder={setAscOrder}
            currFile={currNode}
            app={app}
            plugin={plugin}
            view={view}
          />
          <label htmlFor="iterations">Iterations: </label>
          <input
            name="iterations"
            type="range"
            min="1"
            max="30"
            value={its}
            onChange={(e) => setIts(Number(e.target.value))}
          />
        </span>
      </div>
      <InfiniteScroll
        dataLength={visibleData.length}
        next={loadMoreData}
        hasMore={visibleData.length < sortedResults.length}
        loader={<h4>Loading...</h4>}
        scrollableTarget={currentComponentRef.current?.parentElement?.id || undefined}
      >
        {visibleData.map((comm, index) => (
          <div key={index} className="GA-CC">
            <details className="tree-item-self">
              <summary
                className="tree-item-inner"
                onContextMenu={(e) =>
                  openMenu(e.nativeEvent, app, { toCopy: comm.comm.join('\n') })
                }
              >
                <span
                  className={`top-row ${
                    comm.comm.includes(currNode) ? 'currComm' : ''
                  }`}
                >
                  <span>{presentPath(comm.label)}</span>
                  <span className={MEASURE}>{comm.comm.length}</span>
                </span>
              </summary>
              <div className="GA-details">
                {comm.comm.map((member, memberIndex) => (
                  <div
                    key={memberIndex}
                    className={`${NODE} ${classLinked(
                      app.metadataCache.resolvedLinks,
                      comm.label,
                      member
                    )} ${classResolved(app, member)} ${classExt(member)}`}
                    onClick={async (e) => await openOrSwitch(app, member, e.nativeEvent)}
                    onMouseOver={(e: React.MouseEvent) => hoverPreview(e.nativeEvent, view as any, member)}
                  >
                    {isLinked(
                      app.metadataCache.resolvedLinks,
                      comm.label,
                      member,
                      false
                    ) && (
                      <span className={ICON}>
                        {React.createElement(FaLink as React.FC)}
                      </span>
                    )}
                    <ExtensionIcon path={member} />
                    <span
                      className={`internal-link ${
                        currNode === member ? 'currNode' : ''
                      }`}
                    >
                      {presentPath(member)}
                    </span>
                    {plugin.settings.showImgThumbnails && isImg(member) && (
                      <ImgThumbnail img={getImgBufferPromise(app, member)} />
                    )}
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}
      </InfiniteScroll>
      <div>
        {visibleData.length} / {sortedResults.length}
      </div>
    </div>
  );
};

export default LabelPropagation;
