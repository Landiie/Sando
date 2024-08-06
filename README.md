# Sando
A SAMMI Extension that helps extension developers, and provides awesome new features for standard users.

This repository serves as my development environment, as well as an environment for others to contribute towards. If you are looking for download and installation guides, please check [My Site](https://landie.land/shop/sammi-extensions/sando)!

If you're here to help with development, or curious to peek through the code, continue reading!

## Compiling

First, clone this repository to your machine. If you are new to git, I recommend using something friendly such as GitHub Desktop. This is what I used when I was just starting out, and it got the job done for me most of the time!

After you are done cloning to your machine, navigate to the folder and open a command line prompt in it. You can do this various ways, but the easiest way I found is to type "cmd" in the address bar in your File Explorer, which will open the command prompt to that folder.

Once open, run the following commands:

```
npm install
npm run build
```
Here is what each command does:

- `npm install` installs all the required dependancies for the project. ensure that you are in the root of the project folder, as there are two package files, one for this development environment, and one for the actual assets used in the extension itself.
- `npm run buildfull` compiles a `.sef` file (SAMMI Extension File) to install into your SAMMI project using the script `compile_sef.js`. Anytime you make changes to the source code, ensure to run this command 

Afterwards, simply install the .sef file into SAMMI and you're off to testing!

If you are not making changes to the deck data, or extension assets, you can install the compiled extension using the Visual Studio Code extension and choosing `SAMMI: Install Extension`. This will inject the extension into your SAMMI Bridge without going through SAMMI Core. This is useful for rapid development that isn't focused on SAMMI data itself, but rather, the bridge. It is highly recommended to run `npm run build` when compiling the .sef file if doing this, because `npm run buildfull` bundles in extra assets which can take time. It depends on if you need your assets updated, which in anycase you would need to install through SAMMI Core to get those assets extracted.