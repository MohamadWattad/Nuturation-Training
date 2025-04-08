import createDataContext from "./createDataContext";
import trackerApi from "../api/tracker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from "../navigationRef";
// import { response } from "express";

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
        return {...state,userName: `${action.payload.name} ${action.payload.lastName}` ,role:`${action.payload.role}`,  errorMessage:""};
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
    case 'addvideo':
        return {...state , details:action.payload , errorMessage:""};
    case 'getvideo':
        return {...state , details:action.payload , errorMessage:""};

    case 'delete_video':
        return {
            ...state,
            products: state.products.filter((product) => product.name !== action.payload),
        }
    case 'forgotpassword':
        return {...state , token:action.payload , errorMessage:"" };
    case 'getMealPlan':
        return {...state , mealPlan:action.payload};
    case 'AddExercise':
        return {...state , details:action.payload , errorMessage:""};
    case 'get_workout_plan':
        return {...state , details:action.payload , errorMessage:""};
    case 'delete_exercise':
        return { ...state, details: action.payload, errorMessage: "" };
    case 'add_meal':
        return { ...state, meals: action.payload, errorMessage: "" };
    case 'get_meals':
        return { ...state, meals: action.payload, errorMessage: "" };
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
        navigate('Intro');
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
            dispatch({type:'getname' , payload:{ name: response.data.name, lastName: response.data.lastName,role:response.data.role }});
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

const AddVideo = (dispatch) => {
    return async ({ title , gifUrl , muscleGroup , description , duration }) => {
        try {
            if (!title || !gifUrl || !muscleGroup) {
                dispatch({ type: 'add_error', payload: 'title and gifUtl and muscleGroup are required' });
                return;
            }
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await trackerApi.post(
                'video',
                {title , gifUrl , muscleGroup , description , duration},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                dispatch({type:'addvideo' , payload:response.data});

        }catch(err){
            dispatch({type:'add_error' , payload:'Failed to add video. Please try again.'});
        }
    }
}
const getVideo = (dispatch) => {
    return async (muscleGroup) => {
        try {
            if (!muscleGroup) {
                throw new Error("Muscle group is required to fetch videos.");
            }

            const token = await AsyncStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }

            // Make the API request
            const response = await trackerApi.get(
                `/video?muscleGroup=${muscleGroup}`, // Pass muscleGroup as a query parameter
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Fetched Videos:", response.data.videos);

            // Dispatch the action to update the state
            dispatch({ type: "getvideo", payload: response.data.videos });
        } catch (err) {
            console.error("Error fetching videos:", err.response?.data || err.message);
            dispatch({ type: "add_error", payload: "Failed to fetch videos." });
        }
    };
};

const deleteVideo = (dispatch) => {
    return async (title) => {
        try{
            const token = await AsyncStorage.getItem('token');
            if(!token){
                throw new Error('No token found');
            }
            const response = await trackerApi.delete('/video',{
                headers:{
                    Authorization: `Bearer ${token}`,
                },
                data:{ title },
            });
            console.log("Product deleted successfully:", response.data);
            dispatch({ type: 'delete_video', payload: title });

        }catch (err) {
            console.error("Error deleting product:", err.message);

            // Dispatch an error message to the state
            dispatch({
                type: 'add_error',
                payload: 'Failed to delete video. Please try again.',
            });
    }
} 
}
// add exercise that user choose exercise to add for here list 
const AddExercise = (dispatch) => {
    return async (exerciseId) => {
        try{
            const token = await AsyncStorage.getItem("token");
            if (!token){
                throw new Error("No token found");
            }
            const response = await trackerApi.post(
                "/Workout-Plan",
                { exerciseIds: [exerciseId] }, // Send as array
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
            )
            dispatch({type:'AddExercise' , payload:response.data});

        }catch (err){
            dispatch({
                type: "add_error",
                payload: "Failed to add exercise. Please try again.",
              });
        }
    }
}
// Get list of exercise that the user choosen from Workout page 
const getWorkoutPlan = (dispatch) => {
    return async () => {
        try{
            const token = await AsyncStorage.getItem('token');
            if(!token){
                throw new Error('no token found');
            }
            const response = await trackerApi.get('/getWorkout-Plan',{
                headers:{
                    Authorization:`Bearer ${token}`,
                }
            });
            dispatch({type:'get_workout_plan' ,payload: response.data.plans}) 
        }catch(err){
            dispatch({
                type: "add_error",
                payload: "Failed to fetch workout plan.",
              });
        }
    }
}

//Delete exercise from the list that use maked
const deleteExercise = (dispatch) => {
    return async (exerciseId) => {
        try{
            const token = await AsyncStorage.getItem('token');
            if(!token) {
                throw new Error("no token found");
            }
            const response = await trackerApi.delete('/deleteExercise',{
                headers:{
                    Authorization: `Bearer ${token}`,

                },
                data: { exerciseId },
            });
            dispatch({ type: "delete_exercise", payload: response.data.plan }); 

        }catch(err){
            dispatch({
                type: "add_error",
                payload: "Failed to delete exercise.",
              });
        }
    }
}
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
    return async (productName , setProducts) => {
       
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
            
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.name === productName
                        ? { ...product, stock: Math.max(0, product.stock - 1) } // Prevent negative stock
                        : product
                )
            );
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


//Update amount for store 

const updateStock = (dispatch) => {
    return async (productName , stockToAdd) => {
        try{
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            const response = await trackerApi.put(
                '/update-stock',
                {productName, stockToAdd},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            console.log("Stock updated successfully:", response.data);
            dispatch({ type:"getproducts"  , payload: response.data.product});
            return response.data;
        }catch (err) {
            console.error("Error updating stock:", err.message);
            return { error: "Failed to update stock. Please try again." };
    }   
    }
}
//Decrease amount for store
const decreaseStock = (dispatch) => {
    return async (productName , stockToRemove) => {
        try{
            const token = await AsyncStorage.getItem("token");
            
            if(!token){
                throw new Error("No token found");
            }
            const response = await trackerApi.put(
                '/decrease-stock',
                {productName , stockToRemove},
                {
                    headers: { Authorization: `Bearer ${token}` },

                }
            )
            console.log("Stock removed successfully:", response.data);
            dispatch({ type:"getproducts" , payload: response.data.product});
            return response.data;

        }catch (err) {
            console.error("Error removing from stock:", err.message);
            return { error: "Failed to remove from stock. Please try again." };
        }
    }
}

const forgotpassword = (dispatch) => {
    return async (email) => {
        try{
            const response = await trackerApi.post('/resetpassword',{email});
            console.log("Reset Password Response:", response.data);
            
            dispatch({type:"forgotpassword",payload:"A reset link has been sent to your email."})
        }catch(err){
            console.error("Error resetting password:", err.message);
            dispatch({type:"add_error" , payload:"Failed to reset password. Please try again."})
        }
    }
}

const clearCart = ( dispatch) => {
    return async () => {
        try{
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                throw new Error("No token found");
            }
            await trackerApi.delete("/clear-cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({ type: "get_cart", payload: [] });
            console.log("Cart cleared successfully");


        }catch (err) {
            console.error("Error clearing cart:", err.message);
            dispatch({ type: "add_error", payload: "Failed to clear cart. Please try again." });
        }
    }
}
//Adding meals for the page 
const addMeals = (dispatch) => {
    return async (title , image , category ,calories, carbs , fat , protein, ingredients)=>{
        try{
            const token = await AsyncStorage.getItem("token");
            if(!token){
                throw new Error("No token found");
            }
            const response = await trackerApi.post("/recipes",
                {
                    title,
                    image,
                    categories: category,   
                    calories,
                    carbs,
                    fat,
                    protein,
                    ingredients,
                },
                {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                }
            );
            dispatch({type: "add_meal", payload: response.data})
        }catch(err){
            dispatch({
                type: "add_error",
                payload: "Failed to add meal. Please try again.",
              });
        }
    }
}
//Get the meals for the page 
const getMeals = (dispatch) => {
    return async ()=>{
        try{
            const token = await AsyncStorage.getItem("token");
            if(!token){
                throw new Error("no token found");
            }
            const response = await trackerApi.get("/recipes",{
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            });
            dispatch({type:"get_meals",payload:response.data});
        }catch (err) {
            console.error("Error fetching meals:", err.message);
            dispatch({
              type: "add_error",
              payload: "Failed to fetch meals. Please try again.",
            });
        }
    }
}

//delete meals from the meal page
const deleteMeal = (dispatch) => {
    return async(title) => {
        try{
            const token = await AsyncStorage.getItem("token");
            if(!token){
                throw new Error("no token found");
            }
            const response = await trackerApi.delete("/recipes",{
                headers:{
                    Authorization: `Bearer ${token}`,
                },
                data:{ title }
            });
            dispatch({ type: "get_meals", payload: response.data.recipes });

        }catch (err) {
            console.error("Error deleting meal:", err.message);
            dispatch({
              type: "add_error",
              payload: "Failed to delete meal. Please try again.",
            });
          }
    }
}

const chatpage = (dispatch) => {
    return async(userMessage) => {
        try{
            const token = await AsyncStorage.getItem("token");
            if(!token){
                throw new Error("Not token found");
            }
            const response = await trackerApi.post(
                "/chat/questions",
                { message: userMessage }, 
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              console.log("✅ Got response from server:", response.data);

            const botMessage = response.data.plan
            ? response.data.plan
            : response.data.question || response.data.message;

      // Dispatch both messages
        dispatch({
            type: "chat_response",
            payload: {
                userMessage,
                botMessage,
            },
        });
        }catch (err) {
            console.error("❌ Error in chatpage function:", err.message);
            dispatch({
              type: "add_error",
              payload: "Failed to communicate with the chatbot. Please try again.",
            });
    }
    }
}

//get meal plan for the user
const getMealPlan = (dispatch) => {
    return async () => {
        try{
            const token = await AsyncStorage.getItem("token");
            if(!token){
                throw new Error("No token found");
            }
            const response = await trackerApi.get(
                "getMealPlan",{
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                });
                console.log("✅ Fetched meal plan:", response.data);
                dispatch({
                    type: "getMealPlan", // You'll need to handle this in your reducer
                    payload: response.data,
                  });
        }catch (err) {
            console.error("❌ Error fetching meal plan:", err.message);
            dispatch({
              type: "add_error",
              payload: "Failed to fetch your meal plan.",
            });

        };
    }
}

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
           AddVideo,
           getVideo,
           deleteVideo,
           forgotpassword,
           clearCart,
           updateStock,
           decreaseStock,
           getMealPlan,
           AddExercise,
           getWorkoutPlan,
           deleteExercise,
           addMeals,
           getMeals,
           deleteMeal,
        },
  { token:null ,errorMessage:'', userName: '' ,role:'', chatHistory:[],products:[] , cart:[] ,details: [] , mealPlan : null}
);
