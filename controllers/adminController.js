const Post = require('../models/PostModel').Post;
const Category = require('../models/CategoryModel').Category;
const { isEmpty } = require('../config/customFunctions');
const Comment = require('../models/CommentModel').Comment;


module.exports = {
    index: (req, res) => {
        res.render('admin/index')
    },


    /** All Post Methods */
    getPosts: async (req, res) => {
        const posts = await Post
            .find({})
            .populate('category')
            .lean();
        res.render('admin/posts/index', {posts: posts});
    },

    submitPosts: (req, res) => {

        const commentsAllowed = req.body.allowComments ? true : false;

        // Check for any input file
        let fileName = '';

        if(!isEmpty(req.files)) {
            let file = req.files.uploadFile;
            fileName = file.name;
            let uploadDir = './public/uploads/';
            file.mv(uploadDir+fileName, (error) => {
                if(error)
                    throw error;
            })
        }

        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            allowComments: commentsAllowed,
            category: req.body.category,
            file: `/uploads/${fileName}`
        });

        newPost.save().then(post => {
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/admin/posts');
        })
    },

    createPosts: (req, res) => {
        Category.find().lean().then(cats => {

            res.render('admin/posts/create', {categories: cats});
        })
    },

    editPost: (req, res) => {
        const id = req.params.id;

        Post.findByIdAndUpdate(id)
        .lean()
        .then(post => {
            Category
                .find()
                .lean()
                .then(cats => {
                    res.render('admin/posts/edit', {post: post, categories: cats});
                })
        })

    },

    editPostSubmit: async (req, res) => {
        const id = req.params.id;
        let post = await Post.findByIdAndUpdate(id, {

                title: req.body.title,
                status: req.body.status,
                allowComments: req.body.allowComments ? true : false,
                description: req.body.description,
                category: req.body.category
                
            },  
            {
                new: true
            }
        );
            
        post.save().then(updatePost => {
            req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
            res.redirect('/admin/posts');

        });

    },



    deletePost: (req, res) => {
        const id = req.params.id;
        Post.findByIdAndRemove(id).lean().then(deletedPost => {
            req.flash('success-message', `The post "${deletedPost.title}" has been deleted.`);
            res.redirect('/admin/posts');
        });
    },


    /** All Category Methods */
    getCategories: (req, res) => {
        Category.find().lean().then( cats => {
            res.render('admin/categories/index', {categories: cats});
        })
    },

    createCategories: (req, res) => {
        var categoryName = req.body.name;

        if (categoryName) {
            const newCategory = new Category({
                title: categoryName
            });

            newCategory.save().then(category => {
                res.status(200).json(category);
            });
        }

    },

    editCategoriesGetRoute: async (req, res) => {
        const catId = req.params.id;

        const cats = await Category.find().lean();

        Category.findById(catId).lean().then( cat => {

            res.render('admin/categories/edit', {category: cat, categories: cats});

        })
    },

    editCategoriesPostRoute: (req, res) => {
        const catId = req.params.id;
        const newTitle = req.body.name;

        if (newTitle) {
            Category.findById(catId).then(category => {

                category.title = newTitle;

                category.save().then(updated => {
                    res.status(200).json({url: '/admin/categories'});
                });

            });
        }
    },

    getComments: (req, res) => {
        Comment.find()
            .lean()
            .populate('user')
            .then(comments => {
            res.render('admin/comments/index', {comments: comments})
        })
    }
}