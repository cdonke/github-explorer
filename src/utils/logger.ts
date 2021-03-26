import { window } from 'vscode'

export interface ILogger {
  Error(message:string):void;
  Info(message:string):void;
}

class VSCodeLog implements ILogger {
  Error(message:string){
    window.showErrorMessage(message);
  }

  Info(message:string){  
    window.showInformationMessage(message);
  }
}

class ConsoleLog implements ILogger {
  Error(message:string){
    console.error(message);
  }

  Info(message:string){  
    console.info(message);
  }
}

export let vscodeLog = new VSCodeLog();
export let consoleLog = new ConsoleLog();