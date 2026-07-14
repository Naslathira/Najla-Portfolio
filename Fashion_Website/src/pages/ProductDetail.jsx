import { useState } from "react"
import { products } from "../data/products"
import SizeAssistantModal from "../components/SizeAssistantModal"
import { useParams } from "react-router-dom"

function ProductDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { productId } = useParams()
  const numericProductId = Number(productId)
  const product = products.find((item) => item.id === numericProductId)
  
  if (!product) {
    return <p className="p-8">Product not found.</p>
  }
  
  const sizeChartRows = Object.entries(product.sizeChart).map(([size, chart]) => (
      <tr key={size}>
        <td className="text-center">{size}</td>
        <td className="text-center">{chart.bust[0]}-{chart.bust[1]}</td>
        <td className="text-center">{chart.waist[0]}-{chart.waist[1]}</td>
        <td className="text-center">{chart.hip[0]}-{chart.hip[1]}</td>
      </tr>
  ))
  
  return (
    <section className="px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="h-[500px] rounded-3xl bg-pink-50 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-8"
        />
      </div>
      
      <div>
        <p className="text-sm text-gray-500">{product.category}</p>
        
        <h1 className="mt-2 text-4xl font-semibold">{product.name}</h1>
        
        <p className="mt-4 text-2xl font-medium">${product.price}</p>
        
        <p className="mt-6 text-gray-600 max-w-md">
          {product.description}
        </p>
        
        <div className="mt-8">
          <p className="font-medium">Available Sizes</p>
          
          <table className="border border-pink-500 w-full text-center">
            <thead className="bg-pink-50">
              <tr>
                <th className="text-center">Size</th>
                <th className="text-center">Bust</th>
                <th className="text-center">Waist</th>
                <th className="text-center">Hip</th>
              </tr>
            </thead>
            <tbody>
              {sizeChartRows}
            </tbody>
          </table>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-8 w-full md:w-auto bg-pink-500 text-white px-8 py-3 rounded-full"
        >
          Help Me Find My Size
        </button>
      </div>
      
      {isModalOpen && (
        <SizeAssistantModal
          product={product}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  )
}
export default ProductDetail
