import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getRecommendedUsers,
    getMyFriends,
    acceptFriendRequest,
    sendFriendRequest,
    getFriendRequests,
    getOutgoingFriendReqs
} from "../controllers/user.controllers.js";

const router = express.Router();

// to make sure all the access is secured...
router.use(protectRoute);

router.get("/",getRecommendedUsers);
router.get("/friends",getMyFriends);

router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);

router.get("/friend-requests",getFriendRequests);
router.get("/outgoing-friend-requests",getOutgoingFriendReqs);


export default router;