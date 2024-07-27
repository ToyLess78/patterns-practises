import * as fs from 'fs';
import { FileSubscriber } from '../logger/file-subscriber';
import { ConsoleSubscriber } from '../logger/console-subscriber';
import { logger } from '../logger/logger';

export const logFilePath = './src/logger/log.txt';
export const messagePrefix = new Date().toISOString() + ' - ';

export const loggerInitialization = () => {
  try {
    const successMessage = messagePrefix + 'File log.txt was successfully created or opened for writing';
    fs.writeFileSync(logFilePath, successMessage + '\n', {flag: 'a'});
    console.log(successMessage);
  } catch (error: any) {
    const errorMessage = messagePrefix + 'Error creating or opening log.txt file';
    console.error(errorMessage + ':', error.message);
  }
};

export const fileSubscriber = new FileSubscriber(logFilePath);
export const consoleSubscriber = new ConsoleSubscriber();

export const logOperation = (eventName: string, start: number): void => {
  const end = performance.now();
  const executionTime = end - start;
  const logMessage = `Operation ${eventName} took ${executionTime} ms`;
  logger.log(logMessage);
};
