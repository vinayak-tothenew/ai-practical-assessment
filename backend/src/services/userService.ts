import * as userRepository from "../repositories/userRepository.js";
import type { User } from "../types/index.js";

export function listUsers(): User[] {
  return userRepository.findAllUsers();
}
