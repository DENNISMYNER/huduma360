import { Link } from "react-router-dom";
import type { Category } from "../../types/category";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link to={`/categories/${category.slug}`} className="category-card">
      <div className="category-card-icon">{category.icon}</div>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <span className="category-card-count">{category._count?.services ?? 0} services &rarr;</span>
    </Link>
  );
}
