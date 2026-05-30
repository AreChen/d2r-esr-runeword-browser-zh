# Loot Filter Editor

The loot filter editor is a browser-only tool for inspecting and adjusting D2RLAN Lua filter configuration files.

## Route

`/loot-filter`

## Scope

- Imports `.lua` or text filter configuration files through a local file upload.
- Parses the top-level metadata and `rules = { ... }` entries without executing Lua.
- Shows user-facing labels, fields, filters, and previews in Chinese.
- Exports valid Lua using the original standard field names such as `notify`, `background`, `border`, `audio`, `hide`, and `filter_levels`.
- Preserves unrelated rule content by patching recognized fields in the uploaded source instead of regenerating the whole file.

## Editable Fields

- Chinese notification text (`notify.zhCN` or string-form `notify`)
- Name prefix and suffix
- Description prefix and suffix
- Background RGBA
- Border RGBA and width
- Audio filename
- Hide flag
- Filter levels

## Preview

The editor renders D2R color tags such as `{red}`, `{gold}`, and `{purple}` in the page preview and replaces common placeholders such as `{name}`, `{ilvl}`, and `{sockets}` with sample values.

Uploaded audio files can be previewed in the browser. Exported Lua keeps only the filename, so the actual audio file still needs to exist in the game/filter environment.
