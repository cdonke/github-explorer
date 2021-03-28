export enum Kind {
  repository,
  folder,
  file,
  branch,
  content,
  none
}

export type Metadata = {
  kind: Kind;
  label: string,
  owner: string,
  repository?: string;
  branch?: string;
  url?: string
  relativePath: string
};

export interface IGitHub {
  type: Kind,

  fetchChildren(element:Metadata):Promise<Metadata[]>,
  fetch(element:Metadata | string): Promise<Metadata[]>;
}