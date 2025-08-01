import {
  SEND_OTP_REQUEST,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
} from '../actions/userAuthAction';

const initialState = {
  loading: false,
  token: localStorage.getItem('access_token') || null,
  error: null,
};

const userAuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_OTP_REQUEST:
    case VERIFY_OTP_REQUEST:
      return { ...state, loading: true, error: null };
    case SEND_OTP_SUCCESS:
      return { ...state, loading: false };
    case VERIFY_OTP_SUCCESS:
      return { ...state, loading: false, token: action.payload };
    case SEND_OTP_FAILURE:
    case VERIFY_OTP_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default userAuthReducer;
