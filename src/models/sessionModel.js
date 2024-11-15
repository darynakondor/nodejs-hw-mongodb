import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: {
      type: String,
      ref: 'User',
      required: true
    },
    accessToken: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      required: true
    },
    accessTokenValidUntil: {
      type: Date,
      required: true
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true
    }
});
  
const Session = mongoose.model('Session', sessionSchema);

export default Session;