import { deletePost, deleteImage, deleteUser } from "../../utils/requests";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import PropTypes from "prop-types";

const AlertDialog = ({
    issue,
    issueId,
    token,
    updateContent,
    imgUrl,
    setHasNewMessages,
    setShowUpdateForm,
    setErrorMessage,
    showAlert,
    setShowAlert,
    navigate,
}) => {
    AlertDialog.propTypes = {
        issue: PropTypes.string,
        issueId: PropTypes.number,
        token: PropTypes.string,
        updateContent: PropTypes.string,
        imgUrl: PropTypes.string,
        setHasNewMessages: PropTypes.func,
        setShowUpdateForm: PropTypes.func,
        showAlert: PropTypes.bool,
        setShowAlert: PropTypes.func,
        navigate: PropTypes.func,
    };

    let issueTitle, issueDescription;

    if (issue === "image") {
        issueTitle = "l'image";
        issueDescription = "La suppression de l'image est définitive.";
    } else if (issue === "message") {
        issueTitle = "le message";
        issueDescription = "La suppression du message est définitive.";
    } else if (issue === "user") {
        issueTitle = "le compte";
        issueDescription =
            "Le compte ainsi que tous les messages qui y sont attachés seront supprimés définitivement, sans possibilité de les récupérer.";
    }

    const handleNo = () => {
        setShowAlert(false);
    };

    const handleYes = () => {
        if (issue === "image") {
            console.log(imgUrl, issueId);
            deleteImage(
                updateContent,
                imgUrl,
                issueId,
                token,
                setShowUpdateForm,
                setHasNewMessages,
                setErrorMessage
            );
        } else if (issue === "message") {
            console.log(issueId);
            deletePost(
                token,
                issueId,
                imgUrl,
                setHasNewMessages,
                setErrorMessage
            );
        } else if (issue === "user") {
            deleteUser(token, issueId, setErrorMessage, navigate);
        }
        setShowAlert(false);
    };

    return (
        <Dialog
            open={showAlert}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Êtes vous sûr de vouloir supprimer {issueTitle} ?
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {issueDescription}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleNo} autoFocus>
                    Annuler
                </Button>
                <Button onClick={handleYes}>Supprimer {issueTitle}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;
