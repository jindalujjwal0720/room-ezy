import handlebars from 'handlebars';
import fs from 'fs';
import { getPathToAsset } from '../../utils/assets';

const otpVerificationTemplateSrc = fs.readFileSync(
  getPathToAsset('emails/otp-verify.hbs'),
  'utf8'
);
const otpVerificationTemplate = handlebars.compile(otpVerificationTemplateSrc);

const templates = {
  otpVerification: otpVerificationTemplate,
};

export default templates;
