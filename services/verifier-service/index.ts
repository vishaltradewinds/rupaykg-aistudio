export const initVerifierService = () => console.log('Verifier Service Init');
export const verifyDocument = (docId: string, verifierId: string) => {
  console.log(`Document ${docId} verified by ${verifierId}`);
};
