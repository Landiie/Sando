- New Features:
  - `Sando: System Dialog` adds custom system dialogs to be displayed thanks to the electron framework of "Sando Helper" providing system calls. The current included presets include `Sando: SD Choice`, `Sando: SD Open`, `Sando: SD Save`, and `Sando: SD Custom`. Choice, is a simple yes/no prompt with some customizable features, while the Open and Save prompts, open a File Explorer allowing users to select files/folders for opening or saving. The Custom command is a far more complicated version of Choice, with full access to how a standard System Dialog is displayed. Relies on electron documentation for configuration.
  - `Sando: Custom Window` adds custom chromium based popups for extension developers, or SAMMI users wanting to make a very nice looking popup! This is a command that contains multiple commands, those commands being `Sando: CW Custom`, which is the main command that will allow you to generate a bi-directional chromium window, and any other options such as `Sando: CW Dropdown` are presets that use `Sando: CW Custom` with easy-to-fill boxes for simple use case. Refer to docs (when finished) on usage!
  - "Sando Helper" has been introduced as a new bundled electron application. This handles the generation of custom windows, and in the future, will handle all future scripts of Sando with communication via the relay server. This will make commands that previously ran on running the script manually through the `Command Line`, be ran through a websocket connection instead, making responses lightning fast, and cached in some cases for even better performance.
- Improvements:
  - Improved logging of various commands
- Bug Fixes:
  - Fixed an issue where validation wasn't waiting long enough for `npm install` result (was only waiting a single second before!)
  - Attempted to fix an issue with logs not logging before exit/crash

Work in progress: fixing my big ass paws to stop clicking things I don't mean to