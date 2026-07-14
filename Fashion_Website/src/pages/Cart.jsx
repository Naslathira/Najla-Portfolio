import { Link } from "react-router-dom"

function Cart() {
  return (
    <section className="px-8 py-24 text-center">
      <h1 className="text-4xl font-semibold">Your Cart</h1>
      <p className="mt-4 text-gray-500">Your cart is empty.</p>
      <Link className="inline-block mt-8 rounded-full bg-pink-500 px-8 py-3 text-white" to="/shop">
        Continue Shopping
      </Link>
    </section>
  )
}

export default Cart
