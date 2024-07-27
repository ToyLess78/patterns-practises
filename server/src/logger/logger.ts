import { EventEmitter } from 'events';

class Logger extends EventEmitter {
  log(message: string): void {
    this.emit('log', message);
  }
}

export const logger = new Logger();
