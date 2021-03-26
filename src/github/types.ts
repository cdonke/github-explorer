export enum Kind {
  Repository,
  Folder,
  File,
  Branch,
  Content,
  None
}

export type Metadata = {
  type: Kind;
  label: string,
  owner: string,
  repository?: string;
  branch?: string;
  url?: string
  relativePath: string
}

export interface IGitHub {
  type: Kind,

  FetchChildren(element:Metadata):Promise<Metadata[]>,
  Fetch(element:Metadata | string): Promise<Metadata[]>;
}