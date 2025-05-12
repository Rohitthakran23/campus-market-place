import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import ProductCarousel from "./ProductCarousel"; // Import the ProductCarousel component
import io from 'socket.io-client';
let socket;

function ProductDetail() {
  const [product, setproduct] = useState()
  const [msg, setmsg] = useState('')
  const [msgs, setmsgs] = useState([])
  const [user, setUser] = useState()
  // console.log(user, "userrrrr")
  const p = useParams()


  useEffect(() => {
      socket = io('http://localhost:3001')

      socket.on('connect', () => {
          console.log('con')
      })
      return () => {
          socket.off()
      }

  }, [])

  useEffect(() => {
    const url = "http://localhost:3001/getproduct/" + p.productId;
    axios.get(url)
        .then((res) => {
            if (res.data.product) {
                setproduct(res.data.product)
                localStorage.setItem('productId', res.data.product._id)
            }
        })
        .catch((err) => {
            alert('Server Err.')
        })
}, [])
useEffect(() => {
  socket.on('getMsg', (data) => {
    const filteredData = data.filter(item => item.productId === p.productId);
    setmsgs(filteredData);
  });

  // Clean up socket event listener when component unmounts
  return () => {
    socket.off('getMsg');
  };
}, [p.productId]);



const handleSend = () => {
  const data = { username: localStorage.getItem('userName'), msg, productId: localStorage.getItem('productId') };
  console.log(data, "data send");
  socket.emit('sendMsg', data);
  // Assuming your new message is stored in `data`, you can update the local state like this:
  setmsgs([...msgs, data]); // Append the new message to the existing messages
  setmsg(''); // Clear the input field after sending the message
};


  const handleContact = (addedBy) => {
    console.log("id", addedBy);
    const url = "http://localhost:3001/getuser/" + addedBy;
    axios
      .get(url)
      .then((res) => {
        console.log(res);
        if (res.data.user) {
          console.log(res.data.user);
          setUser(res.data.user);
        }
      })
      .catch((err) => {
        alert("Server Err.");
      });
  };

  return (
    <div>
      <Header />
      <h3 style={{ margin: "2%" }}>Product Details</h3>
      <div>
        {product && (
          <div
            className="d-flex justify-content-space-around flex-wrap"
            style={{ margin: "2%" }}
          >
            <div>
              <ProductCarousel images={[product.pimage, product.pimage2]} />
              <h6> Product Details : </h6>
              {product.pdesc}
            </div>
            <div style={{ marginLeft: "10%" }}>
              <h3 className="m-2 price-text"> Rs. {product.price} /- </h3>
              <p className="m-2">
                {" "}
                {product.pname} | {product.category}{" "}
              </p>
              <p className="m-2 text-success"> {product.pdesc} </p>
              {product.addedBy && (
                <button
                  className="btn btn-success"
                  style={{ color: "white" }}
                  onClick={() => handleContact(product.addedBy)}
                >
                  SHOW CONTACT DETAILS
                </button>
              )}
              <br />
              <br />
              {user && user.username && <h5><span>Name: </span>{user.username}</h5>}
              {user && user.mobile && <h5><span>Mobile No: </span>{user.mobile}</h5>}
              {user && user.email && <h5><span>Email: </span>{user.email}</h5>}
              {user && user.userlocation && <h5><span>Location: </span>{user.userlocation}</h5>}
            </div>
            <div>
                    CHATS
                    {
                        msgs && msgs.length > 0 &&
                        msgs.map((item, index) => {
                          <div></div>
                          console.log(item)
                            if (item.username === localStorage.getItem('userName')) {
                                return (
                                    <p key={item._id} style={{ color: '#fff', marginRight: '100px', background: '#61dafb', borderRadius: '5px' }}>
                                        {item.username} : {item.msg} </p>
                                )
                            }
                            if (item.username !== localStorage.getItem('userName')) {
                                return (
                                    <p key={item._id} style={{ color: '#fff', marginLeft: '100px', background: '#282c34', borderRadius: '5px' }}>
                                        {item.username} : {item.msg} </p>
                                )
                            }
                        })
                    }
                    <input value={msg} onChange={(e) => setmsg(e.target.value)} className="form-control" type="text" />
                    <button onClick={handleSend} className="btn btn-primary">SEND </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
