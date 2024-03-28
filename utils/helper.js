import { supportedMimes } from "../config/fileStystem.js";
import { v4 as uuidv4 } from 'uuid';

export const imageValidator = (size, mime) => {
  if (bytesToMb(size) > 5) {
    return "Image size must be less than 5 mb";
  } else if (!supportedMimes.includes(mime)) {
    return "image must be type of png ,jped ,jpg ,svg,gif..";
  }

  return null


};

export const bytesToMb = (bytes) => {
  return bytes / (1024 * 1024);
};


export const generateRandomNum = () => {
    return uuidv4()
}