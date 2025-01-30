import { IapticLoggerVerbosityLevel } from "../types";

export class IapticLogger {

  static VERBOSITY = IapticLoggerVerbosityLevel.WARN;

  verbosity: IapticLoggerVerbosityLevel = IapticLogger.VERBOSITY;

  constructor(verbosity: IapticLoggerVerbosityLevel) {
    this.verbosity = verbosity;
  }

  _message(message: string, severity: IapticLoggerVerbosityLevel) {
    const SEVERITY_EMOJIS = [':❌', ':⚠️', '', ':🐛']; // Error, Warn, Info, Debug
    return `${new Date().toISOString()} [IapticRN${SEVERITY_EMOJIS[severity]}] ${message}`;
  }

  info(message: string) {
    if (this.verbosity >= IapticLoggerVerbosityLevel.INFO)
      console.log(this._message(message, IapticLoggerVerbosityLevel.INFO));
  }

  debug(message: string) {
    if (this.verbosity >= IapticLoggerVerbosityLevel.DEBUG)
      console.log(this._message(message, IapticLoggerVerbosityLevel.DEBUG));
  }

  error(message: string) {
    if (this.verbosity >= IapticLoggerVerbosityLevel.ERROR)
      console.error(this._message(message, IapticLoggerVerbosityLevel.ERROR));
  }

  warn(message: string) {
    if (this.verbosity >= IapticLoggerVerbosityLevel.WARN)
      console.warn(this._message(message, IapticLoggerVerbosityLevel.WARN));
  }
}

export const logger = new IapticLogger(IapticLoggerVerbosityLevel.WARN);