import { CrateSrc, FilesDirectory, Prisma, Scan } from '@prisma/client'
import { DatabaseOperationResult, ScanConfiguration } from '@src/types'
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
