import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

// recommending user to add more friends-
export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, //excluding the current profile user--
                { _id: { $nin: currentUser.friends } }, //also removing already connected friends
                { isOnboarded: true }
            ],
        })
        res.status(200).json(recommendedUsers)
    } catch (error) {
        console.error("Error in getRecommended Controller", error.message);
    }
}

// showing all current friends of the user--
export async function getMyFriends(req, res) {
    try {
        const me = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage");
        if (!me) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(me.friends || []);
    } catch (error) {
        console.error("Error in getMyFriends Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// sending friend request to new users--
export async function sendFriendRequest(req, res) {

    // try establishing friend request--
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        // no request to user itself i.e.- current user.
        if (myId == recipientId) return res.status(400).json({ message: "You can't send friend request to yourself" });
        const recipient = await User.findById(recipientId);
        if (!recipient) return res.status(404).json({ message: "Recipient not found" });

        //if already in friend list--
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already connected with user." })
        }

        // if request already exists--
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ],
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A friend request already exists between you and user" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);
    }

    // if something goes wrong in establishing request--
    catch (error) {
        console.error("Error in FriendRequest Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// accept friendrequest of interested users-
export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        // verifying if current user is the recipient--
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // addding each other's friends array-
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        res.status(200).json({ message: "Friend request accepted" });

    } catch (error) {
        console.error("error in acceptFriendRequestController", error.messsage);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// all friend requests at one place--
export async function getFriendRequests(req, res) {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic");

        res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
        console.error("Error in getPendingFriendRequets contoller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// getting all sent requests--
export async function getOutgoingFriendReqs(req, res) {
    try {
        const outgoingRequets = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullName profilePic");

        res.status(200).json(outgoingRequets);
    } catch (error) {
        console.error("Error in getOutgoingReqs controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}