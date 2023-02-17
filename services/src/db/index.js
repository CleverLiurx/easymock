import mongoose from 'mongoose';
import {MONGODB_CONNECT_KEY} from '../config';

const {Schema} = mongoose;

const defaultOption = {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated',
  },
};

mongoose.connect(MONGODB_CONNECT_KEY);

export const db = mongoose.connection;

db.once('open', () => {
  console.log(`Database ${db.name} is connected successfully`);
});

export const createSchema = (fields, options = {}) => {
  return new Schema(fields, {...defaultOption, ...options});
};
