import { ConflictException, Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './auth.dto';
import { User, UserDocument } from './auth.model';
import { MailerService } from '@nestjs-modules/mailer'; // For sending email
import { randomBytes } from 'crypto'; // To generate random tokens
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private mailerService: MailerService, // Inject MailerService for sending emails
  ) { }

  // Register method
  async register(authDto: AuthDto): Promise<User> {
    try {
      // Check for existing email or mobile number
      const [existingEmailUser, existingMobileUser] = await Promise.all([
        this.userModel.findOne({ email: authDto.email }),
        this.userModel.findOne({ mobile: authDto.mobile }),
      ]);

      if (existingEmailUser) {
        throw new ConflictException('Email already exists');
      }
      if (existingMobileUser) {
        throw new ConflictException('Mobile number already exists');
      }
      const hashedPassword = await bcrypt.hash(authDto.password, 10);
      const newUser = new this.userModel({
        firstName: authDto.firstName,
        lastName: authDto.lastName,
        email: authDto.email,
        mobile: authDto.mobile,
        password: hashedPassword,
        role: authDto.role,
        status: authDto.status,
        profile: authDto.profile,
        addresses: authDto.addresses,
      });
      return await newUser.save();
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message); // Or whatever exception fits your case
      }
      throw err; // Rethrow other errors
    }
  }

  // Login  method
  async login(authDto: AuthDto): Promise<{ access_token: string; user: Partial<User> }> {
    try {
      // Check if the input is an email or mobile number
      const isEmail = this.validateEmail(authDto.email);
      const user = await this.userModel.findOne(isEmail ? { email: authDto.email } : { mobile: authDto.email });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = await bcrypt.compare(authDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user._id };

      // Create a user object without the password
      const { password, ...userWithoutPassword } = user.toObject();

      return {
        user: userWithoutPassword,
        access_token: this.jwtService.sign(payload),
      };

    } catch (error: any) {
      // Return a custom error response in case of any exception
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Login failed. Please check your credentials and try again.', error.message);
    }
  }

  // Helper function to validate if the input is an email or not
  private validateEmail(input: string): boolean {
    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  }

  // Forgot password method
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    // Generate a reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);

    // Store the hashed token and set an expiration for it (e.g., 1 hour)
    user.resetPasswordToken = resetTokenHash;
    // user.resetPasswordExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour
    user.resetPasswordExpires = new Date(Date.now() + 60000); // Token expires in 1 minute (60,000 ms)

    await user.save();

    // Send an email with the reset link (assuming MailerService is configured)
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Use the following token to reset your password: ${resetToken}`,
    });

    return { message: 'Password reset link sent to your email' };
  }

  // Reset password method
  async resetPassword(resetToken: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid
    });

    if (!user) {
      throw new NotFoundException('Reset token is invalid or has expired');
    }

    // Compare the provided reset token with the hashed token in the database
    if (typeof user.resetPasswordToken === 'string') {
      const isValidToken = await bcrypt.compare(resetToken, user.resetPasswordToken);
      if (!isValidToken) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined; // Clear reset token and expiration
    await user.save();

    return { message: 'Password has been successfully reset' };
  }
}