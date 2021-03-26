import * as vscode from 'vscode';
import { Kind, Metadata } from './github/types';
import { buildPath } from './utils/filesystem';


export class Node extends vscode.TreeItem {
  constructor(
    public readonly metadata: Metadata,
    public readonly command?: vscode.Command
  ) {
    super(
      metadata?.label || "Unknown",
      metadata?.type === Kind.file || metadata?.type === Kind.none ?
        vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Collapsed
    );

    this.tooltip = `${this.label}`;


    if (metadata.type === Kind.file) {
      this.command = {
        command: 'github-explorer-view.openDocument',
        title: '',
        arguments: [metadata]
      };
    }

    this.setContext();
    this.setIcon();
  }

  setContext(): void {
    switch (this.metadata.type) {
      case Kind.file:
        this.contextValue = "file";
        break;

      case Kind.folder:
        this.contextValue = "folder";
        break;

      case Kind.branch:
        this.contextValue = "branch";
        break;

      case Kind.content:
        this.contextValue = "content";
        break;

      case Kind.repository:
        this.contextValue = "repository";
        break;

      default:
        this.contextValue = "default";
        break;
    }
  }

  setIcon() {
    this.iconPath = {
      light: buildPath(__filename, '..', '..', 'resources', 'light', `${this.contextValue}.svg`),
      dark: buildPath(__filename, '..', '..', 'resources', 'dark', `${this.contextValue}.svg`)
    };
  }
}
