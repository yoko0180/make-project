import { WalkEntry, walk } from "https://deno.land/std@0.192.0/fs/walk.ts"
import { join } from "https://deno.land/std@0.192.0/path/mod.ts"
import {
  assertArrayIncludes,
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.192.0/testing/asserts.ts"
import { withTempFolder, assertDirExists, assertFileExists } from "./sub_test.ts"

async function toArray(it: AsyncIterableIterator<WalkEntry>) {
  const arr = []
  for await (const entry of it) {
    arr.push(entry.path)
  }
  return arr
}

Deno.test("cli test", async (t) => {
  await withTempFolder(async (tempDirPath) => {
    const NAME = "foo"
    const cmd = new Deno.Command(Deno.execPath(), {
      args: ["run", "-A", "main.ts", "deno-cli", NAME, "--no-vscode", "--cwd", tempDirPath],
    })
    await cmd.output()

    const fullItems = await toArray(walk(tempDirPath, { includeDirs: false }))
    const items = fullItems.map((i) => i.replace(tempDirPath, ""))
    const DIRNAME = NAME + "-cli"
    const PATH_DIRNAME = "\\" + DIRNAME
    const expectItems = [
      PATH_DIRNAME + "\\.vscode\\settings.json",
      PATH_DIRNAME + "\\deno.jsonc",
      PATH_DIRNAME + "\\main.ts",
      PATH_DIRNAME + "\\main_bench.ts",
      PATH_DIRNAME + "\\main_test.ts",
    ]
    await t.step("name + -cli ディレクトリが生成されること", async () => {
      await assertDirExists(join(tempDirPath, DIRNAME))
    })

    await t.step("生成ファイル数", () => {
      assertEquals(items.length, expectItems.length)
    })

    await t.step("生成ファイルリストの検証", () => {
      assertArrayIncludes(items, expectItems)
    })

    await t.step("nameがテンプレートに当てはめられていること", async () => {
      const fileMainTs = join(tempDirPath, DIRNAME, "main.ts")
      await assertFileExists(fileMainTs)
      const ctx = await Deno.readTextFile(fileMainTs)
      assertStringIncludes(ctx, `name("${NAME}"`)
    })
  })
})
