import { window } from 'vscode';

export interface ILogger {
  error(message:string):void;
  info(message:string):void;
};

class VSCodeLog implements ILogger {
  error(message:string){
    window.showErrorMessage(message);
  }

  info(message:string){  
    window.showInformationMessage(message);
  }
}

class ConsoleLog implements ILogger {
  error(message:string){
    console.error(message);
  }

  info(message:string){  
    console.info(message);
  }
}

export let vscodeLog = new VSCodeLog();
export let consoleLog = new ConsoleLog();