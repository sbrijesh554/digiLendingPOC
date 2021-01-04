import React from "react";
import { Formik } from "formik";
import * as EmailValidator from "email-validator";
import * as Yup from "yup";
import Styles from "./css/Login.module.css";
import axios from "axios";
// import { Router, Route, Link } from 'react-router-dom';
// import Login from './Login'
// import { hashHistory } from 'react-router;'
import { useHistory } from "react-router-dom";

function PasswordReset(props) {
  let history = useHistory();

  const userActiveStatus = e => {
    axios
      .patch("http://localhost:8000/api/auth/user/changeStatus/", {
        user_id: JSON.parse(localStorage.getItem("user_info")).id
      })
      .then(response => {
        console.log("active statuse", response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Formik
      initialValues={{ password1: "", password2: "" }}
      onSubmit={(values, { setSubmitting }) => {
        //   setTimeout(() => {
        //     console.log("Logging in", values);
        //     setSubmitting(false);
        //   }, 500);
        console.log("values--", values);

        if (values.password1 !== values.password2) {
          alert("password not matches");
        } else {
          axios
            .patch("http://localhost:8000/api/auth/passwordReset/", {
              email: JSON.parse(localStorage.getItem("user_info")).email, //will get replace with jwt token
              password1: values.password1,
              password2: values.password2
            })
            .then(response => {
              console.log("password reset resp--", response);
              console.log(response.data.details[0].active);
              if (response.data.details[0].active === false) {
                console.log("when false");
                userActiveStatus();
                history.push("/login");
              } else {
                console.log("when true");
                history.push("/login");
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      }}
      //********Handling validation messages yourself*******/
      // validate={values => {
      //   let errors = {};
      //   if (!values.email) {
      //     errors.email = "Required";
      //   } else if (!EmailValidator.validate(values.email)) {
      //     errors.email = "Invalid email address";
      //   }

      //   const passwordRegex = /(?=.*[0-9])/;
      //   if (!values.password) {
      //     errors.password = "Required";
      //   } else if (values.password.length < 8) {
      //     errors.password = "Password must be 8 characters long.";
      //   } else if (!passwordRegex.test(values.password)) {
      //     errors.password = "Invalida password. Must contain one number";
      //   }

      //   return errors;
      // }}
      //********Using Yum for validation********/

      validationSchema={Yup.object().shape({
        password1: Yup.string()
          .required("No password provided.")
          .min(8, "Password is too short - should be 8 chars minimum."),
        // .matches(/(?=.*[0-9])/, "Password must contain a number."),
        password2: Yup.string()
          .required("No password provided.")
          .min(8, "Password is too short - should be 8 chars minimum.")
        // .matches(/(?=.*[0-9])/, "Password must contain a number.")
      })}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit
        } = props;
        return (
          <form onSubmit={handleSubmit}>
            <h1>Password Reset</h1>
            <br></br>
            <label htmlFor="email">Password</label>
            <input
              name="password1"
              type="password"
              placeholder="Enter your new password"
              value={values.password1}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.password && touched.password && Styles.error}
            />
            {errors.password1 && touched.password1 && (
              <div className={Styles.inputFeedback}>{errors.password1}</div>
            )}
            <label htmlFor="email">Confirm Password</label>
            <input
              name="password2"
              type="password"
              placeholder="Enter new password again"
              value={values.password2}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.password2 && touched.password2 && Styles.error}
            />
            {errors.password2 && touched.password2 && (
              <div className={Styles.inputFeedback}>{errors.password2}</div>
            )}

            <button type="submit" disabled={isSubmitting}>
              Reset
            </button>
          </form>
        );
      }}
    </Formik>
  );
}

export default PasswordReset;
