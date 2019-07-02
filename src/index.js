import { promisify } from 'util'
import cpy from 'cpy'
import isObject from 'lodash.isobject'
import chalk from 'chalk'
import mkdirpCb from 'mkdirp'
import { name } from '../package.json'

const mkdirp = promisify(mkdirpCb)

function successMessage(files, dest) {
  console.log(`${chalk.green('Successfully copied')} ${files}  ->  ${dest}`)
}

function errorMessage(files, dest, err) {
  console.log(`${chalk.red('Error copying')} ${files}  ->  ${dest}
${err}
`)
}

async function copyFiles(params) {
  const { files, dest, options } = params
  if (options && !isObject(options)) {
    throw new Error('options param (3rd param after files and dest) should be an object.')
  }

  const { verbose = false, ...restOptions } = options || {}

  await mkdirp(dest)

  try {
    await cpy(files, dest, restOptions)
  } catch (err) {
    throw new Error(errorMessage(files, dest, err))
  }

  if (verbose) {
    successMessage(files, dest)
  }
}

export default function(options) {
  return {
    name,
    async writeBundle() {
      if (Array.isArray(options)) {
        for (const option of options) {
          await copyFiles(option)
        }
      } else {
        await copyFiles(options)
      }
    },
  }
}
