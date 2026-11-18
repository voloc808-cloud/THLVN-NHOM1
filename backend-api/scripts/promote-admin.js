const mongoose = require('mongoose');
const { getEnv } = require('../src/config/env');
const User = require('../src/modules/user/user.model');
const { email } = require('../src/shared/validation');
async function main() {
  const targetEmail = email(process.argv[2]);
  await mongoose.connect(getEnv().mongoUri);
  const user = await User.findOneAndUpdate(
    { email: targetEmail },
    { $set: { role: 'ADMIN', isLocked: false }, $inc: { tokenVersion: 1 } },
    { returnDocument: 'after' },
  );
  if (!user) throw new Error('Hãy đăng ký tài khoản bằng email này trước.');
  console.log('Đã cấp quyền ADMIN. Vui lòng đăng nhập lại.');
}
main()
  .catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
