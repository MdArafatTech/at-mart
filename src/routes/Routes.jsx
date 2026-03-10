import { createBrowserRouter } from "react-router-dom";
import Root from "../layout/Root";

// Added this missing import
import Homepage from "../pages/Homepage";

import About from "../pages/About";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Account from "../component/Account";
import Shop from "../pages/Shop";
import Sale from "../pages/Sale";
import Categories from "../pages/Categories";
import NewArrivals from "../pages/NewArrivals";
import OrderTracking from "../component/OrderTracking";
import CartPage from "../pages/CartPage";
import PaymentPage from "../pages/PaymentPage";
import Dashboard from "../Dashboard";
import ShippingPolicy from "../component/ShippingPolicy";
import ReturnPolicy from "../component/ReturnPolicy";
import FAQ from "../component/FAQ";
import ErrorPage from "../pages/Errorpage";
import Forgot from "../component/Forgot";
import Customers from "../views/Customers";
import Header from "../views/Header";
import Orders from "../views/Orders";
import Overview from "../views/Overview";
import Settings from "../views/Settings";
import Sidebar from "../views/Sidebar";
import LiveChat from "../chat/LiveChat";
import AdminChat from "../views/AdminChat";
import Products from "../views/Products";
import UserOrders from "../pages/UserOrder";
import ReturnProgress from "../component/ReturnProgress";
import Return from "../views/Return";
import ResetPassword from "../component/ResetPassword";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Homepage />, // ✅ Fixed: Closed the component and object
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/newarrivals",
        element: <NewArrivals />,
      },
      {
        path: "/sale",
        element: <Sale />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/ordertracking/:orderId",
        element: <OrderTracking />,
      },
      {
        path: "/ordertracking",
        element: <OrderTracking />,
      },
      {
        path: "/cartpage",
        element: <CartPage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/customers",
        element: <Customers></Customers>,
      },
      {
        path: "/header",
        element: <Header></Header>,
      },
      {
        path: "/orders",
        element: <Orders></Orders>,
      },
      {
        path: "/overview",
        element: <Overview></Overview>,
      },
      {
        path: "/settings",
        element: <Settings> </Settings>,
      },
      {
        path: "/sidebar",
        element: <Sidebar> </Sidebar>,
      },

      {
        path: "/paymentpage",
        element: <PaymentPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot",
        element: <Forgot></Forgot>,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/shippingpolicy",
        element: <ShippingPolicy />,
      },
      {
        path: "/returnpolicy",
        element: <ReturnPolicy />,
      },
      {
        path: "/faq",
        element: <FAQ />,
      },
      {
        path: "/livechat",
        element: <LiveChat></LiveChat>
      },
      {
        path: "/adminchat",
        element: <AdminChat></AdminChat>
      },
      {
        path: "/products",
        element: <Products></Products>
      },
   
      {
        path: "/userorder",
        element: <UserOrders></UserOrders>
      },
      {
        path: "/returnprogress",
        element:<ReturnProgress></ReturnProgress>
      },
      {
        path: "/return",
        element: <Return></Return>
      },
      {
        path: "/resetpassword",
        element: <ResetPassword></ResetPassword>
      }
    ],
  },
]);

export default Routes;
