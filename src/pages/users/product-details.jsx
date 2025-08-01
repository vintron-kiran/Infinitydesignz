import React, { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Header from "../../includes/header";
import Footer from "../../includes/footer";
import axios from "axios";
import BASE_URL from "../../config/config";
import "../../css/user/userstyle.css";
import "../../css/user/bootstrap-icons.css";
import G1 from "../../img/g1.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProductDetailsById } from "../../redux/actions/userProductDetailsAction";
import { useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";
import Loader from "../../includes/loader";
import { fetchCategories } from "../../redux/actions/categoryAction";
import RelatedProducts from "../../components/relatedProducts";

export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const variantIdFromURL = searchParams.get("variantId");
  const [thumbnails, setThumbnails] = useState([]);


  const { product, loading } = useSelector((state) => state.userProductDetails);
  const categories = useSelector((state) => state.categories.categories || []);
  const { productId } = useParams();
  // const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  console.log('mainImage', mainImage)
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [selectedColorId, setSelectedColorId] = useState("");
  const [pincode, setPincode] = useState("");

  const getCategoryHierarchy = (categoryId, allCategories) => {
    const result = [];
    let current = allCategories.find(cat => cat.id === categoryId);

    while (current) {
      result.unshift(current);
      current = allCategories.find(cat => cat.id === current.parentId);
    }
    return result;
  };
  const breadcrumbItems = product
    ? [
      { label: 'Home' },
      ...getCategoryHierarchy(product.category?.id, categories).map(cat => ({
        label: cat.title,
      })),
      { label: product.title }
    ]
    : [{ label: 'Home' }];

  useEffect(() => {
    dispatch(fetchUserProductDetailsById(productId, variantIdFromURL));
    dispatch(fetchCategories());
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) {
      const variantId = parseInt(variantIdFromURL);
      const allVariantImages = product.images?.variantImages || [];
      const additional = product.images?.additional || [];

      setSelectedSizeId(product.selectedVariant?.sizeId || '');
      setSelectedColorId(product.selectedVariant?.colorId || '');

      let selectedImages = [];

      if (!isNaN(variantId)) {
        selectedImages = allVariantImages.filter(
          (img) => parseInt(img.variantId) === variantId
        );
      }

      if (selectedImages.length > 0) {
        const mainVariantImg = selectedImages.find((img) => img.isMain) || selectedImages[0];
        setMainImage(`${BASE_URL}/uploads/products/${mainVariantImg.url}`);
        setThumbnails([
          ...selectedImages.map((img) => ({ url: img.url })),
        ]);
      } else {
        // fallback to product-level images
        const mainImgUrl = product.images?.main?.url;
        if (mainImgUrl) {
          setMainImage(`${BASE_URL}/uploads/products/${mainImgUrl}`);
        }

        setThumbnails([
          { url: product.images?.main?.url, isMain: true },
          ...additional,
        ]);
      }
    }
  }, [product, variantIdFromURL]);



  useEffect(() => {
    const mainImg = document.getElementById("mainImage");
    const zoomResult = document.getElementById("zoomResult");
    const zoomLens = document.querySelector(".zoom-lens");
    const imageContainer = document.getElementById("mainImageContainer");

    if (!mainImg || !zoomResult || !zoomLens || !imageContainer) return;

    const zoomLevel = 2.5;
    let imgWidth, imgHeight;

    const updateImageDimensions = () => {
      imgWidth = mainImg.offsetWidth;
      imgHeight = mainImg.offsetHeight;
      if (imgWidth === 0 || imgHeight === 0) return;

      zoomResult.style.backgroundSize = `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`;

      const lensWidth = Math.min(100, imgWidth / 4);
      const lensHeight = Math.min(100, imgHeight / 4);
      zoomLens.style.width = `${lensWidth}px`;
      zoomLens.style.height = `${lensHeight}px`;
    };

    const moveLens = (e) => {
      e.preventDefault();
      const rect = mainImg.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      const lensWidth = zoomLens.offsetWidth;
      const lensHeight = zoomLens.offsetHeight;

      x = Math.max(lensWidth / 2, Math.min(x, imgWidth - lensWidth / 2));
      y = Math.max(lensHeight / 2, Math.min(y, imgHeight - lensHeight / 2));

      zoomLens.style.left = `${x - lensWidth / 2}px`;
      zoomLens.style.top = `${y - lensHeight / 2}px`;

      const ratioX = (x - lensWidth / 2) / (imgWidth - lensWidth);
      const ratioY = (y - lensHeight / 2) / (imgHeight - lensHeight);

      zoomResult.style.backgroundPosition = `${ratioX * 100}% ${ratioY * 100}%`;
    };

    zoomResult.style.backgroundImage = `url('${mainImage}')`;
    console.log("Zoom background:", zoomResult.style.backgroundImage);

    updateImageDimensions();

    window.addEventListener("resize", updateImageDimensions);
    mainImg.addEventListener("load", updateImageDimensions);

    imageContainer.addEventListener("mouseenter", () => {
      if (window.innerWidth > 576) {
        zoomLens.style.display = "block";
        zoomResult.style.display = "block";
        updateImageDimensions();
      }
    });

    imageContainer.addEventListener("mouseleave", () => {
      zoomLens.style.display = "none";
      zoomResult.style.display = "none";
    });

    imageContainer.addEventListener("mousemove", moveLens);

    return () => {
      window.removeEventListener("resize", updateImageDimensions);
    };
  }, [mainImage]);

  const handleChat = () => alert("Chat selected!");
  const handleCart = () => alert("Added to Cart!");
  const handleBuy = () => alert("Buy Now clicked!");
  const handleWishlist = () => alert("Added to Wishlist!");
  const handlePincodeCheck = () => {
    if (pincode) alert(`Checking delivery for PIN code: ${pincode}`);
    else alert("Please enter a PIN code");
  };

  if (!product) return <div className="container my-5">Loading...</div>;

  const { title, brand, description, mrp, sellingPrice, stock, size, productDetails, variants, selectedVariant } = product;
  console.log('mrp', mrp, sellingPrice)

  const additionalImages = product.images?.additional || [];
  // const thumbnails = [
  //   { url: product.images?.main?.url, isMain: true },
  //   ...additionalImages
  // ];


  if (loading) return <Loader />;

  return (
    <>
      <Header />
      <section className="product-details-page">
        <section className="bg-light py-3">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                {breadcrumbItems.map((item, index) => (
                  <span key={index}>
                    {item.link ? (
                      <Link to={item.link}>{item.label}</Link>
                    ) : (
                      <strong>{item.label}</strong>
                    )}
                    {index < breadcrumbItems.length - 1 && (
                      <span className="mx-2">{'>'}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-6">
              <div className="product-main-view">
                <div className=" gap-2">
                  <div className="thumb-gallery d-flex flex-column me-2">
                    {thumbnails.map((img, index) => (
                      <div
                        key={index}
                        className="thumb-item mb-2"
                        onClick={() => setMainImage(`${BASE_URL}/uploads/products/${img.url}`)}
                        style={{
                          cursor: "pointer",
                          border: mainImage.includes(img.url) ? "2px solid #007bff" : "1px solid #ddd",
                          borderRadius: 4
                        }}
                      >
                        <img
                          src={`${BASE_URL}/uploads/products/${img.url}`}
                          alt={`Thumbnail ${index + 1}`}
                          className="img-fluid"
                          style={{ width: "70px", height: "85px", objectFit: "cover" }}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="product-display mb-3" id="mainImageContainer" style={{ position: "relative" }}>
                    <div className="zoom-lens" style={{ position: "absolute", display: "none" }}></div>
                    <img
                      src={mainImage}
                      alt={title}
                      className="img-fluid product-image w-100"
                      id="mainImage"
                      loading="lazy"
                    />
                    <div className="zoom-result" id="zoomResult" style={{ display: "none" }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h2 className="product-title">
                {title} <span className="stock-status">{selectedVariant?.stock ?? product?.stock} left</span>
              </h2>

              <div className="price-details">
                <div>
                  <span className="price-value">
                    ₹
                    {selectedVariant && selectedVariant.sellingPrice
                      ? selectedVariant.sellingPrice
                      : product?.sellingPrice}
                  </span>

                  <span className="discount-label">
                    {(() => {
                      const mrp = selectedVariant ? selectedVariant.mrp : product?.mrp;
                      const sp = selectedVariant ? selectedVariant.sellingPrice : product?.sellingPrice;
                      if (mrp && sp && mrp > sp) {
                        const discount = Math.round(((mrp - sp) / mrp) * 100);
                        return `Flat ${discount}% off`;
                      } else {
                        return "No discount";
                      }
                    })()}
                  </span>
                </div>

                <span className="original-price">
                  MRP: ₹
                  {selectedVariant && selectedVariant.mrp
                    ? selectedVariant.mrp
                    : product?.mrp}
                </span>

                <p className="tax-info">Inclusive of all taxes</p>
              </div>
              <div className="dropdown-container mb-3">
                <div className="row">
                  {/* Size Dropdown */}
                  <div className="col-md-6 mb-2">
                    <label className="dropdown-label">Select Size</label>
                    <select
                      className="form-select1 size-dropdown w-100"
                      value={selectedSizeId}
                      onChange={(e) => {
                        const newSizeId = parseInt(e.target.value);
                        setSelectedSizeId(newSizeId);

                        const matchedVariant = variants.find(
                          (v) =>
                            parseInt(v.size?.id) === newSizeId &&
                            (!selectedColorId || v.color?.id === parseInt(selectedColorId))
                        );

                        if (matchedVariant) {
                          alert("Size matched");
                          window.open(`/product-details/${matchedVariant.productId}`, '_blank');
                        } else {
                          alert("No matching variant found for selected size");
                        }
                      }}
                    >
                      <option value="">Select</option>
                      {[...new Map(variants.map(v => [v.size?.id, v.size])).values()]
                        .filter(Boolean)
                        .map(size => (
                          <option key={size.id} value={size.id}>
                            {size.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Color Dropdown */}
                  <div className="col-md-6 mb-2">
                    <label className="dropdown-label">Select Color</label>
                    <select
                      className="form-select1 color-dropdown w-100"
                      value={selectedColorId}
                      onChange={(e) => {
                        const newColorId = parseInt(e.target.value);
                        setSelectedColorId(newColorId);

                        const matchedVariant = variants.find(
                          (v) =>
                            parseInt(v.color?.id) === newColorId &&
                            (!selectedSizeId || v.size?.id === parseInt(selectedSizeId))
                        );

                        if (matchedVariant) {
                          alert("Color matched");
                          window.open(`/product-details/${matchedVariant.productId}`, '_blank');
                        } else {
                          alert("No matching variant found for selected color");
                        }
                      }}
                    >
                      <option value="">Select</option>
                      {[...new Map(variants.map(v => [v.color?.id, v.color])).values()]
                        .filter(color => color?.id)
                        .map(color => (
                          <option key={color.id} value={color.id}>
                            {color.label || "N/A"}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>


              <div className="chat-button-row">
                <button className="chat-button" onClick={handleChat}>
                  Select Chat
                </button>
              </div>

              <div className="action-buttons mb-3">
                <button className="add-to-cart-btn" onClick={handleCart}>
                  <i className="bi bi-cart3"></i> Add to Cart
                </button>
                <button className="buy-now-btn" onClick={handleBuy}>
                  <i className="bi bi-lightning-charge-fill"></i> Buy Now
                </button>
                <button className="add-to-wishlist-btn" onClick={handleWishlist}>
                  <i className="bi bi-heart"></i> Add to Wishlist
                </button>
              </div>

              <div className="delivery-options">
                <h5>Delivery Options</h5>
                <div className="pincode-wrapper">
                  <input
                    type="text"
                    placeholder="Pincode"
                    className="pincode-input"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                  <button className="check-btn" onClick={handlePincodeCheck}>
                    Check
                  </button>
                </div>
                <p className="note-text">
                  Please enter PIN code to check delivery time & Pay on Delivery Availability
                </p>
                <hr />
                <div className="features">
                  {[
                    "Pay on delivery available",
                    "Free Delivery",
                    "Top Brand",
                    "Secure transaction",
                    "Easy 14 days return & exchange available"
                  ].map((text, i) => (
                    <div className="feature-items" key={i}>
                      <div className="icon-box">
                        <img src={G1} alt="Feature Icon" loading="lazy" />
                      </div>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="product-details">
                <h5>Product Details</h5>
                <h6 className="mb-0">Description :</h6>
                <p className="mb-0 mt-0" dangerouslySetInnerHTML={{ __html: description }} />
                <div className="multi-column mt-2">
                  <div className="mb-2">
                    <h6>Size</h6>
                    <p>{selectedVariant?.size?.title || product.size?.title || "N/A"}</p>
                  </div>
                  <div className="mb-2">
                    <h6>Color</h6>
                    <p>{selectedVariant?.color?.label || product.color?.label || "N/A"}</p>
                  </div>
                  <div className="mb-2">
                    <h6>Dimensions (in inches)</h6>
                    <p>
                      {product.height ? `H ${product.height}` : 'H N/A'} ×{' '}
                      {product.width ? `W ${product.width}` : 'W N/A'} ×{' '}
                      {product.length ? `L ${product.length}` : 'L N/A'}
                    </p>
                  </div>
                  <div>
                    <h6>SKU</h6>
                    <p>{selectedVariant?.sku || product?.sku}</p>
                  </div>
                  <div>
                    <h6>Weight</h6>
                    <p>{productDetails?.weight} gms</p>
                  </div>
                  <div>
                    <h6>Stock</h6>
                    <p>{selectedVariant?.stock ?? product?.stock}</p>
                  </div>
                  <div>
                    <h6>Delivery Charges</h6>
                    <p>₹{productDetails?.deliveryCharges}</p>
                  </div>
                  <div>
                    <h6>SLA</h6>
                    <p>{productDetails?.sla} Days</p>
                  </div>
                </div>
                <div className="view-more">
                  <a href="#">View More Details</a>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="container Fabric pb-4">
          <h3>Related Products</h3>
          <div className="row row-cols-1 row-cols-md-4 g-4">
           <RelatedProducts products={product.relatedProducts} />
          </div>
        </div>
      </section >
      <Footer />
    </>
  );
}

