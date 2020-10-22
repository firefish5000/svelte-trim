**[svelte-stripper](../README.md)**

> [Globals](../globals.md) / RemovalMethod

# Enumeration: RemovalMethod

How we dispose of unwanted whitespace

## Index

### Enumeration members

* [Comment](removalmethod.md#comment)
* [Strip](removalmethod.md#strip)

## Enumeration members

### Comment

•  **Comment**:  = "comment"

*Defined in index.ts:118*

___

### Strip

•  **Strip**:  = "strip"

*Defined in index.ts:100*

Remove the whitespace from the markup.
Turns
```html
<ul>
  <li> some </li>
  <li> words </li>
</ul>
```
Into
```html
<ul><li> some </li><li> words </li></ul>
```
