import * as fs from 'fs';
import * as path from 'path';
import { consoleLog } from './logger';

export const createFolder = async(targetPath:string):Promise<void> => {
  if (!await fs.existsSync(targetPath)) {
    consoleLog.info(`Creating folder ${targetPath}`);
    await fs.mkdir(targetPath, { recursive: true }, (e)=> {
      if (e) {
        consoleLog.error(e.message);
        throw e;
      }
    });
  }
};

export const writeFile = async (targetFile:string, data:any, resolve:(args:any[])=>{}) : Promise<void> => {
  const writer = fs.createWriteStream(targetFile);
  data.pipe(writer);

  return new Promise((innerResolve, reject) => {
    writer.on('finish', (_) => { resolve(_); innerResolve(_); });
    writer.on('error', () => {
      consoleLog.error(`Failed to open file ${targetFile}.`);
      reject();
    });
  });
};

export const deleteFolder = async (target:string, recursive:boolean = false): Promise<void> => {
  await fs.rmdir(target, { recursive: recursive}, (e) => {
    if (e) {
      consoleLog.error(e.message);
      throw e;
    }
  });
};

export const fileExists = (target:string): boolean => {
  return fs.existsSync(target);
};

export const buildPath = (...parts: string[]): string => {
  return path.join(...parts);
};