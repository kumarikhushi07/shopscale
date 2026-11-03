

import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:8080/api/products'

const sampleProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 2499,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
    description: 'Enjoy your favourite music with these stylish wireless headphones.'
  },
  {
    id: 2,
    name: 'Smart Watch',
    category: 'Electronics',
    price: 3999,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
    description: 'A modern everyday watch with a clean, versatile design.'
  },
  {
    id: 3,
    name: 'Running Shoes',
    category: 'Fashion',
    price: 1899,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
    description: 'Comfortable sporty shoes for everyday activities.'
  },
  {
    id: 4,
    name: 'Travel Backpack',
    category: 'Accessories',
    price: 1299,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
    description: 'A practical backpack for everyday essentials and travel.'
  },
  {
    id: 5,
    name: 'Digital Camera',
    category: 'Electronics',
    price: 25999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80',
    description: 'A camera-inspired pick for photography lovers.'
  },
  {
    id: 6,
    name: 'Sunglasses',
    category: 'Fashion',
    price: 999,
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80',
    description: 'A versatile accessory for your everyday look.'
  },
  {
    id: 7,
    name: 'Desk Lamp',
    category: 'Home',
    price: 1499,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80',
    description: 'A simple desk lamp for your workspace.'
  },
  {
    id: 8,
    name: 'Coffee Maker',
    category: 'Home',
    price: 3299,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=80',
    description: 'Bring a café-inspired coffee experience to your home.'
  },
  {
    id: 9,
    name: 'Laptop Backpack',
    category: 'Accessories',
    price: 1799,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=700&q=80',
    description: 'A handy bag for your laptop and daily essentials.'
  },
  {
    id: 10,
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    price: 1999,
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80',
    description: 'A compact speaker for enjoying music.'
  },
  {
    id: 11,
    name: 'Classic Wristwatch',
    category: 'Fashion',
    price: 2299,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80',
    description: 'A classic watch style for everyday outfits.'
  },
  {
    id: 12,
    name: 'Home Plant Pot',
    category: 'Home',
    price: 699,
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80',
    description: 'A decorative plant pick for your home.'
  }
]

const categories = [
  'All',
  'Electronics',
  'Fashion',
  'Home',
  'Accessories'
]

function getProductDetails(name) {
  const text = name.toLowerCase()

  if (/shoe|shirt|sunglass|watch|fashion|jacket/.test(text)) {
    return {
      category: 'Fashion',
      image: sampleProducts[2].image
    }
  }

  if (/backpack|bag|wallet/.test(text)) {
    return {
      category: 'Accessories',
      image: sampleProducts[3].image
    }
  }

  if (/lamp|coffee|plant|home|pot/.test(text)) {
    return {
      category: 'Home',
      image: sampleProducts[6].image
    }
  }

  if (/headphone|mouse|monitor|keyboard|camera|speaker|electronic/.test(text)) {
    let image = sampleProducts[0].image

    if (text.includes('mouse') || text.includes('keyboard')) {
      image = sampleProducts[0].image
    } else if (text.includes('monitor')) {
      image = sampleProducts[4].image
    } else if (text.includes('speaker')) {
      image = sampleProducts[9].image
    } else if (text.includes('camera')) {
      image = sampleProducts[4].image
    }

    return { category: 'Electronics', image }
  }

  return {
    category: 'Electronics',
    image: sampleProducts[0].image
  }
}

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setApiError('')

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`)
        }

        const data = await response.json()

        if (!Array.isArray(data)) {
          throw new Error('Unexpected API response')
        }

        const validProducts = data
            .filter((item) =>
                item.name?.trim() &&
                // Keep test records in MySQL, but hide them from the customer storefront.
                !/test|automated/i.test(item.name) &&
                item.price != null &&
                Number.isFinite(Number(item.price)) &&
                Number(item.price) >= 0 &&
                Number.isFinite(Number(item.stockQuantity)) &&
                Number(item.stockQuantity) >= 0
            )
            .map((item) => {
              const sample = sampleProducts.find(
                  (product) =>
                      product.name.toLowerCase() === item.name.toLowerCase()
              )

              const details = getProductDetails(item.name)

              return {
                ...details,
                ...sample,
                id: item.id,
                name: item.name,
                price: Number(item.price),
                stockQuantity: Number(item.stockQuantity),
                // Prefer values saved in MySQL; use sample defaults only when absent.
                category: item.category?.trim() || sample?.category || details.category,
                image: item.imageUrl?.trim() || sample?.image || details.image,
                rating: sample?.rating ?? 4.2,
                description:
                    item.description?.trim() ||
                    sample?.description ||
                    `${item.name} available at ShopScale.`
              }
            })

        setProducts(validProducts)
      } catch (error) {
        console.error('Could not load products:', error)
        setApiError(
            'Products could not be loaded from the backend. Check that Spring Boot is running.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase())

    const matchesCategory =
        category === 'All' || product.category === category

    return matchesSearch && matchesCategory
  })

  function addToCart(product) {
    if (product.stockQuantity <= 0) {
      alert('Sorry, this product is out of stock.')
      return
    }

    setCart((currentCart) => {
      const existing = currentCart.find(
          (item) => item.id === product.id
      )

      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          alert('You have reached the available stock limit.')
          return currentCart
        }

        return currentCart.map((item) =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })
  }

  function updateQuantity(productId, change) {
    setCart((currentCart) =>
        currentCart
            .map((item) => {
              if (item.id !== productId) return item

              const quantity = item.quantity + change

              if (quantity > item.stockQuantity) {
                return item
              }

              return { ...item, quantity }
            })
            .filter((item) => item.quantity > 0)
    )
  }

  const cartCount = cart.reduce(
      (total, item) => total + item.quantity,
      0
  )

  const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
  )

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  return (
      <div className="store">
        <header className="main-header">
          <a className="logo" href="#" aria-label="ShopScale home">
            Shop<span>Scale</span>
            <small>smart shopping</small>
          </a>

          <div className="delivery">
            <span>Delivering to</span>
            <strong>📍 India</strong>
          </div>

          <form
              className="search-bar"
              onSubmit={(event) => {
                event.preventDefault()
                scrollTo('products')
              }}
          >
            <select
                aria-label="Select category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <input
                type="search"
                placeholder="Search ShopScale products"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            <button type="submit" aria-label="Search">⌕</button>
          </form>

          <button className="header-link account-link" type="button">
            <small>Hello, shopper</small>
            <strong>Account</strong>
          </button>

          <button
              className="header-link orders-link"
              type="button"
              onClick={() => scrollTo('cart-section')}
          >
            <small>Your</small>
            <strong>Orders</strong>
          </button>

          <button
              className="cart-link"
              type="button"
              onClick={() => scrollTo('cart-section')}
          >
            <span className="cart-icon">🛒</span>
            <span className="cart-badge">{cartCount}</span>
            <strong>Cart</strong>
          </button>
        </header>

        <nav className="category-nav">
          <a className="all-menu" href="#products"
             onClick={() => setCategory('All')}>☰ &nbsp; All</a>
          <a href="#products"
             onClick={() => setCategory('Electronics')}>Electronics</a>
          <a href="#products"
             onClick={() => setCategory('Fashion')}>Fashion</a>
          <a href="#products"
             onClick={() => setCategory('Home')}>Home &amp; Kitchen</a>
          <a href="#products"
             onClick={() => setCategory('Accessories')}>Accessories</a>
          <a href="#products"
             onClick={() => setCategory('All')}>Today's Picks</a>
          <span className="nav-message">Discover something you love</span>
        </nav>

        <main>
          <section className="hero">
            <div className="hero-copy">
              <span className="hero-tag">THE EVERYDAY SHOPPING EDIT</span>
              <h1>Good finds.<br /><span>Great everyday prices.</span></h1>
              <p>Discover products you'll love, all in one place.</p>
              <a className="hero-button" href="#products">Explore products →</a>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="hero-circle">✦</div>
              <span className="hero-box">📦</span>
              <span className="hero-spark">✳</span>
            </div>
          </section>

          <section className="benefits">
            <div>
              <span>↗</span>
              <p><strong>Easy discovery</strong><small>Find your next favourite</small></p>
            </div>
            <div>
              <span>✓</span>
              <p><strong>Clear pricing</strong><small>No surprises in your cart</small></p>
            </div>
            <div>
              <span>♡</span>
              <p><strong>Made for you</strong><small>Everyday essentials &amp; more</small></p>
            </div>
          </section>

          <section className="product-section" id="products">
            <div className="section-heading">
              <div>
                <span className="section-kicker">CURATED FOR YOU</span>
                <h2>Explore products</h2>
                <p>Find something great for your everyday life.</p>
              </div>
              <span className="result-count">
              {loading ? 'Loading...' : `${filteredProducts.length} products`}
            </span>
            </div>

            <div className="category-chips">
              {categories.map((item) => (
                  <button
                      type="button"
                      key={item}
                      onClick={() => setCategory(item)}
                      className={category === item ? 'chip selected' : 'chip'}
                  >
                    {item}
                  </button>
              ))}
            </div>

            {loading && (
                <div className="empty-state">
                  <h3>Loading ShopScale products...</h3>
                  <p>Getting products from the backend.</p>
                </div>
            )}

            {!loading && apiError && (
                <div className="empty-state">
                  <h3>Unable to load products</h3>
                  <p>{apiError}</p>
                  <button
                      className="add-button"
                      type="button"
                      onClick={() => window.location.reload()}
                  >
                    Try again
                  </button>
                </div>
            )}

            {!loading && !apiError && (
                <>
                  <div className="product-grid">
                    {filteredProducts.map((product) => (
                        <article className="product-card" key={product.id}>
                          <button
                              className="product-open-button"
                              type="button"
                              onClick={() => setSelectedProduct(product)}
                              aria-label={`View ${product.name} details`}
                          >
                            <div className="product-image-wrap">
                              <img
                                  src={product.image}
                                  alt={product.name}
                                  loading="lazy"
                              />
                              <span className="image-label">SHOP PICKS</span>
                            </div>

                            <div className="product-info">
                              <span className="product-category">{product.category}</span>
                              <h3>{product.name}</h3>
                              <div className="rating">
                                <span>★★★★★</span>
                                <small>{product.rating}</small>
                              </div>
                              <p className="price">
                                <span>₹</span>{product.price.toLocaleString('en-IN')}
                              </p>
                              <p className="delivery-note">
                                {product.stockQuantity > 0
                                    ? `${product.stockQuantity} in stock`
                                    : 'Out of stock'}
                              </p>
                            </div>
                          </button>

                          <button
                              className="add-button"
                              type="button"
                              disabled={product.stockQuantity <= 0}
                              onClick={() => addToCart(product)}
                          >
                            {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        </article>
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                      <div className="empty-state">
                        <h3>No matching products found</h3>
                        <p>Try another search or category.</p>
                        <button
                            className="add-button"
                            type="button"
                            onClick={() => {
                              setSearch('')
                              setCategory('All')
                            }}
                        >
                          Show all products
                        </button>
                      </div>
                  )}
                </>
            )}
          </section>

          <section className="cart-section" id="cart-section">
            <div className="cart-heading">
              <div>
                <span className="section-kicker">YOUR SELECTION</span>
                <h2>Your shopping cart</h2>
              </div>
              <span>{cartCount} items</span>
            </div>

            {cart.length === 0 ? (
                <div className="empty-cart">
                  <span>🛒</span>
                  <div>
                    <strong>Your cart is waiting for something great.</strong>
                    <p>Add a product above to get started.</p>
                  </div>
                </div>
            ) : (
                <div className="cart-content">
                  <div className="cart-items">
                    {cart.map((item) => (
                        <div className="cart-item" key={item.id}>
                          <img src={item.image} alt={item.name} />

                          <div className="cart-item-details">
                            <strong>{item.name}</strong>
                            <span>₹{item.price.toLocaleString('en-IN')} each</span>

                            <div className="quantity-controls">
                              <button type="button"
                                      aria-label={`Decrease ${item.name} quantity`}
                                      onClick={() => updateQuantity(item.id, -1)}>−</button>
                              <span>{item.quantity}</span>
                              <button type="button"
                                      aria-label={`Increase ${item.name} quantity`}
                                      disabled={item.quantity >= item.stockQuantity}
                                      onClick={() => updateQuantity(item.id, 1)}>+</button>
                              <button
                                  className="remove-button"
                                  type="button"
                                  onClick={() => setCart((items) =>
                                      items.filter((entry) => entry.id !== item.id)
                                  )}
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <strong>
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </strong>
                        </div>
                    ))}
                  </div>

                  <aside className="order-summary">
                    <h3>Order summary</h3>
                    <p>
                      <span>Subtotal</span>
                      <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                    </p>
                    <p><span>Delivery</span><strong className="free-delivery">FREE</strong></p>
                    <hr />
                    <p className="summary-total">
                      <span>Estimated total</span>
                      <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
                    </p>
                    <button
                        className="checkout-button"
                        type="button"
                        onClick={() => alert(
                            'Demo checkout: address and order confirmation will be added next. No payment will be taken.'
                        )}
                    >
                      Proceed to checkout
                    </button>
                    <small>Demo checkout · No payment will be taken</small>
                  </aside>
                </div>
            )}
          </section>

          {selectedProduct && (
              <div className="modal-overlay"
                   onClick={() => setSelectedProduct(null)}>
                <section
                    className="product-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${selectedProduct.name} details`}
                    onClick={(event) => event.stopPropagation()}
                >
                  <button
                      className="modal-close"
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      aria-label="Close product details"
                  >
                    ×
                  </button>

                  <img
                      className="modal-product-image"
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                  />

                  <div className="modal-info">
                    <span className="product-category">{selectedProduct.category}</span>
                    <h2>{selectedProduct.name}</h2>
                    <p className="modal-rating">
                      ★★★★★ &nbsp; {selectedProduct.rating} / 5
                    </p>
                    <h3>₹{selectedProduct.price.toLocaleString('en-IN')}</h3>
                    <p>{selectedProduct.description}</p>
                    <p className="modal-stock">
                      {selectedProduct.stockQuantity} units in stock
                    </p>
                    <button
                        className="add-button"
                        type="button"
                        disabled={selectedProduct.stockQuantity <= 0}
                        onClick={() => addToCart(selectedProduct)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </section>
              </div>
          )}
        </main>

        <footer className="footer">
          <a href="#" className="footer-logo">ShopScale</a>
          <p>A learning project built with React, Spring Boot and MySQL.</p>
          <a href="#products">Back to products ↑</a>
        </footer>
      </div>
  )
}

export default App
