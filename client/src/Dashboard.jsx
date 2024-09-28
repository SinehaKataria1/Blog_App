import React, { useEffect, useState } from 'react';  
import { Link } from 'react-router-dom';
import axios from 'axios';


const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/fetchposts");
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setError("Failed to load posts. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="posts-container">
            {loading && <p>Loading posts...</p>}
            {error && <p className="error">{error}</p>}
            {posts.length > 0 ? (
                posts.map((post) => {
                    return (
                        <div key={post._id} className="post">
                           <img
                      src={`http://localhost:5000${post.image.path}`} // Use the full path
                      alt={post.title}
                      className="card-img-top"
                  />
                            <h2>{post.title}</h2>
                            <p>{post.content.length <= 23 ? post.content : post.content.substring(0, 23) + '...'}</p>
                            <Link to={`/post/${post._id}`} state={{ post }}>
                                <button>View More</button>
                            </Link>
                        </div>
                    );
                })
            ) : (
                !loading && <p>No posts available.</p>
            )}
        </div>
    );
};

export default Dashboard;
