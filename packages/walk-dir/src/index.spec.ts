import test from 'ava'
import * as fs from 'fs-extra'
import path from 'path'
import { walkDir, Stat } from './index'

const fixturePath = path.join(__dirname, './fixtures')

const fixtures: Stat[] = [
  { fileName: 'a', filePath: 'a', dirPath: '', isDirectory: true },
  { fileName: 'c', filePath: 'a/c', dirPath: 'a', isDirectory: true },
  { fileName: '.gitkeep', filePath: 'a/c/.gitkeep', dirPath: 'a/c', isDirectory: false },
  { fileName: 'd.json', filePath: 'a/d.json', dirPath: 'a', isDirectory: false },
  { fileName: 'b.json', filePath: 'b.json', dirPath: '', isDirectory: false },
]

async function createFixture(info: Stat) {
  const filePath = path.resolve(fixturePath, info.filePath)
  const dirPath = path.resolve(fixturePath, info.dirPath)

  if (info.isDirectory) {
    await fs.mkdir(filePath, { recursive: true })
  } else {
    if (!fs.existsSync(dirPath)) {
      await fs.mkdir(dirPath, { recursive: true })
    }

    await fs.writeFile(filePath, '{}')
  }
}

test.before(async () => {
  await Promise.all(fixtures.map(createFixture))
})

test.after.always(async () => {
  await fs.remove(fixturePath).catch(console.error)
})

test('walk', async t => {
  const originalFileInfos = await walkDir(fixturePath)
  const fileInfo = originalFileInfos.map(info => ({
    ...info,
    filePath: path.relative(fixturePath, info.filePath),
    dirPath: path.relative(fixturePath, info.dirPath),
  }))
  t.deepEqual(fileInfo, fixtures)
})
