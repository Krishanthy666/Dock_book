export const SENSITIVE_PATTERNS = {
  creditCard: /\b(?:\d[ -]*?){13,19}\b/,
  phoneNumber: /\b(?:\+?94|0)?[1-9]\d{8}\b|\b(?:\+?\d{1,3}[- ]?)?\(?\d{2,4}\)?[- ]?\d{3,4}[- ]?\d{4}\b/
};

export const hasSensitiveData = (text) => {
  if (!text) return false;
  return SENSITIVE_PATTERNS.creditCard.test(text) || SENSITIVE_PATTERNS.phoneNumber.test(text);
};

export const getSensitiveDataWarning = (text) => {
  if (!text) return null;
  if (SENSITIVE_PATTERNS.creditCard.test(text)) {
    return "Potential credit card/payment details detected. For security reasons, please do not share billing details.";
  }
  if (SENSITIVE_PATTERNS.phoneNumber.test(text)) {
    return "Potential phone number/contact info detected. For privacy reasons, please do not share personal contact details.";
  }
  return null;
};
