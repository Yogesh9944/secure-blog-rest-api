const Post = require("../models/Post");

const toSlug = (title) =>
  title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-") + "-" + Date.now();

const getAllPosts = async (req, res) => {
  try {

    const posts = await Post.find({ published: true })
      .populate("user", "username avatar_url")
      .sort({ createdAt: -1 });

    res.json({ posts });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPost = async (req, res) => {

  try {

    const post = await Post.findOne({ slug: req.params.slug })
      .populate("user", "username avatar_url bio");

    if (!post)
      return res.status(404).json({ error: "Post not found" });

    res.json({ post });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};

const createPost = async (req, res) => {

  try {

    const { title, content, excerpt, cover_url, published } = req.body;

    const slug = toSlug(title);

    const post = await Post.create({
      user: req.user._id,
      title,
      slug,
      content,
      excerpt,
      cover_url,
      published
    });

    res.status(201).json({ post });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};

const updatePost = async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Forbidden" });

    Object.assign(post, req.body);

    await post.save();

    res.json({ post });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};

const deletePost = async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Forbidden" });

    await post.deleteOne();

    res.json({ message: "Post deleted" });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};

const getMyPosts = async (req, res) => {

  try {

    const posts = await Post.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ posts });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts
};