import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ProfileData from "../../components/ProfileData";
import UserUpdateForm from "../../components/Forms/UserUpdateForm";
import AlertDialog from "../../components/AlertDialog";
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";

import { profileUpdate } from "../../services/features/profile";
import { pageUpdateLocation } from "../../services/features/page";

import {
    selectUserId,
    selectUserFirstName,
    selectUserLastName,
    selectUserEmail,
    selectProfileFirstName,
    selectProfileLastName,
} from "../../services/utils/selectors";

import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { theme } from "../../assets/styles/theme";

const Profile = () => {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const postAuthorId = parseInt(useParams().userId);

    const loggedUserId = useSelector(selectUserId());
    const userFirstName = useSelector(selectUserFirstName());
    const userLastName = useSelector(selectUserLastName());
    const userEmail = useSelector(selectUserEmail());

    const userIsAuthor = postAuthorId === loggedUserId;

    const profileFirstName = useSelector(selectProfileFirstName());
    const profileLastName = useSelector(selectProfileLastName());

    const [showUserUpdateForm, setShowUserUpdateForm] = useState(false);
    const [showValidationMessage, setShowValidationMessage] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const userId = userIsAuthor ? loggedUserId : postAuthorId;

    useEffect(() => {
        dispatch(pageUpdateLocation("profile"));
    }, [dispatch]);

    const handleUpdate = () => {
        setShowUserUpdateForm((showUserUpdateForm) => !showUserUpdateForm);
        setShowValidationMessage(false);
    };

    const handleDelete = () => {
        setShowAlert(true);
    };

    useEffect(() => {
        setErrorMessage("");
    }, [showUserUpdateForm]);

    useEffect(() => {
        setLoading(true);
        fetch(`${process.env.REACT_APP_BACKEND_URI}/API/auth/${userId}`, {
            method: "GET",
            headers: {
                Authorization: `BEARER ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 401 || response.status === 404) {
                    navigate("/");
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                userIsAuthor
                    ? dispatch(
                          profileUpdate({
                              firstName: userFirstName,
                              lastName: userLastName,
                              email: userEmail,
                          })
                      )
                    : dispatch(
                          profileUpdate({
                              firstName: data.firstName,
                              lastName: data.lastName,
                              email: data.email,
                          })
                      );
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(setLoading(false));
    }, [
        token,
        userId,
        userIsAuthor,
        userFirstName,
        userLastName,
        userEmail,
        navigate,
        dispatch,
    ]);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <Box
                    component="main"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                    maxWidth={theme.maxWidth.desktop}
                    mb={4}
                    ml="auto"
                    mr="auto"
                >
                    <Typography
                        component="h1"
                        variant="h4"
                        textAlign="center"
                        mt={4}
                        mb={4}
                    >
                        {profileFirstName + " " + profileLastName}
                    </Typography>
                    <Container sx={{ padding: 0, maxWidth: "500px" }}>
                        {showValidationMessage && (
                            <Typography
                                color={theme.palette.validation.main}
                                mb={2}
                            >
                                Les informations ont été mises à jour.
                            </Typography>
                        )}
                        <ProfileData />
                    </Container>
                    {userIsAuthor && (
                        <Stack
                            direction="row"
                            spacing={2}
                            sx={{ mt: 4, pl: 2, pr: 2 }}
                        >
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handleUpdate}
                            >
                                Modifier les informations
                            </Button>
                            <Button
                                variant="text"
                                size="small"
                                sx={{ textTransform: "initial" }}
                                onClick={handleDelete}
                            >
                                Supprimer le compte
                            </Button>
                        </Stack>
                    )}
                    {showUserUpdateForm && (
                        <UserUpdateForm
                            setErrorMessage={setErrorMessage}
                            setShowUserUpdateForm={setShowUserUpdateForm}
                            setShowValidationMessage={setShowValidationMessage}
                        />
                    )}
                    {showAlert && (
                        <AlertDialog
                            issue="user"
                            issueId={parseInt(userId)}
                            setErrorMessage={setErrorMessage}
                            showAlert={showAlert}
                            setShowAlert={setShowAlert}
                        />
                    )}
                    {errorMessage && (
                        <ErrorMessage errorMessage={errorMessage} />
                    )}
                </Box>
            )}
        </>
    );
};

export default Profile;
