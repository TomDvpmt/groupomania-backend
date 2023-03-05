import React, { useState } from "react";
import { Link } from "react-router-dom";
import { fetchCredentials } from "../../utils/user";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const [userAlreadyExists, setUserAlreadyExists] = useState(false);

    const handleChange = (e) => {
        if (e.target.name === "email") {
            setEmail(e.target.value);
        }
        if (e.target.name === "password") {
            setPassword(e.target.value);
        }
        if (e.target.name === "passwordConfirm") {
            setPasswordConfirm(e.target.value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === passwordConfirm) {
            setIsPasswordMatch(true);

            const signUpData = {
                email: email,
                password: password,
            };

            fetchCredentials("signup", signUpData)
                .then((response) => {
                    console.log("========= response : =======", response);
                    setUserAlreadyExists(
                        response.status === 201 ? false : true
                    );
                })
                .catch((error) => console.log(error));
        } else {
            setIsPasswordMatch(false);
        }
    };

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Entrez votre adresse e-mail"
                    value={email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="passwordConfirm"
                    placeholder="Confirmez votre mot de passe"
                    value={passwordConfirm}
                    onChange={handleChange}
                    required
                />
                <button>Sign up</button>
                {!isPasswordMatch && (
                    <p className="credentials-error">
                        Les mots de passe ne correspondent pas.
                    </p>
                )}
                {userAlreadyExists && (
                    <p className="credentials-error">
                        Cet email est déjà utilisé, veuillez en choisir un
                        autre.
                    </p>
                )}
            </form>
            <Link to="/login">Déjà un compte ? S'identifier</Link>
        </React.Fragment>
    );
};

export default SignUp;
