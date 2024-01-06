import fs from 'fs/promises';
import { groups } from 'config.js';

/**
 * fetchFile
 * @param {string} file
 * @returns {string}
 */
export async function fetchFile(file){
  return await fs.readFile(file, 'utf-8');
}

/**
 * fetchFiles
 * @param {Array<string>} files
 * @returns {string}
 */
export async function fetchFiles(files) {
  let output = '';

  for (const file of files) {
    const fileContent = fetchFile(file)
    output += fileContent + '\n';
  }

  return output;
}

/**
 * fetchGroup
 * @param {string} group
 * @returns {string}
 */
export async function fetchGroup(group){
  const files = groups[group];
  return fetchFiles(files);
}
