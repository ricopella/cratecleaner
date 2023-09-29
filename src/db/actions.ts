import { CrateSrc, FilesDirectory } from '@prisma/client'
import { DatabaseOperationResult } from '@src/types'
import { prisma } from './prismaClient'

export const createCrateSrc = async (src: string): Promise<DatabaseOperationResult<CrateSrc>> => {
  try {
    const crate = await prisma.crateSrc.create({ data: { path: src, type: 'SERATO' } })
    return { success: true, data: crate }
  } catch (error) {
    return { success: false, error: (error as { message: string }).message }
  }
}

export const getCrateSrcs = async (): Promise<DatabaseOperationResult<CrateSrc[]>> => {
  try {
    const crates = await prisma.crateSrc.findMany()
    return { success: true, data: crates }
  } catch (error) {
    return { success: false, error: (error as { message: string }).message }
  }
}

export const createFilesDirectory = async (
  path: string
): Promise<DatabaseOperationResult<FilesDirectory>> => {
  try {
    const directory = await prisma.filesDirectory.create({ data: { path } })
    console.log({ directory })
    return { success: true, data: directory }
  } catch (error) {
    console.error({ error })
    return { success: false, error: (error as { message: string }).message }
  }
}

export const getFilesDirectories = async (): Promise<DatabaseOperationResult<FilesDirectory[]>> => {
  try {
    const directories = await prisma.filesDirectory.findMany()
    return { success: true, data: directories }
  } catch (error) {
    return { success: false, error: (error as { message: string }).message }
  }
}
