import React,{useEffect , useContext} from "react";
import { Context as AuthContext } from "../context/AuthContext";

const ResolveAuthScreen = () => {// if i dont want to show antything i can type -> return null
    const {tryLocalSignin} = useContext(AuthContext);



    useEffect( () => {
        tryLocalSignin();
    },[]);
    return null;
};


export default ResolveAuthScreen;