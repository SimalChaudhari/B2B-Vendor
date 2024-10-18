// src/auth/auth.service.ts
import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'users/user/users.entity';
import { AuthDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';

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

  async register(authDto: AuthDto, file?: Express.Multer.File): Promise<{ message: string, user: User }> {
    try {
      // Check if the email or mobile already exists
      const existingUser = await this.userRepository.findOne({
        where: [{ email: authDto.email }, { mobile: authDto.mobile }],
      });

      if (existingUser) {
        throw new BadRequestException('Email or Mobile number already exists');
      }

      // Handle file upload if a file is provided
      let profileImagePath: string | undefined = undefined;
      if (file) {
        const uploadPath = path.join(__dirname, '..', '..', 'src', 'uploads', file.originalname);
        fs.writeFileSync(uploadPath, file.buffer); // Save the file synchronously
        profileImagePath = uploadPath; // Assign the image path
      }

      // Create a new user instance
      const newUser = this.userRepository.create({
        ...authDto,
        ...(profileImagePath && { profile: profileImagePath }), // Conditionally add profile if the file is uploaded
      });
      await this.userRepository.save(newUser); // Save the new user
      return {
        message: 'User registered successfully',
        user: newUser,
      };

    } catch (err: unknown) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message);
      }
      throw err;

    }
  }

  // Send OTP for verification
  async verifyOtp(authDto: AuthDto): Promise<{ message: string }> {
    try {

      const contact = authDto.contact;
      if (!contact) {
        throw new BadRequestException('Either email or mobile number must be provided.');
      }

      const isEmail = validateEmail(contact);
      const whereCondition = isEmail
        ? { email: contact, isDeleted: false }
        : { mobile: contact, isDeleted: false };

      // Find the user based on the constructed where condition
      const user = await this.userRepository.findOne({ where: whereCondition });
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

    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('OTP failed. Please check your credentials and try again.', error.message);
    }
  };

  // Login user with OTP
  async login(authDto: AuthDto): Promise<{ message: string, access_token: string; user: Partial<User> }> {

    try {

      const contact = authDto.contact;
      if (!contact) {
        throw new BadRequestException('Either email or mobile number must be provided.');
      }
      const isEmail = validateEmail(contact);
      const whereCondition = isEmail
        ? { email: contact, isDeleted: false }
        : { mobile: contact, isDeleted: false };

      // Find the user based on the constructed where condition
      const user = await this.userRepository.findOne({ where: whereCondition });


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
      user.otp = null;
      user.otpExpires = null;
      await this.userRepository.save(user); // Save the updated user
      const payload = { email: user.email, id: user.id, role: user.role }; // You can add other properties as needed

      // Exclude otp and otpExpires from the returned user
      const { otp, otpExpires, isDeleted, ...userWithoutOtp } = user;

      return {
        message: 'User Logged in successfully',
        user: userWithoutOtp,
        access_token: this.JwtService.sign(payload)
      }
    } catch (error: any) {
      // Return a custom error response in case of any exception
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Login failed. Please check your credentials and try again.', error.message);
    }
  }
}