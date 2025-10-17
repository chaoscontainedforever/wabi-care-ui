"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Table,
  Undo,
  Redo,
  Type,
  Palette,
  MoreHorizontal
} from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start typing your report...",
  className = ""
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [fontSize, setFontSize] = useState("14")
  const [fontFamily, setFontFamily] = useState("Arial")
  const [textColor, setTextColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")

  // Execute command helper
  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    updateContent()
  }, [])

  // Update content
  const updateContent = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  // Handle input
  const handleInput = useCallback(() => {
    updateContent()
  }, [updateContent])

  // Handle paste
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    updateContent()
  }, [updateContent])

  // Format buttons
  const formatButtons = [
    { icon: Bold, command: 'bold', title: 'Bold' },
    { icon: Italic, command: 'italic', title: 'Italic' },
    { icon: Underline, command: 'underline', title: 'Underline' },
    { icon: Strikethrough, command: 'strikeThrough', title: 'Strikethrough' },
  ]

  const alignmentButtons = [
    { icon: AlignLeft, command: 'justifyLeft', title: 'Align Left' },
    { icon: AlignCenter, command: 'justifyCenter', title: 'Align Center' },
    { icon: AlignRight, command: 'justifyRight', title: 'Align Right' },
    { icon: AlignJustify, command: 'justifyFull', title: 'Justify' },
  ]

  const listButtons = [
    { icon: List, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Numbered List' },
  ]

  const otherButtons = [
    { icon: Quote, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: Code, command: 'formatBlock', value: 'pre', title: 'Code Block' },
  ]

  // Insert link
  const insertLink = useCallback(() => {
    const url = prompt('Enter URL:')
    if (url) {
      executeCommand('createLink', url)
    }
  }, [executeCommand])

  // Insert table
  const insertTable = useCallback(() => {
    const rows = prompt('Number of rows:', '3')
    const cols = prompt('Number of columns:', '3')
    if (rows && cols) {
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">'
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>'
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="padding: 8px; border: 1px solid #ccc;">&nbsp;</td>'
        }
        tableHTML += '</tr>'
      }
      tableHTML += '</table>'
      executeCommand('insertHTML', tableHTML)
    }
  }, [executeCommand])

  // Insert image
  const insertImage = useCallback(() => {
    const url = prompt('Enter image URL:')
    if (url) {
      executeCommand('insertImage', url)
    }
  }, [executeCommand])

  // Set content when prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b p-2 bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Font Controls */}
          <div className="flex items-center gap-2">
            <Select value={fontFamily} onValueChange={setFontFamily}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="18">18</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="24">24</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Format Buttons */}
          {formatButtons.map(({ icon: Icon, command, title }) => (
            <Button
              key={command}
              size="sm"
              variant="outline"
              onClick={() => executeCommand(command)}
              title={title}
              className="h-8 w-8 p-0"
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}

          <div className="w-px h-6 bg-gray-300" />

          {/* Alignment Buttons */}
          {alignmentButtons.map(({ icon: Icon, command, title }) => (
            <Button
              key={command}
              size="sm"
              variant="outline"
              onClick={() => executeCommand(command)}
              title={title}
              className="h-8 w-8 p-0"
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}

          <div className="w-px h-6 bg-gray-300" />

          {/* List Buttons */}
          {listButtons.map(({ icon: Icon, command, title }) => (
            <Button
              key={command}
              size="sm"
              variant="outline"
              onClick={() => executeCommand(command)}
              title={title}
              className="h-8 w-8 p-0"
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}

          <div className="w-px h-6 bg-gray-300" />

          {/* Other Buttons */}
          {otherButtons.map(({ icon: Icon, command, value, title }) => (
            <Button
              key={title}
              size="sm"
              variant="outline"
              onClick={() => executeCommand(command, value)}
              title={title}
              className="h-8 w-8 p-0"
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}

          <div className="w-px h-6 bg-gray-300" />

          {/* Insert Buttons */}
          <Button
            size="sm"
            variant="outline"
            onClick={insertLink}
            title="Insert Link"
            className="h-8 w-8 p-0"
          >
            <Link className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={insertImage}
            title="Insert Image"
            className="h-8 w-8 p-0"
          >
            <Image className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={insertTable}
            title="Insert Table"
            className="h-8 w-8 p-0"
          >
            <Table className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300" />

          {/* Undo/Redo */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => executeCommand('undo')}
            title="Undo"
            className="h-8 w-8 p-0"
          >
            <Undo className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => executeCommand('redo')}
            title="Redo"
            className="h-8 w-8 p-0"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={`min-h-[400px] p-4 focus:outline-none ${
          isFocused ? 'ring-2 ring-pink-500' : ''
        }`}
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          fontFamily: fontFamily,
          fontSize: `${fontSize}px`,
          color: textColor,
          backgroundColor: backgroundColor,
          lineHeight: '1.6'
        }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #999;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}
