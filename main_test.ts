import { walk } from "https://deno.land/std@0.192.0/fs/walk.ts"
import { join } from "https://deno.land/std@0.192.0/path/mod.ts"
import { assert, assertStringIncludes } from "https://deno.land/std@0.192.0/testing/asserts.ts"

type TempFolderCallback = (tempFolderPath: string) => Promise<void>

async function withTempFolder(callback: TempFolderCallback) {
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

const assertDirExists = async (path: string) => assert(await dirExists(path), "ディレクトリパスが存在しません:" + path)
const assertFileExists = async (path: string) => assert(await fileExists(path), "ファイルパスが存在しません:" + path)

Deno.test("withTempFolder test", async () => {
  await withTempFolder(async (tempDirPath) => {
    await assertDirExists(tempDirPath)
  })
})

Deno.test("cli test", async () => {
  await withTempFolder(async (tempDirPath) => {
    const cmd = new Deno.Command(Deno.execPath(), {
      args: ["run", "-A", "main.ts", "cli", "foo", "--no-vscode", "--cwd", tempDirPath],
    })
    await cmd.output()

    for await (const entry of walk(tempDirPath)) {
      console.log(entry.path)
    }
    await assertDirExists(join(tempDirPath, "foo"))
    const fileMainTs = join(tempDirPath, "foo", "main.ts")
    await assertFileExists(fileMainTs)
    const ctx = await Deno.readTextFile(fileMainTs)
    assertStringIncludes(ctx, 'name("foo')
  })
})
