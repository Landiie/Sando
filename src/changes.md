- Bug fixes:
  - Fixed an issue where the .sef asset unpacker was hardcoded to a testing string
  - Fixed an issue where the unpacker was pulling the websocket password from the wrong location.
  - Fixed an issue where sando-helper.exe was taking way too long to open with zero feedback, making opening SAMMI a frustrating experience
    - A side effect of this fix is exploding the file size, however, this was no different than it was before, as the exe was, under the hood, extracting a zip, contributing to the large downtime between runs, that has the same amount of storage. It's simply always unpacked now for maximum responsiveness.
  - Fixed a hardcoded path used in `Sando: CW Dropdown`
  - Fixed a hardcoded path used in Sando Initialization

There is a potential lingering bug related to the server connecting too fast, but we'll get there when we get there.