import { ensureDir } from "https://deno.land/std@0.192.0/fs/ensure_dir.ts"
import { Input } from "https://deno.land/x/cliffy@v0.25.7/prompt/mod.ts"

async function pathExists(filepath: string): Promise<boolean> {
  const file = await Deno.stat(filepath).catch(() => false)
  return !!file
}

export async function denoCli() {
  const name: string = await Input.prompt(`What's project name?`)
  if (await pathExists(name)) throw Error("exists path")
  await ensureDir(name)

  const command = new Deno.Command("deno-init", {
    args: [
    ]
  })
  await command.output()
}
