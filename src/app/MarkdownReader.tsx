import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export type MarkdownReaderProps = {
    content: string
    onClose: () => void
}

export function MarkdownReader({ content, onClose }: MarkdownReaderProps) {
    return (
        <div className="markdown-reader-container">
            <button className="md-back-btn" onClick={onClose}>
                ← Back to Blogs
            </button>
            <div className="markdown-reader-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
        </div>
    )
}
