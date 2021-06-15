import * as Yup from 'yup';
import moment from 'moment'
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;


export const SignInSchema = Yup.object().shape({
    email: Yup.string().email('Email Không Hợp Lệ').required('Vui Lòng Điền Đầy Đủ.'),
    password: Yup.string()
        .min(6, 'Mật Khẩu Quá Ngắn !')
        .max(50, 'Mật Khẩu Quá Dài !')
        .required('Vui Lòng Điền Đầy Đủ')
});

export const SignUpSchema = Yup.object().shape({
    email: Yup.string().email('Email Không Hợp Lệ').required('Vui Lòng Điền Đầy Đủ.'),
    phoneNumber: Yup.string().matches(phoneRegExp, 'Số Điện Thoại Không Phù Hợp').required('Vui Lòng Điền Đầy Đủ.'),
    password: Yup.string()
        .min(6, 'Mật Khẩu Quá Ngắn !')
        .max(50, 'Mật Khẩu Quá Dài !')
        .required('Vui Lòng Điền Đầy Đủ'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Mật Khẩu Phải Khớp Nhau.'),
    displayName: Yup.string().required('Vui Lòng Điền Đầy Đủ'),
    birthDay: Yup.date().test(
        "DOB",
        "Hãy Chắc Chắn Bạn Trên 18 Tuổi.",
        value => {
            return moment().diff(moment(value), 'years') >= 18;
        }
    ),
    sex: Yup.string().required("Vui Lòng Chọn.")

})
export const RecoveryPassword = Yup.object().shape({
    emailRecovery: Yup.string().email('Email Không Hợp Lệ').required('Vui Lòng Điền Đầy Đủ.'),
});