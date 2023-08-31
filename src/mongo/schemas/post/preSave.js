import escape from "validator/lib/escape";
import stripLow from "validator/lib/stripLow";

export const authorValidation = {
  validator: function (v) {
    return /^[a-zA-Z0-9]{3,20}$/.test(v);
  },
  message:
    "Incorrect post's author username \"{VALUE}\". The post's author username should be between 3 and 20 alphanumeric characters",
};

export function sanitizeText(v) {
  return stripLow(escape(v));
}
