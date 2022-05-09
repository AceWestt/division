////FACEBOOK PIXEL SIDE
const bizSdk = require("facebook-nodejs-business-sdk");
const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const CustomData = bizSdk.CustomData;
const Content = bizSdk.Content;

const access_token =
  "EAAsGTYlTLmABADRSMZANZA4w19B27ZBeZAYgr5fldKAnelCyZCVgxCuOKrjmT7a2L7U6h316gZBZBqEDZCv28PKQv1RXXJ7n1nVqV785zox79tCBIovl7qXz7ggJZCc8KcXf2YIZCe4RdgTqt8PbCxYZA7jkxG0WIz34eYtq3GD61N4bd6bdhDraY4EJA8WG0ahjBoZD";
const pixel_id = "492637309212319";
const api = bizSdk.FacebookAdsApi.init(access_token);

const Message = require("../models/Message");

exports.getall = async (req, res, next) => {
  try {
    const messages = await Message.find({});
    res.status(200).json({ data: messages });
  } catch (error) {
    next(error);
  }
};

exports.add = async (req, res, next) => {
  try {
    const body = req.body;
    const message = await new Message({
      name: body.name,
      phone: body.phone,
      message: body.message,
      email: body.email,
    });
    await message.save();
    let current_timestamp = Math.floor(new Date() / 1000);

    const userData_0 = new UserData()
      .setEmails([
        "7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068",
      ])
      .setPhones([]);
    const serverEvent_0 = new ServerEvent()
      .setEventName("Purchase")
      .setEventTime(current_timestamp)
      .setUserData(userData_0)
      .setActionSource("email");

    const eventsData = [serverEvent_0];
    const eventRequest = new EventRequest(access_token, pixel_id).setEvents(
      eventsData
    );
    eventRequest.execute();
    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Message.deleteOne({ _id: id });
    res.status(200).json({ status: "success" });
  } catch (error) {
    next(error);
  }
};
