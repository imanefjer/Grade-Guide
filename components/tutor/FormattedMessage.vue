<template>
  <div class="formatted-message prose prose-sm max-w-none" v-html="formattedContent"></div>
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

// Add copy button to code blocks
const addCopyButton = (html) => {
  return html.replace(/<pre><code class="(.*?)">([\s\S]*?)<\/code><\/pre>/g, 
    (match, language, code) => {
      return `
        <div class="code-block-wrapper">
          <div class="code-header">
            <span class="code-language">${language}</span>
            <button class="copy-button" onclick="copyCode(this)">
              <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
          <pre><code class="${language}">${code}</code></pre>
        </div>
      `
    }
  )
}

// Configure marked for syntax highlighting
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  }
})

// Function to process LaTeX within content
const processLatex = (content) => {
  if (typeof content !== 'string') return content

  // First handle display LaTeX (\[...\])
  content = content.replace(/\\\[([\s\S]+?)\\\]/g, (match, tex) => {
    try {
      return katex.renderToString(tex.trim(), {
        displayMode: true,
        throwOnError: false
      })
    } catch (e) {
      console.error('Display LaTeX parsing error:', e)
      return match
    }
  })

  // Then handle inline LaTeX (\(...\))
  content = content.replace(/\\\(([\s\S]+?)\\\)/g, (match, tex) => {
    try {
      return katex.renderToString(tex.trim(), {
        displayMode: false,
        throwOnError: false
      })
    } catch (e) {
      console.error('Inline LaTeX parsing error:', e)
      return match
    }
  })

  return content
}

// Compute formatted content
const formattedContent = computed(() => {
  try {
    // First process LaTeX in the raw content
    let processedContent = processLatex(props.content)
    // Then convert markdown to HTML
    const htmlContent = marked(processedContent)
    // Finally add copy buttons to code blocks
    return addCopyButton(htmlContent)
  } catch (e) {
    console.error('Content processing error:', e)
    return props.content
  }
})

// Add this script to the page
onMounted(() => {
  if (!window.copyCode) {
    window.copyCode = (button) => {
      const codeBlock = button.closest('.code-block-wrapper').querySelector('code')
      const code = codeBlock.innerText
      
      navigator.clipboard.writeText(code).then(() => {
        const originalHTML = button.innerHTML
        button.innerHTML = `
          <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `
        setTimeout(() => {
          button.innerHTML = originalHTML
        }, 2000)
      })
    }
  }
})
</script>

<style scoped>
.formatted-message :deep(pre) {
  @apply m-0 rounded-t-none bg-gray-800;
}

.formatted-message :deep(code) {
  @apply bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800;
}

.formatted-message :deep(pre code) {
  @apply bg-transparent text-gray-100;
}

.formatted-message :deep(p) {
  @apply my-2 text-gray-800;
}

.formatted-message :deep(ul),
.formatted-message :deep(ol) {
  @apply my-2 pl-6 text-gray-800;
}

.formatted-message :deep(blockquote) {
  @apply border-l-4 border-gray-200 pl-4 my-4 text-gray-600 bg-gray-50 py-2 rounded-r;
}

.code-block-wrapper {
  @apply relative my-4 rounded-xl overflow-hidden shadow-sm;
}

.code-header {
  @apply flex justify-between items-center bg-gray-800 px-4 py-2;
}

.code-language {
  @apply font-mono text-sm text-gray-300 lowercase;
}

.copy-button {
  @apply p-1.5 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors;
}

.copy-icon,
.check-icon {
  @apply w-4 h-4;
}
</style>
