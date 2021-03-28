import * as vscode from 'vscode';

import { LocalStorageService } from './utils/LocalStorageService';
import httpClient  from './utils/httpClient';
import { Statics } from './utils/statics';
import { createFolder, writeFile, buildPath } from './utils/filesystem';

import { Kind, Metadata } from './github/types';
import { factory } from './github/factory';
import { Node } from './Node';

export class GitHubProvider implements vscode.TreeDataProvider<Node> {
	private _onDidChangeTreeData: vscode.EventEmitter<Node | undefined | void> = new vscode.EventEmitter<Node | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Node | undefined | void> = this._onDidChangeTreeData.event;
  
  private storage:LocalStorageService;
  private repositories: Node[];

	constructor(context: vscode.ExtensionContext) {
    this.storage = new LocalStorageService(context.workspaceState);
    this.repositories = this.storage.getValue(Statics.STORAGE_KEY) || [];
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Node): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Node): Thenable<Node[]> {
    return new Promise(resolve => {
      if (element?.metadata){

          factory(element.metadata.kind)
            .fetchChildren(element.metadata)
            .then((metadata:Metadata[]) => 
              resolve( metadata.map( (obj) => new Node(obj)) )
            );

      }
      else {
        resolve(this.repositories);
      }
    });
  }

  async addRepository(): Promise<void> {
    const repositoryUrl = await vscode.window.showInputBox({
      prompt: "Please enter the GitHub URL or Git Clone address"
    });
    if (repositoryUrl) { 
      let repositoryData = await factory(Kind.repository).fetch(repositoryUrl);

      if (repositoryData) {
        this.repositories.push(new Node(repositoryData[0]));
        this.storage.setValue(Statics.STORAGE_KEY, this.repositories);
        this.refresh();
      }
    }
  }

  removeRepository(element: Node): void {  
      const index = this.repositories.indexOf(element);
      this.repositories.splice(index, 1);
      this.storage.setValue(Statics.STORAGE_KEY, this.repositories);

      this.refresh();
  }

  async openDocument(element: Metadata): Promise<void> {
    if (!element.url) {
      return Promise.resolve();
    }

    const tmpPath = buildPath(Statics.TEMPFOLDER, element.relativePath);
    const targetFile = buildPath(tmpPath, element.label);
    
    await createFolder(tmpPath); 

    var response = await httpClient.downloadFile(element.url, { responseType: 'stream' });
    writeFile(targetFile, response.data, async () =>{
      let uri = vscode.Uri.file(targetFile);
      await vscode.commands.executeCommand('vscode.open', uri);
    });    
  }

  refreshContent(element: Node): void {
    this._onDidChangeTreeData.fire(element);
  }
}