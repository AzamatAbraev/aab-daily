import { ENDPOINT } from "../constants"

const getImage = (photo) => {
  return `${ENDPOINT}upload/${photo}.${photo.name.split(".")[1]}`;
}

export default getImage;