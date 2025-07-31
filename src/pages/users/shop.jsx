import React, { useState, useEffect } from "react";
import Header from "../../includes/header";
import Footer from "../../includes/footer";
import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../css/user/userstyle.css';
import '../../css/user/bootstrap-icons.css';
import '../../css/user/bootstrap.min.css';
import FilterSidebar from "../../components/filterSideBar";
import ProductList from "../../components/productGrid";
import FurnitureGrid from "../../components/furnitureGrid";
import HelpSection from "../../components/helpSection";
import CustomAccordion from "../../components/customAccordian";
import CallbackForm from "../../components/callbackForm";
import NewArrivals from "../../components/newArrivalSection";
import axios from 'axios';
import BASE_URL from '../../config/config';
import { useLocation } from 'react-router-dom';


import AccImg from '../../img/acc-img.png';
import bgImage from '../../img/prbg3.png';

const ProductTopBar = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const listSubCategoryId = params.get('listSubCategoryId');
    console.log("List Sub Category ID:", listSubCategoryId);

    const [products, setProducts] = useState([]);
    console.log('Products:', products);
    const [filterGroups, setFilterGroups] = useState([]);
    const [sortOption, setSortOption] = useState('recommended');
    const [isMobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [accordionFilters, setAccordionFilters] = useState([]);
    const [standardFilters, setStandardFilters] = useState({ colors: [], brands: [], sizes: [] });

    // useEffect(() => {
    //     const fetchProducts = async () => {
    //         try {
    //             const res = await axios.get(`${BASE_URL}/products`);
    //             const data = res.data;
    //             if (listSubCategoryId) {
    //                 data = data.filter(product => product.listSubCategoryId === parseInt(listSubCategoryId));
    //             }

    //             setProducts(data);
    //             // setProducts(data);

    //             const colorMap = new Map();
    //             const brandMap = new Map();
    //             const sizeMap = new Map();
    //             const accordion = [];

    //             data.forEach(product => {
    //                 // Accordion filters (filterType -> filterSets)
    //                 product.category?.filterType?.filterSets?.forEach(set => {
    //                     accordion.push({
    //                         title: set.title,
    //                         options: set.filterLists.map(list => ({ label: list.label, checked: false }))
    //                     });
    //                 });


    //                 product.category?.featureType?.featureSets?.forEach(set => {
    //                     accordion.push({
    //                         title: set.title,
    //                         options: set.featureLists.map(list => ({ label: list.label, checked: false }))
    //                     });
    //                 });

    //                 if (product.color?.label && product.color?.hex_code) {
    //                     colorMap.set(product.color.label, product.color.hex_code);
    //                 }
    //                 if (product.brand?.name) {
    //                     brandMap.set(product.brand.name, true);
    //                 }
    //                 if (product.size?.title) {
    //                     sizeMap.set(product.size.title, true);
    //                 }

    //                 product.variants?.forEach(variant => {
    //                     if (variant.color?.label && variant.color?.hex_code) {
    //                         colorMap.set(variant.color.label, variant.color.hex_code);
    //                     }
    //                     if (variant.size?.title) {
    //                         sizeMap.set(variant.size.title, true);
    //                     }
    //                 });
    //             });

    //             const colors = Array.from(colorMap.entries()).map(([label, hex_code]) => ({ label, hex_code }));
    //             const brands = Array.from(brandMap.keys()).map(name => ({ name }));
    //             const sizes = Array.from(sizeMap.keys()).map(title => ({ title }));

    //             setAccordionFilters(accordion);
    //             setStandardFilters({ colors, brands, sizes });
    //         } catch (err) {
    //             console.error("Error fetching products:", err);
    //         }
    //     };

    //     fetchProducts();
    // }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/products/search?mainCategoryId=0&subCategoryId=0`);
                let data = res.data;
                console.log("Fetched products:", data);

                if (listSubCategoryId) {
                    data = data.filter(product => {
                        console.log("Product's listSubCategoryId:", product.listSubCategoryId);
                        return product.listSubCategoryId === parseInt(listSubCategoryId);
                    });
                }

                console.log("Filtered products:", data);

                setProducts(data);

                const colorMap = new Map();
                const brandMap = new Map();
                const sizeMap = new Map();
                const accordion = [];

                data.forEach(product => {
                    product.category?.filterType?.filterSets?.forEach(set => {
                        accordion.push({
                            title: set.title,
                            options: set.filterLists.map(list => ({ label: list.label, checked: false }))
                        });
                    });

                    product.category?.featureType?.featureSets?.forEach(set => {
                        accordion.push({
                            title: set.title,
                            options: set.featureLists.map(list => ({ label: list.label, checked: false }))
                        });
                    });

                    if (product.color?.label && product.color?.hex_code) {
                        colorMap.set(product.color.label, product.color.hex_code);
                    }
                    if (product.brand?.name) {
                        brandMap.set(product.brand.name, true);
                    }
                    if (product.size?.title) {
                        sizeMap.set(product.size.title, true);
                    }

                    product.variants?.forEach(variant => {
                        if (variant.color?.label && variant.color?.hex_code) {
                            colorMap.set(variant.color.label, variant.color.hex_code);
                        }
                        if (variant.size?.title) {
                            sizeMap.set(variant.size.title, true);
                        }
                    });
                });

                const colors = Array.from(colorMap.entries()).map(([label, hex_code]) => ({ label, hex_code }));
                const brands = Array.from(brandMap.keys()).map(name => ({ name }));
                const sizes = Array.from(sizeMap.keys()).map(title => ({ title }));

                setAccordionFilters(accordion);
                setStandardFilters({ colors, brands, sizes });

            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        fetchProducts();
    }, [location.search]);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMobileFilterOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const toggleMobileFilter = () => setMobileFilterOpen(!isMobileFilterOpen);
    const closeMobileFilter = () => setMobileFilterOpen(false);
    const handleClearFilters = (e) => {
        e.preventDefault();
        console.log("Clear all filters");
    };
    const handleFormSubmit = (data) => {
        alert(`Name: ${data.name}, Mobile: ${data.mobile}`);
    };

    const arrivals = [
        { src: AccImg, alt: "New Arrival 1" },
    ];

    const helpItems = [
        { image: '', title: "Sofa", alt: "Sofa" },
        { image: '', title: "Bed", alt: "Bed" },
        { image: '', title: "Mattress", alt: "Mattress" },
        { image: '', title: "Wardrobes", alt: "Wardrobes" },
        { image: '', title: "Dining table", alt: "Dining Table" },
    ];

    const accordionData = [
        {
            id: "collapseOne",
            title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            content: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer...",
        },
    ];

    return (
        <>
            <Header />
            <section className="bg-light py-3">
                <div className="container shop">
                    <div className="row">
                        <div className="col-lg-12">
                            <Link to="/" className="link">Home /</Link>{' '}
                            <Link to="/details" className="link"><strong>Top-Wear</strong></Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="top-bar">
                <div className="container pt-3">
                    <div className="row align-items-center">
                        <div className="col-lg-9">
                            <h6 className="product-title">Products <span className="item-count">({products.length} items)</span></h6>
                        </div>
                        <div className="col-lg-3 text-lg-end">
                            <div className="product-sorting d-flex align-items-center justify-content-lg-end mb-3">
                                <label htmlFor="sort" className="sort-label me-2">Sort by:</label>
                                <select
                                    id="sort"
                                    name="sort"
                                    className="form-select1 custom-select"
                                    value={sortOption}
                                    onChange={handleSortChange}
                                >
                                    <option value="recommended">Recommended</option>
                                    <option value="highest-rated">Highest Rated</option>
                                    <option value="newest">Newest</option>
                                    <option value="price-high-low">Price: $$ - $</option>
                                    <option value="price-low-high">Price: $ - $$</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="shop_grid_area py-3">
                <div className="container top-bars">
                    <div className="mobile-filter-toggle">
                        <button className="btn btn-outline-dark" id="filterToggleBtn" onClick={toggleMobileFilter}>Filter</button>
                    </div>

                    <div className={`mobile-filter-overlay ${isMobileFilterOpen ? "active" : ""}`} onClick={closeMobileFilter} />

                    <div className={`mobile-filter-sidebar ${isMobileFilterOpen ? "active" : ""}`} id="filterSidebar">
                        <FilterSidebar isMobile={true} accordionFilters={accordionFilters} standardFilters={standardFilters} />
                    </div>

                    <div className="row">
                        <div className="col-12 col-md-4 col-lg-3 mb-3">
                            {/* <FilterSidebar isMobile={false} accordionFilters={accordionFilters} standardFilters={standardFilters} onClearFilters={handleClearFilters} /> */}
                        </div>
                        <ProductList products={products} />
                    </div>
                </div>
            </section>

            {/* <NewArrivals title="New Arrivals" images={arrivals} /> */}
            {/* <FurnitureGrid furniture={products} /> */}

            <div className="py-5">
                <HelpSection title="Need Help Buying?" items={helpItems} />
            </div>

            <section className="info-section">
                <div className="container">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-4">
                            <div className="intro-text">
                                <h1>Lorem Ipsum is simply dummy text of the printing</h1>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
                                <Link to="#" className="contact-link">Reach Us</Link>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="visual-box">
                                <img src={AccImg} className="w-100" alt="" />
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <CustomAccordion items={accordionData} />
                        </div>
                    </div>
                </div>
            </section>

            <div className="container my-5">
                <div className="callback-container d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ backgroundImage: `url(${bgImage})` }}>
                    <div className="info-block mb-4 mb-md-0" style={{ maxWidth: "40%" }}>
                        <h2 className="callback-heading">Lorem Ipsum is simply</h2>
                        <p className="callback-text text-start">
                            Lorem Ipsum is simply dummy text of <br /> the printing and typesetting industry.
                        </p>
                    </div>
                    <CallbackForm onSubmit={handleFormSubmit} />
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ProductTopBar;
