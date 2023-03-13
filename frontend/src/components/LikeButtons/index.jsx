import { useState, useEffect } from "react";

const LikeButtons = ({
    token,
    postId,
    likes,
    dislikes,
    currentUserLikeValue,
}) => {
    const [likesCount, setLikesCount] = useState(likes);
    const [dislikesCount, setDislikesCount] = useState(dislikes);
    const [likeStatus, setLikeStatus] = useState(currentUserLikeValue);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLike = (e) => {
        const clickValue = e.target.dataset.likevalue;

        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/posts/${postId}/like`, {
            method: "PUT",
            headers: {
                Authorization: `BEARER ${token}`,
                "Content-type": "application/json",
            },
            body: JSON.stringify({ clickValue: clickValue }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("data : ", data);
                setLikeStatus(data.newUserLikeValue);
                setLikesCount(data.newLikesCount);
                setDislikesCount(data.newDislikesCount);
            })
            .catch((error) => {
                console.log("Like / dislike impossible : ", error);
                setErrorMessage("Like / dislike impossible.");
            });
    };

    return (
        <>
            <button onClick={handleLike} data-likevalue={1}>
                Like ({likesCount}) {likeStatus === 1 && "👍"}
            </button>
            <button onClick={handleLike} data-likevalue={-1}>
                Dislike ({dislikesCount}) {likeStatus === -1 && "👎"}
            </button>
            {errorMessage && <p>{errorMessage}</p>}
        </>
    );
};

export default LikeButtons;
