import axios from "axios";
import express, { Request, Response } from "express";

const router = express.Router();
const BASE_URL = "http://localhost:2206";

export const instance = axios.create({
  baseURL: BASE_URL,
});

export const setToken = (token: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const clearToken = () => {
  delete instance.defaults.headers.common["Authorization"];
}

router.post("/register", async (req: Request, res:Response) => {
  const {name, email, password} = req.body;
  try {
    const {data} = await instance.post("auth/register", {name,email,password})
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
})

router.post("/login", async (req: Request, res: Response) => {
    const {email, password} = req.body
    try {
        const {data} = await instance.post("auth/login", {email,password})
        setToken(data.accessToken)
        return data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
    //  finally {
    //     clearToken();
    // }
})

router.get("/me", async (req: Request, res: Response) => {
    try {
        const {data} = await instance.get("/me/user")
        return data
    } catch (error) {
        console.log("GetUser error: ",error)
        throw error
    }
})

router.post("/logout", async (req: Request, res: Response) => {
    try {
        const {data} = await instance.post("/me/logout")
        clearToken()
        return data
    } catch (error) {
        console.log("Logout error: ", error)
        throw error
    }
})

export default router;