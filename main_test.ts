import { walk } from "https://deno.land/std@0.192.0/fs/walk.ts"
import { join } from "https://deno.land/std@0.192.0/path/mod.ts"
import { assertStringIncludes } from "https://deno.land/std@0.192.0/testing/asserts.ts"
import { withTempFolder,assertDirExists,assertFileExists } from "./sub_test.ts";

Deno.test("cli test", async () => {
  await withTempFolder(async (tempDirPath) => {
    console.log("tempDirPath:", tempDirPath)
    const cmd = new Deno.Command(Deno.execPath(), {
      args: ["run", "-A", "main.ts", "deno-cli", "foo", "--no-vscode", "--cwd", tempDirPath],
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
