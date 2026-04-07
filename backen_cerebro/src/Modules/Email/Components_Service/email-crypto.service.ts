import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EmailCryptoService {
  // ==========================================
  // ENCRIPTAR CONTRASEÑA
  // ==========================================
  encryptPassword(password: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(
      process.env.EMAIL_ENCRYPTION_KEY || 'default_encryption_key_32',
      'salt',
      32,
    );
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  // ==========================================
  // DESENCRIPTAR CONTRASEÑA
  // ==========================================
  decryptPassword(encrypted: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(
      process.env.EMAIL_ENCRYPTION_KEY || 'default_encryption_key_32',
      'salt',
      32,
    );
    const [ivHex, encryptedHex] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
