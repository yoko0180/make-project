import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts"
import { Select } from "https://deno.land/x/cliffy@v0.25.7/prompt/select.ts"
import { walk } from "https://deno.land/std@0.192.0/fs/walk.ts"
import { startVSCode } from "./vscode.ts"
import { fetchDenoMini } from "./fetch/deno-mini.ts"
import { fetchDenoCli } from "./fetch/deno-cli.ts"
import { Input } from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts"
import { FetchArg } from "./fetch/fetch.ts"
import { join } from "https://deno.land/std@0.192.0/path/mod.ts";

type Action = (fetchArg: FetchArg) => Promise<void>
type ActionMap = {
  [key: string]: Action
}
type CreateType = "deno-mini" | "deno-cli"

const actionMap: ActionMap = {
  "deno-mini": (context) => fetchDenoMini(context),
  "deno-cli": (context) => fetchDenoCli(context),
}

async function displayResult(cwd: string) {
  for await (const entry of walk(cwd)) {
    console.log(entry.path)
  }
}

type DispatchAction = {
  key: string
  fetchArg: FetchArg
}

async function dispatchAction({ key, fetchArg }: DispatchAction) {
  const action = actionMap[key]
  if (!action) throw new Error("アクションタイプがありません: " + key)
  await action(fetchArg)
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
    .example("deno-cli foo", "foo-cliフォルダを作成する")
    .error((err, _cmd) => {
      console.log(err.message);
      Deno.exit()
    })
    .option("--cwd <cwd>", "実行ディレクトリの指定")
    .option("--no-vscode", "no open vscode")
    .action(async (ops, createTypeOpt: OptArg, nameOpt: OptArg) => {
      const name = await optCallback(nameOpt, async () => await Input.prompt("name?"))
      const createType = await optCallback(
        createTypeOpt,
        async () =>
          await Select.prompt({
            message: "Create a Type",
            options: ["deno-mini", "deno-cli"],
          })
      )

      const cwd = ( ops.cwd ? join(ops.cwd, name) : name ) + (createType === "deno-cli" ? "-cli" : "")
      const fetchArg = {
        cwd,
        context: {name}
      }
      await dispatchAction({ key: createType, fetchArg })
      await displayResult(cwd)
      if (ops.vscode)
      await startVSCode([cwd])
    })
    .parse(Deno.args)
}
