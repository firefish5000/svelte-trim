**[svelte-strip-whitespace](../README.md)**

> [Globals](../globals.md) / WhitespaceStripperOptions

# Interface: WhitespaceStripperOptions

Configures the preprocessor.
For ease of reading, this doc
annotates whitespace that would be removed
by an option with html comments
`<!-- -->`

## Hierarchy

* **WhitespaceStripperOptions**

## Index

### Properties

* [componentSiblings](whitespacestripperoptions.md#componentsiblings)
* [elementSiblings](whitespacestripperoptions.md#elementsiblings)
* [ignoreElements](whitespacestripperoptions.md#ignoreelements)
* [ignoreFilter](whitespacestripperoptions.md#ignorefilter)
* [inline](whitespacestripperoptions.md#inline)
* [multiline](whitespacestripperoptions.md#multiline)
* [mustacheBlockSiblings](whitespacestripperoptions.md#mustacheblocksiblings)
* [mustacheDirectiveSiblings](whitespacestripperoptions.md#mustachedirectivesiblings)
* [mustacheTextSiblings](whitespacestripperoptions.md#mustachetextsiblings)
* [removalMethod](whitespacestripperoptions.md#removalmethod)

## Properties

### componentSiblings

• `Optional` **componentSiblings**: undefined \| false \| true

Trims text adjacent to components (such as `<Component>` and `<svelte:component>`).

___

### elementSiblings

• `Optional` **elementSiblings**: undefined \| false \| true

Trims text adjacent to elements (such as `<span>` or `<div>`).

___

### ignoreElements

• `Optional` **ignoreElements**: string[]

Ignore text contained within the specified dom nodes.
Note that top level style/script tags are
***always ignored*** and are thus not
affected by this rule.

___

### ignoreFilter

• `Optional` **ignoreFilter**: undefined \| (node: INode, parent: INode \| undefined, prop: string \| undefined, index: number, ancestors: INode[]) => boolean

Ignore text contained within the svelte ast nodes
that match the filter.
Matches nothing by default.

___

### inline

• `Optional` **inline**: undefined \| false \| true

Trims text adjacent to other elements/mustaches without a newline.
Turns
```html
<div> Text </div> <img src=""/> Text
```
Into
```html
<div> Text </div><!-- --><img src=""/><!-- -->Text
```

___

### multiline

• `Optional` **multiline**: undefined \| false \| true

Trims text adjacent to other elements/mustaches when a newline is present.
Turn
```html
<ul>
  <li> some <span> more </span> </li>
  <li> words </li>
</ul>
```
Into
```html
<ul><!--
  --><li> some <span> more </span> </li><!--
  --><li> words </li><!--
--></ul>
```

___

### mustacheBlockSiblings

• `Optional` **mustacheBlockSiblings**: undefined \| false \| true

Trims text adjacent to mustache blocks
(such as `{#if boolean}{:else}{/if}`).
Defaults to true.

___

### mustacheDirectiveSiblings

• `Optional` **mustacheDirectiveSiblings**: undefined \| false \| true

Trims text adjacent to mustache @ directives
(such as `{@html '<br/>'}{@debug someVar}`).
Defaults to true.

___

### mustacheTextSiblings

• `Optional` **mustacheTextSiblings**: undefined \| false \| true

Trims text adjacent to mustache text expressions
(such as `{someVar}`).
Defaults to false, treating it the same way as the escaped text content would have been.

___

### removalMethod

• `Optional` **removalMethod**: [RemovalMethod](../enums/removalmethod.md)

How we should dispose of unwanted whitespace
