import React, { useContext } from "react";
import myContext from "../../../context/data/myContext";
import Loader from "../../../components/loader/Loader";

function DashboardTab() {
  const context = useContext(myContext);
  const { mode, loading, product, orders, users, edithandle, deleteProduct } = context;

  return (
    <div className="container mx-auto p-4">
      {loading && <Loader />}
      
      {/* Product List */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Product List</h2>
        {Array.isArray(product) && product.length > 0 ? (
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {product.map((item, index) => {
                const { id, title, price, imageUrl, category, date } = item;
                return (
                  <tr
                    key={id}
                    className="bg-gray-50 border-b dark:border-gray-700"
                    style={{ backgroundColor: mode === 'dark' ? 'rgb(46 49 55)' : '' }}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">
                      <img className="w-16" src={imageUrl} alt="img" />
                    </td>
                    <td className="px-6 py-4">{title}</td>
                    <td className="px-6 py-4">₹{price}</td>
                    <td className="px-6 py-4">{category}</td>
                    <td className="px-6 py-4">{date}</td>
                    <td className="px-6 py-4 flex gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => edithandle(item)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Edit
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => deleteProduct(item)}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No Products Available</p>
        )}
      </section>

      {/* Orders */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((allorder, index) => (
            <table key={index} className="w-full text-sm text-gray-500 mb-4">
              <thead className="text-xs uppercase bg-gray-200">
                <tr>
                  <th>Payment Id</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Address</th>
                </tr>
              </thead>
              {allorder?.cartItems?.map((item, itemIndex) => (
                <tbody key={itemIndex}>
                  <tr>
                    <td>{allorder.paymentId}</td>
                    <td>
                      <img className="w-16" src={item.imageUrl} alt="img" />
                    </td>
                    <td>{item.title}</td>
                    <td>₹{item.price}</td>
                    <td>{item.category}</td>
                    <td>{allorder.addressInfo?.name}</td>
                    <td>{allorder.addressInfo?.address}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          ))
        ) : (
          <p className="text-center">No Orders Available</p>
        )}
      </section>

      {/* Users */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">User List</h2>
        {Array.isArray(users) && users.length > 0 ? (
          <table className="w-full text-sm text-gray-500">
            <thead className="text-xs uppercase bg-gray-200">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>UID</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => {
                const { name, uid, email } = item;
                return (
                  <tr key={uid}>
                    <td>{index + 1}</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{uid}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No Users Available</p>
        )}
      </section>
    </div>
  );
}

export default DashboardTab;
