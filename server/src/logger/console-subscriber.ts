import { EventEmitter } from 'events';
import { messagePrefix } from '../services/logger.service';

export class ConsoleSubscriber {
  subscribe(logger: EventEmitter): void {
    logger.on('log', (message: string) => {
      if (message.includes('ERROR')) {
        this.logToConsole(message);
      }
    });
  }

  private logToConsole(message: string): void {
    console.error(messagePrefix + message);
  }
}
