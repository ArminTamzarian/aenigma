import * as base64js from 'base64-js';

export class AenigmaUtil {
  public static stringToArrayBuffer(str: string): ArrayBuffer {
    const buffer: ArrayBuffer = new ArrayBuffer(str.length * 2);
    const bufferView: Uint16Array = new Uint16Array(buffer);

    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufferView[i] = str.charCodeAt(i);
    }

    return buffer;
  }

  public static arrayBufferToString(buffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint16Array(buffer));
  }

  public static base64ToArrayBuffer(str: string): ArrayBuffer {
    const array: Uint8Array = base64js.toByteArray(str);
    return array.buffer;
  }

  public static arrayBufferToBase64(buffer: ArrayBuffer): string {
    return base64js.fromByteArray(new Uint8Array(buffer));
  }
}
