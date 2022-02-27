const {Users, Thoughts} = require('../models');

const usersController = {   
    // New User
    createUsers({body}, res) {
        Users.create(body)
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => res.status(400).json(err));
    },

    // Get All Users
    getAllUsers(req, res) {
        Users.find({})
        // populate users thoughts
        .populate({path: 'thoughts', select: '-__v'})
        // populate user friends
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    // Get single user by ID
    getUsersById({params}, res) {
        Users.findOne({_id: params.id })
        .populate({path: 'thoughts', select: '-__v'})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        // return if no user is found 
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'Sorry, no User with that ID.'});
                return; 
            }
            res.json(dbUsersData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },

    // Update a current User by ID
    updateUsers({params, body}, res) {
        Users.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'Sorry, no User with that ID.'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err))
    },

    deleteUsers({ params }, res) {
		Users.findOneAndDelete({ _id: params.id })
			.then((deletedUser) => {
				if (!deletedUser) {
					res.status(404).json({ message: "No user found with this ID!" });
					return;
				}
				Users.updateMany(
					{ _id: { $in: deletedUser.friends } },
					{ $pull: { friends: params.id } }
				)
					.then(() => {
						Thoughts.deleteMany({ username: deletedUser.username })
							.then(() => {
								res.json({ message: "User deleted" });
							})
							.catch((err) => res.status(400).json(err));
					})
					.catch((err) => res.status(400).json(err));
			})
			.catch((err) => res.status(400).json(err));
	},
    
    // ({params}, res) {
    //     Users.findOneAndDelete({_id: params.id})
    //     .then(dbUsersData => {
    //         if(!dbUsersData) {
    //             res.status(404).json({message: 'Sorry, no User with that ID.'});
    //             return;
    //         }
    //         Users.updateMany(
    //             { _id: { $in: deletedUser.friends } },
    //             { $pull: { friends: params.id } }
    //         )
    //         .then(() => {
    //             Thought.deleteMany({ username: deletedUser.username })
    //                 .then(() => {
    //                     res.json({ message: "User deleted" });
    //                 })
    //                 .catch((err) => res.status(400).json(err));
    //         })
    //         .catch((err) => res.status(400).json(err));
    //     })
    //     .catch(err => res.status(400).json(err));
    // },

    // Delete a current user by ID
    addFriend({params}, res) {
        Users.findOneAndUpdate({_id: params.id}, {$push: { friends: params.friendId}}, {new: true})
        .populate({path: 'friends', select: ('-__v')})
        .select('-__v')
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({message: 'Sorry, no User with that ID.'});
                return;
            }
        res.json(dbUsersData);
        })
        .catch(err => res.json(err));
    },

    // Delete a current Friend
    deleteFriend({ params }, res) {
        Users.findOneAndUpdate({_id: params.id}, {$pull: { friends: params.friendId}}, {new: true})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'Sorry, no User with that ID.'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.status(400).json(err));
    }

};

module.exports = usersController; 