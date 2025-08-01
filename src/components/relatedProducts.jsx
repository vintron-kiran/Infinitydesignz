// components/RelatedProducts.js
import React from "react";
import { FaRegHeart } from "react-icons/fa";
import BASE_URL from "../config/config";

export default function RelatedProducts({ products = [] }) {
  if (!products.length) return <p>No related products found.</p>;

  return (
    <>
      {products.map((item) => {
        const mainImage =
          item.images?.find((img) => img.isMain && img.variantId === null) || item.images?.[0];
        const imageUrl = mainImage ? `${BASE_URL}/uploads/products/${mainImage.url}` : "";

        const hasDiscount = item.mrp && item.sellingPrice && item.mrp > item.sellingPrice;
        const discountPercent = hasDiscount
          ? Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)
          : 0;

        return (
          <div className="col-lg-3 p-2" key={item.id}>
            <a
              href={`/product-details/${item.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-dark"
            >
              <div className="card h-100 position-relative">
                {hasDiscount && (
                  <div className="discount-badge position-absolute top-0 start-0 bg-danger text-white px-2 pt-1 mt-3 rounded">
                    {discountPercent}% OFF
                  </div>
                )}
                <div
                  className="position-absolute top-0 end-0 p-2"
                  style={{ zIndex: 2 }}
                >
                  <div className="whishlist_Icon">
                    <FaRegHeart
                      className="text-black"
                      style={{ fontSize: "1.1rem", cursor: "pointer" }}
                      title="Add to Wishlist"
                    />
                  </div>
                </div>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    className="card-img-top"
                    alt={item.title}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="card-img-top d-flex align-items-center justify-content-center bg-light text-muted"
                    style={{ height: "220px" }}
                  >
                    No Image
                  </div>
                )}

                <div className="card-body">
                  <h6 className="card-title">{item.title}</h6>
                  <p className="card-text">
                    <strong>₹{item.sellingPrice}</strong>{" "}
                    {hasDiscount && <del>MRP ₹{item.mrp}</del>}
                  </p>
                </div>
              </div>
            </a>
          </div>
        );
      })}
    </>
  );
}
