import { vscodeLog as Log} from '../utils/logger';
import { Metadata, Kind, IGitHub } from "./types";
import httpClient  from "../utils/httpClient";
import { factory } from './factory';

export class Branches implements IGitHub {
  public readonly type: Kind = Kind.branch;
  private readonly childrenType: Kind = Kind.content;
  
  async fetchChildren(element:Metadata): Promise<Metadata[]> {   
    let next = factory(this.childrenType);
    let children:Metadata[] | undefined = await next.fetch(element);

    return children;
  }
  
  buildUrl(obj:Metadata, page:number=1): string {
    return `https://api.github.com/repos/${obj.owner}/${obj.repository}/branches?per_page=100&page=${page}`;
  }

  async fetch(element: string | Metadata): Promise<Metadata[]> {
    if (typeof element === "string") {
      return [];
    }

    let data:any[]=[];
    let response:any;
    try{
      let i:number=1;
      let response:any;
      do {
        response = await httpClient.get(this.buildUrl(element, i++));
        data.push(...response.data);
      }
      while (response.data.length > 0);
    }
    catch(e) {
      Log.error(e.message);
      return Promise.resolve([]);
    }

    if (data.length>0){
      let branches:Metadata[] = data.map((o:any) =>{
        return {
          label: o.name,
          owner: element.owner,   
          repository: element.repository, 
          branch: o.name,
          kind: Kind.branch,
          relativePath: `${element.relativePath}/${o.name}`
        }; 
      });

      return branches;
    }

    return [];
  }
}