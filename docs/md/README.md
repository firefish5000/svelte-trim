**[svelte-strip-whitespace](README.md)**

> [Globals](globals.md)

**[svelte-stripper](README.md)**

> Globals

# svelte-stripper

## Index

### Enumerations

* [RemovalMethod](enums/removalmethod.md)

### Interfaces

* [SvelteStripperOptions](interfaces/sveltestripperoptions.md)

### Functions

* [sequentialPreprocessor](globals.md#sequentialpreprocessor)
* [svelteStripper](globals.md#sveltestripper)

## Functions

### sequentialPreprocessor

▸ **sequentialPreprocessor**(...`preprocessorLists`: (PreprocessorGroup \| PreprocessorGroup[])[]): PreprocessorGroup

*Defined in index.ts:493*

Runs the passed preprocessors lists in sequence.
Meaning All `markup`, `script`, and `style` preprocessors
of group 1 will run before any preprocessor of group 2.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`...preprocessorLists` | (PreprocessorGroup \| PreprocessorGroup[])[] | The preprocessors to run. Each group will invoke `svelte.preprocess()` witht the preprocessed output of the previous group.  |

**Returns:** PreprocessorGroup

___

### svelteStripper

▸ **svelteStripper**(`passedOptions?`: [SvelteStripperOptions](interfaces/sveltestripperoptions.md)): PreprocessorGroup

*Defined in index.ts:209*

Strips unwanted whitespace out of svelte files.
*Warning! Must be run on valid/pure svelte files!
You can run other preprocessors first via the sequential
preprocessor like so
```js
preprocess: sequentialPreprocessor(otherPreprocessors,svelteStripper())
```
*

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`passedOptions` | [SvelteStripperOptions](interfaces/sveltestripperoptions.md) | {
  removalMethod: RemovalMethod.Strip
  ,inline: false
  ,multiline: true
  ,elementSiblings: true
  ,componentSiblings: true
  ,mustacheTextSiblings: false
  ,mustacheBlockSiblings: true
  ,mustacheDirectiveSiblings: true
  ,ignoreElements: ['code' ,'pre' ,'style' ,'script']
  ,ignoreFilter: () => false
} | config options  |

**Returns:** PreprocessorGroup
