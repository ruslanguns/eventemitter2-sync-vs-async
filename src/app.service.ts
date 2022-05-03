import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class AppService {
  notificationProcess = 0;

  constructor(private eventEmitter: EventEmitter2) {}

  async getHello() {
    console.clear();
    Logger.verbose('Iniciando el proceso');

    const fakeArray = Array.from({ length: 2 });

    let i = 0;
    for (const _ of fakeArray) {
      i += 1;
      await this.eventEmitter.emitAsync('order.start-processing', {
        orderId: i,
        payload: {},
      });
    }

    Logger.verbose('Starting bulk events');

    return 'Hello World!';
  }

  @OnEvent('order.start-processing')
  async startProcessing(data: any) {
    await sleep(1000);

    Logger.verbose('order.start-processing ' + data.orderId);

    return await this.eventEmitter.emitAsync('order.created', data);
  }

  @OnEvent('order.created')
  async onOrderCreated(data: any) {
    await sleep(1000);

    Logger.verbose('order.created ' + data.orderId);

    await this.eventEmitter.emitAsync('order.delivered', data);
  }

  @OnEvent('order.delivered')
  async onOrderDelivered(data: any) {
    await sleep(1000);
    Logger.verbose('order.delivered ' + data.orderId);

    await this.eventEmitter.emitAsync('order.notification', data);
  }

  @OnEvent('*.notification', { async: true })
  async onOrderNotifiedClient(data: any) {
    this.notificationProcess++;

    Logger.verbose(
      `order.notifying-client No #${this.notificationProcess} ` + data.orderId,
    );

    return new Promise<void>(async (resolve) => {
      const fakeArray = Array.from({ length: 3 });

      for await (const _ of fakeArray) {
        await sleep(1000);
        Logger.verbose('Sending... ' + data.orderId);
      }

      await this.eventEmitter.emitAsync(`notification.sent`, data);

      resolve();
    });
  }

  @OnEvent('*.notification')
  async onOrderNotifiedWarehouse1(data: any) {
    await sleep(2000);

    Logger.verbose('order.notified-warehouse-1 ' + data.orderId);
  }

  @OnEvent('*.notification')
  async onOrderNotifiedWarehouse2(data: any) {
    await sleep(2000);

    Logger.verbose('order.notified-warehouse-2 ' + data.orderId);
  }

  @OnEvent('notification.sent')
  async onOrderNotifiedWarehouse3(data: any) {
    await sleep(5000);

    Logger.verbose(`order.notification DLR` + data.orderId);
    Logger.verbose('-------------------------------------');
  }
}
