import User from '../models/user.model.js';

export async function signUp(req, res) {
  try {
    const user = await User.create(req.body);
    if (!user.toJSON()) {
      throw Error('signup failed.');
    }
    res.json({ data: user.toJSON() });
  } catch (error) {
    res.json({ message: error.message });
  }
}

export async function getAllUser(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email'],
      raw: true,
    });
    // console.log('users', users);

    if (users.length === 0) {
      throw Error('not found.');
    }
    res.json({ data: users });
  } catch (error) {
    res.json({ message: error.message });
  }
}

export async function updateUser(req, res) {
  try {
    const users = await User.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    // console.log('users', users);

    if (users[1] === 0) {
      throw Error('not found.');
    }
    res.json({ data: 'user updated.' });
  } catch (error) {
    res.json({ message: error.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const users = await User.destroy({
      where: { id: req.params.id },
    });
    console.log('users', users);

    if (users[1] === 0) {
      throw Error('not found.');
    }
    res.json({ data: 'user deleted.' });
  } catch (error) {
    res.json({ message: error.message });
  }
}
