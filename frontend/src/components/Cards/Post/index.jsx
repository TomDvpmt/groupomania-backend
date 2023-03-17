import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Comments from "../../Comments";
import UpdateMessageForm from "../../Forms/UpdateMessageForm";
import LikeButtons from "../../Buttons/LikeButtons";
import UpdateDeleteButtons from "../../Buttons/UpdateDeleteButtons";
import ErrorMessage from "../../ErrorMessage";
import { formatDate } from "../../../utils/utils";
import {
    Box,
    Card,
    CardHeader,
    CardActions,
    CardContent,
    CardMedia,
    Button,
    Typography,
    IconButton,
    Link,
} from "@mui/material";
import { MailOutline } from "@mui/icons-material";
import PropTypes from "prop-types";

const Post = ({ postData, userData, setHasNewPosts }) => {
    Post.propTypes = {
        postData: PropTypes.object,
        userData: PropTypes.object,
        setHasNewPosts: PropTypes.func,
    };

    const token = userData.token;
    const canModify =
        userData.admin || postData.authorId === userData.loggedUserId;
    const postId = postData.id;
    const authorName = `${postData.authorFirstName} ${postData.authorLastName}`;
    const formatedDate = formatDate(postData.date);
    const [postContent, setPostContent] = useState(postData.content);

    const [showCommentForm, setShowCommentForm] = useState(false);
    const [showPostUpdateForm, setShowPostUpdateForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleReply = () => {
        setShowCommentForm((showCommentForm) => !showCommentForm);
    };

    return (
        <Card component="article" sx={{ mb: 3, padding: { sm: 2 } }}>
            <CardHeader
                component="header"
                title={
                    postData.authorIsAdmin ? (
                        <Typography color="primary" fontWeight="700">
                            ADMIN
                        </Typography>
                    ) : (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            {authorName !== " " ? (
                                <Link
                                    component={RouterLink}
                                    to={`/users/${postData.authorId}`}
                                    underline="none"
                                >
                                    {authorName}
                                </Link>
                            ) : (
                                <Typography>(anonyme)</Typography>
                            )}
                            <IconButton
                                color="primary"
                                sx={{ padding: 0 }}
                                href={`mailto:${postData.authorEmail}`}
                            >
                                <MailOutline fontSize="small" />
                            </IconButton>
                        </Box>
                    )
                }
                titleTypographyProps={{
                    component: "h2",
                    variant: "h6",
                    fontWeight: "bold",
                    fontSize: "1rem",
                }}
                subheader={`${formatedDate}${
                    postData.modified === 1 ? " (modifié)" : ""
                }`}
                subheaderTypographyProps={{
                    fontSize: ".8rem",
                }}
                sx={{
                    padding: 1,
                    flexDirection: "column",
                    alignItems: "flex-start",
                }}
            />
            <CardContent>
                <Typography paragraph>{postContent}</Typography>
            </CardContent>
            {postData.imgUrl && (
                <CardMedia
                    image={postData.imgUrl}
                    component="img"
                    alt="Illustration du message"
                />
            )}
            {canModify && (
                <LikeButtons
                    token={token}
                    postId={postId}
                    likes={postData.likes}
                    dislikes={postData.dislikes}
                    currentUserLikeValue={userData.currentUserLikeValue}
                />
            )}
            <CardActions>
                <Box
                    flexGrow="1"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={1}
                >
                    {canModify && (
                        <UpdateDeleteButtons
                            token={token}
                            messageId={postId}
                            imgUrl={postData.imgUrl}
                            setHasNewMessages={setHasNewPosts}
                            setErrorMessage={setErrorMessage}
                            setShowMessageUpdateForm={setShowPostUpdateForm}
                        />
                    )}
                    {!canModify && (
                        <LikeButtons
                            token={token}
                            postId={postId}
                            likes={postData.likes}
                            dislikes={postData.dislikes}
                            currentUserLikeValue={userData.currentUserLikeValue}
                        />
                    )}
                    <Button
                        variant="contained"
                        onClick={handleReply}
                        size="small"
                        sx={{ fontWeight: "700" }}
                    >
                        Répondre
                    </Button>
                </Box>
            </CardActions>
            {showPostUpdateForm && (
                <UpdateMessageForm
                    token={token}
                    postId={postId}
                    parentId={0}
                    prevContent={postContent}
                    setMessageContent={setPostContent}
                    imgUrl={postData.imgUrl}
                    setShowUpdateForm={setShowPostUpdateForm}
                    setHasNewMessages={setHasNewPosts}
                />
            )}
            {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
            <Comments
                token={token}
                parentId={postId}
                showCommentForm={showCommentForm}
                setShowCommentForm={setShowCommentForm}
            />
        </Card>
    );
};

export default Post;
