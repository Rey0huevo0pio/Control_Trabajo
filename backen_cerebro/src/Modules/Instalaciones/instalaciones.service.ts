import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Instalacion, AreaInstalacion } from '../../Models/T_Instalaciones';
import {
  CreateInstalacionDto,
  UpdateInstalacionDto,
  CreateAreaInstalacionDto,
  UpdateAreaInstalacionDto,
} from './dto/instalacion.dto';

@Injectable()
export class InstalacionesService {
  constructor(
    @InjectModel(Instalacion.name) private instalacionModel: Model<Instalacion>,
    @InjectModel(AreaInstalacion.name)
    private areaModel: Model<AreaInstalacion>,
  ) {}

  // ==================== INSTALACIONES ====================

  async createInstalacion(
    createDto: CreateInstalacionDto,
  ): Promise<Instalacion> {
    try {
      const instalacion = new this.instalacionModel({
        ...createDto,
        creado_por: new Types.ObjectId(createDto.creado_por),
        personal_asignado: createDto.personal_asignado?.map(
          (id) => new Types.ObjectId(id),
        ),
      });
      return await instalacion.save();
    } catch (error: any) {
      throw new BadRequestException(
        `Error al crear instalación: ${error.message}`,
      );
    }
  }

  async findAllInstalaciones(): Promise<Instalacion[]> {
    return await this.instalacionModel
      .find()
      .populate('creado_por personal_asignado');
  }

  async findOneInstalacion(id: string): Promise<Instalacion> {
    const instalacion = await this.instalacionModel
      .findById(id)
      .populate('creado_por personal_asignado');
    if (!instalacion) {
      throw new NotFoundException(`Instalación con ID ${id} no encontrada`);
    }
    return instalacion;
  }

  async updateInstalacion(
    id: string,
    updateDto: UpdateInstalacionDto,
  ): Promise<Instalacion> {
    const instalacion = await this.instalacionModel.findByIdAndUpdate(
      id,
      updateDto,
      { new: true, runValidators: true },
    );
    if (!instalacion) {
      throw new NotFoundException(`Instalación con ID ${id} no encontrada`);
    }
    return instalacion;
  }

  async deleteInstalacion(id: string): Promise<void> {
    const result = await this.instalacionModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Instalación con ID ${id} no encontrada`);
    }
  }

  async findActivas(): Promise<Instalacion[]> {
    return await this.instalacionModel
      .find({ activa: true })
      .populate('creado_por personal_asignado');
  }

  // ==================== ÁREAS DE INSTALACIÓN ====================

  async createAreaInstalacion(
    createDto: CreateAreaInstalacionDto,
  ): Promise<AreaInstalacion> {
    try {
      const area = new this.areaModel({
        ...createDto,
        id_instalacion: new Types.ObjectId(createDto.id_instalacion),
        creado_por: new Types.ObjectId(createDto.creado_por),
      });
      return await area.save();
    } catch (error: any) {
      throw new BadRequestException(`Error al crear área: ${error.message}`);
    }
  }

  async findAllAreas(): Promise<AreaInstalacion[]> {
    return await this.areaModel.find().populate('creado_por id_instalacion');
  }

  async findOneArea(id: string): Promise<AreaInstalacion> {
    const area = await this.areaModel
      .findById(id)
      .populate('creado_por id_instalacion');
    if (!area) {
      throw new NotFoundException(`Área con ID ${id} no encontrada`);
    }
    return area;
  }

  async updateArea(
    id: string,
    updateDto: UpdateAreaInstalacionDto,
  ): Promise<AreaInstalacion> {
    const area = await this.areaModel.findByIdAndUpdate(id, updateDto, {
      new: true,
      runValidators: true,
    });
    if (!area) {
      throw new NotFoundException(`Área con ID ${id} no encontrada`);
    }
    return area;
  }

  async deleteArea(id: string): Promise<void> {
    const result = await this.areaModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Área con ID ${id} no encontrada`);
    }
  }

  async findAreasByInstalacion(
    instalacionId: string,
  ): Promise<AreaInstalacion[]> {
    return await this.areaModel.find({
      id_instalacion: new Types.ObjectId(instalacionId),
    });
  }
}
