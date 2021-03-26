import { Kind, IGitHub } from "./types"

import { Repository } from "./repositories"
import { Branches } from "./branches";
import { Contents } from "./contents";

export function Factory(type:Kind): IGitHub{
  switch(type){
    case Kind.Repository:
      return new Repository();

    case Kind.Branch:
      return new Branches();

    case Kind.Content:
    case Kind.File:
    case Kind.Folder:
      return new Contents();
  }

  throw new Error(`${type} not found`);  
}