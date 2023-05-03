import * as argon2 from 'argon2';

export async function hashData(data: string): Promise<string> {
  const hashedData = await argon2.hash(data);
  return hashedData;
}
