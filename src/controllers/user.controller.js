const userService = require("@/services/user.service");

const getAll = async (req, res) => {
    const users = await userService.getAll();
    res.success(users);
};

const getDetail = async (req, res) => {
    const user = await userService.getDetail(req.params.id);
    res.success(user);
};

const searchUsers = async (req, res) => {
    const query = req.query.q || "";
    const currentUserId = req.auth?.user?.id;
    const users = await userService.searchUsers(query, currentUserId);
    res.success(users);
};

module.exports = { getAll, getDetail, searchUsers };
