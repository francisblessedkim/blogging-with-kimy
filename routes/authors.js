const express = require('express');
const router = express.Router();

// Author home page route
router.get('/', (req, res) => {
    global.db.get('SELECT blog_title, name FROM authors WHERE id = 1', (err, row) => {
        if (err) {
            console.error("Error fetching author data:", err);
            return res.status(500).send('Database error');
        }

        const blogTitle = row.blog_title;
        const authorName = row.name;

        global.db.all('SELECT * FROM articles WHERE author_id = 1 AND published_at IS NOT NULL', (err, publishedArticles) => {
            if (err) {
                console.error("Error fetching published articles:", err);
                return res.status(500).send('Database error');
            }

            global.db.all('SELECT * FROM articles WHERE author_id = 1 AND published_at IS NULL', (err, draftArticles) => {
                if (err) {
                    console.error("Error fetching draft articles:", err);
                    return res.status(500).send('Database error');
                }

                res.render('author_home', {
                    blogTitle: blogTitle,
                    authorName: authorName,
                    publishedArticles: publishedArticles,
                    draftArticles: draftArticles
                });
            });
        });
    });
});

// Author settings page route
router.get('/settings', (req, res) => {
    global.db.get('SELECT blog_title, name FROM authors WHERE id = 1', (err, row) => {
        if (err) {
            console.error("Error fetching author settings:", err);
            return res.status(500).send('Database error');
        }

        res.render('author_settings', {
            blogTitle: row.blog_title,
            authorName: row.name
        });
    });
});

// Handle settings form submission
router.post('/settings', (req, res) => {
    const { blog_title, author_name } = req.body;
    global.db.run('UPDATE authors SET blog_title = ?, name = ? WHERE id = 1', [blog_title, author_name], function(err) {
        if (err) {
            console.error("Error updating author settings:", err);
            return res.status(500).send('Database error');
        }
        res.redirect('/author');
    });
});

// Edit article page route
router.get('/edit/:id', (req, res) => {
    const articleId = req.params.id;
    global.db.get('SELECT * FROM articles WHERE id = ?', [articleId], (err, article) => {
        if (err) {
            console.error("Error fetching article:", err);
            return res.status(500).send('Database error');
        }

        res.render('author_edit_article', { article: article });
    });
});

// Handle edit article form submission
router.post('/edit/:id', (req, res) => {
    const articleId = req.params.id;
    const { title, content } = req.body;
    global.db.run('UPDATE articles SET title = ?, content = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?', [title, content, articleId], function(err) {
        if (err) {
            console.error("Error updating article:", err);
            return res.status(500).send('Database error');
        }
        res.redirect('/author');
    });
});

module.exports = router;
