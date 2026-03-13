const pool = require('../config/database');

// GET /api/posts/:postId/comments
const getComments = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.body, c.parent_id, c.created_at, c.updated_at,
              u.id AS author_id, u.username AS author_username, u.avatar_url AS author_avatar,
              COUNT(l.id)::INT AS like_count
       FROM comments c
       JOIN users u ON u.id = c.user_id
       LEFT JOIN likes l ON l.comment_id = c.id
       WHERE c.post_id = $1
       GROUP BY c.id, u.id ORDER BY c.created_at ASC`,
      [req.params.postId]
    );

    // Build nested tree
    const map = {};
    const roots = [];
    rows.forEach((c) => { map[c.id] = { ...c, replies: [] }; });
    rows.forEach((c) => {
      if (c.parent_id) map[c.parent_id]?.replies.push(map[c.id]);
      else roots.push(map[c.id]);
    });

    res.json({ comments: roots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/posts/:postId/comments
const addComment = async (req, res) => {
  try {
    const { body, parent_id } = req.body;
    if (!body) return res.status(400).json({ error: 'body is required' });

    const post = await pool.query('SELECT id FROM posts WHERE id = $1', [req.params.postId]);
    if (!post.rows.length) return res.status(404).json({ error: 'Post not found' });

    if (parent_id) {
      const parent = await pool.query('SELECT post_id FROM comments WHERE id = $1', [parent_id]);
      if (!parent.rows.length || parent.rows[0].post_id !== +req.params.postId) {
        return res.status(400).json({ error: 'Invalid parent comment' });
      }
    }

    const { rows } = await pool.query(
      `INSERT INTO comments (post_id, user_id, body, parent_id)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.postId, req.user.id, body, parent_id || null]
    );
    res.status(201).json({ comment: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/comments/:id
const updateComment = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body) return res.status(400).json({ error: 'body is required' });

    const existing = await pool.query('SELECT * FROM comments WHERE id = $1', [req.params.id]);
    if (!existing.rows.length) return res.status(404).json({ error: 'Comment not found' });
    if (existing.rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const { rows } = await pool.query(
      'UPDATE comments SET body = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [body, req.params.id]
    );
    res.json({ comment: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT user_id FROM comments WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Comment not found' });
    if (rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await pool.query('DELETE FROM comments WHERE id = $1', [req.params.id]);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getComments, addComment, updateComment, deleteComment };