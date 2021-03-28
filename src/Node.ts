import * as vscode from 'vscode';
import { Kind, Metadata } from './github/types';
import { buildPath } from './utils/filesystem';
import { getIconForFile, getIconForFolder } from 'vscode-icons-js';


export class Node extends vscode.TreeItem {
  constructor(
    public readonly metadata: Metadata,
    public readonly command?: vscode.Command
  ) {
    super(
      metadata?.label || "Unknown",
      metadata?.kind === Kind.file || metadata?.kind === Kind.none ?
        vscode.TreeItemCollapsibleState.None :
        vscode.TreeItemCollapsibleState.Collapsed
    );

    this.tooltip = `${this.label}`;


    if (metadata.kind === Kind.file) {
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
    switch (this.metadata.kind) {
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
    let iconPath:string;
    switch(this.metadata.kind) {
      case Kind.file:
        iconPath = `../icons/${getIconForFile(this.metadata.label) ?? "default_file.svg"}`;
        break;

      case Kind.folder:
        iconPath = `../icons/${getIconForFolder(this.metadata.label) ?? "default_folder.svg"}`;
        break;

      default:
        iconPath = `${this.contextValue}.svg`;
        break;
    }


    this.iconPath = {
      light: buildPath(__filename, '..', '..', 'resources', 'light', iconPath),
      dark: buildPath(__filename, '..', '..', 'resources', 'dark', iconPath)
    };
  }
}
