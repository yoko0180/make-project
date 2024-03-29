import { join } from "https://deno.land/std@0.192.0/path/mod.ts"
import { assert, assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts"

type TempFolderCallback = (tempFolderPath: string) => Promise<void>

export async function withTempFolder(callback: TempFolderCallback) {
  // 一時フォルダのパスを生成
  const tempFolderPath = await Deno.makeTempDir()
  try {
    // コールバック関数に一時フォルダのパスを渡して処理を行う
    await callback(tempFolderPath)
  } finally {
    // 処理が終了したら確実に一時フォルダを削除
    await Deno.remove(tempFolderPath, { recursive: true })
  }
}

async function pathExists(path: string): Promise<Deno.FileInfo | undefined> {
  return await Deno.stat(path).catch(() => undefined)
}
async function dirExists(path: string): Promise<boolean> {
  const stat = await pathExists(path)
  if (!stat) return false
  return stat.isDirectory
}
async function fileExists(path: string): Promise<boolean> {
  const stat = await pathExists(path)
  if (!stat) return false
  return stat.isFile
}

export const assertDirExists = async (path: string) => assert(await dirExists(path), "ディレクトリパスが存在しません:" + path)
export const assertFileExists = async (path: string) => assert(await fileExists(path), "ファイルパスが存在しません:" + path)


Deno.test("url test", () => {
  const BASE_URL = "https://raw.githubusercontent.com/yoko0180/make-project/master/templates/"
  assertEquals(new URL(join("a", "main.ts"), BASE_URL).toString(), BASE_URL + "a/main.ts")
})
Deno.test("url2 test", () => {
  assertEquals(new URL("https://github\\main.ts").toString(), "https://github/main.ts")
})
Deno.test("withTempFolder test", async () => {
  await withTempFolder(async (tempDirPath) => {
    await assertDirExists(tempDirPath)
  })
})
