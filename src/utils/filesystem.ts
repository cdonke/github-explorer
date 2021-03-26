import * as fs from 'fs';
import * as path from 'path';
import { consoleLog } from './logger';

export const CreateFolder = async(targetPath:string):Promise<void> => {
  if (!await fs.existsSync(targetPath)) {
    consoleLog.Info(`Creating folder ${targetPath}`);
    await fs.mkdir(targetPath, { recursive: true }, (e)=> {
      if (e) {
        consoleLog.Error(e.message);
        throw e;
      }
    });
  }
}

export const WriteFile = async (targetFile:string, data:any, resolve:(args:any[])=>{}) : Promise<void> => {
  const writer = fs.createWriteStream(targetFile);
  data.pipe(writer);

  return new Promise((innerResolve, reject) => {
    writer.on('finish', (_) => { resolve(_); innerResolve(_) });
    writer.on('error', () => {
      consoleLog.Error(`Failed to open file ${targetFile}.`)
      reject();
    })
  })
}

export const Delete = async (target:string, recursive:boolean = false): Promise<void> => {
  await fs.rmdir(target, { recursive: recursive}, (e) => {
    if (e) {
      consoleLog.Error(e.message);
      throw e;
    }
  });
}

export const FileExists = (target:string): boolean => {
  return fs.existsSync(target);
}

export const BuildPath = (...parts: string[]): string => {
  return path.join(...parts);
}