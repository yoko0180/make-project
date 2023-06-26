
import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts"
import { Select } from "https://deno.land/x/cliffy@v0.25.7/prompt/select.ts"

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await new Command()
    .name("cliffy")
    .version("0.1.0")
    .description("Command line framework for Deno")
    .action(async (ops, ...args) => {
      const createType: string = await Select.prompt({
        message: "Create a Type",
        options: [
          "mini", "cli"
          // { name: "mini", value: "mini" },
          // { name: "cli", value: "cli" },
        ],
      })
      console.log(createType);
    })
    .parse(Deno.args)
}
