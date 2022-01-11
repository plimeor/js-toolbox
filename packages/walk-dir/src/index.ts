import fs from 'fs-extra'
import path from 'path'

export interface Stat {
  fileName: string
  filePath: string
  dirPath: string
  isDirectory: boolean
}

type WalkDir = (dirPath: string) => Promise<Stat[]>

type GetStats = (fileName: string, dirPath: string) => Promise<Stat[]>

export const walkDir: WalkDir = async rootPath => {
  const fileNames = await fs.readdir(rootPath)
  const stats = await Promise.all(fileNames.map(async fileName => getStats(fileName, rootPath)))
  return stats.flat()
}

const getStats: GetStats = async (fileName, dirPath) => {
  const filePath = path.resolve(dirPath, fileName)
  const isDirectory = await fs.stat(filePath).then(stat => stat.isDirectory())
  const stat: Stat = { fileName, filePath, dirPath, isDirectory }

  if (!isDirectory) {
    return [stat]
  } else {
    return [stat, ...(await walkDir(filePath))]
  }
}
