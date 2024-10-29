import React, { useEffect, useState } from "react";
import MyContext from "./myContext";
import { fireDB } from "../../firebase/FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";

function myState(props) {
  const [mode, setMode] = useState("light");
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    if (mode === "light") {
      setMode("dark");
      document.body.style.backgroundColor = "rgb(17, 24, 39)";
    } else {
      setMode("light");
      document.body.style.backgroundColor = "white";
    }
  };

  const [products, setProduct] = useState({
    title: null,
    price: null,
    imageUrl: null,
    category: null,
    description: null,
    time: Timestamp.now(),
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });

  //*****************     add product section********

  const addProduct = async () => {
    if (
      products.title == null ||
      products.price == null ||
      products.imageUrl == null ||
      products.category == null ||
      products.description == null
    ) {
      return toast.error("All fields are required");
    }
    const productRef = collection(fireDB, "products");
    setLoading(true);
    try {
      await addDoc(productRef, products);
      toast.success("Product added");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);

      getProductData();
      closeModal();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setproduct("");
  };

  const [product, setproduct] = useState([]);

  // *************GET PRODUCT****************

  const getProductData = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "products"), orderBy("time"));

      const data = onSnapshot(q, (QuerySnapshot) => {
        let productsArray = [];
        QuerySnapshot.forEach((doc) => {
          productsArray.push({ ...doc.data(), id: doc.id });
        });

        setproduct(productsArray);
        setLoading(false);
      });
      return () => data;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  // ************** update product function **********
  const edithandle = (item) => {
    setProduct(item);
  };

  const updateProduct = async () => {
    setLoading(true)
    try {
      await setDoc(doc(fireDB, 'products', products.id), products);
    toast.success("Product Updated")
  setTimeout(() => {
      window.location.href = '/dashboard'
  }, 800);
    getProductData();
  
    setLoading(false)

    } catch (error) {
      console.log(error);
      setLoading(false)
      
    }
  };

  // ****************** delete product *******************

  const deleteProduct = async (item) => {
    setLoading(true)
   try {
    await deleteDoc(doc(fireDB, 'products', item.id));
    toast.success("Product Deleted")
    getProductData();
    setLoading(false)
    
   } catch (error) {
    console.log(error);
    setLoading(false)
   }

  }

  return (
    <MyContext.Provider
      value={{
        mode,
        toggleMode,
        loading,
        setLoading,
        products,
        setProduct,
        addProduct,
        product,
        edithandle,
        updateProduct,
        deleteProduct
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
}
export default myState;
