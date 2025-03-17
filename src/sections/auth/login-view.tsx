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

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: Yup.string().required("Password is required"),
});

export default function LoginView() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
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
        await login?.(data.email, data.password);
      } catch (error: any) {
        console.error(error);
        setErrorMsg(
          typeof error === "string"
            ? error
            : error.message || error.error || error.toString()
        );
      }
    },
    [login, reset]
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
          InputLabelProps={{ shrink: true }}
        />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputLabelProps={{ shrink: true }}
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
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        sx={{ mt: 6 }}
        loading={isSubmitting}
      >
        Login
      </LoadingButton>

      <Typography sx={{ mt: 2 }}>
        Don&#39;t have an account?{" "}
        <Link
          href={paths.auth.register}
          sx={{
            width: "100%",
            textDecoration: "none",
            textAlign: "center",
          }}
        >
          Register Now
        </Link>
      </Typography>
    </FormProvider>
  );

  return (
    <>
      <Logo width="auto" height={50} />
      <Typography variant="h3">Welcome Back!</Typography>
      <Typography variant="body1" sx={{ mt: 0.5 }}>
        Login to your account
      </Typography>

      {renderForm}
    </>
  );
}
