import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { CrateFile } from '../../types'
import { getSubcrate, getSubcratesFolder } from './utils'

const PLATFORM_DEFAULT_SERATO_FOLDER: string = path.join(os.homedir(), 'Music', '_Serato_')

export const listCrateFiles = (
  seratoFolders: string[] = [PLATFORM_DEFAULT_SERATO_FOLDER]
): CrateFile[] => {
  const crateFiles: CrateFile[] = []

  for (const seratoFolder of seratoFolders) {
    const subcratesFolder = getSubcratesFolder(seratoFolder)
    const files = fs.readdirSync(subcratesFolder).filter((file) => file.endsWith('.crate'))

    for (const file of files) {
      const filepath = path.join(subcratesFolder, file)
      const subcrate = getSubcrate(filepath)
      crateFiles.push({ filepath, subcrate })
    }
  }

  return crateFiles
}
