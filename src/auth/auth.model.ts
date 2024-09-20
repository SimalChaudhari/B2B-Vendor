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
  mobile: number; // Added mobile field

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['Active', 'Suspended'], default: 'Active' })
  status: 'Active' | 'Suspended'; // Added status field

  @Prop({ enum: ['Admin', 'Customer', 'Vendor'], default: 'Customer' })
  role: 'Customer' | 'Vendor'; // Added role field

  @Prop({ default: null })
  profile: string; // Added mobile field

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  @Prop({
    type: [{
      street: String,
      city: String,
      state: String,
      pinCode: String,
    }],
    default: [],
  })
  addresses: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  }[];

  constructor(email: string, mobile: number, password: string, firstName: string, lastName: string, profile: string,resetPasswordToken:string,resetPasswordExpires:Date) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.mobile = mobile;
    this.password = password;
    this.profile = profile;
    this.status = 'Active'; // Default status
    this.role = 'Customer' // Default role
    this.addresses = []; // Default to empty array
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpires = resetPasswordExpires;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
