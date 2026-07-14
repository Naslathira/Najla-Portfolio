import { Link } from "react-router-dom"

function Home() {
  return (
    <section className="px-8 py-24 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
        Women Activewear
      </p>

      <h1 className="mt-5 text-5xl md:text-7xl font-semibold">
        Elegant Activewear,
        <br />
        Made to Fit You
      </h1>

      <p className="mt-6 max-w-xl mx-auto text-gray-500">
        Discover soft, feminine, and comfortable activewear with an AI-powered
        size assistant.
      </p>

      <Link
        to="/shop"
        className="inline-block mt-10 bg-pink-500 text-white px-8 py-3 rounded-full"
      >
        Shop Collection
      </Link>
    </section>
  )
}

export default Home
