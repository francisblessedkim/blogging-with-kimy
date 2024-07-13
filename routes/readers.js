const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Reader home page route
router.get('/', (req, res) => {
    global.db.get('SELECT blog_title, name FROM authors WHERE id = 1', (err, row) => {
        if (err) {
            console.error("Error fetching author settings:", err);
            return res.status(500).send('Database error');
        }

        const blogTitle = row.blog_title;
        const authorName = row.name;

        global.db.all('SELECT * FROM articles WHERE published_at IS NOT NULL ORDER BY published_at DESC', (err, articles) => {
            if (err) {
                console.error("Error fetching articles:", err);
                return res.status(500).send('Database error');
            }

            res.render('reader_home', {
                blogTitle: blogTitle,
                authorName: authorName,
                articles: articles
            });
        });
    });
});

// Reader article page route
router.get('/article/:id', (req, res) => {
    const articleId = req.params.id;
    global.db.get('SELECT * FROM articles WHERE id = ?', [articleId], (err, article) => {
        if (err) {
            console.error("Error fetching article:", err);
            return res.status(500).send('Database error');
        }

        if (!article) {
            console.error("Article not found:", articleId);
            return res.status(404).send('Article not found');
        }

        global.db.all('SELECT * FROM comments WHERE article_id = ? ORDER BY created_at DESC', [articleId], (err, comments) => {
            if (err) {
                console.error("Error fetching comments:", err);
                return res.status(500).send('Database error');
            }

            res.render('reader_article', { article: article, comments: comments });
        });
    });
});

// Handle article like
router.post('/article/:id/like', (req, res) => {
    const articleId = req.params.id;
    global.db.run('UPDATE articles SET likes = likes + 1 WHERE id = ?', [articleId], function(err) {
        if (err) {
            console.error("Error liking article:", err);
            return res.status(500).send('Database error');
        }
        res.redirect(`/reader/article/${articleId}`);
    });
});

// Handle new comment submission
router.post('/article/:id/comment', [
    body('commenter_name').notEmpty().withMessage('Name is required'),
    body('comment').notEmpty().withMessage('Comment is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const articleId = req.params.id;
    const { commenter_name, comment } = req.body;
    global.db.run('INSERT INTO comments (article_id, commenter_name, comment) VALUES (?, ?, ?)', [articleId, commenter_name, comment], function(err) {
        if (err) {
            console.error("Error adding comment:", err);
            return res.status(500).send('Database error');
        }
        res.redirect(`/reader/article/${articleId}`);
    });
});

module.exports = router;
