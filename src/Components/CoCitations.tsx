import * as React from 'react'
/* CSS 모듈 대신 Tailwind 클래스 사용 */
import { useState, useEffect, useRef } from 'react'
import type { App } from 'obsidian'
import type AnalysisView from '../AnalysisView'
import {
  ANALYSIS_TYPES,
  ICON,
  LINKED,
  MEASURE,
  NODE,
  NOT_LINKED,
} from '../Constants'
import type {
  CoCitation,
  CoCitationMap,
  CoCitationRes,
  GraphAnalysisSettings,
  Subtype,
} from '../Interfaces'
import type GraphAnalysisPlugin from '../main'
import {
  classExt,
  debug,
  dropPath,
  getImgBufferPromise,
  hoverPreview,
  isImg,
  jumpToSelection,
  looserIsLinked,
  openMenu,
  openOrSwitch,
  presentPath,
  roundNumber,
} from '../Utility'
import { FaLink } from 'react-icons/fa'
import InfiniteScroll from 'react-infinite-scroll-component'
import ExtensionIcon from './ExtensionIcon'
import ImgThumbnail from './ImgThumbnail'
import SubtypeOptions from './SubtypeOptions'
import RenderedMarkdown from './RenderedMarkdown'

// Props 인터페이스에 명시적 타입 추가
interface CoCitationsProps {
  app: App
  plugin: GraphAnalysisPlugin
  settings: GraphAnalysisSettings
  view: AnalysisView
  currSubtype: Subtype
}

interface CoCitationsProps {
  app: App
  plugin: GraphAnalysisPlugin
  settings: GraphAnalysisSettings
  view: AnalysisView
  currSubtype: Subtype
}

interface CoCiteComp {
  measure: number
  coCitations: CoCitation[]
  linked: boolean
  resolved: boolean
  to: string
}

const CoCitations: React.FC<CoCitationsProps> = ({
  app,
  plugin,
  settings,
  view,
  currSubtype,
}) => {
  const [frozen, setFrozen] = useState(false)
  const [size] = useState(50)
  const [currNode, setCurrNode] = useState('')
  const [newBatch, setNewBatch] = useState<CoCiteComp[]>([])
  const [visibleData, setVisibleData] = useState<CoCiteComp[]>([])
  const [page, setPage] = useState(0)
  const [blockSwitch, setBlockSwitch] = useState(false)
  const [ascOrder, setAscOrder] = useState(false)
  const [sortedResults, setSortedResults] = useState<CoCiteComp[] | null>(null)

  const currentComponentRef = useRef<HTMLDivElement>(null)
  const currSubtypeInfo = ANALYSIS_TYPES.find(
    (sub) => sub.subtype === currSubtype
  )!
  // ! 연산자 사용으로 undefined가 아님을 보장 (ANALYSIS_TYPES에 항상 존재하는 값)

  useEffect(() => {
    const activeFile = app.workspace.getActiveFile()
    setCurrNode(activeFile?.path || '')

    const handleActiveLeafChange = () => {
      if (!frozen) {
        setBlockSwitch(true)
        setNewBatch([])
        setVisibleData([])
        setSortedResults(null)
        setPage(0)

        setTimeout(() => {
          const newActiveFile = app.workspace.getActiveFile()
          setCurrNode(newActiveFile?.path || '')
        }, 100)
      }
    }

    app.workspace.on('active-leaf-change', handleActiveLeafChange)
    return () => {
      app.workspace.off('active-leaf-change', handleActiveLeafChange)
    }
  }, [app, frozen])

  useEffect(() => {
    if (!currNode || !plugin.g) {
      setSortedResults(null)
      return
    }

    const fetchCoCitations = async () => {
      try {
        const ccMap = (await plugin.g.algs['Co-Citations'](
          currNode
        )) as CoCitationMap

        Object.values(ccMap).forEach((value: CoCitationRes) => {
          value.coCitations = value.coCitations.sort((a, b) =>
            a.measure > b.measure ? -1 : 1
          )
        })

        const greater = ascOrder ? 1 : -1
        const lesser = ascOrder ? -1 : 1
        const sortedCites: CoCiteComp[] = []

        Object.keys(ccMap).forEach((to) => {
          const { coCitations, measure, resolved } = ccMap[to] as CoCitationRes
          if (measure !== 0 && measure !== Infinity) {
            sortedCites.push({
              measure,
              coCitations,
              linked: looserIsLinked(app, to, currNode, false),
              resolved,
              to,
            })
          }
        })

        sortedCites.sort((a, b) =>
          a.measure > b.measure
            ? greater
            : a.measure !== b.measure ||
              presentPath(a.to).toLowerCase() > presentPath(b.to).toLowerCase()
            ? lesser
            : greater
        )

        setSortedResults(sortedCites)
        const initialBatch = sortedCites.slice(0, size)
        setNewBatch(initialBatch)
        setVisibleData(initialBatch)
        debug(settings, { res: sortedCites })

        setTimeout(() => setBlockSwitch(false), 100)
      } catch (error) {
        console.error('Error fetching co-citations:', error)
      }
    }

    fetchCoCitations()
  }, [currNode, plugin, app, ascOrder, settings, size])

  useEffect(() => {
    if (newBatch.length > 0) {
      setVisibleData((prev) => [...prev, ...newBatch])
    }
  }, [newBatch])

  const loadMoreData = () => {
    if (
      !blockSwitch &&
      sortedResults &&
      sortedResults.length > visibleData.length
    ) {
      const nextPage = page + 1
      setPage(nextPage)
      const nextBatch = sortedResults.slice(
        size * nextPage,
        size * (nextPage + 1)
      )
      setNewBatch(nextBatch)
    }
  }

  return (
    <div className="GA-CCs" ref={currentComponentRef}>
      <SubtypeOptions
        ascOrder={ascOrder}
        setAscOrder={setAscOrder}
        frozen={frozen}
        setFrozen={setFrozen}
        currFile={currNode}
        currSubtypeInfo={currSubtypeInfo}
        app={app}
        plugin={plugin}
        view={view}
        blockSwitch={blockSwitch}
        setBlockSwitch={setBlockSwitch}
        newBatch={newBatch}
        setNewBatch={setNewBatch}
        visibleData={visibleData}
        setVisibleData={setVisibleData}
        sortedResults={sortedResults}
        setSortedResults={setSortedResults}
        page={page}
        setPage={setPage}
      />

      {sortedResults && (
        <div>
          {visibleData
            .filter((node) => node.to !== currNode && node !== undefined)
            .map((node, index) => (
              <div key={index} className="GA-CC">
                <details>
                  <summary>
                    <span className="top-row">
                      <span
                        className={`${classExt(node.to)} ${
                          node.linked ? LINKED : NOT_LINKED
                        } ${NODE}`}
                        onClick={async (e: React.MouseEvent) => {
                          if (node.to[0] !== '#') {
                            await openOrSwitch(app, node.to, e.nativeEvent)
                          }
                        }}
                        onContextMenu={(e: React.MouseEvent) =>
                          openMenu(e.nativeEvent, app)
                        }
                        onMouseOver={(e: React.MouseEvent) =>
                          hoverPreview(
                            e.nativeEvent,
                            view,
                            dropPath(node.to) ?? ''
                          )
                        }
                      >
                        {node.to[0] === '#' ? (
                          <a className="tag">{node.to}</a>
                        ) : (
                          <>
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
                            {plugin.settings.showImgThumbnails &&
                              isImg(node.to) && (
                                <ImgThumbnail
                                  img={getImgBufferPromise(app, node.to)}
                                />
                              )}
                          </>
                        )}
                      </span>
                      <span className={MEASURE}>
                        {roundNumber(node.measure, 3)}
                      </span>
                    </span>
                  </summary>
                  <div className="GA-details">
                    {node.coCitations.map((coCite, coIndex) => (
                      <div key={coIndex} className="CC-item">
                        <span
                          className={`internal-link ${NODE}`}
                          onClick={async (e: React.MouseEvent) =>
                            await openOrSwitch(
                              app,
                              coCite.source,
                              e.nativeEvent
                            )
                          }
                          onContextMenu={(e: React.MouseEvent) =>
                            openMenu(e.nativeEvent, app)
                          }
                          onMouseOver={(e: React.MouseEvent) =>
                            hoverPreview(
                              e.nativeEvent,
                              view,
                              dropPath(coCite.source) ?? ''
                            )
                          }
                        >
                          {presentPath(coCite.source)}
                        </span>
                        <span className="GA-measure">
                          {roundNumber(coCite.measure, 3)}
                        </span>
                        <RenderedMarkdown
                          sentence={coCite.sentence} // 이미 string[] 타입으로 정의됨
                          sourcePath={coCite.source}
                          app={app}
                          line={coCite.line}
                        />
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}

          <InfiniteScroll
            dataLength={visibleData.length}
            next={loadMoreData}
            hasMore={sortedResults.length > visibleData.length}
            loader={<h4>Loading...</h4>}
            scrollableTarget={
              currentComponentRef.current?.parentElement?.id || undefined
            }
          >
            {null}
          </InfiniteScroll>
          <div>
            {visibleData.length} / {sortedResults.length}
          </div>
        </div>
      )}
    </div>
  )
}

export default CoCitations
