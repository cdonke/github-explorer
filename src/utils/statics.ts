import * as path from 'path';
import * as os from 'os';

export class Statics {
  /* eslint-disable @typescript-eslint/naming-convention */
  public static readonly TEMPFOLDER:string = path.join(os.tmpdir(), 'gh-ex');
    
  public static readonly STORAGE_KEY:string = "github-explorer-repositories";

  public static readonly CONFIGURATION_KEY = "vscode-github-explorer";
  public static readonly CONFIGURATION_USERNAME = "gitHubExplorer.authentication.username";
  public static readonly CONFIGURATION_PASSWORD = "gitHubExplorer.authentication.personalAccessToken";
  /* eslint-enable @typescript-eslint/naming-convention */
}