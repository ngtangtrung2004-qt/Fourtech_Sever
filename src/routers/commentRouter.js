const express = require('express');
const { checkUserJWT, checkUserPermission } = require('../middleware/jwtAction');
const CommentController = require('../controllers/commentController');

const router = express.Router();

router.get('/comments/:product_id',CommentController.getComment);
router.get('/comments',CommentController.getAllComment);
router.post('/comments/:product_id',checkUserJWT,CommentController.postComment);
router.delete('/comment/:id',CommentController.deleteComment);

module.exports = router;
