import axios from "axios";
import { writeFile } from "fs";

export default async function (username: string) {
  const avatar = await axios.get(
    `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`
  );
  writeFile(`./public/avatars/${username}.svg`, avatar.data, function (err: any) {
    if (err) throw err;
  });
  return `/avatars/${username}.svg`;
};