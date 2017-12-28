import * as base64js from 'base64-js';

/**
 *  Utility class for internal aenigma data management
 */
export class AenigmaUtil {
  /**
   * Convert a Javascript `string` to an `ArrayBuffer` representation
   *
   * @param str string to convert
   *
   * @return `ArrayBuffer` representation of the provided string
   */
  public static stringToArrayBuffer(str: string): ArrayBuffer {
    const buffer: ArrayBuffer = new ArrayBuffer(str.length * 2);
    const bufferView: Uint16Array = new Uint16Array(buffer);

    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufferView[i] = str.charCodeAt(i);
    }

    return buffer;
  }

  /**
   * Convert an `ArrayBuffer` object to a Javascript `string` representation
   *
   * @param buffer `ArrayBuffer` to convert
   *
   * @return Javascript `string` representation of the provided `ArrayBuffer`
   */
  public static arrayBufferToString(buffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint16Array(buffer));
  }

  /**
   * Convert a Base64 Javascript `string` to an `ArrayBuffer` representation
   *
   * @param str Base64 string to convert
   *
   * @return `ArrayBuffer` representation of the provided Base64 string
   */
  public static base64ToArrayBuffer(str: string): ArrayBuffer {
    const array: Uint8Array = base64js.toByteArray(str);
    return array.buffer;
  }

  /**
   * Convert an `ArrayBuffer` object to a Base64 Javascript `string` representation
   *
   * @param buffer `ArrayBuffer` to convert
   *
   * @return Base64 Javascript `string` representation of the provided `ArrayBuffer`
   */
  public static arrayBufferToBase64(buffer: ArrayBuffer): string {
    return base64js.fromByteArray(new Uint8Array(buffer));
  }
}
