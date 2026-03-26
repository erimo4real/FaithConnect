import { useState } from 'react';

const Shop = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const products = [
    {
      id: 1,
      name: "BETHEL CHURCH T-Shirt",
      category: "Apparel",
      price: 25,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      description: "Comfortable cotton t-shirt with BETHEL CHURCH logo"
    },
    {
      id: 2,
      name: "Bible Cover - Leather",
      category: "Books",
      price: 45,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
      description: "Genuine leather bible cover with zipper"
    },
    {
      id: 3,
      name: "Faith Journal",
      category: "Books",
      price: 15,
      image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop",
      description: "Christian journaling notebook with prompts"
    },
    {
      id: 4,
      name: "Coffee Mug - Cross",
      category: "Gifts",
      price: 12,
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
      description: "Ceramic mug with cross design"
    },
    {
      id: 5,
      name: "Devotional Book",
      category: "Books",
      price: 18,
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop",
      description: "Daily devotional for spiritual growth"
    },
    {
      id: 6,
      name: "Hoodie - Faith Over Fear",
      category: "Apparel",
      price: 45,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
      description: "Comfortable hoodie with inspirational message"
    },
    {
      id: 7,
      name: "Bible Highlights Set",
      category: "Books",
      price: 30,
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop",
      description: "Highlighters set for bible study"
    },
    {
      id: 8,
      name: "Cross Pendant",
      category: "Jewelry",
      price: 35,
      image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop",
      description: "Silver cross pendant with chain"
    }
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Shop</h1>
          <p className="text-xl">Faith-themed merchandise and resources</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <span className="text-xs text-gray-500">{product.category}</span>
                  <h3 className="text-lg font-bold text-primary">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-secondary">${product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-accent transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setShowCart(!showCart)}
          className="bg-secondary text-primary p-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-yellow-400 transition-colors"
        >
          <span className="text-xl">🛒</span>
          <span className="font-bold">{cart.length}</span>
        </button>
      </div>

      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-primary">Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-primary"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-gray-500">${item.price}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xl font-bold">Total:</span>
                      <span className="text-2xl font-bold text-secondary">${cartTotal}</span>
                    </div>
                    <button
                      onClick={() => {
                        alert('This is a demo - no payment was processed!');
                        setCart([]);
                        setShowCart(false);
                      }}
                      className="w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Proceeds Support Ministry</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            All purchases from our shop support BETHEL CHURCH's ongoing ministry programs, 
            including community outreach, youth programs, and missions. Thank you for your support!
          </p>
        </div>
      </section>
    </div>
  );
};

export default Shop;
