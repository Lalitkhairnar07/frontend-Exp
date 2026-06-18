import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Login } from "../common/Login";
import Signup from "../common/Signup";
import ForgotPassword from "../common/ForgotPassword";
import { UserNavbar } from "../user/UserNavbar";
import { ExpenseDashboard } from "../user/ExpenseDashboard";
import { AddCategory } from "../user/AddCategory";
import { GetMyCategories } from "../user/GetMyCategories";
import { AddExpense } from "../user/AddExpense";
import { MyExpenses } from "../user/MyExpenses";
import { Report } from "../user/Report";
import { Profile } from "../user/Profile";
import { Budget } from "../user/Budget";
import { AddBudget } from "../user/AddBudget";

// Wrapper for routes that require authentication
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Wrapper for authentication pages (Login, Signup, ForgotPassword) to redirect authenticated users to dashboard
const PublicRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    if (token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const AppRoutes = () => {
    
    const router = createBrowserRouter([
        {
            path: "/login",
            element: (
                <PublicRoute>
                    <Login />
                </PublicRoute>
            )
        },
        {
            path: "/forgot-password",
            element: (
                <PublicRoute>
                    <ForgotPassword />
                </PublicRoute>
            )
        },
        {
            path: "",
            element: (
                <ProtectedRoute>
                    <UserNavbar />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: "",
                    element: <ExpenseDashboard />
                },
                {
                    path: "/add-category",
                    element: <AddCategory />
                },
                {
                    path: "/my-categories",
                    element: <GetMyCategories />
                },
                {
                    path: "add-expense",
                    element: <AddExpense />
                },
                {
                    path: "my-expenses",
                    element: <MyExpenses />
                },
                {
                    path: "reports",
                    element: <Report />
                },
                {
                    path: "profile",
                    element: <Profile />
                },
                {
                    path: "budget",
                    element: <Budget />
                },
                {
                    path: "add-budget",
                    element: <AddBudget />
                }
            ]
        },
        {
            path: "/signup",
            element: (
                <PublicRoute>
                    <Signup />
                </PublicRoute>
            )
        }
    ]);

    return <RouterProvider router={router}/>

};

export default AppRoutes;
