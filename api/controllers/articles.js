const { default: mongoose } = require('mongoose')
const Article = require('../models/article')
const Category = require('../models/category')

module.exports = {
    getAllArticles: (req,res) => {
        Article.find().populate('categoryId',"title").then((articles) => {
            res.status(200).json({
                articles
            })
        }).catch((error) => {
            res.status(500).json({
                error
            })
        })
    },
    getArticle: (req,res) => {
        const articleId = req.params.articleId
        Article.populate('categoryId').findById(articleId).then((article) => {
            res.status(200).json({
                article
            })
        }).catch((error) => {
            res.status(500).json({
                error
            })
        }) 
    },
    createArticle: (req,res) => {
        const { path: image} = req.file

        const { title, description, content ,categoryId,} = req.body

        console.log(description)
        Category.findById(categoryId).then((category) => {
            if(!category)
                return res.status(404).json({
                    message: 'Category not found'
                })
            const article = new Article({
                _id: new mongoose.Types.ObjectId(),
                title,
                description,
                content,
                categoryId,
                image: image.replace('\\','/')
            })

            return article.save()
        }).then(() => {
            res.status(200).json({
                message: 'Article created'
            })
        }).catch((error) => {
            res.status(500).json({
                error
            })
        })
    },

    updateArticle: (req,res) => {
        const articleId = req.params.articleId
        
        const { categoryId } = req.body
        Article.findById(articleId).then((article) =>{
            if(!article)
                return res.status(404).json({
                    message: 'Article not found'
                })
            if(categoryId)
            {
                Category.findById(categoryId).then((category) => {
                    if(!category)
                        return res.status(404).json({
                            message: 'Category not found'
                        })
                    })
            }
            return  Article.updateOne({_id: articleId}, req.body).then(() => {
                res.status(200).json({
                    message: `Article updated - ${articleId}`
                })
                }).catch((error) => {
                    res.status(500).json({
                        error
                    })
                })
            })

    },
    deleteArticle: (req,res) => {
        const articleId = req.params.articleId
        
        Article.findById(articleId).then((article) =>{
            if(!article)
                return res.status(404).json({
                    message: 'Article not found'
                })
        }).then(() => {
            Article.deleteOne({_id: articleId}).then(() => {
                res.status(200).json({
                    message: `Article deleted  - ${articleId}`
                })
            }).catch((error) => {
                res.status(500).json({
                    error
                })
            })
        })
    }
}