import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:5000/";

const Posts = ({ isLoggedIn }) => {
  
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState();
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState([]);
  const [currentPostId, setCurrentPostId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      const userEmail = localStorage.getItem("email");
      if (userEmail) {
        setEmail(userEmail);
        fetchPosts(userEmail);
      } else {
        setPosts([]); // Clear posts if no user email
        console.error("No user email found in localStorage.");
      }
    }
  }, [isLoggedIn, navigate]);

  const fetchPosts = async (userEmail) => {
    try {
      const response = await axios.get(`/posts?email=${userEmail}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditModal(false);
    setTitle("");
    setContent("");
    setCurrentPostId(null);
  };

  const PostSubmit = async () => {
    if (!email) {
      console.error("User is not logged in. Cannot submit post.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("email", email);
    if (img && img.length > 0) {
      formData.append("image", img[0]); 
    }

    try {
      const response = await axios.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPosts([...posts, response.data.post]);
      handleClose();
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/post/${postId}`);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const openEditModal = (post) => {
    setCurrentPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (img && img.length > 0) {
      formData.append("image", img[0]); // Add the image if it exists
    }

    try {
      await axios.put(`/post/${currentPostId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPosts(
        posts.map((post) =>
          post._id === currentPostId ? { ...post, title, content } : post
        )
      );
      handleClose();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };
  
  return (
    <>
      <h1 className="text-center">Posts Page</h1>
      <p className="mt-5 text-center">{posts.length === 0 ? "No posts" : ""}</p>
      <div className="d-flex justify-content-center p-5">
        <button
          type="button"
          className="btn btn-primary w-25"
          onClick={() => setShowModal(true)}
        >
          +Add Posts
        </button>
        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          style={{ display: showModal ? "block" : "none" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Post</h5>
              </div>
              <div className="modal-body">
                <form method="POST" enctype="multipart/form-data">
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      placeholder="Enter title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                      className="form-control"
                      id="content"
                      rows="3"
                      placeholder="Enter content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                  </div>
                  <div className=" mt-2">
                    <input
                      type="file"
                      className=""
                      name="image"
                      onChange={(e) => setImg(e.target.files)}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={PostSubmit}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <div
          className={`modal fade ${editModal ? "show" : ""}`}
          style={{ display: editModal ? "block" : "none" }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Post</h5>
              </div>
              <div className="modal-body">
                <form method="POST" enctype="multipart/form-data">
                  <div className="form-group">
                    <label htmlFor="edit-title">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="edit-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-content">Content</label>
                    <textarea
                      className="form-control"
                      id="edit-content"
                      rows="3"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                  </div>
                  <div className=" mt-2">
                    <input
                      type="file"
                      className=""
                      name="image"
                      onChange={(e) => setImg(e.target.files)}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEditSubmit}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="row">
          {posts.map((post) => (

            <div className="col-md-4 mb-4" key={post._id}>
              <div className="card h-100">
                <div className="card-body">
                <img
                      src={`http://localhost:5000${post.image.path}`} // Use the full path
                      alt={post.title}
                      className="card-img-top"
                  />
                  
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.content}</p>
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-warning ml-2"
                    onClick={() => openEditModal(post)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Posts;
