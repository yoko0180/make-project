import { BASE_URL, FetchArg, fetchOut } from "./fetch.ts"

export async function fetchDenoCli(fetchArg: FetchArg) {
  await fetchOut({
    urlRoot: BASE_URL + "deno-base/",
    // prettier-ignore
    names: [
      ".vscode/settings.json",
      "deno.jsonc",
      "main_bench.ts",
      "main_test.ts",
    ],
    fetchArg
  })
  await fetchOut({
    urlRoot: BASE_URL + "deno-cli/",
    // prettier-ignore
    names: [
      "main.ts",
    ],
    fetchArg
  })
}
