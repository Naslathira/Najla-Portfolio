import { useEffect, useRef, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import logo from "../assets/logo.png"
import { categories } from "../data/products"
import { useAuth } from "../features/auth/useAuth"

const navClass = ({ isActive }) =>
  isActive ? "text-pink-500" : "hover:text-pink-500"

function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (!dropdownRef.current?.contains(event.target)) setOpenDropdown(false)
    }

    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [])

  return (
    <nav className="flex items-center justify-between px-8 py-5 border-b" aria-label="Main navigation">
      <Link to="/" aria-label="NP Active home">
        <img src={logo} alt="NP Active" className="h-12 w-auto" />
      </Link>

      <div className="flex items-center gap-6 text-sm">
        <NavLink to="/" className={navClass}>Home</NavLink>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            aria-expanded={openDropdown}
            aria-controls="product-menu"
            onClick={() => setOpenDropdown((open) => !open)}
            className="hover:text-pink-500"
          >
            Products
          </button>

          {openDropdown && (
            <div id="product-menu" className="absolute top-8 left-0 z-50 w-40 rounded-xl bg-white p-3 shadow-lg">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/shop?category=${category.slug}`}
                  onClick={() => setOpenDropdown(false)}
                  className="block px-3 py-2 hover:text-pink-500"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <NavLink to="/shop" className={navClass}>Shop</NavLink>
        <NavLink to="/body-type" className={navClass}>Body Type</NavLink>
        <NavLink to="/color-analysis" className={navClass}>Color Analysis</NavLink>
        <NavLink to="/cart" className={navClass}>Cart</NavLink>
        <NavLink to="/login" className={navClass}>{user ? user.name : "Login"}</NavLink>
      </div>
    </nav>
  )
}

export default Navbar
