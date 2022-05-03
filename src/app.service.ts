import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class AppService {
  constructor(private eventEmitter: EventEmitter2) {}

  async getHello() {
    console.clear();

    console.log('Iniciando el proceso');

    const fakeArray = Array.from({ length: 3 });

    let i = 0;
    for (const _ of fakeArray) {
      await this.eventEmitter.emitAsync('order.start-processing', {
        orderId: i++,
        payload: {},
      });
    }

    console.log('Starting bulk events');

    return 'Hello World!';
  }

  @OnEvent('order.start-processing')
  startProcessing(data: any) {
    return this.eventEmitter.emitAsync('order.created', data);
  }

  @OnEvent('order.created')
  async onOrderCreated(data: any) {
    await sleep(2000);

    console.log('order.created', data);

    await this.eventEmitter.emitAsync('order.delivered', data);
  }

  @OnEvent('order.delivered', { async: true, promisify: true })
  async onOrderDelivered(data: any) {
    await sleep(2000);
    console.log('order.delivered', data);

    await this.eventEmitter.emitAsync('order.notified-client', data);
    await this.eventEmitter.emitAsync('order.notified-warehouse-1', data);
    await this.eventEmitter.emitAsync('order.notified-warehouse-2', data);
  }

  @OnEvent('order.notified-client')
  async onOrderNotifiedClient(data: any) {
    await sleep(300);
    console.log('order.notifiedClient', data);
  }

  @OnEvent('order.notified-warehouse-1')
  async onOrderNotifiedWarehouse1(data: any) {
    await sleep(400);
    console.log('order.notified-warehouse 1', data);
  }

  @OnEvent('order.notified-warehouse-2')
  async onOrderNotifiedWarehouse2(data: any) {
    await sleep(500);
    console.log('order.notified-warehouse 2', data);
    console.log('--------');
  }
}
