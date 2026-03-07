import { createBrowserRouter } from 'react-router-dom';
import Root from '../layout/Root';

import HomePage from '../pages/HomePage';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Account from '../component/Account';
import Shop from '../pages/Shop';
import Sale from '../pages/Sale';
import Categories from '../pages/Categories';
import NewArrivals from '../pages/NewArrivals';
import OrderTracking from '../component/OrderTracking';

import CartPage from '../pages/CartPage';
import PaymentPage from '../pages/PaymentPage';
import Dashboard from '../Dashboard';
import ShippingPolicy from '../component/ShippingPolicy';
import ReturnPolicy from '../component/ReturnPolicy';
import FAQ from '../component/FAQ';
import ErrorPage from '../pages/Errorpage';

const Routes = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement:<ErrorPage></ErrorPage>,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/shop",
                element: <Shop />
            },
            {
                path: "/categories",
                element: <Categories />
            },
            {
                path: "/newarrivals",
                element: <NewArrivals />
            },
            {
                path: "/sale",
                element: <Sale />
            },
            {
                path: "/about",
                element: <About />
            },
            // ✅ FIX: Added :orderId to handle dynamic tracking links
            {
                path: "/ordertracking/:orderId", 
                element: <OrderTracking />
            },
            {
                path: "/ordertracking", 
                element: <OrderTracking />
            },
            {
                path: "/cartpage",
                element: <CartPage />
            },
            {
                path: "/dashboard",
                element: <Dashboard></Dashboard>
            },
            {
                path: "/paymentpage",
                element: <PaymentPage />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/account",
                element: <Account />
            },
            {
                path: "/shippingpolicy",
                element: <ShippingPolicy></ShippingPolicy>
            },
           
            {
                path: "/returnpolicy",
                element: <ReturnPolicy></ReturnPolicy>
            },
           
            {
                path: "/faq",
                element:<FAQ></FAQ>
            },
           
        ]
    }
]);

export default Routes;