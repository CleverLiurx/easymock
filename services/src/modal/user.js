import mongoose from 'mongoose';
import {createSchema} from '../db';

const schema = createSchema({
  name: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    required: true,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
});

schema.index({email: 1});

export default mongoose.model('User', schema);
