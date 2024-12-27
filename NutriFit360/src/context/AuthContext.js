import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case 'add_error' :
        return {...state , errorMessage:action.payload};
    case 'signup':
        return { ...state, token: action.payload, errorMessage: "" };
    case 'signin':
        return {...state , token:action.payload, errorMessage:""};
    case 'signout':
        return {token:null , errorMessage:""};
    case 'clear_error_message':
        return {...state,errorMessage:''};
    case 'getname':
        return {...state,userName: `${action.payload.name} ${action.payload.lastName}` ,  errorMessage:""};
    case 'getdetails':
        return {...state ,details:action.payload };
    case 'updatedetails':
        return {...state , details:action.payload};
    case 'addproducts':
        return {...state , products: [...(state.products || []), action.payload] , errorMessage:""};
    case 'get_cart':
        return {...state , cart:action.payload , errorMessage:""};
    case 'chat_response':
        return {...state ,  chatHistory: [
            ...state.chatHistory,
            { type: "user", text: action.payload.userMessage },
            { type: "bot", text: action.payload.botMessage },
          ],}
    case 'getproducts':
        return {...state , products:action.payload , errorMessage:''};

    case 'delete_product':
        return {
            ...state,
            products: state.products.filter((product) => product.name !== action.payload),
        };
    default:
      return state;
  }
};




const tryLocalSignin = dispatch => async () => {
    const token =await AsyncStorage.getItem('token');
    if(token){
        dispatch({type:'signin' , payload:token});
        navigate('HomePage');
    }
    else{
        navigate('Signin');
    }
}

const clearErrorMessage = dispatch => () => {
    dispatch({type:'clear_error_message'});
}

const signup = (dispatch) => {
    return async({name , lastName , email ,phone, password}) => {
        try{
            const response = await trackerApi.post('/signup',{name , lastName , email ,phone, password});
            console.log("Signup response: ", response.data); // Log the API response

            await AsyncStorage.setItem('token',response.data.token);
            dispatch({type:'signup', payload:response.data.token});
            console.log("Navigating to ProfileDetails...");
            navigate('ProfileDetails');          
        }catch(err){
            dispatch({type:'add_error' , payload:'Something went wrong with sign up'})

        }
    };
};
const signin = (dispatch) => {
    return async({email , password}) => {
        try{
            const response = await trackerApi.post('/signin',{email,password});
            console.log(response.data);
            await AsyncStorage.setItem('token' , response.data.token);
            dispatch({type:'signin',payload:response.data.token});
            navigate('HomePage');
        }catch(err){
            dispatch({type:'add_error',payload:'Something went wrong with sign up'});
        }
        
    };
};

const signout = (dispatch) => {
    return async() => {
        await AsyncStorage.removeItem('token');
        dispatch({type:'signout'})
        navigate('Signin')
    }
}

const getname = (dispatch) => {
    return async () => {
        try{
            const token = await AsyncStorage.getItem('token'); //get the token
            if(!token){
                throw new Error('No token found');
            }
            const response = await trackerApi.get('/getname',{
                headers:{
                Authorization: `Bearer ${token}`,
                },
                 
            })
            console.log("User Data:", response.data);
            dispatch({type:'getname' , payload:{ name: response.data.name, lastName: response.data.lastName }});
        }catch(err){
            dispatch({type:'add_error',payload:'Something went wrong'});
        }
    };
}

const getdetails = (dispatch) => {
    return async () => {
        try{
            const token = await AsyncStorage.getItem('token');
            if(!token) {
                throw new Error ('No token found');
            }
            const response = await trackerApi.get('/profile', {
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log("User Data:", response.data);
            dispatch({type:'getdetails' , payload:response.data});
        }catch(err){
            dispatch({type:'add_error' , payload:'Something went wrong'});
        }
    } 
}

const updatedetails = (dispatch) => {
    return async (updatedData) => {
        try{
            const { age, gender, height, weight, goal, activityLevel } = updatedData;
            if (!age || !gender || !height || !weight || !goal || !activityLevel) {
                dispatch({type:'add_error' , payload:'You must fill in all fields'});
                return;
            }
            const token = await AsyncStorage.getItem('token');
            if(!token){
                throw new Error('No token found');
            }
            const response = await trackerApi.put('/profile',updatedData , {
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });

            dispatch({type:'updatedetails',payload:response.data});
            console.log('Profile updated successfully:', response.data);

        }catch(err){
            dispatch({type:'add_error' , payload:'Something went wrong'});
        }
    }
};

const addproducts = (dispatch) => {
    return async({name ,description , price   , image  ,  stock , category }) => {
        try{
            if (!name || !price) {
                dispatch({ type: 'add_error', payload: 'Name and Price are required' });
                return;
            }
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await trackerApi.post(
                '/products',
                { name, description, price, image, stock, category },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            dispatch({type:'addproducts' , payload:response.data});
            console.log('Product added successfully:', response.data);

        }catch(err){
            dispatch({type:'add_error' , payload:'Failed to add product. Please try again.'});
        }
    };
};

const getproducts = (dispatch) => {
    return async () => {
        try{
            const token = await AsyncStorage.getItem('token');
            if(!token){
                throw new Error('No token found');
            }
            const response = await trackerApi.get('/products',{
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            });
            console.log("User Data:", response.data);
            dispatch({type:'getproducts' , payload:response.data});
        }catch(err){
            console.error("Error fetching products:", err.message);
            dispatch({type:'add_error' , payload:'Something went wrong'});

        }
    };
}


const deleteproducts = (dispatch) => {
    return async (name) => {
        try{
            const token = await AsyncStorage.getItem('token');
            if(!token){
                throw new Error('No token found');
            }
            const response = await trackerApi.delete('/products',{
                headers:{
                    Authorization: `Bearer ${token}`,

                },
                data: { name },
            });
            console.log("Product deleted successfully:", response.data);
            dispatch({ type: 'delete_product', payload: name });
        }catch (err) {
            console.error("Error deleting product:", err.message);

            // Dispatch an error message to the state
            dispatch({
                type: 'add_error',
                payload: 'Failed to delete product. Please try again.',
            });
        }
};
}


const getcart = (dispatch) => {
    return async (name) => {
        try{
            const token = await AsyncStorage.getItem('token');
            if(!token){
                throw new Error('No token found')
            }
            const response = await trackerApi.get("/cart", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              console.log("Cart Data:", response.data);
              dispatch({type:'get_cart' , payload : response.data.products,})
        }catch (err) {
            dispatch({type: "add_error", payload: "Failed to fetch cart data. Please try again."});
    }
};
}
const addToCart = (dispatch) => {
    return async (productName) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            // Add product to cart API call
            const response = await trackerApi.post(
                "/add-to-cart",
                { productName }, // Send product name to the backend
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Product added to cart:", response.data);

            // Optionally, dispatch the updated cart or product data
            dispatch({ type: "get_cart", payload: response.data.cart.products });
        } catch (err) {
            console.error("Error adding product to cart:", err.message);
            dispatch({
                type: "add_error",
                payload: "Failed to add product to cart. Please try again.",
            });
        }
    };
};


const chatpage = (dispatch) => {
    return async (userMessage) => {
      try {
        // Get the token from AsyncStorage
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
  
        // Send user message to the backend
        const response = await trackerApi.post(
          "/chat/questions",
          { message: userMessage },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Dispatch the chatbot response
        dispatch({
          type: "chat_response",
          payload: {
            userMessage,
            botMessage: response.data.message,
          },
        });
      } catch (err) {
        console.error("Error in chatpage function:", err.message);
        dispatch({
          type: "add_error",
          payload: "Failed to communicate with the chatbot. Please try again.",
        });
      }
    };
  };
  

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signup ,
    signin ,
     signout,
     getname , 
     clearErrorMessage ,
      tryLocalSignin , 
      getdetails ,
       updatedetails,
        chatpage ,
         addproducts ,
          getproducts ,
           deleteproducts, 
           getcart,
           addToCart,
        },
  { token:null ,errorMessage:'', userName: '' , chatHistory:[],products:[] , cart:[]}
);
