import { OrderEntity } from '../../advertiser/models/order.entity';

export class PaginatedOrders {
  data:OrderEntity[]
  page:number
  limit:number
  total:number
}