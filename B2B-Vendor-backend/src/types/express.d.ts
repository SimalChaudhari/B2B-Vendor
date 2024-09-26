
import { User } from 'users/users.entity';

declare global {
    namespace Express {
        interface Request {
            user?: User; // Add the user property with the appropriate type
        }
    }
}
