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
}
