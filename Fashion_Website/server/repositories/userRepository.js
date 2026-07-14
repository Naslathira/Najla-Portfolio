import { getPrisma } from "../db.js"

const publicUser = { id: true, name: true, email: true, picture: true }

export async function upsertGoogleUser(payload) {
  return getPrisma().user.upsert({
    where: { googleId: payload.sub },
    update: { name: payload.name, email: payload.email, picture: payload.picture },
    create: { googleId: payload.sub, name: payload.name, email: payload.email, picture: payload.picture },
    select: publicUser,
  })
}

export async function getUserProfile(userId) {
  return getPrisma().user.findUnique({
    where: { id: userId },
    select: { ...publicUser, bodyProfile: true },
  })
}

export async function saveBodyProfile(userId, profile) {
  return getPrisma().bodyProfile.upsert({
    where: { userId },
    update: profile,
    create: { userId, ...profile },
  })
}
