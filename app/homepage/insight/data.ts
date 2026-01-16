import image from "@/public/images/insightImg.jpg";
import { StaticImageData } from "next/image";

export interface Article {
  title: string;
  excerpt: string;
  image: string | StaticImageData;
  category: string;
  readTime: string;
  date: string;
  slug: string;
}

export const articles: Article[] = [
  {
    title: "Nigerian Superfoods for Maximum Athletic Performance",
    excerpt:
      "Explore local Nigerian foods that can supercharge your workouts and recovery.",
    image: image,
    category: "Nutrition",
    readTime: "5 mins read",
    date: "Dec 27, 2025",
    slug: "nigerian-superfoods-athletic-performance",
  },

  {
    title: "Nigerian Superfoods for Maximum Athletic Performance",
    excerpt:
      "Explore local Nigerian foods that can supercharge your workouts and recovery.",
    image: image,
    category: "Nutrition",
    readTime: "5 mins read",
    date: "Dec 27, 2025",
    slug: "nigerian-superfoods-athletic-performance2",
  },

  {
    title: "Nigerian Superfoods for Maximum Athletic Performance",
    excerpt:
      "Explore local Nigerian foods that can supercharge your workouts and recovery.",
    image: image,
    category: "Nutrition",
    readTime: "5 mins read",
    date: "Dec 27, 2025",
    slug: "nigerian-superfoods-athletic-performance3",
  },
];
