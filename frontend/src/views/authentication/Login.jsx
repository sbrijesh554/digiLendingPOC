import React from "react";
import { Formik } from "formik";
import * as EmailValidator from "email-validator";
import * as Yup from "yup";
import Styles from "./css/Login.module.css";
import axios from "axios";

const login = props => (
  <Formik
    initialValues={{ email: "", password: "" }}
    onSubmit={(values, { setSubmitting }) => {
      //   setTimeout(() => {
      //     console.log("Logging in", values);
      //     setSubmitting(false);
      //   }, 500);
      console.log("values--", values);
      axios
        .post("http://localhost:8000/api/auth/login/", {
          email: values.email,
          password: values.password,
          role: values.role
        })
        .then(response => {
          console.log("login resp--", response);
          console.log("user_info ", response.data.details);
          console.log("user active status", response.data.details.active);
          localStorage.setItem(
            "user_info",
            JSON.stringify(response.data.details)
          );
          console.log(JSON.parse(localStorage.getItem("user_info")));

          console.log(JSON.parse(localStorage.getItem("user_info")).active);
          props.history.push("/home");
        })
        .catch(error => {
          console.log(error);
        });
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
      email: Yup.string()
        .email()
        .required("Required"),
      password: Yup.string()
        .required("No password provided.")
        .min(8, "Password is too short - should be 8 chars minimum."),
      // .matches(/(?=.*[0-9])/, "Password must contain a number."),
      role: Yup.string().required("role is required!")
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
          <h1>Login</h1>
          <br></br>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="text"
            placeholder="Enter your email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email && touched.email && Styles.error}
          />
          {errors.email && touched.email && (
            <div className={Styles.inputFeedback}>{errors.email}</div>
          )}
          <label htmlFor="email">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.password && touched.password && Styles.error}
          />
          {errors.password && touched.password && (
            <div className={Styles.inputFeedback}>{errors.password}</div>
          )}

          <label htmlFor="email" style={{ display: "block" }}>
            Role
          </label>
          <select
            name="role"
            value={values.role}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ display: "block" }}
          >
            <option value="" label="Select a role" />
            <option value="operation" label="operation" />
            <option value="partner" label="parnter" />
            <option value="sales" label="sales" />
          </select>
          <br></br>
          {errors.role && touched.role && (
            <div className={Styles.inputFeedback}>{errors.role}</div>
          )}

          <button type="submit" disabled={isSubmitting}>
            Login
          </button>
        </form>
      );
    }}
  </Formik>
);

export default login;
