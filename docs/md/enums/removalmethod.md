**[svelte-strip-whitespace](../../../README.md)**

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

___

### Trim

•  **Trim**:  = "trim"

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
