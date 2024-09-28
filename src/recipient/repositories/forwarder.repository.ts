import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ForwarderEntity } from '../entities/forwarder.entity';

@Injectable()
@EntityRepository(ForwarderEntity)
export class ForwarderRepository extends Repository<ForwarderEntity>{

}