import { join } from "https://deno.land/std@0.192.0/path/mod.ts"
import { assertEquals, assertExists } from "https://deno.land/std@0.192.0/testing/asserts.ts"

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

Deno.test("cli test", async () => {
  await withTempFolder(async (tempDirPath) => {
    const cmd = new Deno.Command("mp", {
      args: ["cli", "foo"],
    })
    await cmd.output()
    assertExists(join(tempDirPath, "foo"))
  })
})
