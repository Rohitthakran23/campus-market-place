console.log("Backend");
const express = require('express');
const PORT = 3001;
var cors = require('cors')  
const path = require('path');
var jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config()
const app = express();
app.use(cors())
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })


const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
      origin: '*'
  }
})
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Create a Mongoose model
const Users = mongoose.model('Users', {
   username: String,
    password: String,
    mobile: String,
    email: String,
    userlocation: String,
    likedProducts:[{type:mongoose.Schema.Types.ObjectId,ref:'Products'}] });

// Create a Mongoose model
const AdminUsers = mongoose.model('AdminUsers', {
  username: String,
   password: String,
   mobile: String,
   email: String,
   userlocation: String
  //  likedProducts:[{type:mongoose.Schema.Types.ObjectId,ref:'Products'}] 
  });

    let schema =new mongoose.Schema({
      
      pname:String,
       pdesc:String,
        price:String,
         category:String,
          pimage:String,
          pimage2:String, 
          addedBy:mongoose.Schema.Types.ObjectId,
            userlocation:String,
            status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

          })
    const Products = mongoose.model('Products', schema);


// Define routes
app.get('/', (req, res) => {
  res.send('Hello World! Root Directory');
});

//Approve Products

app.put('/admin/approve/:productId', (req, res) => {
  const productId = req.params.productId;
  const status = req.body.status;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  Products.findByIdAndUpdate(productId, { status }, { new: true })
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.json(updatedProduct);
    })
    .catch((error) => {
      console.error('Error approving/rejecting product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});



// Liked Product Api
app.post('/likeProducts', (req, res) => {
  let productId = req.body.productId;
  let userId = req.body.userId;

  Users.updateOne({ _id: userId }, { $addToSet: { likedProducts: productId } })
      .then(() => {
          res.send({ message: 'liked success.' })
      })
      .catch(() => {
          res.send({ message: 'server err' })
      })

});



// My Product Api
app.post('/myproducts', (req, res) => {
  
  const userId = req.body.userId;
  
  Products.find({ addedBy : userId })

      .then((result) => {
          res.send({ message: 'success' ,products: result })
      })
      .catch(() => {
          res.send({ message: 'server err' })
      })

});



// Signup API
app.post('/signup', (req, res) => {
  // Create a new user and save to the database
  const username = req.body.username;
  const password = req.body.password;
  const mobile = req.body.mobile;
  const email = req.body.email;
  const userlocation = req.body.userlocation;
  const user = new Users({ username: username, password: password ,mobile,email,userlocation});
  user.save()
    .then(() => {
      console.log("User Registered");
      res.send({ message: 'Saved successfully.' });
    })
    
    .catch((err) => {
      console.error('Error saving user:', err);
      res.status(500).send({ error: 'Internal Server Error' });
    });
});


// Login API
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  Users.findOne({ username: username })
    .then((result) => {
      console.log(result,"User Data")
      if (!result) {
        // User not found
        res.send({ message: "User not found" });
      } else {
        // User found, do something with the result
        if (result.password == password){
          const token = jwt.sign({ data: result}, 'secret', { expiresIn: '1h' });

          console.log(result, "Login Successfully");
          res.send({ message: 'Found successfully.',token: token, userId: result._id, username: username });
        }
        if(result.password!=password){
          console.log(result, "Wrong Password");
          res.send({ message: 'Wrong Password' });
        }
      }
    })
    .catch((err) => {
      
      res.status(500).send({ error: 'Internal Server Error' });
    });
});


// AdminSignup API
app.post('/adminsignup', (req, res) => {
  // Create a new user and save to the database
  const username = req.body.username;
  const password = req.body.password;
  const mobile = req.body.mobile;
  const email = req.body.email;
  const userlocation = req.body.userlocation;
  const user = new AdminUsers({ username: username, password: password ,mobile,email,userlocation});
  console.log(res.data);
  user.save()
    .then(() => {
      console.log("User Registered");
      res.send({ message: 'Saved successfully.' });
    })
    
    .catch((err) => {
      console.error('Error saving user:', err);
      res.status(500).send({ error: 'Internal Server Error' });
    });
});


// Login API
app.post('/adminlogin', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  AdminUsers.findOne({ username: username })
    .then((result) => {
      console.log(result,"User Data")
      if (!result) {
        // User not found
        res.send({ message: "User not found" });
      } else {
        // User found, do something with the result
        if (result.password == password){
          const isAdmin = true;
          const token = jwt.sign({ data: result}, 'secret', { expiresIn: '1h' });

          console.log(result, "Login Successfully");
          res.send({ message: 'Found successfully.',token: token, userId: result._id, username: username,isAdmin:isAdmin });
        }
        if(result.password!=password){
          console.log(result, "Wrong Password");
          res.send({ message: 'Wrong Password' });
        }
      }
    })
    .catch((err) => {
      
      res.status(500).send({ error: 'Internal Server Error' });
    });
});



// Add Product API
// Add Product API
app.post('/addproduct', upload.fields([{ name: 'pimage', maxCount: 1 }, { name: 'pimage2', maxCount: 1 }]), (req, res) => {
  const userlocation = req.body.userlocation;
  const pname = req.body.pname;
  const pdesc = req.body.pdesc;
  const price = req.body.price;
  const category = req.body.category;
  const pimage = req.files['pimage'][0].path; // Accessing uploaded image file(s)
  const pimage2 = req.files['pimage2'][0].path; // Accessing uploaded image file(s)
  const addedBy = req.body.userId;

  // Create a new product instance
  const product = new Products({
    userlocation,
    pname,
    pdesc,
    price,
    category,
    pimage,
    pimage2,
    addedBy
  });

  // Save the product to the database
  product.save()
    .then(() => {
      res.send({ message: 'Product saved successfully.' });
    })
    .catch((error) => {
      console.error('Error saving product:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    });
});


// Search API
app.get ('/search',(req,res) => {
  let search = req.query.search;
  Products.find({
    $or: [
      { pname: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { pdesc: { $regex: search, $options: 'i' } },
      { price: { $regex: search, $options: 'i' } },
    ],
  })

  .then((results) => {
    res.send({message:'success', product:results})
  })
  .catch((err) => {
    res.send({message:'server err'})
  })
})

// Get Product API
app.get('/getproducts',(req,res) => {
  Products.find()
  .then((result) => {
    // console.log(result,"user data")
    res.send({message:'success', products:result })
  })





  .catch((err) => {
    res.send({message:'server err'})
  })
})

// Get Liked Product API
app.post ('/likedproducts',(req,res) => {
  Users.findOne({_id : req.body.userId}).populate('likedProducts')
  .then((result) => {
    // console.log(result)
    res.send({message:'success', products:result.likedProducts})
  })
  .catch((err) => {
    res.send({message:'server err'})
  })
})

// Get Product Detail API
app.get ('/getproduct/:pId',(req,res) => {
  
  Products.findOne( {_id : req.params.pId} )
  .then((result) => {
    // console.log(result);
    res.send({message:'success', product:result })
  })
  .catch((err) => {
    res.send({message:'server err'})
  })
})

app.get('/getuser/:uId', (req, res) => {
  const _userId = req.params.uId;
  Users.findOne({ _id : _userId })
  .then((result) => {
    
    res.send({message:'success', user:{
      username:result.username,
      mobile:result.mobile,
      email:result.email,
      userlocation:result.userlocation}})
  })
  .catch((err) => {
    res.send({message:'server err'})
  })
})

app.get('/myprofile/:userId', (req, res) => {
  let uid = req.params.userId

  Users.findOne({ _id: uid })
    .then((result) => {
      // console.log(result); // Move the console.log here
      res.send({
        message: 'success.',
        user: {
          email: result.email,
          mobile: result.mobile,
          username: result.username,
          userlocation: result.userlocation,
        },
      });
    })
    .catch(() => {
      res.send({ message: 'server err' });
    });
});

let messages = []
io.on('connection', (socket)=>{
  console.log('Socket Connected',socket.id);

  socket.on('sendMsg',(data)=>{
    messages.push(data);
    io.emit('getMsg',messages)
  })

  io.emit('getMsg',messages)
})
// Start the server
httpServer.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
