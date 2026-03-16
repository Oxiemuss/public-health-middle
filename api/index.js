// api/index.js
export default async (req, res) => {
  // ชี้ไปที่ไฟล์ server ที่ Angular build ออกมา 
  // (ตรวจสอบชื่อโฟลเดอร์ใน dist ของคุณด้วยนะครับ)
  const server = await import('../dist/public-health-middle/server/main.server.mjs');
  return server.reqHandler(req, res);
};