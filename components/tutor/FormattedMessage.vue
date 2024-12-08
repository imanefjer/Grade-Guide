<template>
  <div class="formatted-message" v-html="formattedContent"></div>
</template>

<script setup>
import { marked } from 'marked'
import katex from 'katex'
import hljs from 'highlight.js'

// Import styles for Katex and Highlight.js (ensure they are included in your project)
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github.css'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

// Configure marked for syntax highlighting
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  }
})

// Function to process LaTeX within HTML content
const processLatex = (html) => {
  if (typeof html !== 'string') return html

  // Handle inline LaTeX (\(...\) or $...$)
  html = html.replace(/\\\(([\s\S]+?)\\\)|\$([^\$]+?)\$/g, (_, parens, dollars) => {
    try {
      const tex = parens || dollars
      return katex.renderToString(tex.trim(), {
        displayMode: false,
        throwOnError: false
      })
    } catch (e) {
      console.error('LaTeX parsing error:', e)
      return parens ? `\\(${parens}\\)` : `$${dollars}$`
    }
  })

  // Handle display LaTeX (\[...\] or [...] if it's standalone)
  html = html.replace(/\\\[([\s\S]+?)\\\]|\[(.+?)\]/g, (_, brackets, plainBrackets) => {
    const tex = brackets || plainBrackets
    try {
      return katex.renderToString(tex.trim(), {
        displayMode: true,
        throwOnError: false
      })
    } catch (e) {
      console.error('LaTeX parsing error:', e)
      return brackets ? `\\[${brackets}\\]` : `[${plainBrackets}]`
    }
  })

  return html
}

// Compute formatted content
const formattedContent = computed(() => {
  try {
    const htmlContent = marked(props.content)
    return processLatex(htmlContent)
  } catch (e) {
    console.error('Markdown parsing error:', e)
    return props.content
  }
})
</script>

<style scoped>
/* General formatting */
.formatted-message {
  line-height: 1.6;
  font-size: 1rem;
  color: #333;
}

.formatted-message :deep(pre) {
  background-color: #f7f7f9;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  overflow-x: auto;
}

.formatted-message :deep(code) {
  background-color: #f7f7f9;
  padding: 0.2rem 0.4rem;
  border-radius: 0.3rem;
  font-family: ui-monospace, monospace;
}

.formatted-message :deep(p) {
  margin: 0.5rem 0;
}

.formatted-message :deep(ul),
.formatted-message :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.formatted-message :deep(ul) {
  list-style-type: disc;
}

.formatted-message :deep(ol) {
  list-style-type: decimal;
}

.formatted-message :deep(blockquote) {
  border-left: 4px solid #e2e8f0;
  padding-left: 1rem;
  margin: 1rem 0;
  color: #4a5568;
  background-color: #f9f9f9;
}

.formatted-message :deep(.katex-display) {
  margin: 1rem 0;
  overflow-x: auto;
}

.formatted-message :deep(.katex) {
  font-size: 1rem;
  line-height: 1.5;
}
</style>
