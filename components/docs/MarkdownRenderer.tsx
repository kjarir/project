'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Initialize markdown parser and renderer
    // For a production app, you would use a library like marked, remark, or react-markdown
    // For this demo, we'll use a simplified approach with regex for basic formatting
    if (containerRef.current) {
      const html = parseMarkdown(content)
      containerRef.current.innerHTML = html
      
      // Apply syntax highlighting to code blocks
      // In a real app, you would use a library like Prism.js or highlight.js
      const codeBlocks = containerRef.current.querySelectorAll('pre code')
      codeBlocks.forEach(block => {
        block.classList.add('bg-muted', 'p-4', 'rounded-md', 'overflow-x-auto', 'block')
      })
    }
  }, [content])
  
  // A very simple markdown parser for demo purposes
  // In a real app, use a proper markdown library
  const parseMarkdown = (markdown: string): string => {
    let html = markdown
    
    // Headers
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>')
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-5 mb-3">$1</h3>')
    
    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
    
    // Lists
    html = html.replace(/^\- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
    html = html.replace(/^\d\. (.*$)/gm, '<li class="ml-6 list-decimal">$1</li>')
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
    
    // Paragraphs
    html = html.replace(/^\s*(?!<h|<ul|<li|<pre|<p|<\/)(.*$)/gm, '<p class="mb-4">$1</p>')
    
    return html
  }
  
  return (
    <div 
      ref={containerRef} 
      className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}
    />
  )
}