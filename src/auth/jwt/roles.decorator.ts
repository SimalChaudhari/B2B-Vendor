import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/users.dto'; // Adjust path as necessary

export const Roles = (...role: UserRole[]) => SetMetadata('role', role);
