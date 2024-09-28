import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Form, Field } from 'src/components/hook-form';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

// Mock API call for sending OTP
async function sendOtpToEmail(email) {
  // This should call the backend to send OTP
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

// Mock API call for validating OTP
async function validateOtp(email, otp) {
  // This should call the backend to validate the OTP
  return new Promise((resolve, reject) => {
    if (otp === '123456') resolve();
    else reject(new Error('Invalid OTP'));
  });
}

// ----------------------------------------------------------------------

export const SignInSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  otp: zod
    .string()
    .min(1, { message: 'OTP is required!' })
    .length(6, { message: 'OTP must be exactly 6 characters!' }),
});

export function JwtSignInView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const { checkUserSession } = useAuthContext();

  const [errorMsg, setErrorMsg] = useState('');
  const [otpSent, setOtpSent] = useState(false); // New state to manage OTP flow
  const [isOtpSending, setIsOtpSending] = useState(false);

  const defaultValues = {
    email: '',
    otp: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setError, // Used to programmatically set error messages
    watch,
  } = methods;

  const email = watch('email'); // Watch email field

  const handleSendOtp = handleSubmit(async ({ Email }) => {
    setIsOtpSending(true);
    try {
      await sendOtpToEmail(Email);
      setOtpSent(true); // OTP sent successfully
      setErrorMsg(''); // Clear any existing error messages
    } catch (error) {
      setErrorMsg('Failed to send OTP');
    } finally {
      setIsOtpSending(false);
    }
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await validateOtp(data.email, data.otp);
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      setErrorMsg(error instanceof Error ? error.message : error);
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">Sign in with OTP</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`Don't have an account?`}
        </Typography>

        <Link component={RouterLink} href={paths.auth.jwt.signUp} variant="subtitle2">
          Get started
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      {/* Email Field */}
      <Field.Text
        name="email"
        label="Email address"
        InputLabelProps={{ shrink: true }}
        disabled={otpSent} // Disable email field once OTP is sent
      />

      {/* Send OTP button */}
      {!otpSent && (
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          variant="contained"
          onClick={handleSendOtp} // Ensure email is validated before sending OTP
          loading={isOtpSending}
        >
          Send OTP
        </LoadingButton>
      )}

      {/* OTP Field */}
      {otpSent && (
        <Field.Text
          name="otp"
          label="Enter OTP"
          InputLabelProps={{ shrink: true }}
        />
      )}

      {/* Submit Button */}
      {otpSent && (
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          onClick={onSubmit}
          loading={isSubmitting}
          loadingIndicator="Signing in..."
        >
          Sign in
        </LoadingButton>
      )}
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods}>{renderForm}</Form>
    </>
  );
}
