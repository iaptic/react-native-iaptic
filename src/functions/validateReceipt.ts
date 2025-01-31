import { IapticError, IapticErrorSeverity } from "../classes/IapticError";
import { Locales } from "../classes/Locales";
import { IapticStoreConfig, IapticErrorCode, IapticProduct, IapticValidateRequest, IapticValidateRequestTransaction, IapticValidateResponse, IapticValidationData } from "../types";
import { Platform } from "react-native";
import { encode } from 'base-64';

/**
* Gets the authorization header for API requests
* @returns The Basic auth header string
*/
function getAuthHeader(config: IapticStoreConfig): string {
  const auth = encode(`${config.appName}:${config.publicKey}`);
  return `Basic ${auth}`;
}

/** Internal function to validate a receipt */
export async function validateReceipt(data: IapticValidationData, products: IapticProduct[], config: IapticStoreConfig): Promise<IapticValidateResponse> {
  const os = Platform.OS;

  const id = os === 'android' ? data.productId : config.iosBundleId ?? data.productId;
  const type = id === data.productId ? data.productType : 'application';

  let transaction: IapticValidateRequestTransaction;
  if (os === 'android') {
    transaction = {
      id: data.transactionId,
      type: 'android-playstore',
      purchaseToken: JSON.parse(data.receipt).purchaseToken,
      receipt: data.receipt,
      signature: data.receiptSignature,
    }
  }
  else if (os === 'ios') {
    transaction = {
      id: data.transactionId,
      type: 'ios-appstore',
      appStoreReceipt: data.receipt
    }
  }
  else {
    throw new IapticError('Unsupported platform', {
      severity: IapticErrorSeverity.ERROR,
      localizedTitle: Locales.get(`ValidationError`),
      localizedMessage: Locales.get(`IapticError_UnsupportedPlatform`),
      debugMessage: 'Unsupported platform',
      code: IapticErrorCode.UNKNOWN,
    });
  }

  const request: IapticValidateRequest = {
    id,
    type,
    transaction,
    products,
  };

  if (data.applicationUsername) {
    request.additionalData = {
      applicationUsername: data.applicationUsername
    };
  }

  try {
    const response = await fetch(`${config.baseUrl}/v1/validate`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(config),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new IapticError(response.statusText, {
        severity: IapticErrorSeverity.ERROR,
        localizedTitle: Locales.get(`ValidationError`),
        localizedMessage: Locales.get(`IapticError_${IapticErrorCode.COMMUNICATION}`),
        debugMessage: response.statusText,
        code: IapticErrorCode.COMMUNICATION,
        status: response.status
      });
    }

    let data: IapticValidateResponse;
    try {
      data = await response.json();
    } catch (error) {
      throw new IapticError('Failed to parse response', {
        severity: IapticErrorSeverity.ERROR,
        localizedTitle: Locales.get(`ValidationError`),
        localizedMessage: Locales.get(`IapticError_${IapticErrorCode.BAD_RESPONSE}`, [], 'Failed to parse response'),
        debugMessage: 'Failed to parse response',
        code: IapticErrorCode.BAD_RESPONSE,
        status: response.status
      });
    }

    if (!data.ok) {
      if (data.code === IapticErrorCode.VALIDATOR_SUBSCRIPTION_EXPIRED) {
        return {
          ok: true,
          data: {
            id,
            collection: [],
            ineligible_for_intro_price: [],
            latest_receipt: true,
            transaction: {},
            date: new Date().toISOString(),
          }
        }
      }
      throw new IapticError(data.message ?? 'Receipt validation failed', {
        severity: IapticErrorSeverity.ERROR,
        localizedTitle: Locales.get(`ValidationError`),
        localizedMessage: Locales.get(`IapticError_${data.code ?? IapticErrorCode.UNKNOWN}`, [], data.message ?? ''),
        debugMessage: data.message ?? '',
        code: data.code ?? IapticErrorCode.UNKNOWN,
        status: data.status ?? 0,
      });
    }

    if (data?.data?.collection) {
      data.data.collection.forEach(product => {
        // Add the more user-friendly productId property
        product.productId = product.id;
      });
    }

    return data;
  } catch (error: any) {
    let errorMessage = 'Receipt validation failed';
    if (error.response?.status === 401) {
      errorMessage = 'Authentication failed. Please check your iaptic configuration.';
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid purchase data. Please check the receipt format.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    const code: IapticErrorCode = error.response?.data?.code ?? error.code ?? IapticErrorCode.UNKNOWN;
    throw new IapticError(errorMessage,
      {
        severity: IapticErrorSeverity.ERROR,
        localizedTitle: Locales.get(`ValidationError`),
        localizedMessage: Locales.get(`IapticError_${code}`, [], error.message),
        debugMessage: error.message,
        code,
        status: error.status ?? error.response?.status ?? 0
      }
    );
  }
}