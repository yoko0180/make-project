import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts"
import { Select } from "https://deno.land/x/cliffy@v0.25.7/prompt/select.ts"
import { walk } from "https://deno.land/std@0.192.0/fs/walk.ts"
import { startVSCode } from "./vscode.ts"
import { fetchDenoMini } from "./fetch/deno-mini.ts"
import { fetchDenoCli } from "./fetch/deno-cli.ts"
import { ensureDir } from "https://deno.land/std@0.192.0/fs/ensure_dir.ts"

type ActionMap = {
  [key: string]: () => Promise<void>
}
type CreateType = "deno-mini" | "deno-cli"

const actionMap: ActionMap = {
  "deno-mini": () => fetchDenoMini(),
  "deno-cli": () => fetchDenoCli(),
}

async function displayResult() {
  for await (const entry of walk(".")) {
    console.log(entry.path)
  }
}

async function dispatchAction(key: string) {
  const action = actionMap[key]
  if (action) await action()
}

async function setupDir(name: string) {
  const exists = !!(await Deno.stat(name).catch(() => false))
  if (exists) throw Error("ディレクトリがすでに存在します：" + name)
  await ensureDir(name)
}

if (import.meta.main) {
  await new Command()
    .name("mp")
    .arguments("[type:string]")
    .version("0.1.0")
    .description("プロジェクトフォルダを作成する | make project | mp")
    .action(async (_ops, arg: string | undefined) => {
      if (arg) {
        await setupDir(arg)
        dispatchAction(arg)
      } else {
        const createType: string = await Select.prompt({
          message: "Create a Type",
          options: ["deno-mini", "deno-cli"],
        })
        dispatchAction(createType)
      }

      await displayResult()
      await startVSCode()
    })
    .parse(Deno.args)
}
