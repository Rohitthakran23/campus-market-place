import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import "./Home.css";
import { FaHeart } from "react-icons/fa";



function LikedProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const url = "http://localhost:3001/likedproducts";
    let userId = localStorage.getItem('userId')
    const data = { userId:localStorage.getItem('userId')}
    axios.post(url,data)
      .then((res) => {
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        alert("Server Err.");
      });
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleClick = () => {
    console.log("products", products);
    const filterProducts = products.filter((item) => {
      return (
        item.pname.toLowerCase().includes(search.toLowerCase()) ||
        item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFilteredProducts(filterProducts);
  };
  const handleLike = (e, productId) => {
    e.stopPropagation(); // Important: stops event bubbling
  
    let userId = localStorage.getItem('userId');
    console.log('userId', "productId", userId, productId);
    
    const url = "http://localhost:3001/likeProducts";
    const data = { userId, productId };
    axios.post(url, data)
      .then((res) => {
        console.log(res);
        // Optional: navigate after liking
        navigate('/favourite');
      });
  };
 

  const displayProducts =
    filteredProducts.length > 0 ? filteredProducts : products;



  return (
    <div>
      <Header search={search} handleSearch={handleSearch} handleClick={handleClick}/>
      <div className="Products">
        <h1 style={{ marginLeft: "15px" }}>PRODUCT LIST</h1><br/>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {displayProducts.map((item, index) => (
            <div key={index._id} className="row row-cols-1 row-cols-md-3 g-4">
              <div className="col">
                <div className="card">
                <div className="icon-con" onClick={(e) => handleLike(e, item._id)}>
  <FaHeart className="icons" />
</div>

                  <img src={`${'http://localhost:3001/'+item.pimage}`}
                    className="card-img-top"
                    alt={item.pname}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {item.pname} | {item.category}
                    </h5>
                    <p className="card-text">{item.pdesc}</p>
                    <h5 className="card-title">{item.price}</h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LikedProducts;