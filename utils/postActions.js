import axios from 'axios';
import baseUrl from './baseUrl';
import catchErrors from './catchErrors';
import cookie from 'js-cookie';

const Axios = axios.create({
  baseURL: `${baseUrl}/api/posts`,
  headers: { Authorization: cookie.get('token') },
});

export const submitNewPost = async (
  text,
  location,
  picUrl,
  setPosts,
  setNewPost,
  setError
) => {
  try {
    const res = await Axios.post('/', { text, location, picUrl });

    setPosts((prev) => [res.data, ...prev]);
    setNewPost({ text: '', location: '' });
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
};

export const deletePost = async (postId, setPosts, setShowToastr) => {
  try {
    await Axios.delete(`/${postId}`);

    setPosts((prev) => prev.filter((post) => post._id !== postId));
    setShowToastr(true);
  } catch (error) {
    alert(catchErrors(error));
  }
};

export const likePost = async (postId, userId, setLikes, like = true) => {
  try {
    if (like) {
      await Axios.post(`/like/${postId}`);

      setLikes((prev) => [...prev, { user: userId }]);
    } else if (!like) {
      await Axios.put(`/unlike/${postId}`);

      setLikes((prev) => prev.filter((like) => like.user !== userId));
    }
  } catch (error) {
    alert(catchErrors(error));
  }
};
