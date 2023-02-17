import mongoose from 'mongoose';
import {createSchema} from '../db';

const schema = createSchema({
  email: String,
  code: String,
  time: Number,
});

schema.index({email: 1});

export default mongoose.model('Mail', schema);
