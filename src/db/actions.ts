import { CrateSrc, DeletedFiles, FilesDirectory, Prisma, Scan } from '@prisma/client'
import { keys } from 'ramda'
import { DatabaseOperationResult, ScanConfiguration } from '../types'
import { prisma } from './prismaClient'

export const insertSection = async (
  configuration: ScanConfiguration
): Promise<DatabaseOperationResult<Scan>> => {
  try {
    const scan = await prisma.scan.create({
      data: {
        configuration: JSON.stringify(configuration)
      }
    })
    return { success: true, data: scan }
  } catch (error) {
    return { success: false, error: (error as { message: string }).message }
  }
}

async function performDatabaseOperation<T>(
  operation: () => Promise<T>
): Promise<DatabaseOperationResult<T>> {
  try {
    const result = await operation()
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, error: 'Item already exists' }
    }
    return { success: false, error: (error as { message: string }).message }
  }
}

export const createCrateSrc = (src: string) =>
  performDatabaseOperation<CrateSrc>(() =>
    prisma.crateSrc.create({ data: { path: src, type: 'SERATO' } })
  )

export const getCrateSrcs = (): Promise<DatabaseOperationResult<CrateSrc[]>> =>
  performDatabaseOperation<CrateSrc[]>(() => prisma.crateSrc.findMany())
export const createFilesDirectory = (
  path: string
): Promise<DatabaseOperationResult<FilesDirectory>> =>
  performDatabaseOperation<FilesDirectory>(() => prisma.filesDirectory.create({ data: { path } }))
export const getFilesDirectories = (): Promise<DatabaseOperationResult<FilesDirectory[]>> =>
  performDatabaseOperation<FilesDirectory[]>(() => prisma.filesDirectory.findMany())
export const removeDirectories = (
  directories: string[]
): Promise<DatabaseOperationResult<{ count: number }>> =>
  performDatabaseOperation<{ count: number }>(() =>
    prisma.filesDirectory.deleteMany({ where: { id: { in: directories } } })
  )
export const createScan = (
  configuration: Record<string, unknown>
): Promise<DatabaseOperationResult<Scan>> =>
  performDatabaseOperation<Scan>(() =>
    prisma.scan.create({ data: { configuration: JSON.stringify(configuration) } })
  )
export const getScanById = (id: string): Promise<DatabaseOperationResult<Scan | null>> =>
  performDatabaseOperation<Scan | null>(() => prisma.scan.findUnique({ where: { id } }))

export const updateScanById = async (
  id: string,
  status: string,
  results: string
): Promise<DatabaseOperationResult<Scan | null>> => {
  return performDatabaseOperation<Scan | null>(() =>
    prisma.scan.update({ where: { id }, data: { status, results } })
  )
}

export const getScansList = (): Promise<
  DatabaseOperationResult<Pick<Scan, 'id' | 'createdAt' | 'status'>[]>
> => {
  return performDatabaseOperation<Pick<Scan, 'id' | 'createdAt' | 'status'>[]>(() =>
    prisma.scan.findMany({
      select: {
        id: true,
        createdAt: true,
        status: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  )
}

export const deleteFiles = (
  scanId: string,
  success: Record<string, boolean>,
  errors: Record<string, string>
): Promise<DatabaseOperationResult<DeletedFiles>> => {
  return performDatabaseOperation<DeletedFiles>(() => {
    // TODO: change this to update
    return prisma.deletedFiles.create({
      data: {
        count: keys(success).length,
        errors: JSON.stringify(errors),
        success: JSON.stringify(success),
        scanId: scanId
        // status: 'completed'
      }
    })
  })
}
