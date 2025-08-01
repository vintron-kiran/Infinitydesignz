import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart } from "react-icons/fa";
import axios from "axios";
import BASE_URL from "../config/config";
import { isLoggedIn } from "../utils/auth";
import "../../src/css/user/userstyle.css";
import { addToWishlist } from "../redux/actions/whishlistAction";
import OtpLoginModal from "./otpLoginModal";

const ProductCard = ({ product, variant = null }) => {
  const dispatch = useDispatch();
  const [showLogin, setShowLogin] = useState(false);

  const {
    id,
    title = "No Title",
    images = [],
    mrp,
    sellingPrice,
    variants = [],
  } = product || {};

  // Price & Image Logic
  let displayMrp = mrp;
  let displayPrice = sellingPrice;
  let mainImageObj = null;

  if (variant) {
    const variantId = variant.id;
    displayMrp = variant.mrp;
    displayPrice = variant.sellingPrice;

    mainImageObj =
      images.find((img) => img.variantId === variantId && img.isMain) ||
      images.find((img) => img.variantId === variantId);
  } else {
    mainImageObj =
      images.find((img) => img.variantId === null && img.isMain) ||
      images.find((img) => img.variantId === null);

    if ((!displayMrp || !displayPrice) && variants.length > 0) {
      displayMrp = variants[0].mrp || 0;
      displayPrice = variants[0].sellingPrice || 0;
    }
  }

  const hasImage = !!mainImageObj?.url;
  const imageUrl = hasImage
    ? `${BASE_URL}/uploads/products/${mainImageObj.url}`
    : "";

  const discountPercent =
    displayMrp > displayPrice && displayMrp !== 0
      ? Math.round(((displayMrp - displayPrice) / displayMrp) * 100)
      : 0;

  // Wishlist Click Handler
  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      setShowLogin(true);
      return;
    }
    dispatch(addToWishlist(id, variant?.id ?? null));
  };

  return (
    <>
      <div className="col-lg-4 col-6 p-2">
        <Link
          to={
            variant
              ? `/product-details/${id}?variantId=${variant.id}`
              : `/product-details/${id}`
          }
          className="text_decoration"
        >
          <div className="card h-100 position-relative">
            {/* Discount badge */}
            {discountPercent > 0 && (
              <div className="discount-badge position-absolute">
                {discountPercent}% OFF
              </div>
            )}

            {/* Wishlist icon */}
            <div
              className="position-absolute top-0 end-0 p-2"
              style={{ zIndex: 2 }}
            >
              <div className="whishlist_Icon" onClick={handleWishlistClick}>
                <FaRegHeart
                  className="text-black"
                  style={{ fontSize: "1.1rem", cursor: "pointer" }}
                  title="Add to Wishlist"
                />
              </div>
            </div>

            {/* Product image */}
            {hasImage ? (
              <img src={imageUrl} className="card-img-top" alt={title} />
            ) : (
              <div
                className="card-img-top d-flex align-items-center justify-content-center bg-light text-muted"
                style={{ height: "200px", fontSize: "1.2rem" }}
              >
                N/A
              </div>
            )}

            {/* Product info */}
            <div className="card-body">
              <h6 className="card-title">{title}</h6>
              <p className="card-text">
                <strong>₹{displayPrice}</strong>{" "}
                {displayMrp > displayPrice ? (
                  <del>MRP ₹{displayMrp}</del>
                ) : (
                  <span className="text-muted ms-2">(No discount)</span>
                )}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* OTP Login Modal */}
      <OtpLoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={() => {
          dispatch(addToWishlist(id, variant?.id ?? null));
        }}
      />
    </>
  );
};

export default ProductCard;
