import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleConnection } from '../../Models/PG/google-connection.entity';

@Injectable()
export class GoogleSheetsService {
  constructor(
    @InjectRepository(GoogleConnection)
    private googleConnectionRepo: Repository<GoogleConnection>,
  ) {}

  async saveConnection(
    usuarioId: string,
    email: string,
    accessToken: string,
    refreshToken?: string,
    tokenExpiry?: Date,
    nombre?: string,
    scope?: string,
    areasAsignadas?: string[],
  ) {
    const existingConnection = await this.googleConnectionRepo.findOne({
      where: { usuarioId },
    });

    if (existingConnection) {
      existingConnection.email = email;
      existingConnection.accessToken = accessToken;
      if (refreshToken) existingConnection.refreshToken = refreshToken;
      if (tokenExpiry) existingConnection.tokenExpiry = tokenExpiry;
      if (nombre) existingConnection.nombre = nombre;
      if (scope) existingConnection.scope = scope;
      if (areasAsignadas) existingConnection.areasAsignadas = areasAsignadas;
      existingConnection.activo = true;
      existingConnection.ultimoAcceso = new Date();
      return this.googleConnectionRepo.save(existingConnection);
    }

    const newConnection = this.googleConnectionRepo.create({
      usuarioId,
      email,
      accessToken,
      refreshToken,
      tokenExpiry,
      nombre: nombre || email.split('@')[0],
      scope: scope || 'compras',
      areasAsignadas: areasAsignadas || [],
      activo: true,
      ultimoAcceso: new Date(),
    });

    return this.googleConnectionRepo.save(newConnection);
  }

  async getConnection(usuarioId: string) {
    const connection = await this.googleConnectionRepo.findOne({
      where: { usuarioId, activo: true },
    });
    if (!connection) {
      throw new NotFoundException('No hay conexión de Google configurada');
    }
    return connection;
  }

  async isConnected(usuarioId: string): Promise<boolean> {
    const connection = await this.googleConnectionRepo.findOne({
      where: { usuarioId, activo: true },
    });
    return !!connection;
  }

  async updateToken(
    usuarioId: string,
    accessToken: string,
    refreshToken?: string,
    tokenExpiry?: Date,
  ) {
    const connection = await this.getConnection(usuarioId);
    connection.accessToken = accessToken;
    if (refreshToken) connection.refreshToken = refreshToken;
    if (tokenExpiry) connection.tokenExpiry = tokenExpiry;
    connection.ultimoAcceso = new Date();
    return this.googleConnectionRepo.save(connection);
  }

  async updateAreas(usuarioId: string, areasAsignadas: string[]) {
    const connection = await this.getConnection(usuarioId);
    connection.areasAsignadas = areasAsignadas;
    connection.ultimoAcceso = new Date();
    return this.googleConnectionRepo.save(connection);
  }

  async deleteConnection(usuarioId: string) {
    const connection = await this.googleConnectionRepo.findOne({
      where: { usuarioId },
    });
    if (!connection) {
      throw new NotFoundException('No hay conexión de Google para eliminar');
    }
    connection.activo = false;
    return this.googleConnectionRepo.save(connection);
  }

  async getConnectionStatus(usuarioId: string) {
    const connection = await this.googleConnectionRepo.findOne({
      where: { usuarioId, activo: true },
    });
    if (!connection) {
      return { connected: false };
    }
    return {
      connected: true,
      email: connection.email,
      nombre: connection.nombre,
      accessToken: connection.accessToken,
      scope: connection.scope,
      areasAsignadas: connection.areasAsignadas,
      ultimoAcceso: connection.ultimoAcceso,
    };
  }
}
