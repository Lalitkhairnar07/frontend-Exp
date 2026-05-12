import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "../common/Login";
import Signup from "../common/Signup";
import { UserNavbar } from "../user/UserNavbar";
import { ExpenseDashboard } from "../user/ExpenseDashboard";
import { AddCategory } from "../user/AddCategory";
import { GetMyCategories } from "../user/GetMyCategories";
import { AddExpense } from "../user/AddExpense";
import { MyExpenses } from "../user/MyExpenses";

const AppRoutes = () => {
    
    const router = createBrowserRouter([
        {
            path: "/login",
            element:<Login/>
        },
        {
            path:"",
            element:<UserNavbar/>,
            children:[
                {
                    path:"",
                    element:<ExpenseDashboard/>
                },
                {
                    path:"/add-category",
                    element:<AddCategory/>
                },
                {
                    path:"/my-categories",
                    element:<GetMyCategories/>
                },
                {
                    path:"add-expense",
                    element:<AddExpense/>
                },
                {
                    path:"my-expenses",
                    element:<MyExpenses/>
                }
            ]
        },
        {
            path: "/signup",
            element: <Signup />
        }
    ]);

    return <RouterProvider router={router}/>

};

export default AppRoutes;
