import { describe, it } from 'vitest'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { createHead, setHeadInjectionHandler, useHead } from '@unhead/vue'

describe('resolveTags', () => {
  it('basic resolve tags', async () => {
    const head = createHead()
    setHeadInjectionHandler(() => head)

    useHead({
      htmlAttrs: { class: 'first-class' },
    })

    useHead({
      htmlAttrs: { class: 'second-class' },
    })

    const tags = await head.resolveTags()
    expect(tags).toMatchInlineSnapshot(`
      [
        {
          "_d": "htmlAttrs",
          "_e": 0,
          "_p": 0,
          "props": {
            "class": "first-class second-class",
          },
          "tag": "htmlAttrs",
        },
      ]
    `)
  })

  it('conditional classes', async () => {
    const head = createHead()
    setHeadInjectionHandler(() => head)

    const theme: Ref<'dark' | 'light'> = ref('dark')

    useHead({
      htmlAttrs: {
        class: {
          'layout-theme-dark': () => theme.value === 'dark',
          'layout-theme-light': () => theme.value === 'light',
        },
      },
      bodyAttrs: {
        class: ['test', () => `theme-${theme.value}`],
      },
    })

    const page: Ref<{ name: string }> = ref({ name: 'home' })
    useHead({
      htmlAttrs: {
        class: () => page.value.name,
      },
    })

    const tags = await head.resolveTags()
    expect(tags).toMatchInlineSnapshot(`
      [
        {
          "_d": "htmlAttrs",
          "_e": 0,
          "_p": 0,
          "props": {
            "class": "layout-theme-dark home",
          },
          "tag": "htmlAttrs",
        },
        {
          "_d": "bodyAttrs",
          "_e": 0,
          "_p": 1,
          "props": {
            "class": "test theme-dark",
          },
          "tag": "bodyAttrs",
        },
      ]
    `)
  })
  it('basic resolve tags', async () => {
    const head = createHead()
    setHeadInjectionHandler(() => head)

    useHead({
      htmlAttrs: { class: 'first-class' },
    })

    useHead({
      htmlAttrs: { class: 'second-class', tagDuplicateStrategy: 'replace' },
    })

    const tags = await head.resolveTags()
    expect(tags).toMatchInlineSnapshot(`
      [
        {
          "_d": "htmlAttrs",
          "_e": 1,
          "_p": 1024,
          "props": {
            "class": "second-class",
          },
          "tag": "htmlAttrs",
          "tagDuplicateStrategy": "replace",
        },
      ]
    `)
  })
  it('resolve multiple conditional classes entries', async () => {
    const head = createHead()
    setHeadInjectionHandler(() => head)

    useHead({
      htmlAttrs: {
        class: {
          someTrue: true,
        },
      },
    })

    useHead({
      htmlAttrs: {
        class: ['someArrayClass'],
      },
    })

    useHead({
      htmlAttrs: {
        class: {
          someFalsy: false,
        },
      },
    })

    useHead({
      htmlAttrs: {
        class: [],
      },
    })

    useHead({
      htmlAttrs: {
        class: '',
      },
    })

    const tags = await head.resolveTags()
    expect(tags).toMatchInlineSnapshot(`
      [
        {
          "_d": "htmlAttrs",
          "_e": 0,
          "_p": 0,
          "props": {
            "class": "someTrue someArrayClass",
          },
          "tag": "htmlAttrs",
        },
      ]
    `)
  })
})
