import { WalkEntry, walk } from "https://deno.land/std@0.192.0/fs/walk.ts"
import { join } from "https://deno.land/std@0.192.0/path/mod.ts"
import { assertArrayIncludes, assertEquals, assertStringIncludes } from "https://deno.land/std@0.192.0/testing/asserts.ts"
import { withTempFolder, assertDirExists, assertFileExists } from "./sub_test.ts"

async function toArray(it: AsyncIterableIterator<WalkEntry>) {
  const arr = []
  for await (const entry of it) {
    arr.push(entry.path)
  }
  return arr
}

Deno.test("cli test", async () => {
  await withTempFolder(async (tempDirPath) => {
    const cmd = new Deno.Command(Deno.execPath(), {
      args: ["run", "-A", "main.ts", "deno-cli", "foo", "--no-vscode", "--cwd", tempDirPath],
    })
    await cmd.output()

    const fullItems = await toArray(walk(tempDirPath, { includeDirs: false }))
    const items = fullItems.map((i) => i.replace(tempDirPath, ""))
    const expectItems = [
      "\\foo\\.vscode\\settings.json",
      "\\foo\\deno.jsonc",
      "\\foo\\main.ts",
      "\\foo\\main_bench.ts",
      "\\foo\\main_test.ts",
    ]
    assertEquals(items.length, expectItems.length)
    assertArrayIncludes(items, expectItems)


    await assertDirExists(join(tempDirPath, "foo"))
    const fileMainTs = join(tempDirPath, "foo", "main.ts")
    await assertFileExists(fileMainTs)
    const ctx = await Deno.readTextFile(fileMainTs)
    assertStringIncludes(ctx, 'name("foo')
  })
})
