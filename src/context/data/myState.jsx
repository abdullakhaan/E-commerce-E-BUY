import React, { useEffect, useState } from 'react';
import MyContext from './myContext';
import { fireDB } from '../../firebase/FirebaseConfig';
import { Timestamp, addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

function MyState(props) {
  const [mode, setMode] = useState('light');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({
    title: null,
    price: null,
    imageUrl: null,
    category: null,
    description: null,
    time: Timestamp.now(),
    date: new Date().toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    ),
  });

  const [product, setProduct] = useState([]);
  const [orders, setOrders] = useState([]); // Renamed from `order` to `orders`

  // Toggle mode (dark/light)
  const toggleMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      document.body.style.backgroundColor = newMode === 'dark' ? 'rgb(17, 24, 39)' : 'white';
      return newMode;
    });
  };

  // Fetch orders from Firestore
  const getOrderData = async () => {
    setLoading(true);
    try {
      const result = await getDocs(collection(fireDB, "orders"));
      const ordersArray = [];
      result.forEach((doc) => {
        ordersArray.push({ ...doc.data(), id: doc.id });
      });
      setOrders(ordersArray); // Updated to set `orders`
      console.log('Fetched Orders:', ordersArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // Fetch products from Firestore
  const getProductData = async () => {
    setLoading(true);
    try {
      const q = query(collection(fireDB, "products"), orderBy("time"));
      onSnapshot(q, (querySnapshot) => {
        const productsArray = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setProduct(productsArray);
        setLoading(false);
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const [users, setUsers] = useState([]);

  const getUserData = async () => {
    setLoading(true)
    try {
      const result = await getDocs(collection(fireDB, "users"))
      const userArray = [];
      result.forEach((doc) => {
      userArray.push(doc.data());
      setLoading(false) 
      });
      setUsers(userArray);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false)
      
      
    }
  }

  // Initialize data on component mount
  useEffect(() => {
    getProductData();
    getOrderData();
    getUserData();
  }, []);

  const [searchkey, setSearchkey] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterPrice, setFilterPrice] = useState('')

  return (
    <MyContext.Provider
      value={{
        mode,
        toggleMode,
        loading,
        setLoading,
        products,
        setProducts,
        product,
        orders, // Renamed from `order` to `orders`
      users, 
      searchkey, setSearchkey,
      filterType, setFilterType,
      filterPrice, setFilterPrice,
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
}

export default MyState;
