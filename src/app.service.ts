import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class AppService {
  constructor(private eventEmitter: EventEmitter2) {}

  async setOrder() {
    console.clear();
    Logger.log('Bootstraping...');
    Logger.warn('Starting bulk order processing');

    const fakeArray = Array.from({ length: 2 });

    let i = 0;
    for (const _ of fakeArray) {
      i = i + 1;
      console.warn(`----Process No ${i} Started ----`);

      await this.eventEmitter.emitAsync('order.start-processing', {
        orderId: i,
        payload: {},
      });

      console.warn(`----Process No ${i} Finished ----`);
    }

    Logger.log('ALL PROCESSES ARE COMPLETED');

    return 'Hello World!';
  }

  @OnEvent('order.start-processing')
  async startProcessing(data: any) {
    await sleep(500);

    Logger.verbose('order.start-processing ' + `OR#${data.orderId}`);

    return await this.eventEmitter.emitAsync('order.created', data);
  }

  @OnEvent('order.created')
  async onOrderCreated(data: any) {
    await sleep(500);

    Logger.verbose('order.created ' + `OR#${data.orderId}`);

    await this.eventEmitter.emitAsync('order.delivered', data);
  }

  @OnEvent('order.delivered')
  async onOrderDelivered(data: any) {
    await sleep(1000);
    Logger.verbose(
      'order.delivered sending 2 notifications ' + `OR#${data.orderId}`,
    );

    await this.eventEmitter.emitAsync('order.notification', {
      ...data,
      pid: 1,
    });
    await this.eventEmitter.emitAsync('order.notification', {
      ...data,
      pid: 2,
    });
  }

  @OnEvent('*.notification')
  async onOrderNotifiedClient(data: any) {
    Logger.log(
      `order.notifying-client ` + `OR#${data.orderId}` + ` PID: ${data.pid}`,
    );
    const fakeArray = Array.from({ length: 3 });

    for await (const _ of fakeArray) {
      await sleep(1000);
      Logger.debug(
        'Sending to client...' + ` OR#${data.orderId}` + ` PID: ${data.pid}`,
      );
    }

    await this.eventEmitter.emitAsync(`notification.sent`, data);
  }

  @OnEvent('*.notification')
  async onOrderNotifiedWarehouse1(data: any) {
    await sleep(1000);

    Logger.verbose(
      'order.notified-warehouse-1 ' +
        `OR#${data.orderId}` +
        ` PID: ${data.pid}`,
    );
  }

  @OnEvent('*.notification')
  async onOrderNotifiedWarehouse2(data: any) {
    await sleep(1000);

    Logger.verbose(
      'order.notified-warehouse-2 ' +
        `OR#${data.orderId}` +
        ` PID: ${data.pid}`,
    );
  }

  @OnEvent('notification.sent')
  async onOrderNotifiedWarehouse3(data: any) {
    await sleep(500);

    Logger.debug(
      `Notification sent to client` +
        ` OR#${data.orderId}` +
        ` PID: ${data.pid}`,
    );
    Logger.debug('-------------------------------------');
  }
}
