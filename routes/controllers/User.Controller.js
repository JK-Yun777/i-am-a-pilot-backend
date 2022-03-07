const axios = require("axios");
const User = require("../../models/User");

exports.createUser = async function (req, res, next) {
  const token = req.body.token;
  try {
    const url = "https://kapi.kakao.com/v2/user/me";
    const response = await axios({
      url,
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const email = response.data.kakao_account.email;
    const user = await User.findOne({ email });

    if (user) {
      return res.json({ result: "ok", data: email });
    } else {
      await User.create({ email });
      return res.json({ result: "ok", data: email });
    }
  } catch (err) {
    console.err("usercontroller createUser Error", err);
  }
};

exports.addDistance = async function (req, res, next) {
  const { email, distance } = req.body;
  const filter = { email: email };
  const update = { distance: distance };
  try {
    const response = await User.findOneAndUpdate(filter, update, {
      new: true,
    });

    console.log(response);
    return res.json({ result: "ok" });
  } catch (err) {
    console.error("usercontroller createUser Error", err);
  }
};

exports.getRankList = async (req, res, next) => {
  try {
    const LIMIT = 5;
    const rankList = await await User.find()
      .sort({ distance: -1 })
      .limit(LIMIT)
      .exec();

    console.log(rankList);
    res.json({
      result: "ok",
      rankList,
    });
  } catch (err) {
    console.error("usercontroller getRanklist Error", err);
  }
};
