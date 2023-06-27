import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts"
import { Select } from "https://deno.land/x/cliffy@v0.25.7/prompt/select.ts"
import { walk } from "https://deno.land/std@0.192.0/fs/walk.ts"
import { startVSCode } from "./vscode.ts"
import { fetchDenoMini } from "./fetch/deno-mini.ts"
import { fetchDenoCli } from "./fetch/deno-cli.ts"
import { ensureDir } from "https://deno.land/std@0.192.0/fs/ensure_dir.ts"
import { Input } from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts"
import { Context } from "./fetch/fetch.ts"

type ActionMap = {
  [key: string]: (context: Context) => Promise<void>
}
type CreateType = "deno-mini" | "deno-cli"

const actionMap: ActionMap = {
  "deno-mini": (context) => fetchDenoMini(context),
  "deno-cli": (context) => fetchDenoCli(context),
}

async function displayResult() {
  for await (const entry of walk(".")) {
    console.log(entry.path)
  }
}

type DispatchAction = {
  key: string
  context: Context
}
async function dispatchAction({ key, context }: DispatchAction) {
  const action = actionMap[key]
  if (action) await action(context)
}

async function setupDir(name: string) {
  const exists = !!(await Deno.stat(name).catch(() => false))
  if (exists) throw Error("ディレクトリがすでに存在します：" + name)
  await ensureDir(name)
}

type OptArg = string | undefined

async function optCallback(opt: OptArg, cb: () => Promise<string>) {
  if (opt) return opt
  return await cb()
}

if (import.meta.main) {
  await new Command()
    .name("mp")
    .arguments("[type:string] [name:string]")
    .version("0.1.0")
    .description("プロジェクトフォルダを作成する | make project | mp")
    .action(async (_ops, createTypeOpt: OptArg, nameOpt: OptArg) => {
      const name = await optCallback(nameOpt, async () => await Input.prompt("name?"))
      const createType = await optCallback(
        createTypeOpt,
        async () =>
          await Select.prompt({
            message: "Create a Type",
            options: ["deno-mini", "deno-cli"],
          })
      )

      dispatchAction({ key: createType, context: { name } })
      await displayResult()
      await startVSCode()
    })
    .parse(Deno.args)
}
