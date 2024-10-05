import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AccountEntity, Role } from '../../entities/account.entity';
import { AuthRequestDto } from './dto/request.dto';

@Injectable()
export class AuthService {
  skipTime: boolean = true;

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AccountEntity)
    private readonly repositoryAccount: Repository<AccountEntity>,
  ) {}
  async hashPassword(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }
  async login(username: string, password: string): Promise<any> {
    const account = await this.repositoryAccount.findOne({
      where: { username: username },
    });
    if (!account)
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    if (
      !bcrypt.compareSync(password, account.password) ||
      account.deletedAt != null
    )
      throw new HttpException(
        'Account info is not valid',
        HttpStatus.BAD_REQUEST,
      );
    return this.generateToken({
      id: account.id,
      username: account.username,
      phone: account.phone,
      role: account.role,
    });
  }
  async register(data: AuthRequestDto.RegisterDataDto): Promise<any> {
    // check username is exist
    const account = await this.repositoryAccount.findOne({
      where: { username: data.username },
    });
    if (account)
      throw new HttpException('Username is exist', HttpStatus.BAD_REQUEST);
    data.password = await this.hashPassword(data.password);
    const result = await this.repositoryAccount.save(data);
    result.password = undefined;
    return result;
  }
  async generateToken(
    payload: AuthRequestDto.PayloadTokenDto,
  ): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
  async verifyToken(token: string): Promise<boolean> {
    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }
    const decodedToken = await this.decodeToken(token);
    if (
      decodedToken.username &&
      (this.skipTime ? true : decodedToken.exp < Date.now())
    ) {
      const account = await this.repositoryAccount.findOne({
        where: { username: decodedToken.username },
      });
      if (
        account.username === decodedToken.username &&
        account.deletedAt == null
      ) {
        return true;
      }
    }
  }
  async verifyStaffToken(token: string): Promise<boolean> {
    if (!token)
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    const decodedToken = await this.decodeToken(token);
    if (
      decodedToken.username &&
      (this.skipTime ? true : decodedToken.exp < Date.now())
    ) {
      const account = await this.repositoryAccount.findOne({
        where: { username: decodedToken.username },
      });
      if (
        account.username === decodedToken.username &&
        account.role === Role.staff &&
        account.deletedAt == null
      )
        return true;
    }
    return false;
  }
  async verifyHeadStaffToken(token: string): Promise<boolean> {
    if (!token)
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    const decodedToken = await this.decodeToken(token);
    if (
      decodedToken.username &&
      (this.skipTime ? true : decodedToken.exp < Date.now())
    ) {
      const account = await this.repositoryAccount.findOne({
        where: { username: decodedToken.username },
      });
      if (
        account.username === decodedToken.username &&
        account.role === Role.headstaff &&
        account.deletedAt == null
      )
        return true;
    }
    return false;
  }
  async verifyHeadToken(token: string): Promise<boolean> {
    if (!token)
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    const decodedToken = await this.decodeToken(token);
    if (
      decodedToken.username &&
      (this.skipTime ? true : decodedToken.exp < Date.now())
    ) {
      const account = await this.repositoryAccount.findOne({
        where: { username: decodedToken.username },
      });
      if (
        account.username === decodedToken.username &&
        account.role === Role.head &&
        account.deletedAt == null
      )
        return true;
    }
    return false;
  }
  async verifyStockkeeperToken(token: string): Promise<boolean> {
    if (!token)
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    const decodedToken = await this.decodeToken(token);
    if (
      decodedToken.username &&
      (this.skipTime ? true : decodedToken.exp < Date.now())
    ) {
      const account = await this.repositoryAccount.findOne({
        where: { username: decodedToken.username },
      });
      if (
        account.username === decodedToken.username &&
        account.role === Role.stockkeeper &&
        account.deletedAt == null
      )
        return true;
    }
    return false;
  }
  async verifyManagerToken(token: string): Promise<boolean> {
    if (!token)
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    const decodedToken = await this.decodeToken(token);
    if (
      decodedToken.username &&
      (this.skipTime ? true : decodedToken.exp < Date.now())
    ) {
      const account = await this.repositoryAccount.findOne({
        where: { username: decodedToken.username },
      });
      if (
        account.username === decodedToken.username &&
        account.role === Role.manager &&
        account.deletedAt == null
      )
        return true;
    }
    return false;
  }
  async verifyAdminToken(token: string): Promise<boolean> {
    if (!token)
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    const decodedToken = await this.decodeToken(token);
    if (
      decodedToken.username &&
      (this.skipTime ? true : decodedToken.exp < Date.now())
    ) {
      const account = await this.repositoryAccount.findOne({
        where: { username: decodedToken.username },
      });
      if (
        account.username === decodedToken.username &&
        account.role === Role.admin &&
        account.deletedAt == null
      )
        return true;
    }
    return false;
  }
  async decodeToken(token: string): Promise<AuthRequestDto.PayloadTokenDto> {
    return await this.jwtService.verifyAsync(token);
  }
  // ! features for admin
  async getAllAccounts(): Promise<any> {
    // get all accounts without password
    return this.repositoryAccount.find({
      select: [
        'id',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'username',
        'username',
        'phone',
        'role',
      ],
    });
  }
  async softDeleteAccount(id: string): Promise<any> {
    // block admin account to delete another admin account
    const account = await this.repositoryAccount.findOne({ where: { id: id } });
    if (!account)
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    if (account?.role === 'admin') {
      throw new HttpException(
        "Admin account can't delete another admin account",
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.repositoryAccount.update(id, { deletedAt: new Date() });
  }
  async undoDeleteAccount(id: string): Promise<any> {
    return await this.repositoryAccount.update(id, { deletedAt: null });
  }
  // ! features for user
  getAccount(id: string): Promise<any> {
    return this.repositoryAccount.findOne({
      where: { id: id },
      select: [
        'id',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'username',
        'phone',
        'role',
      ],
    });
  }
  async changePassword(
    id: string,
    newPassword: AuthRequestDto.PasswordDto,
  ): Promise<any> {
    const salt = bcrypt.genSaltSync(10);
    newPassword.value = bcrypt.hashSync(newPassword.value, salt);
    return this.repositoryAccount.update(id, { password: newPassword.value });
  }
  async changePhoneNumber(
    id: string,
    newPhone: AuthRequestDto.PhoneDto,
  ): Promise<any> {
    return this.repositoryAccount.update(id, {
      phone: newPhone.value,
    });
  }

  // ! features for head staffs

  async getAllStaffs(): Promise<any> {
    return this.repositoryAccount.find({
      where: { role: Role.staff },
      select: [
        'id',
        'createdAt',
        'updatedAt',
        'deletedAt',
        'username',
        'phone',
        'role',
      ],
    });
  }
}
