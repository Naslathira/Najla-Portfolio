import { Route, Routes } from "react-router-dom"
import StoreLayout from "./components/StoreLayout"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import ProductDetail from "./pages/ProductDetail"
import Login from "./pages/Login"
import Cart from "./pages/Cart"
import NotFound from "./pages/NotFound"
import BodyType from "./pages/BodyType"

function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:productId" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="body-type" element={<BodyType />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
