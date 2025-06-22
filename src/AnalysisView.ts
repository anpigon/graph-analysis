import { ItemView, WorkspaceLeaf, Menu } from 'obsidian';
import { VIEW_TYPE_GRAPH_ANALYSIS } from './Constants';
import type { Subtype } from './Interfaces';
import type GraphAnalysisPlugin from './main';
import { Root, createRoot } from 'react-dom/client';
import * as React from 'react';
import AnalysisComponent from './Components/AnalysisComponent';

export default class AnalysisView extends ItemView {
  onMoreOptionsMenu(menu: Menu): void {
    // throw new Error('Method not implemented.');
  }
  onHeaderMenu(menu: Menu, source: string): void {
    // throw new Error('Method not implemented.');
  }
  registerScopeEvent(scope: any): void {
    // throw new Error('Method not implemented.');
  }
  plugin: GraphAnalysisPlugin;
  currSubtype: Subtype = 'Co-Citations';
  private root: Root | null = null;
  private cleanupCallbacks: (() => void)[] = [];

  constructor(
    leaf: WorkspaceLeaf,
    plugin: GraphAnalysisPlugin,
    currSubtype: Subtype | null
  ) {
    super(leaf);
    this.plugin = plugin;
    if (currSubtype) this.currSubtype = currSubtype;
  }

  getViewType(): string {
    return VIEW_TYPE_GRAPH_ANALYSIS;
  }

  getDisplayText(): string {
    return 'Graph Analysis';
  }

  icon = 'GA-ICON';

  async onOpen(): Promise<void> {
    const contentEl = this.containerEl.children.length > 1 
      ? this.containerEl.children[1] 
      : this.containerEl.createDiv();
    contentEl.addClass('graph-analysis-plugin')
    this.root = createRoot(contentEl);
    await this.draw(this.currSubtype ?? this.plugin.settings.defaultSubtypeType);
  }

  async onClose(): Promise<void> {
    this.cleanupCallbacks.forEach(cb => cb());
    this.cleanupCallbacks = [];
    this.root?.unmount();
    this.root = null;
  }

  async draw(currSubtype: Subtype): Promise<void> {
    if (!this.root) return;

    const { app } = this;
    const { settings } = this.plugin;

    this.root.render(
      React.createElement(AnalysisComponent, {
        app,
        plugin: this.plugin,
        settings,
        view: this,
        currSubtype,
        onUnmount: (callback: () => void) => {
          this.cleanupCallbacks.push(callback);
        }
      })
    );
  }
}
