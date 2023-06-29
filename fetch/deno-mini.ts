import { BASE_URL, FetchArg, fetchOut } from "./fetch.ts"

export async function fetchDenoMini(fetchArg: FetchArg) {
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
    fetchArg,
  })
}
