- New Features:
  - Installation of Sando now has a popup to help with user feedback and reassure to them they are not doing anything wrong
  - Introduced a message when extracting assets from an installation to give assurance on SAMMI Hanging.
  - `Sando: Extract Zip` now supports instance ids
  - Introduced a new global variable, `pid`, which is the process ID of the currently running SAMMI. Useful for third party applications wanting to ensure no matter what, even if the close and crash triggers for SAMMI fail, that their app exits, via polling for the ID.
  - `Sando: System Dialog` adds custom system dialogs to be displayed thanks to the electron framework of "Sando Helper" providing system calls. The current included presets include `Sando: SD Choice`, `Sando: SD Open`, `Sando: SD Save`, and `Sando: SD Custom`. Choice, is a simple yes/no prompt with some customizable features, while the Open and Save prompts, open a File Explorer allowing users to select files/folders for opening or saving. The Custom command is a far more complicated version of Choice, with full access to how a standard System Dialog is displayed. Relies on electron documentation for configuration.
  - `Sando: Custom Window` adds custom chromium based popups for extension developers, or SAMMI users wanting to make a very nice looking popup! This is a command that contains multiple commands, those commands being `Sando: CW Custom`, which is the main command that will allow you to generate a bi-directional chromium window, and any other options such as `Sando: CW Dropdown` are presets that use `Sando: CW Custom` with easy-to-fill boxes for simple use case. Refer to docs (when finished) on usage! There is also `Sando: CW Custom (Event)` to send live events to your popups via a specified unique ID, or `Sando: CW Custom (Status)` to force a window to close with a result if desired. Documentation is going to be important on this one once i get around to it!
  - "Sando Helper" has been introduced as a new bundled electron application. This handles the generation of custom windows, and in the future, will handle all future scripts of Sando with communication via the relay server. This will make commands that previously ran on running the script manually through the `Command Line`, be ran through a websocket connection instead, making responses lightning fast, and cached in some cases for even better performance.
- Improvements:
  - Improved logging of various commands
  - Changed the helper connection message to not look like it's failing
- Bug Fixes:
  - Fixed an issue where validation wasn't waiting long enough for `npm install` result (was only waiting a single second before!)
  - Attempted to fix an issue with logs not logging before exit/crash

Im sure there are plenty of other things im forgetting about here!
