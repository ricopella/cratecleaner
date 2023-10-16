import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { CrateFile } from '../../types'
import { getSubcrate, getSubcratesFolder } from './utils'

const PLATFORM_DEFAULT_SERATO_FOLDER: string = path.join(os.homedir(), 'Music', '_Serato_')

export const listCrateFiles = async (
  seratoFolders: string[] = [PLATFORM_DEFAULT_SERATO_FOLDER]
): Promise<{ crates: CrateFile[]; errorMessages: string[] }> => {
  const crates: CrateFile[] = []
  const errorMessages: string[] = []

  for (const seratoFolder of seratoFolders) {
    const subcratesFolder = getSubcratesFolder(seratoFolder)
    try {
      const files = fs.readdirSync(subcratesFolder)
      for (const file of files) {
        if (file.endsWith('.crate')) {
          const filepath = path.join(subcratesFolder, file)
          try {
            const subcrate = getSubcrate(filepath) // Assuming getSubcrate is synchronous
            crates.push({ filepath, subcrate })
          } catch (error) {
            const { message } = error as { message: string } & Error

            errorMessages.push(`Error reading crate file ${filepath}: ${message}`)
          }
        }
      }
    } catch (error) {
      const { message } = error as { message: string } & Error

      errorMessages.push(`Error reading directory ${subcratesFolder}: ${message}`)
    }
  }

  return { crates, errorMessages }
}
