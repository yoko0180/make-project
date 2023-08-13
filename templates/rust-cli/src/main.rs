use clap::Parser;
use std::env;

/// -- ここにコマンド概要 --
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    // / Name of the person to greet
    // #[arg(short, long)]
    // name: String,

    // / Number of times to greet
    // #[arg(short, long, default_value_t = 1)]
    // count: u8,

    /// -- コマンドオプション --
    // filter: Option<String>
    filter: Option<String>,
}

fn main() {
    let args = Args::parse();
    let a = args.filter.as_deref();
    print_path(a)
}

fn match_str(str: &str, find: &str) -> bool {
    str.to_lowercase().contains(&find.to_lowercase())
}

fn print_path(filter: Option<&str>) {
    let pathstr = env::var("PATH").unwrap();

    for path_line in pathstr.split(";") {
        if path_line.trim() == "" {
            continue;
        }
        if filter.map_or(true, |x| match_str(path_line, x)) {
            println!("{}", path_line);
        }
    }
}

#[test]
fn test() {
    assert_eq!(1, 1);
}
