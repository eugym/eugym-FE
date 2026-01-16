import { articles } from "@/app/homepage/insight/data";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;

  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article>
        <h1 className="text-3xl font-bold mb-4">{article?.title}</h1>

        <p className="text-sm text-gray-500 mb-6">
          {article?.date} • {article?.readTime}
        </p>

        <div className="relative h-82 mb-6 rounded-lg overflow-hidden">
          <Image
            src={article?.image}
            alt={article?.title}
            fill
            className="object-cover"
          />
        </div>

        <p className="text-gray-700 leading-relaxed">{article?.excerpt}</p>
      </article>

      <Link
        href="/homepage/insight"
        className="mt-6 inline-flex items-center gap-2 text-accent hover:cursor-pointer px-4 py-2 text-sm font-medium hover:bg-gray-100"
      >
        ← Go Back
      </Link>
    </div>
  );
}
