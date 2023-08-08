import { Input } from "https://deno.land/x/cliffy@v0.25.7/prompt/input.ts";
import { BASE_URL, FetchArg, fetchOut } from "./fetch.ts"

export async function fetchDenoCli(fetchArgOpt: FetchArg) {
  const binName = await Input.prompt("bin name?")
  const fetchArg = {
    ...fetchArgOpt,
    context: {
      ...fetchArgOpt.context,
      binName
    }
  }
  await fetchOut({
    urlRoot: BASE_URL + "deno-base/",
    // prettier-ignore
    names: [
      ".vscode/settings.json",
      "main_bench.ts",
      "main_test.ts",
      "import_map.jsonc",
    ],
    fetchArg
  })
  await fetchOut({
    urlRoot: BASE_URL + "deno-cli/",
    // prettier-ignore
    names: [
      "main.ts",
      "deno.jsonc",
    ],
    fetchArg
  })
}
