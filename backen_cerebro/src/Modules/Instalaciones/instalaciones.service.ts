import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instalacion } from '../../Models/PG/instalacion.entity';
import { AreaInstalacion } from '../../Models/PG/area-instalacion.entity';
import {
  CreateInstalacionDto,
  UpdateInstalacionDto,
  CreateAreaInstalacionDto,
  UpdateAreaInstalacionDto,
} from './dto/instalacion.dto';

@Injectable()
export class InstalacionesService {
  constructor(
    @InjectRepository(Instalacion)
    private instalacionRepo: Repository<Instalacion>,
    @InjectRepository(AreaInstalacion)
    private areaRepo: Repository<AreaInstalacion>,
  ) {}

  async createInstalacion(dto: CreateInstalacionDto): Promise<Instalacion> {
    try {
      const inst = this.instalacionRepo.create({
        nombre_instalacion: dto.nombre_instalacion,
        nombre_registrador: dto.nombre_registrador,
        descripcion: dto.descripcion,
        foto: dto.foto,
        responsable: dto.responsable,
        personal_asignado: dto.personal_asignado ?? [],
        activa: dto.activa ?? true,
        creado_por: dto.creado_por,
        direccion: dto.ubicacion?.direccion ?? '',
        lat: dto.ubicacion?.coordenadas?.lat,
        lng: dto.ubicacion?.coordenadas?.lng,
      });
      return this.instalacionRepo.save(inst);
    } catch (e: any) {
      throw new BadRequestException(`Error al crear instalación: ${e.message}`);
    }
  }

  async findAllInstalaciones(): Promise<Instalacion[]> {
    return this.instalacionRepo.find({
      relations: ['areas'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneInstalacion(id: string): Promise<Instalacion> {
    const inst = await this.instalacionRepo.findOne({
      where: { id },
      relations: ['areas'],
    });
    if (!inst) throw new NotFoundException(`Instalación ${id} no encontrada`);
    return inst;
  }

  async updateInstalacion(
    id: string,
    dto: UpdateInstalacionDto,
  ): Promise<Instalacion> {
    const update: Partial<Instalacion> = {
      nombre_instalacion: dto.nombre_instalacion,
      nombre_registrador: dto.nombre_registrador,
      descripcion: dto.descripcion,
      foto: dto.foto,
      responsable: dto.responsable,
      personal_asignado: dto.personal_asignado,
      activa: dto.activa,
      direccion: dto.ubicacion?.direccion,
      lat: dto.ubicacion?.coordenadas?.lat,
      lng: dto.ubicacion?.coordenadas?.lng,
    };
    // quitar undefined
    Object.keys(update).forEach(
      (k) => update[k] === undefined && delete update[k],
    );
    await this.instalacionRepo.update(id, update);
    return this.findOneInstalacion(id);
  }

  async deleteInstalacion(id: string): Promise<void> {
    const r = await this.instalacionRepo.delete(id);
    if (!r.affected)
      throw new NotFoundException(`Instalación ${id} no encontrada`);
  }

  async findActivas(): Promise<Instalacion[]> {
    return this.instalacionRepo.find({
      where: { activa: true },
      relations: ['areas'],
    });
  }

  async createAreaInstalacion(
    dto: CreateAreaInstalacionDto,
  ): Promise<AreaInstalacion> {
    try {
      const area = this.areaRepo.create(dto);
      return this.areaRepo.save(area);
    } catch (e: any) {
      throw new BadRequestException(`Error al crear área: ${e.message}`);
    }
  }

  async findAllAreas(): Promise<AreaInstalacion[]> {
    return this.areaRepo.find({ relations: ['instalacion'] });
  }

  async findOneArea(id: string): Promise<AreaInstalacion> {
    const area = await this.areaRepo.findOne({
      where: { id },
      relations: ['instalacion'],
    });
    if (!area) throw new NotFoundException(`Área ${id} no encontrada`);
    return area;
  }

  async updateArea(
    id: string,
    dto: UpdateAreaInstalacionDto,
  ): Promise<AreaInstalacion> {
    await this.areaRepo.update(id, dto);
    return this.findOneArea(id);
  }

  async deleteArea(id: string): Promise<void> {
    const r = await this.areaRepo.delete(id);
    if (!r.affected) throw new NotFoundException(`Área ${id} no encontrada`);
  }

  async findAreasByInstalacion(
    instalacionId: string,
  ): Promise<AreaInstalacion[]> {
    return this.areaRepo.find({ where: { id_instalacion: instalacionId } });
  }
}
