import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import type { App } from 'obsidian';
import { hoverPreview, isInVault, isLinked } from 'obsidian-community-lib';
import type AnalysisView from '../AnalysisView';
import {
  ANALYSIS_TYPES,
  ICON,
  LINKED,
  MEASURE,
  NOT_LINKED,
} from '../Constants';
import type {
  GraphAnalysisSettings,
  ResultMap,
  Subtype,
} from '../Interfaces';
import type GraphAnalysisPlugin from '../main';
import {
  classExt,
  dropPath,
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

interface TableComponentProps {
  app: App;
  plugin: GraphAnalysisPlugin;
  settings: GraphAnalysisSettings;
  view: AnalysisView;
  currSubtype: Subtype;
}

interface ComponentResults {
  measure: number;
  linked: boolean;
  to: string;
  resolved: boolean;
  extra: string[];
  img: Promise<ArrayBuffer> | null;
}

const TableComponent: React.FC<TableComponentProps> = ({
  app,
  plugin,
  settings,
  view,
  currSubtype,
}) => {
  const [frozen, setFrozen] = useState(false);
  const [ascOrder, setAscOrder] = useState(false);
  const { noInfinity, noZero } = settings;
  const [currNode, setCurrNode] = useState(app.workspace.getActiveFile()?.path || '');
  const [sortedResults, setSortedResults] = useState<ComponentResults[]>([]);
  const [visibleData, setVisibleData] = useState<ComponentResults[]>([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const size = 50;
  const currentComponentRef = useRef<HTMLTableElement>(null);

  const currSubtypeInfo = ANALYSIS_TYPES.find((sub) => sub.subtype === currSubtype);

  useEffect(() => {
    const handleActiveLeafChange = () => {
      if (!frozen && !currSubtypeInfo?.global) {
        setCurrNode(app.workspace.getActiveFile()?.path || '');
      }
    };
    const workspace = app.workspace;
    workspace.on('active-leaf-change', handleActiveLeafChange);
    return () => {
      workspace.off('active-leaf-change', handleActiveLeafChange);
    };
  }, [app, frozen, currSubtypeInfo]);

  useEffect(() => {
    if (!plugin.g || !currNode) return;

    plugin.g.algs[currSubtype](currNode).then((results: ResultMap) => {
      const greater = ascOrder ? 1 : -1;
      const lesser = ascOrder ? -1 : 1;
      const componentResults: ComponentResults[] = [];

      plugin.g.forEachNode((to) => {
        const { measure, extra } = (results as ResultMap)[to];
        if (
          !(noInfinity && measure === Infinity) &&
          !(noZero && measure === 0)
        ) {
          const resolved = !to.endsWith('.md') || isInVault(app as any, to);
          const linked = isLinked(app.metadataCache.resolvedLinks, currNode, to, false);
          const img =
            plugin.settings.showImgThumbnails && isImg(to)
              ? getImgBufferPromise(app, to)
              : null;
          componentResults.push({
            measure,
            linked,
            to,
            resolved,
            extra,
            img,
          });
        }
      });
      componentResults.sort((a, b) => {
        return a.measure === b.measure
          ? (a.extra?.length || 0) > (b.extra?.length || 0)
            ? greater
            : lesser
          : a.measure > b.measure
          ? greater
          : lesser;
      });
      setSortedResults(componentResults);
      setVisibleData(componentResults.slice(0, size));
      setPage(1);
    });
  }, [plugin.g, currNode, currSubtype, ascOrder, noInfinity, noZero, app, plugin.settings.showImgThumbnails]);

  const loadMoreData = () => {
    const nextPage = page + 1;
    const nextBatch = sortedResults.slice(page * size, nextPage * size);
    setVisibleData((prev) => [...prev, ...nextBatch]);
    setPage(nextPage);
  };

  return (
    <div>
      {currSubtypeInfo && (
        <SubtypeOptions
          currSubtypeInfo={currSubtypeInfo}
          ascOrder={ascOrder}
          setAscOrder={setAscOrder}
          frozen={frozen}
          setFrozen={setFrozen}
          currFile={app.workspace.getActiveFile()}
          app={app}
          plugin={plugin}
          view={view}
          noZero={noZero}
          setNoZero={(value) => {
            settings.noZero = value;
            plugin.saveSettings();
          }}
          sortedResults={sortedResults}
          setSortedResults={setSortedResults}
          visibleData={visibleData}
          setVisibleData={setVisibleData}
          page={page}
          setPage={setPage}
        />
      )}
      <InfiniteScroll
        dataLength={visibleData.length}
        next={loadMoreData}
        hasMore={visibleData.length < sortedResults.length}
        loader={<h4>Loading...</h4>}
        scrollableTarget={currentComponentRef.current?.parentElement?.id || undefined}
      >
        <table className="GA-table markdown-preview-view" ref={currentComponentRef}>
          <thead>
            <tr>
              <th scope="col">Note</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
      {isLoading ? (
        <tr>
          <td colSpan={2}>Loading analysis data...</td>
        </tr>
      ) : (
        visibleData
          .filter(
            (node) =>
              (currSubtypeInfo?.global || node.to !== currNode) &&
              node !== undefined
          )
          .map((node) => (
            <tr
              key={node.to}
              className={`${
                node.linked ? LINKED : NOT_LINKED
              } ${classExt(node.to)}`}
            >
              <td
                aria-label={node.extra.map(presentPath).join('\n')}
                onClick={async (e) => await openOrSwitch(app, node.to, e.nativeEvent)}
                onContextMenu={(e) => openMenu(e.nativeEvent, app)}
                onMouseOver={(e) =>
                  hoverPreview(e.nativeEvent, view as any, dropPath(node.to) ?? ''
                )}
              >
                {node.linked && (
                  <span className={ICON}>
                    {React.createElement(FaLink as React.FC)}
                  </span>
                )}
                <ExtensionIcon path={node.to} />
                <span
                  className={`internal-link ${
                    node.resolved ? '' : 'is-unresolved'
                  }`}
                >
                  {presentPath(node.to)}
                </span>
                {isImg(node.to) && <ImgThumbnail img={node.img} />}
              </td>
              <td className={MEASURE}>{node.measure}</td>
            </tr>
          )))}
          </tbody>
        </table>
      </InfiniteScroll>
      <div>
        {visibleData.length} / {sortedResults.length}
      </div>
    </div>
  );
};

export default TableComponent;
