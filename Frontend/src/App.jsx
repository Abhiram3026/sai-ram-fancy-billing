  import { useEffect, useState } from "react";
  import axios from "axios";
  import BarcodeScannerComponent from "react-qr-barcode-scanner";
  import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
  import "./App.css";

  function App() {

    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
      barcode: "",
      name: "",
      price: "",
      stock: ""
    });
    const [barcode, setBarcode] = useState("");
    const [search, setSearch] = useState("");
    const [scannerOn, setScannerOn] = useState(false);
  const [cart, setCart] = useState([]);
  const [sales, setSales] = useState([]);
  const totalAmount = cart.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  const totalRevenue = sales.reduce((total, sale) => {
  return total + sale.totalPrice;
}, 0);

const totalSales = sales.length;

const totalProductsSold = sales.reduce((total, sale) => {
  return total + sale.quantity;
}, 0);
const chartData = sales.map((sale) => ({
  name: sale.productName,
  revenue: sale.totalPrice
}));

   useEffect(() => {

  fetchProducts();
  fetchSales();

}, []);

const fetchSales = () => {

  axios.get("http://localhost:8080/sales")
    .then((response) => {

      setSales(response.data);

    });
};

    const fetchProducts = () => {
      axios.get("http://localhost:8080/products")
        .then((response) => {
          setProducts(response.data);
        });
    };

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const addProduct = () => {

      axios.post("http://localhost:8080/products", formData)
        .then(() => {

          fetchProducts();

          setFormData({
            barcode: "",
            name: "",
            price: "",
            stock: ""
          });
        });
    };
    const deleteProduct = (id) => {

    axios.delete(`http://localhost:8080/products/${id}`)
      .then(() => {
        fetchProducts();
      });

  };
  const handleBarcode = async (e) => {

    if (e.key === "Enter") {

      try {

        const response = await axios.get(
          `http://localhost:8080/products/barcode/${barcode}`
        );

        const product = response.data;
        if (product.stock <= 0) {
    alert("Out of Stock");
    return;
  }

        const existingProduct = cart.find(
    (item) => item.id === product.id
  );

  if (existingProduct) {

    const updatedCart = cart.map((item) =>

      item.id === product.id
        ? {
            ...item,
            quantity: item.quantity + 1
          }
        : item
    );

    setCart(updatedCart);
    await axios.put(
    `http://localhost:8080/products/${product.id}`,
    {
      ...product,
      stock: product.stock - 1
    }
  );

  fetchProducts();

  } else {

    setCart([
      ...cart,
      {
        ...product,
        quantity: 1
      }
    ]);
    await axios.put(
    `http://localhost:8080/products/${product.id}`,
    {
      ...product,
      stock: product.stock - 1
    }
  );

  fetchProducts();

  }

        setBarcode("");

      } catch (error) {

        alert("Product not found");

      }
    }
  };
 const printBill = () => {
cart.forEach(async (item) => {

  await axios.post("http://localhost:8080/sales", {
    productName: item.name,
    quantity: item.quantity,
    totalPrice: item.price * item.quantity
  });
  fetchSales();

});
  const billWindow = window.open("", "", "width=400,height=600");

  billWindow.document.write(`
    <html>
      <head>
        <title>Bill</title>
      </head>

      <body>

        <h1>Sai Ram Fancy Billing</h1>
        <div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap"
  }}
>

  <div
    style={{
      backgroundColor: "#2563eb",
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      minWidth: "200px"
    }}
  >
    <h3>Total Revenue</h3>
    <h2>₹ {totalRevenue}</h2>
  </div>

  <div
    style={{
      backgroundColor: "#16a34a",
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      minWidth: "200px"
    }}
  >
    <h3>Total Sales</h3>
    <h2>{totalSales}</h2>
  </div>

  <div
    style={{
      backgroundColor: "#9333ea",
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      minWidth: "200px"
    }}
  >
    <h3>Products Sold</h3>
    <h2>{totalProductsSold}</h2>
  </div>

</div>
        <hr />

        ${cart.map((item) => `
          <p>
            ${item.name} x ${item.quantity}
            = ₹ ${item.price * item.quantity}
          </p>
        `).join("")}

        <hr />

        <h2>Total: ₹ ${totalAmount}</h2>

      </body>
    </html>
  `);

  billWindow.document.close();

  billWindow.onload = function () {
    billWindow.print();
  };

};
const [isLoggedIn, setIsLoggedIn] = useState(false);

const [loginData, setLoginData] = useState({
  username: "",
  password: ""
});
const handleLogin = () => {

  if (
    loginData.username === "admin" &&
    loginData.password === "admin123"
  ) {

    setIsLoggedIn(true);

  } else {

    alert("Invalid Credentials");
  }
};
if (!isLoggedIn) {

  return (

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6f8"
      }}
    >

      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px gray",
          width: "300px"
        }}
      >

        <h2 style={{ textAlign: "center" }}>
          Admin Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={loginData.username}
          onChange={(e) =>
            setLoginData({
              ...loginData,
              username: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({
              ...loginData,
              password: e.target.value
            })
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px"
          }}
        >
          Login
        </button>

      </div>

    </div>
  );
}

    return (
      <div
  style={{
    padding: "20px",
    fontFamily: "Arial",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh"
  }}
>

        <h1
  style={{
    textAlign: "center",
    color: "#263144",
    marginBottom: "30px"
  }}
>
  Sai Ram Fancy Billing
</h1>
<div
  style={{
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap"
  }}
>

  <div
    style={{
      backgroundColor: "#2563eb",
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      minWidth: "200px"
    }}
  >
    <h3>Total Revenue</h3>
    <h2>₹ {totalRevenue}</h2>
  </div>

  <div
    style={{
      backgroundColor: "#16a34a",
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      minWidth: "200px"
    }}
  >
    <h3>Total Sales</h3>
    <h2>{totalSales}</h2>
  </div>

  <div
    style={{
      backgroundColor: "#9333ea",
      color: "white",
      padding: "20px",
      borderRadius: "10px",
      minWidth: "200px"
    }}
  >
    <h3>Products Sold</h3>
    <h2>{totalProductsSold}</h2>
  </div>

</div>

        <div
  style={{
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  }}
>

          <input
            type="text"
            name="barcode"
            placeholder="Barcode"
            value={formData.barcode}
            onChange={handleChange}
          />

          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
          />

          <button
  onClick={addProduct}
  style={{
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer"
  }}
>
  Add Product
</button>

        </div>
        <div
  style={{
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px"
  }}
>

  <h2>Revenue Analytics</h2>

  <ResponsiveContainer width="100%" height={300}>

    <BarChart data={chartData}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="name" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="revenue"
        fill="#2563eb"
      />

    </BarChart>

  </ResponsiveContainer>

</div> 
        <h2>Billing Section</h2>

  <input
    type="text"
    placeholder="Scan Barcode"
    value={barcode}
    onChange={(e) => setBarcode(e.target.value)}
    onKeyDown={handleBarcode}
  />
  <button
  onClick={() => setScannerOn(!scannerOn)}
  style={{
    marginBottom: "20px",
    padding: "10px 20px",
    backgroundColor: "#9333ea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  }}
>
  {scannerOn ? "Close Scanner" : "Open Scanner"}
</button>
{scannerOn && (

  <BarcodeScannerComponent
    width={400}
    height={300}

    onUpdate={(err, result) => {

      if (result) {

        setBarcode(result.text);

        handleBarcode({
          key: "Enter"
        });
      }
    }}
  />
)}
  <input
  type="text"
  placeholder="Search Product"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    marginBottom: "20px",
    padding: "10px",
    width: "300px",
    borderRadius: "8px",
    border: "1px solid gray"
  }}
/>

        <table border="1" cellPadding="10">
          

          <thead>
            <tr>
              <th>ID</th>
              <th>Barcode</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th> 
            </tr>
          </thead>

          <tbody>

            {products
  .filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )
  .map((product) => (

              <tr
  key={product.id}
  style={{
    backgroundColor:
      product.stock <= 5 ? "#fecaca" : "white"
  }}
>
                <td>{product.id}</td>
                <td>{product.barcode}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>

  {product.stock}

  {product.stock <= 5 && (
    <span
      style={{
        color: "red",
        marginLeft: "10px",
        fontWeight: "bold"
      }}
    >
      Low Stock
    </span>
  )}

</td>
                <td>
    <button
  onClick={() => deleteProduct(product.id)}
  style={{
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  Delete
</button>
  </td>
              </tr>

            ))}

          </tbody>

        </table>
        <h2>Cart</h2>

  <table border="1" cellPadding="10">

    <thead>
      <tr>
        <th>Name</th>
  <th>Price</th>
  <th>Qty</th>
  <th>Total</th> 
      </tr>
    </thead>

    <tbody>

      {cart.map((item, index) => (

        <tr key={index}>
          <td>{item.name}</td>
  <td>{item.price}</td>
  <td>{item.quantity}</td>
  <td>{item.price * item.quantity}</td>
        </tr>

      ))}

    </tbody>

  </table>
  <h2>Total: ₹ {totalAmount}</h2>

<button
  onClick={printBill}
  style={{
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px"
  }}
>
  Print Bill
</button>

<h2 style={{ marginTop: "40px" }}>
  Sales History
</h2>

<table border="1" cellPadding="10">

  <thead>
    <tr>
      <th>ID</th>
      <th>Product</th>
      <th>Quantity</th>
      <th>Total Price</th>
    </tr>
  </thead>

  <tbody>

    {sales.map((sale) => (

      <tr key={sale.id}>
        <td>{sale.id}</td>
        <td>{sale.productName}</td>
        <td>{sale.quantity}</td>
        <td>₹ {sale.totalPrice}</td>
      </tr>

    ))}

  </tbody>

</table>  

      </div>
    );
  }

  export default App;