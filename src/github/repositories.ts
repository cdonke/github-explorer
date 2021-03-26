import { vscodeLog as Log} from '../utils/logger'
import { Metadata, Kind, IGitHub } from "./types";
import httpClient  from "../utils/httpClient"
import { URL } from "url";
import { Factory } from './factory';


export class Repository implements IGitHub {
  private readonly childrenType: Kind = Kind.Branch;
  public readonly type: Kind = Kind.Repository;
    
  transformUrl(repoUrl:string): string {
    let url = new URL(repoUrl.replace('.git',''));
    return `https://api.github.com/repos${url.pathname}`
  }

  
  async FetchChildren(element:Metadata):Promise<Metadata[]> {
    if (!element)
      return [];
    
    let next = Factory(this.childrenType);
    let children:Metadata[] = await next.Fetch(element);

    return children;
  }

  async Fetch(element: Metadata | string): Promise<Metadata[]> {
    if (typeof element !== "string")
      return [];


    let repoData:any;
    try{
      repoData = await httpClient.get(this.transformUrl(element as string));
    }
    catch(e) {
      Log.Error(e.message);
      return [];
    }
  
    return [{
      label: repoData.data.name,
      owner: repoData.data.owner.login,
      repository: repoData.data.name,
      branch: repoData.data.default_branch,
      type: Kind.Repository,
      relativePath: `${repoData.data.owner.login}/${repoData.data.name}`
    }];
  }
}