const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
const multer=require('multer')
const path=require('path')
const registerModel = require('./models/RegsiterSchema');
const Post = require('./models/PostSchema');
app.use('/uploads', express.static('uploads'));

dotenv.config();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const mongo_url = process.env.MONGO_URL;

mongoose.connect(mongo_url).then(
    () => console.log('Database is connected')
).catch((err) => {
    console.log(err);
});

// User Registration
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    registerModel.findOne({ email: email }).then(user => {
        if (user) {
            res.json({ success: false, message: "User already exists" });
        } else {
            registerModel.create(req.body) // Create a new user
                .then((data) => 
                    res.json({ success: true, message: "Registration successful", user: data })
                )
                .catch(err => res.json(err));
        }
    });
});

// User Login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    registerModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("success");
                } else {
                    res.json("Wrong password");
                }
            } else {
                res.json("User not found");
            }
        });
});
// Images part
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
  })
  
  const upload = multer({ storage }).single('image'); // Single image upload

  app.post("/post", upload, async (req, res) => {
    const { title, content, email } = req.body;

    if (!title || !content || !email) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image upload failed" });
        }

        const newPost = await Post.create({
            title,
            content,
            email,
            image: {
                path: `/uploads/${req.file.filename}`, // Save the path for the image
                filename: req.file.filename, // Ensure filename is also saved
            }
        });

        res.json({ success: true, message: "Post created successfully", post: newPost });
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ success: false, message: "Error creating post", error: err });
    }
});

  
// Fetch posts associated with the email
app.get("/posts", async (req, res) => {
  const email = req.query.email;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const userPosts = await Post.find({ email }); 
    res.json(userPosts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ success: false, message: "Error fetching posts", error: err });
  }
});
// Fetch all posts
app.get("/fetchposts", async (req, res) => {
  try {
      const allPosts = await Post.find(); // Retrieve all posts
      res.json(allPosts);
  } catch (err) {
      console.error("Error fetching posts:", err);
      res.status(500).json({ success: false, message: "Error fetching posts", error: err });
  }
});
// Fetch a single post by ID
app.get("/fetchpost/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error("Error fetching post:", err);
        res.status(500).json({ success: false, message: "Error fetching post", error: err });
    }
});
// Route to handle updating posts
app.put("/post/:id", upload, async (req, res) => {
    const { id } = req.params;
    const { title, content, email } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Update title and content
        post.title = title;
        post.content = content;

        if (req.file) {
            post.image = {
                path: `/uploads/${req.file.filename}`, // Save the new image path
                filename: req.file.filename // Save the new filename
            };
        }

        const updatedPost = await post.save(); // Save the updated post
        res.json({ success: true, message: 'Post updated successfully', post: updatedPost });
    } catch (err) {
        console.error("Error updating post:", err);
        res.status(500).json({ success: false, message: 'Error updating post', error: err });
    }
});


// Route to handle deleting posts
app.delete("/post/:id", (req, res) => {
    const { id } = req.params; 

    Post.findByIdAndDelete(id)
        .then(deletedPost => {
            if (!deletedPost) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
            res.json({ success: true, message: 'Post deleted successfully' });
        })
        .catch(err => res.status(500).json({ success: false, message: 'Error deleting post', error: err }));
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});



























// //image endpoint
// app.post('/single', upload.single('image'), async(req, res) => { 
//     //     /*single means user can upload only one image at a time*/
//     try{
//         const{path,filename}=req.file;
//         const image=await ImageModel({path,filename})
//         await image.save();
//         res.send({"msg":"image uploaded successfully"})

//     }
//     catch(err){
//         console.error("Error uploading image:", err);
//         res.status(500).json({ success: false, message: "Error uploading image", error: err });
        
//     }
//     // if (!req.file) {
//     //   console.error('No file received');
//     //   return res.status(400).send('No file uploaded.');
//     // }
//     // console.log('File received:', req.file);
//     // res.send('File uploaded successfully!');
//   });