import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GoogleConnection, GoogleConnectionDocument } from '../../../Models/T_A_Compras/google-connection.schema';

@Injectable()
export class GoogleSheetsService {
  constructor(
    @InjectModel(GoogleConnection.name)
    private googleConnectionModel: Model<GoogleConnectionDocument>,
  ) {}

  async saveConnection(usuarioId: string, email: string, accessToken: string, refreshToken?: string, tokenExpiry?: Date) {
    const existingConnection = await this.googleConnectionModel.findOne({ usuarioId });

    if (existingConnection) {
      existingConnection.accessToken = accessToken;
      if (refreshToken) existingConnection.refreshToken = refreshToken;
      if (tokenExpiry) existingConnection.tokenExpiry = tokenExpiry;
      existingConnection.ultimoAcceso = new Date();
      return existingConnection.save();
    }

    const newConnection = new this.googleConnectionModel({
      usuarioId,
      email,
      accessToken,
      refreshToken,
      tokenExpiry,
      activo: true,
      ultimoAcceso: new Date(),
    });

    return newConnection.save();
  }

  async getConnection(usuarioId: string) {
    const connection = await this.googleConnectionModel.findOne({ usuarioId, activo: true });
    if (!connection) {
      throw new NotFoundException('No hay conexión de Google configurada');
    }
    return connection;
  }

  async isConnected(usuarioId: string): Promise<boolean> {
    const connection = await this.googleConnectionModel.findOne({ usuarioId, activo: true });
    return !!connection;
  }

  async updateToken(usuarioId: string, accessToken: string, refreshToken?: string, tokenExpiry?: Date) {
    const connection = await this.getConnection(usuarioId);
    connection.accessToken = accessToken;
    if (refreshToken) connection.refreshToken = refreshToken;
    if (tokenExpiry) connection.tokenExpiry = tokenExpiry;
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
    const connection = await this.googleConnectionModel.findOne({ usuarioId, activo: true });
    if (!connection) {
      return { connected: false };
    }
    return {
      connected: true,
      email: connection.email,
      ultimoAcceso: connection.ultimoAcceso,
    };
  }
}