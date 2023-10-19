import { ENDPOINT } from "../constants"

const getImage = (photo) => {
  return `${ENDPOINT}upload/${photo}.${photo.name.split(".")[1]}`;
}

const getCategoryImage = (photo) => {
  return `${ENDPOINT}upload/${photo?._id}.${photo?.name.split(".")[1]}`
}

export { getImage, getCategoryImage };