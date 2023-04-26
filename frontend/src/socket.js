import { io } from "socket.io-client";

const URL =
    process.env.NODE_ENV === "production" ? undefined : "http://localhost:4200";

export default io(URL);
