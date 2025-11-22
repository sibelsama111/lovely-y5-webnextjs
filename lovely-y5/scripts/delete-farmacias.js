const admin = require('firebase-admin');
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
admin.initializeApp({projectId:'lovely-y5-webstore'});
const db = admin.firestore();
(async ()=> {
  try {
    const snapshot = await db.collection('farmacias').get();
    if (snapshot.empty) { console.log('No hay documentos en farmacias.'); process.exit(0); }
    for (const doc of snapshot.docs) {
      await db.collection('farmacias').doc(doc.id).delete();
      console.log('Borrado:', doc.id);
    }
    const rem = await db.collection('farmacias').get();
    console.log('Documentos restantes:', rem.size);
    process.exit(0);
  } catch (e) { console.error('Error borrando farmacias:', e); process.exit(2); }
})();
