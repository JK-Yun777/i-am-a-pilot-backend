const axios = require("axios");
const User = require("../../models/User");

exports.createUserForKakao = async function (req, res, next) {
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
    const nickName = response.data.properties.nickname;
    let user;

    if (email) {
      user = await User.findOne({ userId: email });
    } else {
      user = await User.findOne({ userId: nickName });
    }

    if (user) {
      if (email) {
        return res.json({ result: "ok", data: email });
      } else {
        return res.json({ result: "ok", data: nickName });
      }
    }

    if (email) {
      await User.create({ userId: email });
      return res.json({ result: "ok", data: email });
    } else {
      await User.create({ userId: nickName });
      return res.json({ result: "ok", data: nickName });
    }
  } catch (err) {
    console.error("usercontroller createUserForKakao Error", err);
  }
};

exports.createUserForGoogle = async function (req, res, next) {
  const email = req.body.email;

  try {
    const user = await User.findOne({ userId: email });

    if (user) {
      return res.json({ result: "ok", data: email });
    } else {
      await User.create({ userId: email });
      return res.json({ result: "ok", data: email });
    }
  } catch (err) {
    console.error("usercontroller createUserForGoogle Error", err);
  }
};

exports.addDistance = async function (req, res, next) {
  const { userInfo, distance } = req.body;

  try {
    const response = await User.findOne({ userId: userInfo });

    if (response.distance >= distance) {
      return res.json({ result: "ok", data: response.distance });
    } else {
      response.distance = distance;
      await response.save();
      return res.json({ result: "ok", data: distance });
    }
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

    res.json({
      result: "ok",
      rankList,
    });
  } catch (err) {
    console.error("usercontroller getRanklist Error", err);
  }
};
