**[svelte-strip-whitespace](README.md)**

> Globals

# svelte-strip-whitespace

## Index

### Enumerations

* [RemovalMethod](enums/removalmethod.md)

### Interfaces

* [WhitespaceStripperOptions](interfaces/whitespacestripperoptions.md)

### Functions

* [sequentialPreprocessor](globals.md#sequentialpreprocessor)
* [stripWhitespace](globals.md#stripwhitespace)

## Functions

### sequentialPreprocessor

▸ **sequentialPreprocessor**(...`preprocessorLists`: (PreprocessorGroup \| PreprocessorGroup[])[]): PreprocessorGroup

Runs the passed preprocessors lists in sequence.
Meaning All `markup`, `script`, and `style` preprocessors
of group 1 will run before any preprocessor of group 2.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`...preprocessorLists` | (PreprocessorGroup \| PreprocessorGroup[])[] | The preprocessors to run. Each group will invoke `svelte.preprocess()` witht the preprocessed output of the previous group.  |

**Returns:** PreprocessorGroup

___

### stripWhitespace

▸ **stripWhitespace**(`passedOptions?`: [WhitespaceStripperOptions](interfaces/whitespacestripperoptions.md)): PreprocessorGroup

Strips unwanted whitespace out of svelte files.
*Warning! Must be run on valid/pure svelte files!
You can run other preprocessors first via the sequential
preprocessor like so*
```js
preprocess: sequentialPreprocessor(otherPreprocessors,stripWhitespace())
```

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`passedOptions` | [WhitespaceStripperOptions](interfaces/whitespacestripperoptions.md) | {
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
