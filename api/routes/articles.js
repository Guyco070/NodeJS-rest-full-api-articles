const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')

const {getAllArticles, 
    createArticle, 
    updateArticle, 
    deleteArticle,
    getArticle
} = require('../controllers/articles')

router.get('/', getAllArticles)
router.post('/', upload.single('image') , createArticle)
router.get('/:articleId', getArticle)
router.patch('/:articleId', updateArticle)
router.delete('/:articleId', deleteArticle)

module.exports = router