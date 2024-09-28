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
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { sendOtp, validateOtp } from 'src/store/action/authActions';
import { useDispatch } from 'react-redux';

// Validation schema for the form
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
  const dispatch = useDispatch();

  const [errorMsg, setErrorMsg] = useState('');
  const [otpSent, setOtpSent] = useState(false);
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
    watch,
  } = methods;

  const email = watch('email'); // Watch the email field

  const handleSendOtp = async () => {
    if (!email) return; // Ensure email is provided
    setIsOtpSending(true); // Set loading state
    try {
      await dispatch(sendOtp({ email }));
      setOtpSent(true); // Mark OTP as sent
      setErrorMsg(''); // Clear any existing error messages
    } catch (err) {
      setErrorMsg('Failed to send OTP');
    } finally {
      setIsOtpSending(false); // Reset loading state
    }
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(validateOtp(data.email, data.otp));
      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to validate OTP');
    }
  };

  return (
    <>
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

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods}>
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
              onClick={handleSendOtp}
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
              onClick={handleSubmit(onSubmit)} // Use handleSubmit for form submission
              loading={isSubmitting}
              loadingIndicator="Signing in..."
            >
              Sign in
            </LoadingButton>
          )}
        </Stack>
      </Form>
    </>
  );
}
