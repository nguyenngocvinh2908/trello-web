// Biểu thức chính quy kiểm tra định dạng Email và Mật khẩu
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Invalid email. (Example: example@gmail.com)'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'The password must be at least 8 characters long and include both letters and numbers.'
export const FIELD_REQUIRED_MESSAGE = 'This field is require.'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Password confirmation does not match!'
