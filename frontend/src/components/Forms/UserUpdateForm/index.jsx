import PropTypes from "prop-types";
import { useState } from "react";
import FirstNameField from "../../FormFields/FirstNameField";
import LastNameField from "../../FormFields/LastNameField";
import EmailField from "../../FormFields/EmailField";
import { Box, Button } from "@mui/material";

const UserUpdateForm = ({
    userId,
    token,
    prevFirstName,
    prevLastName,
    prevEmail,
    setFirstName,
    setLastName,
    setEmail,
    setErrorMessage,
    showUserUpdateForm,
    setShowUserUpdateForm,
    setShowValidationMessage,
}) => {
    UserUpdateForm.propTypes = {
        token: PropTypes.string,
        userId: PropTypes.number,
        prevFirstName: PropTypes.string,
        prevLastName: PropTypes.string,
        prevEmail: PropTypes.string,
        setFirstName: PropTypes.func,
        setLastName: PropTypes.func,
        setEmail: PropTypes.func,
        setErrorMessage: PropTypes.func,
        showUserUpdateForm: PropTypes.bool,
        setShowUserUpdateForm: PropTypes.func,
        setShowValidationMessage: PropTypes.func,
    };

    const [newFirstName, setNewFirstName] = useState(prevFirstName);
    const [newLastName, setNewLastName] = useState(prevLastName);
    const [newEmail, setNewEmail] = useState(prevEmail);
    const [newFirstNameError, setNewFirstNameError] = useState("");
    const [newLastNameError, setNewLastNameError] = useState("");
    const [newEmailError, setNewEmailError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            newFirstName === prevFirstName &&
            newLastName === prevLastName &&
            newEmail === prevEmail
        ) {
            setShowUserUpdateForm(false);
        } else {
            const userData = {
                firstName: newFirstName,
                lastName: newLastName,
                email: newEmail,
            };
            fetch(`${process.env.REACT_APP_BACKEND_URI}/API/auth/${userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `BEARER ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })
                .then((response) => {
                    if (response.status < 400) {
                        setShowValidationMessage(true);
                        setShowUserUpdateForm(false);
                        return response.json();
                    } else {
                        setErrorMessage("Impossible de modifier les données.");
                    }
                })
                .then((data) => {
                    setFirstName(newFirstName);
                    setLastName(newLastName);
                    setEmail(newEmail);
                })
                .catch((error) => {
                    setErrorMessage("Impossible de modifier les données.");
                    setShowUserUpdateForm(false);
                    console.log("Impossible de modifier les données :", error);
                });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} mt={2} mb={6}>
            <FirstNameField
                firstName={newFirstName}
                setFirstName={setNewFirstName}
                firstNameError={newFirstNameError}
                setFirstNameError={setNewFirstNameError}
                setGlobalErrorMessage={setErrorMessage}
                hasAutoFocus={true}
            />
            <LastNameField
                lastName={newLastName}
                setLastName={setNewLastName}
                lastNameError={newLastNameError}
                setLastNameError={setNewLastNameError}
                setGlobalErrorMessage={setErrorMessage}
            />
            <EmailField
                email={newEmail}
                setEmail={setNewEmail}
                emailError={newEmailError}
                setEmailError={setNewEmailError}
                setGlobalErrorMessage={setErrorMessage}
                hasAutoFocus={false}
            />
            <Button type="submit" variant="contained">
                Valider
            </Button>
        </Box>
    );
};

export default UserUpdateForm;
