import { BASE_URL, Context, fetchOut } from "./fetch.ts"

export async function fetchDenoMini(context: Context) {
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
