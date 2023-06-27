import { ensureDir } from "https://deno.land/std@0.192.0/fs/ensure_dir.ts"
import { BASE_URL, Context, fetchOut } from "./fetch.ts"

export async function fetchDenoMini(context: Context) {
  await ensureDir(".vscode")
  await fetchOut({
    urlRoot: BASE_URL + "deno-base/",
    // prettier-ignore
    names: [
      ".vscode/settings.json",
      "deno.jsonc",
      "main_bench.ts",
      "main_test.ts",
      "main.ts",
    ],
    context,
  })
}
