import axios from "axios";
import BASE_URL from "../../config/config";

export const SEND_OTP_REQUEST = 'SEND_OTP_REQUEST';
export const SEND_OTP_SUCCESS = 'SEND_OTP_SUCCESS';
export const SEND_OTP_FAILURE = 'SEND_OTP_FAILURE';

export const VERIFY_OTP_REQUEST = 'VERIFY_OTP_REQUEST';
export const VERIFY_OTP_SUCCESS = 'VERIFY_OTP_SUCCESS';
export const VERIFY_OTP_FAILURE = 'VERIFY_OTP_FAILURE';

export const sendOtp = (mobileNumber) => async (dispatch) => {
  dispatch({ type: SEND_OTP_REQUEST });
  try {
    await axios.post(`${BASE_URL}/auth/authenticate`, { mobileNumber });
    dispatch({ type: SEND_OTP_SUCCESS });
  } catch (error) {
    dispatch({ type: SEND_OTP_FAILURE, payload: error.message });
  }
};

export const verifyOtp = (mobileNumber, otp) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const res = await axios.post(`${BASE_URL}/auth/verify`, { mobileNumber, otp });
    const token = res.data.access_token;
    localStorage.setItem('access_token', token);

    dispatch({ type: VERIFY_OTP_SUCCESS, payload: token });
  } catch (error) {
    dispatch({ type: VERIFY_OTP_FAILURE, payload: error.message });
  }
};