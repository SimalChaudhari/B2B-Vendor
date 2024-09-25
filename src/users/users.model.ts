import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  mobile: string; // Added mobile field

  @Prop({ enum: ['Active', 'Suspended'], default: 'Active' })
  status: 'Active' | 'Suspended'; // Added status field

  @Prop({ enum: ['Admin', 'Customer', 'Vendor'], default: 'Customer' })
  role: 'Customer' | 'Vendor'; // Added role field

  @Prop({ default: null })
  profile: string; // Added mobile field

  @Prop({ required: true })
  country: string;

  @Prop()
  otp?: string;

  @Prop()
  otpExpires?: Date;

  @Prop({
    type: [{
      address: String,
      city: String,
      state: String,
      pinCode: String,
    }],
    default: [],
  })
  addresses: {
    address: string;
    city: string;
    state: string;
    pinCode: string;
  }[];

  constructor(email: string, mobile: string, firstName: string, lastName: string, profile: string,country: string,otp:string,otpExpires:Date) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.mobile = mobile;
    this.profile = profile;
    this.country = country;
    this.status = 'Active'; // Default status
    this.role = 'Customer'; // Default role
    this.addresses = []; // Default to empty array
    this.otp = otp;
    this.otpExpires = otpExpires;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
