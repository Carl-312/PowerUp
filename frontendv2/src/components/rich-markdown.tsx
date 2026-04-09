import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

interface RichMarkdownProps {
  content: string;
}

const markdownComponents: Components = {
  a: ({ node: _node, ...props }) => <a {...props} rel="noreferrer" target="_blank" />,
};

export const RichMarkdown = ({ content }: RichMarkdownProps) => (
  <div className="markdown-body">
    <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  </div>
);
