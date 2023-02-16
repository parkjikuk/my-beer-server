import { Router } from "express";
import { getLikedBeer, addToLikedBeers, removeFromLikedBeers } from "../controllers/UserController";

const router = Router();

router.get('/liked/:email', getLikedBeer);

router.post('/add', addToLikedBeers);

router.put('/remove', removeFromLikedBeers);

export default router;