import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import type { App } from 'obsidian';
import { hoverPreview, isInVault, isLinked } from 'obsidian-community-lib';
import type AnalysisView from '../AnalysisView';
import { ANALYSIS_TYPES, ICON, LINKED, NOT_LINKED } from '../Constants';
import type { GraphAnalysisSettings, Subtype } from '../Interfaces';
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

interface LouvainProps {
  app: App;
  plugin: GraphAnalysisPlugin;
  settings: GraphAnalysisSettings;
  view: AnalysisView;
  currSubtype: Subtype;
}

interface ComponentResults {
  linked: boolean;
  to: string;
  resolved: boolean;
  img: Promise<ArrayBuffer> | null;
}

const Louvain: React.FC<LouvainProps> = ({
  app,
  plugin,
  settings,
  view,
  currSubtype,
}) => {
  const [frozen, setFrozen] = useState(false);
  const [ascOrder, setAscOrder] = useState(false);
  const [resolution, setResolution] = useState(10);
  const [currNode, setCurrNode] = useState(app.workspace.getActiveFile()?.path || '');
  const [sortedResults, setSortedResults] = useState<ComponentResults[]>([]);
  const [visibleData, setVisibleData] = useState<ComponentResults[]>([]);
  const [page, setPage] = useState(0);
  const size = 50;
  const currentComponentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleActiveLeafChange = () => {
      if (!frozen) {
        setCurrNode(app.workspace.getActiveFile()?.path || '');
      }
    };
    app.workspace.on('active-leaf-change', handleActiveLeafChange);
    return () => {
      app.workspace.off('active-leaf-change', handleActiveLeafChange);
    };
  }, [app, frozen]);

  useEffect(() => {
    if (!plugin.g || !currNode) return;

    plugin.g.algs.Louvain(currNode, { resolution }).then((results: string[]) => {
      const componentResults: ComponentResults[] = [];
      results.forEach((to) => {
        const resolved = !to.endsWith('.md') || isInVault(app as any, to);
        const linked = isLinked(app.metadataCache.resolvedLinks, currNode, to, false);
        const img =
          plugin.settings.showImgThumbnails && isImg(to)
            ? getImgBufferPromise(app, to)
            : null;
        componentResults.push({ linked, to, resolved, img });
      });
      setSortedResults(componentResults);
      setVisibleData(componentResults.slice(0, size));
      setPage(1);
    });
  }, [plugin.g, currNode, resolution, app, plugin.settings.showImgThumbnails]);

  const loadMoreData = () => {
    const nextPage = page + 1;
    const nextBatch = sortedResults.slice(page * size, nextPage * size);
    setVisibleData((prev) => [...prev, ...nextBatch]);
    setPage(nextPage);
  };

  const currSubtypeInfo = ANALYSIS_TYPES.find((sub) => sub.subtype === currSubtype);

  return (
    <div>
      <SubtypeOptions
        currSubtypeInfo={currSubtypeInfo}
        ascOrder={ascOrder}
        setAscOrder={setAscOrder}
        frozen={frozen}
        setFrozen={setFrozen}
        currFile={currNode}
        app={app}
        plugin={plugin}
        view={view}
      />
      <label htmlFor="resolution">Resolution: </label>
      <input
        name="resolution"
        type="range"
        min="1"
        max="20"
        value={resolution}
        onChange={(e) => setResolution(Number(e.target.value))}
      />
      <div className="GA-Results" ref={currentComponentRef}>
        <InfiniteScroll
          dataLength={visibleData.length}
          next={loadMoreData}
          hasMore={visibleData.length < sortedResults.length}
          loader={<h4>Loading...</h4>}
          scrollableTarget={currentComponentRef.current?.parentElement?.id || undefined}
        >
          {visibleData
            .filter((node) => node.to !== currNode && node !== undefined)
            .map((node, index) => (
              <div
                key={index}
                className={`${
                  node.linked ? LINKED : NOT_LINKED
                } ${classExt(node.to)}`}
                onClick={async (e) => await openOrSwitch(app, node.to, e.nativeEvent)}
              >
                <span
                  onContextMenu={(e) => openMenu(e.nativeEvent, app)}
                  onMouseOver={(e) => hoverPreview(e.nativeEvent, view as any, dropPath(node.to) ?? '')}
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
                </span>
              </div>
            ))}
        </InfiniteScroll>
        <div>
          {visibleData.length} / {sortedResults.length}
        </div>
      </div>
    </div>
  );
};

export default Louvain;
