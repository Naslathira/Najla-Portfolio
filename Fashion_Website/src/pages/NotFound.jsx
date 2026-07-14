import { Link } from "react-router-dom"

function NotFound() {
  return (
    <section className="px-8 py-24 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-pink-400">404</p>
      <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
      <p className="mt-4 text-gray-500">The page you requested does not exist.</p>
      <Link className="inline-block mt-8 rounded-full bg-pink-500 px-8 py-3 text-white" to="/">
        Return Home
      </Link>
    </section>
  )
}

export default NotFound
