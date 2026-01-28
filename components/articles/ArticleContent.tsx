import { ReactNode } from "react";

interface ArticleContentProps {
  children: ReactNode;
}

export default function ArticleContent({ children }: ArticleContentProps) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-gray-900">
      {children}
    </div>
  );
}
