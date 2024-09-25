// src/auth/auth.service.ts
import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'users/users.entity';
import { AuthDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  return otp;
};

const validateEmail = (input: string | undefined): boolean => {
  if (!input) return false; // If input is undefined, return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

// Dummy functions to simulate sending OTP via email or SMS
const sendOtpEmail = async (email: string, otp: string) => {
  console.log(`Sending OTP ${otp} to email: ${email}`);
  // Implement actual email sending logic here
};

const sendOtpSms = async (mobile: string, otp: string) => {
  console.log(`Sending OTP ${otp} to mobile: ${mobile}`);
  // Implement actual SMS sending logic here
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly JwtService: JwtService, // Inject JwtService
    // private readonly mailerService: MailerService, // If used
  ) { }

  async register(authDto: AuthDto): Promise<{ message: string }> {
    // Check if the email or mobile already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email: authDto.email }, { mobile: authDto.mobile }],
    });

    if (existingUser) {
      throw new BadRequestException('Email or mobile number already exists');
    }
    // Create new user instance
    const newUser = this.userRepository.create({
      ...authDto
    });

    await this.userRepository.save(newUser); // Save the new user

    return { message: 'User registered successfully' };
  }

  // Send OTP for verification
  async verifyOtp(authDto: AuthDto): Promise<{ message: string }> {
    if (!authDto.email && !authDto.mobile) {
      throw new BadRequestException('Either email or mobile number must be provided.');
    }

    const isEmail = validateEmail(authDto.email);
    const user = await this.userRepository.findOne({
      where: isEmail ? { email: authDto.email } : { mobile: authDto.mobile },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Hash OTP and save
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = otpExpires;
    await this.userRepository.save(user); // Save the updated user

    // Send OTP
    isEmail ? await sendOtpEmail(user.email, otp) : await sendOtpSms(user.mobile, otp);

    return { message: 'OTP sent successfully' };
  }

  // Login user with OTP
  async login(authDto: AuthDto): Promise<{ access_token: string; user: Partial<User> }> {
    if (!authDto.email && !authDto.mobile) {
      throw new BadRequestException('Either email or mobile number must be provided.');
    }

    const isEmail = validateEmail(authDto.email);
    const user = await this.userRepository.findOne({
      where: isEmail ? { email: authDto.email } : { mobile: authDto.mobile },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check OTP validity
    if (!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    if (!authDto.otp) {
      throw new UnauthorizedException('OTP must be provided.');
    }

    // Verify OTP
    const isOtpValid = await bcrypt.compare(authDto.otp, user.otp);
    if (!isOtpValid) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Clear OTP after successful login
    user.otp = undefined;
    user.otpExpires = undefined;
    await this.userRepository.save(user); // Save the updated user
    const payload = { email: user.email, id: user.id }; // You can add other properties as needed
    return {
      user: { id: user.id, email: user.email }, // Return user details
      access_token: this.JwtService.sign(payload),
    };
  }
}
