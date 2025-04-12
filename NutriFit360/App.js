import React from "react";
import { createAppContainer , createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
// import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import SignupScreen from "./src/screens/SignupScreen";
import SigninScreen from "./src/screens/SigninScreen";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import { setNavigator } from "./src/navigationRef";
import ProfileSetupScreen from "./src/screens/ProfileSetupScreen";
import HomePageScreen from "./src/screens/HomePageScreen";
import { Provider as ProfileProvider } from "./src/context/ProfileContext";
import ProfilePageScreen from "./src/screens/ProfilePageScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
import UpdateProfileScreen from "./src/screens/UpdateProfileScreen";
import BmiCalculatorScreen from "./src/screens/BmiCalculatorScreen";
import WorkoutPageScreen from "./src/screens/WorkoutPageScreen";
import ShopPageScreen from "./src/screens/ShopPageScreen";
import ChatPageScreen from "./src/screens/ChatPageScreen";
import AddProductsPageScreen from "./src/screens/AddProductsPageScreen";
import DeleteProducPageScreen from "./src/screens/DeleteProducPageScreen";
import CartPageScreen from "./src/screens/CartPageScreen";
import PaymentScreenPage from "./src/screens/PaymentScreenPage";
import AddVideoPageScreen from "./src/screens/AddVideoPageScreen";
import DeleteVideoPageScreen from "./src/screens/DeleteVideoPageScreen";
import ChestWorkoutPageScreen from "./src/screens/ChestWorkoutPageScreen";
import BackWorkoutPageScreen from "./src/screens/BackWorkoutPageScreen"
import IntroPage from "./src/screens/IntroPage";
import ForgotPasswordScreenPage from "./src/screens/ForgotPasswordScreenPage";
import UpdateAmountStorePage from "./src/screens/UpdateAmountStorePage";
import DecreaseAmountPageScreen from "./src/screens/DecreaseAmountPageScreen";
import MealPageScreen from "./src/screens/MealPageScreen";
import WorkoutPlanScreen from "./src/screens/WorkoutPlanScreen";
import AddMealPageScreen from "./src/screens/AddMealPageScreen";
import DeleteMealPageScreen from "./src/screens/DeleteMealPageScreen";
import MealsPageScreen1 from "./src/screens/MealsPageScreen1";

const SwitchNavigator = createSwitchNavigator({
  ResolveAuth:ResolveAuthScreen,
  loginFlow:createStackNavigator({
    Intro:IntroPage,
    Signup:SignupScreen,
    Signin:SigninScreen,
    ProfileDetails:ProfileSetupScreen,
    HomePage : HomePageScreen,
    ProfilePage:ProfilePageScreen,
    UpdateProfile:UpdateProfileScreen,
    BMI:BmiCalculatorScreen,
    Workout:WorkoutPageScreen,
    ShopPage:ShopPageScreen,
    ChatPage:ChatPageScreen,
    AddProducts:AddProductsPageScreen,
    DeleteProduct:DeleteProducPageScreen,
    Cart:CartPageScreen,
    Payment:PaymentScreenPage,
    AddVideo:AddVideoPageScreen,
    DeleteVideo:DeleteVideoPageScreen,
    ChestWorkout:ChestWorkoutPageScreen,
    BackWorkout:BackWorkoutPageScreen,
    ForgotPassword:ForgotPasswordScreenPage,
    UpdateAmount:UpdateAmountStorePage,
    DecreaseAmount:DecreaseAmountPageScreen,
    MealPlan:MealPageScreen,
    WorkoutPlan:WorkoutPlanScreen,
    addMeal:AddMealPageScreen,
    deleteMeal:DeleteMealPageScreen,
    MealsPage:MealsPageScreen1,


  }),
});

const App = createAppContainer(SwitchNavigator);
export default () => {
  return (
    <AuthProvider>
      <ProfileProvider>
          <App ref={(navigator) => {setNavigator(navigator)}}/>
        </ProfileProvider>
    </AuthProvider>
  );
};