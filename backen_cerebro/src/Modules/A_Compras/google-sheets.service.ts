import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  GoogleConnection,
  GoogleConnectionDocument,
} from '../../Models/T_A_Compras/google-connection.schema';

@Injectable()
export class GoogleSheetsService {
  constructor(
    @InjectModel(GoogleConnection.name)
    private googleConnectionModel: Model<GoogleConnectionDocument>,
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
    const existingConnection = await this.googleConnectionModel.findOne({
      usuarioId,
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
      return existingConnection.save();
    }

    const newConnection = new this.googleConnectionModel({
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

    return newConnection.save();
  }

  async getConnection(usuarioId: string) {
    const connection = await this.googleConnectionModel.findOne({
      usuarioId,
      activo: true,
    });
    if (!connection) {
      throw new NotFoundException('No hay conexión de Google configurada');
    }
    return connection;
  }

  async isConnected(usuarioId: string): Promise<boolean> {
    const connection = await this.googleConnectionModel.findOne({
      usuarioId,
      activo: true,
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
    return connection.save();
  }

  async updateAreas(usuarioId: string, areasAsignadas: string[]) {
    const connection = await this.getConnection(usuarioId);
    connection.areasAsignadas = areasAsignadas;
    connection.ultimoAcceso = new Date();
    return connection.save();
  }

  async deleteConnection(usuarioId: string) {
    const connection = await this.googleConnectionModel.findOne({ usuarioId });
    if (!connection) {
      throw new NotFoundException('No hay conexión de Google para eliminar');
    }
    connection.activo = false;
    return connection.save();
  }

  async getConnectionStatus(usuarioId: string) {
    const connection = await this.googleConnectionModel.findOne({
      usuarioId,
      activo: true,
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
