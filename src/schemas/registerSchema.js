import * as yup from "yup";

const registerSchema = yup.object().shape({
  first_name: yup.string().required("Please enter your first name"),
  last_name: yup.string().required("Please enter your last name"),
  username: yup.string().required("Please enter a valid username"),
  password: yup
    .string()
    .min(5, `Password's minimal length must be 5`)
    .max(12, `Password's maximal length must be 12`),
  confirm: yup.string().required("Please confirm your password"),
});

export default registerSchema;
