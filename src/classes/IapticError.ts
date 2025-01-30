import { IapticErrorCode } from "../types";
import * as IAP from "react-native-iap";
import { Locales } from "./Locales";

/**
 * Error severity
 * 
 * - INFO: The error is not critical and can be ignored, not worth reporting to the user, can be logged to your server or ignored.
 * - WARNING: The error is important and can be reported to the user as a toast message.
 * - ERROR: The error is critical and should be reported to the user as a pop-up alert.
 */
export enum IapticErrorSeverity {
  INFO = 0,
  WARNING = 1,
  ERROR = 2,
}

export function toIapticErrorCode(code: IAP.ErrorCode | undefined): IapticErrorCode {
  if (!code) {
    return IapticErrorCode.UNKNOWN;
  }
  switch (code) {
    case IAP.ErrorCode.E_UNKNOWN:
      return IapticErrorCode.UNKNOWN;
    case IAP.ErrorCode.E_USER_CANCELLED:
      return IapticErrorCode.PAYMENT_CANCELLED;
    case IAP.ErrorCode.E_ITEM_UNAVAILABLE:
      return IapticErrorCode.PRODUCT_NOT_AVAILABLE;
    case IAP.ErrorCode.E_NETWORK_ERROR:
      return IapticErrorCode.COMMUNICATION;
    case IAP.ErrorCode.E_SERVICE_ERROR:
      return IapticErrorCode.COMMUNICATION;
    case IAP.ErrorCode.E_RECEIPT_FAILED:
      return IapticErrorCode.LOAD_RECEIPTS;
    case IAP.ErrorCode.E_NOT_PREPARED:
      return IapticErrorCode.SETUP;
    case IAP.ErrorCode.E_DEVELOPER_ERROR:
      return IapticErrorCode.CLIENT_INVALID;
    case IAP.ErrorCode.E_ALREADY_OWNED:
      return IapticErrorCode.PAYMENT_INVALID;
    case IAP.ErrorCode.E_DEFERRED_PAYMENT:
      return IapticErrorCode.PAYMENT_NOT_ALLOWED;
    case IAP.ErrorCode.E_USER_ERROR:
      return IapticErrorCode.PAYMENT_NOT_ALLOWED;
    case IAP.ErrorCode.E_REMOTE_ERROR:
      return IapticErrorCode.COMMUNICATION;
    case IAP.ErrorCode.E_RECEIPT_FINISHED_FAILED:
      return IapticErrorCode.FINISH;
    case IAP.ErrorCode.E_NOT_ENDED:
      return IapticErrorCode.FINISH;
    case IAP.ErrorCode.E_BILLING_RESPONSE_JSON_PARSE_ERROR:
      return IapticErrorCode.BAD_RESPONSE;
    case IAP.ErrorCode.E_INTERRUPTED:
      return IapticErrorCode.COMMUNICATION;
    case IAP.ErrorCode.E_IAP_NOT_AVAILABLE:
      return IapticErrorCode.SUBSCRIPTIONS_NOT_AVAILABLE;
    default:
      return IapticErrorCode.UNKNOWN;
  }
}

export function toIapticError(err: IAP.PurchaseError | Error, severity: IapticErrorSeverity, defaultCode: IapticErrorCode = IapticErrorCode.UNKNOWN, extraDebugMessage: string = ''): IapticError {
  if (err instanceof IAP.PurchaseError) {
    return new IapticError(err.message, {
      severity,
      code: toIapticErrorCode(err.code),
      localizedTitle: Locales.get('PurchaseError_title', ['' + err.code]),
      localizedMessage: Locales.get(`PurchaseError_${err.code ?? 'E_UNKNOWN'}`),
      debugMessage: [err.debugMessage, extraDebugMessage].filter(x => !!x).join(" | "),
      status: err.responseCode,
    });
  }
  return new IapticError(err.message, {
    severity,
    code: defaultCode,
    localizedTitle: Locales.get('UnknownError_title'),
    localizedMessage: Locales.get(`UnknownError`) + " " + err.message,
    debugMessage: extraDebugMessage,
    status: 0,
  });
}

/**
 * Represents an error in the Iaptic purchase flow
 * 
 * @example Handling errors
 * ```typescript
 * try {
 *   await iaptic.order(productOffer);
 * } catch (error) {
 *   if (error instanceof IapticError) {
 *     trackAnalyticsEvent(error.code);
 *     if (error.severity === IapticErrorSeverity.INFO) {
 *       console.log('Info:', error.localizedMessage);
 *       return;
 *     }
 *     Alert.alert(error.localizedTitle, error.localizedMessage);
 *   } else {
 *     Alert.alert('Unknown error', error.message);
 *   }
 * }
 * ```
 */
export class IapticError extends Error {
  public readonly severity: IapticErrorSeverity;
  public readonly code: IapticErrorCode;
  public readonly localizedTitle: string;
  public readonly localizedMessage: string;
  public readonly debugMessage: string;
  public readonly status: number | undefined;
  constructor(message: string, options: {
    severity: IapticErrorSeverity,
    code: IapticErrorCode,
    localizedTitle: string,
    localizedMessage: string,
    debugMessage: string,
    status?: number,
  }) {
    super(message);
    this.name = 'IapticError';
    this.severity = options.severity;
    this.code = options.code;
    this.localizedMessage = options.localizedMessage;
    this.localizedTitle = options.localizedTitle;
    this.debugMessage = options.debugMessage;
    this.status = options.status;
  }
}
