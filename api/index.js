// api/index.js
export default async (req, res) => {
  try {
    // ระวังเรื่อง Path: ต้องชี้ไปที่ไฟล์ server ที่ build เสร็จแล้ว
    const server = await import('../dist/public-health-middle/server/main.server.mjs');
    return server.reqHandler(req, res);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).send('Internal Server Error');
  }
};