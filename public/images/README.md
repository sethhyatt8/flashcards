# Portrait overrides

Drop replacement portraits here when a Wikimedia image is missing or poorly cropped.

## Steps

1. Put the file in the matching folder, named by card `id`:
   - `presidents/obama.jpg`
   - `monarchs/victoria.png`
2. Add that id to `src/data/local-portraits.json`:

```json
{
  "presidents": ["obama"],
  "monarchs": ["victoria"]
}
```

Supported extensions: `.jpg`, `.png`, `.webp`.

## Alternate: point JSON at the file

Set the card’s `image` field in `us-presidents.json` / `uk-monarchs.json` to:

```text
images/presidents/obama.jpg
```

Ids are lowercase kebab-case (`jq-adams`, `t-roosevelt`, `elizabeth-ii`, etc.).
