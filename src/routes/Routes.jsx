import { createBrowserRouter } from 'react-router-dom';
import Root from '../layout/Root';

// Added this missing import
import Homepage from '../pages/Homepage'; 

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
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Homepage /> // ✅ Fixed: Closed the component and object
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
                element: <Dashboard />
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
                element: <ShippingPolicy />
            },
            {
                path: "/returnpolicy",
                element: <ReturnPolicy />
            },
            {
                path: "/faq",
                element: <FAQ />
            },
        ]
    }
]);

export default Routes;