// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { workspace, WorkspaceConfiguration } from 'vscode';
import axios, { AxiosInstance } from 'axios';
import { consoleLog as Log, vscodeLog as UserLog } from './logger';
import { Statics } from './statics';

type Authentication = {
  username?: string,
  password?: string
};

class HttpClient {
  readonly _configuration:WorkspaceConfiguration = workspace.getConfiguration();
  readonly _httpClient:AxiosInstance = axios.create();
  readonly auth:Authentication;

  constructor() {
    this.auth = {
      username: this._configuration.get(Statics.CONFIGURATION_USERNAME),
      password:  this._configuration.get(Statics.CONFIGURATION_PASSWORD),
    };
  }

  async get(url:string, config?:any): Promise<any>{
    Log.info(`Sending GET request to ${url}`);

    try {
      return await this._httpClient.get(url, {...config, auth: this.auth});
    }
    catch(e){
      UserLog.error(e.response.data.message); 
    }
  }

  async downloadFile(url:string, config?:any){
    return this._httpClient.get(url, {...config, auth: this.auth});
  };

}

export default new HttpClient();