import { Schema, model } from "mongoose";

// Define message interface
interface IMessage {
  username: string;
  avatar: string;
  message: string;
  room: string;
  __createdtime__: Date;
}

// Define schema
const messageSchema = new Schema<IMessage>({
  username: {
    type: String,
    required: true,
    maxlength: 50,
  },
  avatar: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: true,
    maxlength: 500,
  },
  room: {
    type: String,
    required: true,
    maxlength: 50,
  },
  __createdtime__: {
    type: Date,
    default: Date.now(),
  },
});

// Create model
const MessageModel = model("Message", messageSchema);
export default MessageModel;
