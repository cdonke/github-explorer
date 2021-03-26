// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { GitHubProvider } from './GitHubProvider'
import { Delete } from './utils/filesystem'
import { Statics } from './utils/statics'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-github-tree" is now active!');

	const githubContentsProvider = new GitHubProvider(context);
	vscode.window.registerTreeDataProvider("github-explorer-view", githubContentsProvider);
	vscode.commands.registerCommand('github-explorer-view.addRepository', () => githubContentsProvider.addRepository());
	vscode.commands.registerCommand('github-explorer-view.removeRepository', (e) => githubContentsProvider.removeRepository(e));
	vscode.commands.registerCommand('github-explorer-view.openDocument', (e) => githubContentsProvider.openDocument(e));
	vscode.commands.registerCommand('github-explorer-view.refreshRepository', (e) => githubContentsProvider.refreshContent(e));
}

// this method is called when your extension is deactivated
export async function deactivate() {
	await Delete(Statics.TEMPFOLDER, true)
}
