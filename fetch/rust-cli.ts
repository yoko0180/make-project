import { BASE_URL, FetchArg, fetchOut } from "./fetch.ts"

export async function fetchRustCli(fetchArgOpt: FetchArg) {
  const fetchArg = {
    ...fetchArgOpt,
    context: {
      ...fetchArgOpt.context,
    }
  }
  await fetchOut({
    urlRoot: BASE_URL + "rust-cli/",
    // prettier-ignore
    names: [
      "src/main.rs",
      ".gitignore",
      "Cargo.toml",
    ],
    fetchArg
  })
}
