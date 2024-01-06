import fs from 'fs/promises';
import { groups } from './config.mjs';

/**
 * fetchFile
 * @param {string} file
 * @returns {Promise<string>}
 */
export async function fetchFile(file) {
  return fs.readFile(file, 'utf-8');
}

/**
 * fetchFiles
 * @param {Array<string>} files
 * @returns {Promise<string>}
 */
export async function fetchFiles(files) {
  let output = '';

  for (const file of files) {
    const fileContent = await fetchFile(file);
    output += `${fileContent}\n`;
  }

  return output;
}

/**
 * fetchGroup
 * @param {string} group
 * @returns {Promise<string>}
 */
export async function fetchGroup(group) {
  if (groups[group]) {
    const files = groups[group];
    return fetchFiles(files);
  } else {
    throw 'group \'' + group + '\' not found';
  }
}
