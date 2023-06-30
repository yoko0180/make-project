import { join } from "https://deno.land/std@0.192.0/path/mod.ts"
import { fetchTransform } from "https://raw.githubusercontent.com/yoko0180/deno-fetch-transform/v2/fetchTransform.ts"

import { ensureDir } from "https://deno.land/std@0.192.0/fs/ensure_dir.ts"
import { dirname } from "https://deno.land/std@0.192.0/path/mod.ts"
export const BASE_URL = "https://raw.githubusercontent.com/yoko0180/make-project/master/templates/"

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
  fetchArg: FetchArg
}
type FetchOut = {
  names: string[]
  urlRoot: string
  fetchArg: FetchArg
}

async function fetchOutSingle({ url, outfilepath, context }: FetchOutSingle) {
  const outfile = await Deno.open(outfilepath, { create: true, write: true, truncate: true })
  const w = outfile.writable
  await fetchTransform(new URL(url), w, context)
  w.close()
}

async function fetchOutSingleRootUrlBase({ urlRoot, outfilepath, fetchArg }: FetchOutSingleRootUrlBase) {
  const url = urlRoot + outfilepath
  console.log("url:", url)
  await fetchOutSingle({ url, outfilepath, context })
}

export async function fetchOut({ names, urlRoot, fetchArg }: FetchOut) {
  const p = []
  const { cwd, context } = fetchArg
  for (const outfilename of names) {
    const outfilepath = join(cwd, outfilename)
    console.log("outfilepath:", outfilepath)
    const d = dirname(outfilepath)
    await ensureDir(d)
    // p.push(fetchOutSingleRootUrlBase({ urlRoot, outfilepath, fetchArg }))
    const url = urlRoot + outfilename
    p.push(fetchOutSingle({ url, outfilepath, context }))
  }
  return await Promise.all(p)
}
