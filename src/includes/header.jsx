import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/actions/categoryAction";
import "../../src/css/user/header.css";
import "../../src/css/user/userstyle.css";
import "../../src/css/user/adminHeader.css";

import "../../src/css/user/bootstrap.min.css";
import Logo from '../../src/img/logo.svg';
import MiniLogo from '../../src/img/mini-logo.png';
import Search from '../../src/img/search.svg';
import Favourite from '../../src/img/favorite.svg';
import AccountBox from '../../src/img/account_box.svg';
import ShoppingCart from '../../src/img/shopping_cart.svg';
import MenuImg from '../../src/img/menu-img.webp';
import axios from "axios";
import BASE_URL from "../config/config";
import { getToken } from "../utils/auth";

export default function Header({wishlistCount}) {
  const dispatch = useDispatch();
  const { categories = [] } = useSelector((state) => state.categories || {});
  // const [wishListItems, setWishlistItems] = useState([])
  // const wishlistCount = wishListItems.length;
  console.log('categories', categories)
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // useEffect(() => {
  //   const fetchWishlist = async () => {
  //     try {
  //       const config = { headers: { Authorization: `Bearer ${getToken()}` } };
  //       const res = await axios.get(`${BASE_URL}/wishlist`, config);
  //       setWishlistItems(res.data || []);
  //     } catch (err) {
  //       console.error("Failed to load wishlist", err);
  //     }
  //   };

  //   fetchWishlist();
  // }, []);

  const suggestionsList = [
    "4 Door Wardrobes",
    "4 seater dining table set",
    "Centre Tab",
    "Sofa Cum Beds",
    "TV Units",
    "Writing Tables",
    "study table",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const filteredSuggestions = suggestionsList.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const groupCategories = () => {
    const grouped = {};
    categories.forEach(cat => {
      const parent = cat.parentId || 'root';
      if (!grouped[parent]) grouped[parent] = [];
      grouped[parent].push(cat);
    });
    return grouped;
  };

  const groupedCategories = groupCategories();

  const renderMegaMenuColumns = () => {
    const topLevel = groupedCategories['root'] || [];

    return topLevel.map((parent) => {
      const children = groupedCategories[parent.id] || [];

      return (
        <div className="nav-item dropdown mega-dropdown" key={parent.id}>
          <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
            {parent.title}
          </a>
          <div className="dropdown-menu mega-menu p-1 border-0 rounded-0 m-0">
            <div className="container">
              <div className="row">
                {children.map((child) => {
                  const subChildren = groupedCategories[child.id] || [];

                  return (
                    <div className="col-md-3 col-lg-2 col-6" key={child.id}>
                      {/* Make subcategory title clickable */}
                      <h3>
                        <Link to={`/products?${new URLSearchParams({ ...(parent?.id && { mainCategoryId: parent.id }), ...(child?.id && { subCategoryId: child.id }), brandId: 0, searchStr: '', filters: '{}' }).toString()}`} className="subcategory-link"
                        >
                          {child.title}
                        </Link>
                      </h3>

                      {/* Render list subcategories if available */}
                      {subChildren.length > 0 ? (
                        subChildren.map((sub) => (
                          <Link to={`/products?${new URLSearchParams({ ...(parent?.id && { mainCategoryId: parent.id }), ...(child?.id && { subCategoryId: child.id }), ...(sub?.id && { listSubCatId: sub.id }), brandId: 0, searchStr: '', filters: '{}' }).toString()}`} className="dropdown-item"
                          >
                            {sub.title}
                          </Link>
                        ))
                      ) : (
                        ''
                      )}
                    </div>
                  );
                })}

                {/* Optional Promo Column */}
                <div className="col-md-3 col-lg-2 d-none d-md-block promo-column">
                  <h3 className="promo-heading">Sink Into Comfort</h3>
                  <p className="promo-subheading">Explore {parent.title}</p>
                  <img src={MenuImg} className="w-100" alt="Promo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };


  return (
    <>
      {/* Top Section */}
      <div className="container-fluid px-5 py-2 border-bottom cart wow fadeIn" data-wow-delay="0.1s">
        <div className="container">
          <div className="row align-items-center top-bar">
            <div className="col-lg-3 col-md-12">
              <a href="/" className="navbar-brand m-0 p-0">
                <img src={Logo} alt="Logo" />
              </a>
            </div>
            <div className="col-lg-5 col-md-4 my-3 position-relative" ref={inputRef}>
              <form className="d-flex" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="form-control1 search-input"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                />
                <button className="btn btn-light" type="submit">
                  <img src={Search} style={{ height: 25 }} alt="search" />
                </button>
              </form>
              {showSuggestions && (
                <div className="suggestions-dropdown" id="suggestions" style={{ display: "block" }}>
                  <div className="suggestions-header">Popular Searches</div>
                  <div className="suggestions-grid" id="suggestionsGrid">
                    {filteredSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        className="suggestion-item"
                        onClick={() => navigate(`/shop.php?query=${encodeURIComponent(item)}`)}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-4 Wishlist col-md-8 text-end d-flex justify-content-end align-items-center gap-4">
              <a href="/wishlist" className="text-decoration-none text-dark">
                <span style={{ position: "relative", display: "inline-block" }}>
                  <img src={Favourite} alt="wishlist" />
                  {wishlistCount > 0 && (
                    <span
                      className="badge rounded-pill text-white"
                      style={{
                        backgroundColor: "rgb(212, 14, 0)",
                        position: "absolute",
                        top: -8,
                        right: -8,
                        fontSize: "0.65rem",
                        padding: "2px 6px",
                      }}
                    >
                      {wishlistCount}
                    </span>
                  )}
                </span>
                Wishlist
              </a>
              <a href="/profile" className="text-decoration-none text-dark">
                <img src={AccountBox} style={{ height: 18 }} alt="account" /> My Account
              </a>
              <a href="/cart" className="text-decoration-none text-dark">
                <span style={{ position: "relative", display: "inline-block" }}>
                  <img src={ShoppingCart} alt="cart" />
                  <span className="badge rounded-pill text-white" style={{ backgroundColor: "rgb(212, 14, 0)", position: "absolute", top: -8, right: -8, fontSize: "0.65rem", padding: "2px 6px" }}>
                    4
                  </span>
                </span>
                My Cart
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark sticky-top py-lg-0 wow fadeIn" data-wow-delay="0.1s">
        <a href="#" className="navbar-brand ms-3 d-lg-none">MENU</a>
        <button className="navbar-toggler me-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav mx-auto p-3 p-lg-0 d-flex justify-content-center">
            <a href="/" className="navbar-brand sticky-logo">
              <img src={MiniLogo} alt="Logo" style={{ maxHeight: 40, width: "100%" }} />
            </a>
            {renderMegaMenuColumns()}
          </div>
        </div>
      </nav>
    </>
  );
}
