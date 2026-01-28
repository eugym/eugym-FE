import ArticleCard from "@/components/cards/ArticleCard";
import Navbar from "@/components/layout/NavBar";
import { articles } from "./data";

const Insight = () => {
  const links = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/" },
    { name: "Services", href: "/" },
    { name: "Trainers", href: "/" },
    { name: "Store", href: "/" },
    { name: "Insights", href: "#" },
  ];
  return (
    <>
      <Navbar navLinks={links} />
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Latest Articles</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article?.slug} article={article} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Insight;
