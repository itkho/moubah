const process = require('process');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const { pipeline } = require('stream/promises');
const fetch = require('node-fetch');
const extractZip = require('extract-zip');
const glob = require("glob");
const isWsl = require('is-wsl');

let winOrMac = null
let macSuffix = ''
if (process.platform === 'win32') {
  winOrMac = 'win'
} else if (process.platform === 'darwin') {
  winOrMac = 'mac'
  macSuffix = '_sierra'
} else if (process.platform === 'linux' && isWsl) {
  winOrMac = 'win'
}

async function downloadFile(url, filePath) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Reponse error: ${response.statusText}`)
  }
  await pipeline(response.body, fs.createWriteStream(filePath))
}

async function fileExists(filePath) {
  try {
    await fsPromises.access(filePath, fs.constants.R_OK)
    return true
  } catch (err) {
    return false
  }
}

async function moveDirChildrenUpAndDeleteDir(dirName) {
  const parentDirName = path.resolve(path.join(dirName, '..'))
  const fileNames = await fsPromises.readdir(dirName)
  for (const fileName of fileNames) {
    const srcPath = path.join(dirName, fileName)
    const destPath = path.join(parentDirName, fileName)
    console.log(`Moving: "${srcPath}" to "${destPath}"`)
    if (await fileExists(destPath)) {
      console.log(`Deleting: "${destPath}"`)
      await fsPromises.rm(destPath, {
        force: true,
        recursive: true,
      })
      console.log(`Delete succeeded: "${destPath}"`)
    }
    await fsPromises.rename(srcPath, destPath)
    console.log(`Move succeeded: "${srcPath}" to "${destPath}"`)
  }

  console.log(`Deleting: "${dirName}"`)
  await fsPromises.rm(dirName, {
    force: true,
    recursive: true,
  })
  console.log(`Delete succeeded: "${dirName}"`)
}

async function main() {
  const downloads = []

  if (winOrMac === 'win') {
    downloads.push([
      'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip',
      "ffmpeg-release-essentials.zip"
    ])
  } else if (winOrMac === 'mac') {
    downloads.push(
      [
        'https://evermeet.cx/ffmpeg/getrelease/zip',
        path.join("resources", winOrMac, 'ffmpeg', 'ffmpeg-release.zip'),
      ],
      [
        'https://evermeet.cx/ffmpeg/getrelease/ffprobe/zip',
        path.join("resources", winOrMac, 'ffmpeg', 'ffprobe-release.zip'),
      ]
    )
  }

  console.log({ downloads });
  for (const download of downloads) {
    console.log(await fileExists(download[1]));
    if (!(await fileExists(download[1]))) {
      console.log(`Downloading: "${download[0]}"`)
      await downloadFile(download[0], download[1])
      console.log(`Download successful! Saved "${download[0]}" to "${download[1]}"`)
    }
  }

  for (const download of downloads) {
    if (path.extname(download[1]) === '.zip') {
      console.log(`Extracting: "${download[1]}"`)
      const dirName = path.dirname(download[1])
      await extractZip(download[1], { dir: path.resolve(dirName) })
      console.log(`Extraction successful! Extracted "${download[1]}" to "${dirName}"`)
      console.log(`Delete succeeded: "${download[1]}"`)
    }
  }

  if (winOrMac === 'win') {
    console.log('Moving: ffmpeg and ffprobe')
    glob("ffmpeg*/bin/ff[mp][pr]*.exe", (er, files) => {
      files.forEach(async file => {
        await fsPromises.rename(
          path.join(file),
          path.join('third_party', winOrMac, 'ffmpeg', path.basename(file))
        )
      })
    })
    glob("ffmpeg*", (err, files) => {
      files.forEach(file => {
        fsPromises.rm(file, {
          force: true,
          recursive: true,
        })
      })
    })
    console.log('Move successful: ffmpeg and ffprobe')
  }
}

main()
