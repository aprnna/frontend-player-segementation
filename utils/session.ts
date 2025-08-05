import { getServerSession } from "next-auth";
import { AuthOptions } from "./authOptions";
export default async function getSessionUser() {
  const session =  await getServerSession(AuthOptions);
  
  if (!session?.user) return null;
  const userData = session?.user;

  return userData;
}