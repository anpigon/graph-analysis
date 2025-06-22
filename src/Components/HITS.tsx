import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import type { App, ItemView } from 'obsidian';
import { hoverPreview } from 'obsidian-community-lib';
import { isInVault } from '../Utility';
import type AnalysisView from '../AnalysisView';
import { ANALYSIS_TYPES, ICON, MEASURE } from '../Constants';
import type {
  GraphAnalysisSettings,
  HITSResult,
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
  roundNumber,
} from '../Utility';
import InfiniteScroll from 'react-infinite-scroll-component';
import ExtensionIcon from './ExtensionIcon';
import ImgThumbnail from './ImgThumbnail';
import SubtypeOptions from './SubtypeOptions';

interface HITSProps {
  app: App;
  plugin: GraphAnalysisPlugin;
  settings: GraphAnalysisSettings;
  view: AnalysisView;
  currSubtype: Subtype;
}

interface ComponentResults {
  authority: number;
  hub: number;
  to: string;
  resolved: boolean;
  img: Promise<ArrayBuffer> | null;
}

const HITS: React.FC<HITSProps> = ({
  app,
  plugin,
  settings,
  view,
  currSubtype,
}) => {
  const [sortBy, setSortBy] = useState(true);
  const [ascOrder, setAscOrder] = useState(false);
  const [currNode, setCurrNode] = useState(app.workspace.getActiveFile()?.path || '');
  const [sortedResults, setSortedResults] = useState<ComponentResults[]>([]);
  const [visibleData, setVisibleData] = useState<ComponentResults[]>([]);
  const [page, setPage] = useState(0);
  const [blockSwitch, setBlockSwitch] = useState(false);
  const size = 50;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentComponentRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const handleActiveLeafChange = () => {
      setBlockSwitch(true);
      setTimeout(() => {
        setBlockSwitch(false);
        setCurrNode(app.workspace.getActiveFile()?.path || '');
      }, 100);
    };
    app.workspace.on('active-leaf-change', handleActiveLeafChange);
    return () => {
      app.workspace.off('active-leaf-change', handleActiveLeafChange);
    };
  }, [app]);

  useEffect(() => {
    if (!plugin.g) return;

    plugin.g.algs.HITS('').then((results: HITSResult) => {
      const componentResults: ComponentResults[] = [];
      plugin.g.forEachNode((to) => {
        const authority = roundNumber(results.authorities[to]);
        const hub = roundNumber(results.hubs[to]);
        if (!(authority === 0 && hub === 0)) {
          const resolved = !to.endsWith('.md') || isInVault(app, to);
          const img =
            plugin.settings.showImgThumbnails && isImg(to)
              ? getImgBufferPromise(app, to)
              : null;
          componentResults.push({ authority, hub, to, resolved, img });
        }
      });

      const greater = ascOrder ? 1 : -1;
      const lesser = ascOrder ? -1 : 1;
      componentResults.sort((a, b) => {
        return sortBy
          ? a.authority > b.authority
            ? greater
            : lesser
          : a.hub > b.hub
          ? greater
          : lesser;
      });

      setSortedResults(componentResults);
      setVisibleData(componentResults.slice(0, size));
      setPage(1);
    });
  }, [plugin.g, ascOrder, sortBy, app, plugin.settings.showImgThumbnails]);

  const loadMoreData = () => {
    if (!blockSwitch) {
      const nextPage = page + 1;
      const nextBatch = sortedResults.slice(page * size, nextPage * size);
      setVisibleData((prev) => [...prev, ...nextBatch]);
      setPage(nextPage);
    }
  };

  const currSubtypeInfo = ANALYSIS_TYPES.find((sub) => sub.subtype === currSubtype) || ANALYSIS_TYPES[0];

  return (
    <div ref={scrollContainerRef} className="hits-scroll-container" id="scrollableDiv">
      <SubtypeOptions
        currSubtypeInfo={currSubtypeInfo}
        ascOrder={ascOrder}
        setAscOrder={setAscOrder}
        sortBy={sortBy}
        setSortBy={setSortBy}
        currFile={currNode}
        app={app}
        plugin={plugin}
        view={view}
        blockSwitch={blockSwitch}
        setBlockSwitch={setBlockSwitch}
      />
      <InfiniteScroll
        dataLength={visibleData.length}
        next={loadMoreData}
        hasMore={visibleData.length < sortedResults.length}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >
        <table className="ga-hits-table markdown-preview-view" ref={currentComponentRef}>
          <thead>
            <tr>
              <th scope="col">Note</th>
              <th scope="col">Authority</th>
              <th scope="col">Hub</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((node, index) => (
              <tr key={`${node.to}-${index}`} className={`${classExt(node.to)} ga-node`}>
                <td
                  onClick={async (e) => await openOrSwitch(app, node.to, e.nativeEvent)}
                  onContextMenu={(e) => openMenu(e.nativeEvent, app)}
                  onMouseOver={(e: React.MouseEvent) => 
                  hoverPreview(e.nativeEvent, view as unknown as Parameters<typeof hoverPreview>[1], dropPath(node.to) ?? '')
                }
                >
                  <ExtensionIcon path={node.to} />
                  <span
                    className={`ga-internal-link ${
                      node.resolved ? '' : 'ga-unresolved'
                    } ${currNode === node.to ? 'ga-current-node' : ''}`}
                  >
                    {presentPath(node.to)}
                  </span>
                  {isImg(node.to) && <ImgThumbnail img={node.img} />}
                </td>
                <td className={MEASURE}>{node.authority}</td>
                <td className={MEASURE}>{node.hub}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
      <div>
        {visibleData.length} / {sortedResults.length}
      </div>
    </div>
  );
};

export default HITS;
