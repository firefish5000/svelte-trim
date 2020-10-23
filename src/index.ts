/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
// Svelte fails to define default export's type, so we rebuild it.
// @ts-expect-error walk is not in d.ts for some reason
import { compile ,parse ,preprocess ,walk } from 'svelte/compiler'
import { Ast ,TemplateNode } from 'svelte/types/compiler/interfaces'
import { INode as NearINode } from 'svelte/types/compiler/compile/nodes/interfaces'
import AwaitBlock from 'svelte/types/compiler/compile/nodes/AwaitBlock'
import CatchBlock from 'svelte/types/compiler/compile/nodes/CatchBlock'
import EachBlock from 'svelte/types/compiler/compile/nodes/EachBlock'
import ElseBlock from 'svelte/types/compiler/compile/nodes/ElseBlock'
import IfBlock from 'svelte/types/compiler/compile/nodes/IfBlock'
import KeyBlock from 'svelte/types/compiler/compile/nodes/KeyBlock'
import PendingBlock from 'svelte/types/compiler/compile/nodes/PendingBlock'
import ThenBlock from 'svelte/types/compiler/compile/nodes/ThenBlock'
import DebugTag from 'svelte/types/compiler/compile/nodes/DebugTag'
import RawMustacheTag from 'svelte/types/compiler/compile/nodes/RawMustacheTag'
import { PreprocessorGroup ,Processed } from 'svelte/types/compiler/preprocess'
import type { SyncWalker } from 'estree-walker/types/sync'
import Text from 'svelte/types/compiler/compile/nodes/Text'

/* interface Text extends NearText {
  raw: string
  start: number
  end: number
} */
type INode = NearINode // Exclude<NearINode ,NearText> | Text

/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["node"] }] */

const svelte = {
  compile ,parse ,preprocess ,walk: walk as (ast:Ast ,walker:SyncWalker)=>void
}

function spliceSlice(str: string ,index: number ,count:number ,add:string) {
  let newIndex = index
  // We cannot pass negative indexes directly to the 2nd slicing operation.
  if (newIndex < 0) {
    newIndex = str.length + newIndex
    if (newIndex < 0) {
      newIndex = 0
    }
  }

  return str.slice(0 ,newIndex) + (add || '') + str.slice(newIndex + count)
}

type BlockTypes = IfBlock | ElseBlock | EachBlock
| PendingBlock
| ThenBlock | CatchBlock | KeyBlock
| AwaitBlock

type DirectiveTypes = DebugTag | RawMustacheTag

const blockTypes: [
  'IfBlock'
  ,'ElseBlock'
  ,'EachBlock'
  ,'AwaitBlock'
  ,'PendingBlock'
  ,'ThenBlock'
  ,'CatchBlock'
  ,'KeyBlock'
] = [
  'IfBlock'
  ,'ElseBlock'
  ,'EachBlock'
  ,'AwaitBlock'
  ,'PendingBlock'
  ,'ThenBlock'
  ,'CatchBlock'
  ,'KeyBlock'
]
const atDirectiveTypes: DirectiveTypes['type'][] & ['DebugTag' ,'RawMustacheTag'] = ['DebugTag' ,'RawMustacheTag']

function isNodeType<T extends INode ,K extends T['type'][] = T['type'][]>(node: INode ,someType: K): node is T {
  if (someType.includes(node.type)) {
    return true
  }
  return false
}
/**
 * How we dispose of unwanted whitespace
 */
const enum RemovalMethod {
  /**
   * Remove the whitespace from the markup.
   * Turns
   * ```html
   * <ul>
   *   <li> some </li>
   *   <li> words </li>
   * </ul>
   * ```
   * Into
   * ```html
   * <ul><li> some </li><li> words </li></ul>
   * ```
   */
  Strip = 'strip'
  /**
   * Comment out the whitespace (preserves formatting/readability).
   * Turn
   * ```html
   * <ul>
   *   <li> some </li>
   *   <li> words </li>
   * </ul>
   * ```
   * Into
   * ```html
   * <ul><!--
   *   --><li> some </li><!--
   *   --><li> words </li><!--
   * --></ul>
   * ```
   */
  ,Comment = 'comment'
}
/**
 * Configures the preprocessor.
 * For ease of reading, this doc
 * annotates whitespace that would be removed
 * by an option with html comments
 * `<!-- -->`
 */
interface WhitespaceStripperOptions {
  /** How we should dispose of unwanted whitespace */
  removalMethod?: RemovalMethod
  /**
   * Trims text adjacent to other elements/mustaches without a newline.
   * Turns
   * ```html
   * <div> Text </div> <img src=""/> Text
   * ```
   * Into
   * ```html
   * <div> Text </div><!-- --><img src=""/><!-- -->Text
   * ```
   */
  inline?: boolean
  /**
   * Trims text adjacent to other elements/mustaches when a newline is present.
   * Turn
   * ```html
   * <ul>
   *   <li> some <span> more </span> </li>
   *   <li> words </li>
   * </ul>
   * ```
   * Into
   * ```html
   * <ul><!--
   *   --><li> some <span> more </span> </li><!--
   *   --><li> words </li><!--
   * --></ul>
   * ```
   */
  multiline?: boolean
  /** Trims text adjacent to elements (such as `<span>` or `<div>`). */
  elementSiblings?: boolean
  /**  Trims text adjacent to components (such as `<Component>` and `<svelte:component>`). */
  componentSiblings?: boolean
  /**
   * Trims text adjacent to mustache text expressions
   * (such as `{someVar}`).
   * Defaults to false, treating it the same way as the escaped text content would have been.
   */
  mustacheTextSiblings?: boolean
  /**
   * Trims text adjacent to mustache blocks
   * (such as `{#if boolean}{:else}{/if}`).
   * Defaults to true.
   */
  mustacheBlockSiblings?: boolean
  /**
   * Trims text adjacent to mustache @ directives
   * (such as `{@html '<br/>'}{@debug someVar}`).
   * Defaults to true.
   */
  mustacheDirectiveSiblings?: boolean
  /**
   * Ignore text contained within the specified dom nodes.
   * Note that top level style/script tags are
   * ***always ignored*** and are thus not
   * affected by this rule.
   */
  ignoreElements?: string[]
  /**
   * Ignore text contained within the svelte ast nodes
   * that match the filter.
   * Matches nothing by default.
   */
  ignoreFilter?: (node: INode ,parent: INode | undefined ,prop: string | undefined ,index: number ,ancestors: INode[])=>boolean
}

/**
 * Strips unwanted whitespace out of svelte files.
 * *Warning! Must be run on valid/pure svelte files!
 * You can run other preprocessors first via the sequential
 * preprocessor like so*
 * ```js
 * preprocess: sequentialPreprocessor(otherPreprocessors,stripWhitespace())
 * ```
 * @param passedOptions config options
 */

export function stripWhitespace(passedOptions: WhitespaceStripperOptions = {
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
}): PreprocessorGroup {
  const options: Required<WhitespaceStripperOptions> = {
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
  }
  Object.assign(options ,passedOptions)
  return {
    markup({ content ,filename }: {content:string ,filename:string}): Processed {
      const trimmings: Set<Text> = new Set()
      const ancestors: INode[] = [] // new Set()

      svelte.walk(svelte.parse(content ,{ filename }) ,{
        // <ParentType extends INode | undefined = INode|undefined, PropType extends string | undefined = ParentType extends INode ? Exclude<keyof ParentType,keyof BaseNode | number | symbol> : undefined>(this: {skip():void}, node: INode, parent: ParentType, prop: PropType , index: number) {
        // @ts-expect-error enter is overriden
        enter(node: INode ,parent: INode ,prop ,index) {
          // Ignore SFC Script and Style tags,
          // svelte:tagname's that do not accept elements,
          // and svelte:tagnames that aren't displayed.
          // Note this only affects root nodes.
          if (ancestors.length === 1) {
            // console.log('RootNode: ',node)
            if (['Script' ,'Style' ,'Options' ,'Body' ,'Window' ,'Head'].includes(node.type)) {
              this.skip()
              return
            }
          }

          // Ignore Comments
          if (node.type === 'Comment') {
            this.skip()
            return
          }

          // Ignore attributes/props. Current list of prop types includes: Action Animation Attribute Binding Class EventHandler Let Ref Transition
          if (prop === 'attributes' && ['Element' ,'InlineComponent'].includes(parent?.type as string)) {
            this.skip()
            return
          }

          // Ignore parameters of block statements
          if (!blockTypes.includes(node?.type as BlockTypes['type'])
          && prop !== 'children'
          && blockTypes.includes(parent?.type as BlockTypes['type'])) {
            // console.log('skipping ',node.type,'prop',prop)
            this.skip()
            return
          }

          // Ignore @ directives
          if (atDirectiveTypes.includes(parent?.type as DirectiveTypes['type'])) {
            this.skip()
            return
          }

          // Ignore nested script and style tags
          if (node.type === 'Element'
            && options.ignoreElements.includes(node.name)
          ) {
            this.skip()
            return
          }

          // Ignore custom. (could be used to ignore elements containing some attribute)
          if (options.ignoreFilter(node ,parent ,prop ,index ,ancestors)) {
            this.skip()
            return
          }

          // TODO: Add a option to match container's tags. Currently treated the same as siblings.
          const hasParent = parent != null
          const parentIsBlock = blockTypes.includes(parent?.type as BlockTypes['type'])
          const parentIsElement = parent?.type === 'Element'
          const parentIsComponent = parent?.type === 'InlineComponent'
          // @ts-expect-error unsafe member access
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const prevSibling: INode | undefined = parent?.[prop]?.[index - 1] as INode | undefined
          // @ts-expect-error unsafe member access
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const nextSibling: INode | undefined = parent?.[prop]?.[index + 1] as INode | undefined
          const hasNextSibling = hasParent && nextSibling !== undefined
          const hasPrevSibling = hasParent && prevSibling !== undefined

          // Next sibling is block if it is a block, or if it is empty (in which case we are closing this block)
          const nextSiblingIsBlock = (parentIsBlock && !hasNextSibling)
          || (hasNextSibling && blockTypes.includes(nextSibling?.type as BlockTypes['type']))
          // Prev sibling is block if it is a block, or if it is empty (in which case we are opening this block)
          const prevSiblingIsBlock = (parentIsBlock && !hasPrevSibling)
          || (hasPrevSibling && blockTypes.includes(prevSibling?.type as BlockTypes['type']))

          const nextSiblingIsElement = (parentIsElement && !hasNextSibling) || nextSibling?.type === 'Element'
          const prevSiblingIsElement = (parentIsElement && !hasPrevSibling) || prevSibling?.type === 'Element'

          const nextSiblingIsComponent = (parentIsComponent && !hasNextSibling) || nextSibling?.type === 'InlineComponent'
          const prevSiblingIsComponent = (parentIsComponent && !hasPrevSibling) || prevSibling?.type === 'InlineComponent'

          const nextSiblingIsMustacheTag = nextSibling?.type === 'MustacheTag'
          const prevSiblingIsMustacheTag = prevSibling?.type === 'MustacheTag'

          const nextSiblingIsDirectiveTag = atDirectiveTypes.includes(nextSibling?.type as DirectiveTypes['type'])
          const prevSiblingIsDirectiveTag = atDirectiveTypes.includes(prevSibling?.type as DirectiveTypes['type'])

          // TODO: I do not think there is ever a case where two Text nodes are side by side, but just in case
          const nextSiblingIsText = nextSibling?.type === 'Text'
          const prevSiblingIsText = prevSibling?.type === 'Text'

          // Fix broken ast. Puts all whitespace
          if (isNodeType<BlockTypes>(node ,blockTypes) && 'children' in node) {
            const openingTag = content.slice(node.start ,node.children?.[0]?.start ?? node.end)
            const closingTag = content.slice(node.children[node.children.length - 1]?.end ?? node.start ,node.end)
            const openingWhitespace = openingTag.endsWith('}') ? '' : openingTag.match(/(?:\s*)$/)?.[0]
            const closingWhitespace = closingTag.startsWith('{') ? '' : closingTag.match(/^(?:\s*)/)?.[0]
            if (openingWhitespace === undefined) throw new Error(`Error parsing opening tag ${JSON.stringify(openingTag)}`)
            if (closingWhitespace === undefined) throw new Error(`Error parsing closing tag ${JSON.stringify(closingTag)}`)

            if (openingWhitespace.length > 0) {
              if (isNodeType<Text>(node.children[0] ,['Text'])) {
                // @ts-expect-error start is assignable
                node.children[0].start = node.start + openingTag.length - openingWhitespace.length
                // @ts-expect-error raw is defined
                node.children[0].raw = `${openingWhitespace}${node.children[0].raw as string}`
                node.children[0].data = `${openingWhitespace}${node.children[0].data}`
              }
              else {
                node.children.unshift({
                  type: 'Text'
                  // @ts-expect-error raw is defined
                  ,raw: openingWhitespace
                  ,data: openingWhitespace
                  ,start: node.start + openingTag.length - openingWhitespace.length
                  ,end: node.start + openingTag.length
                })
              }
            }
            if (closingWhitespace.length > 0) {
              const lastChild = node.children[node.children.length - 1]
              if (isNodeType<Text>(lastChild ,['Text'])) {
                // @ts-expect-error end is assignable
                lastChild.end = node.end - closingTag.length + closingWhitespace.length
                // @ts-expect-error raw is defined
                lastChild.raw = `${lastChild.raw as string}${closingWhitespace}`
                lastChild.data = `${lastChild.data}${closingWhitespace}`
              }
              else {
                node.children.push({
                  type: 'Text'
                  // @ts-expect-error raw is defined
                  ,raw: closingWhitespace
                  ,data: closingWhitespace
                  ,start: node.end - closingTag.length
                  ,end: node.end - closingTag.length + closingWhitespace.length
                })
              }
            }
          }
          // Trim whitespace
          const inlineSpace = ' \f\t'
          const linebreakSpace = '\r\n'
          // FIXME: Dont include nonbreaking space. (is there a reason we type this instead of html escape)
          // const nonSpace = '\S'
          // FIXME: Option to Trim spaces inside of Text, such as those adjacent to nonbreaking whitespace
          // const nonbreakingWhitespace = '[]'
          if (node.type === 'Text') {
            const trimLeadingEnabled = (prevSiblingIsMustacheTag && options.mustacheTextSiblings)
            || (prevSiblingIsElement && options.elementSiblings)
            || (prevSiblingIsComponent && options.componentSiblings)
            || (prevSiblingIsBlock && options.mustacheBlockSiblings)
            || (prevSiblingIsDirectiveTag && options.mustacheDirectiveSiblings)
            const trimTrailingEnabled = (nextSiblingIsMustacheTag && options.mustacheTextSiblings)
            || (nextSiblingIsElement && options.elementSiblings)
            || (nextSiblingIsComponent && options.componentSiblings)
            || (nextSiblingIsBlock && options.mustacheBlockSiblings)
            || (nextSiblingIsDirectiveTag && options.mustacheDirectiveSiblings)
            //  Detect if sibling element type and trim appropriately
            if (trimLeadingEnabled && (
              // @ts-expect-error `raw` property is missing from interface
              (options.multiline && RegExp(`^[${inlineSpace}]*[${linebreakSpace}]`).test(node.raw))
              // @ts-expect-error `raw` property is missing from interface
              || (options.inline && RegExp(`^[${inlineSpace}]+(?:[^${linebreakSpace}]|$)`).test(node.raw))
            )) {
              const leadingSpaceRE = RegExp(`^([${inlineSpace}${linebreakSpace}]*)`)
              if (options.removalMethod === 'strip') {
                // @ts-expect-error `raw` property is missing from interface
                node.raw = (node.raw as string).replace(leadingSpaceRE ,'')
              }
              else if (options.removalMethod === 'comment') {
                // @ts-expect-error `raw` property is missing from interface
                node.raw = (node.raw as string).replace(leadingSpaceRE ,'<!--$1-->')
              }
              else {
                throw new Error(`Failed to handel removalMethod: ${JSON.stringify(options.removalMethod)}`)
              }
              trimmings.add(node)
            }
            if (trimTrailingEnabled && (
              // @ts-expect-error `raw` property is missing from interface
              (options.multiline && RegExp(`[${linebreakSpace}][${inlineSpace}]*$`).test(node.raw))
              // @ts-expect-error `raw` property is missing from interface
              || (options.inline && RegExp(`(?:^|[^${linebreakSpace}])[${inlineSpace}]+$`).test(node.raw))
            )) {
              const trailingSpaceRE = RegExp(`([${inlineSpace}${linebreakSpace}]*)$`)
              if (options.removalMethod === RemovalMethod.Strip) {
                // @ts-expect-error `raw` property is missing from interface
                node.raw = (node.raw as string).replace(trailingSpaceRE ,'')
              }
              else if (options.removalMethod === RemovalMethod.Comment) {
                // @ts-expect-error `raw` property is missing from interface
                node.raw = (node.raw as string).replace(trailingSpaceRE ,'<!--$1-->')
              }
              else {
                throw new Error(`Failed to handel removalMethod: ${JSON.stringify(options.removalMethod)}`)
              }
              trimmings.add(node)
            }
          }
          // Ensure new mustache syntax hasn't been added/used
          else if (node.type === 'MustacheTag') {
            // handled
          }
          else if (atDirectiveTypes.includes(node.type as DirectiveTypes['type'])) {
            // handled
          }
          else if (blockTypes.includes(node.type as BlockTypes['type'])) {
            // handled
          }
          else if (content.substring(node.start ,node.end).startsWith('{')) {
            throw new Error(`Unsupported mustache syntax detected!\nNode type: ${JSON.stringify(node.type)}\nText: ${JSON.stringify(content.substring(node.start ,node.end))}\nAnscestors: ${JSON.stringify(ancestors.map((e) => e.type))}\nProp: ${prop}`)
          }
          ancestors.push(node)
        }
        ,leave(node) {
          if (ancestors.length < 1) {
            throw new Error('Attempted to leave a node not in the ancestor list!')
          }
          ancestors.pop()
        }
      })
      let newCode = content
      for (const node of Array.from(trimmings).reverse()) {
        // @ts-expect-error `raw` property is missing from interface
        newCode = spliceSlice(newCode ,node.start ,node.end - node.start ,node.raw)
      }
      return { code: newCode }
    }
  }
}

/**
 * Runs the passed preprocessors lists in sequence.
 * Meaning All `markup`, `script`, and `style` preprocessors
 * of group 1 will run before any preprocessor of group 2.
 * @param preprocessorLists The preprocessors to run. Each group will invoke `svelte.preprocess()` witht the preprocessed output of the previous group.
 */

export function sequentialPreprocessor(...preprocessorLists: (PreprocessorGroup|PreprocessorGroup[])[]): PreprocessorGroup {
  return {
    async markup({ content ,filename }): Promise<Processed> {
      const result: {code:string ,dependencies: string[]} = {
        code: content ,dependencies: []
      }
      for (const preprocessors of preprocessorLists) {
        if (preprocessors != null) {
          // eslint-disable-next-line no-await-in-loop
          const newResult = await svelte.preprocess(
            result.code
            ,preprocessors
            ,{ filename }
          )
          result.code = newResult.code
          result.dependencies = [...result.dependencies ,...newResult.dependencies as string[]]
        }
      }
      return result
    }
  }
}

/*
function svelteStripperPreprocessor(preprocessors: PreprocessorGroup|PreprocessorGroup[] ,options?: WhitespaceStripperOptions) {
  return sequentialPreprocessor(preprocessors ,stripWhitespace(options))
}
*/
