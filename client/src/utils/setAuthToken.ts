import axios from "axios";

export default function setAuthToken(token: string) {
  if (token) {
    // apply every request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}
