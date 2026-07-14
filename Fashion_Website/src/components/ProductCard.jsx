import { Link } from "react-router-dom"

function ProductCard({ product }) {

  return (

    <Link
      to={`/product/${product.id}`}
      className="
      block
      border
      rounded-2xl
      p-5
      hover:shadow-lg
      transition
      bg-white
      "
    >


      <div
        className="
        h-80
        rounded-xl
        bg-pink-50
        flex
        items-center
        justify-center
        overflow-hidden
        "
      >

        <img
          src={product.image}
          alt={product.name}

          className="
          w-full
          h-full
          object-contain
          p-6
          "
        />


      </div>


      <div className="mt-5">

        <p className="text-sm text-gray-500">
          {product.category}
        </p>


        <h3 className="mt-1 text-lg font-medium">

          {product.name}

        </h3>


        <p className="mt-3 font-semibold">

          ${product.price}

        </p>

      </div>


    </Link>

  )

}


export default ProductCard
