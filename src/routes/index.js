import { Route, Routes } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Private from "./Private";
import Customers from "../pages/Customers";
import New from "../pages/New";
import List from "../pages/Customers/list";


function RoutesApp(){
    return(
        <Routes>
            <Route path="/" element={<SignIn/>}/>
            <Route path="/register" element={<SignUp/>}/>

           
            <Route path="/customers" element={<Private> <Customers/> </Private>}/>
            <Route path="/customers/:id" element={<Private> <Customers/> </Private>}/>

            <Route path="/dashboard" element={<Private> <Dashboard/> </Private>}/>
            <Route path="/profile" element={<Private> <Profile/> </Private>}/>

            <Route path="/list" element={<Private> <List/> </Private>}/>
           

            <Route path="/new" element={<Private> <New/> </Private>}/>
            <Route path="/new/:id" element={<Private> <New/> </Private>}/>
        </Routes>
    )
}

export default RoutesApp;