console.log("------------");

const buffer = new ArrayBuffer(8); // 256-byte ArrayBuffer.

const dv = new DataView(buffer);

// SET

dv.setUint8(0, 5);
dv.setUint16(1, 30000);
dv.setUint8(3, 8);

console.log(buffer);
console.log(dv);
console.log(dv.byteLength / 4);

console.log(dv.getUint8(0));
console.log(dv.getUint16(1));
console.log(dv.getUint8(3));
