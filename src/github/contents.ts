import { vscodeLog as Log} from '../utils/logger';
import { Metadata, Kind, IGitHub } from "./types";
import httpClient  from "../utils/httpClient";

export class Contents implements IGitHub{
  public readonly type: Kind= Kind.content;
  private readonly childrenType: Kind = Kind.none;
  
  buildUrl(obj:Metadata): string{
    let url = `https://api.github.com/repos/${obj.owner}/${obj.repository}/contents${obj.url ? `${obj.url}`:""}?ref=${obj.branch}`;
    return url;
  }

  fetchChildren(element: Metadata): Promise<Metadata[]> {
    return this.fetch(element);
  }

  async fetch(element: string | Metadata): Promise<Metadata[]> {
    if (typeof element === "string") {
      return [];
    }

    let data:any[]=[];
    try{
      let response:any = await httpClient.get(this.buildUrl(element));
      if (response.data.length > 0) {
        data.push(...response.data);
      }
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
          branch: element.branch,
          type: o.type === "file" ? Kind.file : Kind.folder,
          url: o.type === "file" ? o.download_url : `${element.url ?? ""}/${o.name}`,
          relativePath:  o.type === "file" ? element.relativePath : `${element.relativePath}/${o.name}`
        }; 
      });

      return branches;
    }

    return [];
  }
}