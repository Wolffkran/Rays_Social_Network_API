const { User, Thought } = require('../models');

const userController = {
  // Get all users from the database
  async getUsers(req, res) {
    try {
      const dbUserData = await User.find().select('-__v');
      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Get a single user by their ID
  async getSingleUser(req, res) {
    try {
      const dbUserData = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');

      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      console.error(err);

      // Check if it's a validation error
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => error.message);
        return res.status(400).json({ error: 'Validation Error', messages: errors });
      }

      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Update a user's information
  async updateUser(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Delete a user and their associated thoughts
  async deleteUser(req, res) {
    try {
      const dbUserData = await User.findOneAndDelete({ _id: req.params.userId });

      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      res.json({ message: 'User and associated thoughts deleted!' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Add a friend to a user's friend list
  async addFriend(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Remove a friend from a user's friend list
  async removeFriend(req, res) {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      res.json(dbUserData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = userController;
