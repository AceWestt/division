//FACEBOOK
const bizSdk = require("facebook-nodejs-business-sdk");
const ServerEvent = bizSdk.ServerEvent;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const CustomData = bizSdk.CustomData;
const Content = bizSdk.Content;

const access_token =
  "EAAsGTYlTLmABAL5rih5G2ZCyWHAchpLh0jlFDZApOR3oM0n9LxhdHPor1MH69YN1IZBZBVZBlvFvAJhLrxEx0jUJoMJaAEgE3Jk1lK077c59ZCwW32tLQLbudRZA1VqdkkztrRe8iDaZBlfhiFFjA0Ru5PhnOMvGI5cOz9avuhFMZCBgTSZB5zNh9RsFqcAZByzpEYZD";
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
      .setEmails([body.email])
      .setPhones([body.phone]);
    const serverEvent_0 = new ServerEvent()
      .setEventName("Call")
      .setEventTime(current_timestamp)
      .setUserData(userData_0)
      .setActionSource("email");

    const eventsData = [serverEvent_0];
    const eventRequest = new EventRequest(access_token, pixel_id).setEvents(
      eventsData
    );
    console.log(eventRequest.execute());

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
