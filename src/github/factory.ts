import { Kind, IGitHub } from "./types";

import { Repository } from "./repositories";
import { Branches } from "./branches";
import { Contents } from "./contents";

export function factory(type:Kind): IGitHub{
  switch(type){
    case Kind.repository:
      return new Repository();

    case Kind.branch:
      return new Branches();

    case Kind.content:
    case Kind.file:
    case Kind.folder:
      return new Contents();
  }

  throw new Error(`${type} not found`);  
}