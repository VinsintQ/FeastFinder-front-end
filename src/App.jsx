// App.jsx
import SigninForm from "./components/SigninForm/SigninForm";
// src/App.jsx
// src/App.jsx

import Restaurant from "./components/restaurant/restaurant";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";
import SignupForm from "./components/SignupForm/SignupForm";
import ResForm from "./components/restaurant/restaurantForm";
import MyRestaurants from "./components/MyRestaurant/MyRestaurant";
//Services
import * as authService from "../src/services/authService";
import * as resService from "./services/restaurant";


const App = () => {
  const [user, setUser] = useState(authService.getUser());
  const [restaurants, setRestaurant] = useState([]);
  const [myrestaurant,setmyrestaurant] = useState([]);
  const handleSignout = () => {
    authService.signout();
    setUser(null);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllres = async () => {
      const resData = await resService.index();
     
      setRestaurant(resData);
      if(user.isRestaurant){
        setmyrestaurant(resData.filter((res)=>{if (res.owner.username==user.username){return res}}));
        
      } 
    };
    if (user) fetchAllres();
    
  }, [user]);


 

  const handleAddRestaurant = async (restrData) => {
    const newRestaurant = await resService.create(restrData);
    setRestaurant([...restaurants, newRestaurant]);
    navigate("/restaurants");
  };









  return (
    <>
      <NavBar user={user} handleSignout={handleSignout} />

      <Routes>
        {user ? (
          // Protected Routes:
          <>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route
              path="/restaurants"
              element={<Restaurant restaurants={restaurants} />}
            />
            <Route
              path="/addRestaurant"
              element={<ResForm handleAddRestaurant={handleAddRestaurant} />}
            />
           <Route
              path="/MyRestaurants"
              element={<MyRestaurants myrestaurant={myrestaurant}/>}
            />


          </>

        ) : (
          // Public Route:
          <Route path="/" element={<Landing />} />
        )}
        <Route path="/signup" element={<SignupForm setUser={setUser} />} />
        <Route path="/signin" element={<SigninForm setUser={setUser} />} />
      </Routes>
    </>
  );
};

export default App;
