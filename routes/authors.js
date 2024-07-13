const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Author home page route
router.get('/', ensureAuthenticated, (req, res) => {
    global.db.get('SELECT blog_title, name FROM authors WHERE id = 1', (err, row) => {
        if (err) {
            console.error("Error fetching author data:", err);
            return res.status(500).send('Database error');
        }

        if (!row) {
            console.error("Author data not found");
            return res.status(404).send('Author data not found');
        }

        const blogTitle = row.blog_title;
        const authorName = row.name;

        global.db.all('SELECT * FROM articles WHERE author_id = ? AND published_at IS NOT NULL', [req.user.id], (err, publishedArticles) => {
            if (err) {
                console.error("Error fetching published articles:", err);
                return res.status(500).send('Database error');
            }

            global.db.all('SELECT * FROM articles WHERE author_id = ? AND published_at IS NULL', [req.user.id], (err, draftArticles) => {
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
router.get('/settings', ensureAuthenticated, (req, res) => {
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
router.post('/settings', ensureAuthenticated, (req, res) => {
    const { blog_title, author_name } = req.body;
    global.db.run('UPDATE authors SET blog_title = ?, name = ? WHERE id = 1', [blog_title, author_name], function(err) {
        if (err) {
            console.error("Error updating author settings:", err);
            return res.status(500).send('Database error');
        }
        req.flash('success_msg', 'Settings updated successfully');
        res.redirect('/author');
    });
});

// Edit article page route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
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
router.post('/edit/:id', ensureAuthenticated, (req, res) => {
    const articleId = req.params.id;
    const { title, content } = req.body;
    global.db.run('UPDATE articles SET title = ?, content = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ?', [title, content, articleId], function(err) {
        if (err) {
            console.error("Error updating article:", err);
            return res.status(500).send('Database error');
        }
        req.flash('success_msg', 'Article updated successfully');
        res.redirect('/author');
    });
});

// Create new draft article route
router.get('/new', ensureAuthenticated, (req, res) => {
    const newArticle = {
        author_id: req.user.id,
        title: 'Untitled',
        content: '',
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString()
    };
    global.db.run('INSERT INTO articles (author_id, title, content, created_at, last_modified) VALUES (?, ?, ?, ?, ?)', [newArticle.author_id, newArticle.title, newArticle.content, newArticle.created_at, newArticle.last_modified], function(err) {
        if (err) {
            console.error("Error creating new draft article:", err);
            return res.status(500).send('Database error');
        }
        const articleId = this.lastID;
        res.redirect(`/author/edit/${articleId}`);
    });
});

// Handle publish article
router.post('/publish/:id', ensureAuthenticated, (req, res) => {
    const articleId = req.params.id;
    global.db.run('UPDATE articles SET published_at = CURRENT_TIMESTAMP WHERE id = ?', [articleId], function(err) {
        if (err) {
            console.error("Error publishing article:", err);
            return res.status(500).send('Database error');
        }
        req.flash('success_msg', 'Article published successfully');
        res.redirect('/author');
    });
});

// Handle delete article
router.post('/delete/:id', ensureAuthenticated, (req, res) => {
    const articleId = req.params.id;
    global.db.run('DELETE FROM articles WHERE id = ?', [articleId], function(err) {
        if (err) {
            console.error("Error deleting article:", err);
            return res.status(500).send('Database error');
        }
        req.flash('success_msg', 'Article deleted successfully');
        res.redirect('/author');
    });
});

module.exports = router;
