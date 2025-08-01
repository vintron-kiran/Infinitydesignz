import axios from 'axios';
import BASE_URL from '../../config/config';

export const FETCH_WISHLIST_REQUEST = 'FETCH_WISHLIST_REQUEST';
export const FETCH_WISHLIST_SUCCESS = 'FETCH_WISHLIST_SUCCESS';
export const FETCH_WISHLIST_FAILURE = 'FETCH_WISHLIST_FAILURE';

export const ADD_TO_WISHLIST_SUCCESS = 'ADD_TO_WISHLIST_SUCCESS';

export const DELETE_WISHLIST_ITEM_REQUEST = 'DELETE_WISHLIST_ITEM_REQUEST';
export const DELETE_WISHLIST_ITEM_SUCCESS = 'DELETE_WISHLIST_ITEM_SUCCESS';
export const DELETE_WISHLIST_ITEM_FAILURE = 'DELETE_WISHLIST_ITEM_FAILURE';

const getToken = () => localStorage.getItem('access_token');

export const fetchWishlist = () => async (dispatch) => {
  dispatch({ type: FETCH_WISHLIST_REQUEST });
  try {
    const res = await axios.get(`${BASE_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
      console.log("Wishlist API response:", res.data);
    dispatch({ type: FETCH_WISHLIST_SUCCESS, payload: res.data.data });
  } catch (error) {
     console.error("Wishlist error:", error);
    dispatch({ type: FETCH_WISHLIST_FAILURE, payload: error.message });
  }
};

export const addToWishlist = (productId, variantId = null) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE_URL}/wishlist`, {
      productId,
      variantId
    }, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });

    dispatch({ type: ADD_TO_WISHLIST_SUCCESS, payload: res.data.data });
  } catch (error) {
    console.error('Add to wishlist failed', error);
  }
};




export const deleteWishlistItem = (wishlistId) => async (dispatch) => {
  dispatch({ type: DELETE_WISHLIST_ITEM_REQUEST });
  try {
    const config = {
      headers: { Authorization: `Bearer ${getToken()}` }
    };
    await axios.delete(`${BASE_URL}/wishlist/${wishlistId}`, config);
    dispatch({ type: DELETE_WISHLIST_ITEM_SUCCESS, payload: wishlistId });
  } catch (error) {
    dispatch({
      type: DELETE_WISHLIST_ITEM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};