import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EmailStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  SYNCING = 'syncing',
}

export enum SecurityType {
  SSL_TLS = 'ssl',
  STARTTLS = 'starttls',
  NONE = 'none',
}

@Entity('email_configs')
export class EmailConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  usuario_id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  displayName: string;

  @Column()
  passwordEmail: string;

  @Column({ default: 'bh8966.banahosting.com' })
  imapHost: string;

  @Column({ default: 993 })
  imapPort: number;

  @Column({ default: true })
  imapSecure: boolean;

  @Column({ type: 'enum', enum: SecurityType, default: SecurityType.SSL_TLS })
  imapSecurity: SecurityType;

  @Column({ default: 'bh8966.banahosting.com' })
  smtpHost: string;

  @Column({ default: 465 })
  smtpPort: number;

  @Column({ default: true })
  smtpSecure: boolean;

  @Column({ type: 'enum', enum: SecurityType, default: SecurityType.SSL_TLS })
  smtpSecurity: SecurityType;

  @Column({ type: 'enum', enum: EmailStatus, default: EmailStatus.INACTIVE })
  status: EmailStatus;

  @Column({ nullable: true })
  lastSync: Date;

  @Column({ nullable: true })
  lastError: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ default: true })
  autoSync: boolean;

  @Column({ default: 300 })
  syncInterval: number;

  @Column({ default: 'INBOX' })
  defaultFolder: string;

  @Column({ default: 500 })
  messagesPerSync: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
