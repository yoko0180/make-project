import { fetchTransform } from "https://raw.githubusercontent.com/yoko0180/deno-fetch-transform/master/fetchTransform.ts"

export const BASE_URL = "https://github.com/yoko0180/make-project/raw/master/templates/"

export type Context = Record<string, unknown>
type FetchOutSingle = {
  url: string
  outfilename: string
  context: Context
}
type FetchOutSingleRootUrlBase = {
  urlRoot: string
  outfilename: string
  context: Context
}
type FetchOut = {
  names: string[]
  urlRoot: string
  context: Context
}

async function fetchOutSingle({ url, outfilename, context }: FetchOutSingle) {
  const outfile = await Deno.open(outfilename, { create: true, write: true, truncate: true })
  const w = outfile.writable
  await fetchTransform(url, w, context)
  w.close()
}

async function fetchOutSingleRootUrlBase({ urlRoot, outfilename, context }: FetchOutSingleRootUrlBase) {
  const url = urlRoot + outfilename
  await fetchOutSingle({url, outfilename, context})
}

export async function fetchOut({ names, urlRoot, context }: FetchOut) {
  const p = []
  for (const outfilename of names) {
    p.push(fetchOutSingleRootUrlBase({ urlRoot, outfilename, context }))
  }
  return await Promise.all(p)
}
