import { EventEmitter } from 'events';
import * as fs from 'fs';
import { messagePrefix } from '../services/logger.service';

export class FileSubscriber {
  private logFilePath: string;

  constructor(logFilePath: string) {
    this.logFilePath = logFilePath;
  }

  subscribe(logger: EventEmitter): void {
    logger.on('log', (message: string) => {
      this.writeToFile(message);
    });
  }

  private writeToFile(message: string): void {
    try {
      fs.writeFileSync(this.logFilePath, messagePrefix + message + '\n', {flag: 'a'});
    } catch (error: any) {
      console.error('Error writing to file:', messagePrefix + error.message);
    }
  }
}
