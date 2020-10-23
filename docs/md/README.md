**[svelte-strip-whitespace](README.md)**

> [Globals](globals.md)

### stripWhitespace

▸ **stripWhitespace**(`passedOptions?`: [SvelteStripperOptions](interfaces/sveltestripperoptions.md)): PreprocessorGroup

*Defined in index.ts:209*

Strips unwanted whitespace out of svelte files.
*Warning! Must be run on valid/pure svelte files!
You can run other preprocessors first via the sequential
preprocessor like so
```js
preprocess: sequentialPreprocessor(otherPreprocessors,stripWhitespace())
```
*
