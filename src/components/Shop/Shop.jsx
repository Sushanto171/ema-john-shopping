import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { addToDb, deleteShoppingCart } from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";

const Shop = () => {
  const cardData = useLoaderData();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(cardData);
  const [count, setCount] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(10);
  const totalPages = Math.ceil(count / size);
  useEffect(() => {
    fetch("http://localhost:5000/countData")
      .then((res) => res.json())
      .then((data) => {
        const count = data.count;
        setCount(count);
      });
  }, []);
  useEffect(() => {
    fetch(`http://localhost:5000/products?page=${currentPage}&size=${size}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPage, size]);

  //   useEffect(() => {
  //     const storedCart = getShoppingCart();

  //     const savedCart = [];
  //     // step 1: get id of the addedProduct
  //     for (const id in storedCart) {
  //       // step 2: get product from products state by using id
  //       const addedProduct = products.find((product) => product._id === id);
  //       if (addedProduct) {
  //         // step 3: add quantity
  //         const quantity = storedCart[id];
  //         addedProduct.quantity = quantity;
  //         // step 4: add the added product to the saved cart
  //         savedCart.push(addedProduct);
  //       }
  //       // console.log('added Product', addedProduct)
  //     }
  //     // step 5: set the cart
  //     setCart(savedCart);
  //   }, [products]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };
  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="shop-container">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="pagination">
        <p>Current page: {currentPage}</p>
        <button onClick={handlePrev}>Prev</button>
        {[...Array(totalPages).keys()].map((page) => (
          <button
            onClick={() => handleCurrentPage(page)}
            className={`${currentPage === page ? "active" : ""}`}
            key={page}
          >
            {page}
          </button>
        ))}
        <button onClick={handleNext}>Next</button>
        <select
          onChange={(e) => [
            setSize(parseInt(e.target.value)),
            setCurrentPage(0),
          ]}
          value={size}
        >
          <option value="" disabled>
            Select data length
          </option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};

export default Shop;
