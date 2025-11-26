// utils/swmanager.ts
import crypto from "crypto";

/**
 * Deriva y recorta una secretWord
 * @param secretWord Palabra secreta original
 * @param length Cantidad de caracteres deseada (default: 12)
 * @returns Clave derivada recortada
 * 
 */
export function deriveSecretWord(secretWord: string, length: number = 12): string {
  const fullHashBuffer = crypto.createHash("sha256")
    .update(secretWord)
    .digest();

  // Convertir a Base64 y recortar
  return fullHashBuffer.toString("base64").slice(0, length);
}