import ProductCard from "../components/ProductCard"
import { categories, products } from "../data/products"
import { useSearchParams } from "react-router-dom"

function Shop() {
  const [searchParams] = useSearchParams()
  const selectedCategory = searchParams.get("category")
  const category = categories.find((item) => item.slug === selectedCategory)

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categorySlug === selectedCategory)
    : products

  return (
    <section className="px-8 py-16">
      <h1 className="text-4xl font-semibold">
        {selectedCategory
          ? category?.name || "Unknown Category"
          : "Shop Collection"}
      </h1>

      <p className="mt-3 text-gray-500">
        Explore our activewear collection.
      </p>

      {filteredProducts.length === 0 ? (
        <p className="mt-10 text-gray-500">
          No products available in this category yet.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Shop
