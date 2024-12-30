<template>
  <div class="formatted-message prose prose-sm max-w-none" v-html="renderedContent"></div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

const md = new MarkdownIt({
  html: false,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<div class="code-block-wrapper group">
          <div class="code-header">
            <span class="language-label">${lang}</span>
            <button class="copy-button" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.querySelector('code').textContent)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span class="ml-1">Copy</span>
            </button>
          </div>
          <pre class="code-block !m-0 !p-0"><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang }).value}</code></pre>
        </div>`
      } catch (__) {}
    }
    return `<pre class="code-block !m-0 !p-0"><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`
  }
})

const renderedContent = computed(() => {
  // Clean up the content by removing line numbers and fixing code blocks
  let cleanContent = props.content
    .replace(/^\d+\|/gm, '') // Remove line numbers
    .replace(/```(\w+):\S+\s/g, '```$1\n') // Clean file paths in code blocks
    .replace(/startLine: \d+\s*endLine: \d+/g, '') // Remove start/end line markers

  return md.render(cleanContent)
})
</script>

<style>
.formatted-message {
  @apply leading-relaxed space-y-4;
}

.formatted-message h1,
.formatted-message h2,
.formatted-message h3,
.formatted-message h4,
.formatted-message h5,
.formatted-message h6 {
  @apply font-semibold text-gray-900 mt-8 mb-4;
}

.formatted-message h1 {
  @apply text-3xl;
}

.formatted-message h2 {
  @apply text-2xl;
}

.formatted-message h3 {
  @apply text-xl;
}

.formatted-message p {
  @apply mb-4 leading-7;
}

.formatted-message ul,
.formatted-message ol {
  @apply mb-6 pl-6 space-y-2 text-current;
}

.formatted-message ul {
  @apply list-disc marker:text-blue-500;
}

.formatted-message ol {
  @apply list-decimal marker:text-blue-500 marker:font-semibold;
}

.formatted-message li {
  @apply mb-2 text-current;
}

.code-block-wrapper {
  @apply bg-[#1a1b26] rounded-lg overflow-hidden shadow-lg;
}

.code-header {
  @apply flex items-center justify-between px-4 py-2 border-b border-gray-700/30 bg-gray-800/30;
}

.language-label {
  @apply text-xs text-gray-400 font-mono uppercase tracking-wider;
}

.copy-button {
  @apply text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded-md
         opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all duration-200 active:scale-95;
}

.code-block {
  @apply overflow-x-auto bg-[#1a1b26];
}

.code-block code {
  @apply block font-mono text-sm p-4 text-gray-300;
}

/* .formatted-message code:not(.hljs) {
  @apply font-mono text-sm px-2 py-0.5 rounded-md bg-gray-100 text-gray-900 border border-gray-200;
} */

.formatted-message blockquote {
  @apply pl-4 border-l-4 border-current bg-white/10 text-current p-6 rounded-r-xl my-6
         shadow-sm relative overflow-hidden;
}

.formatted-message blockquote::before {
  content: '"';
  @apply absolute -top-2 left-4 text-6xl text-blue-200/50 font-serif;
}
.formatted-message a {
  @apply text-blue-600 hover:text-blue-800 underline decoration-blue-300 underline-offset-2
         transition-colors duration-200;
}

.formatted-message table {
  @apply w-full border-collapse my-6 rounded-lg overflow-hidden shadow-sm;
}

.formatted-message th {
  @apply bg-gray-50 text-left font-semibold text-gray-700 px-6 py-3 border-b-2 border-gray-200;
}

.formatted-message td {
  @apply px-6 py-4 border-b border-gray-200 text-gray-600;
}

.formatted-message tr:hover td {
  @apply bg-gray-50 transition-colors duration-150;
}

.hljs {
  @apply !bg-transparent;
}

/* Task list styles */
.task-list-item {
  @apply list-none flex items-center gap-2 -ml-6;
}

.task-list-item-checkbox {
  @apply w-4 h-4 rounded border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500
         focus:ring-2 focus:ring-blue-500/20 transition-all duration-200;
}

/* Emoji styles */
.emoji {
  @apply inline-block align-middle text-xl;
}

/* Add a subtle hover effect to code blocks */
.code-block-wrapper:hover {
  @apply shadow-2xl shadow-gray-900/10;
}

/* Add syntax highlighting theme overrides */
.hljs-keyword,
.hljs-function {
  @apply text-purple-400;
}

.hljs-string {
  @apply text-green-400;
}

.hljs-comment {
  @apply text-gray-500 italic;
}

.hljs-number {
  @apply text-orange-400;
}

.hljs-operator {
  @apply text-sky-400;
}

.hljs-punctuation {
  @apply text-gray-400;
}

.hljs-property {
  @apply text-blue-400;
}

.hljs-variable {
  @apply text-rose-400;
}

/* Add specific color overrides for code blocks and other elements inside user messages */
.formatted-message code:not(.hljs) {
  @apply text-current;
}

.formatted-message ul,
.formatted-message ol {
  @apply mb-6 pl-6 space-y-2 text-current;
}

.formatted-message li {
  @apply mb-2 text-current;
}

.formatted-message blockquote {
  @apply pl-4 border-l-4 border-current bg-white/10 text-current p-6 rounded-r-xl my-6
         shadow-sm relative overflow-hidden;
}

.formatted-message a {
  @apply text-current hover:opacity-80 underline decoration-2 underline-offset-2 transition-colors duration-200;
}
</style>
