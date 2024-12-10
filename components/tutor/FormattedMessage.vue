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
/* General formatting */
.formatted-message {
  line-height: 1.6;
  font-size: 1rem;
  color: #333;
}

.formatted-message :deep(pre) {
  margin: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
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
  overflow-x: visible;
  max-width: 100%;
  font-size: 0.9rem;
}

.formatted-message :deep(.katex) {
  font-size: 1rem;
  line-height: 1.5;
  white-space: normal;
}

.formatted-message :deep(.katex-html) {
  max-width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

/* Add these new styles */
.code-block-wrapper {
  position: relative;
  margin: 1rem 0;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2d2d2d;
  padding: 0.5rem 1rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  color: #e1e1e1;
}

.code-language {
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
  text-transform: lowercase;
}

.copy-button {
  background: transparent;
  border: none;
  color: #e1e1e1;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.copy-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.copy-icon, .check-icon {
  display: block;
}
</style>
