
import { Command } from "cliffy/command/mod.ts"
import { Select } from "cliffy/prompt/select.ts"

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await new Command()
    .name("{{binName}}")
    .version("0.1.0")
    .description("Command line framework for Deno")
    .action(async (_ops, ..._args) => {
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
