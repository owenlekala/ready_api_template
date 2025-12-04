import supabase from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';
import logger from '../config/logger';

export interface CreateUserDto {
  email: string;
  name: string;
}

export interface UpdateUserDto {
  email?: string;
  name?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const userService = {
  async getAll(page: number = 1, limit: number = 10): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error({ error }, 'Error fetching users from database');
      throw new Error('Failed to fetch users');
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      users: data || [],
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getById(id: string): Promise<User> {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('User not found');
      }
      logger.error({ error, userId: id }, 'Error fetching user from database');
      throw new Error('Failed to fetch user');
    }

    if (!data) {
      throw new NotFoundError('User not found');
    }

    return data;
  },

  async create(userData: CreateUserDto): Promise<User> {
    // Check if user with email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email)
      .single();

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) {
      logger.error({ error, userData }, 'Error creating user in database');
      throw new Error('Failed to create user');
    }

    if (!data) {
      throw new Error('Failed to create user');
    }

    return data;
  },

  async update(id: string, userData: UpdateUserDto): Promise<User> {
    // Check if user exists
    await this.getById(id);

    // If email is being updated, check for conflicts
    if (userData.email) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .neq('id', id)
        .single();

      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }
    }

    const { data, error } = await supabase
      .from('users')
      .update({ ...userData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error({ error, userId: id, userData }, 'Error updating user in database');
      throw new Error('Failed to update user');
    }

    if (!data) {
      throw new NotFoundError('User not found');
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    // Check if user exists
    await this.getById(id);

    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      logger.error({ error, userId: id }, 'Error deleting user from database');
      throw new Error('Failed to delete user');
    }
  },
};

