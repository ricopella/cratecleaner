import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import util from 'node:util'
import { SeratoFolders } from '../../types'
import { getSubcratesFolder, parse, sanitizeFilename } from './utils'

class Crate {
  private name: string
  private filename: string
  private seratoFolder: string

  constructor(name: string, seratoFolder: string) {
    this.name = sanitizeFilename(name)
    this.filename = this.name + '.crate'
    this.seratoFolder = seratoFolder
  }

  private _buildCrateFilepath(seratoFolder: string): string {
    const subcrateFolder = getSubcratesFolder(seratoFolder)
    const filepath = path.join(subcrateFolder, this.filename)
    return filepath
  }

  async getSongPaths(): Promise<string[]> {
    const filepath = this._buildCrateFilepath(this.seratoFolder || PLATFORM_DEFAULT_SERATO_FOLDER)
    const contents = await util.promisify(fs.readFile)(filepath, 'ascii')
    return parse(contents)
  }
}

const PLATFORM_DEFAULT_SERATO_FOLDER: string = path.join(os.homedir(), 'Music', '_Serato_')

// might not need
export async function listCrates(
  seratoFolders: SeratoFolders = { default: PLATFORM_DEFAULT_SERATO_FOLDER }
): Promise<Crate[]> {
  const allCrates: Crate[] = []

  for (const seratoFolder of Object.values(seratoFolders)) {
    const subcratesFolder = getSubcratesFolder(seratoFolder)
    const crateFiles = (await util.promisify(fs.readdir)(subcratesFolder)).filter((file: string) =>
      file.endsWith('.crate')
    )

    const crates = await Promise.all(
      crateFiles.map(async (file: string) => {
        const name = path.basename(file, '.crate')
        return new Crate(name, seratoFolder)
      })
    )
    allCrates.push(...crates)
  }

  return allCrates
}
