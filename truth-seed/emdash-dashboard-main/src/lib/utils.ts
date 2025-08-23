import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random password with the given length. The password will contain 
 * at least one letter, one digit, and one special character (from a defined set).
 * 
 * Conditions:
 *  - Length must be at least 10
 *  - Contains at least one letter: /[A-Za-z]/
 *  - Contains at least one digit: /[0-9]/
 *  - Contains at least one special character: /[^A-Za-z0-9]/
 * 
 * If a generated password does not meet these conditions, the function will 
 * regenerate automatically until it does.
 * 
 * @param length - The desired length of the password (default is 10).
 * @returns A random password string satisfying the specified constraints.
 */
export function generateRandomPassword(length = 10) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const specials = "!@#$%^&*()_+[]{}|;:,.<>/?~-=";

  const allChars = letters + digits + specials;

  let passwordArray = [
    letters[Math.floor(Math.random() * letters.length)],
    digits[Math.floor(Math.random() * digits.length)],
    specials[Math.floor(Math.random() * specials.length)],
  ];

  for (let i = 3; i < length; i++) {
    const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
    passwordArray.push(randomChar);
  }

  // 배열을 섞어서 난수성을 높임 (Fisher–Yates Shuffle)
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  const password = passwordArray.join("");

  if (
    password.length >= 10 &&
    /[A-Za-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  ) {
    return password;
  } else {
    return generateRandomPassword(length);
  }
}

/**
 * 필요한 EXP를 구해주는 함수: f(x)
 * x가 "지금 올라가려는 레벨"이라고 생각
 */
export function requiredExpForLevel(level: number): number {
  return Math.floor((Math.log10(0.1 * level + 0.3) + 1) * 100)
}

/**
 * userExp를 바탕으로 현재 레벨을 역으로 계산
 * 매우 직관적이지만, 레벨이 큰 경우 순차 반복이라 비효율적일 수 있음
 */
export function getLevelFromExp(userExp: number) {
  let level = 0
  let accumulated = 0

  while (true) {
    const needed = requiredExpForLevel(level + 1)
    if (accumulated + needed <= userExp) {
      accumulated += needed
      level++
    } else {
      break
    }
  }

  // level 변수는 0부터 시작하므로, 실제 레벨은 level + 1
  return { level: level + 1, exp: userExp - accumulated }
}
