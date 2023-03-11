const connectToDb = require("../database/db-connect-mysql");
const fs = require("fs");

const close = (connection) => {
    connection.end();
    console.log("========= Déconnexion de la base de données. =============");
};

/**
 * @param {Response} res
 * @param {String} message 
 * @param {Number} status 
 * @param {Error} error
 */

const handleError = (res, message, status, error) => {
    console.log(message, error);
    res.status(status).json({message: message});
}

exports.getAllComments = (req, res, next) => {
    const userId = req.auth.userId;
    const postId = req.params.postId;

    connectToDb("getAllComments")
    .then(connection => {
        connection.execute(`
        SELECT id, comment_user_id, parent_post_id, email, content, img_url, created_at, likes_count, dislikes_count, current_user_like_value
        FROM 
            (SELECT 
                comments.id, 
                comments.user_id AS comment_user_id, 
                comments.post_id AS parent_post_id,
                users.email,
                comments.content, 
                comments.img_url, 
                comments.created_at, 
                users.id AS user_id
            FROM comments
            JOIN users
            ON comments.user_id = users.id
            WHERE comments.post_id = ?) 
            AS comments_users
            LEFT JOIN 
                (SELECT COUNT(*) AS likes_count, post_id
                FROM likes
                WHERE like_value = 1
                GROUP BY post_id) 
                AS likes_table
            ON comments_users.id = likes_table.post_id
            LEFT JOIN 
                (SELECT COUNT(*) AS dislikes_count, post_id
                FROM likes
                WHERE like_value = -1
                GROUP BY post_id)
                AS dislikes_table
            ON comments_users.id = dislikes_table.post_id
            LEFT JOIN
            	(SELECT post_id, like_value AS current_user_like_value 
            	FROM likes
            	WHERE user_id = ?) AS user_likes_table
            ON comments_users.id = user_likes_table.post_id
        ORDER BY created_at DESC
            `, [postId, userId])
        .then(([rows]) => {

            const results = [];
            
            for(let i = 0 ; i < rows.length ; i++) {
                results[i] =
                    {
                        id: rows[i].id,
                        commentUserId: rows[i].comment_user_id,
                        email: rows[i].email,
                        content: rows[i].content,
                        imgUrl: rows[i].img_url,
                        date: rows[i].created_at,
                        likesCount: rows[i].likes_count,
                        dislikesCount: rows[i].dislikes_count,
                        currentUserLikeValue: rows[i].current_user_like_value
                    };
            };
            close(connection);
            return {
                comments: results, 
                admin: req.auth.admin === 1, 
                loggedUserId: req.auth.userId
            };
        })
        .then((response) => {
            res.status(200).json(response);
        })
        .catch(error => {
            close(connection);
            handleError(res, "Impossible de récupérer les commentaires.", 400, error);
        } )
    })
    .catch(error => {
        handleError(res, "Impossible de se connecter à la base de données.", 500, error);
    })
};

exports.getOneComment = (req, res, next) => {

};

exports.createComment = (req, res, next) => {
    const userId = req.auth.userId;
    const postId = req.params.postId;
    const content = req.body.content;
    const createdAt = Date.now();
    connectToDb("createComment")
    .then(connection => {
        if(!req.file && !req.body.content) {
            handleError(res, "Le message ne peut pas être vide.", 400);
        }
        const imgUrl = 
            req.file ? 
            `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : 
            "";
        connection.execute(
            `
            INSERT INTO comments (user_id, post_id, content, img_url, created_at)
            VALUES (?, ?, ?, ?, ?)
            `,
            [userId, postId, content, imgUrl, createdAt]
        )
        .then(() => {
            close(connection);
            console.log("Commentaire ajouté à la base de données.");
            res.status(201).json();
            
        })
        .catch(error => {
            close(connection);
            handleError(res, "Impossible de publier le commentaire.", 400, error);
        }) 
    })
    .catch(error => {
        handleError(res, "Impossible de se connecter à la base de données.", 500, error);
    })
};

exports.updateComment = (req, res, next) => {

}

exports.deleteComment = (req, res, next) => {

}

exports.getCommentLikes = (req, res, next) => {

}

exports.likeComment = (req, res, next) => {

}

exports.getCommentUserLike = (req, res, next) => {

}