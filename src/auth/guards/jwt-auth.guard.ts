import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// Usa la estrategia 'jwt'
export class JwtAuthGuard extends AuthGuard('jwt') {}
