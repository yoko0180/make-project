import { join } from "https://deno.land/std@0.192.0/path/win32.ts"

export async function startVSCode() {
  const appdataLocal = Deno.env.get("LOCALAPPDATA")
  if (!appdataLocal) return
  const vscode = join(appdataLocal, "Programs/Microsoft VS Code/bin/code.cmd")
  const command = new Deno.Command(vscode, {
    args: ["."],
    stdin: "inherit",
    stdout: "inherit",
  })
  await command.output()
}
