import { articles } from "@/app/homepage/insight/data";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export default function InsightPage({ params }: Props) {
  const article = articles?.find((item) => item.slug === params.slug);
  if (!article) return notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">{article?.title}</h1>

      <p className="text-sm text-gray-500 mb-6">
        {article?.date} • {article?.readTime}
      </p>

      <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
        <Image
          src={article?.image}
          alt={article?.title}
          fill
          className="object-cover"
        />
      </div>

      <p className="text-gray-700 leading-relaxed">{article?.excerpt}</p>
    </article>
  );
}
