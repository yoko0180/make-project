import { join } from "https://deno.land/std@0.192.0/path/mod.ts"
import { fetchTransform } from "https://raw.githubusercontent.com/yoko0180/deno-fetch-transform/master/fetchTransform.ts"

import { ensureDir } from "https://deno.land/std@0.192.0/fs/ensure_dir.ts"
import { dirname } from "https://deno.land/std@0.192.0/path/mod.ts"
export const BASE_URL = "https://github.com/yoko0180/make-project/raw/master/templates/"

export type Context = Record<string, unknown> & {
  name: string
}

export type FetchArg = {
  cwd: string
  context: Context
}

type FetchOutSingle = {
  url: string
  outfilepath: string
  context: Context
}
type FetchOutSingleRootUrlBase = {
  urlRoot: string
  outfilepath: string
  context: Context
}
type FetchOut = {
  names: string[]
  urlRoot: string
  fetchArg: FetchArg
}

async function fetchOutSingle({ url, outfilepath, context }: FetchOutSingle) {
  const outfile = await Deno.open(outfilepath, { create: true, write: true, truncate: true })
  const w = outfile.writable
  await fetchTransform(url, w, context)
  w.close()
}

async function fetchOutSingleRootUrlBase({ urlRoot, outfilepath, context }: FetchOutSingleRootUrlBase) {
  const url = urlRoot + outfilepath
  await fetchOutSingle({ url, outfilepath, context })
}

export async function fetchOut({ names, urlRoot, fetchArg }: FetchOut) {
  const p = []
  const { cwd, context } = fetchArg
  for (const outfilename of names) {
    const outfilepath = join(cwd, outfilename)
    const d = dirname(outfilepath)
    await ensureDir(d)
    p.push(fetchOutSingleRootUrlBase({ urlRoot, outfilepath, context }))
  }
  return await Promise.all(p)
}
