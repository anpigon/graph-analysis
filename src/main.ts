import { addIcon, Notice, Plugin, WorkspaceLeaf } from 'obsidian'
import AnalysisView from './AnalysisView'
import {
  ANALYSIS_TYPES,
  DEFAULT_SETTINGS,
  iconSVG,
  VIEW_TYPE_GRAPH_ANALYSIS,
} from './Constants'
import type { GraphAnalysisSettings } from './Interfaces'
import MyGraph from './MyGraph'
import { SampleSettingTab } from './Settings'
import { debug } from './Utility'
import "./tailwind-entry.css";

export default class GraphAnalysisPlugin extends Plugin {
  settings: GraphAnalysisSettings
  g: MyGraph

  async onload() {
    console.log('loading graph analysis plugin')

    await this.loadSettings()
    addIcon('GA-ICON', iconSVG)

    this.addCommand({
      id: 'show-graph-analysis-view',
      name: 'Open Graph Analysis View',
      callback: () => {
        this.activateView()
      },
    })

    this.addCommand({
      id: 'refresh-analysis-view',
      name: 'Refresh Graph Analysis View',
      callback: async () => {
        await this.refreshGraph()
        const currView = await this.getCurrentView()
        if (currView && 'draw' in currView) {
          await (currView as AnalysisView).draw(
            (currView as AnalysisView).currSubtype
          )
        }
      },
    })

    ANALYSIS_TYPES.forEach((sub) => {
      this.addCommand({
        id: `open-${sub.subtype}`,
        name: `Open ${sub.subtype}`,
        callback: async () => {
          const currView = await this.getCurrentView()
          if (currView && 'draw' in currView) {
            await (currView as AnalysisView).draw(sub.subtype)
          }
        },
      })
    })

    this.addSettingTab(new SampleSettingTab(this.app, this))

    this.registerView(
      VIEW_TYPE_GRAPH_ANALYSIS,
      (leaf: WorkspaceLeaf) => new AnalysisView(leaf, this, null)
    )

    this.app.workspace.onLayoutReady(async () => {
      await this.refreshGraph()
      this.activateView()
    })
  }

  resolvedLinksComplete(noFiles: number) {
    const { resolvedLinks } = this.app.metadataCache
    return Object.keys(resolvedLinks).length === noFiles
  }

  getCurrentView = async (openIfNot = true) => {
    const view = this.app.workspace.getLeavesOfType(
      VIEW_TYPE_GRAPH_ANALYSIS
    )?.[0]?.view as AnalysisView

    if (view) return view
    else if (openIfNot) {
      this.activateView()
      return this.app.workspace.getLeavesOfType(VIEW_TYPE_GRAPH_ANALYSIS)?.[0]
        ?.view as AnalysisView
    } else return null
  }

  async activateView() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_GRAPH_ANALYSIS)

    const rightLeaf = this.app.workspace.getRightLeaf(false)
    if (rightLeaf) {
      await rightLeaf.setViewState({
        type: VIEW_TYPE_GRAPH_ANALYSIS,
        active: true,
      })
    }

    const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE_GRAPH_ANALYSIS)[0]
    if (leaf) {
      this.app.workspace.revealLeaf(leaf)
    }
  }

  async refreshGraph() {
    try {
      console.time('Initialise Graph')
      this.g = new MyGraph(this.app, this.settings)
      await this.g.initGraph()
      // await this.g.initData()
      debug(this.settings, { g: this.g })
      console.timeEnd('Initialise Graph')
      new Notice('Index Refreshed')
    } catch (error) {
      console.log(error)
      new Notice(
        'An error occured with Graph Analysis, please check the console.'
      )
    }
  }

  onunload() {
    console.log('unloading graph analysis plugin')
    this.app.workspace
      .getLeavesOfType(VIEW_TYPE_GRAPH_ANALYSIS)
      .forEach((leaf) => {
        leaf.view.unload()
        leaf.detach()
      })
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}
