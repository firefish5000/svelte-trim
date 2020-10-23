**[svelte-strip-whitespace](README.md)**

> [Globals](globals.md)

# stripWhitespace

Strips unwanted whitespace out from between `<dom nodes="">`,
`<Components />`, `{tags}`, and `{#blocks}`.

Most common options include

| Option Name | Type | Default |
|--|--|--|
[removalMethod](docs/md/interfaces/whitespacestripperoptions.md#removalmethod) | 'strip'\|'comment' | 'strip'
[componentSiblings](docs/md/interfaces/whitespacestripperoptions.md#componentsiblings) | boolean | true
[elementSiblings](docs/md/interfaces/whitespacestripperoptions.md#elementsiblings) | boolean | true
[inline](docs/md/interfaces/whitespacestripperoptions.md#inline) | boolean | false
[multiline](docs/md/interfaces/whitespacestripperoptions.md#multiline) | boolean | true
[mustacheBlockSiblings](docs/md/interfaces/whitespacestripperoptions.md#mustacheblocksiblings) | boolean | true
[mustacheDirectiveSiblings](docs/md/interfaces/whitespacestripperoptions.md#mustachedirectivesiblings) | boolean | true
[mustacheTextSiblings](docs/md/interfaces/whitespacestripperoptions.md#mustachetextsiblings) | boolean | false
[ignoreElements](docs/md/interfaces/whitespacestripperoptions.md#ignoreelements) | Array\<ElementType\> | ['pre','code','style','script']

▸ **stripWhitespace**(`passedOptions?`: [SvelteStripperOptions](docs/md/interfaces/whitespacestripperoptions.md)): PreprocessorGroup

*Defined in index.ts:209*

Strips unwanted whitespace out of svelte files.
*Warning! Must be run on valid/pure svelte files!
You can run other preprocessors first via the sequential
preprocessor like so
```js
preprocess: sequentialPreprocessor(otherPreprocessors,stripWhitespace())
```
*
