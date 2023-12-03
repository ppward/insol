let documentData = {};

export const setDocumentData = newData => {
  documentData = newData;
};

export const getDocumentData = () => {
  return documentData;
};
