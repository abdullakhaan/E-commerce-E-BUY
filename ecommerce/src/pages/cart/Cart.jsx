import React, { useContext, useEffect, useState } from "react";
import myContext from "../../context/data/myContext";
import Layout from "../../components/layout/Layout";
import Modal from "../../components/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart } from "../../redux/cartSlice";
import { toast } from "react-toastify";
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import { fireDB } from "../../firebase/FirebaseConfig"; // Firebase configuration

function Cart() {
  const context = useContext(myContext);
  const { mode } = context;
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);

  const [totalAmount, setTotalAmount] = useState(0);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Calculate Total Amount
  useEffect(() => {
    let temp = 0;
    cartItems.forEach((cartItem) => {
      temp += parseInt(cartItem.price);
    });
    setTotalAmount(temp);
  }, [cartItems]);

  const shipping = 199; // Fixed Shipping Cost
  const grandTotal = shipping + totalAmount;

  // Delete item from cart
  const deleteCart = (item) => {
    dispatch(deleteFromCart(item));
    toast.success("Item Deleted");
  };

  // Store order information in Firestore
  const buyNow = async () => {
    if (name === "" || address === "" || pincode === "" || phoneNumber === "") {
      return toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000,
      });
    }

    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
    };

    const orderInfo = {
      cartItems,
      addressInfo,
      totalAmount: grandTotal,
      date: new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      email: JSON.parse(localStorage.getItem("user"))?.user.email, 
      userid: JSON.parse(localStorage.getItem("user"))?.user.uid ,
    };

    try {
      const orderRef = collection(fireDB,  "orders");
      await addDoc(orderRef, orderInfo);

      toast.success("Order placed successfully", {
        position: "top-center",
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to place order", {
        position: "top-center",
        autoClose: 1500,
      });
    }
  };

  return (
    <Layout>
      <div
        className="h-screen bg-gray-100 pt-5 mb-[100%]"
        style={{
          backgroundColor: mode === "dark" ? "#282c34" : "",
          color: mode === "dark" ? "white" : "",
        }}
      >
        <h1 className="mb-10 text-center text-2xl font-bold">Cart Items</h1>
        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
          <div className="rounded-lg md:w-2/3">
            {cartItems.map((item, index) => {
              const { title, price, description, imageUrl } = item;
              return (
                <div
                  key={index}
                  className="justify-between mb-6 rounded-lg border drop-shadow-xl bg-white p-6 sm:flex sm:justify-start"
                  style={{
                    backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "",
                    color: mode === "dark" ? "white" : "",
                  }}
                >
                  <img
                    src={imageUrl}
                    alt="product-image"
                    className="w-full rounded-lg sm:w-40"
                  />
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold">{title}</h2>
                      <h2 className="text-sm">{description}</h2>
                      <p className="mt-1 text-xs font-semibold">Rs {price}</p>
                    </div>
                    <div
                      onClick={() => deleteCart(item)}
                      className="mt-4 flex justify-between sm:mt-0 sm:block sm:space-x-6"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mt-6 rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3"
            style={{
              backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "",
            }}
          >
            <div className="flex justify-between mb-2">
              <p>Subtotal</p>
              <p>Rs {totalAmount}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping</p>
              <p>Rs {shipping}</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between">
              <p className="text-lg font-bold">Total</p>
              <p className="text-lg font-bold">Rs {grandTotal}</p>
            </div>

            <Modal
              name={name}
              address={address}
              pincode={pincode}
              phoneNumber={phoneNumber}
              setName={setName}
              setAddress={setAddress}
              setPincode={setPincode}
              setPhoneNumber={setPhoneNumber}
              buyNow={buyNow}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Cart;
