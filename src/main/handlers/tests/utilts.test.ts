import { CrateFile } from '../../../types'
import { findCratesForFilePath } from '../utils'

describe('findCratesForFilePath', () => {
  it('should return an array of crate names for a given file path', () => {
    const crates: CrateFile[] = [
      {
        filepath: '/path/to/file1',
        subcrate: {
          name: 'Crate1',
          songs: [
            { name: 'Song1', path: '/path/to/file1' },
            { name: 'Song2', path: '/path/to/file2' }
          ]
        }
      },
      {
        filepath: '/path/to/file2',
        subcrate: {
          name: 'Crate2',
          songs: [
            { name: 'Song3', path: '/path/to/file3' },
            { name: 'Song4', path: '/path/to/file2' }
          ]
        }
      }
    ]

    const targetPath: string = '/path/to/file2'
    const result: string[] = findCratesForFilePath(crates, targetPath)

    expect(result).toEqual(['Crate1', 'Crate2']) // Assert that the function returns the correct crate names
  })

  it('should return an empty array if the file path is not found in any crates', () => {
    const crates: CrateFile[] = [
      {
        filepath: '/path/to/file1',
        subcrate: {
          name: 'Crate1',
          songs: [{ name: 'Song1', path: '/path/to/file1' }]
        }
      },
      {
        filepath: '/path/to/file2',
        subcrate: {
          name: 'Crate2',
          songs: [{ name: 'Song2', path: '/path/to/file2' }]
        }
      }
    ]

    const targetPath: string = '/path/to/nonexistentfile'
    const result: string[] = findCratesForFilePath(crates, targetPath)

    expect(result).toEqual([]) // Assert that the function returns an empty array for non-existing file path
  })
})
