import { IapticVerbosity } from "../types";

/**
 * Iaptic logger
 * 
 * @internal
 */
export class IapticLogger {

  /**
   * Default verbosity level
   */
  static VERBOSITY = IapticVerbosity.WARN;

  verbosity: IapticVerbosity = IapticLogger.VERBOSITY;

  constructor(verbosity: IapticVerbosity) {
    console.log(`IapticLogger constructor with verbosity: ${verbosity}`);
    this.verbosity = verbosity;
  }

  _message(message: string, severity: IapticVerbosity) {
    const SEVERITY_EMOJIS = [':❌', ':🔔', '', ':🐛']; // Error, Warn, Info, Debug
    return `${new Date().toISOString()} [IapticRN${SEVERITY_EMOJIS[severity]}] ${message}`;
  }

  info(message: string) {
    if (this.verbosity >= IapticVerbosity.INFO)
      console.log(this._message(message, IapticVerbosity.INFO));
  }

  debug(message: string) {
    if (this.verbosity >= IapticVerbosity.DEBUG)
      console.log(this._message(message, IapticVerbosity.DEBUG));
  }

  error(message: string) {
    if (this.verbosity >= IapticVerbosity.ERROR)
      console.error(this._message(message, IapticVerbosity.ERROR));
  }

  warn(message: string) {
    if (this.verbosity >= IapticVerbosity.WARN)
      console.warn(this._message(message, IapticVerbosity.WARN));
  }
}

export const logger = new IapticLogger(IapticVerbosity.WARN);