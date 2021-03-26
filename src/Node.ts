import * as vscode from 'vscode';
import { Kind, Metadata } from './github/types';
import { BuildPath } from './utils/filesystem';


export class Node extends vscode.TreeItem {
  constructor(
    public readonly Metadata: Metadata,
    public readonly command?: vscode.Command
  ) {
    super(
      Metadata?.label || "Unknown",
      Metadata?.type == Kind.File || Metadata?.type == Kind.None ?
        vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Collapsed
    );

    this.tooltip = `${this.label}`;


    if (Metadata.type == Kind.File) {
      this.command = {
        command: 'github-explorer-view.openDocument',
        title: '',
        arguments: [Metadata]
      };
    }

    this.setContext();
    this.setIcon();
  }

  setContext(): void {
    switch (this.Metadata.type) {
      case Kind.File:
        this.contextValue = "file";
        break;

      case Kind.Folder:
        this.contextValue = "folder";
        break;

      case Kind.Branch:
        this.contextValue = "branch";
        break;

      case Kind.Content:
        this.contextValue = "content";
        break;

      case Kind.Repository:
        this.contextValue = "repository";
        break;

      default:
        this.contextValue = "default";
        break;
    }
  }

  setIcon() {
    this.iconPath = {
      light: BuildPath(__filename, '..', '..', 'resources', 'light', `${this.contextValue}.svg`),
      dark: BuildPath(__filename, '..', '..', 'resources', 'dark', `${this.contextValue}.svg`)
    };
  }
}
