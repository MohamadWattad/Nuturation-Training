import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
    switch (action.type) {
        case 'details':
            return { ...state, token: action.payload, errorMessage: '' };
        case 'add_error':
                return { ...state, errorMessage: action.payload };
        default:
            return state;
    }
  };


const details = (dispatch) => async (profileData) => {
    try {
        // Retrieve token for authorization
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            navigate('Signin'); // Redirect to Signin if token is missing
            return;
        }

        // Make a POST request to save profile details
        const response = await trackerApi.post('/profile', profileData, {
            headers: {
                Authorization: `Bearer ${token}`, // Include token in the header
            },
        });

        console.log('Profile Save Response:', response.data); // Debug log for the response

        // Optionally navigate or dispatch success action
        navigate('HomePage');
    } catch (err) {
        console.error('Error Saving Profile:', err.message); // Log any error
        dispatch({ type: 'add_error', payload: 'Failed to save profile. Please try again.' });
    }
};


  
 
  export const { Provider, Context } = createDataContext(
    authReducer,
    { details},
    {token:null ,errorMessage:'' }
  );