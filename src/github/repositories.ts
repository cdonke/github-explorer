import { vscodeLog as Log} from '../utils/logger';
import { Metadata, Kind, IGitHub } from "./types";
import httpClient  from "../utils/httpClient";
import { URL } from "url";
import { factory } from './factory';


export class Repository implements IGitHub {
  private readonly childrenType: Kind = Kind.branch;
  public readonly type: Kind = Kind.repository;
    
  isValidHttpUrl(repoUrl:string) {
    let url;
    
    try {
      url = new URL(repoUrl);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }

  transformUrl(repoUrl:string): string {
    if (!this.isValidHttpUrl(repoUrl)) {
      return `https://api.github.com/repos/${repoUrl}`;
    } else {
      let url = new URL(repoUrl.replace('.git',''));
      return `https://api.github.com/repos${url.pathname}`;
    }
  }

  
  async fetchChildren(element:Metadata):Promise<Metadata[]> {
    if (!element) {
      return [];
    }
    
    let next = factory(this.childrenType);
    let children:Metadata[] = await next.fetch(element);

    return children;
  }

  async fetch(element: Metadata | string): Promise<Metadata[]> {
    if (typeof element !== "string") {
      return [];
    }


    let repoData:any;
    try{
      repoData = await httpClient.get(this.transformUrl(element as string));
    }
    catch(e) {
      Log.error(e.message);
      return [];
    }
  
    return [{
      label: `${repoData.data.owner.login}/${repoData.data.name}`,
      owner: repoData.data.owner.login,
      repository: repoData.data.name,
      branch: repoData.data.default_branch,
      kind: Kind.repository,
      relativePath: `${repoData.data.owner.login}/${repoData.data.name}`
    }];
  }
}