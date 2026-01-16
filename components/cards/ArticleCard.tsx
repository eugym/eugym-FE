import { Article } from "@/app/homepage/insight/data";
import Image from "next/image";
import Link from "next/link";

export interface Props {
  article: Article;
}

export default function ArticleCard({ article }: Props) {
  return (
    <div className="bg-white border border-amber-200 rounded-lg overflow-hidden hover:shadow-md transition">
      {/* Image */}
      <div className="relative h-48">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
          {article.category}
        </span>

        <h3 className="font-semibold text-gray-900">{article.title}</h3>

        <p className="text-sm text-gray-500">
          {article.date} • {article.readTime}
        </p>

        <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>

        <Link
          href={`/homepage/insight/${article.slug}`}
          className="text-sm text-green-700 font-medium"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}
