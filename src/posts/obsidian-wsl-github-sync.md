---
title: How I configured a one-word command to commit diary entries in Obsidian to GitHub
date: december 23, 2025
---

## How I configured a one-word command to commit diary entries in Obsidian to GitHub

Okay so the reason that I wanted to do this was because my current experience for uploading new entries to Obsidian via GitHub seemed like it was going to be annoying.

Some things I'd decided:

1. I wanted to run the Obsidian app on Windows.
   - I had attempted to run it as an application installed within Ubuntu but the user experience is worse for GUIs rendered this way. It is laggy and doesn't match theme.
2. I want to make it easy to do from a bash terminal in my WSL environment. This is my default terminal.
3. I want it to be a one word command
4. I want to be able to also use it across multiple systems that have different file system structures
5. I want to be able to provide custom messages for the commit as well

I sort of ended up working through each of these one by one by reading different articles and figuring out my way through setting this up. This seems like the path of least resistance for me, and will be sufficient for what I'm trying to do. One thing I did find was the github repo for a full-scale obsidian CLI. I read the details for what it can do, and I wanted something that didn't necessarily need all of that setup.

Ironically now I jumped through a bunch of hoops and probably spent longer on it doing this, but that's why we're here.

### Clone Git Repository

I manually created a git repository in the web ui via https://github.com/raistlan?tab=repositories (you'll want to point to your github profile)

Then `git clone`'d it to my windows file system via `git -C /mnt/c/development clone` or changing to that directory and running git clone

### Install Obsidian

via https://obsidian.md/download

When you open Obsidian for the first time, it will ask you what directory to use for your vault. Select the one that you're configuring. My intention is for multiple commands or parameters to interact with different vaults.

Select the folder that you cloned your git repo into: `C:\development\diary` for me

### Configuring the function

Open the file that you use to provide aliases to your shell. I've got a instructions for how to do this over here: https://github.com/raistlan/dotfiles

I ran `aliases` then used vim to add a new line that says:

```bash
diary() { git -C /mnt/c/development/diary add . && git -C /mnt/c/development/diary commit -m 'scripted entry'; }
```

This isn't the final version, but an example of how I got to the final point. You can see that I'm just redirecting git via the -C command and always using the same directory and commit message.

```bash
diary() {
  # usage:
  #  - diary
  #  - diary "this is a custom entry"
  # local defines a variable
  # msg is the name of the variable we are setting
  # $1 = the first argument passed to the function
  # :- = default value operator
  # If $1 is empty or unset, use "scripted entry"
  # we use the curly braces ${1...} to say that we want to perform parameter expansion
  # this is saying that the script will use the first variable or it will default to "scripted entry"
  local msg="${1:-scripted entry}"

  # loops through any locations provided as separate line records
  # feel free to add or remove values, but this example has two
  # first checks for the case where it's pointing to my windows file system from WSL
  # second is likely what my folder structure will look like on MacOS
  local diary_dir
  for diary_dir in \
    "/mnt/c/development/diary" \
    "$HOME/development/diary"
  do
    [[ -d "$diary_dir" ]] && break
  done

  # returning 1 here indicates an error if a directory cannot be found
  [[ -d "$diary_dir" ]] || return 1

  # github commands
  git -C "$diary_dir" add . &&
  git -C "$diary_dir" commit -m "$msg" &&
  git -C "$diary_dir" push
}
```

This was where I really started understanding it. I wanted to make some tweaks further below so this wasn't the final version, but if you only have on repository/vault combo, this is all you should need

### Creating a new note

- Open the Obsidian UI
- Ctrl+N to create a new note
- Put some content into the note
- Save it
- Open your terminal
- Run the command
  - ```bash
    diary
    ```

### Creating a new vault

You can follow the original instructions and just set up a second function with a different name that points at a different repository by updating these two spots in the script

```bash
diary()
 ...
  for diary_dir in \
    "/mnt/c/development/diary" \
    "$HOME/development/diary"
  do
 ...
```

I think it would be cool to improve this so you could pass a flag that matches different folders ie `diary -p "msg"` for personal and `diary -w "msg"` for work. Would just need to interpret each of these flags as a selector for the directory you look for.

### Allowing optional flags / final product

Worked with ChatGPT to get option flags in and can now run it exactly the way that I want:

```bash
journal() {
  local OPTIND=1
  local mode=""
  local msg="scripted entry"

  while getopts ":dw" opt; do
    case "$opt" in
      d) mode="diary" ;;
      w) mode="work" ;;
      *)
        echo "Usage: journal [-d|-w] [message]"
        return 1
        ;;
    esac
  done

  shift $((OPTIND - 1))

  [[ -n "$1" ]] && msg="$*"

  [[ -z "$mode" ]] && mode="diary"

  local journal_dir
  case "$mode" in
    diary)
      for journal_dir in \
        "/mnt/c/development/diary" \
        "$HOME/development/diary"
      do
        [[ -d "$journal_dir" ]] && break
      done
      ;;
    work)
      for journal_dir in \
        "/mnt/c/development/workdiary" \
        "$HOME/development/workdiary"
      do
        [[ -d "$journal_dir" ]] && break
      done
      ;;
  esac

  [[ -d "$journal_dir" ]] || {
    echo "Journal directory not found"
    return 1
  }

  git -C "$journal_dir" add . &&
  git -C "$journal_dir" commit -m "$msg" &&
  git -C "$journal_dir" push
}
```

I'll probably end up keeping these separated by project, so they can be distinct and potentially even shared if necessary. Ideally though this just gives me an easier way to keep notes with the benefit of being off of the Google ecosystem and in a .md format, which I appreciate.

Thanks for following along!
