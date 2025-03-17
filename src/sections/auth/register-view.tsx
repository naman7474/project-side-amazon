"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import FormProvider, { RHFTextField } from "@/libs/components/hook-form";
import Iconify from "@/libs/components/Iconify";
import Logo from "@/libs/components/Logo";
import { useRouter } from "@/libs/routes/hooks";

import { useAuth } from "@/auth/auth-context";
import { paths } from "@/routes/paths";

type FormValuesProps = {
  email: string;
  password: string;
};

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^$|^[6-9]\d{9}$/, "Phone number must be a valid 10 digit number"),
  password: Yup.string().required("Password is required"),
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  company: Yup.string()
    .required("Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must not exceed 100 characters"),
  gst: Yup.string()
    .matches(
      /^$|^[\d]{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
      "GST number is not valid"
    )
    .notRequired(),
});

export default function LoginView() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    email: "",
    phone: "",
    password: "",
    name: "",
    company: "",
    gst: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data: FormValuesProps) => {
      try {
        await register?.(data);
      } catch (error: any) {
        console.error(error);
        reset();
        setErrorMsg(
          typeof error === "string"
            ? error
            : error.message || error.error || error.toString()
        );
      }
    },
    [register, reset]
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(paths.dashboard.root);
    }
  }, [isAuthenticated, router]);

  const renderForm = (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ mt: 6 }}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        <RHFTextField
          name="email"
          label="Email address"
          inputProps={{
            autoComplete: "new-password",
          }}
        />
        <RHFTextField name="phone" label="Phone number" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          inputProps={{
            autoComplete: "new-password",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <RHFTextField name="name" label="Name" />
        <RHFTextField name="company" label="Company" />
        <RHFTextField name="gst" label="GST Number" />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{ mt: 6 }}
        loading={isSubmitting}
      >
        Register Now
      </LoadingButton>
      <Typography sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link
          href={paths.auth.login}
          sx={{
            width: "100%",
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          Login
        </Link>
      </Typography>
    </FormProvider>
  );

  return (
    <>
      <Logo width="auto" height={50} />
      <Typography variant="h3">Get Started for Free!</Typography>
      <Typography variant="body1" sx={{ mt: 0.5 }}>
        No commitment, no credit card required.
      </Typography>

      {renderForm}
    </>
  );
}
