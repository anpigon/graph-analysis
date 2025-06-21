import { ItemView, WorkspaceLeaf, Menu } from 'obsidian';
import { VIEW_TYPE_GRAPH_ANALYSIS } from 'src/Constants';
import type { Subtype } from 'src/Interfaces';
import type GraphAnalysisPlugin from 'src/main';
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
  currSubtype: Subtype;
  private root: Root;

  constructor(
    leaf: WorkspaceLeaf,
    plugin: GraphAnalysisPlugin,
    currSubtype: Subtype | null
  ) {
    super(leaf);
    this.plugin = plugin;
    this.currSubtype = currSubtype || 'Co-Citations';
  }

  getViewType(): string {
    return VIEW_TYPE_GRAPH_ANALYSIS;
  }

  getDisplayText(): string {
    return 'Graph Analysis';
  }

  icon = 'GA-ICON';

  async onOpen(): Promise<void> {
    this.root = createRoot(this.containerEl.children[1]);
    await this.draw(this.currSubtype ?? this.plugin.settings.defaultSubtypeType);
  }

  async onClose(): Promise<void> {
    this.root.unmount();
  }

  async draw(currSubtype: Subtype): Promise<void> {
    const { app } = this;
    const { settings } = this.plugin;

    this.root.render(
      React.createElement(AnalysisComponent, {
        app,
        plugin: this.plugin,
        settings,
        view: this,
        currSubtype,
      })
    );
  }
}
