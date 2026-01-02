import { useState } from "react";
import styles from "./Login.module.css";
import { NavLink, useActionData } from "react-router-dom";
import { Form, useNavigation } from "react-router-dom";

function Login() {
  const message = useActionData();
  const navigation = useNavigation();
  const loading = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.loginContainer}>
      <NavLink to="/" className={styles.homeLink}>
        &larr; Back to Home
      </NavLink>
      <div className={styles.loginCard}>
        {message && message.formerror && (
          <div className={styles.errorMessage}>{message.formerror}</div>
        )}
        <div className={styles.loginHeader}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        <Form method="POST" action="/admin/login" className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                className={styles.input}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
